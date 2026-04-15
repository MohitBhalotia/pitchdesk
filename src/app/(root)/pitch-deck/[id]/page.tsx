"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  Loader2,
  StickyNote,
  FileSpreadsheet,
  Wand2,
  Zap,
  Minimize2,
  Maximize2,
  Target,
  Circle,
  Type,
  Upload,
  Sparkles,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Lock,
  Unlock,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignStartHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignEndVertical,
  Undo2,
  Redo2,
  Copy,
  Check,
  Play,
  AlertCircle,
  Image as ImageIcon,
  BarChart3,
  Table as TableIcon,
  Grid3x3,
  Keyboard,
  History,
  Share2,
  ZoomIn,
  ZoomOut,
  Group,
  Ungroup,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import SlideRenderer from "@/components/pitch-deck/SlideRenderer";
import { templateList, getTemplate } from "@/components/pitch-deck/templates";
import { migrateDeck, migrateSlide, createDefaultElements, applyLayoutPreset } from "@/lib/slide-migration";
import type { SlideElement, SlideV2, TextElement, ShapeElement, ImageElement, ChartElement, TableElement, ShapeKind, SlideTransition } from "@/types/slide-elements";
import { isSlideV2 } from "@/types/slide-elements";
import LayoutPresetPicker from "@/components/pitch-deck/LayoutPresetPicker";
import { FONT_FAMILIES } from "@/components/pitch-deck/FormatToolbar";
import GradientPicker from "@/components/pitch-deck/GradientPicker";
import IconPicker from "@/components/pitch-deck/IconPicker";
import ImageSearchPanel from "@/components/pitch-deck/ImageSearchPanel";
import AIAssistPanel from "@/components/pitch-deck/AIAssistPanel";
import ContextMenu, { type ContextMenuItem } from "@/components/pitch-deck/ContextMenu";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DecorativeElement {
  type: "divider" | "accent-bar" | "circle" | "quote-box";
  position: "top" | "bottom" | "left" | "right" | "center";
  color?: string;
}

