"use client";

import React from "react";

export interface SnapGuide {
  // 'v' = vertical line at x%, 'h' = horizontal line at y%
  orientation: "v" | "h";
  position: number; // 0–100 percent
}

interface SnapGuidesProps {
  guides: SnapGuide[];
  showGrid?: boolean;
}

export default function SnapGuides({ guides, showGrid }: SnapGuidesProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ zIndex: 9998 }}
    >
      {showGrid && (
        <g stroke="rgba(59,130,246,0.12)" strokeWidth="0.08" fill="none">
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 10).map((p) => (
            <React.Fragment key={`g-${p}`}>
              <line x1={p} y1={0} x2={p} y2={100} />
              <line x1={0} y1={p} x2={100} y2={p} />
            </React.Fragment>
          ))}
        </g>
      )}
      {guides.map((g, i) =>
        g.orientation === "v" ? (
          <line
            key={i}
            x1={g.position}
            y1={0}
            x2={g.position}
            y2={100}
            stroke="#ec4899"
            strokeWidth="0.15"
            strokeDasharray="1,0.5"
            vectorEffect="non-scaling-stroke"
          />
        ) : (
          <line
            key={i}
            x1={0}
            y1={g.position}
            x2={100}
            y2={g.position}
            stroke="#ec4899"
            strokeWidth="0.15"
            strokeDasharray="1,0.5"
            vectorEffect="non-scaling-stroke"
          />
        )
      )}
    </svg>
  );
}
