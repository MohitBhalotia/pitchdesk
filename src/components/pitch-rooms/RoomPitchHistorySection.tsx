"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import type { RoomPitchSummary } from "./types";

function formatDuration(seconds?: number | null): string {
  if (!seconds) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

export function RoomPitchHistorySection({ roomId }: { roomId: string }) {
  const [pitches, setPitches] = useState<RoomPitchSummary[] | null>(null);

  useEffect(() => {
    axios
      .get(`/api/pitch-rooms/${roomId}/pitches`)
      .then((res) => setPitches(res.data.data.pitches))
      .catch(() => setPitches([]));
  }, [roomId]);

  if (pitches === null) {
    return <p className="text-sm text-muted-foreground">Loading...</p>;
  }

  if (pitches.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No pitches in this room yet. Once you start practicing here, sessions will show up
        in this list.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {pitches.map((pitch) => (
        <li key={pitch._id} className="py-3 flex items-center justify-between gap-4">
          <div>
            <p className="font-medium text-foreground">{pitch.title || "Untitled pitch"}</p>
            <p className="text-xs text-muted-foreground">
              {pitch.agentName || "Room coach"} ·{" "}
              {pitch.startTime ? new Date(pitch.startTime).toLocaleDateString() : "Unknown date"} ·{" "}
              {formatDuration(pitch.duration)}
            </p>
          </div>
          <Link
            href={`/evaluation/${pitch._id}`}
            className="text-sm text-primary hover:underline shrink-0"
          >
            View evaluation
          </Link>
        </li>
      ))}
    </ul>
  );
}
