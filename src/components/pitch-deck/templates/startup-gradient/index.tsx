"use client";

import React from "react";
import { TemplateComponent, SlideContentProps } from "../types";

function EditableField({
  value, field, isEditing, onContentChange, className, as: Tag = "p",
}: {
  value?: string; field: string; isEditing?: boolean;
  onContentChange?: (field: string, value: string | string[]) => void;
  className?: string; as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  if (!value) return null;
  if (isEditing) {
    return (
      <Tag className={`${className} outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 rounded px-1`}
        contentEditable suppressContentEditableWarning
        onBlur={(e) => onContentChange?.(field, e.currentTarget.textContent || "")}>
        {value}
      </Tag>
    );
  }
  return <Tag className={className}>{value}</Tag>;
}

function TitleSlide({ heading, subheading, bodyText, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-16"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
      <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
        as="h1" className="text-6xl font-extrabold text-white mb-4 drop-shadow-lg" />
      <EditableField value={subheading} field="subheading" isEditing={isEditing} onContentChange={onContentChange}
        as="h2" className="text-2xl text-white/90 font-light mb-6" />
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-white/80 text-lg max-w-xl" />
    </div>
  );
}

function ContentSlide({ heading, bodyText, bulletPoints, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col h-full px-16 py-14" style={{ background: "#fafafa" }}>
      <div className="mb-8">
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent" />
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3" />
      </div>
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-600 text-lg mb-8 leading-relaxed max-w-3xl" />
      {bulletPoints && bulletPoints.length > 0 && (
        <div className="space-y-4 flex-1">
          {bulletPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-purple-100">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{i + 1}</span>
              </div>
              {isEditing ? (
                <p className="text-gray-700 text-lg outline-none focus:ring-2 focus:ring-purple-400 rounded px-1 flex-1"
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => {
                    const newPoints = [...bulletPoints];
                    newPoints[i] = e.currentTarget.textContent || "";
                    onContentChange?.("bulletPoints", newPoints);
                  }}>{point}</p>
              ) : (
                <p className="text-gray-700 text-lg">{point}</p>
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
    <div className="flex flex-col h-full px-16 py-14" style={{ background: "#fafafa" }}>
      <div className="mb-6">
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent" />
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3" />
      </div>
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-600 text-lg mb-10 max-w-3xl" />
      {metrics && metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-6 flex-1 items-center">
          {metrics.map((metric, i) => (
            <div key={i} className="text-center p-8 rounded-2xl bg-white shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
              <p className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-3">
                {metric.value}
              </p>
              <p className="text-gray-500 text-sm uppercase tracking-wider font-medium">{metric.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TeamSlide({ heading, bodyText, teamMembers, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col h-full px-16 py-14" style={{ background: "#fafafa" }}>
      <div className="mb-6">
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent" />
        <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3" />
      </div>
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-600 text-lg mb-8" />
      {teamMembers && teamMembers.length > 0 && (
        <div className={`grid gap-6 flex-1 items-center ${teamMembers.length <= 3 ? "grid-cols-3" : "grid-cols-4"}`}>
          {teamMembers.map((member, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-white shadow-lg border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl font-bold">{member.name.charAt(0)}</span>
              </div>
              <p className="text-gray-800 font-bold text-lg">{member.name}</p>
              <p className="text-purple-500 text-sm font-medium mb-2">{member.role}</p>
              <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
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
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)" }}>
      <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
        as="h1" className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg" />
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-white/90 text-xl mb-8 max-w-xl" />
      {callToAction && (
        <div className="px-8 py-4 rounded-full bg-white text-purple-600 text-lg font-bold shadow-lg">
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
  switch (props.slideType) {
    case "title": return <TitleSlide {...props} />;
    case "closing": return <ClosingSlide {...props} />;
    case "team": return <TeamSlide {...props} />;
    case "market":
    case "traction":
    case "financials":
    case "ask": return <MetricsSlide {...props} />;
    default: return <ContentSlide {...props} />;
  }
}

const startupGradient: TemplateComponent = {
  metadata: {
    id: "startup-gradient",
    name: "Startup Gradient",
    description: "Vibrant gradients with bold typography, ideal for consumer startups",
    category: "startup",
    colors: {
      primary: "#667eea",
      secondary: "#764ba2",
      background: "#fafafa",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      accent: "#f093fb",
    },
  },
  SlideComponent,
};

export default startupGradient;
