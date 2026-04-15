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
import type { SlideElement, SlideV2, TextElement, ShapeElement, ImageElement } from "@/types/slide-elements";
import { isSlideV2 } from "@/types/slide-elements";
import LayoutPresetPicker from "@/components/pitch-deck/LayoutPresetPicker";
import { FONT_FAMILIES } from "@/components/pitch-deck/FormatToolbar";
import GradientPicker from "@/components/pitch-deck/GradientPicker";
import IconPicker from "@/components/pitch-deck/IconPicker";
import ImageSearchPanel from "@/components/pitch-deck/ImageSearchPanel";
import AIAssistPanel from "@/components/pitch-deck/AIAssistPanel";
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
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  templateId: string;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
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
  const [isExporting, setIsExporting] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
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
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo, handleCopyElement, handlePasteElement]);

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
                <DropdownMenuItem onClick={() => handleAddShapeElement("rect")}>Rectangle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddShapeElement("circle")}>Circle</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddShapeElement("line")}>Line</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddShapeElement("arrow")}>Arrow</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <SlideRenderer
                slide={activeSlide}
                templateId={deck.templateId}
                isEditing={true}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onElementChange={handleElementChange}
                onDeleteElement={handleDeleteElement}
                onDuplicateElement={handleDuplicateElement}
                exportMode={isExporting}
                className="w-full rounded-lg shadow-2xl"
              />
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
