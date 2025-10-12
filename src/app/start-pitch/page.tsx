"use client";
import { Suspense, useEffect, useState } from "react";
import { App } from "../../components/App";
import Intelligence from "../../components/Intelligence";
import { stsConfig } from "../../lib/constants";
import Conversation from "../../components/Conversation";
import { isMobile } from "react-device-detect";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeepgram } from "@/context/DeepgramContextProvider";
import { useMicrophone } from "@/context/MicrophoneContextProvider";
import axios from "axios";
function HomeContent() {
  const { socket, socketState, sessionIdRef } = useDeepgram();
  const { startMicrophone, stopMicrophone, microphoneState, setupMicrophone } =
    useMicrophone();
  const [config, setConfig] = useState<object | null>(null);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const [duration, setDuration] = useState(0);
  const handleStart = async () => {
    if (microphoneState === null) {
      const result = await setupMicrophone();
      if (result) {
        startMicrophone();
      }
    } else {
      startMicrophone();
    }
  };
  useEffect(() => {
    if (started) {
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [started]);
  
  useEffect(() => {
    if (started) {
      const interval = setInterval(async () => {
        console.log("Updating pitch", sessionIdRef.current);
        if (sessionIdRef.current) {
          await axios.patch("/api/pitch/update-pitch", {
            sessionId: sessionIdRef.current,
          });
        }
      }, 30000); // every 30 seconds
      return () => clearInterval(interval); // cleanup on unmount / state change
    }
  }, [socketState, sessionIdRef]);
  const handleStop = async () => {
    await stopMicrophone();
  };
  const fetchConfig = async () => {
    setLoading(true);
    try {
      const agentConfig = await stsConfig(agentId as string);
      console.log("Fetched Agent Config:", agentConfig);
      setConfig(agentConfig);
      setStarted(true);
    } catch (error) {
      console.error("Error fetching agent config:", error);
      setConfig(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}

      {/* Main Content */}
      <main className="w-full flex flex-col sm:flex-row justify-center items-center h-full">
        {/* Left Panel - Voice Interface */}
        <div className="w-1/2 rounded-xl flex items-center shadow-lg p-8 relative h-screen">
          {started && <div className="absolute top-2 right-2 bg-red-500 p-2 rounded-full">
            {duration}
          </div>}
          <div>
            <div className="text-center mb-8 flex flex-col items-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Pitch Desk
              </h1>
              <p className="text-gray-600">Interact with your AI Shark</p>
            </div>

            <div className="flex flex-col items-center space-y-8">
              <div className="w-full max-w-md">
                <Suspense
                  fallback={<div className="text-white">Loading...</div>}
                >
                  <Intelligence />
                </Suspense>
              </div>

              <div className="w-full max-w-md flex flex-col items-center">
                <Suspense>
                  {loading ? (
                    <Loader2 className="animate-spin " size={24} />
                  ) : agentId ? (
                    <>
                      {started && (
                        <App
                          defaultStsConfig={config}
                          requiresUserActionToInitialize={isMobile}
                        />
                      )}
                      <div className="flex justify-center mt-20">
                        {!started ? (
                          <Button
                            type="button"
                            onClick={() => {
                              handleStart();
                              if (socketState === -1) {
                                socket?.open();
                              }
                              fetchConfig();
                            }}
                          >
                            Start your Pitch!
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            onClick={async () => {
                              setStarted(false);
                              socket?.close();
                              await handleStop();
                            }}
                            disabled={!started}
                          >
                            End pitch!
                          </Button>
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

          {/* Right Panel - Conversation */}
        </div>
        <div className="overflow-hidden flex-1 relative h-full w-full">
          <Suspense
            fallback={<div className="text-white">Loading conversation...</div>}
          >
            <Conversation />
          </Suspense>
        </div>
      </main>
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
