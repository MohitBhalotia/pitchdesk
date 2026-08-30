"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import Transcript from "./Transcript";
import { useDeepgram } from "../context/DeepgramContextProvider";
import { useMicrophone } from "../context/MicrophoneContextProvider";
import {
  EventType,
  useVoiceBot,
  VoiceBotStatus,
} from "../context/VoiceBotContextProvider";
import { createAudioBuffer, playAudioBuffer } from "../utils/audioUtils";
import { sendSocketMessage, sendMicToSocket } from "../utils/deepgramUtils";
import { isMobile } from "react-device-detect";
import RateLimited from "./RateLimited";

const AnimationManager = dynamic(() => import("./AnimationManager"), {
  ssr: false,
});

const noop = () => {};

export const App = ({
  defaultStsConfig,
  onMessageEvent = noop,
  requiresUserActionToInitialize = false,
  className = "",
}) => {
  const {
    status,
    messages,
    addVoicebotMessage,
    addBehindTheScenesEvent,
    isWaitingForUserVoiceAfterSleep,
    toggleSleep,
    startListening,
    startSpeaking,
  } = useVoiceBot();
  const {
    setupMicrophone,
    microphone,
    microphoneState,
    processor,
    microphoneAudioContext,
    startMicrophone,
  } = useMicrophone();

  const {
    socket,
    connectToDeepgram,
    socketState,
    rateLimited,
    addTranscriptMessage,
  } = useDeepgram();
  const audioContext = useRef(null);
  const agentVoiceAnalyser = useRef(null);
  const userVoiceAnalyser = useRef(null);
  const startTimeRef = useRef(-1);
  const [isInitialized, setIsInitialized] = useState(
    requiresUserActionToInitialize ? false : null
  );
  const scheduledAudioSources = useRef([]);
  const pathname = usePathname();

  // AUDIO MANAGEMENT
  /**
   * Initialize the audio context for managing and playing audio. (just for TTS playback; user audio input logic found in Microphone Context Provider)
   */
  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext ||
        window.webkitAudioContext)({
        latencyHint: "interactive",
        sampleRate: 24000,
      });
      agentVoiceAnalyser.current = audioContext.current.createAnalyser();
      agentVoiceAnalyser.current.fftSize = 2048;
      agentVoiceAnalyser.current.smoothingTimeConstant = 0.96;
    }
  }, []);

  /**
   * Callback to handle audio data processing and playback.
   * Converts raw audio into an AudioBuffer and plays the processed audio through the web audio context
   */
  const bufferAudio = useCallback((data) => {
    const audioBuffer = createAudioBuffer(audioContext.current, data);
    if (!audioBuffer) return;
    scheduledAudioSources.current.push(
      playAudioBuffer(
        audioContext.current,
        audioBuffer,
        startTimeRef,
        agentVoiceAnalyser.current
      )
    );
  }, []);

  const clearAudioBuffer = useCallback(() => {
    scheduledAudioSources.current.forEach((source) => source.stop());
    scheduledAudioSources.current = [];
  }, []);

  // MICROPHONE AND SOCKET MANAGEMENT
  /**
   * Open the microphone at the very start when there isn't one.
   * Logic for microphone found in Microphone Context Provider
   */
  useEffect(() => {
    setupMicrophone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let wakeLock;
    const requestWakeLock = async () => {
      try {
        // Wake lock will only be successfully granted if this useEffect is triggered as a result of a user action (a click or tap)
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isInitialized) {
      requestWakeLock();
    }

    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [isInitialized]);

  /**
   * Open Deepgram once the microphone opens.
   * Runs whenever the `microphone` changes state, but exits if no microphone state.
   * `microphone` is only set once it is ready to open and record audio.
   */
  useEffect(() => {
    if (microphoneState === 1 && socket && defaultStsConfig) {
      /**
       * When the connection to Deepgram opens, the following will happen;
       *  1. Send the API configuration first.
       *  3. Start the microphone immediately.
       *  4. Update the app state to the INITIAL listening state.
       */

      const onOpen = async () => {
        sendSocketMessage(socket, defaultStsConfig);
        startMicrophone();
        startListening(true);
        if (pathname === "/") {
          // This is the "base" demo at /agent
          toggleSleep();
        }
      };

      socket.addEventListener("open", onOpen);

      /**
       * Cleanup function runs before component unmounts. Use this
       * to deregister/remove event listeners.
       */
      return () => {
        socket.removeEventListener("open", onOpen);
        microphone.ondataavailable = null;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [microphone, socket, microphoneState, defaultStsConfig, pathname]);

  /**
   * Performs checks to ensure that the system is ready to proceed with setting up the data transmission
   * Attaches an event listener to the microphone which sends audio data through the WebSocket as it becomes available
   */
  useEffect(() => {
    if (!microphone) return;
    if (!socket) return;
    if (microphoneState !== 2) return;
    if (socketState !== 1) return;
    processor.onaudioprocess = sendMicToSocket(socket);
  }, [microphone, socket, microphoneState, socketState, processor]);

  useEffect(() => {
    if (!processor || socket?.readyState !== 1) return;
    if (status === VoiceBotStatus.SLEEPING) {
      processor.onaudioprocess = null;
    } else {
      processor.onaudioprocess = sendMicToSocket(socket);
    }
  }, [status, processor, socket]);

  /**
   * Create AnalyserNode for user microphone audio context.
   * Exposes audio time / frequency data which is used in the
   * AnimationManager to scale the animations in response to user/agent voice
   */
  useEffect(() => {
    if (microphoneAudioContext) {
      userVoiceAnalyser.current = microphoneAudioContext.createAnalyser();
      userVoiceAnalyser.current.fftSize = 2048;
      userVoiceAnalyser.current.smoothingTimeConstant = 0.96;
      microphone.connect(userVoiceAnalyser.current);
    }
  }, [microphoneAudioContext, microphone]);

  const maybeRecordBehindTheScenesEvent = useCallback((serverMsg) => {
    switch (serverMsg.type) {
      case EventType.SETTINGS_APPLIED:
        addBehindTheScenesEvent({ type: EventType.SETTINGS_APPLIED });
        break;
      case EventType.USER_STARTED_SPEAKING:
        if (status === VoiceBotStatus.SPEAKING) {
          addBehindTheScenesEvent({ type: "Interruption" });
        }
        addBehindTheScenesEvent({ type: EventType.USER_STARTED_SPEAKING });
        break;
      case EventType.AGENT_STARTED_SPEAKING:
        addBehindTheScenesEvent({ type: EventType.AGENT_STARTED_SPEAKING });
        break;
      case EventType.CONVERSATION_TEXT:
        addBehindTheScenesEvent({
          type: EventType.CONVERSATION_TEXT,
          role: serverMsg.role,
          content: serverMsg.content,
        });
        break;
      case EventType.END_OF_THOUGHT:
        addBehindTheScenesEvent({ type: EventType.END_OF_THOUGHT });
        break;
    }
  }, [addBehindTheScenesEvent, status]);

  /**
   * Process every text event as it arrives. Using a single `data` state value
   * here used to collapse rapid consecutive WebSocket events into the last
   * render, which is why persisted transcripts could contain messages that
   * the live transcript missed.
   */
  const processServerMessage = useCallback((rawData) => {
    if (typeof rawData !== "string") return;

    try {
      const parsedData = JSON.parse(rawData);
      if (!parsedData) throw new Error("No data returned in JSON.");

      maybeRecordBehindTheScenesEvent(parsedData);

      if (parsedData.role === "user") {
        startListening();
        if (
          status !== VoiceBotStatus.SLEEPING &&
          parsedData.type === "History" &&
          parsedData.content
        ) {
          addVoicebotMessage({ user: parsedData.content });
        }
      }

      if (parsedData.role === "assistant") {
        if (
          status !== VoiceBotStatus.SLEEPING &&
          !isWaitingForUserVoiceAfterSleep.current
        ) {
          startSpeaking();
          if (parsedData.type === "History" && parsedData.content) {
            addVoicebotMessage({ assistant: parsedData.content });
          }
        }
      }

      if (parsedData.type === EventType.AGENT_AUDIO_DONE) {
        startListening();
      }

      if (parsedData.type === EventType.USER_STARTED_SPEAKING) {
        isWaitingForUserVoiceAfterSleep.current = false;
        startListening();
        clearAudioBuffer();
      }

      if (parsedData.type === EventType.AGENT_STARTED_SPEAKING) {
        const { tts_latency, ttt_latency, total_latency } = parsedData;
        if (tts_latency && ttt_latency) {
          addVoicebotMessage({ tts_latency, ttt_latency, total_latency });
        }
      }
    } catch (error) {
      console.error(rawData, error);
    }
  }, [
    addVoicebotMessage,
    clearAudioBuffer,
    isWaitingForUserVoiceAfterSleep,
    maybeRecordBehindTheScenesEvent,
    startListening,
    startSpeaking,
    status,
  ]);

  /**
   * Handles incoming WebSocket messages. Binary messages contain audio;
   * string messages contain transcript and conversation events.
   */
  const onMessage = useCallback((event) => {
    if (event.data instanceof ArrayBuffer) {
      if (
        status !== VoiceBotStatus.SLEEPING &&
        !isWaitingForUserVoiceAfterSleep.current
      ) {
        bufferAudio(event.data);
      }
      return;
    }

    addTranscriptMessage(event.data);
    processServerMessage(event.data);
    onMessageEvent(event.data);
  }, [
    addTranscriptMessage,
    bufferAudio,
    isWaitingForUserVoiceAfterSleep,
    onMessageEvent,
    processServerMessage,
    status,
  ]);

  const onMessageRef = useRef(onMessage);
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  /**
   * Opens Deepgram when the microphone opens.
   * Runs whenever `microphone` changes state, but exits if no microphone state.
   */
  useEffect(() => {
    if (
      microphoneState === 1 &&
      socketState === -1 &&
      (!requiresUserActionToInitialize ||
        (requiresUserActionToInitialize && isInitialized))
    ) {
      connectToDeepgram();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    microphone,
    socket,
    microphoneState,
    socketState,
    isInitialized,
    requiresUserActionToInitialize,
  ]);

  /**
   * Sets up a WebSocket message event listener to handle incoming messages through the 'onMessage' callback.
   */
  useEffect(() => {
    if (socket) {
      const handleMessage = (event) => onMessageRef.current(event);
      socket.addEventListener("message", handleMessage);
      return () => socket.removeEventListener("message", handleMessage);
    }
  }, [socket]);

  const handleVoiceBotAction = () => {
    if (requiresUserActionToInitialize && !isInitialized) {
      setIsInitialized(true);
    }

    if (status !== VoiceBotStatus.NONE) {
      toggleSleep();
    }
  };

  if (rateLimited) {
    return <RateLimited />;
  }

  // MAIN UI
  return (
    <div className={className}>
      <AnimationManager
        agentVoiceAnalyser={agentVoiceAnalyser.current}
        userVoiceAnalyser={userVoiceAnalyser.current}
        onOrbClick={handleVoiceBotAction}
      />
      {!microphone ? (
        <div className="text-base text-gray-25 text-center w-full">
          Loading microphone...
        </div>
      ) : (
        <Fragment>
          {socketState === -1 && requiresUserActionToInitialize && (
            <button
              className="text-center w-full"
              onClick={handleVoiceBotAction}
            >
              <span className="text-xl">Tap to start!</span>
            </button>
          )}
          {socketState === 0 && (
            <div className="text-base text-gray-25 text-center w-full">
              Loading...
            </div>
          )}
          {socketState > 0 && status === VoiceBotStatus.SLEEPING && (
            <div className="text-xl flex flex-col items-center justify-center mt-4 mb-10 md:mt-4 md:mb-10">
              <div className="text-gray-450 text-sm">
                I&apos;ve stopped listening. {isMobile ? "Tap" : "Click"} the
                orb to resume.
              </div>
            </div>
          )}
          {/* Transcript Section */}
          <div
            className={`h-20 md:h-12 text-sm md:text-base mt-2 flex flex-col items-center text-gray-200 overflow-y-auto`}
          >
            {messages.length > 0 ? <Transcript /> : null}
          </div>
        </Fragment>
      )}
    </div>
  );
};
