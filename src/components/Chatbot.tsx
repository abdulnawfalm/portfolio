"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { profile, type Resume } from "@/lib/profile";
import type { ChatMessage } from "@/types/chat";

// Matches the site cursor. Kept as an inline style, not a Tailwind arbitrary
// value, so it renders regardless of how the JIT handles commas in the class.
const BRAND_GRADIENT =
  "linear-gradient(225deg, #E0218A 0%, #8A4FD8 50%, #38A8F0 100%)";

const STARTER_QUESTIONS = [
  "What tools do you use?",
  "Are you open to relocation?",
  "Walk me through your process",
  "Can I see your resume?",
];


/** Strips the light markdown the model emits: `code`, **bold**, * bullets. */
function tidy(line: string) {
  return line
    .replace(/`/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .trim();
}

/** Turns bare URLs, /file.pdf paths and emails inside a reply into real links. */
function Inline({ text }: { text: string }) {
  const pattern = /(https?:\/\/[^\s<>()]+|\/[\w./-]+\.pdf|[\w.+-]+@[\w-]+\.[\w.]+)/g;
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (i % 2 === 0) return <span key={i}>{part}</span>;

        const isPdf = part.endsWith(".pdf");
        const isEmail = part.includes("@") && !part.startsWith("http");
        const href = isEmail ? `mailto:${part}` : part;
        const match = profile.resumes.find((r: Resume) => r.file === part);

        if (isPdf) {
          return (
            <a
              key={i}
              href={href}
              download
              className="mx-0.5 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 align-middle text-[12px] font-medium text-neutral-900 ring-1 ring-neutral-200 transition-colors hover:ring-neutral-900"
            >
              <DownloadIcon />
              {match ? match.label : "Download PDF"}
            </a>
          );
        }

        return (
          <a
            key={i}
            href={href}
            target={isEmail ? undefined : "_blank"}
            rel={isEmail ? undefined : "noreferrer"}
            className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}

/** Renders a reply: markdown bullets become real list rows, blanks collapse. */
function RichText({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.trimEnd());

  return (
    <div className="space-y-1.5">
      {lines.map((raw, i) => {
        const bullet = /^\s*[*-]\s+/.test(raw);
        const line = tidy(raw.replace(/^\s*[*-]\s+/, ""));
        if (!line) return null;

        if (bullet) {
          return (
            <div key={i} className="flex gap-2">
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-neutral-400" />
              <span className="min-w-0 flex-1">
                <Inline text={line} />
              </span>
            </div>
          );
        }

        return (
          <p key={i}>
            <Inline text={line} />
          </p>
        );
      })}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v10m0 0l-4-4m4 4l4-4M4 18h16" />
    </svg>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [avatarFailed, setAvatarFailed] = useState(false);

  const lastSentRef = useRef<string>("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      lastSentRef.current = trimmed;
      setError(null);
      setErrorDetail(null);
      const next: ChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(next);
      setInput("");
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: next }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorDetail(data.detail ?? null);
          throw new Error(data.error || "Request failed");
        }
        setMessages([...next, { role: "assistant", content: data.reply }]);
      } catch (err) {
        setError(
          err instanceof Error && err.message !== "Request failed"
            ? err.message
            : "That message didn't get through."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages]
  );

  const retry = () => {
    const text = lastSentRef.current;
    if (!text) return;
    setMessages((m) => m.slice(0, -1)); // drop the failed user turn
    setError(null);
    setErrorDetail(null);
    setTimeout(() => sendMessage(text), 0);
  };

    const Avatar = ({ size }: { size: number }) => (
    <span
      className="relative block shrink-0 overflow-hidden rounded-full bg-neutral-800"
      style={{ width: size, height: size }}
    >
      {avatarFailed ? (
        <span className="flex h-full w-full items-center justify-center text-[11px] font-semibold tracking-wide text-white">
          {profile.initials}
        </span>
      ) : (
        <Image
          src={profile.avatar}
          alt={profile.name}
          fill
          sizes="128px"
          className="object-cover"
          style={{ objectPosition: profile.avatarPosition }}
          onError={() => setAvatarFailed(true)}
        />
      )}
    </span>
  );

  return (
    <div className="abdul-chat fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* ---------- Launcher ---------- */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-[#121212] py-1.5 pl-1.5 pr-4 text-white outline-none ring-1 ring-white/10 transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 shadow-[0_8px_24px_-10px_rgba(138,79,216,0.7)] hover:shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-[#8A4FD8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B14] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          aria-label={`Chat about ${profile.name}`}
        >
          {/* gradient wash, revealed on hover */}
          <span
            aria-hidden
            style={{ backgroundImage: BRAND_GRADIENT }}
            className="absolute inset-0 opacity-100 transition-opacity duration-300 group-hover:opacity-0"
          />

          <span className="relative z-10 rounded-full ring-2 ring-white/15 transition-shadow duration-300 group-hover:ring-white/40">
            <Avatar size={28} />
          </span>

          {/* both labels share one grid cell so the pill width never jumps */}
          <span className="relative z-10 grid text-[12px] font-medium">
            <span className="col-start-1 row-start-1 opacity-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:opacity-0 motion-reduce:transition-none">
              {profile.launcherLabel}
            </span>
            <span className="col-start-1 row-start-1 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none">
              {profile.launcherHoverLabel}
            </span>
          </span>
        </button>
      )}

      {/* ---------- Panel ---------- */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Chat about ${profile.name}`}
          className="flex h-[min(80dvh,580px)] w-[min(384px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[20px] border border-neutral-200/80 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] motion-safe:animate-[chatIn_180ms_ease-out]"
        >
          {/* Header: photo sits at the top right */}
          <div className="relative bg-[#121212] px-5 pb-6 pt-4 text-white">
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setError(null);
                  setErrorDetail(null);
                  inputRef.current?.focus();
                }}
                aria-label="Start a new chat"
                className="absolute left-11 top-3 flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[11px] text-neutral-400 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7 7-7M3 12h13a5 5 0 015 5v2" />
                </svg>
                New chat
              </button>
            )}

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="absolute left-3 top-3 rounded-full p-1.5 text-neutral-400 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mt-5 pr-24">
              <p className="text-[15px] font-semibold leading-tight">{profile.name}</p>
              <p className="mt-0.5 text-[12.5px] leading-snug text-neutral-400">
                {profile.role}
              </p>
              <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-neutral-300">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3DBF9A]" />
                {profile.status}
              </p>
            </div>

            <div className="absolute right-5 top-4">
              <span className="relative inline-block rounded-full ring-[3px] ring-white/90">
                <Avatar size={64} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#121212] bg-[#3DBF9A]" />
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.length === 0 && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-neutral-50 px-4 py-3.5">
                  <p className="text-[13.5px] leading-relaxed text-neutral-800">
                    {profile.intro} Ask me anything about the work, the process, or
                    availability.
                  </p>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[12px] leading-snug">
                    <dt className="text-neutral-400">Based in</dt>
                    <dd className="text-neutral-700">
                      {profile.location} &middot; {profile.relocation.toLowerCase()}
                    </dd>
                    <dt className="text-neutral-400">Experience</dt>
                    <dd className="text-neutral-700">{profile.experience}</dd>
                  </dl>
                </div>

                <div className="flex flex-wrap gap-2">
                  {STARTER_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="rounded-full border border-neutral-200 px-3 py-1.5 text-[12px] text-neutral-700 outline-none transition-colors hover:border-neutral-900 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-[#8A4FD8]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "max-w-[82%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-[#121212] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white"
                      : "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-neutral-50 px-3.5 py-2.5 text-[13.5px] leading-relaxed text-neutral-900"
                  }
                >
                  {msg.role === "assistant" ? (
                    <RichText text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-neutral-50 px-4 py-3">
                  {[0, 1, 2].map((n) => (
                    <span
                      key={n}
                      className="h-1.5 w-1.5 rounded-full bg-neutral-400 motion-safe:animate-bounce"
                      style={{ animationDelay: `${n * 0.12}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-3 py-2.5">
                <div className="min-w-0">
                <p className="text-[12.5px] text-neutral-600">
                  {error} Retry, or email{" "}
                  <a
                    className="underline decoration-neutral-300 underline-offset-2"
                    href={`mailto:${profile.email}`}
                  >
                    {profile.email}
                  </a>
                  .
                </p>
                {errorDetail && (
                  <p className="mt-1.5 break-words font-mono text-[10.5px] leading-snug text-neutral-400">
                    {errorDetail}
                  </p>
                )}
                </div>
                <button
                  onClick={retry}
                  className="shrink-0 rounded-full bg-[#121212] px-3 py-1.5 text-[12px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#8A4FD8]"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={endRef} />
          </div>

          {/* Resume downloads - always one tap away */}
          <div className="flex items-center gap-2 border-t border-neutral-100 px-3 pt-2.5">
            <span className="shrink-0 text-[11px] text-neutral-400">Resume</span>
            {profile.resumes.map((r: Resume) => (
              <a
                key={r.file}
                href={r.file}
                download
                title={r.region}
                className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 px-2.5 py-1 text-[11.5px] font-medium text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900"
              >
                <DownloadIcon />
                {r.label}
              </a>
            ))}
          </div>

          {/* Composer */}
          <div className="px-3 pb-3 pt-2.5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${profile.shortName}'s work`}
                style={{ color: "#171717" }}
                className="min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-[13.5px] text-neutral-900 caret-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-900 disabled:opacity-60"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{ backgroundImage: BRAND_GRADIENT }}
                className="group relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-white shadow-[0_4px_14px_-4px_rgba(138,79,216,0.75)] outline-none transition-shadow duration-200 hover:shadow-[0_4px_14px_-4px_rgba(0,0,0,0.5)] disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-[#8A4FD8] focus-visible:ring-offset-2"
                aria-label="Send message"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[#121212] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                />
                <svg
                  className="relative z-10 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </form>
            <p className="mt-2 px-1 text-[10.5px] leading-snug text-neutral-400">
              AI assistant trained on {profile.shortName}&rsquo;s portfolio. For anything
              specific, use the{" "}
              <a
                className="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-600"
                href={profile.contactPath}
              >
                contact form
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        .abdul-chat input::selection {
          background: rgba(138, 79, 216, 0.25);
          color: #171717;
        }
        @keyframes chatIn {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}