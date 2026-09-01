"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Archive, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PitchRoomSummary } from "./types";

interface PitchRoomCardProps {
  room: PitchRoomSummary;
  onArchive: (roomId: string) => void;
}

export function PitchRoomCard({ room, onArchive }: PitchRoomCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-primary shrink-0" />
          <span className="truncate">{room.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {room.practiceFocus || "No practice focus set yet."}
        </p>
        <p className="text-xs text-muted-foreground mt-3">
          Updated {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="default" className="flex-1">
          <Link href={`/pitch-rooms/${room._id}`}>Open room</Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          title="Archive room"
          onClick={() => onArchive(room._id)}
        >
          <Archive className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
