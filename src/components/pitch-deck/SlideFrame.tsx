"use client";

import React, { useRef, useEffect, useState } from "react";

interface SlideFrameProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  slideRef?: React.Ref<HTMLDivElement>;
}

const SLIDE_WIDTH = 1280;
const SLIDE_HEIGHT = 720;

export default function SlideFrame({ children, className = "", onClick, slideRef }: SlideFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const scaleX = width / SLIDE_WIDTH;
        const scaleY = height / SLIDE_HEIGHT;
        setScale(Math.min(scaleX, scaleY));
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: "16/9" }}
      onClick={onClick}
    >
      <div
        ref={slideRef}
        className="absolute origin-top-left"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <div className="w-full h-full relative overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export { SLIDE_WIDTH, SLIDE_HEIGHT };
