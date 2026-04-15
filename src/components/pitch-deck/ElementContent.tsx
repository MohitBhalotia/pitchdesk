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
  ChartElement,
  TableElement,
  IconElement,
} from "@/types/slide-elements";
import FormatToolbar from "./FormatToolbar";
import { ICON_CATALOG } from "./IconPicker";

interface ElementContentProps {
  element: SlideElement;
  themeColors: TemplateMetadata["colors"];
  isEditing: boolean;
  isSelected: boolean;
  isTextEditing: boolean;
  onChange: (patch: Partial<SlideElement>) => void;
}

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
    default:
      return colors.textSecondary;
  }
}

function buildTextShadow(el: TextElement): string | undefined {
  if (!el.textShadow) return undefined;
  const { x, y, blur, color } = el.textShadow;
  return `${x}px ${y}px ${blur}px ${color}`;
}

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
  const verticalAlign = el.verticalAlign && el.verticalAlign !== "script-baseline" ? el.verticalAlign : undefined;
  const style: React.CSSProperties = {
    color,
    fontSize: el.fontSize ? `${el.fontSize}px` : undefined,
    fontWeight: el.fontWeight === "bold" ? "bold" : "normal",
    fontStyle: el.fontStyle === "italic" ? "italic" : "normal",
    textAlign: el.textAlign || "left",
    lineHeight: el.lineHeight || 1.4,
    fontFamily: el.fontFamily ? `'${el.fontFamily}', sans-serif` : undefined,
    letterSpacing: el.letterSpacing ? `${el.letterSpacing}em` : undefined,
    textShadow: buildTextShadow(el),
    background: el.highlight || undefined,
    textTransform: el.textTransform && el.textTransform !== "none" ? el.textTransform : undefined,
    verticalAlign,
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
          <div style={{ fontWeight: "bold", fontSize: el.fontSize ? `${el.fontSize}px` : "16px", color: themeColors.text }}>
            {name}
          </div>
        )}
        {role && (
          <div style={{ fontSize: el.fontSize ? `${el.fontSize * 0.85}px` : "14px", color: themeColors.accent }}>
            {role}
          </div>
        )}
        {bio && (
          <div style={{ fontSize: el.fontSize ? `${el.fontSize * 0.75}px` : "12px", color: themeColors.textSecondary, marginTop: "4px" }}>
            {bio}
          </div>
        )}
      </div>
    );
  }

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
      el.letterSpacing ? `letter-spacing:${el.letterSpacing}em` : "",
      el.textTransform && el.textTransform !== "none" ? `text-transform:${el.textTransform}` : "",
      el.fontFamily ? `font-family:'${el.fontFamily}', sans-serif` : "",
      "outline:none",
      "width:100%",
      "height:100%",
    ].filter(Boolean).join(";");

  const editor = useEditor(
    {
      immediatelyRender: false,
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

  React.useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: { style: buildStyleStr(), class: "tiptap-editor" },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, el.fontSize, color, el.textAlign, el.lineHeight, el.letterSpacing, el.textTransform, el.fontFamily]);

  if (isTextEditing && editor) {
    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <FormatToolbar editor={editor} element={el} onElementChange={onChange} />
        </div>
        <EditorContent editor={editor} style={{ ...style, cursor: "text", overflow: "auto" }} />
      </div>
    );
  }

  const isHtml = el.content.trimStart().startsWith("<");
  if (isHtml) {
    return <div style={style} dangerouslySetInnerHTML={{ __html: el.content }} />;
  }
  return <div style={style}>{el.content}</div>;
}

// ─── Shape element ─────────────────────────────────────────────────────────

function buildBoxShadow(el: ShapeElement): string | undefined {
  if (!el.boxShadow) return undefined;
  const { x, y, blur, color } = el.boxShadow;
  return `${x}px ${y}px ${blur}px ${color}`;
}

function strokeDashArrayFor(style?: string): string | undefined {
  if (style === "dashed") return "8 4";
  if (style === "dotted") return "2 3";
  return undefined;
}

