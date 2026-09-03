"use client";

import { motion, type Variants } from "motion/react";
import { ArrowDown } from "lucide-react";

const ROLES = ["UI/UX Designer", "Product Designer"];

const INTRO =
  "Clean, minimal interfaces for product-focused design from Figma to front end.";

/* Smooth blend - lavender at the top edge, resolving into near-black */
const BACKDROP =
  "linear-gradient(180deg, #DCD5F7 0%, #C4B8EE 22%, #8574CE 44%, #4E3F9B 62%, #2A2160 80%, #08061A 100%)";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em]";

/* Line parent - staggers its own characters */
const line: Variants = {
  hidden: {},
  show: (i: number) => ({
    transition: { delayChildren: 0.35 + i * 0.18, staggerChildren: 0.016 },
  }),
};

const char: Variants = {
  hidden: { y: "115%", opacity: 0, skewY: 5 },
  show: {
    y: "0%",
    opacity: 1,
    skewY: 0,
    transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.8 },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: (d: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: d, ease: EASE },
  }),
};

/* ---------------- headline line ---------------- */

function Line({
  text,
  index,
  muted,
}: {
  text: string;
  index: number;
  muted: boolean;
}) {
  return (
    <motion.span
      variants={line}
      custom={index}
      initial="hidden"
      animate="show"
      className={`block transition-colors duration-500 ${
        muted ? "text-white/35 hover:text-white" : "text-white"
      }`}
    >
      {text.split("").map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          className="inline-block overflow-hidden pb-[0.06em] align-bottom"
        >
          <motion.span
            variants={char}
            whileHover={{
              y: -12,
              transition: { type: "spring", stiffness: 450, damping: 12 },
            }}
            className="inline-block will-change-transform"
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ---------------- section ---------------- */

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-10 pt-28 text-white md:px-8 md:pb-12 md:pt-32"
      style={{ background: BACKDROP }}
    >
      {/* Soft bloom stops the blend banding */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[15%] left-1/2 size-[80vw] -translate-x-1/2 rounded-full opacity-35 blur-[150px]"
        style={{
          background: "radial-gradient(circle, #C4B8EE 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* ── Intro, top right ── */}
                <motion.p
          variants={fade}
          custom={0.15}
          initial="hidden"
          animate="show"
          className="mt-32 max-w-xs text-sm leading-relaxed text-white/75 mix-blend-difference sm:ml-auto sm:text-right md:mt-44 md:max-w-sm md:text-base"
        >
          {INTRO}
        </motion.p>

        {/* ── Headline, anchored to the bottom ── */}
        <div className="mt-auto">

          <h1 className="text-[11.5vw] font-semibold leading-[0.98] tracking-[-0.045em] md:text-[7vw]">
            {ROLES.map((text, i) => (
              <Line
                key={text}
                text={text}
                index={i}
                muted={i !== ROLES.length - 1}
              />
            ))}
          </h1>

          {/* Baseline */}
          <motion.div
            variants={fade}
            custom={0.9}
            initial="hidden"
            animate="show"
            className="mt-10 flex items-center justify-between gap-6 md:mt-14"
          >
            <span className={`${MICRO} text-white/45`}>
              Portfolio — {new Date().getFullYear()}
            </span>

            <span className={`flex items-center gap-2 ${MICRO} text-white/45`}>
              <ArrowDown className="size-3.5 animate-bounce" />
              Scroll
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}