"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "../primitives/Reveal";

interface BreakdownItem {
  label: string;
  target: number;
  sub: string;
}

const BREAKDOWN: BreakdownItem[] = [
  { label: "Clarity", target: 92, sub: "Story is tight. One filler word per 45s." },
  { label: "Market Insight", target: 78, sub: "TAM math needs sourcing. Competitor map thin." },
  { label: "Traction", target: 88, sub: "24% MoM for 3 quarters. Believable cohort." },
  { label: "Delivery", target: 82, sub: "Confident pace. Watch um-stacking at min 4." },
];

const TARGET = 85;

export default function PitchScore() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress = 0 when section top enters viewport bottom, 1 when section top is at viewport top.
      const raw = 1 - rect.top / (vh * 0.6);
      const clamped = Math.min(1, Math.max(0, raw));
      setProgress(clamped);
      if (clamped > 0.15 && !fired) setFired(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [fired]);

  const displayedScore = Math.round(TARGET * progress);
  const arcOffset = 100 - TARGET * progress;

  return (
    <section ref={sectionRef}>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="mono">03 — Pitch Score™</div>
          <h2>
            A score, not a <span className="serif">vibe check.</span>
          </h2>
          <p>
            Every answer is graded across four axes that partners actually
            weigh. No hand-waving. Just the numbers.
          </p>
        </Reveal>

        <div className="score-row">
          <Reveal>
            <div className="score-big">
              <svg viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="lpScoreGrad" x1="0" x2="1">
                    <stop offset="0" stopColor="#D7FF4F" />
                    <stop offset=".6" stopColor="#4FD6FF" />
                    <stop offset="1" stopColor="#9B7CFF" />
                  </linearGradient>
                </defs>
                <circle className="ring-bg" cx="100" cy="100" r="88" />
                <circle
                  className="ring-fg"
                  cx="100"
                  cy="100"
                  r="88"
                  pathLength={100}
                  strokeDasharray={100}
                  strokeDashoffset={arcOffset}
                />
              </svg>
              <div className="center">
                <div>
                  <span className="num">{displayedScore}</span>
                  <span className="num-max">/100</span>
                </div>
                <div className="lab">PITCH SCORE · GRADE A–</div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="reveal-stagger" className="breakdown">
            {BREAKDOWN.map((b) => {
              const pct = Math.round(b.target * progress);
              return (
                <div key={b.label} className="bcard">
                  <div className="bh">
                    <h4>{b.label}</h4>
                    <div className="pct">{pct}</div>
                  </div>
                  <div className="bar">
                    <i style={{ width: `${b.target * progress}%` }} />
                  </div>
                  <div className="sub">{b.sub}</div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
