"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { FileText, Sparkles, History as HistoryIcon, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { PitchRoomSummary, RoomAgentSummary } from "@/components/pitch-rooms/types";
import { KnowledgeBaseSection } from "@/components/pitch-rooms/KnowledgeBaseSection";
import { StartupFactsSection } from "@/components/pitch-rooms/StartupFactsSection";
import { RoomPitchHistorySection } from "@/components/pitch-rooms/RoomPitchHistorySection";
import { RoomMemorySection } from "@/components/pitch-rooms/RoomMemorySection";

export default function PitchRoomDetailPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const router = useRouter();

  const [room, setRoom] = useState<PitchRoomSummary | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [name, setName] = useState("");
  const [practiceFocus, setPracticeFocus] = useState("");
  const [saving, setSaving] = useState(false);
  const [hasReadyKnowledgeBase, setHasReadyKnowledgeBase] = useState(false);

  const [agents, setAgents] = useState<RoomAgentSummary[] | null>(null);

  useEffect(() => {
    axios
      .get(`/api/pitch-rooms/${roomId}`)
      .then((res) => {
        const fetchedRoom: PitchRoomSummary = res.data.data.room;
        setRoom(fetchedRoom);
        setName(fetchedRoom.name);
        setPracticeFocus(fetchedRoom.practiceFocus ?? "");
      })
      .catch(() => setNotFound(true));

    axios
      .get("/api/pitch-rooms/agents")
      .then((res) => setAgents(res.data.data.agents))
      .catch(() => setAgents([]));
  }, [roomId]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`/api/pitch-rooms/${roomId}`, {
        name,
        practiceFocus,
      });
      setRoom(res.data.data.room);
      toast.success("Room settings saved");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(message || "Failed to save room settings");
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <main className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Pitch room not found</h1>
        <p className="text-muted-foreground mb-6">
          This room doesn&apos;t exist, or it isn&apos;t yours.
        </p>
        <Button onClick={() => router.push("/pitch-rooms")}>Back to Pitch Rooms</Button>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">{room.name}</h1>
        <p className="text-muted-foreground mt-1">
          This room remembers your startup across every session you pitch here.
        </p>
      </div>

      {/* Room settings */}
      <Card>
        <CardHeader>
          <CardTitle>Room settings</CardTitle>
          <CardDescription>Rename the room or set what you want it to focus on.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="room-name">Room name</Label>
            <Input id="room-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room-focus">Practice focus (optional)</Label>
            <Textarea
              id="room-focus"
              placeholder="e.g. Focus hard on my unit economics and fundraising ask"
              value={practiceFocus}
              onChange={(e) => setPracticeFocus(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save settings"}
          </Button>
        </CardContent>
      </Card>

      {/* Knowledge base */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Knowledge base
          </CardTitle>
          <CardDescription>
            Upload your deck, financials, or notes so your room coach knows your
            startup before you start talking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <KnowledgeBaseSection roomId={roomId} onReadyChange={setHasReadyKnowledgeBase} />
        </CardContent>
      </Card>

      {/* Extracted metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Extracted metrics
          </CardTitle>
          <CardDescription>
            Startup metrics pulled from your knowledge base will show up here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StartupFactsSection roomId={roomId} refreshKey={hasReadyKnowledgeBase ? 1 : 0} />
        </CardContent>
      </Card>

      {/* Room pitch history */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5 text-primary" />
            Pitch history in this room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RoomPitchHistorySection roomId={roomId} />
        </CardContent>
      </Card>

      {/* Room memory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Room memory
          </CardTitle>
          <CardDescription>
            What your coach remembers about you across sessions in this room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomMemorySection roomId={roomId} />
        </CardContent>
      </Card>

      {/* Agent selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choose a room coach</CardTitle>
          <CardDescription>
            {hasReadyKnowledgeBase
              ? "Pick who you want to pitch to for your next session."
              : "Add a knowledge base to start a pitch session in this room."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent._id}
                  className="border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2"
                >
                  <Image
                    src={agent.image}
                    alt={agent.name}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                  <p className="font-semibold text-foreground">{agent.name}</p>
                  <p className="text-xs text-muted-foreground">{agent.description}</p>
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    disabled={!hasReadyKnowledgeBase}
                    title={hasReadyKnowledgeBase ? undefined : "Add a knowledge base first"}
                    onClick={() =>
                      router.push(`/pitch-rooms/${roomId}/pitch?agentId=${agent._id}`)
                    }
                  >
                    Start pitch
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
