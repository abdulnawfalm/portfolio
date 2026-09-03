"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useSpring,
  useTransform,
  type Variants,
} from "motion/react";
import {
  Download,
  ChevronDown,
  ArrowUpRight,
  Search,
  PenLine,
  Layers,
  Code2,
} from "lucide-react";

const HEADLINE = "UI/UX Designer & Product Designer";

const BIO =
  "I'm a UI/UX and Product Designer with two years of experience designing and developing digital products. I design in Figma (including Figma AI) and bring those designs to life using modern front-end technologies working across both web and mobile platforms. I use AI tools throughout my workflow to move faster without compromising quality, allowing me to deliver projects efficiently based on scope and timeline.";

/* PDFs live in public/ - see the note under this file */
const RESUMES = [
  { label: "Dubai, UAE", note: "UAE format", file: "/resume-uae.pdf" },
  { label: "India", note: "India format", file: "/resume-india.pdf" },
];

const FLOW = [
  {
    n: "01",
    title: "User research",
    desc: "Understand users, their needs, pain points, and behaviours through research and competitive analysis.",
    output: "Discover, define",
    icon: Search,
  },
  {
    n: "02",
    title: "Wireframe",
    desc: "Define the structure, hierarchy, and layout of each screen before moving into visual design.",
    output: "Layouts, structure",
    icon: PenLine,
  },
  {
    n: "03",
    title: "High-fidelity UI",
    desc: "Turn structure into engaging interfaces through strong visual direction, clear hierarchy, expressive typography, and a consistent design language.",
    output: "Visual design, prototype",
    icon: Layers,
  },
  {
    n: "04",
    title: "Handoff to developers",
    desc: "Provide clear specifications, components, and interactive prototypes for a smooth, accurate handoff to development.",
    output: "Developer handoff, final UI",
    icon: Code2,
  },
];

