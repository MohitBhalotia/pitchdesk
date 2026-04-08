"use client";

import React from "react";
import { layoutPresets } from "@/data/layout-presets";
interface LayoutPresetPickerProps {
  onApply: (presetId: string) => void;
}

export default function LayoutPresetPicker({
  onApply,
}: LayoutPresetPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {layoutPresets.map((preset) => (
        <button
          key={preset.id}
          className="flex flex-col items-center gap-1 p-2 rounded-lg border border-transparent hover:bg-muted hover:border-border transition-colors cursor-pointer text-center"
          onClick={() => onApply(preset.id)}
          title={preset.name}
        >
          <span className="text-xl leading-none">{preset.icon}</span>
          <span className="text-[10px] text-muted-foreground leading-tight">{preset.name}</span>
        </button>
      ))}
    </div>
  );
}
