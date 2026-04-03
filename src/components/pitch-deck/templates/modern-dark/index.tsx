"use client";

import React from "react";
import { TemplateComponent, SlideContentProps } from "../types";

function EditableField({
  value,
  field,
  isEditing,
  onContentChange,
  className,
  as: Tag = "p",
}: {
  value?: string;
  field: string;
  isEditing?: boolean;
  onContentChange?: (field: string, value: string | string[]) => void;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  if (!value) return null;

  if (isEditing) {
    return (
      <Tag
        className={`${className} outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded px-1`}
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

function TitleSlide({ heading, subheading, bodyText, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16"
      style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <div className="w-20 h-1 bg-blue-500 mb-8 rounded-full" />
      <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
        as="h1" className="text-5xl font-bold text-white mb-4 tracking-tight" />
      <EditableField value={subheading} field="subheading" isEditing={isEditing} onContentChange={onContentChange}
        as="h2" className="text-2xl text-blue-400 font-light mb-6" />
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-400 text-lg max-w-xl" />
    </div>
  );
}

function ContentSlide({ heading, bodyText, bulletPoints, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col h-full px-16 py-14"
      style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)" }}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-1 bg-blue-500 rounded-full" />
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-3xl font-bold text-white" />
      </div>
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-300 text-lg mb-8 leading-relaxed max-w-3xl" />
      {bulletPoints && bulletPoints.length > 0 && (
        <div className="space-y-4 flex-1">
          {bulletPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0" />
              {isEditing ? (
                <p className="text-gray-200 text-lg outline-none focus:ring-2 focus:ring-blue-400 rounded px-1"
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPoints = [...bulletPoints];
                    newPoints[i] = e.currentTarget.textContent || "";
                    onContentChange?.("bulletPoints", newPoints);
                  }}>{point}</p>
              ) : (
                <p className="text-gray-200 text-lg">{point}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricsSlide({ heading, bodyText, metrics, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col h-full px-16 py-14"
      style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)" }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-1 bg-blue-500 rounded-full" />
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-3xl font-bold text-white" />
      </div>
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-300 text-lg mb-10 max-w-3xl" />
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-8 flex-1 items-center">
          {metrics.map((metric, i) => (
            <div key={i} className="text-center p-8 rounded-2xl border border-gray-700/50 bg-white/5 backdrop-blur-sm">
              <p className="text-4xl font-bold text-blue-400 mb-3">{metric.value}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">{metric.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamSlide({ heading, bodyText, teamMembers, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col h-full px-16 py-14"
      style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #1a1a2e 100%)" }}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-1 bg-blue-500 rounded-full" />
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-3xl font-bold text-white" />
      </div>
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-300 text-lg mb-8" />
      {teamMembers && teamMembers.length > 0 && (
        <div className={`grid gap-6 flex-1 items-center ${teamMembers.length <= 3 ? "grid-cols-3" : "grid-cols-4"}`}>
          {teamMembers.map((member, i) => (
            <div key={i} className="text-center p-6 rounded-2xl border border-gray-700/50 bg-white/5">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{member.name.charAt(0)}</span>
              </div>
              <p className="text-white font-semibold text-lg">{member.name}</p>
              <p className="text-blue-400 text-sm mb-2">{member.role}</p>
              <p className="text-gray-400 text-xs leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClosingSlide({ heading, bodyText, callToAction, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16"
      style={{ background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)" }}>
      <div className="w-20 h-1 bg-blue-500 mb-8 rounded-full" />
      <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
        as="h1" className="text-5xl font-bold text-white mb-6" />
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-300 text-xl mb-8 max-w-xl" />
      {callToAction && (
        <div className="px-8 py-4 rounded-full border-2 border-blue-500 text-blue-400 text-lg font-medium">
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

function SlideComponent(props: SlideContentProps) {
  const { slideType } = props;

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
}

const modernDark: TemplateComponent = {
  metadata: {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Sleek dark theme with blue accents, perfect for tech startups",
    category: "professional",
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      background: "#0f0f0f",
      surface: "#1a1a2e",
      text: "#ffffff",
      textSecondary: "#9ca3af",
      accent: "#3b82f6",
    },
  },
  SlideComponent,
};

export default modernDark;
