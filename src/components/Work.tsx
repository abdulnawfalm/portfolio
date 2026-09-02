"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";
import CaseStudy from "./CaseStudy";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* One accent per card, so the arrows read as distinct */
const ACCENTS = [
  "#F24E1E",
  "#7C5CFF",
  "#10A37F",
  "#2563EB",
  "#D6249F",
  "#FFB800",
];

const INITIAL = 4;

/* ---------------- card ---------------- */

function Card({
  project,
  accent,
  onOpen,
}: {
  project: Project;
  accent: string;
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      data-cursor="magnetic"
      className="work-card group block w-full rounded-[22px] border border-border bg-surface p-3 text-left transition-colors duration-500 hover:border-foreground/15 md:rounded-3xl md:p-4"
    >
      {/* Media */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200">
        <Image
          src={project.cover}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 45vw"
          placeholder="blur"
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />

        {/* Accent veil on hover */}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `linear-gradient(to top, ${accent}26, transparent 55%)`,
          }}
        />
      </div>

      {/* Caption */}
      <div className="flex items-end justify-between gap-4 px-2 pb-1 pt-5 md:px-3 md:pt-6">
        <span className="min-w-0">
          <span className="block text-lg font-semibold tracking-tight transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 md:text-xl">
            {project.title}
          </span>
          <span className="mt-1 block text-sm text-muted">
            {project.tags[0]} · {project.year}
          </span>
        </span>

        <span
          className="shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
          style={{ color: accent }}
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
    </button>
  );
}

/* ---------------- section ---------------- */

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const [showAll, setShowAll] = useState(false);
  const [open, setOpen] = useState<Project | null>(null);

  const visible = showAll ? PROJECTS : PROJECTS.slice(0, INITIAL);

  /* Push a real URL so back/forward and sharing work, without a route change */
  const openProject = useCallback((p: Project) => {
    setOpen(p);
    window.history.pushState({ slug: p.slug }, "", `/work/${p.slug}`);
  }, []);

  const closeProject = useCallback(() => {
    setOpen(null);
    window.history.pushState({}, "", "/");
  }, []);

  /* Direct hit on /work/<slug> redirects here with ?case=<slug> */
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("case");
    if (!slug) return;
    const match = PROJECTS.find((p) => p.slug === slug);
    if (match) {
      setOpen(match);
      window.history.replaceState({ slug }, "", `/work/${slug}`);
    }
  }, []);

  /* Browser back closes the panel instead of leaving the page */
  useEffect(() => {
    const onPop = () => {
      const slug = window.location.pathname.replace("/work/", "");
      const match = PROJECTS.find((p) => p.slug === slug);
      setOpen(match ?? null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useGSAP(
    () => {
      gsap.from(".work-head > *", {
        y: 36,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ".work-head", start: "top 88%" },
      });

      gsap.from(".work-card", {
        y: 44,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform",
        scrollTrigger: { trigger: ".work-grid", start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="work"
      ref={root}
      className="mx-auto max-w-7xl px-5 py-24 md:px-8 md:py-36"
    >
      {/* Heading */}
      <div className="work-head mb-12 md:mb-16">
        <div className="flex items-center gap-4">
          <span className="h-px flex-1 bg-border" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">
            Projects
          </span>
        </div>

        <h2 className="mt-8 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] md:text-6xl">
          Selected work
        </h2>
      </div>

      {/* Grid */}
      <div className="work-grid grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6">
        {visible.map((project, i) => (
          <Card
            key={project.slug}
            project={project}
            accent={ACCENTS[i % ACCENTS.length]}
            onOpen={() => openProject(project)}
          />
        ))}
      </div>

      {/* View all */}
      <AnimatePresence>
        {!showAll && PROJECTS.length > INITIAL && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="mt-12 flex justify-center md:mt-16"
          >
            <button
              onClick={() => setShowAll(true)}
              data-cursor="magnetic"
              className="group relative isolate flex h-12 items-center gap-2 overflow-hidden rounded-full bg-foreground px-7 text-sm font-medium text-background"
            >
              <span className="absolute inset-0 -z-10 -translate-x-full bg-gradient-to-r from-rose to-azure transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
              View all
              <span className="text-background/50">({PROJECTS.length})</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <CaseStudy project={open} onClose={closeProject} onNext={openProject} />
    </section>
  );
}