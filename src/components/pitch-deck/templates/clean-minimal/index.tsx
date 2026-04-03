"use client";

import React from "react";
import { TemplateComponent, SlideContentProps } from "../types";

function EditableField({
  value, field, isEditing, onContentChange, className, as: Tag = "p",
}: {
  value?: string; field: string; isEditing?: boolean;
  onContentChange?: (field: string, value: string | string[] | Array<{ label: string; value: string }> | Array<{ name: string; role: string; bio: string }>) => void;
  className?: string; as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  if (!value) return null;
  if (isEditing) {
    return (
      <Tag className={`${className} outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 rounded px-1`}
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
    <div className="flex flex-col justify-center h-full px-20 py-16" style={{ background: "#ffffff" }}>
      <div className="w-12 h-12 rounded-lg bg-emerald-500 mb-8" />
      <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
        as="h1" className="text-6xl font-bold text-gray-900 mb-4 tracking-tight" />
      <EditableField value={subheading} field="subheading" isEditing={isEditing} onContentChange={onContentChange}
        as="h2" className="text-2xl text-emerald-600 font-medium mb-6" />
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-500 text-lg max-w-xl leading-relaxed" />
    </div>
  );
}

function ContentSlide({ heading, bodyText, bulletPoints, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex h-full" style={{ background: "#ffffff" }}>
      <div className="w-2 bg-emerald-500" />
      <div className="flex flex-col flex-1 px-16 py-14">
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-3xl font-bold text-gray-900 mb-8" />
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-gray-600 text-lg mb-8 leading-relaxed max-w-3xl" />
        {bulletPoints && bulletPoints.length > 0 && (
          <div className="space-y-5 flex-1">
            {bulletPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                {isEditing ? (
                  <p className="text-gray-700 text-lg outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1 flex-1"
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
    </div>
  );
}

function MetricsSlide({ heading, bodyText, metrics, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex h-full" style={{ background: "#ffffff" }}>
      <div className="w-2 bg-emerald-500" />
      <div className="flex flex-col flex-1 px-16 py-14">
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-3xl font-bold text-gray-900 mb-4" />
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-gray-600 text-lg mb-10 max-w-3xl" />
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-8 flex-1 items-center">
            {metrics.map((metric, i) => (
              <div key={i} className="p-6 border-l-4 border-emerald-500">
                {isEditing ? (
                  <p
                    className="text-4xl font-bold text-gray-900 mb-2 outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[i] = { ...newMetrics[i], value: e.currentTarget.textContent || "" };
                      onContentChange?.("metrics", newMetrics);
                    }}
                  >{metric.value}</p>
                ) : (
                  <p className="text-4xl font-bold text-gray-900 mb-2">{metric.value}</p>
                )}
                {isEditing ? (
                  <p
                    className="text-gray-500 text-sm uppercase tracking-wider outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[i] = { ...newMetrics[i], label: e.currentTarget.textContent || "" };
                      onContentChange?.("metrics", newMetrics);
                    }}
                  >{metric.label}</p>
                ) : (
                  <p className="text-gray-500 text-sm uppercase tracking-wider">{metric.label}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamSlide({ heading, bodyText, teamMembers, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex h-full" style={{ background: "#ffffff" }}>
      <div className="w-2 bg-emerald-500" />
      <div className="flex flex-col flex-1 px-16 py-14">
        <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
          as="h2" className="text-3xl font-bold text-gray-900 mb-4" />
        <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
          className="text-gray-600 text-lg mb-8" />
        {teamMembers && teamMembers.length > 0 && (
          <div className={`grid gap-6 flex-1 items-center ${teamMembers.length <= 3 ? "grid-cols-3" : "grid-cols-4"}`}>
            {teamMembers.map((member, i) => (
              <div key={i} className="p-6 border border-gray-200 rounded-lg">
                <div className="w-14 h-14 bg-emerald-500 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{member.name.charAt(0)}</span>
                </div>
                {isEditing ? (
                  <p className="text-gray-900 font-bold text-lg outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMembers = [...teamMembers!];
                      newMembers[i] = { ...newMembers[i], name: e.currentTarget.textContent || "" };
                      onContentChange?.("teamMembers", newMembers);
                    }}>{member.name}</p>
                ) : (
                  <p className="text-gray-900 font-bold text-lg">{member.name}</p>
                )}
                {isEditing ? (
                  <p className="text-emerald-600 text-sm font-medium mb-2 outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMembers = [...teamMembers!];
                      newMembers[i] = { ...newMembers[i], role: e.currentTarget.textContent || "" };
                      onContentChange?.("teamMembers", newMembers);
                    }}>{member.role}</p>
                ) : (
                  <p className="text-emerald-600 text-sm font-medium mb-2">{member.role}</p>
                )}
                {isEditing ? (
                  <p className="text-gray-500 text-xs leading-relaxed outline-none focus:ring-2 focus:ring-emerald-400 rounded px-1"
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => {
                      const newMembers = [...teamMembers!];
                      newMembers[i] = { ...newMembers[i], bio: e.currentTarget.textContent || "" };
                      onContentChange?.("teamMembers", newMembers);
                    }}>{member.bio}</p>
                ) : (
                  <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ClosingSlide({ heading, bodyText, callToAction, isEditing, onContentChange }: SlideContentProps) {
  return (
    <div className="flex flex-col justify-center h-full px-20 py-16" style={{ background: "#ffffff" }}>
      <div className="w-12 h-12 rounded-lg bg-emerald-500 mb-8" />
      <EditableField value={heading} field="heading" isEditing={isEditing} onContentChange={onContentChange}
        as="h1" className="text-5xl font-bold text-gray-900 mb-6 tracking-tight" />
      <EditableField value={bodyText} field="bodyText" isEditing={isEditing} onContentChange={onContentChange}
        className="text-gray-500 text-xl mb-8 max-w-xl" />
      {callToAction && (
        <div className="inline-flex px-8 py-4 rounded-lg bg-emerald-500 text-white text-lg font-medium w-fit">
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

const cleanMinimal: TemplateComponent = {
  metadata: {
    id: "clean-minimal",
    name: "Clean Minimal",
    description: "Clean white design with green accents, ideal for enterprise and B2B",
    category: "professional",
    colors: {
      primary: "#10b981",
      secondary: "#059669",
      background: "#ffffff",
      surface: "#f9fafb",
      text: "#111827",
      textSecondary: "#6b7280",
      accent: "#10b981",
    },
  },
  SlideComponent,
};

export default cleanMinimal;