function ShapeContent({
  el,
  themeColors,
}: {
  el: ShapeElement;
  themeColors: TemplateMetadata["colors"];
}) {
  const fill = el.fillGradient || el.fill || themeColors.primary;
  const stroke = el.stroke || "transparent";
  const strokeWidth = el.strokeWidth ?? 0;
  const opacity = el.opacity ?? 1;
  const boxShadow = buildBoxShadow(el);
  const borderStyle = el.strokeStyle || "solid";
  const dashArr = strokeDashArrayFor(el.strokeStyle);

  const commonDivStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    background: fill,
    border: strokeWidth > 0 ? `${strokeWidth}px ${borderStyle} ${stroke}` : "none",
    opacity,
    boxShadow,
  };

  if (el.shape === "rect") {
    return <div style={{ ...commonDivStyle, borderRadius: "4px" }} />;
  }

  if (el.shape === "rounded-rect") {
    return <div style={{ ...commonDivStyle, borderRadius: `${el.cornerRadius ?? 20}px` }} />;
  }

  if (el.shape === "circle") {
    return <div style={{ ...commonDivStyle, borderRadius: "50%" }} />;
  }

  // SVG polygon-based shapes
  const svgShapes: Record<string, { points: string; viewBox?: string }> = {
    triangle: { points: "50,5 95,95 5,95" },
    diamond: { points: "50,5 95,50 50,95 5,50" },
    pentagon: { points: "50,5 95,38 80,95 20,95 5,38" },
    hexagon: { points: "25,5 75,5 95,50 75,95 25,95 5,50" },
    parallelogram: { points: "25,10 95,10 75,90 5,90" },
    star: { points: "50,5 61,38 95,38 67,58 77,92 50,72 23,92 33,58 5,38 39,38" },
    cloud: { points: "" }, // rendered with path below
    "process-arrow": { points: "0,25 70,25 70,10 95,50 70,90 70,75 0,75" },
  };

  if (el.shape === "cloud") {
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ opacity, filter: boxShadow ? `drop-shadow(${boxShadow})` : undefined }}>
        <path
          d="M 20 55 Q 0 55 5 40 Q -5 25 15 22 Q 20 5 40 12 Q 50 0 65 10 Q 85 5 85 25 Q 100 30 90 45 Q 100 60 75 55 Z"
          fill={(typeof fill === "string" && fill.startsWith("linear")) ? (el.fill || themeColors.primary) : fill}
          stroke={strokeWidth > 0 ? stroke : "none"}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArr}
        />
      </svg>
    );
  }

  if (svgShapes[el.shape]) {
    const { points } = svgShapes[el.shape];
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity, filter: boxShadow ? `drop-shadow(${boxShadow})` : undefined }}>
        <polygon
          points={points}
          fill={(typeof fill === "string" && fill.startsWith("linear")) ? (el.fill || themeColors.primary) : fill}
          stroke={strokeWidth > 0 ? stroke : "none"}
          strokeWidth={strokeWidth}
          strokeDasharray={dashArr}
        />
      </svg>
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
          stroke={strokeWidth > 0 ? stroke : (el.fill || themeColors.primary)}
          strokeWidth={strokeWidth || 2}
          strokeDasharray={dashArr}
        />
      </svg>
    );
  }

  if (el.shape === "arrow") {
    const arrowFill = strokeWidth > 0 ? stroke : (el.fill || themeColors.primary);
    const markerId = `arrow-${el.id}`;
    return (
      <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ display: "block", opacity }}>
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
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
          strokeDasharray={dashArr}
          markerEnd={`url(#${markerId})`}
        />
      </svg>
    );
  }

  return null;
}

// ─── Image element ─────────────────────────────────────────────────────────

