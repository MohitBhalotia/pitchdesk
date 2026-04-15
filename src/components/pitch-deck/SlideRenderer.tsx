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
  onContentChange?: (
    field: string,
    value:
      | string
      | string[]
      | Array<{ label: string; value: string }>
      | Array<{ name: string; role: string; bio: string }>
  ) => void;
  selectedElementId?: string | null;
  selectedIds?: string[];
  onSelectElement?: (id: string | null, shiftKey?: boolean) => void;
  onElementChange?: (id: string, patch: Partial<SlideElement>) => void;
  onMultiElementChange?: (patches: Array<{ id: string; patch: Partial<SlideElement> }>) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  exportMode?: boolean;
  className?: string;
  onClick?: () => void;
  slideRef?: React.Ref<HTMLDivElement>;
  showGrid?: boolean;
  snapEnabled?: boolean;
  onContextMenuElement?: (id: string, x: number, y: number) => void;
  onContextMenuCanvas?: (x: number, y: number) => void;
  onDragBoxSelect?: (box: { x: number; y: number; w: number; h: number }, shiftKey: boolean) => void;
}

export default function SlideRenderer({
  slide,
  templateId,
  isEditing = false,
  selectedElementId = null,
  selectedIds = [],
  onSelectElement,
  onElementChange,
  onMultiElementChange,
  onDeleteElement,
  onDuplicateElement,
  exportMode = false,
  className = "",
  onClick,
  slideRef,
  showGrid,
  snapEnabled,
  onContextMenuElement,
  onContextMenuCanvas,
  onDragBoxSelect,
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
        selectedIds={selectedIds}
        onSelectElement={onSelectElement ?? (() => {})}
        onElementChange={onElementChange ?? (() => {})}
        onMultiElementChange={onMultiElementChange}
        onDeleteElement={onDeleteElement}
        onDuplicateElement={onDuplicateElement}
        exportMode={exportMode}
        showGrid={showGrid}
        snapEnabled={snapEnabled}
        onContextMenuElement={onContextMenuElement}
        onContextMenuCanvas={onContextMenuCanvas}
        onDragBoxSelect={onDragBoxSelect}
      />
    </SlideFrame>
  );
}
