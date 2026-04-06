"use client";

import React from "react";
import type { TemplateMetadata } from "./templates/types";
import type {
  SlideElement,
  TextElement,
  ShapeElement,
  ImageElement,
} from "@/types/slide-elements";

interface ElementContentProps {
  element: SlideElement;
  themeColors: TemplateMetadata["colors"];
  isEditing: boolean;
  isSelected: boolean;
  onChange: (patch: Partial<SlideElement>) => void;
}

// ─── Theme color by role ───────────────────────────────────────────────────

function resolveTextColor(
  el: TextElement,
  colors: TemplateMetadata["colors"]
): string {
  if (el.color) return el.color;
  switch (el.role) {
    case "heading":
    case "subheading":
      return colors.text;
    case "metric-value":
    case "cta":
      return colors.accent;
    case "body":
    case "bullet-group":
    case "team-card":
    case "caption":
    case "metric-label":
    default:
      return colors.textSecondary;
  }
}

// ─── Text element ──────────────────────────────────────────────────────────

function TextContent({
  el,
  themeColors,
  isEditing,
  isSelected,
  onChange,
}: {
  el: TextElement;
  themeColors: TemplateMetadata["colors"];
  isEditing: boolean;
  isSelected: boolean;
  onChange: (patch: Partial<TextElement>) => void;
}) {
  const color = resolveTextColor(el, themeColors);
  const style: React.CSSProperties = {
    color,
    fontSize: el.fontSize ? `${el.fontSize}px` : undefined,
    fontWeight: el.fontWeight === "bold" ? "bold" : "normal",
    fontStyle: el.fontStyle === "italic" ? "italic" : "normal",
    textAlign: el.textAlign || "left",
    lineHeight: el.lineHeight || 1.4,
    width: "100%",
    height: "100%",
    overflow: "hidden",
  };

  if (el.role === "bullet-group") {
    const items = el.content.split("\n").filter(Boolean);
    return (
      <div style={{ ...style, overflow: "auto" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              marginBottom: "0.4em",
            }}
          >
            <span
              style={{
                color: themeColors.accent,
                marginRight: "0.5em",
                marginTop: "0.15em",
                flexShrink: 0,
                fontSize: el.fontSize ? `${el.fontSize * 0.7}px` : "12px",
              }}
            >
              ●
            </span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }

  if (el.role === "team-card") {
    const lines = el.content.split("\n").filter(Boolean);
    const [name, role, ...bioParts] = lines;
    const bio = bioParts.join(" ");
    return (
      <div
        style={{
          ...style,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          padding: "12px",
          background: themeColors.surface,
          borderRadius: "8px",
        }}
      >
        {name && (
          <div
            style={{
              fontWeight: "bold",
              fontSize: el.fontSize ? `${el.fontSize}px` : "16px",
              color: themeColors.text,
            }}
          >
            {name}
          </div>
        )}
        {role && (
          <div
            style={{
              fontSize: el.fontSize ? `${el.fontSize * 0.85}px` : "14px",
              color: themeColors.accent,
            }}
          >
            {role}
          </div>
        )}
        {bio && (
          <div
            style={{
              fontSize: el.fontSize ? `${el.fontSize * 0.75}px` : "12px",
              color: themeColors.textSecondary,
              marginTop: "4px",
            }}
          >
            {bio}
          </div>
        )}
      </div>
    );
  }

  // Regular text — contentEditable when editing and selected
  if (isEditing && isSelected) {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        style={{ ...style, outline: "none", cursor: "text" }}
        onBlur={(e) => {
          const newContent = e.currentTarget.innerText;
          if (newContent !== el.content) {
            onChange({ content: newContent } as Partial<TextElement>);
          }
        }}
        dangerouslySetInnerHTML={{ __html: el.content }}
      />
    );
  }

  return (
    <div style={style}>
      {el.content}
    </div>
  );
}

// ─── Shape element ─────────────────────────────────────────────────────────

function ShapeContent({
  el,
  themeColors,
}: {
  el: ShapeElement;
  themeColors: TemplateMetadata["colors"];
}) {
  const fill = el.fill || themeColors.primary;
  const stroke = el.stroke || "transparent";
  const strokeWidth = el.strokeWidth ?? 0;
  const opacity = el.opacity ?? 1;

  if (el.shape === "rect") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: fill,
          border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : "none",
          opacity,
          borderRadius: "4px",
        }}
      />
    );
  }

  if (el.shape === "circle") {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: fill,
          border: strokeWidth > 0 ? `${strokeWidth}px solid ${stroke}` : "none",
          opacity,
          borderRadius: "50%",
        }}
      />
    );
  }

  if (el.shape === "line") {
    return (
      <svg
        width="100%"
        height="100%"
        style={{ display: "block", opacity }}
      >
        <line
          x1="0"
          y1="50%"
          x2="100%"
          y2="50%"
          stroke={stroke || fill}
          strokeWidth={strokeWidth || 2}
        />
      </svg>
    );
  }

  return null;
}

// ─── Image element ─────────────────────────────────────────────────────────

function ImageContent({ el }: { el: ImageElement }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={el.imageUrl}
      alt=""
      style={{
        width: "100%",
        height: "100%",
        objectFit: el.objectFit || "contain",
        display: "block",
      }}
    />
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ElementContent({
  element,
  themeColors,
  isEditing,
  isSelected,
  onChange,
}: ElementContentProps) {
  if (element.type === "text") {
    return (
      <TextContent
        el={element as TextElement}
        themeColors={themeColors}
        isEditing={isEditing}
        isSelected={isSelected}
        onChange={onChange as (patch: Partial<TextElement>) => void}
      />
    );
  }

  if (element.type === "shape") {
    return (
      <ShapeContent
        el={element as ShapeElement}
        themeColors={themeColors}
      />
    );
  }

  if (element.type === "image") {
    return <ImageContent el={element as ImageElement} />;
  }

  return null;
}
