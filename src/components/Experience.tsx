"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em]";

type Role = {
  n: string;
  company: string;
  role: string;
  type: string;
  period: string;
  location: string;
  summary: string;
  points: string[];
  stack: string[];
};

const ROLES: Role[] = [
  {
    n: "01",
    company: "Your Office Partners",
    role: "UI/UX & Graphic Designer",
    type: "Full-time",
    period: "July 2025 - July 2026",
    location: "UAE — Remote",
    summary:
      "Designed across web, mobile, and brand for multiple UAE-based clients from a ship chartering dashboard to HR software to a real estate platform using AI-powered tools throughout to speed up ideation, prototyping, and delivery.",
    points: [
      "Designed a ship chartering dashboard and led HR software design across web and mobile, delivering 100+ screens ahead of schedule",
      "Produced brand and marketing assets logos, business cards, brochures and published new blog content twice weekly",
    ],
    stack: ["Figma", "React", "AI Tools", "Branding"],
  },
  {
    n: "02",
    company: "NGEN Labs",
    role: "UI/UX Designer",
    type: "Full-time",
    period: "2024 — 2025",
    location: "Chennai — Remote",
    summary:
      "Led end-to-end UI design across a vendor management platform, an internal banking dashboard, and client website redesigns iterating through wireframes and prototypes based on usability testing and stakeholder feedback.",
    points: [
      "Led end-to-end design of a vendor management platform, enabling non-technical users to track vendors and add new products",
      "Restructured a cluttered gas and oil services website into a clearer, more usable layout",
      "Designed an internal banking dashboard and a multi-page charity website, collaborating with developers via Git and GitHub for handoff",
    ],
    stack: ["Figma", "User Research", "Wireframing"],
  },
  {
    n: "03",
    company: "Self-employed",
    role: "Freelance Designer",
    type: "Freelance",
    period: "2023",
    location: "Remote",
    summary:
      "Brand identities, marketing sites, and product interfaces for founders and small teams spanning logo and identity systems, marketing collateral, website design, and editorial layout work in Figma.",
    points: [
      "Redesigned logo typography and colour palette as part of a brand identity refresh",
      "Designed a web project for a Singapore-based university's AI programs event",
    ],
    stack: ["Figma", "Motiff AI", "HTML/CSS", "Branding"],
  },
];

/* ---------------- row ---------------- */

function Row({
  role,
  open,
  onToggle,
}: {
  role: Role;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="exp-row border-b border-border">
      {/* Header - always visible */}
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="group relative flex w-full items-start gap-5 py-8 text-left md:items-center md:gap-8 md:py-10"
      >
        {/* Index */}
        <span
          className={`shrink-0 tabular-nums transition-colors duration-500 ${MICRO} ${
            open ? "text-foreground" : "text-muted"
          }`}
        >
          {role.n}
        </span>

        {/* Title + company */}
        <span className="min-w-0 flex-1">
          <span
            className={`block font-semibold leading-[1.1] tracking-[-0.03em] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              open
                ? "text-3xl md:text-[3.2rem]"
                : "text-2xl text-muted group-hover:text-foreground md:text-4xl"
            }`}
          >
            {role.role}
          </span>
          <span className={`mt-2 block text-muted ${MICRO}`}>
            {role.company} · {role.location}
          </span>
        </span>

        {/* Period */}
        <span
          className={`hidden shrink-0 tabular-nums text-muted md:block ${MICRO}`}
        >
          {role.period}
        </span>

        {/* Toggle */}
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 md:size-11 ${
            open
              ? "rotate-45 border-transparent bg-foreground text-background"
              : "border-border group-hover:border-foreground/30"
          }`}
        >
          <Plus className="size-4" />
        </span>
      </button>

      {/* Detail - height animates to auto */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.55, ease: EASE },
              opacity: { duration: 0.3 },
            }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 pb-10 md:grid-cols-12 md:gap-10 md:pl-[3.6rem]">
              {/* Summary */}
              <p className="text-sm leading-relaxed text-muted md:col-span-5 md:text-base">
                {role.summary}
              </p>

              {/* Points + stack */}
              <div className="md:col-span-6 md:col-start-7">
                <p className={`mb-4 text-muted ${MICRO}`}>Highlights</p>

                <ul className="flex flex-col gap-3">
                  {role.points.map((p, i) => (
                    <motion.li
                      key={p}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.15 + i * 0.07,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      className="flex items-start gap-3 text-sm leading-relaxed"
                    >
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-gradient-to-r from-rose to-azure" />
                      {p}
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-7 flex flex-wrap gap-2">
                  {role.stack.map((tech, i) => (
                    <motion.span
                      key={tech}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{
                        delay: 0.3 + i * 0.04,
                        duration: 0.4,
                        ease: EASE,
                      }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- section ---------------- */

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState(0);

  useGSAP(
    () => {
      gsap.from(".exp-head > *", {
        y: 36,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ".exp-head", start: "top 88%" },
      });

      gsap.from(".exp-row", {
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ".exp-list", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="experience"
      ref={root}
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36"
    >
      {/* Heading */}
      <div className="exp-head mb-14 md:mb-20">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className={`text-muted ${MICRO}`}>Experience</span>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:col-span-7 md:text-6xl">
            Different teams, same standard.
          </h2>
          <p className="text-sm leading-relaxed text-muted md:col-span-4 md:col-start-9 md:text-base">
            Three roles across product, brand and freelance work. Open one to
            see what shipped.
          </p>
        </div>
      </div>

      {/* Accordion */}
      <div className="exp-list border-t border-border">
        {ROLES.map((role, i) => (
          <Row
            key={role.n}
            role={role}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}