"use client";

import Link from "next/link";
import Reveal from "../primitives/Reveal";

export default function Finale() {
  return (
    <section className="finale" id="finale">
      <div className="wrap">
        <Reveal>
          <h2>
            Your next investor meeting
            <br />
            <span className="grad">starts here.</span>
          </h2>
          <p>
            Practice free. Pay only when you want a full Pitch Score or a panel
            session. No deck required to start.
          </p>
          <div className="cta-row">
            <Link href="/signup" className="btn btn-primary">
              Start for Free
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
            <a href="#investors" className="btn btn-ghost">
              Partner With Us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
