"use client";
import {
  Suspense /*, useEffect*/,
  useEffect,
  useState,
  useCallback,
} from "react";
import { App } from "../../components/App";
import Intelligence from "../../components/Intelligence";
import { stsConfig } from "../../lib/constants";
import Conversation from "../../components/Conversation";
import { isMobile } from "react-device-detect";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowBigUp,
  Handshake,
  Link,
  Loader2,
  LogOut,
  MoveUpRight,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeepgram } from "@/context/DeepgramContextProvider";
import { useMicrophone } from "@/context/MicrophoneContextProvider";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAgentConfig } from "@/lib/constants";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
function HomeContent() {
  const {
    socket,
    socketState,
    duration,
    setUserId,
    durationRef,
    sessionIdRef,
    transcriptRef,
    closeSocket,
    setCompetitionId,
  } = useDeepgram();
  const { startMicrophone, stopMicrophone, microphoneState, setupMicrophone } =
    useMicrophone();

  const [config, setConfig] = useState<object | null>(null);
  const [exit, setExit] = useState(false);
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const isPractice = searchParams.get("practice");
  const competitionId = searchParams.get("competitionId");
  if (competitionId) {
    setCompetitionId(competitionId);
  }
  const [agent, setAgent] = useState<object | null>(null);
  const [pitchId, setPitchId] = useState<string | null>(null);
  useEffect(() => {
    if (agentId) {
      getAgentConfig(agentId as string).then((agent) => {
        setAgent(agent);
      });
    }
  }, [agentId]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleStart = async () => {
    try {
      setLoading(true);
      setUserId(session?.user?._id);
      if (session?.user?._id) {
        const res = await axios.post("/api/start-pitch", {
          userId: session?.user?._id,
          sessionId: "Pitchdesk" + Math.ceil(Math.random() * 1000000),
          competitionId,
        });
        const data = res.data.data;
        setRemainingTime((data?.remainingTime ?? 0) * 60);
        setPitchId(data?.pitch?._id);
        if (data?.remainingTime <= 0) {
          console.log("Expired");
          setStarted(false);
          toast.error(
            isPractice
              ? "You have no practice pitch time remaining. Please Upgrade your plan! "
              : "You have no remaining time. "
          );
          return;
        } else {
          if (socketState === -1) {
            socket?.open();
          }
          await fetchConfig();

          if (microphoneState === null) {
            const result = await setupMicrophone();
            if (result) {
              startMicrophone();
            }
          } else {
            startMicrophone();
          }
        }
      } else {
        toast.error("Internal Server Error");
      }
    } catch (error) {
      console.error("Error starting pitch", error);
      toast.error(error.response.data.message || "Failed to start pitch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const updatePitch = async () => {
      await axios.post("/api/update-pitch", {
        pitchId: pitchId,
        sessionId: sessionIdRef.current,
        competitionId: competitionId ?? null,
        userId: session?.user?._id,
        transcript: transcriptRef.current,
        duration: durationRef.current,
      });
    } ;
    if (started) {
      setInterval(() => {
        console.log("Updating pitch");
        updatePitch();
      }, 10000);
    }
  }, [started]);

  const handleStop = useCallback(async () => {
    console.log("🔒🔒🔒Ending pitch");
    await axios.post("/api/update-pitch", {
      pitchId: pitchId,
      sessionId: sessionIdRef.current,
      competitionId: competitionId ?? null,
      userId: session?.user?._id,
      transcript: transcriptRef.current,
      duration: durationRef.current,
    });
    setStarted(false);
    setExit(true);
    await closeSocket();
    await stopMicrophone();
    toast.success("Session ended successfully!");
    setTimeout(() => {
      window.close();
    }, 3000);
  }, [closeSocket, stopMicrophone]);

  // Automatically end session when duration exceeds remaining time
  useEffect(() => {
    if (
      started &&
      remainingTime !== null &&
      duration > 0 &&
      duration >= remainingTime
    ) {
      toast.warning("Time limit reached! Ending your pitch session.");
      handleStop();
    }
  }, [duration, remainingTime, started, handleStop]);

  // Warn user when time is running low
  useEffect(() => {
    if (started && remainingTime !== null && duration > 0) {
      const timeLeft = remainingTime - duration;

      // Warning at 60 seconds
      if (timeLeft === 60) {
        toast.warning("⏰ 1 minute remaining in your pitch session!");
      }
      // Warning at 30 seconds
      else if (timeLeft === 30) {
        toast.warning("⏰ 30 seconds remaining!");
      }
      // Warning at 10 seconds
      else if (timeLeft === 10) {
        toast.error("⏰ 10 seconds remaining!");
      }
    }
  }, [duration, remainingTime, started]);

  const fetchConfig = async () => {
    try {
      const agentConfig = await stsConfig(agentId as string);
      console.log("Fetched Agent Config:", agentConfig);
      setConfig(agentConfig);
      setStarted(true);
    } catch (error) {
      console.error("Error fetching agent config:", error);
      setConfig(null);
    }
  };
  if (exit) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg font-bold flex items-center">
          <Loader2 className="animate-spin mr-2 inline-block" size={24} />
          Ending session...
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      {/* Main Content */}
      <div className="w-full flex flex-col sm:flex-row justify-center items-center h-full">
        {/* Left Panel - Voice Interface */}
        <div className="relative w-full rounded-xl flex flex-col justify-center items-center shadow-lg h-screen">
          <nav>
            {started && remainingTime !== null && remainingTime > 0 && (
              <div className="absolute top-2 left-2 flex gap-2">
                {/* Elapsed Time */}
                <div className="border-2 border-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
                  <div className="text-xs font-semibold">Elapsed</div>
                  <div className="text-lg font-bold">
                    {Math.floor(duration / 60)}:
                    {String(duration % 60).padStart(2, "0")}
                  </div>
                </div>
                {/* Remaining Time */}
                <div
                  className={`text-white px-4 py-2 rounded-lg shadow-lg transition-colors ${
                    remainingTime - duration <= 10
                      ? "border-2 border-red-600 animate-pulse"
                      : remainingTime - duration <= 30
                        ? "border-2 border-red-500"
                        : remainingTime - duration <= 60
                          ? "border-2 border-orange-500"
                          : "border-2 border-green-500"
                  }`}
                >
                  <div className="text-xs font-semibold">Remaining</div>
                  <div className="text-lg font-bold">
                    {Math.floor(Math.max(0, remainingTime - duration) / 60)}:
                    {String(
                      Math.max(0, remainingTime - duration) % 60
                    ).padStart(2, "0")}
                  </div>
                </div>
              </div>
            )}
          </nav>

          <div>
            <div className="text-center mb-4 flex flex-col items-center">
              <div className="rounded-full overflow-hidden mb-4">
                <Image
                  className="size-20 object-fit "
                  src="/logo.png"
                  alt="PitchDesk"
                  width={100}
                  height={100}
                />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                PitchDesk
              </h1>
              <p className="text-gray-600">Interact with your AI Shark</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-full max-w-md">
                <Suspense
                  fallback={<div className="text-white">Loading...</div>}
                >
                  <Intelligence />
                </Suspense>
              </div>

              <div className="w-full  max-w-md flex flex-col items-center">
                <Suspense>
                  {loading ? (
                    <Loader2 className="animate-spin " size={24} />
                  ) : agentId ? (
                    <>
                      {started &&
                        remainingTime !== null &&
                        remainingTime > 0 && (
                          <App
                            defaultStsConfig={config}
                            requiresUserActionToInitialize={isMobile}
                          />
                        )}
                      <div className="flex justify-center mt-2">
                        {!started && (
                          <Button
                            variant="outline"
                            type="button"
                            size="lg"
                            className="border-primary border-2"
                            onClick={async () => {
                              await handleStart();
                            }}
                          >
                            Start your Pitch!
                          </Button>
                        )}
                        {started &&
                          remainingTime !== null &&
                          remainingTime > 0 && (
                            <div className="flex-col justify-center gap-4 w-full mt-4 ">
                              <div className="flex justify-center gap-4 w-full mb-4">
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="border-2 flex items-center border-amber-300 text-accent-foreground hover:bg-amber-800"
                                  onClick={() =>
                                    socket.send(
                                      JSON.stringify({
                                        type: "InjectUserMessage",
                                        content: "Negotiate",
                                      })
                                    )
                                  }
                                >
                                  <Handshake />
                                  <span>Negotiate</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="lg"
                                  className="border-2 flex items-center border-green-300 text-accent-foreground hover:bg-green-800"
                                  onClick={() =>
                                    socket.send(
                                      JSON.stringify({
                                        type: "InjectUserMessage",
                                        content: "Get Verdict",
                                      })
                                    )
                                  }
                                >
                                  <Target />
                                  <span>Get Verdict</span>
                                </Button>
                              </div>

                              <Button
                                variant="outline"
                                size="lg"
                                className="border-2 w-full flex items-center border-red-600 text-accent-foreground hover:bg-red-800"
                                type="button"
                                onClick={async () => {
                                  await handleStop();
                                }}
                                disabled={!started}
                              >
                                <LogOut /> <span>End Session!</span>
                              </Button>
                            </div>
                          )}
                        {started &&
                          (!competitionId || isPractice) &&
                          (remainingTime == null || remainingTime <= 0) && (
                            <div className="flex flex-col items-center gap-4 text-center text-2xl font-bold text-red-500">
                              <p>Please Upgrade your plan!</p>
                              <Button
                                variant="outline"
                                className="text-accent-foreground"
                                onClick={() => {
                                  router.push("/payment");
                                }}
                              >
                                <p>Upgrade now!</p>
                                <MoveUpRight />
                              </Button>
                            </div>
                          )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-3xl font-bold text-red-600">
                      This link is not valid
                    </div>
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
        {session?.user && (
          <Avatar className="absolute top-2 right-2">
            <AvatarImage src={session?.user?.image} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {session?.user?.fullName?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        {/* Right Panel - Conversation */}
        <div className="h-full w-full">
          <Suspense
            fallback={<div className="text-white">Loading conversation...</div>}
          >
            <Conversation agent={agent as Agent} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="text-white min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
