"use client";

import Reveal from "../primitives/Reveal";

const LEADERBOARD = [
  { rank: 1, name: "Aventis Labs", sub: "health · seed", score: 94, top: true },
  { rank: 2, name: "Orbital.dev", sub: "devtools · pre-seed", score: 91 },
  { rank: 3, name: "Kindred AI", sub: "consumer · seed", score: 88 },
  { rank: 4, name: "Northbeam Co", sub: "fintech · pre-seed", score: 83 },
];

export default function Institutions() {
  return (
    <section id="institutions">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="mono">04 — For accelerators + colleges</div>
          <h2>
            Run smarter <span className="grad">competitions.</span>
          </h2>
          <p>
            Host demo days and first-round screens without the 80-hour judge
            grind. Scale, score, shortlist — in one environment.
          </p>
        </Reveal>

        <Reveal variant="reveal-stagger" className="inst-grid">
          <div className="inst-card">
            <div className="mono">LIVE</div>
            <h3>Live Leaderboard</h3>
            <p>Watch cohort rankings update in real time as founders practice.</p>
            <div className="lb">
              {LEADERBOARD.map((row) => (
                <div
                  key={row.rank}
                  className={`lb-row${row.top ? " top" : ""}`}
                >
                  <div className="lb-rank">{row.rank}</div>
                  <div>
                    <div className="lb-name">{row.name}</div>
                    <div className="lb-sub">{row.sub}</div>
                  </div>
                  <div className="lb-score">{row.score}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="inst-card">
            <div className="mono">AUTOMATED</div>
            <h3>First-Round Screening</h3>
            <p>
              Cut 1,200 applicants to 80 in an afternoon — with reasoning
              attached.
            </p>
            <div className="funnel">
              <div className="funnel-row">
                <span className="funnel-lab">Applied</span>
                <div className="funnel-bar f1">1,240</div>
              </div>
              <div className="funnel-row">
                <span className="funnel-lab">Qualified</span>
                <div className="funnel-bar f2">820</div>
              </div>
              <div className="funnel-row">
                <span className="funnel-lab">Round 2</span>
                <div className="funnel-bar f3">440</div>
              </div>
              <div className="funnel-row">
                <span className="funnel-lab">Shortlist</span>
                <div className="funnel-bar f4">80</div>
              </div>
            </div>
          </div>

          <div className="inst-card">
            <div className="mono">BRANDED</div>
            <h3>Custom Environments</h3>
            <p>Your logo, your rubric, your partners&apos; voices.</p>
            <div className="envs">
              <div className="env">
                <b>Y Forum &apos;26</b>
                <span>accelerator · 140</span>
              </div>
              <div className="env">
                <b>IIT Pitch Cup</b>
                <span>college · 62</span>
              </div>
              <div className="env">
                <b>Altus Ventures</b>
                <span>fund · 28</span>
              </div>
              <div className="env">
                <b>MIT Delta v</b>
                <span>university · 90</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
