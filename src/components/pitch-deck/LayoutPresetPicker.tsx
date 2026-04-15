"use client";

import React from "react";
import { layoutPresets } from "@/data/layout-presets";

interface LayoutPresetPickerProps {
  onApply: (presetId: string) => void;
}

// ─── Micro SVG thumbnails representing each layout ────────────────────────────

const THUMBNAILS: Record<string, React.ReactNode> = {
  blank: (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
    </svg>
  ),
  "title-centered": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="15" y="14" width="50" height="7" rx="1" fill="#334155" />
      <rect x="22" y="25" width="36" height="4" rx="1" fill="#94a3b8" />
    </svg>
  ),
  "title-left": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="4" y="5" width="52" height="6" rx="1" fill="#334155" />
      <rect x="4" y="13" width="72" height="1.5" rx="1" fill="#3b82f6" />
      <rect x="4" y="18" width="72" height="3" rx="1" fill="#cbd5e1" />
      <rect x="4" y="24" width="72" height="3" rx="1" fill="#cbd5e1" />
      <rect x="4" y="30" width="60" height="3" rx="1" fill="#cbd5e1" />
    </svg>
  ),
  "two-column": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="4" y="5" width="34" height="5" rx="1" fill="#334155" />
      <rect x="4" y="13" width="34" height="3" rx="1" fill="#cbd5e1" />
      <rect x="4" y="19" width="34" height="3" rx="1" fill="#cbd5e1" />
      <rect x="4" y="25" width="28" height="3" rx="1" fill="#cbd5e1" />
      <line x1="42" y1="5" x2="42" y2="40" stroke="#e2e8f0" strokeWidth="1" />
      <rect x="45" y="5" width="31" height="5" rx="1" fill="#334155" />
      <rect x="45" y="13" width="31" height="3" rx="1" fill="#cbd5e1" />
      <rect x="45" y="19" width="31" height="3" rx="1" fill="#cbd5e1" />
      <rect x="45" y="25" width="24" height="3" rx="1" fill="#cbd5e1" />
    </svg>
  ),
  "problem-solution": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="3" y="4" width="34" height="5" rx="1" fill="#ef4444" opacity="0.7" />
      <rect x="3" y="12" width="34" height="3" rx="1" fill="#cbd5e1" />
      <rect x="3" y="18" width="28" height="3" rx="1" fill="#cbd5e1" />
      <rect x="3" y="24" width="32" height="3" rx="1" fill="#cbd5e1" />
      <rect x="43" y="4" width="34" height="5" rx="1" fill="#22c55e" opacity="0.7" />
      <rect x="43" y="12" width="34" height="3" rx="1" fill="#cbd5e1" />
      <rect x="43" y="18" width="28" height="3" rx="1" fill="#cbd5e1" />
      <rect x="43" y="24" width="32" height="3" rx="1" fill="#cbd5e1" />
    </svg>
  ),
  "image-left": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="2" y="3" width="32" height="39" rx="2" fill="#dbeafe" />
      <rect x="38" y="8" width="38" height="5" rx="1" fill="#334155" />
      <rect x="38" y="17" width="38" height="3" rx="1" fill="#cbd5e1" />
      <rect x="38" y="23" width="32" height="3" rx="1" fill="#cbd5e1" />
      <rect x="38" y="29" width="36" height="3" rx="1" fill="#cbd5e1" />
    </svg>
  ),
  "image-right": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="4" y="8" width="38" height="5" rx="1" fill="#334155" />
      <rect x="4" y="17" width="35" height="3" rx="1" fill="#cbd5e1" />
      <rect x="4" y="23" width="30" height="3" rx="1" fill="#cbd5e1" />
      <rect x="4" y="29" width="33" height="3" rx="1" fill="#cbd5e1" />
      <rect x="46" y="3" width="32" height="39" rx="2" fill="#dbeafe" />
    </svg>
  ),
  "full-image": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#dbeafe" rx="2" />
      <rect x="0" y="24" width="80" height="21" rx="0" fill="rgba(0,0,0,0.5)" />
      <rect x="10" y="28" width="60" height="6" rx="1" fill="white" opacity="0.9" />
      <rect x="20" y="37" width="40" height="3" rx="1" fill="white" opacity="0.6" />
    </svg>
  ),
  "big-number": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <text x="40" y="30" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#3b82f6">95%</text>
      <rect x="18" y="34" width="44" height="3" rx="1" fill="#94a3b8" />
    </svg>
  ),
  "three-stats": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="5" y="4" width="70" height="5" rx="1" fill="#334155" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={5 + i * 25} y="14" width="20" height="12" rx="1" fill="#3b82f6" opacity="0.15" />
          <rect x={8 + i * 25} y="16" width="14" height="6" rx="1" fill="#3b82f6" opacity="0.7" />
          <rect x={7 + i * 25} y="30" width="16" height="3" rx="1" fill="#94a3b8" />
        </g>
      ))}
    </svg>
  ),
  "four-metrics": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="10" y="3" width="60" height="5" rx="1" fill="#334155" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={3 + i * 19} y="13" width="16" height="16" rx="1" fill="#3b82f6" opacity="0.12" />
          <rect x={6 + i * 19} y="16" width="10" height="7" rx="1" fill="#3b82f6" opacity="0.6" />
          <rect x={4 + i * 19} y="32" width="14" height="3" rx="1" fill="#94a3b8" />
        </g>
      ))}
    </svg>
  ),
  "bullet-list": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="4" y="4" width="45" height="6" rx="1" fill="#334155" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="9" cy={17 + i * 7} r="2" fill="#3b82f6" />
          <rect x="14" y={14.5 + i * 7} width="54" height="3" rx="1" fill="#cbd5e1" />
        </g>
      ))}
    </svg>
  ),
  "numbered-steps": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="10" y="3" width="60" height="5" rx="1" fill="#334155" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={13 + i * 27} cy="20" r="6" fill="#3b82f6" />
          <text x={13 + i * 27} y="24" textAnchor="middle" fontSize="7" fontWeight="bold" fill="white">{i + 1}</text>
          <rect x={5 + i * 27} y="31" width="16" height="3" rx="1" fill="#94a3b8" />
          <rect x={5 + i * 27} y="37" width="14" height="2.5" rx="1" fill="#cbd5e1" />
        </g>
      ))}
      <line x1="19" y1="20" x2="40" y2="20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,1" />
      <line x1="46" y1="20" x2="67" y2="20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2,1" />
    </svg>
  ),
  "quote-card": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <text x="8" y="22" fontSize="24" fill="#3b82f6" opacity="0.4">&ldquo;</text>
      <rect x="14" y="11" width="56" height="3.5" rx="1" fill="#94a3b8" />
      <rect x="14" y="17" width="56" height="3.5" rx="1" fill="#94a3b8" />
      <rect x="14" y="23" width="40" height="3.5" rx="1" fill="#94a3b8" />
      <rect x="28" y="33" width="24" height="3" rx="1" fill="#cbd5e1" />
    </svg>
  ),
  "team-three": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="10" y="3" width="60" height="5" rx="1" fill="#334155" />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={5 + i * 25} y="12" width="18" height="16" rx="2" fill="#dbeafe" />
          <circle cx={14 + i * 25} cy="18" r="5" fill="#93c5fd" />
          <rect x={5 + i * 25} y="30" width="18" height="3" rx="1" fill="#334155" />
          <rect x={5 + i * 25} y="36" width="14" height="2.5" rx="1" fill="#cbd5e1" />
        </g>
      ))}
    </svg>
  ),
  "team-two": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="10" y="3" width="60" height="5" rx="1" fill="#334155" />
      <rect x="4" y="12" width="32" height="22" rx="2" fill="#dbeafe" />
      <circle cx="20" cy="22" r="7" fill="#93c5fd" />
      <rect x="4" y="37" width="32" height="3" rx="1" fill="#334155" />
      <rect x="44" y="12" width="32" height="22" rx="2" fill="#dbeafe" />
      <circle cx="60" cy="22" r="7" fill="#93c5fd" />
      <rect x="44" y="37" width="32" height="3" rx="1" fill="#334155" />
    </svg>
  ),
  timeline: (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="10" y="3" width="60" height="5" rx="1" fill="#334155" />
      <line x1="8" y1="24" x2="72" y2="24" stroke="#3b82f6" strokeWidth="1.5" />
      {[8, 24, 40, 56, 72].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="24" r="3.5" fill="#3b82f6" />
          <rect x={x - 6} y="30" width="12" height="3" rx="1" fill="#94a3b8" />
          <rect x={x - 5} y="35" width="10" height="2.5" rx="1" fill="#cbd5e1" />
        </g>
      ))}
    </svg>
  ),
  comparison: (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="10" y="2" width="60" height="5" rx="1" fill="#334155" />
      <rect x="2" y="10" width="36" height="7" rx="1" fill="#f1f5f9" />
      <rect x="42" y="10" width="36" height="7" rx="1" fill="#3b82f6" opacity="0.8" />
      <rect x="4" y="10.5" width="32" height="6" rx="1" fill="transparent" />
      <text x="20" y="16" textAnchor="middle" fontSize="5" fill="#64748b">Competitors</text>
      <text x="60" y="16" textAnchor="middle" fontSize="5" fill="white">Us</text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="4" y={20 + i * 5.5} width="32" height="3.5" rx="1" fill="#fee2e2" opacity="0.6" />
          <rect x="44" y={20 + i * 5.5} width="32" height="3.5" rx="1" fill="#dcfce7" opacity="0.6" />
        </g>
      ))}
    </svg>
  ),
  agenda: (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="4" y="3" width="30" height="7" rx="1" fill="#334155" />
      <line x1="4" y1="13" x2="36" y2="13" stroke="#3b82f6" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="4" y={17 + i * 5} width="7" height="3.5" rx="1" fill="#3b82f6" opacity="0.6" />
          <rect x="14" y={17 + i * 5} width="50" height="3.5" rx="1" fill="#cbd5e1" />
        </g>
      ))}
    </svg>
  ),
  swot: (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="5" y="1" width="70" height="5" rx="1" fill="#334155" />
      <rect x="2" y="9" width="36" height="16" rx="1" fill="#dbeafe" opacity="0.7" />
      <rect x="42" y="9" width="36" height="16" rx="1" fill="#fef3c7" opacity="0.7" />
      <rect x="2" y="28" width="36" height="16" rx="1" fill="#dcfce7" opacity="0.7" />
      <rect x="42" y="28" width="36" height="16" rx="1" fill="#fee2e2" opacity="0.7" />
      <text x="20" y="18" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#1d4ed8">Strengths</text>
      <text x="60" y="18" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#92400e">Weaknesses</text>
      <text x="20" y="37" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#166534">Opportunities</text>
      <text x="60" y="37" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#991b1b">Threats</text>
    </svg>
  ),
  "closing-cta": (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f8fafc" rx="2" />
      <rect x="8" y="10" width="64" height="7" rx="1" fill="#334155" />
      <rect x="8" y="20" width="64" height="4" rx="1" fill="#94a3b8" />
      <rect x="22" y="30" width="36" height="8" rx="2" fill="#3b82f6" />
      <rect x="26" y="32" width="28" height="4" rx="1" fill="white" opacity="0.8" />
    </svg>
  ),
};

function PresetThumbnail({ id }: { id: string }) {
  const thumb = THUMBNAILS[id];
  if (thumb) return <>{thumb}</>;
  // Generic fallback
  return (
    <svg viewBox="0 0 80 45" className="w-full h-full">
      <rect width="80" height="45" fill="#f1f5f9" rx="2" />
      <rect x="10" y="18" width="60" height="8" rx="1" fill="#94a3b8" />
    </svg>
  );
}

export default function LayoutPresetPicker({ onApply }: LayoutPresetPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {layoutPresets.map((preset) => (
        <button
          key={preset.id}
          className="flex flex-col items-center gap-1 p-1.5 rounded-lg border border-transparent hover:bg-accent hover:border-border transition-all cursor-pointer group"
          onClick={() => onApply(preset.id)}
          title={preset.description}
        >
          <div className="w-full rounded overflow-hidden border border-border/60 group-hover:border-primary/40 transition-colors">
            <PresetThumbnail id={preset.id} />
          </div>
          <span className="text-[10px] text-muted-foreground leading-tight text-center group-hover:text-foreground transition-colors">
            {preset.name}
          </span>
        </button>
      ))}
    </div>
  );
}
