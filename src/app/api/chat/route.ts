// src/app/api/chat/route.ts
// Uses the Google Gemini API (free tier - no credit card required).
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/profile";
import type { ChatMessage, ChatRequestBody } from "@/types/chat";

const MAX_MESSAGES = 20; // simple abuse guard
const MAX_CHARS = 1000; // per message

// Free-tier models: gemini-2.5-flash (10 req/min) or
// gemini-2.5-flash-lite (15 req/min, slightly lower quality).
const MODEL = "gemini-3.6-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const isDev = process.env.NODE_ENV !== "production";

/** In dev, pass the real reason back to the browser so it's debuggable. */
function fail(message: string, status: number, detail?: string) {
  return NextResponse.json(
    { error: message, ...(isDev && detail ? { detail } : {}) },
    { status }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return fail("Messages array is required", 400);
    }

    if (messages.length > MAX_MESSAGES) {
      return fail("Conversation too long. Please refresh the chat.", 400);
    }

    const clean = messages
      .filter(
        (m): m is ChatMessage =>
          (m?.role === "user" || m?.role === "assistant") &&
          typeof m?.content === "string" &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        // Gemini calls the assistant "model", not "assistant".
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content.slice(0, MAX_CHARS) }],
      }));

    if (clean.length === 0) return fail("No valid messages", 400);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        "[chat] GEMINI_API_KEY is missing. Add it to .env.local and restart `npm run dev`."
      );
      return fail(
        "The assistant isn't configured yet.",
        500,
        "GEMINI_API_KEY is not set. Add it to .env.local and restart the dev server."
      );
    }

    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: clean,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      }),
    });

    if (!res.ok) {
      const raw = await res.text();
      console.error(`[chat] Gemini API ${res.status}:`, raw);

      let detail = raw;
      try {
        detail = JSON.parse(raw)?.error?.message ?? raw;
      } catch {
        /* keep raw text */
      }

      const message =
        res.status === 400 || res.status === 403
          ? "The assistant isn't configured correctly."
          : res.status === 429
          ? "Busy right now - try again in a minute."
          : "Couldn't get a response. Please try again.";

      return fail(message, 502, `${res.status}: ${detail}`);
    }

    const data = await res.json();

    const reply: string =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim() || "I couldn't generate a response. Try rephrasing that.";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] route error:", err);
    return fail(
      "Something went wrong.",
      500,
      err instanceof Error ? err.message : String(err)
    );
  }
}