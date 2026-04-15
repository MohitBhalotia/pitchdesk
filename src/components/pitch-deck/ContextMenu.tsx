"use client";

import React, { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  onClick?: () => void;
  shortcut?: string;
  danger?: boolean;
  separator?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export default function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // Clamp position so menu stays in viewport
  const [pos, setPos] = React.useState({ x, y });
  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const nx = Math.min(x, window.innerWidth - r.width - 8);
    const ny = Math.min(y, window.innerHeight - r.height - 8);
    setPos({ x: nx, y: ny });
  }, [x, y]);

  return (
    <div
      ref={ref}
      className="fixed z-[9999] min-w-[180px] bg-white border border-slate-200 shadow-xl rounded-md py-1 text-sm"
      style={{ left: pos.x, top: pos.y }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((item, i) => {
        if (item.separator) {
          return <div key={i} className="my-1 border-t border-slate-100" />;
        }
        return (
          <button
            key={i}
            disabled={item.disabled}
            onClick={() => {
              if (!item.disabled) {
                item.onClick?.();
                onClose();
              }
            }}
            className={`w-full px-3 py-1.5 text-left flex items-center justify-between gap-3 transition-colors ${
              item.disabled
                ? "text-slate-300 cursor-not-allowed"
                : item.danger
                ? "text-red-600 hover:bg-red-50"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span className="flex items-center gap-2">
              {item.icon}
              {item.label}
            </span>
            {item.shortcut && (
              <span className="text-[10px] text-slate-400 font-mono">{item.shortcut}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
