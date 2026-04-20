"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <Link href="#" className="nav-brand" aria-label="PitchDesk home">
        <span className="logo-mark">
          <span>P</span>
        </span>
        PitchDesk
      </Link>
      <div className="nav-links">
        <a href="#how">Features</a>
        <a href="#investors">For Investors</a>
        <a href="#institutions">Competitions</a>
        <a href="#pricing">Pricing</a>
      </div>
      <Link href="/signup" className="nav-cta">
        Start Pitching Free
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
    </nav>
  );
}
