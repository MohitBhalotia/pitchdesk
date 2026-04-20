"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(loop);
    };

    const hotSelector =
      "a, button, .feat, .vc, .step, .bcard, .pcard, .inst-card, .env, .chip, .tcard, .pcard-price, .vcs-dot, input, textarea";
    const activate = () => ringRef.current?.classList.add("hot");
    const deactivate = () => ringRef.current?.classList.remove("hot");
    const bindHover = () => {
      document.querySelectorAll(hotSelector).forEach((el) => {
        el.addEventListener("mouseenter", activate);
        el.addEventListener("mouseleave", deactivate);
      });
    };
    const unbindHover = () => {
      document.querySelectorAll(hotSelector).forEach((el) => {
        el.removeEventListener("mouseenter", activate);
        el.removeEventListener("mouseleave", deactivate);
      });
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);

    // Bind after a frame so lazy-mounted sections are attached.
    const observer = new MutationObserver(() => {
      unbindHover();
      bindHover();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    bindHover();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
      unbindHover();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
