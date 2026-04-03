"use client";

import React from "react";
import { SlideContentProps } from "./types";

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

export function createThemeSlideComponent(colors: ThemeColors, layout: LayoutVariant = "centered") {
  function TitleSlide({ heading, subheading, bodyText, isEditing, onContentChange }: SlideContentProps) {
    return (
      <div
        className="flex flex-col items-center justify-center h-full text-center px-16"
        style={{ background: colors.bg }}
      >
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
        <style>{`
          .themed-title h1 { color: ${colors.heading}; }
          .themed-title h2 { color: ${colors.accent}; }
          .themed-title p { color: ${colors.bodySecondary}; }
        `}</style>
      </div>
    );
  }

  // Override: inline styles for text colors since we can't use dynamic Tailwind
  function ContentSlide({ heading, bodyText, bulletPoints, isEditing, onContentChange }: SlideContentProps) {
    const wrapperStyle: React.CSSProperties =
      layout === "left-accent"
        ? { background: colors.bgContent, display: "flex", height: "100%" }
        : { background: colors.bgContent };

    const inner = (
      <div className={`flex flex-col ${layout === "left-accent" ? "flex-1 px-16 py-14" : "h-full px-16 py-14"}`}>
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
              <div key={i} className="flex items-start gap-4">
                {layout === "card-heavy" ? (
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: colors.accent }}>
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full mt-2.5 flex-shrink-0" style={{ background: colors.accent }} />
                )}
                {isEditing ? (
                  <p className="text-lg outline-none focus:ring-2 rounded px-1 flex-1"
                    style={{ color: colors.body, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newPoints = [...bulletPoints];
                      newPoints[i] = e.currentTarget.textContent || "";
                      onContentChange?.("bulletPoints", newPoints);
                    }}>{point}</p>
                ) : (
                  <p className="text-lg" style={{ color: colors.body }}>{point}</p>
                )}
              </div>
            ))}
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

  function MetricsSlide({ heading, bodyText, metrics, bulletPoints, isEditing, onContentChange }: SlideContentProps) {
    const wrapperStyle: React.CSSProperties =
      layout === "left-accent"
        ? { background: colors.bgContent, display: "flex", height: "100%" }
        : { background: colors.bgContent };

    const content = (
      <div className={`flex flex-col ${layout === "left-accent" ? "flex-1 px-16 py-14" : "h-full px-16 py-14"}`}>
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
            style={{ gridTemplateColumns: `repeat(${Math.min(metrics.length, 4)}, 1fr)` }}>
            {metrics.map((metric, i) => (
              <div key={i} className="text-center p-8 rounded-2xl"
                style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
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
          </div>
        )}
        {bulletPoints && bulletPoints.length > 0 && (
          <div className="space-y-3 mt-6">
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: colors.accent }} />
                {isEditing ? (
                  <p className="text-base outline-none focus:ring-2 rounded px-1"
                    style={{ color: colors.body, "--tw-ring-color": colors.focusRing } as React.CSSProperties}
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newPoints = [...bulletPoints];
                      newPoints[i] = e.currentTarget.textContent || "";
                      onContentChange?.("bulletPoints", newPoints);
                    }}>{point}</p>
                ) : (
                  <p className="text-base" style={{ color: colors.body }}>{point}</p>
                )}
              </div>
            ))}
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

  function TeamSlide({ heading, bodyText, teamMembers, isEditing, onContentChange }: SlideContentProps) {
    const wrapperStyle: React.CSSProperties =
      layout === "left-accent"
        ? { background: colors.bgContent, display: "flex", height: "100%" }
        : { background: colors.bgContent };

    const content = (
      <div className={`flex flex-col ${layout === "left-accent" ? "flex-1 px-16 py-14" : "h-full px-16 py-14"}`}>
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
          <div className={`grid gap-6 flex-1 items-center ${teamMembers.length <= 3 ? "grid-cols-3" : "grid-cols-4"}`}>
            {teamMembers.map((member, i) => (
              <div key={i} className="text-center p-6 rounded-2xl"
                style={{ background: colors.cardBg, border: `1px solid ${colors.cardBorder}` }}>
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

  function ClosingSlide({ heading, bodyText, callToAction, isEditing, onContentChange }: SlideContentProps) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-16"
        style={{ background: colors.bg }}>
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
      <div style={colorStyle} className="h-full [&_h1]:text-[var(--heading-color)] [&_h2]:text-[var(--heading-color)] [&_h3]:text-[var(--heading-color)]">
        {slide}
      </div>
    );
  }

  return ThemedSlideComponent;
}
