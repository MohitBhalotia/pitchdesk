"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import type { TemplateMetadata } from "./templates/types";
import type { SlideElement, TextElement } from "@/types/slide-elements";
import ElementContent from "./ElementContent";

const SLIDE_W = 1280;
const SLIDE_H = 720;

function pctToPx(el: SlideElement) {
  return {
    x: (el.x / 100) * SLIDE_W,
    y: (el.y / 100) * SLIDE_H,
    width: (el.width / 100) * SLIDE_W,
    height: (el.height / 100) * SLIDE_H,
  };
}

function pxToPct(px: {
  x: number;
  y: number;
  width: number;
  height: number;
}) {
  return {
    x: (px.x / SLIDE_W) * 100,
    y: (px.y / SLIDE_H) * 100,
    width: (px.width / SLIDE_W) * 100,
    height: (px.height / SLIDE_H) * 100,
  };
}

interface ElementCanvasProps {
  elements: SlideElement[];
  themeColors: TemplateMetadata["colors"];
  isEditing: boolean;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onElementChange: (id: string, patch: Partial<SlideElement>) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  exportMode?: boolean;
  textEditingId?: string | null;
  onTextEditingChange?: (id: string | null) => void;
}

export default function ElementCanvas({
  elements,
  themeColors,
  isEditing,
  selectedElementId,
  onSelectElement,
  onElementChange,
  onDeleteElement,
  onDuplicateElement,
  exportMode = false,
  textEditingId: externalTextEditingId,
  onTextEditingChange,
}: ElementCanvasProps) {
  const [internalTextEditingId, setInternalTextEditingId] = useState<string | null>(null);

  const textEditingId = externalTextEditingId !== undefined ? externalTextEditingId : internalTextEditingId;
  const setTextEditingId = useCallback((id: string | null) => {
    setInternalTextEditingId(id);
    onTextEditingChange?.(id);
  }, [onTextEditingChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInputFocused = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      // Escape: exit text editing
      if (e.key === "Escape") {
        if (textEditingId) { setTextEditingId(null); }
        return;
      }

      // Don't intercept when user is typing in an editor or input
      if (textEditingId || isInputFocused) return;
      if (!isEditing || !selectedElementId) return;

      // Delete / Backspace → delete selected element
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        onDeleteElement?.(selectedElementId);
        onSelectElement(null);
        return;
      }

      // Ctrl/Cmd+D → duplicate
      if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onDuplicateElement?.(selectedElementId);
        return;
      }

      // Arrow keys → nudge (1% per step, 5% with Shift)
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const el = elements.find((el) => el.id === selectedElementId);
        if (!el) return;
        const step = e.shiftKey ? 5 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        onElementChange(selectedElementId, {
          x: Math.max(0, Math.min(100 - el.width, el.x + dx)),
          y: Math.max(0, Math.min(100 - el.height, el.y + dy)),
        });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [textEditingId, selectedElementId, isEditing, elements, onDeleteElement, onDuplicateElement, onSelectElement, onElementChange, setTextEditingId]);

  const sorted = [...elements].sort(
    (a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1)
  );

  return (
    <div
      className="absolute inset-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectElement(null);
          setTextEditingId(null);
        }
      }}
    >
      {sorted.map((el) => {
        const { x, y, width, height } = pctToPx(el);
        const isSelected = selectedElementId === el.id;
        const isTextEditing = textEditingId === el.id;
        const isTextEl = el.type === "text";

        if (!isEditing || exportMode) {
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: x,
                top: y,
                width,
                height,
                zIndex: el.zIndex ?? 1,
              }}
            >
              <ElementContent
                element={el}
                themeColors={themeColors}
                isEditing={false}
                isSelected={false}
                isTextEditing={false}
                onChange={() => {}}
              />
            </div>
          );
        }

        return (
          <Rnd
            key={el.id}
            position={{ x, y }}
            size={{ width, height }}
            bounds="parent"
            style={{ zIndex: el.zIndex ?? 1 }}
            className={
              isSelected
                ? "ring-2 ring-blue-500 ring-offset-0"
                : "hover:ring-1 hover:ring-blue-300 hover:ring-offset-0"
            }
            onDragStop={(_, d) => {
              onElementChange(
                el.id,
                pxToPct({ x: d.x, y: d.y, width, height })
              );
            }}
            onResizeStop={(_, __, ref, ___, pos) => {
              onElementChange(
                el.id,
                pxToPct({
                  x: pos.x,
                  y: pos.y,
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                })
              );
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectElement(el.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              if (isTextEl) {
                const tel = el as TextElement;
                const role = tel.role;
                if (role !== "bullet-group" && role !== "team-card") {
                  setTextEditingId(el.id);
                }
              }
            }}
            enableResizing={!el.locked && !isTextEditing}
            disableDragging={el.locked === true || isTextEditing}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <ElementContent
                element={el}
                themeColors={themeColors}
                isEditing={isEditing}
                isSelected={isSelected}
                isTextEditing={isTextEditing}
                onChange={(patch) => onElementChange(el.id, patch)}
              />
            </div>
          </Rnd>
        );
      })}
    </div>
  );
}
