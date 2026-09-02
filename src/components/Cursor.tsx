"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const d = dot.current;
    const r = ring.current;
    const g = glow.current;
    if (!d || !r || !g) return;

    gsap.set([d, r, g], { xPercent: -50, yPercent: -50, opacity: 0 });

    /* Three trailing speeds - dot leads, ring follows, glow drifts */
    const dx = gsap.quickTo(d, "x", { duration: 0.1, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.1, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.45, ease: "power3" });
    const gx = gsap.quickTo(g, "x", { duration: 0.9, ease: "power2" });
    const gy = gsap.quickTo(g, "y", { duration: 0.9, ease: "power2" });

    const spin = gsap.to(r, {
      rotate: 360,
      duration: 8,
      repeat: -1,
      ease: "none",
    });

    let visible = false;
    let locked: DOMRect | null = null;

    const move = (e: MouseEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([d, r], { opacity: 1, duration: 0.35 });
        gsap.to(g, { opacity: 0.55, duration: 0.5 });
      }

      if (locked) {
        const cx = locked.left + locked.width / 2;
        const cy = locked.top + locked.height / 2;
        rx(cx);
        ry(cy);
        gx(cx);
        gy(cy);
        dx(cx + (e.clientX - cx) * 0.25);
        dy(cy + (e.clientY - cy) * 0.25);
        return;
      }

      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      gx(e.clientX);
      gy(e.clientY);
    };

    const lockTo = (el: Element) => {
      locked = el.getBoundingClientRect();
      gsap.to(r, {
        width: locked.width + 18,
        height: locked.height + 18,
        borderRadius: 999,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(g, {
        scale: 1.6,
        opacity: 0.75,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(d, { scale: 0, duration: 0.3, ease: "power3.out" });
      spin.timeScale(0.4);
    };

    const expand = () => {
      locked = null;
      gsap.to(r, {
        width: 58,
        height: 58,
        borderRadius: 999,
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
      gsap.to(g, {
        scale: 1.5,
        opacity: 0.7,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(d, { scale: 0.35, duration: 0.3, ease: "power3.out" });
      spin.timeScale(2.4);
    };

    const caret = () => {
      locked = null;
      gsap.to(r, {
        width: 3,
        height: 28,
        borderRadius: 2,
        duration: 0.35,
        ease: "power3.out",
      });
      gsap.to(g, { scale: 0.5, opacity: 0.35, duration: 0.4 });
      gsap.to(d, { scale: 0, duration: 0.2 });
      spin.timeScale(0);
    };

    const rest = () => {
      locked = null;
      gsap.to(r, {
        width: 36,
        height: 36,
        borderRadius: 999,
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(g, {
        scale: 1,
        opacity: 0.55,
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(d, { scale: 1, duration: 0.4, ease: "power3.out" });
      spin.timeScale(1);
    };

    const press = () => gsap.to([r, g], { scale: 0.85, duration: 0.2 });
    const release = () =>
      gsap.to([r, g], { scale: 1, duration: 0.4, ease: "back.out(2)" });

    const magnetic = document.querySelectorAll("[data-cursor='magnetic']");
    const links = document.querySelectorAll("a, button");
    const fields = document.querySelectorAll("input, textarea");

    const bind = (list: NodeListOf<Element>, onEnter: (el: Element) => void) => {
      const handlers = new Map<Element, () => void>();
      list.forEach((el) => {
        const h = () => onEnter(el);
        handlers.set(el, h);
        el.addEventListener("mouseenter", h);
        el.addEventListener("mouseleave", rest);
      });
      return () =>
        list.forEach((el) => {
          const h = handlers.get(el);
          if (h) el.removeEventListener("mouseenter", h);
          el.removeEventListener("mouseleave", rest);
        });
    };

    const un1 = bind(magnetic, lockTo);
    const un2 = bind(links, expand);
    const un3 = bind(fields, caret);

    const hide = () => gsap.to([d, r, g], { opacity: 0, duration: 0.25 });
    const show = () => {
      gsap.to([d, r], { opacity: 1, duration: 0.25 });
      gsap.to(g, { opacity: 0.55, duration: 0.25 });
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    return () => {
      spin.kill();
      un1();
      un2();
      un3();
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
    };
  }, []);

  return (
    <>
      <div
        ref={glow}
        className="pointer-events-none fixed left-0 top-0 z-[93] hidden size-[70px] rounded-full blur-[22px] md:block"
        style={{
          willChange: "transform",
          background:
            "radial-gradient(circle, rgba(255,2,94,0.55) 0%, rgba(0,159,252,0.35) 55%, transparent 72%)",
        }}
      />

      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[94] hidden size-[36px] rounded-full md:block"
        style={{
          willChange: "transform",
          padding: "1.5px",
          background: "conic-gradient(from 0deg, #FF025E, #009ffc, #FF025E)",
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden size-[6px] rounded-full md:block"
        style={{
          willChange: "transform",
          background: "linear-gradient(135deg, #FF025E, #009ffc)",
        }}
      />
    </>
  );
}