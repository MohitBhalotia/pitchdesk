"use client";

import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Reveal from "../primitives/Reveal";
import { defaultTestimonials, type Testimonial } from "data/testimonials";

function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} viewBox="0 0 24 24" fill={n <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function LandingTestimonials({
  testimonials = defaultTestimonials,
}: {
  testimonials?: Testimonial[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    if (!emblaApi) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), 3000);
    return () => window.clearInterval(id);
  }, [emblaApi]);

  const slides = [...testimonials, ...testimonials];

  return (
    <section className="testi">
      <div className="wrap">
        <Reveal className="sec-head" style={{ textAlign: "center", marginInline: "auto" }}>
          <div className="mono" style={{ justifyContent: "center" }}>
            07 — From the cohort
          </div>
          <h2>
            Founders who shipped pitch-ready, with <span className="grad">receipts.</span>
          </h2>
          <p>
            From AI-powered practice sessions to investor-ready decks — here&apos;s what
            the PitchDesk community has to say.
          </p>
        </Reveal>

        <div className="testi-rail">
          <div className="testi-viewport" ref={emblaRef} style={{ overflow: "hidden" }}>
            <div className="testi-track">
              {slides.map((t, i) => (
                <div className="tcard" key={`${t.name}-${i}`}>
                  <svg className="quote-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M9 7H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v3l4-3V9a2 2 0 0 0-2-2zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h2v3l4-3V9a2 2 0 0 0-2-2z" />
                  </svg>
                  <p className="txt">{t.text}</p>
                  <Stars rating={t.rating ?? 5} />
                  <div className="person">
                    <div className="avatar">
                      {t.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <div className="who">
                      <span className="name">{t.name}</span>
                      {t.role ? <span className="role">{t.role}</span> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
