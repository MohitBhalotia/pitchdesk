"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Loader2,
  Presentation,
  Trash2,
  MoreVertical,
  Clock,
  Eye,
  Sparkles,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import SlideRenderer from "@/components/pitch-deck/SlideRenderer";
import { deckTemplates, DeckTemplate } from "@/data/deck-templates";

interface DeckSummary {
  _id: string;
  title: string;
  templateId: string;
  status: string;
  slides: Array<{ slideType: string; heading?: string; subheading?: string; bodyText?: string }>;
  createdAt: string;
  updatedAt: string;
}

function TemplatePreviewModal({
  template,
  onClose,
  onUseTemplate,
  loading,
}: {
  template: DeckTemplate;
  onClose: () => void;
  onUseTemplate: () => void;
  loading: boolean;
}) {
  const [previewSlide, setPreviewSlide] = useState(0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="bg-background rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-bold">{template.name}</h2>
            <p className="text-sm text-muted-foreground">{template.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={onUseTemplate} disabled={loading}>
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" />Use This Template</>
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Slide Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Preview */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20 relative">
            <div className="w-full max-w-3xl">
              <SlideRenderer
                slide={template.slides[previewSlide]}
                templateId={template.suggestedThemeId}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Button variant="outline" size="icon" disabled={previewSlide === 0}
                onClick={() => setPreviewSlide((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {previewSlide + 1} / {template.slides.length}
              </span>
              <Button variant="outline" size="icon" disabled={previewSlide === template.slides.length - 1}
                onClick={() => setPreviewSlide((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="w-48 border-l overflow-y-auto p-3 space-y-2">
            {template.slides.map((slide, i) => (
              <div
                key={i}
                className={`rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  i === previewSlide
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setPreviewSlide(i)}
              >
                <div className="pointer-events-none">
                  <SlideRenderer
                    slide={slide}
                    templateId={template.suggestedThemeId}
                    className="w-full"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground px-2 py-1 truncate capitalize">
                  {slide.slideType.replace("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PitchDeckListPage() {
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<DeckTemplate | null>(null);
  const [creatingFromTemplate, setCreatingFromTemplate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchDecks() {
      try {
        const res = await fetch("/api/pitch-deck");
        if (!res.ok) throw new Error("Failed to fetch decks");
        const data = await res.json();
        setDecks(data.decks);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load decks");
      } finally {
        setLoading(false);
      }
    }
    fetchDecks();
  }, []);

  const deleteDeck = async (id: string) => {
    try {
      const res = await fetch(`/api/pitch-deck/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDecks((prev) => prev.filter((d) => d._id !== id));
      toast.success("Deck deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete deck");
    }
  };

  const useTemplate = async (template: DeckTemplate) => {
    setCreatingFromTemplate(true);
    try {
      const res = await fetch("/api/pitch-deck/from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id }),
      });
      if (!res.ok) throw new Error("Failed to create deck");
      const data = await res.json();
      toast.success("Deck created from template!");
      router.push(`/pitch-deck/${data.deck._id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create deck from template");
    } finally {
      setCreatingFromTemplate(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Presentation className="h-8 w-8" />
              Pitch Decks
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage your investor pitch decks
            </p>
          </div>
          <Button onClick={() => router.push("/pitch-deck/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Deck
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty State */}
        {!loading && decks.length === 0 && (
          <Card className="border-dashed mb-12">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Presentation className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No pitch decks yet</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Create your first professional pitch deck by entering your company details,
                or start from one of our industry templates below.
              </p>
              <Button onClick={() => router.push("/pitch-deck/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Deck
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Deck Grid */}
        {!loading && decks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {decks.map((deck) => (
              <Card
                key={deck._id}
                className="group overflow-hidden cursor-pointer hover:shadow-lg transition-all border hover:border-primary/30"
                onClick={() => router.push(`/pitch-deck/${deck._id}`)}
              >
                {/* Slide Preview */}
                <div className="pointer-events-none border-b">
                  {deck.slides[0] ? (
                    <SlideRenderer
                      slide={deck.slides[0]}
                      templateId={deck.templateId}
                      className="w-full"
                    />
                  ) : (
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <Presentation className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{deck.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(deck.updatedAt)}</span>
                        <span>&middot;</span>
                        <span>{deck.slides.length} slides</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDeck(deck._id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Template Gallery */}
        {!loading && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Start from a Template</h2>
              <p className="text-muted-foreground mt-1">
                Choose an industry-specific template with pre-built content. Preview, customize, and make it yours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {deckTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="group overflow-hidden hover:shadow-lg transition-all border hover:border-primary/30"
                >
                  {/* Template Preview */}
                  <div className="pointer-events-none border-b relative">
                    <SlideRenderer
                      slide={template.slides[0]}
                      templateId={template.suggestedThemeId}
                      className="w-full"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="shadow-lg"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{template.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap ml-2">
                        {template.industry}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => setPreviewTemplate(template)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => useTemplate(template)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Use Template
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUseTemplate={() => useTemplate(previewTemplate)}
          loading={creatingFromTemplate}
        />
      )}
    </div>
  );
}
