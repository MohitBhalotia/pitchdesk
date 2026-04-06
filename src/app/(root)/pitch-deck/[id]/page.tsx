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
import { migrateDeck, migrateSlide, createDefaultElements } from "@/lib/slide-migration";
import type { SlideElement, TextElement, ShapeElement } from "@/types/slide-elements";
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
}: {
  slide: Slide;
  index: number;
  isActive: boolean;
  templateId: string;
  onClick: () => void;
  onDelete: () => void;
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
        <button
          className="absolute top-1 right-1 z-10 bg-red-500/80 hover:bg-red-500 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </button>
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
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const slideRefs = useRef<Record<number, HTMLDivElement | null>>({});

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
      saveTimeoutRef.current = setTimeout(async () => {
        setSaving(true);
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
        } catch (error) {
          console.error("Auto-save failed:", error);
        } finally {
          setSaving(false);
        }
      }, 1500);
    },
    [deckId]
  );

  const updateDeck = useCallback(
    (updater: (prev: Deck) => Deck) => {
      setDeck((prev) => {
        if (!prev) return prev;
        const updated = updater(prev);
        autoSave(updated);
        return updated;
      });
    },
    [autoSave]
  );

const handleElementChange = useCallback(
    (elementId: string, patch: Partial<SlideElement>) => {
      updateDeck((prev) => {
        const newSlides = [...prev.slides];
        const slide = newSlides[activeSlideIndex];
        if (!slide.elements) return prev;
        newSlides[activeSlideIndex] = {
          ...slide,
          elements: slide.elements.map((el) =>
            el.id === elementId ? { ...el, ...patch } : el
          ),
        };
        return { ...prev, slides: newSlides };
      });
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

  const handleAddShapeElement = useCallback(
    (shape: "rect" | "circle" | "line") => {
      const newEl: SlideElement = {
        id: uuid(),
        type: "shape",
        shape,
        x: 35,
        y: 35,
        width: 30,
        height: 30,
        fill: "#3b82f6",
        opacity: 0.7,
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
          newSlides[activeSlideIndex] = {
            ...slide,
            elements: [...(slide.elements || []), newImageEl],
          };
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

      const { v4: uuid } = await import("uuid");
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
        newSlides[activeSlideIndex] = {
          ...s,
          elements: [...(s.elements || []), newImageEl],
        };
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
          {saving && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          {!saving && <span className="text-xs text-muted-foreground">Auto-saved</span>}
        </div>

        <div className="flex items-center gap-2">
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

          <Button variant="outline" size="sm" onClick={exportPDF}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>

          <Button variant="outline" size="sm" onClick={async () => {
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
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            PPTX
          </Button>
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
          </div>

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
          </div>

          {/* Element Properties */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Element</h3>
            {(() => {
              const el = selectedElementId
                ? activeSlide?.elements?.find((e) => e.id === selectedElementId)
                : null;
              if (!el) {
                return <p className="text-xs text-muted-foreground">Click an element to edit its properties</p>;
              }
              return (
                <div className="space-y-3">
                  {el.type === "text" && (
                    <>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">Font Size</label>
                        <input
                          type="number"
                          min={8}
                          max={120}
                          className="w-full h-7 px-2 text-xs border rounded bg-background"
                          value={(el as TextElement).fontSize || 16}
                          onChange={(e) => handleElementChange(el.id, { fontSize: Number(e.target.value) } as Partial<TextElement>)}
                        />
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
                              Reset
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {el.type === "shape" && (
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Fill Color</label>
                      <input
                        type="color"
                        className="w-8 h-7 rounded border cursor-pointer"
                        value={(el as ShapeElement).fill || "#3b82f6"}
                        onChange={(e) => handleElementChange(el.id, { fill: e.target.value } as Partial<SlideElement>)}
                      />
                    </div>
                  )}
                  <button
                    className="w-full h-7 text-xs border border-destructive text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center gap-1"
                    onClick={() => handleDeleteElement(el.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete Element
                  </button>
                </div>
              );
            })()}
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

          {/* AI Actions */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Actions</h3>
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
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Use the toolbar above to add images. Images are draggable elements — select one and use the Element panel to delete.</p>
              <p className="text-xs text-muted-foreground">Or drag & drop an image onto the slide</p>
            </div>
          </div>

          {/* Tips */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tips</h3>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Click element to select + edit</p>
              <p>Drag elements to reposition</p>
              <p>Drag corners to resize</p>
              <p>Drag slide thumbnails to reorder</p>
              <p>Changes auto-save</p>
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
