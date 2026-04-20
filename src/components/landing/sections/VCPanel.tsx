"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Reveal from "../primitives/Reveal";
import { vcs, type VC } from "data/vc";

const truncate = (text: string, n = 140) =>
  text.length > n ? `${text.slice(0, n - 1).trim()}…` : text;

function VCCard({ vc, index }: { vc: VC; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 20, mass: 0.4 });
  const sy = useSpring(ry, { stiffness: 140, damping: 20, mass: 0.4 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    rx.set((e.clientX - r.left) / r.width - 0.5);
    ry.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.a
      ref={cardRef}
      className="vc"
      href={`/agent/${vc.agentLink}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
    >
      <span className="vc-corner">
        A-{String(index + 1).padStart(2, "0")}
      </span>
      <div className="vc-avatar">
        <Image
          src={vc.image}
          alt={vc.name}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 960px) 45vw, 30vw"
          priority={index < 3}
          style={{ objectFit: "cover" }}
        />
      </div>
      <span className="vc-tag">{vc.tags?.[0] ?? "VC Partner"}</span>
      <h3>{vc.name}</h3>
      <div className="role">{vc.title}</div>
      <div className="tagline">&ldquo;{vc.tagline}&rdquo;</div>
      <p className="blurb">{truncate(vc.shortDescription)}</p>
      <div className="vc-foot">
        <span>{vc.highlights.length} signature moves</span>
        <span className="go">
          Meet {vc.name.split(" ")[0]}
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 6h8M7 2l3 4-3 4"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </motion.a>
  );
}

export default function VCPanel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const pausedRef = useRef(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    const timer = window.setInterval(() => {
      if (pausedRef.current) return;
      emblaApi.scrollNext();
    }, 3800);
    return () => window.clearInterval(timer);
  }, [emblaApi]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <section>
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="mono">02 — Meet the panel</div>
          <h2>
            Seven <span className="grad">AI VCs.</span> Seven killer instincts.
          </h2>
          <p>
            Every persona is trained on a different partner archetype — from
            Sanjay&apos;s relentless grilling to Diya&apos;s retail intuition.
            Pick one. Or get grilled by the full panel.
          </p>
        </Reveal>

        <div
          className="vcs-rail"
          onMouseEnter={pause}
          onMouseLeave={resume}
          onFocusCapture={pause}
          onBlurCapture={resume}
        >
          <div className="vcs-viewport" ref={emblaRef}>
            <div className="vcs-track">
              {vcs.map((vc, i) => (
                <div className="vc-slide" key={vc.id}>
                  <VCCard vc={vc} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="vcs-dots" role="tablist" aria-label="VC carousel dots">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`vcs-dot${i === selectedIndex ? " active" : ""}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: 28,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Link
            href="/vc"
            className="btn btn-ghost"
            style={{ textTransform: "uppercase", letterSpacing: "0.06em", fontSize: 12 }}
          >
            Browse full panel
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
