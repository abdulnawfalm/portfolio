"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLenis } from "lenis/react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
];

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WORDMARK = "NAWFAL";

/* ---------------- nav link ---------------- */

function NavLink({
  label,
  onClick,
  delay,
}: {
  label: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      initial={{ y: -14, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      onClick={onClick}
      className="group relative block overflow-hidden py-[3px] text-left text-sm tracking-tight"
    >
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">
        {label}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-y-full py-[3px] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0"
      >
        {label}
      </span>
    </motion.button>
  );
}

/* ---------------- header ---------------- */

export default function Header() {
  const [open, setOpen] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    if (open) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      if (href === "#top") {
        window.setTimeout(() => lenis?.scrollTo(0), 100);
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      window.setTimeout(() => {
        lenis?.scrollTo(target as HTMLElement, { offset: -40 });
      }, 100);
    },
    [lenis],
  );

  return (
    <>
      {/* mix-blend-difference inverts against whatever is underneath -
          white over the hero image, black over the white sections below */}
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <div className="mx-auto flex max-w-[96rem] items-start justify-between px-5 py-5 md:px-8 md:py-6">
          {/* Wordmark */}
          <motion.button
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: EASE }}
            onClick={() => lenis?.scrollTo(0)}
            className="pointer-events-auto text-sm font-semibold uppercase tracking-[0.02em]"
          >
            {WORDMARK}
            <sup className="ml-[1px] text-[0.6em]">®</sup>
          </motion.button>

          {/* Stacked nav - desktop */}
          <nav className="pointer-events-auto hidden flex-col items-start md:flex">
            {NAV.map((item, i) => (
              <NavLink
                key={item.href}
                label={item.label}
                onClick={() => go(item.href)}
                delay={0.18 + i * 0.06}
              />
            ))}
          </nav>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="pointer-events-auto relative z-50 -mr-1 -mt-1 grid size-8 place-items-center md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? "close" : "open"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-6 text-foreground md:hidden"
          >
            <nav className="flex flex-col">
              {NAV.map((item, i) => (
                <motion.button
                  key={item.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.07,
                    ease: EASE,
                  }}
                  onClick={() => go(item.href)}
                  className="border-b border-border py-5 text-left text-4xl font-semibold tracking-tight"
                >
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}