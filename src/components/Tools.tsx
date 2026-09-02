"use client";

import { motion, type Variants } from "motion/react";

type Tool = {
  name: string;
  category: string;
  accent: string;
  primary?: boolean;
};

/* Figma's five brand colours */
const FIGMA_GRADIENT =
  "linear-gradient(135deg, #F24E1E, #FF7262, #A259FF, #1ABCFE, #0ACF83)";

const TOOLS: Tool[] = [
  { name: "Figma", category: "Design", accent: "#F24E1E", primary: true },
  { name: "Claude", category: "AI", accent: "#E8823C" },
  { name: "ChatGPT", category: "AI", accent: "#10A37F" },
  { name: "Cursor", category: "Code", accent: "#7C5CFF" },
  { name: "Framer", category: "Build", accent: "#2563EB" },
  { name: "Lovable", category: "AI build", accent: "#FF4D8D" },
  { name: "Adobe Illustrator", category: "Graphics", accent: "#FFB800" },
  { name: "Adobe InDesign", category: "Layout", accent: "#D6249F" },
  { name: "Git", category: "Version control", accent: "#00B8D9" },
  { name: "GitHub", category: "Collaboration", accent: "#4A5568" },
  { name: "Vercel", category: "Deploy", accent: "#7CB518" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em] text-muted";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055 } },
};

const item: Variants = {
  hidden: { y: 22, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

/* ---------------- row ---------------- */

function Row({ tool }: { tool: Tool }) {
  return (
    <motion.div
      variants={item}
      whileHover="hover"
      className="group relative flex items-center gap-4 border-b border-border py-5 md:py-6"
    >
      {/* Accent bar grows from the left edge on hover */}
      <motion.span
        aria-hidden
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="absolute -left-4 top-1/2 h-6 w-[3px] origin-left -translate-y-1/2 rounded-full md:-left-6"
        style={
          tool.primary
            ? { background: FIGMA_GRADIENT }
            : { backgroundColor: tool.accent }
        }
      />

      {/* Dot */}
      <motion.span
        variants={{ hover: { scale: 1.6 } }}
        transition={{ type: "spring", stiffness: 420, damping: 16 }}
        className="size-2 shrink-0 rounded-full"
        style={
          tool.primary
            ? { background: FIGMA_GRADIENT }
            : { backgroundColor: tool.accent }
        }
      />

      {/* Name */}
      <motion.span
        variants={{ hover: { x: 5 } }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-base font-medium tracking-tight md:text-lg"
      >
        {tool.name}
      </motion.span>

      {/* Category, pushed right */}
      <span className={`ml-auto shrink-0 ${MICRO}`}>{tool.category}</span>
    </motion.div>
  );
}

/* ---------------- section ---------------- */

export default function Tools() {
  return (
    <section
      id="skills"
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
          <span className={MICRO}>Tools and software</span>
        </motion.div>

        <div className="mt-8 grid gap-5 md:grid-cols-12 md:items-end md:gap-6">
          <motion.h2
            variants={item}
            className="text-3xl font-semibold leading-[1.08] tracking-[-0.03em] md:col-span-6 md:text-5xl"
          >
            The tools I actually use.
          </motion.h2>

          <motion.p
            variants={item}
            className="text-sm leading-relaxed text-muted md:col-span-4 md:col-start-9"
          >
            Figma for design, React and Next.js to build it, AI tools to move
            faster.
          </motion.p>
        </div>
      </motion.div>

      {/* Two columns of rows */}
      <motion.div
        variants={group}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-8%" }}
        className="grid gap-x-16 border-t border-border md:grid-cols-2 md:gap-x-20"
      >
        {TOOLS.map((tool) => (
          <Row key={tool.name} tool={tool} />
        ))}
      </motion.div>
    </section>
  );
}