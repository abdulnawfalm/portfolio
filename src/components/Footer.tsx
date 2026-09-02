"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { ArrowUp, ArrowUpRight } from "lucide-react";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SOCIAL = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/abdulnawfal/" },
  { label: "Dribbble", href: "https://dribbble.com/abdulnawfal" },
  { label: "Behance", href: "https://www.behance.net/AbdulNawfal" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const MICRO = "text-[10px] uppercase tracking-[0.2em] text-muted";

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: Variants = {
  hidden: { y: 22, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: EASE } },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1.1, ease: EASE },
  },
};

/* ---------------- links ---------------- */

function Link({
  item: link,
  external = false,
}: {
  item: { label: string; href: string };
  external?: boolean;
}) {
  return (
    <motion.a
      variants={item}
      href={link.href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex w-fit items-center gap-1.5 py-1.5 text-sm text-muted transition-colors duration-300 hover:text-foreground"
    >
      <span className="relative">
        {link.label}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-foreground transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <ArrowUpRight className="size-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
    </motion.a>
  );
}

/* ---------------- section ---------------- */

export default function Footer() {
  const lenis = useLenis();
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="bg-background text-foreground">
      <motion.div
        variants={group}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-8%" }}
        className="mx-auto max-w-7xl px-5 pb-8 pt-20 md:px-8 md:pb-10 md:pt-28"
      >
        <motion.div
          variants={rule}
          style={{ transformOrigin: "left" }}
          className="h-px w-full bg-border"
        />

        {/* ── Statement + links ── */}
        <div className="grid gap-12 pt-14 md:grid-cols-12 md:gap-8 md:pt-20">
          {/* Statement */}
          <div className="md:col-span-6">
            <motion.p variants={item} className={MICRO}>
              Currently
            </motion.p>

            <motion.p
              variants={item}
              className="mt-5 max-w-md text-2xl font-medium leading-[1.3] tracking-[-0.02em] md:text-[2rem]"
            >
              Designing and building digital products open to new
              opportunities.
            </motion.p>

            <motion.span
              variants={item}
              className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-border py-2 pl-3.5 pr-5 text-sm text-muted"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-rose opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-rose" />
              </span>
              Open to relocate
            </motion.span>
          </div>

          {/* Navigate */}
          <div className="md:col-span-3">
            <motion.p variants={item} className={`mb-3 ${MICRO}`}>
              Navigate
            </motion.p>
            <nav className="flex flex-col">
              {LINKS.map((l) => (
                <Link key={l.href} item={l} />
              ))}
            </nav>
          </div>

          {/* Elsewhere */}
          <div className="md:col-span-3">
            <motion.p variants={item} className={`mb-3 ${MICRO}`}>
              Elsewhere
            </motion.p>
            <nav className="flex flex-col">
              {SOCIAL.map((l) => (
                <Link key={l.label} item={l} external />
              ))}
            </nav>
          </div>
        </div>

        {/* ── Baseline ── */}
        <motion.div
          variants={rule}
          style={{ transformOrigin: "left" }}
          className="mt-20 h-px w-full bg-border md:mt-28"
        />

        <div className="flex flex-col gap-4 pt-6 text-[10px] uppercase tracking-[0.2em] text-muted sm:flex-row sm:items-center sm:justify-between">
          <motion.span variants={item}>
            © {new Date().getFullYear()} Abdul Nawfal
          </motion.span>

          <motion.span variants={item} className="tabular-nums">
            Chennai, IN — {time} IST
          </motion.span>

          <motion.button
            variants={item}
            onClick={() => lenis?.scrollTo(0, { duration: 1.4 })}
            className="group flex items-center gap-2 uppercase tracking-[0.2em] transition-colors duration-300 hover:text-foreground"
          >
            Back to top
            <span className="grid size-6 place-items-center rounded-full border border-border transition-colors duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
              <ArrowUp className="size-2.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </span>
          </motion.button>
        </div>
      </motion.div>
    </footer>
  );
}