interface SlideImage {
  url: string;
  publicId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Slide {
  slideType: string;
  order: number;
  // New element-based model
  elements?: SlideElement[];
  background?: string;
  // Legacy fields (backward compat)
  heading?: string;
  subheading?: string;
  bodyText?: string;
  bulletPoints?: string[];
  metrics?: Array<{ label: string; value: string }>;
  teamMembers?: Array<{ name: string; role: string; bio: string }>;
  chartData?: { type: string; labels: string[]; values: number[] };
  callToAction?: string;
  notes?: string;
  decorativeElements?: DecorativeElement[];
  images?: SlideImage[];
}

interface Deck {
  _id: string;
  title: string;
  templateId: string;
  slides: Slide[];
  companyData?: Record<string, string>;
  status: string;
}

const SLIDE_TYPES = [
  { value: "title", label: "Title Slide" },
  { value: "problem", label: "Problem" },
  { value: "solution", label: "Solution" },
  { value: "market", label: "Market" },
  { value: "product", label: "Product" },
  { value: "business_model", label: "Business Model" },
  { value: "traction", label: "Traction" },
  { value: "competition", label: "Competition" },
  { value: "team", label: "Team" },
  { value: "financials", label: "Financials" },
  { value: "ask", label: "The Ask" },
  { value: "closing", label: "Closing" },
];

// Sortable thumbnail component
function SortableThumbnail({
  slide,
  index,
  isActive,
  templateId,
  onClick,
  onDelete,
  onDuplicate,
  onContextMenu,
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  templateId: string;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: `slide-${index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div
        className={`relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
          isActive ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
        }`}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        <div className="absolute top-1 left-1 z-10 flex items-center gap-1">
          <div
            className="bg-black/60 text-white text-xs rounded px-1.5 py-0.5 cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-3 w-3 inline" />
            {index + 1}
          </div>
        </div>
        {/* Action buttons - visible on hover */}
        <div className="absolute top-1 right-1 z-10 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="bg-black/60 hover:bg-black/80 text-white rounded p-0.5"
            title="Duplicate slide"
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          >
            <Copy className="h-3 w-3" />
          </button>
          <button
            className="bg-red-500/80 hover:bg-red-500 text-white rounded p-0.5"
            title="Delete slide"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
        <div className="pointer-events-none">
          <SlideRenderer slide={slide} templateId={templateId} className="w-full" />
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 truncate capitalize">
        {slide.slideType.replace("_", " ")}
      </p>
    </div>
  );
}

export default function DeckEditorPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.id as string;

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [regenPrompt, setRegenPrompt] = useState("");
  const [showRegenDialog, setShowRegenDialog] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareInfo, setShareInfo] = useState<{ token?: string; enabled: boolean }>({ enabled: false });
  const [versions, setVersions] = useState<Array<{ _id: string; label?: string; createdAt: string }>>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items: ContextMenuItem[] } | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const undoStack = useRef<Slide[][]>([]);
  const redoStack = useRef<Slide[][]>([]);
  const clipboardRef = useRef<SlideElement[]>([]);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Fetch deck
  useEffect(() => {
    async function fetchDeck() {
      try {
        const res = await fetch(`/api/pitch-deck/${deckId}`);
        if (!res.ok) throw new Error("Failed to fetch deck");
        const data = await res.json();
        const migratedSlides = migrateDeck(data.deck.slides);
        setDeck({ ...data.deck, slides: migratedSlides });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load deck");
        router.push("/pitch-deck");
      } finally {
        setLoading(false);
      }
    }
    fetchDeck();
  }, [deckId, router]);

  // Auto-save with debounce
  const autoSave = useCallback(
    (updatedDeck: Deck) => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      setSaveStatus("saving");
      setSaving(true);
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/pitch-deck/${deckId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: updatedDeck.title,
              templateId: updatedDeck.templateId,
              slides: updatedDeck.slides,
            }),
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        } catch (error) {
          console.error("Auto-save failed:", error);
          setSaveStatus("error");
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    [deckId]
  );

  const updateDeck = useCallback(
    (updater: (prev: Deck) => Deck, skipUndo = false) => {
      setDeck((prev) => {
        if (!prev) return prev;
        if (!skipUndo) {
          // Deep-clone slides for undo snapshot
          undoStack.current = [
            ...undoStack.current.slice(-49),
            JSON.parse(JSON.stringify(prev.slides)),
          ];
          redoStack.current = [];
        }
        const updated = updater(prev);
        autoSave(updated);
        return updated;
      });
    },
    [autoSave]
  );

const handleElementChange = useCallback(
    (elementId: string, patch: Partial<SlideElement>) => {
      // Skip undo for pure text content changes (don't create undo entry per keystroke)
      const isContentOnly = Object.keys(patch).length === 1 && "content" in patch;
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === elementId ? ({ ...el, ...patch } as SlideElement) : el
          ),
        };
        return { ...prev, slides: newSlides };
      }, isContentOnly);
    },
    [activeSlideIndex, updateDeck]
  );

  const handleDeleteElement = useCallback(
    (elementId: string) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.filter((el) => el.id !== elementId),
        };
        return { ...prev, slides: newSlides };
      });
      setSelectedElementId(null);
    },
    [activeSlideIndex, updateDeck]
  );

  const handleAddTextElement = useCallback(() => {
    const newEl: SlideElement = {
      id: uuid(),
      type: "text",
      role: "body",
      content: "Click to edit",
      x: 10,
      y: 10,
      width: 40,
      height: 10,
      fontSize: 18,
    };
    updateDeck((prev) => {
      const newSlides = [...prev.slides];
      const slide = newSlides[activeSlideIndex];
      newSlides[activeSlideIndex] = {
        ...slide,
        elements: [...(slide.elements || []), newEl],
      };
      return { ...prev, slides: newSlides };
    });
    setSelectedElementId(newEl.id);
  }, [activeSlideIndex, updateDeck]);

  const handleDuplicateElement = useCallback(
    (elementId: string) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        const original = slide.elements.find((e) => e.id === elementId);
        if (!original) return prev;
        const copy: SlideElement = {
          ...original,
          id: uuid(),
          x: Math.min(original.x + 3, 90),
          y: Math.min(original.y + 3, 90),
        };
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: [...slide.elements, copy],
        };
        return { ...prev, slides: newSlides };
      });
    },
    [activeSlideIndex, updateDeck]
  );

  // Align selected element to slide edges / center
  const alignElement = useCallback(
    (mode: "left" | "center-h" | "right" | "top" | "center-v" | "bottom") => {
      if (!selectedElementId) return;
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((el) => {
            if (el.id !== selectedElementId) return el;
            let patch: Partial<SlideElement> = {};
            switch (mode) {
              case "left":       patch = { x: 0 }; break;
              case "center-h":   patch = { x: (100 - el.width) / 2 }; break;
              case "right":      patch = { x: 100 - el.width }; break;
              case "top":        patch = { y: 0 }; break;
              case "center-v":   patch = { y: (100 - el.height) / 2 }; break;
              case "bottom":     patch = { y: 100 - el.height }; break;
            }
            return { ...el, ...patch } as SlideElement;
          }),
        };
        return { ...prev, slides: newSlides };
      });
    },
    [selectedElementId, activeSlideIndex, updateDeck]
  );

  // Toggle lock on selected element
  const toggleLockElement = useCallback(
    (elementId: string) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === elementId ? { ...el, locked: !el.locked } : el
          ),
        };
        return { ...prev, slides: newSlides };
      });
    },
    [activeSlideIndex, updateDeck]
  );

  // Update slide background
  const setSlideBackground = useCallback(
    (bg: string) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], background: bg };
        return { ...prev, slides: newSlides };
      });
    },
    [activeSlideIndex, updateDeck]
  );

  const handleAddShapeElement = useCallback(
    (shape: "rect" | "circle" | "line" | "arrow") => {
      const isLinear = shape === "line" || shape === "arrow";
      const newEl: SlideElement = {
        id: uuid(),
        type: "shape",
        shape,
        x: 30,
        y: isLinear ? 48 : 30,
        width: 40,
        height: isLinear ? 6 : 30,
        fill: "#3b82f6",
        stroke: isLinear ? "#3b82f6" : "transparent",
        strokeWidth: isLinear ? 3 : 0,
        opacity: 1,
      };
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: [...(slide.elements || []), newEl],
        };
        return { ...prev, slides: newSlides };
      });
      setSelectedElementId(newEl.id);
    },
    [activeSlideIndex, updateDeck]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = Number(String(active.id).split("-")[1]);
      const newIndex = Number(String(over.id).split("-")[1]);

      updateDeck((prev) => {
        const newSlides = arrayMove(prev.slides, oldIndex, newIndex).map((s, i) => ({
          ...s,
          order: i,
        }));
        return { ...prev, slides: newSlides };
      });

      if (activeSlideIndex === oldIndex) {
        setActiveSlideIndex(newIndex);
      } else if (activeSlideIndex > oldIndex && activeSlideIndex <= newIndex) {
        setActiveSlideIndex(activeSlideIndex - 1);
      } else if (activeSlideIndex < oldIndex && activeSlideIndex >= newIndex) {
        setActiveSlideIndex(activeSlideIndex + 1);
      }
    },
    [activeSlideIndex, updateDeck]
  );

  const addSlide = useCallback(
    (slideType: string) => {
      updateDeck((prev) => {
        const newSlide: Slide = {
          slideType,
          order: prev.slides.length,
          elements: createDefaultElements(slideType),
        };
        return { ...prev, slides: [...prev.slides, newSlide] };
      });
      setActiveSlideIndex(deck?.slides.length || 0);
    },
    [updateDeck, deck?.slides.length]
  );

  const deleteSlide = useCallback(
    (index: number) => {
      if (!deck || deck.slides.length <= 1) {
        toast.error("Cannot delete the last slide");
        return;
      }
      updateDeck((prev) => ({
        ...prev,
        slides: prev.slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })),
      }));
      if (activeSlideIndex >= index && activeSlideIndex > 0) {
        setActiveSlideIndex(activeSlideIndex - 1);
      }
    },
    [activeSlideIndex, updateDeck, deck]
  );

  const duplicateSlide = useCallback(
    (index: number) => {
      updateDeck((prev) => {
        const original = prev.slides[index];
        const copy: Slide = {
          ...JSON.parse(JSON.stringify(original)),
          order: index + 1,
        };
        const newSlides = [
          ...prev.slides.slice(0, index + 1),
          copy,
          ...prev.slides.slice(index + 1),
        ].map((s, i) => ({ ...s, order: i }));
        return { ...prev, slides: newSlides };
      });
      setActiveSlideIndex(index + 1);
      toast.success("Slide duplicated");
    },
    [updateDeck]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    const prevSlides = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    setDeck((d) => {
      if (!d) return d;
      redoStack.current = [JSON.parse(JSON.stringify(d.slides)), ...redoStack.current.slice(0, 49)];
      const updated = { ...d, slides: prevSlides };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    const nextSlides = redoStack.current[0];
    redoStack.current = redoStack.current.slice(1);
    setDeck((d) => {
      if (!d) return d;
      undoStack.current = [...undoStack.current.slice(-49), JSON.parse(JSON.stringify(d.slides))];
      const updated = { ...d, slides: nextSlides };
      autoSave(updated);
      return updated;
    });
  }, [autoSave]);

  const handleCopyElement = useCallback(() => {
    if (!selectedElementId) return;
    setDeck((d) => {
      if (!d) return d;
      const slide = d.slides[activeSlideIndex];
      const el = slide?.elements?.find((e) => e.id === selectedElementId);
      if (el) {
        clipboardRef.current = [JSON.parse(JSON.stringify(el))];
        toast.success("Element copied");
      }
      return d;
    });
  }, [selectedElementId, activeSlideIndex]);

  const handlePasteElement = useCallback(() => {
    if (clipboardRef.current.length === 0) return;
    const newEls = clipboardRef.current.map((el) => ({
      ...JSON.parse(JSON.stringify(el)),
      id: uuid(),
      x: Math.min(el.x + 5, 85),
      y: Math.min(el.y + 5, 85),
    }));
    updateDeck((prev) => {
      const newSlides = [...prev.slides];
      const slide = newSlides[activeSlideIndex];
      newSlides[activeSlideIndex] = {
        ...slide,
        elements: [...(slide.elements || []), ...newEls],
      };
      return { ...prev, slides: newSlides };
    });
    setSelectedElementId(newEls[0].id);
  }, [activeSlideIndex, updateDeck]);

  const changeTemplate = useCallback(
    (templateId: string) => {
      updateDeck((prev) => ({ ...prev, templateId }));
    },
    [updateDeck]
  );

  // Export PDF
  const exportPDF = useCallback(async () => {
    if (!deck) return;

    toast.info("Generating PDF...");
    setIsExporting(true);
    // Wait 2 animation frames so React re-renders plain divs (no react-rnd handles)
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1280, 720] });

      for (let i = 0; i < deck.slides.length; i++) {
        const slideEl = slideRefs.current[i];
        if (!slideEl) continue;

        const canvas = await html2canvas(slideEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: null,
          width: 1280,
          height: 720,
        });

        const imgData = canvas.toDataURL("image/png");
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, 0, 1280, 720);
      }

      pdf.save(`${deck.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  }, [deck]);

