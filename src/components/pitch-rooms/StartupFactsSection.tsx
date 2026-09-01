"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Check, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StartupFactSummary } from "./types";

interface StartupFactsSectionProps {
  roomId: string;
  /** Bumped by the parent whenever ingestion completes, to trigger a refetch. */
  refreshKey?: number;
}

export function StartupFactsSection({ roomId, refreshKey }: StartupFactsSectionProps) {
  const [facts, setFacts] = useState<StartupFactSummary[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    axios
      .get(`/api/pitch-rooms/${roomId}/facts`)
      .then((res) => setFacts(res.data.data.facts))
      .catch(() => setFacts([]));
  }, [roomId, refreshKey]);

  const patchFact = async (factId: string, body: Record<string, unknown>) => {
    try {
      const res = await axios.patch(`/api/pitch-rooms/${roomId}/facts/${factId}`, body);
      const updated = res.data.data.fact;
      setFacts((prev) => {
        if (!prev) return prev;
        if (body.action === "disable") {
          return prev.filter((f) => f._id !== factId);
        }
        if (body.action === "correct") {
          return prev.map((f) => (f._id === factId ? updated : f));
        }
        return prev.map((f) => (f._id === factId ? updated : f));
      });
    } catch {
      toast.error("Failed to update fact");
    }
  };

  const startEditing = (fact: StartupFactSummary) => {
    setEditingId(fact._id);
    setEditValue(fact.rawValue);
  };

  const submitCorrection = async (factId: string) => {
    if (!editValue.trim()) return;
    await patchFact(factId, { action: "correct", rawValue: editValue.trim() });
    setEditingId(null);
  };

  if (facts === null) {
    return <p className="text-sm text-muted-foreground">Loading metrics...</p>;
  }

  if (facts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No metrics yet — these are extracted automatically once you add a
        knowledge base.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {facts.map((fact) => (
        <li
          key={fact._id}
          className="flex items-center justify-between gap-3 border border-border rounded-lg px-4 py-2"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">
              {fact.metric}
              {fact.period ? ` (${fact.period})` : ""}
            </p>
            {editingId === fact._id ? (
              <Input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitCorrection(fact._id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="h-7 mt-1"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{fact.rawValue}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {editingId === fact._id ? (
              <>
                <Button size="icon" variant="ghost" onClick={() => submitCorrection(fact._id)}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Correct this value"
                  onClick={() => startEditing(fact)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  title="Not relevant -- remove"
                  onClick={() => patchFact(fact._id, { action: "disable" })}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
