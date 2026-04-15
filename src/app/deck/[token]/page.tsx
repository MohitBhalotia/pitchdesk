"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SlideRenderer from "@/components/pitch-deck/SlideRenderer";
import { migrateDeck } from "@/lib/slide-migration";

interface PublicSlide {
  slideType: string;
  order: number;
  elements?: unknown[];
  background?: string;
  [key: string]: unknown;
}

interface PublicDeck {
  _id: string;
  title: string;
  templateId: string;
  slides: PublicSlide[];
  defaultTransition?: string;
}

export default function PublicDeckPage() {
  const params = useParams();
  const token = params.token as string;
  const [deck, setDeck] = useState<PublicDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/pitch-deck/public/${token}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => {
        const migrated = migrateDeck(d.deck.slides);
        setDeck({ ...d.deck, slides: migrated });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  const goNext = useCallback(() => {
    if (!deck) return;
    setCurrentIndex((i) => Math.min(i + 1, deck.slides.length - 1));
  }, [deck]);
  const goPrev = useCallback(() => setCurrentIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading…</div>;
  }
  if (error || !deck) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">This deck is not available or sharing has been disabled.</div>;
  }

  const transition = deck.defaultTransition || "fade";
  const currentSlide = deck.slides[currentIndex];

  return (
    <div className="h-screen w-screen bg-black flex flex-col overflow-hidden select-none">
      <div className="flex-1 flex items-center justify-center p-4" onClick={goNext}>
        <div
          className={`w-full max-w-[calc(100vh*16/9)] relative transition-all duration-300 ${
            transition === "fade" ? "animate-fadeIn"
            : transition === "slide-left" ? "animate-slideInLeft"
            : transition === "slide-right" ? "animate-slideInRight"
            : transition === "zoom" ? "animate-zoomIn" : ""
          }`}
          key={currentIndex}
          onClick={(e) => e.stopPropagation()}
          style={{ aspectRatio: "16/9" }}
        >
          <SlideRenderer
            slide={currentSlide}
            templateId={deck.templateId}
            isEditing={false}
            exportMode={true}
            className="w-full h-full rounded-md shadow-2xl"
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-950/90 border-t border-white/5 text-white">
        <span className="text-white/60 text-sm truncate">{deck.title}</span>
        <div className="flex items-center gap-3">
          <button onClick={goPrev} disabled={currentIndex === 0} className="text-white/50 hover:text-white disabled:opacity-20">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm tabular-nums text-white/70">{currentIndex + 1} / {deck.slides.length}</span>
          <button onClick={goNext} disabled={currentIndex === deck.slides.length - 1} className="text-white/50 hover:text-white disabled:opacity-20">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <a href="/" className="text-white/40 text-xs hover:text-white/70">made with PitchDesk</a>
      </div>
      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(30px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-30px) } to { opacity: 1; transform: translateX(0) } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.96) } to { opacity: 1; transform: scale(1) } }
        .animate-fadeIn { animation: fadeIn .3s ease-out both; }
        .animate-slideInLeft { animation: slideInLeft .3s ease-out both; }
        .animate-slideInRight { animation: slideInRight .3s ease-out both; }
        .animate-zoomIn { animation: zoomIn .3s ease-out both; }
      `}</style>
    </div>
  );
}
