"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Rnd } from "react-rnd";
import type { TemplateMetadata } from "./templates/types";
import type { SlideElement, TextElement } from "@/types/slide-elements";
import ElementContent from "./ElementContent";
import SnapGuides, { type SnapGuide } from "./SnapGuides";

const SLIDE_W = 1280;
const SLIDE_H = 720;
const SNAP_THRESHOLD_PX = 8;

function pctToPx(el: SlideElement) {
  return {
    x: (el.x / 100) * SLIDE_W,
    y: (el.y / 100) * SLIDE_H,
    width: (el.width / 100) * SLIDE_W,
    height: (el.height / 100) * SLIDE_H,
  };
}

function pxToPct(px: { x: number; y: number; width: number; height: number }) {
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
  selectedIds?: string[];
  onSelectElement: (id: string | null, shiftKey?: boolean) => void;
  onElementChange: (id: string, patch: Partial<SlideElement>) => void;
  onMultiElementChange?: (patches: Array<{ id: string; patch: Partial<SlideElement> }>) => void;
  onDeleteElement?: (id: string) => void;
  onDuplicateElement?: (id: string) => void;
  exportMode?: boolean;
  textEditingId?: string | null;
  onTextEditingChange?: (id: string | null) => void;
  showGrid?: boolean;
  snapEnabled?: boolean;
  onContextMenuElement?: (id: string, x: number, y: number) => void;
  onContextMenuCanvas?: (x: number, y: number) => void;
  onDragBoxSelect?: (box: { x: number; y: number; w: number; h: number }, shiftKey: boolean) => void;
}