const STATS = [
  { value: 2, suffix: "+", label: "Years experience" },
  { value: 20, suffix: "+", label: "Projects delivered" },
  { value: 500, suffix: "+", label: "Screens designed" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em] text-muted";

/* Shared reveal */
const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item: Variants = {
  hidden: { y: 28, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

/* Words brighten one at a time as the block enters */
const word: Variants = {
  hidden: { opacity: 0.12, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ---------------- counter ---------------- */

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const spring = useSpring(0, { stiffness: 60, damping: 22, mass: 1 });
  const display = useTransform(spring, (v) => Math.round(v).toString());

  if (inView) spring.set(value);

  return <motion.span ref={ref}>{display}</motion.span>;
}

/* ---------------- resume menu ---------------- */

function ResumeButton() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Click outside and Escape both close */
  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        data-cursor="magnetic"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileTap={{ scale: 0.96 }}
        aria-expanded={open}
        className="group relative isolate inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-medium sm:w-auto"
      >
        {/* Gradient sweeps up from below */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ y: hovered ? "0%" : "101%" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0 -z-10 bg-gradient-to-r from-rose to-azure"
        />

        {/* Icon and label share one colour so they flip together */}
        <motion.span
          animate={{ color: hovered ? "#ffffff" : "var(--btn-foreground)" }}
          transition={{ duration: 0.3 }}
          className="relative flex items-center gap-2.5"
        >
          <span className="relative block size-4 overflow-hidden">
            <motion.span
              animate={{ y: hovered ? "140%" : "0%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 block"
            >
              <Download className="size-4" />
            </motion.span>
            <motion.span
              aria-hidden
              animate={{ y: hovered ? "0%" : "-140%" }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 block"
            >
              <Download className="size-4" />
            </motion.span>
          </span>

          Download resume

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="ml-0.5"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </motion.span>
      </motion.button>

      {/* Options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="absolute left-0 top-full z-20 mt-2 w-full min-w-[240px] origin-top overflow-hidden rounded-2xl border border-border bg-surface p-1.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] sm:w-auto"
          >
            {RESUMES.map((r, i) => (
              <motion.a
                key={r.file}
                href={r.file}
                download
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.06 + i * 0.06,
                  duration: 0.35,
                  ease: EASE,
                }}
                className="group/item flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-300 hover:bg-foreground/[0.06]"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border transition-colors duration-300 group-hover/item:border-transparent group-hover/item:bg-foreground group-hover/item:text-background">
                  <Download className="size-3.5" />
                </span>

                <span className="min-w-0">
                  <span className="block text-sm font-medium tracking-tight">
                    {r.label}
                  </span>
                  <span className="mt-0.5 block text-[10px] uppercase tracking-[0.15em] text-muted">
                    {r.note}
                  </span>
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- flow step ---------------- */

function Step({ step }: { step: (typeof FLOW)[number] }) {
  const Icon = step.icon;

  return (
    <motion.div
      variants={item}
      whileHover="hover"
      className="group relative grid grid-cols-1 items-start gap-4 border-b border-border py-8 md:grid-cols-12 md:gap-8 md:py-10"
    >
      {/* Fill sweeps up behind the row */}
      <motion.span
        aria-hidden
        variants={{ hover: { scaleY: 1 } }}
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-full origin-bottom bg-foreground/[0.04]"
      />

      {/* Index + icon */}
      <div className="flex items-center gap-4 md:col-span-3">
        <motion.span
          variants={{ hover: { scale: 1.08, rotate: -6 } }}
          transition={{ type: "spring", stiffness: 380, damping: 16 }}
          className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-background transition-colors duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background"
        >
          <Icon className="size-[18px]" />
        </motion.span>

        <span className={`${MICRO} tabular-nums`}>{step.n}</span>
      </div>

      {/* Title */}
      <motion.h3
        variants={{ hover: { x: 6 } }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-xl font-medium tracking-tight md:col-span-3 md:text-2xl"
      >
        {step.title}
      </motion.h3>

      {/* Description */}
      <p className="text-sm leading-relaxed text-muted md:col-span-5">
        {step.desc}
      </p>

      {/* Output */}
      <span className="md:col-span-1 md:text-right">
        <span className="inline-block whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-[10px] uppercase tracking-[0.1em] text-muted transition-colors duration-500 group-hover:border-foreground/25">
          {step.output.split(",")[0]}
        </span>
      </span>
    </motion.div>
  );
}

/* ---------------- section ---------------- */

export default function About() {
  return (
    <section id="about" className="relative bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36">
        {/* Label */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className={MICRO}>About</span>
          </motion.div>
        </motion.div>

        {/* ── Headline + bio ── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-15%" }}
          className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12 md:gap-10"
        >
          <h2 className="flex flex-wrap text-2xl font-semibold leading-[1.2] tracking-[-0.03em] sm:text-3xl md:col-span-7 md:text-[2.9vw]">
            {HEADLINE.split(" ").map((w, i) => (
              <motion.span
                key={`${w}-${i}`}
                variants={word}
                className="mr-[0.25em] inline-block"
              >
                {w}
              </motion.span>
            ))}
          </h2>

          <motion.p
            variants={item}
            className="text-sm leading-relaxed text-muted md:col-span-4 md:col-start-9 md:pt-2"
          >
            {BIO}
          </motion.p>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="mt-16 grid grid-cols-3 gap-6 border-y border-border py-10 md:mt-24 md:gap-16 md:py-14"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              className="flex flex-col gap-2"
            >
              <div className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-6xl">
                <Counter value={stat.value} />
                <span className="bg-gradient-to-r from-rose to-azure bg-clip-text text-transparent">
                  {stat.suffix}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted md:text-xs">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Process ── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="mt-16 md:mt-24"
        >
          <motion.div variants={item} className="flex items-center gap-4">
            <span className={MICRO}>How I work</span>
            <span className="h-px flex-1 bg-border" />
          </motion.div>

          <div className="mt-8 border-t border-border md:mt-10">
            {FLOW.map((step) => (
              <Step key={step.n} step={step} />
            ))}
          </div>
        </motion.div>

        {/* ── Actions ── */}
        <motion.div
          variants={group}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          className="mt-12 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center md:mt-16"
        >
          <motion.div variants={item}>
            <ResumeButton />
          </motion.div>

          <motion.a
            variants={item}
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-medium transition-colors duration-300 hover:bg-btn-outline-hover"
          >
            Let&apos;s talk
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}