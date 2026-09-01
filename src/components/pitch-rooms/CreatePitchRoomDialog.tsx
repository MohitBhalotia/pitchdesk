"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PitchRoomSummary } from "./types";

interface CreatePitchRoomDialogProps {
  onCreated: (room: PitchRoomSummary) => void;
}

export function CreatePitchRoomDialog({ onCreated }: CreatePitchRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Room name is required");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post("/api/pitch-rooms", { name });
      onCreated(res.data.data.room);
      toast.success("Pitch room created");
      setName("");
      setOpen(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Failed to create pitch room");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg" className="gap-2">
          <Plus className="w-4 h-4" />
          New Pitch Room
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a pitch room</DialogTitle>
          <DialogDescription>
            A pitch room remembers your startup across sessions. Give it a name — you
            can add documents and details afterward.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-2">
          <Label htmlFor="room-name">Room name</Label>
          <Input
            id="room-name"
            placeholder="e.g. Series A practice"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            maxLength={80}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={submitting}>
            {submitting ? "Creating..." : "Create room"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