export default function ElementCanvas({
  elements,
  themeColors,
  isEditing,
  selectedElementId,
  selectedIds = [],
  onSelectElement,
  onElementChange,
  onMultiElementChange,
  onDeleteElement,
  onDuplicateElement,
  exportMode = false,
  textEditingId: externalTextEditingId,
  onTextEditingChange,
  showGrid = false,
  snapEnabled = true,
  onContextMenuElement,
  onContextMenuCanvas,
  onDragBoxSelect,
}: ElementCanvasProps) {
  const [internalTextEditingId, setInternalTextEditingId] = useState<string | null>(null);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [selectionBox, setSelectionBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStartPositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  const textEditingId = externalTextEditingId !== undefined ? externalTextEditingId : internalTextEditingId;
  const setTextEditingId = useCallback(
    (id: string | null) => {
      setInternalTextEditingId(id);
      onTextEditingChange?.(id);
    },
    [onTextEditingChange]
  );

  const effectiveSelection = selectedIds.length > 0 ? selectedIds : selectedElementId ? [selectedElementId] : [];

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isInputFocused =
        tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;

      if (e.key === "Escape") {
        if (textEditingId) {
          setTextEditingId(null);
        }
        return;
      }

      if (textEditingId || isInputFocused) return;
      if (!isEditing) return;

      // Select all
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        // Parent handles setting selectedIds - we emit via onDragBoxSelect with full box
        if (onDragBoxSelect) onDragBoxSelect({ x: 0, y: 0, w: 100, h: 100 }, false);
        return;
      }

      if (effectiveSelection.length === 0) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        effectiveSelection.forEach((id) => onDeleteElement?.(id));
        onSelectElement(null);
        return;
      }

      if (e.key === "d" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        effectiveSelection.forEach((id) => onDuplicateElement?.(id));
        return;
      }

      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        const patches = effectiveSelection
          .map((id) => {
            const el = elements.find((e) => e.id === id);
            if (!el) return null;
            return {
              id,
              patch: {
                x: Math.max(0, Math.min(100 - el.width, el.x + dx)),
                y: Math.max(0, Math.min(100 - el.height, el.y + dy)),
              },
            };
          })
          .filter(Boolean) as Array<{ id: string; patch: Partial<SlideElement> }>;
        if (onMultiElementChange && patches.length > 1) {
          onMultiElementChange(patches);
        } else {
          patches.forEach((p) => onElementChange(p.id, p.patch));
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    textEditingId,
    isEditing,
    elements,
    effectiveSelection,
    onDeleteElement,
    onDuplicateElement,
    onSelectElement,
    onElementChange,
    onMultiElementChange,
    onDragBoxSelect,
    setTextEditingId,
  ]);

  // Compute snap targets for a dragging element
  const computeSnap = useCallback(
    (dragId: string, pxPos: { x: number; y: number; width: number; height: number }) => {
      if (!snapEnabled) return { x: pxPos.x, y: pxPos.y, guides: [] as SnapGuide[] };
      const guides: SnapGuide[] = [];
      let bestDx: number | null = null;
      let bestDy: number | null = null;

      const dragLeft = pxPos.x;
      const dragCenterX = pxPos.x + pxPos.width / 2;
      const dragRight = pxPos.x + pxPos.width;
      const dragTop = pxPos.y;
      const dragCenterY = pxPos.y + pxPos.height / 2;
      const dragBottom = pxPos.y + pxPos.height;

      // Targets: slide edges, center, thirds
      const xTargets: number[] = [0, SLIDE_W / 2, SLIDE_W, SLIDE_W / 3, (SLIDE_W * 2) / 3];
      const yTargets: number[] = [0, SLIDE_H / 2, SLIDE_H, SLIDE_H / 3, (SLIDE_H * 2) / 3];

      // Other element edges
      elements.forEach((el) => {
        if (el.id === dragId) return;
        const e = pctToPx(el);
        xTargets.push(e.x, e.x + e.width / 2, e.x + e.width);
        yTargets.push(e.y, e.y + e.height / 2, e.y + e.height);
      });

      // Find closest x snap
      const candidates = [
        { self: dragLeft, offset: 0 },
        { self: dragCenterX, offset: pxPos.width / 2 },
        { self: dragRight, offset: pxPos.width },
      ];
      for (const c of candidates) {
        for (const t of xTargets) {
          const diff = t - c.self;
          if (Math.abs(diff) < SNAP_THRESHOLD_PX && (bestDx === null || Math.abs(diff) < Math.abs(bestDx))) {
            bestDx = diff;
            guides.push({ orientation: "v", position: (t / SLIDE_W) * 100 });
          }
        }
      }
      const candidatesY = [
        { self: dragTop, offset: 0 },
        { self: dragCenterY, offset: pxPos.height / 2 },
        { self: dragBottom, offset: pxPos.height },
      ];
      for (const c of candidatesY) {
        for (const t of yTargets) {
          const diff = t - c.self;
          if (Math.abs(diff) < SNAP_THRESHOLD_PX && (bestDy === null || Math.abs(diff) < Math.abs(bestDy))) {
            bestDy = diff;
            guides.push({ orientation: "h", position: (t / SLIDE_H) * 100 });
          }
        }
      }

      return {
        x: bestDx !== null ? pxPos.x + bestDx : pxPos.x,
        y: bestDy !== null ? pxPos.y + bestDy : pxPos.y,
        guides: guides.slice(0, 4),
      };
    },
    [elements, snapEnabled]
  );

  const sorted = [...elements].sort((a, b) => (a.zIndex ?? 1) - (b.zIndex ?? 1));

  // Drag-box selection on empty canvas
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditing || e.target !== e.currentTarget) return;
      if (e.button !== 0) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const startX = ((e.clientX - rect.left) / rect.width) * 100;
      const startY = ((e.clientY - rect.top) / rect.height) * 100;
      const shiftKey = e.shiftKey;

      const onMove = (ev: MouseEvent) => {
        const curX = ((ev.clientX - rect.left) / rect.width) * 100;
        const curY = ((ev.clientY - rect.top) / rect.height) * 100;
        const x = Math.min(startX, curX);
        const y = Math.min(startY, curY);
        const w = Math.abs(curX - startX);
        const h = Math.abs(curY - startY);
        setSelectionBox({ x, y, w, h });
      };
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        setSelectionBox((box) => {
          if (box && (box.w > 1 || box.h > 1) && onDragBoxSelect) {
            onDragBoxSelect(box, shiftKey);
          } else if (!shiftKey) {
            onSelectElement(null);
            setTextEditingId(null);
          }
          return null;
        });
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [isEditing, onDragBoxSelect, onSelectElement, setTextEditingId]
  );

  return (
    <div
      ref={canvasRef}
      className="absolute inset-0"
      onMouseDown={handleMouseDown}
      onContextMenu={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          onContextMenuCanvas?.(e.clientX, e.clientY);
        }
      }}
    >
      {(isEditing && !exportMode) && <SnapGuides guides={snapGuides} showGrid={showGrid} />}

      {selectionBox && (
        <div
          className="absolute pointer-events-none border-2 border-blue-400 bg-blue-400/10"
          style={{
            left: `${selectionBox.x}%`,
            top: `${selectionBox.y}%`,
            width: `${selectionBox.w}%`,
            height: `${selectionBox.h}%`,
          }}
        />
      )}

      {sorted.map((el) => {
        const { x, y, width, height } = pctToPx(el);
        const isSelected = effectiveSelection.includes(el.id);
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
            onDragStart={() => {
              dragStartPositionsRef.current = {};
              effectiveSelection.forEach((id) => {
                const fromEl = elements.find((e) => e.id === id);
                if (fromEl) {
                  dragStartPositionsRef.current[id] = { x: fromEl.x, y: fromEl.y };
                }
              });
              if (!effectiveSelection.includes(el.id)) {
                dragStartPositionsRef.current[el.id] = { x: el.x, y: el.y };
              }
            }}
            onDrag={(_, d) => {
              if (!snapEnabled) return;
              const snap = computeSnap(el.id, { x: d.x, y: d.y, width, height });
              setSnapGuides(snap.guides);
            }}
            onDragStop={(_, d) => {
              setSnapGuides([]);
              const snap = computeSnap(el.id, { x: d.x, y: d.y, width, height });
              const newPct = pxToPct({ x: snap.x, y: snap.y, width, height });
              if (effectiveSelection.length > 1 && effectiveSelection.includes(el.id) && onMultiElementChange) {
                // Multi-move: apply same delta
                const originalStart = dragStartPositionsRef.current[el.id];
                if (!originalStart) {
                  onElementChange(el.id, newPct);
                  return;
                }
                const dx = newPct.x - originalStart.x;
                const dy = newPct.y - originalStart.y;
                const patches = effectiveSelection
                  .map((id) => {
                    const start = dragStartPositionsRef.current[id];
                    const origEl = elements.find((e) => e.id === id);
                    if (!start || !origEl) return null;
                    return {
                      id,
                      patch: {
                        x: Math.max(0, Math.min(100 - origEl.width, start.x + dx)),
                        y: Math.max(0, Math.min(100 - origEl.height, start.y + dy)),
                      },
                    };
                  })
                  .filter(Boolean) as Array<{ id: string; patch: Partial<SlideElement> }>;
                onMultiElementChange(patches);
              } else {
                onElementChange(el.id, newPct);
              }
            }}
            onResize={(_, __, ref, ___, pos) => {
              if (!snapEnabled) return;
              const snap = computeSnap(el.id, {
                x: pos.x,
                y: pos.y,
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
              setSnapGuides(snap.guides);
            }}
            onResizeStop={(_, __, ref, ___, pos) => {
              setSnapGuides([]);
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
              onSelectElement(el.id, (e as unknown as React.MouseEvent).shiftKey);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isSelected) onSelectElement(el.id, false);
              onContextMenuElement?.(el.id, (e as unknown as MouseEvent).clientX, (e as unknown as MouseEvent).clientY);
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
