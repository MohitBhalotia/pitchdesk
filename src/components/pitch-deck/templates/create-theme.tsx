"use client";

import React from "react";
import { SlideContentProps } from "./types";
import { Plus, X } from "lucide-react";

export interface ThemeColors {
  bg: string;
  bgContent: string;
  accent: string;
  accentSecondary: string;
  heading: string;
  body: string;
  bodySecondary: string;
  metricValue: string;
  cardBg: string;
  cardBorder: string;
  focusRing: string;
}

export type LayoutVariant = "centered" | "left-accent" | "card-heavy";

function EditableField({
  value,
  field,
  isEditing,
  onContentChange,
  className,
  as: Tag = "p",
  focusColor,
}: {
  value?: string;
  field: string;
  isEditing?: boolean;
  onContentChange?: SlideContentProps["onContentChange"];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  focusColor: string;
}) {
  if (!value) return null;

  if (isEditing) {
    return (
      <Tag
        className={`${className} outline-none focus:ring-2 rounded px-1`}
        style={{ "--tw-ring-color": focusColor } as React.CSSProperties}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onContentChange?.(field, e.currentTarget.textContent || "")}
      >
        {value}
      </Tag>
    );
  }

  return <Tag className={className}>{value}</Tag>;
}

interface DecorativeElementData {
  type: "divider" | "accent-bar" | "circle" | "quote-box";
  position: "top" | "bottom" | "left" | "right" | "center";
  color?: string;
}

