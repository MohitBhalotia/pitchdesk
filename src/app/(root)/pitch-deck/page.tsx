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

interface DeckSummary {
  _id: string;
  title: string;
  templateId: string;
  status: string;
  slides: Array<{ slideType: string; heading?: string; subheading?: string; bodyText?: string }>;
  createdAt: string;
  updatedAt: string;
}

export default function PitchDeckListPage() {
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(true);
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
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Presentation className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No pitch decks yet</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                Create your first professional pitch deck by entering your company details.
                Our AI will generate a compelling deck ready for investors.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
}
