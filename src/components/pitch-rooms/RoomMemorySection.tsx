"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RoomMemorySummary } from "./types";

/**
 * Phase 4 Memory view: lets a founder inspect what a room's coach will
 * recall from past sessions and "Forget this session" -- deletes just the
 * derived memory (never the pitch/transcript itself, still visible in My
 * Pitches) and triggers a digest rebuild so future sessions stop recalling it.
 */
export function RoomMemorySection({ roomId }: { roomId: string }) {
  const [memories, setMemories] = useState<RoomMemorySummary[] | null>(null);
  const [forgettingId, setForgettingId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`/api/pitch-rooms/${roomId}/memories`)
      .then((res) => setMemories(res.data.data.memories))
      .catch(() => setMemories([]));
  }, [roomId]);

  const handleForget = async (memoryId: string) => {
    setForgettingId(memoryId);
    try {
      await axios.delete(`/api/pitch-rooms/${roomId}/memories/${memoryId}`);
      setMemories((prev) => prev?.filter((m) => m._id !== memoryId) ?? prev);
      toast.success("Forgotten -- future sessions won't recall this one");
    } catch {
      toast.error("Failed to forget this session");
    } finally {
      setForgettingId(null);
    }
  };

  if (memories === null) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (memories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No memory yet. Once you complete a session in this room, what your coach should
        remember for next time will show up here.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {memories.map((memory) => (
        <li key={memory._id} className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {new Date(memory.createdAt).toLocaleDateString()}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive shrink-0"
              disabled={forgettingId === memory._id}
              onClick={() => handleForget(memory._id)}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Forget this session
            </Button>
          </div>
          <p className="text-sm text-foreground mt-2">{memory.summaryText}</p>
        </li>
      ))}
    </ul>
  );
}
