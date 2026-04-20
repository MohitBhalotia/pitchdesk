"use client";

import Link from "next/link";
import { plans, type Plan } from "data/plans";
import { useSession } from "next-auth/react";
import Reveal from "../primitives/Reveal";

const EARLY_BIRD_DISCOUNT = 0.5;
const EARLY_BIRD_EXPIRY = new Date("2025-12-31");
const isEarlyBirdActive = new Date() < EARLY_BIRD_EXPIRY;

export default function LandingPricing() {
  const { data: session } = useSession();
  const user = session?.user as { role?: string } | undefined;

  const allPlans: Plan[] = Object.values(plans);

  return (
    <section id="pricing">
      <div className="wrap">
        <Reveal className="sec-head" style={{ textAlign: "center", margin: "0 auto 48px" }}>
          <div className="mono" style={{ justifyContent: "center" }}>
            08 — Pricing
          </div>
          <h2 style={{ textAlign: "center" }}>
            Start free. Pay only when <span className="grad">you&apos;re ready.</span>
          </h2>
          <p style={{ margin: "0 auto", textAlign: "center" }}>
            Transparent tiers that scale with your prep. No hidden fees, no
            surprises.
          </p>
        </Reveal>

        {isEarlyBirdActive ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <span className="early-bird">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
              </svg>
              Early Bird · 50% off all plans till{" "}
              {EARLY_BIRD_EXPIRY.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
        ) : null}

        <Reveal variant="reveal-stagger" className="pricing-grid" style={{ marginTop: 36 }}>
          {allPlans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.price;
            const isCurrent = user?.role === plan.id;
            const discounted = isEarlyBirdActive && price > 0 ? price * EARLY_BIRD_DISCOUNT : null;
            return (
              <div
                key={plan.id}
                className={`pcard-price${plan.popular ? " popular" : ""}`}
              >
                {plan.popular ? <span className="ribbon">Popular</span> : null}
                <div className="p-name">
                  <span className="ico">
                    <Icon size={16} />
                  </span>
                  {plan.name}
                </div>
                <p className="p-desc">{plan.description}</p>
                <div className="p-price">
                  {price === 0 ? (
                    <span className="amt">Free</span>
                  ) : (
                    <>
                      {discounted !== null ? (
                        <span className="strike">${price}</span>
                      ) : null}
                      <span className="amt">
                        ${discounted !== null ? discounted : price}
                      </span>
                      <span className="cycle">/mo</span>
                    </>
                  )}
                </div>
                <div className="p-minutes">{plan.minutes} min · practice time</div>
                <ul>
                  {plan.features.slice(0, 7).map((f, idx) => (
                    <li key={idx} className={f.included ? undefined : "off"}>
                      <span className="mark">
                        {f.included ? (
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                          </svg>
                        )}
                      </span>
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                {isCurrent ? (
                  <span className="p-cta" style={{ opacity: 0.8 }}>
                    Current Plan
                  </span>
                ) : (
                  <Link href={user ? "/payment" : "/login"} className="p-cta">
                    {plan.cta}
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6h8M7 2l3 4-3 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
