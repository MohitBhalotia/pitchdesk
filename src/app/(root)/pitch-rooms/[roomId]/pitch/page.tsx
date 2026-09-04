"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { isMobile } from "react-device-detect";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, LogOut } from "lucide-react";

import { App } from "@/components/App";
import Intelligence from "@/components/Intelligence";
import Conversation from "@/components/Conversation";
import { Button } from "@/components/ui/button";
import { useDeepgram } from "@/context/DeepgramContextProvider";
import { useMicrophone } from "@/context/MicrophoneContextProvider";

interface RoomAgent {
  _id: string;
  name: string;
  image: string;
  voice: string;
  firstMessage: string;
}

/**
 * The pitch-room counterpart to `src/app/start-pitch/page.tsx`. Every
 * low-level mechanic (raw Deepgram WebSocket, mic capture, transcript
 * buffering, `end-pitch`/`update-pitch`) is reused unchanged -- the only
 * difference is that the Settings payload sent to Deepgram (`config` below)
 * is composed entirely server-side by `POST /api/pitch-rooms/[roomId]/sessions`
 * (plans/RAG_feature.md Phase 3), including the three RAG tools and the
 * signed room-session token. This page never builds that payload itself.
 */
function PitchRoomSessionContent() {
  const { roomId } = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const router = useRouter();
  const { data: session } = useSession();

  const {
    duration,
    setUserId,
    durationRef,
    sessionIdRef,
    transcriptRef,
    closeSocket,
  } = useDeepgram();
  const { startMicrophone, stopMicrophone, microphoneState, setupMicrophone } = useMicrophone();

  const [config, setConfig] = useState<object | null>(null);
  const [agent, setAgent] = useState<RoomAgent | null>(null);
  const [pitchId, setPitchId] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [exit, setExit] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const handleStart = async () => {
    if (!agentId) {
      setInvalid(true);
      return;
    }
    try {
      setLoading(true);
      setUserId(session?.user?._id);
      const res = await axios.post(`/api/pitch-rooms/${roomId}/sessions`, {
        agentId,
        clientSessionId: `PitchRoom${Math.ceil(Math.random() * 1_000_000)}`,
      });
      const data = res.data.data;
      setConfig(data.voiceSettings);
      setAgent(data.agent);
      setPitchId(data.pitch?._id ?? null);
      setRemainingTime(data.remainingTimeSeconds ?? 0);

      if (!data.remainingTimeSeconds || data.remainingTimeSeconds <= 0) {
        toast.error("You have no remaining pitch time. Please upgrade your plan!");
        return;
      }

      setStarted(true);
      if (microphoneState === null) {
        const result = await setupMicrophone();
        if (result) startMicrophone();
      } else {
        startMicrophone();
      }
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : undefined;
      toast.error(message || "Failed to start this session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!started) return;
    const interval = setInterval(() => {
      axios.post("/api/update-pitch", {
        pitchId,
        sessionId: sessionIdRef.current,
        userId: session?.user?._id,
        transcript: transcriptRef.current,
        duration: durationRef.current,
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [started, pitchId, durationRef, sessionIdRef, session?.user?._id, transcriptRef]);

  const handleStop = useCallback(async () => {
    await axios.post("/api/end-pitch", {
      pitchId,
      sessionId: sessionIdRef.current,
      userId: session?.user?._id,
      transcript: transcriptRef.current,
      duration: durationRef.current,
    });
    setStarted(false);
    setExit(true);
    await closeSocket();
    await stopMicrophone();
    toast.success("Session ended successfully!");
    setTimeout(() => router.push(`/pitch-rooms/${roomId}`), 1500);
  }, [
    closeSocket,
    durationRef,
    pitchId,
    roomId,
    router,
    session?.user?._id,
    sessionIdRef,
    stopMicrophone,
    transcriptRef,
  ]);

  useEffect(() => {
    if (started && remainingTime !== null && duration > 0 && duration >= remainingTime) {
      toast.warning("Time limit reached! Ending your session.");
      handleStop();
    }
  }, [duration, remainingTime, started, handleStop]);

  if (invalid) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">No coach selected</h1>
        <p className="text-muted-foreground mb-6">
          Go back to the room and pick a coach to start a session.
        </p>
        <Button onClick={() => router.push(`/pitch-rooms/${roomId}`)}>Back to room</Button>
      </div>
    );
  }

  if (exit) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg font-bold flex items-center">
          <Loader2 className="animate-spin mr-2 inline-block" size={24} />
          Ending session...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col sm:flex-row justify-center items-start h-full gap-6 px-4 py-6">
      <div className="relative w-full sm:max-w-md flex flex-col items-center">
        {started && remainingTime !== null && remainingTime > 0 && (
          <div className="flex gap-2 mb-4">
            <div className="border-2 border-blue-500 px-4 py-2 rounded-lg shadow-lg">
              <div className="text-xs font-semibold">Elapsed</div>
              <div className="text-lg font-bold">
                {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
              </div>
            </div>
            <div
              className={`px-4 py-2 rounded-lg shadow-lg ${
                remainingTime - duration <= 30
                  ? "border-2 border-red-500"
                  : "border-2 border-green-500"
              }`}
            >
              <div className="text-xs font-semibold">Remaining</div>
              <div className="text-lg font-bold">
                {Math.floor(Math.max(0, remainingTime - duration) / 60)}:
                {String(Math.max(0, remainingTime - duration) % 60).padStart(2, "0")}
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-4 flex flex-col items-center">
          {agent?.image && (
            <div className="rounded-full overflow-hidden mb-4">
              <Image src={agent.image} alt={agent.name} width={80} height={80} />
            </div>
          )}
          <p className="text-muted-foreground text-sm">You are pitching to</p>
          <p className="text-foreground text-xl font-semibold mt-1">{agent?.name ?? "Your coach"}</p>
        </div>

        <div className="w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <Intelligence />
          </Suspense>
        </div>

        <div className="w-full flex flex-col items-center mt-2">
          {loading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              {started && remainingTime !== null && remainingTime > 0 && (
                <App defaultStsConfig={config} requiresUserActionToInitialize={isMobile} />
              )}
              {!started && (
                <Button variant="outline" size="lg" onClick={handleStart}>
                  Start your session!
                </Button>
              )}
              {started && remainingTime !== null && remainingTime > 0 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 w-full flex items-center border-red-600 mt-4"
                  onClick={handleStop}
                >
                  <LogOut /> <span>End Session!</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="w-full sm:max-w-lg">
        <Suspense fallback={<div>Loading conversation...</div>}>
          <Conversation agent={agent as unknown as Agent | null} />
        </Suspense>
      </div>
    </div>
  );
}

export default function PitchRoomSessionPage() {
  return (
    <Suspense>
      <PitchRoomSessionContent />
    </Suspense>
  );
}
