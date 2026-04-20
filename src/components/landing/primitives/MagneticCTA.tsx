"use client";

import { useEffect } from "react";

/**
 * Attaches pointer-magnet behavior to every .magnetic element in the landing root.
 * Pulls the element toward the cursor within a 90px radius, easing back on leave.
 */
export default function MagneticCTA() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const attach = () => {
      const els = document.querySelectorAll<HTMLElement>(".landing-root .magnetic");
      const handlers: { el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }[] = [];
      els.forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const radius = 90;
          if (dist > radius) {
            el.style.transform = "";
            return;
          }
          const strength = 1 - dist / radius;
          el.style.transform = `translate(${dx * strength * 0.35}px, ${dy * strength * 0.35}px)`;
        };
        const leave = () => {
          el.style.transform = "";
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        handlers.push({ el, move, leave });
      });
      return () => {
        handlers.forEach(({ el, move, leave }) => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
          el.style.transform = "";
        });
      };
    };

    // Defer one frame so all sections are mounted.
    let cleanup: (() => void) | undefined;
    const id = requestAnimationFrame(() => {
      cleanup = attach();
    });
    return () => {
      cancelAnimationFrame(id);
      cleanup?.();
    };
  }, []);

  return null;
}
