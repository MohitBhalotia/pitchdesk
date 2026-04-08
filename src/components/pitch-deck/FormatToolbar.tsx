"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import type { TextElement } from "@/types/slide-elements";

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
    "w-7 h-7 flex items-center justify-center rounded-full text-xs transition-colors hover:bg-muted";
  const btnActive = "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <div
      className="flex items-center gap-0.5 bg-white border shadow-md rounded-full px-2 py-1"
      style={style}
      onMouseDown={(e) => e.preventDefault()} // keep editor focused
    >
      {/* Bold */}
      <button
        className={`${btnBase} ${editor.isActive("bold") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3 w-3" />
      </button>

      {/* Italic */}
      <button
        className={`${btnBase} ${editor.isActive("italic") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3 w-3" />
      </button>

      {/* Underline */}
      <button
        className={`${btnBase} ${editor.isActive("underline") ? btnActive : ""}`}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-3 w-3" />
      </button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Align */}
      {(["left", "center", "right"] as const).map((align) => {
        const Icon =
          align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
        return (
          <button
            key={align}
            className={`${btnBase} ${editor.isActive({ textAlign: align }) ? btnActive : ""}`}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
          >
            <Icon className="h-3 w-3" />
          </button>
        );
      })}

      <div className="w-px h-4 bg-border mx-1" />

      {/* Text Color */}
      <label className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer hover:bg-muted relative">
        <input
          type="color"
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          value={element.color || "#ffffff"}
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
            onElementChange({ color: e.target.value });
          }}
        />
        <span
          className="w-4 h-4 rounded-full border border-border"
          style={{ background: element.color || "#ffffff" }}
        />
      </label>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Font Size */}
      <input
        type="number"
        min={8}
        max={200}
        value={element.fontSize || 16}
        className="w-10 h-6 text-xs border rounded text-center bg-transparent"
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 8 && val <= 200) onElementChange({ fontSize: val });
        }}
      />
    </div>
  );
}
