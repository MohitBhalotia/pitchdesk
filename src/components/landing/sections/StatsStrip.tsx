"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  target: number;
  suffix?: string;
  label: string;
  format?: "k";
}

const STATS: Stat[] = [
  { target: 2400, format: "k", suffix: "+", label: "Founders trained in 12 months" },
  { target: 18, label: "AI VC personas on the panel" },
  { target: 94, suffix: "%", label: "Improved pitch score in 2 weeks" },
  { target: 30, suffix: "+", label: "Colleges + accelerators hosting" },
];

function formatValue(v: number, target: number, format?: "k") {
  if (format === "k" && v >= 1000) {
    const out = (v / 1000).toFixed(target >= 10000 ? 0 : 1).replace(/\.0$/, "");
    return `${out}k`;
  }
  return v.toLocaleString();
}

export default function StatsStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<number[]>(STATS.map(() => 0));
  const startedRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const duration = 1800;
            const start = performance.now();
            const tick = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setValues(STATS.map((s) => Math.round(s.target * eased)));
              if (t < 1) requestAnimationFrame(tick);
              else setValues(STATS.map((s) => s.target));
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="stats" ref={sectionRef}>
      <div className="stats-grid">
        {STATS.map((s, i) => (
          <div className="stat" key={s.label}>
            <div className="n">
              <span>{formatValue(values[i], s.target, s.format)}</span>
              {s.suffix ? <span className="suf">{s.suffix}</span> : null}
            </div>
            <div className="lab">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
