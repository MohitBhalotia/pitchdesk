"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = Math.min(1, Math.max(0, window.scrollY / Math.max(1, max)));
      if (fillRef.current) {
        fillRef.current.style.width = `${pct * 100}%`;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="progress-bar" aria-hidden="true">
      <div ref={fillRef} className="progress-fill" />
    </div>
  );
}
