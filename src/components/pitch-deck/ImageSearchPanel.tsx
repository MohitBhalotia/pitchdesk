"use client";

import React, { useState, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";

interface ImageResult {
  id: string;
  url: string;
  thumb: string;
  author: string;
  authorUrl: string;
}

interface ImageSearchPanelProps {
  onSelect: (url: string) => void;
}

const SUGGESTED_SEARCHES = [
  "business meeting", "technology", "startup", "finance", "team",
  "city", "growth chart", "innovation", "office", "product",
];

export default function ImageSearchPanel({ onSelect }: ImageSearchPanelProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/pitch-deck/search-images?query=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="space-y-2">
      {/* Search input */}
      <form onSubmit={handleSubmit} className="flex gap-1">
        <input
          className="flex-1 h-7 px-2 text-xs border rounded bg-background"
          placeholder="Search photos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="h-7 px-2 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Search className="h-3 w-3" />}
        </button>
      </form>

      {/* Suggestions */}
      {!searched && (
        <div className="flex flex-wrap gap-1">
          {SUGGESTED_SEARCHES.map((s) => (
            <button
              key={s}
              className="text-[10px] px-1.5 py-0.5 bg-muted rounded hover:bg-muted/80 text-muted-foreground transition-colors"
              onClick={() => { setQuery(s); search(s); }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results grid */}
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-3 gap-1 max-h-52 overflow-y-auto">
          {results.map((img) => (
            <button
              key={img.id}
              className="relative aspect-video rounded overflow-hidden border border-border hover:border-primary transition-colors group"
              title={`Photo by ${img.author}`}
              onClick={() => onSelect(img.url)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumb}
                alt={`Photo by ${img.author}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[9px]">Add</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-4">No images found</p>
      )}

      <p className="text-[9px] text-muted-foreground">Photos from Unsplash</p>
    </div>
  );
}
