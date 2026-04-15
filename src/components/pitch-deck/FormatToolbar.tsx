"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Highlighter,
  Subscript,
  Superscript,
  CaseUpper,
} from "lucide-react";
import type { TextElement } from "@/types/slide-elements";

export const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Poppins", value: "Poppins" },
  { label: "Plus Jakarta Sans", value: "Plus Jakarta Sans" },
  { label: "Outfit", value: "Outfit" },
  { label: "DM Sans", value: "DM Sans" },
  { label: "Bricolage Grotesque", value: "Bricolage Grotesque" },
  { label: "Space Grotesk", value: "Space Grotesk" },
  { label: "Syne", value: "Syne" },
  { label: "Raleway", value: "Raleway" },
  { label: "Nunito", value: "Nunito" },
  { label: "Lato", value: "Lato" },
  { label: "Roboto", value: "Roboto" },
  { label: "Source Sans 3", value: "Source Sans 3" },
  { label: "Playfair Display", value: "Playfair Display" },
];

interface FormatToolbarProps {
  editor: Editor | null;
  element: TextElement;
  onElementChange: (patch: Partial<TextElement>) => void;
  style?: React.CSSProperties;
}

export default function FormatToolbar({
  editor,
  element,
  onElementChange,
  style,
}: FormatToolbarProps) {
  if (!editor) return null;

  const btnBase =
    "w-7 h-7 flex items-center justify-center rounded text-xs transition-colors hover:bg-slate-100";
  const btnActive = "bg-slate-800 text-white hover:bg-slate-700";

  const sep = <div className="w-px h-4 bg-slate-200 mx-0.5" />;

  return (
    <div
      className="flex items-center gap-0 bg-white border border-slate-200 shadow-lg rounded-lg px-1.5 py-1 flex-wrap"
      style={style}
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Heading levels */}
      {(["H1", "H2", "H3"] as const).map((level) => {
        const lvl = Number(level[1]) as 1 | 2 | 3;
        return (
          <button
            key={level}
            className={`${btnBase} w-8 font-bold text-[11px] ${editor.isActive("heading", { level: lvl }) ? btnActive : ""}`}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: lvl }).run()
            }
            title={`Heading ${lvl}`}
          >
            {level}
          </button>
        );
      })}

      {sep}

      {/* Bold */}
      <button
        className={`${btnBase} ${editor.isActive("bold") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold (Ctrl+B)"
      >
        <Bold className="h-3 w-3" />
      </button>

      {/* Italic */}
      <button
        className={`${btnBase} ${editor.isActive("italic") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic (Ctrl+I)"
      >
        <Italic className="h-3 w-3" />
      </button>

      {/* Underline */}
      <button
        className={`${btnBase} ${editor.isActive("underline") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline (Ctrl+U)"
      >
        <Underline className="h-3 w-3" />
      </button>

      {/* Strikethrough */}
      <button
        className={`${btnBase} ${editor.isActive("strike") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Strikethrough"
      >
        <Strikethrough className="h-3 w-3" />
      </button>

      {sep}

      {/* Bullet list */}
      <button
        className={`${btnBase} ${editor.isActive("bulletList") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet List"
      >
        <List className="h-3 w-3" />
      </button>

      {/* Ordered list */}
      <button
        className={`${btnBase} ${editor.isActive("orderedList") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered List"
      >
        <ListOrdered className="h-3 w-3" />
      </button>

      {sep}

      {/* Align */}
      {(["left", "center", "right"] as const).map((align) => {
        const Icon =
          align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
        return (
          <button
            key={align}
            className={`${btnBase} ${editor.isActive({ textAlign: align }) ? btnActive : ""}`}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
            title={`Align ${align}`}
          >
            <Icon className="h-3 w-3" />
          </button>
        );
      })}

      {sep}

      {/* Text Color */}
      <label
        className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-slate-100 relative"
        title="Text color"
      >
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={element.color || "#000000"}
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
            onElementChange({ color: e.target.value });
          }}
        />
        <div className="flex flex-col items-center justify-center gap-0.5">
          <span className="font-bold text-[10px] leading-none" style={{ color: element.color || "#000000" }}>A</span>
          <div className="w-3.5 h-1 rounded-sm" style={{ background: element.color || "#000000" }} />
        </div>
      </label>

      {sep}

      {/* Font Family */}
      <select
        className="h-6 text-xs border border-slate-200 rounded px-1 bg-white focus:outline-none focus:border-slate-400 max-w-[110px]"
        title="Font family"
        value={element.fontFamily || ""}
        style={{ fontFamily: element.fontFamily || "inherit" }}
        onChange={(e) => onElementChange({ fontFamily: e.target.value || undefined })}
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value} style={{ fontFamily: f.value || "inherit" }}>
            {f.label}
          </option>
        ))}
      </select>

      {sep}

      {/* Font Size */}
      <input
        type="number"
        min={8}
        max={200}
        value={element.fontSize || 16}
        className="w-10 h-6 text-xs border border-slate-200 rounded text-center bg-transparent focus:outline-none focus:border-slate-400"
        title="Font size (px)"
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 8 && val <= 200) onElementChange({ fontSize: val });
        }}
      />

      {sep}

      {/* Highlight color */}
      <label className="w-7 h-7 flex items-center justify-center rounded cursor-pointer hover:bg-slate-100 relative" title="Highlight">
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={element.highlight || "#fff59d"}
          onChange={(e) => onElementChange({ highlight: e.target.value })}
        />
        <Highlighter className="h-3 w-3" style={{ color: element.highlight || "#94a3b8" }} />
      </label>
      {element.highlight && (
        <button
          className={`${btnBase} text-[10px]`}
          title="Clear highlight"
          onClick={() => onElementChange({ highlight: undefined })}
        >
          ✕
        </button>
      )}

      {/* Subscript / Superscript */}
      <button
        className={`${btnBase} ${element.verticalAlign === "sub" ? btnActive : ""}`}
        title="Subscript"
        onClick={() => onElementChange({ verticalAlign: element.verticalAlign === "sub" ? undefined : "sub" })}
      >
        <Subscript className="h-3 w-3" />
      </button>
      <button
        className={`${btnBase} ${element.verticalAlign === "super" ? btnActive : ""}`}
        title="Superscript"
        onClick={() => onElementChange({ verticalAlign: element.verticalAlign === "super" ? undefined : "super" })}
      >
        <Superscript className="h-3 w-3" />
      </button>

      {/* All Caps */}
      <button
        className={`${btnBase} ${element.textTransform === "uppercase" ? btnActive : ""}`}
        title="All caps"
        onClick={() => onElementChange({ textTransform: element.textTransform === "uppercase" ? "none" : "uppercase" })}
      >
        <CaseUpper className="h-3 w-3" />
      </button>

      {sep}

      {/* Letter spacing */}
      <div className="flex items-center gap-1" title="Letter spacing (em)">
        <span className="text-[10px] text-slate-500">AV</span>
        <input
          type="number"
          step={0.01}
          min={-0.1}
          max={0.5}
          value={element.letterSpacing ?? 0}
          className="w-10 h-6 text-xs border border-slate-200 rounded text-center bg-transparent focus:outline-none focus:border-slate-400"
          onChange={(e) => {
            const v = Number(e.target.value);
            onElementChange({ letterSpacing: v === 0 ? undefined : v });
          }}
        />
      </div>
    </div>
  );
}
