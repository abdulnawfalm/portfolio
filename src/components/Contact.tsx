"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";
import {
  ArrowUpRight,
  Check,
  Loader2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";

/* ── Replace with your own endpoint from formspree.io ── */
const FORM_ENDPOINT = "https://formspree.io/f/xzebrvza";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em] text-muted";

const DETAILS = [
  {
    label: "Email",
    value: "abdulnawfal11011@gmail.com",
    href: "mailto:abdulnawfal11011@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 81221 29168",
    href: "tel:+918122129168",
    icon: Phone,
  },
  { label: "Location", value: "Chennai, India", icon: MapPin },
  { label: "Response", value: "Within 24 hours", icon: Clock },
];

type Status = "idle" | "sending" | "done" | "error";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.75, ease: EASE } },
};

/* ---------------- input ---------------- */

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  placeholder,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);

  const shared = {
    id,
    name: id,
    value,
    placeholder,
    autoComplete,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      "w-full resize-none bg-transparent text-base tracking-tight outline-none placeholder:text-muted/40",
  };

  return (
    <motion.div variants={item}>
      <label htmlFor={id} className={`mb-2.5 block ${MICRO}`}>
        {label}
      </label>

      {/* Field card - border lifts on focus */}
      <div
        className={`rounded-2xl border bg-background px-4 py-3.5 transition-all duration-500 ${
          focused
            ? "border-foreground/30 shadow-[0_1px_0_0_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.12)]"
            : "border-border"
        }`}
      >
        {textarea ? (
          <textarea {...shared} rows={4} />
        ) : (
          <input {...shared} type={type} />
        )}
      </div>
    </motion.div>
  );
}

/* ---------------- section ---------------- */

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const valid =
    name.trim().length > 0 && email.includes("@") && message.trim().length > 4;

  const submit = async () => {
    if (!valid || status === "sending") return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New enquiry from ${name}`,
          _gotcha: company,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          data?.errors?.[0]?.message ?? "Something went wrong. Try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setStatus("idle");
    setErrorMsg("");
  };

  return (
    <section
      id="contact"
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36"
    >
      {/* Heading */}
      <motion.div
        variants={group}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-10%" }}
        className="mb-14 md:mb-20"
      >
        <motion.div variants={item} className="flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className={MICRO}>Contact</span>
        </motion.div>

        <div className="mt-8 grid gap-5 md:grid-cols-12 md:items-end md:gap-6">
          <motion.h2
            variants={item}
            className="text-2xl font-semibold leading-[1.18] tracking-[-0.03em] sm:text-3xl md:col-span-6 md:text-4xl"
          >
            Let&rsquo;s turn your ideas into meaningful digital experiences.
          </motion.h2>

          <motion.p
            variants={item}
            className="text-sm leading-relaxed text-muted md:col-span-5 md:col-start-8"
          >
            Open to select projects and collaborations. Tell me what
            you&rsquo;re building and I&rsquo;ll reply within a day.
          </motion.p>
        </div>
      </motion.div>

      <div className="grid gap-12 md:grid-cols-12 md:gap-10 lg:gap-16">
        {/* ══ Left: details ══ */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-8%" }}
          className="md:col-span-5 lg:col-span-4"
        >
          <div className="flex flex-col gap-2">
            {DETAILS.map((d) => {
              const Icon = d.icon;

              const body = (
                <>
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border transition-colors duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
                    <Icon className="size-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className={`block ${MICRO}`}>{d.label}</span>
                    <span className="mt-1 block truncate text-sm font-medium tracking-tight">
                      {d.value}
                    </span>
                  </span>

                  {d.href && (
                    <ArrowUpRight className="size-3.5 shrink-0 self-center text-muted opacity-0 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  )}
                </>
              );

              const cls =
                "group flex items-center gap-4 rounded-2xl border border-transparent px-3 py-3 transition-colors duration-500 hover:border-border hover:bg-surface";

              return d.href ? (
                <motion.a
                  key={d.label}
                  variants={item}
                  href={d.href}
                  className={cls}
                >
                  {body}
                </motion.a>
              ) : (
                <motion.div key={d.label} variants={item} className={cls}>
                  {body}
                </motion.div>
              );
            })}
          </div>

          <motion.span
            variants={item}
            className="mt-8 ml-3 inline-flex items-center gap-2.5 rounded-full border border-border py-2 pl-3.5 pr-5 text-sm text-muted"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-rose" />
            </span>
            Available for new work
          </motion.span>
        </motion.div>

        {/* ══ Right: form ══ */}
        <div className="md:col-span-7 md:col-start-6">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[420px] flex-col items-start justify-center rounded-3xl border border-border bg-surface p-8 md:p-12"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="grid size-14 place-items-center rounded-full bg-foreground"
                >
                  <Check className="size-7 text-background" strokeWidth={3} />
                </motion.div>

                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
                  className="mt-7 text-2xl font-semibold tracking-[-0.03em] md:text-3xl"
                >
                  Message sent.
                </motion.h3>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
                  className="mt-3 max-w-sm text-sm leading-relaxed text-muted"
                >
                  Thanks{name ? `, ${name.trim().split(" ")[0]}` : ""} —
                  I&rsquo;ve got your message and will get back to you shortly.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  onClick={reset}
                  className={`mt-8 ${MICRO} underline-offset-4 transition-colors hover:text-foreground hover:underline`}
                >
                  Send another
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                variants={group}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-8%" }}
                exit={{ opacity: 0, y: -12 }}
                className="flex flex-col gap-6"
              >
                {/* Honeypot */}
                <input
                  type="text"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="pointer-events-none absolute left-[-9999px] size-0 opacity-0"
                />

                <div className="grid gap-6 sm:grid-cols-2">
                  <Field
                    id="name"
                    label="Name"
                    value={name}
                    onChange={setName}
                    placeholder="Jane Doe"
                    autoComplete="name"
                  />
                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>

                <Field
                  id="message"
                  label="Message"
                  value={message}
                  onChange={setMessage}
                  placeholder="What you're building, rough timeline, anything else useful."
                  textarea
                />

                {/* Error */}
                <AnimatePresence>
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-2 text-sm text-rose-deep"
                    >
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      {errorMsg}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  variants={item}
                  type="button"
                  onClick={submit}
                  disabled={!valid || status === "sending"}
                  data-cursor="magnetic"
                  whileTap={valid ? { scale: 0.98 } : undefined}
                  className={`group relative isolate mt-1 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full text-sm font-medium transition-colors duration-300 ${
                    valid
                      ? "bg-foreground text-background"
                      : "cursor-not-allowed bg-foreground/[0.06] text-muted"
                  }`}
                >
                  {valid && (
                    <span className="absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-rose to-azure transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
                  )}

                  {status === "sending" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      {status === "error" ? "Try again" : "Send message"}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}