function ImageContent({ el, themeColors }: { el: ImageElement; themeColors: TemplateMetadata["colors"] }) {
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
        <span style={{ color: themeColors.textSecondary, fontSize: 14 }}>Drop image here</span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
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

// ─── Chart element (recharts) ──────────────────────────────────────────────

function ChartContent({ el, themeColors }: { el: ChartElement; themeColors: TemplateMetadata["colors"] }) {
  const palette = el.colors && el.colors.length > 0 ? el.colors : [
    themeColors.accent,
    themeColors.primary,
    themeColors.secondary || themeColors.primary,
    "#10b981",
    "#f59e0b",
    "#ec4899",
    "#8b5cf6",
  ];
  const data = el.labels.map((label, i) => ({ name: label, value: el.values[i] ?? 0 }));

  // Dynamically import only on client
  const [Charts, setCharts] = React.useState<typeof import("recharts") | null>(null);
  React.useEffect(() => {
    import("recharts").then((m) => setCharts(m));
  }, []);

  if (!Charts) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: themeColors.textSecondary, fontSize: 12 }}>
        Loading chart…
      </div>
    );
  }

  const { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, CartesianGrid } = Charts;

  return (
    <div style={{ width: "100%", height: "100%", padding: 8, color: themeColors.text }}>
      {el.title && (
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: themeColors.text }}>{el.title}</div>
      )}
      <ResponsiveContainer width="100%" height={el.title ? "85%" : "100%"}>
        {el.chartKind === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.textSecondary + "22"} />
            <XAxis dataKey="name" tick={{ fill: themeColors.textSecondary, fontSize: 10 }} />
            <YAxis tick={{ fill: themeColors.textSecondary, fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="value" fill={palette[0]} radius={[6, 6, 0, 0]} />
          </BarChart>
        ) : el.chartKind === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.textSecondary + "22"} />
            <XAxis dataKey="name" tick={{ fill: themeColors.textSecondary, fontSize: 10 }} />
            <YAxis tick={{ fill: themeColors.textSecondary, fontSize: 10 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={palette[0]} strokeWidth={3} />
          </LineChart>
        ) : el.chartKind === "area" ? (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.textSecondary + "22"} />
            <XAxis dataKey="name" tick={{ fill: themeColors.textSecondary, fontSize: 10 }} />
            <YAxis tick={{ fill: themeColors.textSecondary, fontSize: 10 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke={palette[0]} fill={palette[0] + "55"} />
          </AreaChart>
        ) : (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={el.chartKind === "donut" ? "55%" : 0}
              outerRadius="80%"
              label={{ fontSize: 10, fill: themeColors.text }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Table element ─────────────────────────────────────────────────────────

function TableContent({
  el,
  themeColors,
  isEditing,
  onChange,
}: {
  el: TableElement;
  themeColors: TemplateMetadata["colors"];
  isEditing: boolean;
  onChange: (patch: Partial<TableElement>) => void;
}) {
  const fontSize = el.fontSize || 14;
  const rows = el.rows && el.rows.length > 0 ? el.rows : [["", ""]];
  const headerFill = el.headerFill || themeColors.accent;
  const headerColor = el.headerColor || "#ffffff";
  const bodyFill = el.bodyFill || themeColors.surface;
  const bodyColor = el.bodyColor || themeColors.text;
  const borderColor = el.borderColor || themeColors.textSecondary + "44";

  const updateCell = (r: number, c: number, value: string) => {
    const newRows = rows.map((row) => [...row]);
    newRows[r][c] = value;
    onChange({ rows: newRows });
  };

  return (
    <div style={{ width: "100%", height: "100%", overflow: "auto", fontSize }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                const isHeader = el.headerRow && r === 0;
                const tdStyle: React.CSSProperties = {
                  padding: "6px 10px",
                  border: `1px solid ${borderColor}`,
                  background: isHeader ? headerFill : bodyFill,
                  color: isHeader ? headerColor : bodyColor,
                  fontWeight: isHeader ? 600 : 400,
                  verticalAlign: "middle",
                };
                if (isEditing) {
                  return (
                    <td key={c} style={tdStyle}>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        style={{ outline: "none", minHeight: fontSize + 4 }}
                        onBlur={(e) => updateCell(r, c, e.currentTarget.textContent || "")}
                      >
                        {cell}
                      </div>
                    </td>
                  );
                }
                return (
                  <td key={c} style={tdStyle}>
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export default function ElementContent({
  element,
  themeColors,
  isEditing,
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
    return <ShapeContent el={element as ShapeElement} themeColors={themeColors} />;
  }

  if (element.type === "image") {
    return <ImageContent el={element as ImageElement} themeColors={themeColors} />;
  }

  if (element.type === "icon") {
    const iconEl = element as IconElement;
    const entry = ICON_CATALOG.find((ic) => ic.name === iconEl.iconName);
    if (!entry) return null;
    const { Icon } = entry;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconEl.color || themeColors.text,
        }}
      >
        <Icon style={{ width: "100%", height: "100%" }} />
      </div>
    );
  }

  if (element.type === "chart") {
    return <ChartContent el={element as ChartElement} themeColors={themeColors} />;
  }

  if (element.type === "table") {
    return (
      <TableContent
        el={element as TableElement}
        themeColors={themeColors}
        isEditing={isEditing}
        onChange={onChange as (patch: Partial<TableElement>) => void}
      />
    );
  }

  return null;
}
