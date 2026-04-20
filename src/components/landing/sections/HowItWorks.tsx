"use client";

import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import Reveal from "../primitives/Reveal";

const trackGlow = (e: ReactMouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
  card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
};

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="mono">01 — How it works</div>
          <h2>
            Three steps between you and a <span className="serif">term sheet.</span>
          </h2>
          <p>
            Record once. Get torn apart. Come back sharper. PitchDesk compresses
            months of coaching reps into a single afternoon.
          </p>
        </Reveal>

        <Reveal variant="reveal-stagger" className="steps">
          <div className="step" onMouseMove={trackGlow}>
            <div className="step-num">
              01 <small>RECORD</small>
            </div>
            <h3>Record your voice pitch</h3>
            <p>
              Open your deck, hit record, and talk. No timer stress — speak like
              you&apos;re in the room, not reading a script.
            </p>
            <div className="illus">
              <div className="wave" aria-hidden="true">
                {[30, 46, 22, 52, 36, 48, 28, 54, 40, 34, 50, 26, 44, 32, 48].map(
                  (h, i) => (
                    <span
                      key={i}
                      style={
                        {
                          ["--h" as unknown as string]: `${h}px`,
                          animationDelay: `${-0.1 - (i % 6) * 0.1}s`,
                        } as CSSProperties
                      }
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <div className="step" onMouseMove={trackGlow}>
            <div className="step-num">
              02 <small>GRILL</small>
            </div>
            <h3>AI VC cross-questions you, live</h3>
            <p>
              Follow-ups on traction, moat, burn, churn, TAM math. Not canned —
              adaptive, personality-driven, brutal.
            </p>
            <div
              className="illus"
              style={{
                padding: 14,
                alignItems: "flex-start",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <div className="bubbles">
                <div className="bub me">Pre-revenue but 12 LOIs.</div>
                <div className="bub ai">Signed, or handshake?</div>
                <div className="bub me">Signed. 40% conversion.</div>
                <div className="bub ai">Source of the 40%?</div>
              </div>
            </div>
          </div>

          <div className="step" onMouseMove={trackGlow}>
            <div className="step-num">
              03 <small>SCORE</small>
            </div>
            <h3>Pitch Score + roadmap</h3>
            <p>
              A 0–100 score across four axes, every weakness timestamped, and a
              7-day plan to close the gap.
            </p>
            <div className="illus" style={{ padding: 14 }}>
              <div className="score-mini">
                <div className="score-circle">
                  <span>85</span>
                </div>
                <div className="score-meta">
                  <span className="k">Pitch Score</span>
                  <span className="v">Strong Narrative</span>
                  <span className="k" style={{ marginTop: 6 }}>
                    Next up
                  </span>
                  <span className="v hi">Tighten TAM math</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
