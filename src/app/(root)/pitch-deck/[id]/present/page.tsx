"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  X,
  StickyNote,
  Maximize,
  Minimize,
} from "lucide-react";
import { toast } from "sonner";
import SlideRenderer from "@/components/pitch-deck/SlideRenderer";
import { migrateDeck } from "@/lib/slide-migration";

interface Slide {
  slideType: string;
  order: number;
  elements?: unknown[];
  background?: string;
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  notes?: string;
  [key: string]: unknown;
}

interface Deck {
  _id: string;
  title: string;
  templateId: string;
  slides: Slide[];
}

export default function PresentPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch deck
  useEffect(() => {
    async function fetchDeck() {
      try {
        const res = await fetch(`/api/pitch-deck/${deckId}`);
        if (!res.ok) throw new Error("Failed to fetch deck");
        const data = await res.json();
        const migratedSlides = migrateDeck(data.deck.slides);
        setDeck({ ...data.deck, slides: migratedSlides });
      } catch {
        toast.error("Failed to load deck");
        router.push(`/pitch-deck/${deckId}`);
      } finally {
        setLoading(false);
      }
    }
    fetchDeck();
  }, [deckId, router]);

  const goNext = useCallback(() => {
    if (!deck) return;
    setCurrentIndex((i) => Math.min(i + 1, deck.slides.length - 1));
  }, [deck]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          router.push(`/pitch-deck/${deckId}`);
        }
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "n" || e.key === "N") {
        setShowNotes((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, deckId, router]);

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!deck || deck.slides.length === 0) return null;

  const currentSlide = deck.slides[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === deck.slides.length - 1;

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen bg-black flex flex-col overflow-hidden select-none"
    >
      {/* Main slide area */}
      <div className="flex-1 flex items-center justify-center relative p-4"
        onClick={goNext}
        style={{ cursor: isLast ? "default" : "pointer" }}
      >
        {/* Slide */}
        <div
          className="w-full max-w-[calc(100vh*16/9)] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="transition-opacity duration-300"
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

        {/* Prev / Next clickable zones */}
        <button
          className="absolute left-0 top-0 h-full w-1/6 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity group"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          disabled={isFirst}
        >
          {!isFirst && (
            <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-colors">
              <ChevronLeft className="h-6 w-6 text-white" />
            </div>
          )}
        </button>
        <button
          className="absolute right-0 top-0 h-full w-1/6 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity group"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          disabled={isLast}
        >
          {!isLast && (
            <div className="bg-black/50 rounded-full p-3 group-hover:bg-black/70 transition-colors">
              <ChevronRight className="h-6 w-6 text-white" />
            </div>
          )}
        </button>
      </div>

      {/* Speaker notes */}
      {showNotes && currentSlide.notes && (
        <div className="bg-zinc-900 border-t border-white/10 px-6 py-4 max-h-40 overflow-y-auto">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2">Speaker Notes</p>
          <p className="text-sm text-white/80 leading-relaxed">{currentSlide.notes}</p>
        </div>
      )}

      {/* Bottom controls bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-zinc-950/90 border-t border-white/5">
        {/* Left: close + deck title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="text-white/50 hover:text-white transition-colors flex-shrink-0"
            onClick={() => router.push(`/pitch-deck/${deckId}`)}
            title="Back to editor (Esc)"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-white/60 text-sm truncate">{deck.title}</span>
        </div>

        {/* Center: slide dots + counter */}
        <div className="flex items-center gap-2">
          <button
            className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
            onClick={goPrev}
            disabled={isFirst}
            title="Previous (←)"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Slide dots — show up to 15, then just numbers */}
          {deck.slides.length <= 15 ? (
            <div className="flex items-center gap-1">
              {deck.slides.map((_, i) => (
                <button
                  key={i}
                  className={`rounded-full transition-all ${
                    i === currentIndex
                      ? "w-5 h-2 bg-white"
                      : "w-2 h-2 bg-white/30 hover:bg-white/60"
                  }`}
                  onClick={() => goTo(i)}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>
          ) : (
            <span className="text-white/70 text-sm tabular-nums px-2">
              {currentIndex + 1} / {deck.slides.length}
            </span>
          )}

          <button
            className="text-white/50 hover:text-white transition-colors disabled:opacity-20"
            onClick={goNext}
            disabled={isLast}
            title="Next (→)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Right: notes toggle + fullscreen */}
        <div className="flex items-center gap-2">
          <button
            className={`transition-colors flex items-center gap-1.5 text-xs px-2 py-1 rounded ${
              showNotes ? "text-white bg-white/15" : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            onClick={() => setShowNotes((v) => !v)}
            title="Toggle notes (N)"
          >
            <StickyNote className="h-3.5 w-3.5" />
            Notes
          </button>
          <button
            className="text-white/50 hover:text-white transition-colors"
            onClick={toggleFullscreen}
            title="Toggle fullscreen (F)"
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Keyboard hint (shown briefly on load) */}
    </div>
  );
}
