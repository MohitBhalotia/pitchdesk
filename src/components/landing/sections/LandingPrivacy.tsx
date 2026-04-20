"use client";

import Link from "next/link";
import Reveal from "../primitives/Reveal";

const CARDS = [
  {
    title: "Complete Confidentiality",
    body:
      "Your pitch decks, financial data, and business strategies stay strictly confidential. We never share, sell, or disclose your information.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Zero-Disclosure Policy",
    body:
      "No third-party sharing, no data mining, no cross-contamination. Your startup data is isolated and used only to serve you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: "You Own Your Data",
    body:
      "Full access, correction, and deletion rights. Your intellectual property remains yours, always.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function LandingPrivacy() {
  return (
    <section>
      <div className="wrap">
        <Reveal>
          <div className="priv-head">
            <div className="priv-shield">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2 L20 6 V12 C20 16.5 16.5 20 12 22 C7.5 20 4 16.5 4 12 V6 Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mono" style={{ color: "var(--lime)" }}>
              09 — Privacy first
            </div>
            <h2 style={{ textAlign: "center", fontSize: "clamp(36px, 4.4vw, 56px)" }}>
              Your startup data stays <span className="serif">yours.</span>
            </h2>
            <p>
              We understand that your startup&apos;s information is your most
              valuable asset. Your data stays confidential, secure, and
              completely under your control.
            </p>
          </div>
        </Reveal>

        <Reveal variant="reveal-stagger" className="premium-grid">
          {CARDS.map((c) => (
            <div className="pcard" key={c.title}>
              <div className="icn">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </Reveal>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <Link href="/privacy" className="btn btn-ghost">
            Read the full policy
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
        </div>
      </div>
    </section>
  );
}
