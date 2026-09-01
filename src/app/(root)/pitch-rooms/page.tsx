"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import VCSummaryCard from "@/components/VCSummaryCard";
import { vcs } from "../../../../data/vc";
import { CreatePitchRoomDialog } from "@/components/pitch-rooms/CreatePitchRoomDialog";
import { PitchRoomCard } from "@/components/pitch-rooms/PitchRoomCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { PitchRoomSummary } from "@/components/pitch-rooms/types";

export default function PitchRoomsPage() {
  const [rooms, setRooms] = useState<PitchRoomSummary[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get("/api/pitch-rooms")
      .then((res) => {
        if (!cancelled) setRooms(res.data.data.rooms);
      })
      .catch(() => {
        if (!cancelled) setRooms([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleArchive = async (roomId: string) => {
    const previous = rooms;
    setRooms((current) => current?.filter((room) => room._id !== roomId) ?? current);
    try {
      await axios.delete(`/api/pitch-rooms/${roomId}`);
      toast.success("Room archived");
    } catch {
      setRooms(previous ?? null);
      toast.error("Failed to archive room");
    }
  };

  return (
    <main className="bg-background py-6 px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Pitch rooms */}
      <section className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Pitch Rooms
            </h1>
            <p className="text-muted-foreground mt-1">
              A room remembers your startup across sessions — pitch to it again and
              again as your business evolves.
            </p>
          </div>
          <CreatePitchRoomDialog
            onCreated={(room) => setRooms((current) => [room, ...(current ?? [])])}
          />
        </div>

        {rooms === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-10 text-center text-muted-foreground">
            You don&apos;t have any pitch rooms yet. Create one to start building a
            recurring practice relationship with an AI VC.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <PitchRoomCard key={room._id} room={room} onArchive={handleArchive} />
            ))}
          </div>
        )}
      </section>

      {/* Generic AI VCs — unchanged from /start-a-pitch */}
      <section className="max-w-6xl mx-auto mt-14">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center mb-2">
          Or pitch to an AI VC directly
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          One-off practice sessions with no memory between pitches.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {vcs.map((vc) => (
            <VCSummaryCard key={vc.id} {...vc} />
          ))}
        </div>
      </section>
    </main>
  );
}
