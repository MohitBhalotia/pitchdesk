"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LandingFooter() {
  const wordRef = useRef<HTMLDivElement>(null);
  const footRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const foot = footRef.current;
    const word = wordRef.current;
    if (!foot || !word) return;
    const onScroll = () => {
      const r = foot.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress: 0 when footer top hits viewport bottom, 1 when it hits viewport top
      const p = Math.min(1, Math.max(0, 1 - r.top / vh));
      const translateY = -p * 40;
      const letterSpacing = -0.06 + p * 0.02; // -0.06em → -0.04em (widens slightly)
      word.style.transform = `translateY(${translateY}px)`;
      word.style.letterSpacing = `${letterSpacing}em`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="landing-footer" ref={footRef}>
      <div className="foot">
        <div>
          <div className="foot-brand">
            <span className="logo-mark">
              <span>P</span>
            </span>{" "}
            PitchDesk
          </div>
          <div className="foot-tag">
            &ldquo;The room where founders get ready.&rdquo;
          </div>
          <div className="socials">
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2H21l-6.52 7.45L22 22h-6.156l-4.82-6.3L5.4 22H2.64l6.97-7.97L2 2h6.31l4.36 5.77L18.244 2Zm-1.08 18h1.69L7.92 4H6.11l11.054 16Z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5c0 1.38-1.11 2.5-2.49 2.5S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5ZM.23 21.5h4.53V8.2H.23v13.3ZM8.34 8.2h4.33v1.82h.06c.6-1.13 2.07-2.32 4.27-2.32 4.56 0 5.4 3 5.4 6.9v7.9h-4.51v-7c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7v7.12H8.34V8.2Z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1c.34-1.92.5-3.86.5-5.8 0-1.94-.16-3.88-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4>Product</h4>
          <ul>
            <li>
              <Link href="/dashboard">Practice</Link>
            </li>
            <li>
              <Link href="/evaluation">Pitch Score</Link>
            </li>
            <li>
              <Link href="/dashboard">Deck Builder</Link>
            </li>
            <li>
              <Link href="/vc">AI VC Panel</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>For Teams</h4>
          <ul>
            <li>
              <Link href="/competitions">Colleges</Link>
            </li>
            <li>
              <Link href="/incubations">Accelerators</Link>
            </li>
            <li>
              <Link href="/vc">Funds</Link>
            </li>
            <li>
              <Link href="/investors">Enterprise</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="giant-wordmark" ref={wordRef}>
        <span className="grad">PITCHDESK</span>
      </div>
      <div className="foot-bot">
        <span>© 2025 PITCHDESK.IN — MADE FOR THE 3AM REHEARSAL</span>
        <span>PRIVACY · TERMS · TRUST</span>
      </div>
    </footer>
  );
}
