"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";
import { useLenis } from "lenis/react";
import { X, ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS, type Project } from "@/data/projects";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const META_LABEL = "text-[11px] uppercase tracking-[0.2em] text-muted";

/* Scroll-triggered reveal - fires once as each block enters */
const reveal = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: EASE },
  },
};

/* Parent that staggers its children on entry */
const revealGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

/* Opening block - plays on mount, not on scroll */
const intro = {
  hidden: { y: 28, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const introGroup = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};

/* Wraps a section so it animates in as you reach it */
function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={revealGroup}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px -10% 0px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function CaseStudy({
  project,
  onClose,
  onNext,
}: {
  project: Project | null;
  onClose: () => void;
  onNext: (p: Project) => void;
}) {
  const lenis = useLenis();
  const scrollRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  /* Progress bar, driven by the panel's own scroll container */
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const progress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.001,
  });

  /* Cover parallax */
  const { scrollYProgress: coverProgress } = useScroll({
    container: scrollRef,
    target: coverRef,
    offset: ["start end", "end start"],
  });
  const coverY = useTransform(coverProgress, [0, 1], ["-8%", "8%"]);

  /* Freeze the page behind the panel */
  useEffect(() => {
    if (!lenis) return;
    if (project) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [project, lenis]);

  /* Escape closes */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Reset scroll when the project changes */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [project?.slug]);

  const nextProject = project
    ? PROJECTS[
        (PROJECTS.findIndex((p) => p.slug === project.slug) + 1) %
          PROJECTS.length
      ]
    : null;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="case-study"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="fixed inset-0 z-[80] bg-background"
        >
          {/* Reading progress */}
          <motion.div
            style={{ scaleX: progress }}
            className="fixed inset-x-0 top-0 z-20 h-[2px] origin-left bg-gradient-to-r from-rose to-azure"
          />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close case study"
            className="group fixed right-5 top-5 z-20 flex items-center gap-2 rounded-full border border-border bg-background/80 py-2 pl-4 pr-2 text-xs uppercase tracking-[0.15em] backdrop-blur-md transition-colors duration-300 hover:border-foreground/25 md:right-8 md:top-8"
          >
            Close
            <span className="grid size-7 place-items-center rounded-full bg-foreground text-background transition-transform duration-500 group-hover:rotate-90">
              <X className="size-3.5" />
            </span>
          </button>

          {/* Scroll container.
              data-lenis-prevent is required - without it Lenis swallows the
              wheel event and this never scrolls. */}
          <div
            ref={scrollRef}
            data-lenis-prevent
            className="h-full overflow-y-auto overscroll-contain"
          >
            <article className="mx-auto max-w-5xl px-5 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
              {/* ── Opening block: animates on mount ── */}
              <motion.div variants={introGroup} initial="hidden" animate="show">
                <motion.p variants={intro} className={META_LABEL}>
                  {project.n} — Case study
                </motion.p>

                <motion.h1
                  variants={intro}
                  className="mt-5 text-5xl font-semibold leading-[1.02] tracking-[-0.04em] md:text-7xl"
                >
                  {project.title}
                </motion.h1>

                <motion.p
                  variants={intro}
                  className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
                >
                  {project.description}
                </motion.p>

                <motion.dl
                  variants={intro}
                  className="mt-12 grid grid-cols-2 gap-6 border-y border-border py-7 md:grid-cols-4 md:gap-4"
                >
                  {[
                    { k: "Client", v: project.client },
                    { k: "Role", v: project.role },
                    { k: "Duration", v: project.duration },
                    { k: "Year", v: project.year },
                  ].map((m) => (
                    <div key={m.k}>
                      <dt className={META_LABEL}>{m.k}</dt>
                      <dd className="mt-2 text-sm font-medium md:text-base">
                        {m.v}
                      </dd>
                    </div>
                  ))}
                </motion.dl>
              </motion.div>

              {/* ── Cover with parallax ── */}
              <motion.div
                ref={coverRef}
                initial={{ clipPath: "inset(8% 8% 8% 8% round 24px)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 24px)" }}
                transition={{ duration: 1, delay: 0.5, ease: EASE }}
                className="relative mt-12 aspect-[16/10] overflow-hidden rounded-2xl md:rounded-3xl"
              >
                <motion.div
                  style={{ y: coverY }}
                  className="absolute -inset-y-[8%] inset-x-0"
                >
                  <Image
                    src={project.cover}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    placeholder="blur"
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* ── Overview ── */}
              <Section className="mt-16 md:mt-24">
                <motion.h2 variants={reveal} className={META_LABEL}>
                  Overview
                </motion.h2>
                <motion.p
                  variants={reveal}
                  className="mt-5 max-w-3xl text-xl leading-[1.5] tracking-tight md:text-2xl"
                >
                  {project.overview}
                </motion.p>
              </Section>

              {/* ── Challenge ── */}
              <Section className="mt-14 grid gap-6 border-t border-border pt-10 md:mt-20 md:grid-cols-12">
                <motion.h2
                  variants={reveal}
                  className={`${META_LABEL} md:col-span-3`}
                >
                  The challenge
                </motion.h2>
                <motion.p
                  variants={reveal}
                  className="text-base leading-relaxed text-muted md:col-span-9 md:text-lg"
                >
                  {project.challenge}
                </motion.p>
              </Section>

              {/* ── Approach ── */}
              <Section className="mt-14 grid gap-6 border-t border-border pt-10 md:mt-20 md:grid-cols-12">
                <motion.h2
                  variants={reveal}
                  className={`${META_LABEL} md:col-span-3`}
                >
                  What I did
                </motion.h2>
                <ol className="md:col-span-9">
                  {project.approach.map((step, i) => (
                    <motion.li
                      key={step}
                      variants={reveal}
                      className="flex gap-5 border-b border-border py-5 last:border-0"
                    >
                      <span className="shrink-0 text-xs tabular-nums text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base leading-relaxed md:text-lg">
                        {step}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </Section>

              {/* ── Outcomes ── */}
              <Section className="mt-14 border-t border-border pt-10 md:mt-20">
                <motion.h2 variants={reveal} className={META_LABEL}>
                  Outcome
                </motion.h2>
                <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
                  {project.outcomes.map((o) => (
                    <motion.div key={o.label} variants={reveal}>
                      <div className="text-4xl font-semibold tracking-[-0.03em] md:text-6xl">
                        {o.value}
                      </div>
                      <div className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted">
                        {o.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Section>

              {/* ── Tags + live link ── */}
              <Section className="mt-14 flex flex-wrap items-center gap-3 border-t border-border pt-10 md:mt-20">
                {project.tags.map((t) => (
                  <motion.span
                    key={t}
                    variants={reveal}
                    className="rounded-full bg-foreground/[0.04] px-3 py-1.5 text-xs text-muted"
                  >
                    {t}
                  </motion.span>
                ))}

                {project.live && (
                  <motion.a
                    variants={reveal}
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="magnetic"
                    className="group ml-auto inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
                  >
                    Visit site
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                )}
              </Section>

              {/* ── Next project ── */}
              {nextProject && (
                <Section className="mt-20 md:mt-28">
                  <motion.button
                    variants={reveal}
                    onClick={() => onNext(nextProject)}
                    data-cursor="magnetic"
                    className="group flex w-full items-end justify-between gap-6 border-t border-border pt-10 text-left"
                  >
                    <span className="block">
                      <span className={META_LABEL}>Next project</span>
                      <span className="mt-3 block text-3xl font-semibold tracking-[-0.03em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:text-5xl">
                        {nextProject.title}
                      </span>
                    </span>
                    <span className="mb-2 grid size-12 shrink-0 place-items-center rounded-full border border-border transition-colors duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background md:size-14">
                      <ArrowRight className="size-5" />
                    </span>
                  </motion.button>
                </Section>
              )}
            </article>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}