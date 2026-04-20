"use client";

import Link from "next/link";
import Reveal from "../primitives/Reveal";

export default function InvestorsPremium() {
  return (
    <section id="investors">
      <div className="wrap">
        <Reveal>
          <div className="premium">
            <div className="sec-head" style={{ marginBottom: 0 }}>
              <span className="premium-badge">
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--lime)",
                    boxShadow: "0 0 8px var(--lime)",
                  }}
                />
                05 — FOR INVESTORS · PREMIUM TIER
              </span>
              <h2>
                Build your <span className="serif">AI clone.</span>
              </h2>
              <p>
                Let founders practice with <em>you</em> — at scale. Our premium
                tier lets partners and funds host always-on pitch environments
                powered by their own voice and thesis.
              </p>
            </div>
            <div className="premium-grid">
              <div className="pcard">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M12 2 L20 7 V17 L12 22 L4 17 V7 Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="3" fill="currentColor" />
                  </svg>
                </div>
                <h3>Clone Setup</h3>
                <p>
                  90-minute interview trains a persona on your thesis, voice,
                  and typical partner questions. Review, approve, deploy.
                </p>
              </div>
              <div className="pcard">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M3 10h18M8 14h5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Program Hosting</h3>
                <p>
                  Invite-only pitch rooms for your portfolio, LP demo days, or
                  scout pipeline. Full analytics + replay.
                </p>
              </div>
              <div className="pcard">
                <div className="icn">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 18v-4a8 8 0 1 1 16 0v4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="12"
                      cy="10"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M8 20h8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <h3>Prepared Founder Pipeline</h3>
                <p>
                  Inbound from founders who&apos;ve already been graded. See the
                  score before you take the first call.
                </p>
              </div>
            </div>
            <div className="premium-cta">
              <Link href="/vc" className="btn btn-primary">
                Apply for Invite
                <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path
                    d="M2 6h8M7 2l3 4-3 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <small>$24K / YR · 18 FUNDS WAITLISTED</small>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