function DecorativeElement({ element, colors }: { element: DecorativeElementData; colors: ThemeColors }) {
  const elColor = element.color || colors.accent;
  const posMap: Record<string, string> = {
    top: "top-4 left-1/2 -translate-x-1/2",
    bottom: "bottom-4 left-1/2 -translate-x-1/2",
    left: "left-4 top-1/2 -translate-y-1/2",
    right: "right-4 top-1/2 -translate-y-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };
  const pos = posMap[element.position] || posMap.center;

  switch (element.type) {
    case "divider":
      return <div className={`absolute ${pos} w-32 h-0.5 rounded-full`} style={{ background: elColor, opacity: 0.5 }} />;
    case "accent-bar":
      return <div className={`absolute ${pos} w-2 h-16 rounded-full`} style={{ background: elColor, opacity: 0.6 }} />;
    case "circle":
      return <div className={`absolute ${pos} w-20 h-20 rounded-full`} style={{ border: `2px solid ${elColor}`, opacity: 0.2 }} />;
    case "quote-box":
      return <div className={`absolute ${pos} w-40 p-4 rounded-lg`} style={{ border: `1px solid ${elColor}30`, background: `${elColor}08` }} />;
    default:
      return null;
  }
}

export function createThemeSlideComponent(colors: ThemeColors, layout: LayoutVariant = "centered") {
  function TitleSlide({ heading, subheading, bodyText, isEditing, onContentChange, decorativeElements }: SlideContentProps) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full text-center px-16 relative overflow-hidden"
        style={{ background: colors.bg }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.accent}, transparent)` }} />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full opacity-15 blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.accentSecondary}, transparent)` }} />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `linear-gradient(${colors.heading} 1px, transparent 1px), linear-gradient(90deg, ${colors.heading} 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />
        {/* Custom decorative elements */}
        {decorativeElements?.map((el, i) => (
          <DecorativeElement key={i} element={el} colors={colors} />
        ))}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-1 mb-8 rounded-full" style={{ background: colors.accent }} />
          <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
            as="h1" className="text-5xl font-bold mb-4 tracking-tight" focusColor={colors.focusRing}
          />
          <EditableField value={subheading} field="subheading" isEditing={isEditing} onContentChange={onContentChange}
            as="h2" className="text-2xl font-light mb-6" focusColor={colors.focusRing}
          />
          <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
            className="text-lg max-w-xl" focusColor={colors.focusRing}
          />
        </div>
        <style>{`
          .themed-title h1 { color: ${colors.heading}; }
          .themed-title h2 { color: ${colors.accent}; }
          .themed-title p { color: ${colors.bodySecondary}; }
        `}</style>
      </div>
    );
  }

  // Override: inline styles for text colors since we can't use dynamic Tailwind
  function ContentSlide({ heading, bodyText, bulletPoints, isEditing, onContentChange, decorativeElements }: SlideContentProps) {
    const wrapperStyle: React.CSSProperties =
      layout === "left-accent"
        ? { background: colors.bgContent, display: "flex", height: "100%" }
        : { background: colors.bgContent };

    const inner = (
      <div className={`flex flex-col relative overflow-hidden ${layout === "left-accent" ? "flex-1 px-16 py-14" : "h-full px-16 py-14"}`}>
        {/* Corner accent shape */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.07]"
          style={{ background: `linear-gradient(135deg, ${colors.accent}, transparent)` }} />
        {decorativeElements?.map((el, i) => (
          <DecorativeElement key={i} element={el} colors={colors} />
        ))}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-1 rounded-full" style={{ background: colors.accent }} />
          <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
            as="h2" className="text-3xl font-bold" focusColor={colors.focusRing}
          />
        </div>
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-lg mb-8 leading-relaxed max-w-3xl" focusColor={colors.focusRing}
        />
        {bulletPoints && bulletPoints.length > 0 && (
          <div className="space-y-4 flex-1">
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-4 group/bullet">
                {layout === "card-heavy" ? (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.accent }}>
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{ background: colors.accent }} />
                )}
                {isEditing ? (
                  <>
                    <p className="text-lg outline-none focus:ring-2 rounded px-1 flex-1"
                      style={{ color: colors.body, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => {
                        const newPoints = [...bulletPoints];
                        newPoints[i] = e.currentTarget.textContent || "";
                        onContentChange?.("bulletPoints", newPoints);
                      }}>{point}</p>
                    <button className="opacity-0 group-hover/bullet:opacity-100 transition-opacity flex-shrink-0 mt-1 p-0.5 rounded hover:bg-red-500/20"
                      onClick={() => {
                        const newPoints = bulletPoints.filter((_, idx) => idx !== i);
                        onContentChange?.("bulletPoints", newPoints);
                      }}>
                      <X className="h-4 w-4" style={{ color: colors.bodySecondary }} />
                    </button>
                  </>
                ) : (
                  <p className="text-lg" style={{ color: colors.body }}>{point}</p>
                )}
              </div>
            ))}
            {isEditing && (
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors hover:opacity-80"
                style={{ color: colors.accent, border: `1px dashed ${colors.accent}40` }}
                onClick={() => onContentChange?.("bulletPoints", [...bulletPoints, "New point"])}>
                <Plus className="h-3.5 w-3.5" /> Add Point
              </button>
            )}
          </div>
        )}
      </div>
    );

    if (layout === "left-accent") {
      return (
        <div style={wrapperStyle}>
          <div className="w-2" style={{ background: colors.accent }} />
          {inner}
        </div>
      );
    }

    return <div className="flex flex-col h-full px-16 py-14" style={{ background: colors.bgContent }}>{inner.props.children}</div>;
  }

  function MetricsSlide({ heading, bodyText, metrics, bulletPoints, isEditing, onContentChange, decorativeElements }: SlideContentProps) {
    const wrapperStyle: React.CSSProperties =
      layout === "left-accent"
        ? { background: colors.bgContent, display: "flex", height: "100%" }
        : { background: colors.bgContent };

    const content = (
      <div className={`flex flex-col relative overflow-hidden ${layout === "left-accent" ? "flex-1 px-16 py-14" : "h-full px-16 py-14"}`}>
        {/* Subtle bottom gradient glow */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-[0.05]"
          style={{ background: `linear-gradient(to top, ${colors.accent}, transparent)` }} />
        {decorativeElements?.map((el, i) => (
          <DecorativeElement key={i} element={el} colors={colors} />
        ))}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-1 rounded-full" style={{ background: colors.accent }} />
          <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
            as="h2" className="text-3xl font-bold" focusColor={colors.focusRing}
          />
        </div>
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-lg mb-10 max-w-3xl" focusColor={colors.focusRing}
        />
        {metrics && metrics.length > 0 && (
          <div className={`grid gap-8 flex-1 items-center`}
            style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length + (isEditing ? 1 : 0), 4)}, 1fr)` }}>
            {metrics.map((metric, i) => (
              <div key={i} className="text-center p-8 rounded-2xl relative group/metric"
                style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                {isEditing && (
                  <button className="absolute top-2 right-2 opacity-0 group-hover/metric:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/20"
                    onClick={() => {
                      const newMetrics = metrics.filter((_, idx) => idx !== i);
                      onContentChange?.("metrics", newMetrics);
                    }}>
                    <X className="h-3.5 w-3.5" style={{ color: colors.bodySecondary }} />
                  </button>
                )}
                {isEditing ? (
                  <p className="text-4xl font-bold mb-3 outline-none focus:ring-2 rounded px-1"
                    style={{ color: colors.metricValue, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[i] = { ...newMetrics[i], value: e.currentTarget.textContent || "" };
                      onContentChange?.("metrics", newMetrics);
                    }}>{metric.value}</p>
                ) : (
                  <p className="text-4xl font-bold mb-3" style={{ color: colors.metricValue }}>{metric.value}</p>
                )}
                {isEditing ? (
                  <p className="text-sm uppercase tracking-wider outline-none focus:ring-2 rounded px-1"
                    style={{ color: colors.bodySecondary, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[i] = { ...newMetrics[i], label: e.currentTarget.textContent || "" };
                      onContentChange?.("metrics", newMetrics);
                    }}>{metric.label}</p>
                ) : (
                  <p className="text-sm uppercase tracking-wider" style={{ color: colors.bodySecondary }}>{metric.label}</p>
                )}
              </div>
            ))}
            {isEditing && metrics.length < 6 && (
              <button className="flex flex-col items-center justify-center p-8 rounded-2xl transition-colors hover:opacity-80"
                style={{ border: `2px dashed ${colors.accent}40`, color: colors.accent }}
                onClick={() => onContentChange?.("metrics", [...metrics, { label: "Label", value: "0" }])}>
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Metric</span>
              </button>
            )}
          </div>
        )}
        {bulletPoints && bulletPoints.length > 0 && (
          <div className="space-y-3 mt-6">
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3 group/bullet">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: colors.accent }} />
                {isEditing ? (
                  <>
                    <p className="text-base outline-none focus:ring-2 rounded px-1 flex-1"
                      style={{ color: colors.body, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => {
                        const newPoints = [...bulletPoints];
                        newPoints[i] = e.currentTarget.textContent || "";
                        onContentChange?.("bulletPoints", newPoints);
                      }}>{point}</p>
                    <button className="opacity-0 group-hover/bullet:opacity-100 transition-opacity flex-shrink-0 mt-0.5 p-0.5 rounded hover:bg-red-500/20"
                      onClick={() => {
                        const newPoints = bulletPoints.filter((_, idx) => idx !== i);
                        onContentChange?.("bulletPoints", newPoints);
                      }}>
                      <X className="h-3.5 w-3.5" style={{ color: colors.bodySecondary }} />
                    </button>
                  </>
                ) : (
                  <p className="text-base" style={{ color: colors.body }}>{point}</p>
                )}
              </div>
            ))}
            {isEditing && (
              <button className="flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors hover:opacity-80"
                style={{ color: colors.accent, border: `1px dashed ${colors.accent}40` }}
                onClick={() => onContentChange?.("bulletPoints", [...bulletPoints, "New point"])}>
                <Plus className="h-3 w-3" /> Add Point
              </button>
            )}
          </div>
        )}
      </div>
    );

    if (layout === "left-accent") {
      return (
        <div style={wrapperStyle}>
          <div className="w-2" style={{ background: colors.accent }} />
          {content}
        </div>
      );
    }

    return <div className="flex flex-col h-full px-16 py-14" style={{ background: colors.bgContent }}>{content.props.children}</div>;
  }

  function TeamSlide({ heading, bodyText, teamMembers, isEditing, onContentChange, decorativeElements }: SlideContentProps) {
    const wrapperStyle: React.CSSProperties =
      layout === "left-accent"
        ? { background: colors.bgContent, display: "flex", height: "100%" }
        : { background: colors.bgContent };

    const content = (
      <div className={`flex flex-col relative overflow-hidden ${layout === "left-accent" ? "flex-1 px-16 py-14" : "h-full px-16 py-14"}`}>
        {/* Gradient backdrop for team cards */}
        <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-[0.06] blur-3xl"
          style={{ background: `radial-gradient(circle, ${colors.accentSecondary}, transparent)` }} />
        {decorativeElements?.map((el, i) => (
          <DecorativeElement key={i} element={el} colors={colors} />
        ))}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-1 rounded-full" style={{ background: colors.accent }} />
          <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
            as="h2" className="text-3xl font-bold" focusColor={colors.focusRing}
          />
        </div>
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-lg mb-8" focusColor={colors.focusRing}
        />
        {teamMembers && teamMembers.length > 0 && (
          <div className={`grid gap-6 flex-1 items-center`}
            style={{ gridTemplateColumns: `repeat(${Math.min(teamMembers.length + (isEditing ? 1 : 0), 4)}, 1fr)` }}>
            {teamMembers.map((member, i) => (
              <div key={i} className="text-center p-6 rounded-2xl relative group/member"
                style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
                {isEditing && (
                  <button className="absolute top-2 right-2 opacity-0 group-hover/member:opacity-100 transition-opacity p-0.5 rounded hover:bg-red-500/20"
                    onClick={() => {
                      const newMembers = teamMembers.filter((_, idx) => idx !== i);
                      onContentChange?.("teamMembers", newMembers);
                    }}>
                    <X className="h-3.5 w-3.5" style={{ color: colors.bodySecondary }} />
                  </button>
                )}
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentSecondary})` }}>
                  <span className="text-white text-xl font-bold">{member.name.charAt(0)}</span>
                </div>
                {isEditing ? (
                  <p className="font-semibold text-lg outline-none focus:ring-2 rounded px-1"
                    style={{ color: colors.heading, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[i] = { ...newMembers[i], name: e.currentTarget.textContent || "" };
                      onContentChange?.("teamMembers", newMembers);
                    }}>{member.name}</p>
                ) : (
                  <p className="font-semibold text-lg" style={{ color: colors.heading }}>{member.name}</p>
                )}
                {isEditing ? (
                  <p className="text-sm mb-2 outline-none focus:ring-2 rounded px-1"
                    style={{ color: colors.accent, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[i] = { ...newMembers[i], role: e.currentTarget.textContent || "" };
                      onContentChange?.("teamMembers", newMembers);
                    }}>{member.role}</p>
                ) : (
                  <p className="text-sm mb-2" style={{ color: colors.accent }}>{member.role}</p>
                )}
                {isEditing ? (
                  <p className="text-xs leading-relaxed outline-none focus:ring-2 rounded px-1"
                    style={{ color: colors.bodySecondary, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMembers = [...teamMembers];
                      newMembers[i] = { ...newMembers[i], bio: e.currentTarget.textContent || "" };
                      onContentChange?.("teamMembers", newMembers);
                    }}>{member.bio}</p>
                ) : (
                  <p className="text-xs leading-relaxed" style={{ color: colors.bodySecondary }}>{member.bio}</p>
                )}
              </div>
            ))}
            {isEditing && teamMembers.length < 6 && (
              <button className="flex flex-col items-center justify-center p-6 rounded-2xl transition-colors hover:opacity-80"
                style={{ border: `2px dashed ${colors.accent}40`, color: colors.accent }}
                onClick={() => onContentChange?.("teamMembers", [...teamMembers, { name: "Name", role: "Role", bio: "Bio" }])}>
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-xs">Add Member</span>
              </button>
            )}
          </div>
        )}
      </div>
    );

    if (layout === "left-accent") {
      return (
        <div style={wrapperStyle}>
          <div className="w-2" style={{ background: colors.accent }} />
          {content}
        </div>
      );
    }

    return <div className="flex flex-col h-full px-16 py-14" style={{ background: colors.bgContent }}>{content.props.children}</div>;
  }

  function ClosingSlide({ heading, bodyText, callToAction, isEditing, onContentChange, decorativeElements }: SlideContentProps) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-16 relative overflow-hidden"
        style={{ background: colors.bg }}>
        {/* Large background circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ border: `2px solid ${colors.accent}` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full opacity-[0.03]"
          style={{ border: `1px solid ${colors.accentSecondary}` }} />
        {/* Gradient glow */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-40 opacity-10 blur-3xl"
          style={{ background: `radial-gradient(ellipse, ${colors.accent}, transparent)` }} />
        {decorativeElements?.map((el, i) => (
          <DecorativeElement key={i} element={el} colors={colors} />
        ))}
        <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-1 mb-8 rounded-full" style={{ background: colors.accent }} />
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h1" className="text-5xl font-bold mb-6" focusColor={colors.focusRing}
        />
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-xl mb-8 max-w-xl" focusColor={colors.focusRing}
        />
        {callToAction && (
          <div className="px-8 py-4 rounded-full text-lg font-medium"
            style={{ border: `2px solid ${colors.accent}`, color: colors.accent }}>
            {isEditing ? (
              <span contentEditable suppressContentEditableWarning className="outline-none"
                onBlur={(e) => onContentChange?.("callToAction", e.currentTarget.textContent || "")}>
                {callToAction}
              </span>
            ) : callToAction}
          </div>
        )}
        </div>
      </div>
    );
  }

  // Apply text colors via inline styles
  function ThemedSlideComponent(props: SlideContentProps) {
    const { slideType } = props;

    // Wrap each slide to apply text colors
    const colorStyle: React.CSSProperties = {
      // @ts-expect-error CSS custom properties
      "--heading-color": colors.heading,
      "--body-color": colors.body,
      "--body-secondary": colors.bodySecondary,
    };

    const slide = (() => {
      switch (slideType) {
        case "title":
          return <TitleSlide {...props} />;
        case "closing":
          return <ClosingSlide {...props} />;
        case "team":
          return <TeamSlide {...props} />;
        case "market":
        case "traction":
        case "financials":
        case "ask":
          return <MetricsSlide {...props} />;
        case "problem":
        case "solution":
        case "product":
        case "business_model":
        case "competition":
        default:
          return <ContentSlide {...props} />;
      }
    })();

    // Inject inline color styles into the rendered slide's text elements
    return (
      <div style={colorStyle} className="h-full relative [&_h1]:text-[var(--heading-color)] [&_h2]:text-[var(--heading-color)] [&_h3]:text-[var(--heading-color)]">
        {slide}
        {/* Render images */}
        {props.images && props.images.length > 0 && props.images.map((img, i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${img.x}%`,
              top: `${img.y}%`,
              width: `${img.width}%`,
              height: `${img.height}%`,
            }}
          >
            <img
              src={img.url}
              alt=""
              className="w-full h-full object-contain rounded-lg"
              draggable={false}
            />
          </div>
        ))}
      </div>
    );
  }

  return ThemedSlideComponent;
}