  // AI Slide Regeneration
  const regenerateSlide = useCallback(
    async (instruction: string) => {
      if (!deck) return;
      setRegenerating(true);
      try {
        const res = await fetch("/api/pitch-deck/regenerate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slideIndices: [activeSlideIndex],
            instruction,
            companyData: deck.companyData || {},
            existingSlides: deck.slides,
          }),
        });
        if (!res.ok) throw new Error("Failed to regenerate");
        const data = await res.json();
        if (data.slides && data.slides.length > 0) {
          const regenSlide = migrateSlide(data.slides[0]);
          updateDeck((prev) => {
            const newSlides = [...prev.slides];
            newSlides[activeSlideIndex] = {
              ...newSlides[activeSlideIndex],
              elements: regenSlide.elements,
              order: newSlides[activeSlideIndex].order,
              slideType: newSlides[activeSlideIndex].slideType,
            };
            return { ...prev, slides: newSlides };
          });
          toast.success("Slide regenerated!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to regenerate slide");
      } finally {
        setRegenerating(false);
        setShowRegenDialog(false);
      }
    },
    [deck, activeSlideIndex, updateDeck]
  );

  // Image upload handler
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!deck) return;
      setUploadingImage(true);
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const res = await fetch("/api/pitch-deck/upload-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();

        const newImageEl: SlideElement = {
          id: uuid(),
          type: "image",
          imageUrl: data.url,
          imagePublicId: data.publicId,
          x: 60,
          y: 10,
          width: 30,
          height: 80,
          zIndex: 10,
          objectFit: "contain",
        };
        updateDeck((prev) => {
          const newSlides = [...prev.slides];
          const slide = newSlides[activeSlideIndex];
          const elements = slide.elements || [];
          const placeholderIdx = elements.findIndex(
            (e) => e.type === "image" && !(e as ImageElement).imageUrl
          );
          if (placeholderIdx >= 0) {
            // Fill placeholder — keep its position/size, just update imageUrl
            const updated = [...elements];
            const ph = updated[placeholderIdx];
            updated[placeholderIdx] = {
              ...ph,
              imageUrl: data.url,
              imagePublicId: data.publicId,
              objectFit: "contain",
            } as SlideElement;
            newSlides[activeSlideIndex] = { ...slide, elements: updated };
          } else {
            newSlides[activeSlideIndex] = { ...slide, elements: [...elements, newImageEl] };
          }
          return { ...prev, slides: newSlides };
        });
        toast.success("Image added to slide!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload image");
      } finally {
        setUploadingImage(false);
      }
    },
    [deck, activeSlideIndex, updateDeck]
  );

  // Drag-drop handler for canvas
  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type.startsWith("image/")) {
        handleImageUpload(files[0]);
      }
    },
    [handleImageUpload]
  );

  // AI image generation
  const handleGenerateImage = useCallback(async () => {
    if (!deck) return;
    const slide = deck.slides[activeSlideIndex];
    setGeneratingImage(true);
    try {
      const prompt = `Create a professional, minimal illustration for a pitch deck slide about: ${slide.heading || slide.slideType}. ${slide.bodyText || ""}. Style: clean, modern, suitable for business presentation. No text in the image.`;

      const res = await fetch("/api/pitch-deck/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Image generation failed");
      const data = await res.json();

      const newImageEl: SlideElement = {
        id: uuid(),
        type: "image",
        imageUrl: data.url,
        imagePublicId: data.publicId,
        x: 60,
        y: 10,
        width: 30,
        height: 80,
        zIndex: 10,
        objectFit: "contain",
      };
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const s = newSlides[activeSlideIndex];
        const elements = s.elements || [];
        const placeholderIdx = elements.findIndex(
          (e) => e.type === "image" && !(e as ImageElement).imageUrl
        );
        if (placeholderIdx >= 0) {
          const updated = [...elements];
          updated[placeholderIdx] = {
            ...updated[placeholderIdx],
            imageUrl: data.url,
            imagePublicId: data.publicId,
            objectFit: "contain",
          } as SlideElement;
          newSlides[activeSlideIndex] = { ...s, elements: updated };
        } else {
          newSlides[activeSlideIndex] = { ...s, elements: [...elements, newImageEl] };
        }
        return { ...prev, slides: newSlides };
      });
      toast.success("AI image generated and added!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate image");
    } finally {
      setGeneratingImage(false);
    }
  }, [deck, activeSlideIndex, updateDeck]);

  // Insert icon element
  const handleAddIconElement = useCallback(
    (iconName: string) => {
      const newEl: SlideElement = {
        id: uuid(),
        type: "icon",
        iconName,
        x: 40,
        y: 35,
        width: 20,
        height: 30,
        color: undefined,
      } as SlideElement;
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: [...(slide.elements || []), newEl],
        };
        return { ...prev, slides: newSlides };
      });
      setSelectedElementId(newEl.id);
    },
    [activeSlideIndex, updateDeck]
  );

  // Multi-element change (batch)
  const handleMultiElementChange = useCallback(
    (patches: Array<{ id: string; patch: Partial<SlideElement> }>) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        const patchMap = new Map(patches.map((p) => [p.id, p.patch]));
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((el) =>
            patchMap.has(el.id) ? ({ ...el, ...patchMap.get(el.id) } as SlideElement) : el
          ),
        };
        return { ...prev, slides: newSlides };
      });
    },
    [activeSlideIndex, updateDeck]
  );

  // Selection handler
  const handleSelect = useCallback((id: string | null, shiftKey?: boolean) => {
    if (id === null) {
      setSelectedElementId(null);
      setSelectedIds([]);
      return;
    }
    if (shiftKey) {
      setSelectedIds((prev) => {
        const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
        setSelectedElementId(next[next.length - 1] || null);
        return next;
      });
    } else {
      setSelectedElementId(id);
      setSelectedIds([id]);
    }
  }, []);

  // Drag-box selection
  const handleDragBoxSelect = useCallback(
    (box: { x: number; y: number; w: number; h: number }, shiftKey: boolean) => {
      setDeck((d) => {
        if (!d) return d;
        const slide = d.slides[activeSlideIndex];
        if (!slide.elements) return d;
        const inBox = slide.elements
          .filter(
            (el) =>
              el.x >= box.x &&
              el.y >= box.y &&
              el.x + el.width <= box.x + box.w &&
              el.y + el.height <= box.y + box.h
          )
          .map((el) => el.id);
        if (shiftKey) {
          setSelectedIds((prev) => Array.from(new Set([...prev, ...inBox])));
        } else {
          setSelectedIds(inBox);
        }
        setSelectedElementId(inBox[inBox.length - 1] || null);
        return d;
      });
    },
    [activeSlideIndex]
  );

  // Insert chart element
  const handleAddChartElement = useCallback(
    (chartKind: ChartElement["chartKind"] = "bar") => {
      const newEl: ChartElement = {
        id: uuid(),
        type: "chart",
        chartKind,
        labels: ["Q1", "Q2", "Q3", "Q4"],
        values: [10, 25, 45, 80],
        x: 15,
        y: 25,
        width: 70,
        height: 55,
        title: "",
      };
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        newSlides[activeSlideIndex] = { ...slide, elements: [...(slide.elements || []), newEl] };
        return { ...prev, slides: newSlides };
      });
      setSelectedElementId(newEl.id);
    },
    [activeSlideIndex, updateDeck]
  );

  // Insert table element
  const handleAddTableElement = useCallback(() => {
    const newEl: TableElement = {
      id: uuid(),
      type: "table",
      rows: [
        ["Metric", "Q1", "Q2", "Q3"],
        ["Revenue", "$100K", "$250K", "$500K"],
        ["Customers", "50", "125", "300"],
      ],
      headerRow: true,
      x: 15,
      y: 25,
      width: 70,
      height: 35,
      fontSize: 14,
    };
    updateDeck((prev) => {
      const newSlides = [...prev.slides];
      const slide = newSlides[activeSlideIndex];
      newSlides[activeSlideIndex] = { ...slide, elements: [...(slide.elements || []), newEl] };
      return { ...prev, slides: newSlides };
    });
    setSelectedElementId(newEl.id);
  }, [activeSlideIndex, updateDeck]);

  // Element grouping
  const handleGroupElements = useCallback(() => {
    if (selectedIds.length < 2) {
      toast.error("Select 2+ elements to group");
      return;
    }
    const groupId = uuid();
    updateDeck((prev) => {
      const newSlides = [...prev.slides];
      const slide = newSlides[activeSlideIndex];
      if (!slide.elements) return prev;
      newSlides[activeSlideIndex] = {
        ...slide,
        elements: slide.elements.map((el) =>
          selectedIds.includes(el.id) ? ({ ...el, groupId } as SlideElement) : el
        ),
      };
      return { ...prev, slides: newSlides };
    });
    toast.success("Elements grouped");
  }, [selectedIds, activeSlideIndex, updateDeck]);

  const handleUngroupElements = useCallback(() => {
    if (selectedIds.length === 0) return;
    updateDeck((prev) => {
      const newSlides = [...prev.slides];
      const slide = newSlides[activeSlideIndex];
      if (!slide.elements) return prev;
      newSlides[activeSlideIndex] = {
        ...slide,
        elements: slide.elements.map((el) =>
          selectedIds.includes(el.id) ? ({ ...el, groupId: undefined } as SlideElement) : el
        ),
      };
      return { ...prev, slides: newSlides };
    });
    toast.success("Ungrouped");
  }, [selectedIds, activeSlideIndex, updateDeck]);

  // When an element in a group is selected, auto-select its siblings
  const selectGroupSiblings = useCallback(
    (id: string) => {
      const slide = deck?.slides[activeSlideIndex];
      const target = slide?.elements?.find((e) => e.id === id);
      if (!target?.groupId) return;
      const siblings = slide!.elements!.filter((e) => e.groupId === target.groupId).map((e) => e.id);
      setSelectedIds(siblings);
      setSelectedElementId(id);
    },
    [deck, activeSlideIndex]
  );
  useEffect(() => {
    if (selectedElementId && selectedIds.length <= 1) {
      selectGroupSiblings(selectedElementId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedElementId]);

  // Slide transition
  const setSlideTransition = useCallback(
    (t: SlideTransition) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], transition: t } as Slide & { transition?: SlideTransition };
        return { ...prev, slides: newSlides };
      });
    },
    [activeSlideIndex, updateDeck]
  );

  // Share link
  const openShareDialog = useCallback(async () => {
    try {
      const res = await fetch(`/api/pitch-deck/${deckId}`);
      const data = await res.json();
      setShareInfo({
        token: data.deck?.shareToken,
        enabled: !!data.deck?.shareEnabled,
      });
      setShowShare(true);
    } catch {
      toast.error("Failed to load share status");
    }
  }, [deckId]);

  const toggleShare = useCallback(
    async (enabled: boolean) => {
      try {
        const res = await fetch(`/api/pitch-deck/${deckId}/share`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setShareInfo({ token: data.shareToken, enabled: data.shareEnabled });
        toast.success(enabled ? "Sharing enabled" : "Sharing disabled");
      } catch {
        toast.error("Failed to update share status");
      }
    },
    [deckId]
  );

  // Version history
  const loadVersions = useCallback(async () => {
    try {
      const res = await fetch(`/api/pitch-deck/${deckId}/versions`);
      const data = await res.json();
      setVersions(data.versions || []);
    } catch {
      toast.error("Failed to load versions");
    }
  }, [deckId]);

  const saveVersion = useCallback(
    async (label?: string) => {
      try {
        await fetch(`/api/pitch-deck/${deckId}/versions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label }),
        });
        toast.success("Version saved");
        loadVersions();
      } catch {
        toast.error("Failed to save version");
      }
    },
    [deckId, loadVersions]
  );

  const restoreVersion = useCallback(
    async (versionId: string) => {
      if (!confirm("Restore this version? Current changes will be overwritten.")) return;
      try {
        const res = await fetch(`/api/pitch-deck/${deckId}/versions/${versionId}`, {
          method: "POST",
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const migrated = migrateDeck(data.deck.slides);
        setDeck({ ...data.deck, slides: migrated });
        toast.success("Version restored");
        setShowVersions(false);
      } catch {
        toast.error("Failed to restore version");
      }
    },
    [deckId]
  );

  // Context menu handlers
  const openElementContextMenu = useCallback(
    (id: string, x: number, y: number) => {
      const slide = deck?.slides[activeSlideIndex];
      const el = slide?.elements?.find((e) => e.id === id);
      if (!el) return;
      const items: ContextMenuItem[] = [
        { label: "Copy", shortcut: "Ctrl+C", onClick: () => { setSelectedElementId(id); handleCopyElement(); } },
        { label: "Duplicate", shortcut: "Ctrl+D", onClick: () => handleDuplicateElement(id) },
        { label: el.locked ? "Unlock" : "Lock", onClick: () => toggleLockElement(id) },
        { separator: true, label: "" },
        { label: "Bring Forward", onClick: () => handleElementChange(id, { zIndex: (el.zIndex || 1) + 1 }) },
        { label: "Send Backward", onClick: () => handleElementChange(id, { zIndex: Math.max(0, (el.zIndex || 1) - 1) }) },
        { separator: true, label: "" },
        { label: "Delete", shortcut: "Del", danger: true, onClick: () => handleDeleteElement(id) },
      ];
      setContextMenu({ x, y, items });
    },
    [deck, activeSlideIndex, handleCopyElement, handleDuplicateElement, toggleLockElement, handleElementChange, handleDeleteElement]
  );

  const openCanvasContextMenu = useCallback(
    (x: number, y: number) => {
      const items: ContextMenuItem[] = [
        { label: "Paste", shortcut: "Ctrl+V", onClick: handlePasteElement, disabled: clipboardRef.current.length === 0 },
        { label: "Add Text", onClick: handleAddTextElement },
        { label: "Add Rectangle", onClick: () => handleAddShapeElement("rect") },
        { label: "Add Circle", onClick: () => handleAddShapeElement("circle") },
        { separator: true, label: "" },
        { label: "Select All", shortcut: "Ctrl+A", onClick: () => handleDragBoxSelect({ x: 0, y: 0, w: 100, h: 100 }, false) },
      ];
      setContextMenu({ x, y, items });
    },
    [handlePasteElement, handleAddTextElement, handleAddShapeElement, handleDragBoxSelect]
  );

  const openSlideThumbContextMenu = useCallback(
    (index: number, x: number, y: number) => {
      const items: ContextMenuItem[] = [
        { label: "Duplicate Slide", onClick: () => duplicateSlide(index) },
        { label: "Delete Slide", danger: true, onClick: () => deleteSlide(index) },
      ];
      setContextMenu({ x, y, items });
    },
    [duplicateSlide, deleteSlide]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isTyping = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      } else if (ctrl && e.key === "c" && !isTyping) {
        handleCopyElement();
      } else if (ctrl && e.key === "v" && !isTyping) {
        e.preventDefault();
        handlePasteElement();
      } else if (ctrl && e.shiftKey && e.key === "G" && !isTyping) {
        e.preventDefault();
        handleUngroupElements();
      } else if (ctrl && e.key === "g" && !isTyping) {
        e.preventDefault();
        handleGroupElements();
      } else if (e.key === "?" && !isTyping) {
        e.preventDefault();
        setShowShortcuts(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo, handleCopyElement, handlePasteElement, handleGroupElements, handleUngroupElements]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!deck) return null;

  const activeSlide = deck.slides[activeSlideIndex];
  const currentTemplate = getTemplate(deck.templateId);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/pitch-deck")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {editingTitle ? (
            <Input
              className="w-64 h-8 text-sm font-medium"
              value={deck.title}
              onChange={(e) => setDeck((d) => d ? { ...d, title: e.target.value } : d)}
              onBlur={() => {
                setEditingTitle(false);
                autoSave(deck);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditingTitle(false);
                  autoSave(deck);
                }
              }}
              autoFocus
            />
          ) : (
            <h1
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={() => setEditingTitle(true)}
            >
              {deck.title}
            </h1>
          )}
          <div className="flex items-center gap-1 ml-1">
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving…
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1 text-xs text-green-600">
                <Check className="h-3 w-3" />
                Saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="h-3 w-3" />
                Save failed
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Undo (Ctrl+Z)"
              onClick={handleUndo}
              disabled={undoStack.current.length === 0}
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              title="Redo (Ctrl+Shift+Z)"
              onClick={handleRedo}
              disabled={redoStack.current.length === 0}
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Group / Ungroup */}
          <div className="flex items-center gap-0.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Group (Ctrl+G)" onClick={handleGroupElements} disabled={selectedIds.length < 2}>
              <Group className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" title="Ungroup (Ctrl+Shift+G)" onClick={handleUngroupElements} disabled={selectedIds.length === 0}>
              <Ungroup className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Grid / Snap */}
          <Button variant={showGrid ? "secondary" : "ghost"} size="icon" className="h-7 w-7" title="Toggle grid" onClick={() => setShowGrid((v) => !v)}>
            <Grid3x3 className="h-3.5 w-3.5" />
          </Button>
          <Button variant={snapEnabled ? "secondary" : "ghost"} size="sm" className="h-7 px-2 text-[10px]" title="Toggle snap" onClick={() => setSnapEnabled((v) => !v)}>
            Snap
          </Button>

          {/* Zoom */}
          <div className="flex items-center gap-0.5 border rounded">
            <button className="px-1 hover:bg-muted" title="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
              <ZoomOut className="h-3 w-3" />
            </button>
            <span className="text-[10px] tabular-nums w-8 text-center">{zoom}%</span>
            <button className="px-1 hover:bg-muted" title="Zoom in" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
              <ZoomIn className="h-3 w-3" />
            </button>
          </div>

          {/* Shortcuts */}
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Keyboard shortcuts (?)" onClick={() => setShowShortcuts(true)}>
            <Keyboard className="h-3.5 w-3.5" />
          </Button>

          {/* Versions */}
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Version history" onClick={() => { setShowVersions(true); loadVersions(); }}>
            <History className="h-3.5 w-3.5" />
          </Button>

          {/* Share */}
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Share" onClick={openShareDialog}>
            <Share2 className="h-3.5 w-3.5" />
          </Button>

          {/* Present button */}
          <Button
            variant="default"
            size="sm"
            className="h-7 text-xs"
            title="Present slideshow"
            onClick={() => window.open(`/pitch-deck/${deckId}/present`, "_blank")}
          >
            <Play className="h-3.5 w-3.5 mr-1" />
            Present
          </Button>

          {/* Template Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {currentTemplate.metadata.name}
                <ChevronDown className="ml-2 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {templateList.map((t) => (
                <DropdownMenuItem
                  key={t.metadata.id}
                  onClick={() => changeTemplate(t.metadata.id)}
                  className={deck.templateId === t.metadata.id ? "bg-accent" : ""}
                >
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: t.metadata.colors.primary }} />
                  {t.metadata.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={() => setShowNotes(!showNotes)}>
            <StickyNote className="h-4 w-4 mr-1" />
            Notes
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportPDF}>
                <Download className="h-3.5 w-3.5 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                if (!deck) return;
                toast.info("Generating PPTX...");
                try {
                  const { exportDeckToPPTX } = await import("@/lib/pptx-export");
                  await exportDeckToPPTX(deck.title, deck.slides, currentTemplate.metadata.colors);
                  toast.success("PPTX exported successfully!");
                } catch (error) {
                  console.error("PPTX export failed:", error);
                  toast.error("Failed to export PPTX");
                }
              }}>
                <FileSpreadsheet className="h-3.5 w-3.5 mr-2" />
                Export as PPTX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                if (!deck) return;
                toast.info("Exporting slides as PNG...");
                setIsExporting(true);
                await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
                try {
                  const html2canvas = (await import("html2canvas")).default;
                  const JSZip = (await import("jszip")).default;
                  const zip = new JSZip();
                  for (let i = 0; i < deck.slides.length; i++) {
                    const slideEl = slideRefs.current[i];
                    if (!slideEl) continue;
                    const canvas = await html2canvas(slideEl, { scale: 2, useCORS: true, backgroundColor: null, width: 1280, height: 720 });
                    const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/png"));
                    zip.file(`slide-${i + 1}.png`, blob);
                  }
                  const content = await zip.generateAsync({ type: "blob" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(content);
                  a.download = `${deck.title.replace(/\s+/g, "-").toLowerCase()}-slides.zip`;
                  a.click();
                  toast.success("PNG slides exported!");
                } catch (error) {
                  console.error("PNG export failed:", error);
                  toast.error("Failed to export PNGs");
                } finally {
                  setIsExporting(false);
                }
              }}>
                <ImageIcon className="h-3.5 w-3.5 mr-2" />
                Export as PNG (ZIP)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Slide Thumbnails */}
        <div className="w-52 border-r bg-muted/30 overflow-y-auto p-3 space-y-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext
              items={deck.slides.map((_, i) => `slide-${i}`)}
              strategy={verticalListSortingStrategy}
            >
              {deck.slides.map((slide, index) => (
                <SortableThumbnail
                  key={`slide-${index}`}
                  slide={slide}
                  index={index}
                  isActive={index === activeSlideIndex}
                  templateId={deck.templateId}
                  onClick={() => setActiveSlideIndex(index)}
                  onDelete={() => deleteSlide(index)}
                  onDuplicate={() => duplicateSlide(index)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    openSlideThumbContextMenu(index, e.clientX, e.clientY);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Slide Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-3 w-3 mr-1" />
                Add Slide
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {SLIDE_TYPES.map((type) => (
                <DropdownMenuItem key={type.value} onClick={() => addSlide(type.value)}>
                  {type.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Panel - Main Slide Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Add Element Toolbar */}
          <div className="flex items-center justify-center gap-1 px-4 py-1.5 border-b bg-background/80">
            <span className="text-xs text-muted-foreground mr-2">Add:</span>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Add Text"
              onClick={handleAddTextElement}>
              <Type className="h-3.5 w-3.5 mr-1" />
              Text
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Add Shape">
                  <Circle className="h-3.5 w-3.5 mr-1" />
                  Shape
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {(["rect","circle","line","arrow","triangle","diamond","star","pentagon","hexagon","parallelogram","rounded-rect","process-arrow","cloud"] as ShapeKind[]).map((s) => (
                  <DropdownMenuItem key={s} onClick={() => handleAddShapeElement(s as "rect" | "circle" | "line" | "arrow")}>
                    <span className="capitalize">{s.replace("-"," ")}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Add Chart">
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />
                  Chart
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleAddChartElement("bar")}>Bar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChartElement("line")}>Line</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChartElement("area")}>Area</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChartElement("pie")}>Pie</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddChartElement("donut")}>Donut</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Add Table" onClick={handleAddTableElement}>
              <TableIcon className="h-3.5 w-3.5 mr-1" />
              Table
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Upload Image"
              disabled={uploadingImage}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleImageUpload(file);
                };
                input.click();
              }}>
              <Upload className="h-3.5 w-3.5 mr-1" />
              Image
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" title="Generate AI Image"
              disabled={generatingImage}
              onClick={handleGenerateImage}>
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              AI Image
            </Button>
            <Button
              variant={showIconPicker ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-2 text-xs"
              title="Insert icon"
              onClick={() => setShowIconPicker((v) => !v)}
            >
              <Zap className="h-3.5 w-3.5 mr-1" />
              Icons
            </Button>
          </div>
          {/* Icon picker panel */}
          {showIconPicker && (
            <div className="border-b px-4 py-3 bg-background/95">
              <p className="text-xs font-medium mb-2">Click an icon to add it to the slide</p>
              <IconPicker
                onSelect={(name) => {
                  handleAddIconElement(name);
                  setShowIconPicker(false);
                }}
              />
            </div>
          )}

          <div className="flex-1 flex items-center justify-center p-8 bg-muted/20"
            onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "copy"; }}
            onDrop={handleCanvasDrop}>
            <div className="w-full max-w-4xl">
              <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center", transition: "transform 0.15s" }}>
                <SlideRenderer
                  slide={activeSlide}
                  templateId={deck.templateId}
                  isEditing={true}
                  selectedElementId={selectedElementId}
                  selectedIds={selectedIds}
                  onSelectElement={handleSelect}
                  onElementChange={handleElementChange}
                  onMultiElementChange={handleMultiElementChange}
                  onDeleteElement={handleDeleteElement}
                  onDuplicateElement={handleDuplicateElement}
                  showGrid={showGrid}
                  snapEnabled={snapEnabled}
                  onContextMenuElement={openElementContextMenu}
                  onContextMenuCanvas={openCanvasContextMenu}
                  onDragBoxSelect={handleDragBoxSelect}
                  exportMode={isExporting}
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="border-t p-4 bg-background">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Speaker Notes</label>
              <Textarea
                className="resize-none text-sm"
                rows={3}
                placeholder="Add speaker notes for this slide..."
                value={activeSlide?.notes || ""}
                onChange={(e) => {
                  updateDeck((prev) => {
                    const newSlides = [...prev.slides];
                    newSlides[activeSlideIndex] = { ...newSlides[activeSlideIndex], notes: e.target.value };
                    return { ...prev, slides: newSlides };
                  });
                }}
              />
            </div>
          )}
        </div>

        {/* Right Panel - Properties */}
        <div className="w-64 border-l bg-muted/30 overflow-y-auto p-4 space-y-6">
          {/* Slide Info + Type Changer */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Slide</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium capitalize hover:text-primary transition-colors cursor-pointer">
                  {activeSlide?.slideType.replace("_", " ")}
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {SLIDE_TYPES.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    className={activeSlide?.slideType === type.value ? "bg-accent" : ""}
                    onClick={() => {
                      if (activeSlide?.slideType === type.value) return;
                      updateDeck((prev) => {
                        const newSlides = [...prev.slides];
                        const current = newSlides[activeSlideIndex];
                        newSlides[activeSlideIndex] = {
                          ...current,
                          slideType: type.value,
                          elements: createDefaultElements(type.value),
                        };
                        return { ...prev, slides: newSlides };
                      });
                      setSelectedElementId(null);
                    }}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="text-xs text-muted-foreground mt-1">Slide {activeSlideIndex + 1} of {deck.slides.length}</p>

            {/* Background */}
            <div className="mt-3">
              <label className="text-xs text-muted-foreground block mb-1.5">Background</label>
              <GradientPicker
                value={activeSlide?.background || ""}
                onChange={setSlideBackground}
              />
            </div>

            {/* Transition */}
            <div className="mt-3">
              <label className="text-xs text-muted-foreground block mb-1.5">Transition</label>
              <select
                className="w-full h-7 px-2 text-xs border rounded bg-background"
                value={(activeSlide as Slide & { transition?: SlideTransition }).transition || "fade"}
                onChange={(e) => setSlideTransition(e.target.value as SlideTransition)}
              >
                <option value="fade">Fade</option>
                <option value="slide-left">Slide Left</option>
                <option value="slide-right">Slide Right</option>
                <option value="zoom">Zoom</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>

          {/* Element Properties */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Element</h3>
            {(() => {
              const el = selectedElementId
                ? activeSlide?.elements?.find((e) => e.id === selectedElementId)
                : null;
              if (!el) {
                return <p className="text-xs text-muted-foreground">Click an element to select it</p>;
              }
              return (
                <div className="space-y-3">
                  {/* Type badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                      {el.type}
                    </span>
                    <button
                      className={`h-6 px-2 text-xs border rounded flex items-center gap-1 transition-colors ${el.locked ? "bg-orange-50 border-orange-300 text-orange-600" : "hover:bg-muted"}`}
                      onClick={() => toggleLockElement(el.id)}
                      title={el.locked ? "Unlock element" : "Lock element"}
                    >
                      {el.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      {el.locked ? "Locked" : "Lock"}
                    </button>
                  </div>

                  {/* Position & Size */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Position & Size (%)</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(["x", "y", "width", "height"] as const).map((prop) => (
                        <div key={prop} className="flex items-center gap-1 border rounded px-1.5 py-0.5 bg-background">
                          <span className="text-[10px] text-muted-foreground uppercase w-5 shrink-0">{prop}</span>
                          <input
                            type="number"
                            min={prop === "width" || prop === "height" ? 1 : 0}
                            max={100}
                            step={0.5}
                            className="w-full text-xs bg-transparent focus:outline-none text-right"
                            value={Math.round(el[prop] * 10) / 10}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (!isNaN(v)) handleElementChange(el.id, { [prop]: Math.max(0, Math.min(100, v)) });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Alignment */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1.5">Align to Slide</label>
                    <div className="grid grid-cols-3 gap-1">
                      <button className="h-7 border rounded hover:bg-muted flex items-center justify-center" title="Align left" onClick={() => alignElement("left")}><AlignStartVertical className="h-3 w-3" /></button>
                      <button className="h-7 border rounded hover:bg-muted flex items-center justify-center" title="Center horizontally" onClick={() => alignElement("center-h")}><AlignHorizontalJustifyCenter className="h-3 w-3" /></button>
                      <button className="h-7 border rounded hover:bg-muted flex items-center justify-center" title="Align right" onClick={() => alignElement("right")}><AlignEndVertical className="h-3 w-3" /></button>
                      <button className="h-7 border rounded hover:bg-muted flex items-center justify-center" title="Align top" onClick={() => alignElement("top")}><AlignStartHorizontal className="h-3 w-3" /></button>
                      <button className="h-7 border rounded hover:bg-muted flex items-center justify-center" title="Center vertically" onClick={() => alignElement("center-v")}><AlignVerticalJustifyCenter className="h-3 w-3" /></button>
                      <button className="h-7 border rounded hover:bg-muted flex items-center justify-center" title="Align bottom" onClick={() => alignElement("bottom")}><AlignEndHorizontal className="h-3 w-3" /></button>
                    </div>
                  </div>

                  {/* Text-specific */}
                  {el.type === "text" && (
                    <>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Font Size</label>
                          <input
                            type="number" min={8} max={200}
                            className="w-full h-7 px-2 text-xs border rounded bg-background"
                            value={(el as TextElement).fontSize || 16}
                            onChange={(e) => handleElementChange(el.id, { fontSize: Number(e.target.value) } as Partial<TextElement>)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Line Height</label>
                          <input
                            type="number" min={1} max={3} step={0.1}
                            className="w-full h-7 px-2 text-xs border rounded bg-background"
                            value={(el as TextElement).lineHeight || 1.4}
                            onChange={(e) => handleElementChange(el.id, { lineHeight: Number(e.target.value) } as Partial<TextElement>)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Font</label>
                        <select
                          className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as TextElement).fontFamily || ""}
                          onChange={(e) => handleElementChange(el.id, { fontFamily: e.target.value || undefined } as Partial<TextElement>)}
                        >
                          {FONT_FAMILIES.map((f) => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Style</label>
                        <div className="flex gap-1">
                          <button
                            className={`flex-1 h-7 text-xs border rounded font-bold transition-colors ${(el as TextElement).fontWeight === "bold" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            onClick={() => handleElementChange(el.id, { fontWeight: (el as TextElement).fontWeight === "bold" ? "normal" : "bold" } as Partial<TextElement>)}
                          >
                            <Bold className="h-3 w-3 mx-auto" />
                          </button>
                          <button
                            className={`flex-1 h-7 text-xs border rounded italic transition-colors ${(el as TextElement).fontStyle === "italic" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            onClick={() => handleElementChange(el.id, { fontStyle: (el as TextElement).fontStyle === "italic" ? "normal" : "italic" } as Partial<TextElement>)}
                          >
                            <Italic className="h-3 w-3 mx-auto" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Align</label>
                        <div className="flex gap-1">
                          {(["left", "center", "right"] as const).map((align) => {
                            const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
                            return (
                              <button
                                key={align}
                                className={`flex-1 h-7 text-xs border rounded transition-colors ${(el as TextElement).textAlign === align ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                                onClick={() => handleElementChange(el.id, { textAlign: align } as Partial<TextElement>)}
                              >
                                <Icon className="h-3 w-3 mx-auto" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            className="w-8 h-7 rounded border cursor-pointer"
                            value={(el as TextElement).color || "#ffffff"}
                            onChange={(e) => handleElementChange(el.id, { color: e.target.value } as Partial<TextElement>)}
                          />
                          {(el as TextElement).color && (
                            <button className="text-xs text-muted-foreground hover:text-foreground"
                              onClick={() => handleElementChange(el.id, { color: undefined } as Partial<TextElement>)}>
                              Reset to theme
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Shape-specific */}
                  {el.type === "shape" && (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Shape</label>
                        <select
                          className="w-full h-7 px-2 text-xs border rounded bg-background capitalize"
                          value={(el as ShapeElement).shape}
                          onChange={(e) => handleElementChange(el.id, { shape: e.target.value as ShapeKind } as Partial<SlideElement>)}
                        >
                          {(["rect","circle","line","arrow","triangle","diamond","star","pentagon","hexagon","parallelogram","rounded-rect","process-arrow","cloud"] as ShapeKind[]).map((s) => (
                            <option key={s} value={s}>{s.replace("-"," ")}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Fill</label>
                          <input type="color" className="w-full h-7 rounded border cursor-pointer"
                            value={(el as ShapeElement).fill || "#3b82f6"}
                            onChange={(e) => handleElementChange(el.id, { fill: e.target.value } as Partial<SlideElement>)}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">Stroke</label>
                          <input type="color" className="w-full h-7 rounded border cursor-pointer"
                            value={(el as ShapeElement).stroke || "#000000"}
                            onChange={(e) => handleElementChange(el.id, { stroke: e.target.value } as Partial<SlideElement>)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Stroke Style</label>
                        <select
                          className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as ShapeElement).strokeStyle || "solid"}
                          onChange={(e) => handleElementChange(el.id, { strokeStyle: e.target.value } as Partial<SlideElement>)}
                        >
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Stroke Width: {(el as ShapeElement).strokeWidth ?? 0}px</label>
                        <input type="range" min={0} max={12} className="w-full"
                          value={(el as ShapeElement).strokeWidth ?? 0}
                          onChange={(e) => handleElementChange(el.id, { strokeWidth: Number(e.target.value) } as Partial<SlideElement>)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Opacity: {Math.round(((el as ShapeElement).opacity ?? 1) * 100)}%</label>
                        <input type="range" min={0} max={100} className="w-full"
                          value={Math.round(((el as ShapeElement).opacity ?? 1) * 100)}
                          onChange={(e) => handleElementChange(el.id, { opacity: Number(e.target.value) / 100 } as Partial<SlideElement>)}
                        />
                      </div>
                    </>
                  )}

                  {/* Icon-specific */}
                  {el.type === "icon" && (
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Icon Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          className="w-8 h-7 rounded border cursor-pointer"
                          value={(el as {color?: string}).color || "#ffffff"}
                          onChange={(e) => handleElementChange(el.id, { color: e.target.value } as Partial<SlideElement>)}
                        />
                        {(el as {color?: string}).color && (
                          <button className="text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => handleElementChange(el.id, { color: undefined } as Partial<SlideElement>)}>
                            Reset to theme
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Image-specific */}
                  {el.type === "image" && (
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Fit</label>
                      <div className="flex gap-1">
                        {(["contain", "cover", "fill"] as const).map((fit) => (
                          <button
                            key={fit}
                            className={`flex-1 h-7 text-xs border rounded capitalize transition-colors ${(el as ImageElement).objectFit === fit ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            onClick={() => handleElementChange(el.id, { objectFit: fit } as Partial<SlideElement>)}
                          >
                            {fit}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chart-specific */}
                  {el.type === "chart" && (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Chart Type</label>
                        <select className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as ChartElement).chartKind}
                          onChange={(e) => handleElementChange(el.id, { chartKind: e.target.value } as Partial<SlideElement>)}
                        >
                          <option value="bar">Bar</option>
                          <option value="line">Line</option>
                          <option value="area">Area</option>
                          <option value="pie">Pie</option>
                          <option value="donut">Donut</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Labels (comma separated)</label>
                        <input type="text" className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as ChartElement).labels.join(", ")}
                          onChange={(e) => handleElementChange(el.id, { labels: e.target.value.split(",").map(s => s.trim()) } as Partial<SlideElement>)}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Values (comma separated)</label>
                        <input type="text" className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as ChartElement).values.join(", ")}
                          onChange={(e) => {
                            const vals = e.target.value.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                            handleElementChange(el.id, { values: vals } as Partial<SlideElement>);
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Title</label>
                        <input type="text" className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as ChartElement).title || ""}
                          onChange={(e) => handleElementChange(el.id, { title: e.target.value } as Partial<SlideElement>)}
                        />
                      </div>
                    </>
                  )}

                  {/* Table-specific */}
                  {el.type === "table" && (() => {
                    const t = el as TableElement;
                    return (
                      <>
                        <div className="flex gap-1">
                          <button className="flex-1 h-7 text-xs border rounded hover:bg-muted"
                            onClick={() => handleElementChange(el.id, { rows: [...t.rows, new Array(t.rows[0]?.length || 3).fill("")] } as Partial<SlideElement>)}>
                            + Row
                          </button>
                          <button className="flex-1 h-7 text-xs border rounded hover:bg-muted"
                            onClick={() => handleElementChange(el.id, { rows: t.rows.map(r => [...r, ""]) } as Partial<SlideElement>)}>
                            + Column
                          </button>
                        </div>
                        <div className="flex gap-1">
                          <button className="flex-1 h-7 text-xs border rounded hover:bg-muted"
                            disabled={t.rows.length <= 1}
                            onClick={() => handleElementChange(el.id, { rows: t.rows.slice(0, -1) } as Partial<SlideElement>)}>
                            − Row
                          </button>
                          <button className="flex-1 h-7 text-xs border rounded hover:bg-muted"
                            disabled={(t.rows[0]?.length || 0) <= 1}
                            onClick={() => handleElementChange(el.id, { rows: t.rows.map(r => r.slice(0, -1)) } as Partial<SlideElement>)}>
                            − Column
                          </button>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground flex items-center gap-2">
                            <input type="checkbox" checked={!!t.headerRow}
                              onChange={(e) => handleElementChange(el.id, { headerRow: e.target.checked } as Partial<SlideElement>)}
                            />
                            Header row
                          </label>
                        </div>
                      </>
                    );
                  })()}

                  {/* Layer + Actions — all types */}
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Layer</label>
                    <div className="flex gap-1">
                      <button className="flex-1 h-7 text-xs border rounded hover:bg-muted transition-colors"
                        onClick={() => handleElementChange(el.id, { zIndex: (el.zIndex || 1) + 1 })}>
                        Forward
                      </button>
                      <button className="flex-1 h-7 text-xs border rounded hover:bg-muted transition-colors"
                        onClick={() => handleElementChange(el.id, { zIndex: Math.max(0, (el.zIndex || 1) - 1) })}>
                        Backward
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="flex-1 h-7 text-xs border rounded hover:bg-muted transition-colors"
                      onClick={() => handleDuplicateElement(el.id)}
                      title="Duplicate (Ctrl+D)"
                    >
                      Duplicate
                    </button>
                    <button
                      className="flex-1 h-7 text-xs border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center gap-1"
                      onClick={() => handleDeleteElement(el.id)}
                      title="Delete (Del)"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Tip: Del to delete · Ctrl+D to duplicate · Arrow keys to nudge · Shift+Arrow for 5%
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Layouts */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Layouts</h3>
            <LayoutPresetPicker
              onApply={(presetId) => {
                updateDeck((prev) => {
                  const newSlides = [...prev.slides];
                  const current = newSlides[activeSlideIndex];
                  const slideV2 = isSlideV2(current) ? current : migrateSlide(current);
                  newSlides[activeSlideIndex] = applyLayoutPreset(slideV2, presetId, true);
                  return { ...prev, slides: newSlides };
                });
                setSelectedElementId(null);
              }}
            />
          </div>

          {/* Template */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Template</h3>
            <div className="space-y-2">
              {templateList.map((t) => (
                <div
                  key={t.metadata.id}
                  className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    deck.templateId === t.metadata.id
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted border border-transparent"
                  }`}
                  onClick={() => changeTemplate(t.metadata.id)}
                >
                  <div
                    className="w-6 h-6 rounded-md border"
                    style={{ background: `linear-gradient(135deg, ${t.metadata.colors.primary}, ${t.metadata.colors.secondary || t.metadata.colors.accent})` }}
                  />
                  <span className="text-xs font-medium">{t.metadata.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assist */}
          {(() => {
            const selectedEl = selectedElementId
              ? activeSlide?.elements?.find((e) => e.id === selectedElementId)
              : null;
            const isText = selectedEl?.type === "text";
            return (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Assist</h3>
                <AIAssistPanel
                  selectedContent={isText ? (selectedEl as TextElement).content : ""}
                  scope="element"
                  onAccept={(newContent) => {
                    if (selectedElementId) {
                      handleElementChange(selectedElementId, { content: newContent } as Partial<SlideElement>);
                    }
                  }}
                />
              </div>
            );
          })()}

          {/* AI Actions */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Regenerate</h3>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"
                disabled={regenerating}
                onClick={() => { setRegenPrompt("Regenerate this slide with more compelling, data-driven content"); setShowRegenDialog(true); }}>
                <Wand2 className="h-3 w-3 mr-2" />
                Regenerate Slide
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"
                disabled={regenerating}
                onClick={() => regenerateSlide("Rewrite this slide to be more professional, confident, and persuasive. Use stronger language and specific numbers.")}>
                <Zap className="h-3 w-3 mr-2" />
                {regenerating ? "Improving..." : "Improve Tone"}
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"
                disabled={regenerating}
                onClick={() => regenerateSlide("Condense this slide to its most essential points. Remove filler, keep only the most impactful statements. Reduce bullet points to 3 items max.")}>
                <Minimize2 className="h-3 w-3 mr-2" />
                Shorten
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"
                disabled={regenerating}
                onClick={() => regenerateSlide("Add more detail, supporting data, and context to this slide. Include specific metrics, evidence, and examples. Expand bullet points to 5-6 items.")}>
                <Maximize2 className="h-3 w-3 mr-2" />
                Expand
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs"
                disabled={regenerating}
                onClick={() => regenerateSlide("Optimize this slide for investor audiences. Emphasize ROI, market size, growth trajectory, defensibility, and unit economics. Add specific financial metrics.")}>
                <Target className="h-3 w-3 mr-2" />
                Investor Focus
              </Button>
            </div>
          </div>

          {/* Regen Dialog */}
          {showRegenDialog && (
            <div className="border rounded-lg p-3 bg-background space-y-3">
              <p className="text-xs font-medium">Custom instruction:</p>
              <Textarea
                className="text-xs resize-none"
                rows={3}
                value={regenPrompt}
                onChange={(e) => setRegenPrompt(e.target.value)}
                placeholder="Describe how you'd like this slide to change..."
              />
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 text-xs" disabled={regenerating}
                  onClick={() => regenerateSlide(regenPrompt)}>
                  {regenerating ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Generating...</> : "Regenerate"}
                </Button>
                <Button size="sm" variant="outline" className="text-xs"
                  onClick={() => setShowRegenDialog(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Images */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Images</h3>
            <ImageSearchPanel
              onSelect={(url) => {
                // Insert selected image as a new image element
                const newImageEl: SlideElement = {
                  id: uuid(),
                  type: "image",
                  imageUrl: url,
                  x: 30,
                  y: 10,
                  width: 40,
                  height: 60,
                  zIndex: 10,
                  objectFit: "cover",
                };
                updateDeck((prev) => {
                  const newSlides = [...prev.slides];
                  const slide = newSlides[activeSlideIndex];
                  const elements = slide.elements || [];
                  const placeholderIdx = elements.findIndex(
                    (e) => e.type === "image" && !(e as ImageElement).imageUrl
                  );
                  if (placeholderIdx >= 0) {
                    const updated = [...elements];
                    updated[placeholderIdx] = {
                      ...updated[placeholderIdx],
                      imageUrl: url,
                      objectFit: "cover",
                    } as SlideElement;
                    newSlides[activeSlideIndex] = { ...slide, elements: updated };
                  } else {
                    newSlides[activeSlideIndex] = { ...slide, elements: [...elements, newImageEl] };
                  }
                  return { ...prev, slides: newSlides };
                });
                toast.success("Image added to slide!");
              }}
            />
            <p className="text-xs text-muted-foreground mt-2">Or drag & drop an image onto the slide canvas</p>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Keyboard Shortcuts</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Ctrl+Z</kbd> Undo</p>
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Ctrl+Shift+Z</kbd> Redo</p>
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Ctrl+C</kbd> Copy element</p>
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Ctrl+V</kbd> Paste element</p>
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Ctrl+D</kbd> Duplicate element</p>
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Del</kbd> Delete element</p>
              <p><kbd className="px-1 bg-muted rounded text-[10px]">Arrow</kbd> Nudge 1% · Shift+Arrow 5%</p>
              <p>Drag corners to resize</p>
              <p>Drag slide thumbnails to reorder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* Shortcuts modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowShortcuts(false)}>
          <div className="bg-background rounded-lg p-6 w-[480px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ["Ctrl+Z", "Undo"],
                ["Ctrl+Shift+Z", "Redo"],
                ["Ctrl+C / Ctrl+V", "Copy / Paste"],
                ["Ctrl+D", "Duplicate"],
                ["Ctrl+G", "Group"],
                ["Ctrl+Shift+G", "Ungroup"],
                ["Ctrl+A", "Select all"],
                ["Del", "Delete"],
                ["Arrows", "Nudge 1%"],
                ["Shift+Arrows", "Nudge 5%"],
                ["Shift+Click", "Multi-select"],
                ["?", "Show shortcuts"],
              ].map(([k, v]) => (
                <React.Fragment key={k}>
                  <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">{k}</kbd>
                  <span className="text-muted-foreground">{v}</span>
                </React.Fragment>
              ))}
            </div>
            <Button className="mt-4 w-full" variant="outline" onClick={() => setShowShortcuts(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Share modal */}
      {showShare && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowShare(false)}>
          <div className="bg-background rounded-lg p-6 w-[480px]" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Share Deck</h2>
            <label className="flex items-center gap-2 mb-4 text-sm">
              <input type="checkbox" checked={shareInfo.enabled} onChange={(e) => toggleShare(e.target.checked)} />
              Enable public view-only link
            </label>
            {shareInfo.enabled && shareInfo.token && (
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Public link</label>
                <div className="flex gap-2">
                  <Input readOnly value={`${typeof window !== "undefined" ? window.location.origin : ""}/deck/${shareInfo.token}`} className="text-xs" />
                  <Button size="sm" variant="outline" onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/deck/${shareInfo.token}`);
                    toast.success("Copied");
                  }}>Copy</Button>
                </div>
              </div>
            )}
            <Button className="mt-4 w-full" variant="outline" onClick={() => setShowShare(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Versions modal */}
      {showVersions && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={() => setShowVersions(false)}>
          <div className="bg-background rounded-lg p-6 w-[520px] max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Version History</h2>
              <Button size="sm" onClick={() => {
                const label = prompt("Label this version (optional)");
                saveVersion(label || undefined);
              }}>
                Save current
              </Button>
            </div>
            {versions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No saved versions yet.</p>
            ) : (
              <ul className="space-y-2">
                {versions.map((v) => (
                  <li key={v._id} className="flex items-center justify-between border rounded p-2">
                    <div>
                      <p className="text-sm font-medium">{v.label || "Untitled snapshot"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => restoreVersion(v._id)}>Restore</Button>
                  </li>
                ))}
              </ul>
            )}
            <Button className="mt-4 w-full" variant="outline" onClick={() => setShowVersions(false)}>Close</Button>
          </div>
        </div>
      )}

      {/* Hidden slides for PDF export */}
      <div className="fixed -left-[9999px] top-0">
        {deck.slides.map((slide, i) => (
          <div
            key={`export-${i}`}
            ref={(el) => { slideRefs.current[i] = el; }}
            style={{ width: 1280, height: 720 }}
          >
            <SlideRenderer
              slide={slide}
              templateId={deck.templateId}
              isEditing={false}
              exportMode={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
