"use client";

import { useRef } from "react";
import { motion, type Variants } from "motion/react";
import { ArrowDown } from "lucide-react";

const ROLES = [
  { n: "01", label: "UI/UX Designer" },
  { n: "02", label: "Product Designer" },
];

const INTRO =
  "Clean, minimal interfaces for product-focused design — from Figma to front end.";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em] text-muted";

/* Row parent - staggers its own children */
const row: Variants = {
  hidden: {},
  show: (i: number) => ({
    transition: { delayChildren: 0.2 + i * 0.22, staggerChildren: 0.014 },
  }),
};

/* Each character springs up and settles */
const char: Variants = {
  hidden: { y: "115%", opacity: 0, skewY: 6 },
  show: {
    y: "0%",
    opacity: 1,
    skewY: 0,
    transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.8 },
  },
};

const bar: Variants = {
  hidden: { scaleX: 0, transformOrigin: "left" },
  show: {
    scaleX: 1,
    transformOrigin: "left",
    transition: { duration: 1.1, ease: EASE },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ---------------- row ---------------- */

function Role({
  role,
  index,
  last,
}: {
  role: (typeof ROLES)[number];
  index: number;
  last: boolean;
}) {
  return (
    <motion.div
      variants={row}
      custom={index}
      initial="hidden"
      animate="show"
      className="group flex items-baseline gap-4 md:gap-6"
      style={{ paddingLeft: `${index * 8}%` }}
    >
      {/* Index */}
      <motion.span variants={fade} className={`${MICRO} shrink-0 tabular-nums`}>
        {role.n}
      </motion.span>

      {/* Label - per-character spring, each letter lifts on hover */}
      <h1
        className={`shrink-0 text-[10vw] font-semibold leading-[1.12] tracking-[-0.04em] transition-colors duration-500 md:text-[6vw] ${
          last
            ? "text-foreground"
            : "text-foreground/35 group-hover:text-foreground"
        }`}
      >
        {role.label.split("").map((ch, i) => (
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
      </h1>

      {/* Trailing rule */}
      <motion.span
        variants={bar}
        className={`hidden h-px flex-1 md:block ${
          last ? "bg-foreground" : "bg-border"
        }`}
      />
    </motion.div>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden bg-background px-5 pb-8 pt-28 text-foreground md:px-8 md:pb-10 md:pt-32"
    >
      {/* Roles */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-6 md:gap-9">
        {ROLES.map((role, i) => (
          <Role
            key={role.n}
            role={role}
            index={i}
            last={i === ROLES.length - 1}
          />
        ))}
      </div>

      {/* Baseline */}
      <motion.div
        variants={row}
        custom={2}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-7xl"
      >
        <motion.div variants={bar} className="h-px w-full bg-border" />

        <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <motion.p
            variants={fade}
            className="max-w-md text-sm leading-relaxed text-muted md:text-base"
          >
            {INTRO}
          </motion.p>

          <motion.span
            variants={fade}
            className={`flex shrink-0 items-center gap-2 ${MICRO}`}
          >
            <ArrowDown className="size-3.5 animate-bounce" />
            Scroll
          </motion.span>
        </div>
      </motion.div>
    </section>
  );
}