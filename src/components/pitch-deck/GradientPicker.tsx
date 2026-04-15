"use client";

import React, { useState } from "react";

interface GradientPickerProps {
  value: string;
  onChange: (value: string) => void;
}

// Preset gradients
const GRADIENT_PRESETS = [
  { label: "None (Theme)", value: "" },
  { label: "Midnight", value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { label: "Dark Slate", value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
  { label: "Deep Space", value: "linear-gradient(135deg, #000428 0%, #004e92 100%)" },
  { label: "Obsidian", value: "linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 100%)" },
  { label: "Night Sky", value: "linear-gradient(135deg, #141e30 0%, #243b55 100%)" },
  { label: "Ocean", value: "linear-gradient(135deg, #1a6b8a 0%, #0d3b55 100%)" },
  { label: "Forest", value: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { label: "Aurora", value: "linear-gradient(135deg, #0d324d 0%, #7f5a83 100%)" },
  { label: "Sunset", value: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)" },
  { label: "Coral", value: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)" },
  { label: "Berry", value: "linear-gradient(135deg, #6a3093 0%, #a044ff 100%)" },
  { label: "Rose Gold", value: "linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)" },
  { label: "Steel Blue", value: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)" },
  { label: "Emerald", value: "linear-gradient(135deg, #0f9b58 0%, #00bf8f 100%)" },
  { label: "Warm White", value: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)" },
  { label: "Ivory", value: "linear-gradient(135deg, #f8f3e3 0%, #f0ead2 100%)" },
  { label: "Cool Gray", value: "linear-gradient(135deg, #e8e8e8 0%, #d3d3d3 100%)" },
  { label: "Dusk", value: "linear-gradient(135deg, #2c3e50 0%, #fd746c 100%)" },
  { label: "Electric", value: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)" },
];

function isSolidColor(val: string) {
  return !val || (!val.includes("gradient") && !val.includes("linear") && !val.includes("radial"));
}

export default function GradientPicker({ value, onChange }: GradientPickerProps) {
  const [tab, setTab] = useState<"presets" | "solid" | "custom">("presets");
  const [customFrom, setCustomFrom] = useState("#1a1a2e");
  const [customTo, setCustomTo] = useState("#4776e6");
  const [customAngle, setCustomAngle] = useState(135);

  const solidColor = isSolidColor(value) ? value || "#ffffff" : "#ffffff";

  const applyCustom = () => {
    onChange(`linear-gradient(${customAngle}deg, ${customFrom} 0%, ${customTo} 100%)`);
  };

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex gap-1 text-xs">
        {(["presets", "solid", "custom"] as const).map((t) => (
          <button
            key={t}
            className={`flex-1 h-6 rounded capitalize transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "presets" && (
        <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-0.5">
          {GRADIENT_PRESETS.map((g) => (
            <button
              key={g.value}
              title={g.label}
              className={`h-8 rounded border-2 transition-all ${
                value === g.value ? "border-primary ring-1 ring-primary/30" : "border-transparent hover:border-border"
              }`}
              style={{
                background: g.value || "#f8f8f8",
                backgroundSize: "cover",
              }}
              onClick={() => onChange(g.value)}
            />
          ))}
        </div>
      )}

      {tab === "solid" && (
        <div className="flex items-center gap-2">
          <input
            type="color"
            className="w-10 h-8 rounded border cursor-pointer"
            value={solidColor}
            onChange={(e) => onChange(e.target.value)}
          />
          <div>
            <p className="text-xs text-muted-foreground">Pick a solid color</p>
            {value && (
              <button
                className="text-xs text-muted-foreground hover:text-foreground underline"
                onClick={() => onChange("")}
              >
                Reset to theme
              </button>
            )}
          </div>
        </div>
      )}

      {tab === "custom" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground block mb-1">From</label>
              <input
                type="color"
                className="w-full h-8 rounded border cursor-pointer"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground block mb-1">To</label>
              <input
                type="color"
                className="w-full h-8 rounded border cursor-pointer"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">Angle: {customAngle}°</label>
            <input
              type="range"
              min={0}
              max={360}
              value={customAngle}
              className="w-full"
              onChange={(e) => setCustomAngle(Number(e.target.value))}
            />
          </div>
          {/* Preview */}
          <div
            className="w-full h-10 rounded border"
            style={{ background: `linear-gradient(${customAngle}deg, ${customFrom} 0%, ${customTo} 100%)` }}
          />
          <button
            className="w-full h-7 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            onClick={applyCustom}
          >
            Apply Gradient
          </button>
        </div>
      )}

      {/* Current value display */}
      {value && (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border flex-shrink-0"
            style={{ background: value }}
          />
          <button
            className="text-xs text-muted-foreground hover:text-foreground underline"
            onClick={() => onChange("")}
          >
            Reset to theme default
          </button>
        </div>
      )}
    </div>
  );
}
