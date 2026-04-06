"use client";

import React from "react";
import SlideFrame from "./SlideFrame";
import { getTemplate } from "./templates";
import ElementCanvas from "./ElementCanvas";
import { migrateSlide } from "@/lib/slide-migration";
import { isSlideV2 } from "@/types/slide-elements";
import type { AnySlide, SlideElement } from "@/types/slide-elements";

interface SlideRendererProps {
  slide: AnySlide;
  templateId: string;
  isEditing?: boolean;
  /** @deprecated Use onElementChange for the new element-based model */
  onContentChange?: (
    field: string,
    value:
      | string
      | string[]
      | Array<{ label: string; value: string }>
      | Array<{ name: string; role: string; bio: string }>
  ) => void;
  selectedElementId?: string | null;
  onSelectElement?: (id: string | null) => void;
  onElementChange?: (id: string, patch: Partial<SlideElement>) => void;
  exportMode?: boolean;
  className?: string;
  onClick?: () => void;
  slideRef?: React.Ref<HTMLDivElement>;
}

export default function SlideRenderer({
  slide,
  templateId,
  isEditing = false,
  selectedElementId = null,
  onSelectElement,
  onElementChange,
  exportMode = false,
  className = "",
  onClick,
  slideRef,
}: SlideRendererProps) {
  const template = getTemplate(templateId);
  const slideV2 = isSlideV2(slide) ? slide : migrateSlide(slide);

  return (
    <SlideFrame
      className={className}
      onClick={onClick}
      slideRef={slideRef}
      background={slideV2.background || template.metadata.colors.background}
    >
      <ElementCanvas
        elements={slideV2.elements}
        themeColors={template.metadata.colors}
        isEditing={isEditing}
        selectedElementId={selectedElementId}
        onSelectElement={onSelectElement ?? (() => {})}
        onElementChange={onElementChange ?? (() => {})}
        exportMode={exportMode}
      />
    </SlideFrame>
  );
}
