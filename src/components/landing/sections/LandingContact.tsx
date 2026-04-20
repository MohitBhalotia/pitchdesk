"use client";

import { useState } from "react";
import Reveal from "../primitives/Reveal";

export default function LandingContact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contactUs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("send-failed");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <Reveal>
          <div className="contact-card">
            <div className="contact-form">
              <div className="mono" style={{ color: "var(--lime)" }}>
                10 — Get in touch
              </div>
              <h2>
                Contact <span className="grad">Us</span>
              </h2>
              <p style={{ color: "var(--text-dim)", fontSize: 14 }}>
                Partnerships, press, enterprise rollouts, or feedback — we read
                every note.
              </p>
              <form onSubmit={onSubmit}>
                <div className="row">
                  <div>
                    <label htmlFor="lp-name">Name</label>
                    <input
                      id="lp-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="lp-email">Email</label>
                    <input
                      id="lp-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jane@startup.co"
                    />
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label htmlFor="lp-msg">Message</label>
                  <textarea
                    id="lp-msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Tell us what you&apos;re building…"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginTop: 16, justifyContent: "center" }}
                  disabled={status === "sending"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : status === "sent"
                      ? "Message sent ✓"
                      : status === "error"
                        ? "Try again"
                        : "Send Message"}
                  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2 6h8M7 2l3 4-3 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className="contact-aside">
              <div className="mono" style={{ color: "var(--lime)" }}>
                PITCHDESK OPS
              </div>
              <h3>Pitch with Power.<br />Practice with AI.</h3>
              <p className="tag">
                &ldquo;The room where founders get ready.&rdquo; Drop us a line — we
                typically reply within one business day.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  color: "var(--text-dim)",
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                <span>hello@pitchdesk.in</span>
              </div>
              <div className="contact-orb" aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
