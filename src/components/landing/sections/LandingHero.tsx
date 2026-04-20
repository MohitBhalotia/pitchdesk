"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import Reveal from "../primitives/Reveal";
import Mascot from "./Mascot";

export default function LandingHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const orbs = document.querySelectorAll<HTMLDivElement>(".landing-root .orb");
    const onScroll = () => {
      const y = window.scrollY;
      orbs.forEach((o, i) => {
        const k = (i + 1) * 0.08;
        o.style.transform = `translateY(${y * k}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="hero" ref={heroRef}>
      <div className="hero-bg">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
      </div>

      <div className="hero-copy">
        <span className="eyebrow">
          <span className="dot-live" />
          <span>LIVE · Series Seed cohort open</span>
          <span className="sep" />
          <span className="mono" style={{ color: "var(--lime)" }}>
            v2.4
          </span>
        </span>
        <Reveal as="h1" variant="word-reveal" immediate>
          <span className="wr">
            <span>Face the</span>
          </span>{" "}
          <span className="wr">
            <span className="grad">AI&nbsp;VC.</span>
          </span>
          <br />
          <span className="wr">
            <span>Ship your</span>
          </span>{" "}
          <span className="wr">
            <span className="serif">pitch ready.</span>
          </span>
        </Reveal>
        <p className="hero-sub">
          Practice in front of an <strong>AI VC</strong> that cross-questions
          you like a real partner meeting. Get a brutal{" "}
          <strong>Pitch Score</strong>, timestamped weaknesses, and a 7-day
          sharpen roadmap — before the room that matters.
        </p>
        <div className="cta-row">
          <Link href="/signup" className="btn btn-primary magnetic">
            Practice a Pitch
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
          <a href="#how" className="btn btn-ghost">
            <span className="play-icn">
              <svg viewBox="0 0 8 8" aria-hidden="true">
                <path d="M1 0.5 L7 4 L1 7.5 Z" fill="currentColor" />
              </svg>
            </span>
            Watch Demo
          </a>
        </div>
        <div className="hero-trust">
          <div className="avatars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span>+</span>
          </div>
          <span>2,400+ founders in training</span>
          <span className="dot" />
          <span className="mono" style={{ color: "var(--lime)" }}>
            SOC 2 · ENCRYPTED
          </span>
        </div>
      </div>

      <Mascot />
    </header>
  );
}
