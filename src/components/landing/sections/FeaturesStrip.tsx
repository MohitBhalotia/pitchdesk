"use client";

import Link from "next/link";
import Reveal from "../primitives/Reveal";

interface Feat {
  tag: string;
  title: string;
  desc: string;
  href: string;
  icon: React.ReactNode;
}

const FEATS: Feat[] = [
  {
    tag: "BUILDER",
    title: "Pitch Deck Builder",
    desc: "Slide-by-slide AI co-pilot that flags weak narratives and suggests replacements, with real VC deck examples.",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 8h10M7 12h6M7 16h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: "SCRIPT",
    title: "Pitch Script Generator",
    desc: "Personalized 3/5/10-minute scripts from your deck — with transitions and the three hardest Q&A moments baked in.",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 4h11l3 3v13H5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M16 4v3h3M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    tag: "HOSTING",
    title: "Competition Hosting",
    desc: "Host your own pitch cup end-to-end — applications, rounds, judging, winner reveal. Branded, recorded, clipped.",
    href: "/competitions",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 3v5a6 6 0 0 0 12 0V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M4 3h16M9 21h6M12 17v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function FeaturesStrip() {
  return (
    <section>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="mono">06 — Also on the desk</div>
          <h2>
            The rest of your <span className="serif">prep kit.</span>
          </h2>
        </Reveal>

        <Reveal variant="reveal-stagger" className="features">
          {FEATS.map((f) => (
            <Link href={f.href} className="feat" key={f.title}>
              <div className="top">
                <span className="ico">{f.icon}</span>
                <span className="arr">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 10 L10 2 M4 2 H10 V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
              <span className="mono" style={{ color: "var(--lime)" }}>
                {f.tag}
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
