"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import type { TemplateMetadata } from "./templates/types";
import type {
  SlideElement,
  TextElement,
  ShapeElement,
  ImageElement,
} from "@/types/slide-elements";
import FormatToolbar from "./FormatToolbar";

interface ElementContentProps {
  element: SlideElement;
  themeColors: TemplateMetadata["colors"];
  isEditing: boolean;
  isSelected: boolean;
  isTextEditing: boolean;
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
  isTextEditing,
  onChange,
}: {
  el: TextElement;
  themeColors: TemplateMetadata["colors"];
  isTextEditing: boolean;
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

  // Bullet-group: keep structured plain-text rendering
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

  // Team-card: keep structured plain-text rendering
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

  // Regular text — Tiptap editor when in text-editing mode
  return (
    <TiptapTextContent
      el={el}
      color={color}
      style={style}
      isTextEditing={isTextEditing}
      onChange={onChange}
    />
  );
}

// Tiptap-based text content (separate component so hooks are always called)
function TiptapTextContent({
  el,
  color,
  style,
  isTextEditing,
  onChange,
}: {
  el: TextElement;
  color: string;
  style: React.CSSProperties;
  isTextEditing: boolean;
  onChange: (patch: Partial<TextElement>) => void;
}) {
  const buildStyleStr = () =>
    [
      `font-size:${el.fontSize || 16}px`,
      `color:${color}`,
      `text-align:${el.textAlign || "left"}`,
      `line-height:${el.lineHeight || 1.4}`,
      "outline:none",
      "width:100%",
      "height:100%",
    ].join(";");

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        TextStyle,
        Color,
        TextAlign.configure({ types: ["paragraph", "heading"] }),
        Underline,
      ],
      content: el.content || "",
      onUpdate: ({ editor }) => {
        onChange({ content: editor.getHTML() });
      },
      editorProps: {
        attributes: { style: buildStyleStr(), class: "tiptap-editor" },
      },
    },
    [el.id]
  );

  // Sync element-level style props (fontSize, color, align) back to editor when they change
  React.useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: { style: buildStyleStr(), class: "tiptap-editor" },
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, el.fontSize, color, el.textAlign, el.lineHeight]);

  if (isTextEditing && editor) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        {/* Floating format toolbar — above the element */}
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <FormatToolbar
            editor={editor}
            element={el}
            onElementChange={onChange}
          />
        </div>
        <EditorContent
          editor={editor}
          style={{
            ...style,
            cursor: "text",
            overflow: "auto",
          }}
        />
      </div>
    );
  }

  // View mode — render stored HTML (Tiptap-compatible or plain text)
  const isHtml = el.content.trimStart().startsWith("<");
  if (isHtml) {
    return (
      <div
        style={style}
        dangerouslySetInnerHTML={{ __html: el.content }}
      />
    );
  }
  return <div style={style}>{el.content}</div>;
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
  const markerId = `arrow-${el.id}`;

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
      <svg width="100%" height="100%" style={{ display: "block", opacity }}>
        <line
          x1="2"
          y1="50%"
          x2="98%"
          y2="50%"
          stroke={strokeWidth > 0 ? stroke : fill}
          strokeWidth={strokeWidth || 2}
        />
      </svg>
    );
  }

  if (el.shape === "arrow") {
    const arrowFill = strokeWidth > 0 ? stroke : fill;
    return (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        style={{ display: "block", opacity }}
      >
        <defs>
          <marker
            id={markerId}
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <polygon points="0 0, 8 4, 0 8" fill={arrowFill} />
          </marker>
        </defs>
        <line
          x1="2"
          y1="10"
          x2="90"
          y2="10"
          stroke={arrowFill}
          strokeWidth={strokeWidth || 2}
          markerEnd={`url(#${markerId})`}
        />
      </svg>
    );
  }

  return null;
}

// ─── Image element ─────────────────────────────────────────────────────────

function ImageContent({
  el,
  themeColors,
}: {
  el: ImageElement;
  themeColors: TemplateMetadata["colors"];
}) {
  if (!el.imageUrl) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: themeColors.surface,
          border: `2px dashed ${themeColors.textSecondary}`,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: themeColors.textSecondary, fontSize: 14 }}>
          Drop image here
        </span>
      </div>
    );
  }

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
  isTextEditing,
  onChange,
}: ElementContentProps) {
  if (element.type === "text") {
    return (
      <TextContent
        el={element as TextElement}
        themeColors={themeColors}
        isTextEditing={isTextEditing}
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
    return (
      <ImageContent
        el={element as ImageElement}
        themeColors={themeColors}
      />
    );
  }

  return null;
}
