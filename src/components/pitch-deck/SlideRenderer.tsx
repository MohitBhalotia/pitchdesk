"use client";

import React from "react";
import SlideFrame from "./SlideFrame";
import { getTemplate } from "./templates";

interface SlideRendererProps {
  slide: {
    slideType: string;
    heading?: string;
    subheading?: string;
    bodyText?: string;
    bulletPoints?: string[];
    metrics?: Array<{ label: string; value: string }>;
    teamMembers?: Array<{ name: string; role: string; bio: string }>;
    chartData?: { type: string; labels: string[]; values: number[] };
    callToAction?: string;
    notes?: string;
    decorativeElements?: Array<{
      type: "divider" | "accent-bar" | "circle" | "quote-box";
      position: "top" | "bottom" | "left" | "right" | "center";
      color?: string;
    }>;
    images?: Array<{
      url: string;
      publicId?: string;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  };
  templateId: string;
  isEditing?: boolean;
  onContentChange?: (
    field: string,
    value:
      | string
      | string[]
      | Array<{ label: string; value: string }>
      | Array<{ name: string; role: string; bio: string }>
  ) => void;
  className?: string;
  onClick?: () => void;
  slideRef?: React.Ref<HTMLDivElement>;
}

export default function SlideRenderer({
  slide,
  templateId,
  isEditing = false,
  onContentChange,
  className = "",
  onClick,
  slideRef,
}: SlideRendererProps) {
  const template = getTemplate(templateId);
  const { SlideComponent } = template;

  return (
    <SlideFrame className={className} onClick={onClick} slideRef={slideRef}>
      <SlideComponent
        {...slide}
        isEditing={isEditing}
        onContentChange={onContentChange}
      />
    </SlideFrame>
  );
}
