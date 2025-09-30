"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

const MicrophoneContext = createContext();

const MicrophoneContextProvider = ({ children }) => {
  /**
   * Microphone states:
   * - null   → not setup
   * - 0      → setting up
   * - 1      → ready
   * - 2      → open
   * - 3      → stopped/paused
   */
  const [microphoneState, setMicrophoneState] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [microphoneAudioContext, setMicrophoneAudioContext] = useState(null);
  const [processor, setProcessor] = useState(null);
  const [micStream, setMicStream] = useState(null); // ✅ keep track of the actual stream

  /**
   * Setup mic and audio processing graph
   */
  const setupMicrophone = async () => {
    setMicrophoneState(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          volume: 1.0,
          echoCancellation: true,
          noiseSuppression: false,
          latency: 0,
        },
      });

      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const proc = audioContext.createScriptProcessor(4096, 1, 1);

      setMicStream(stream);
      setMicrophone(source);
      setMicrophoneAudioContext(audioContext);
      setProcessor(proc);
      setMicrophoneState(1);

      return { stream, source, audioContext, proc };
    } catch (err) {
      console.error("Failed to setup microphone:", err);
      throw err;
    }
  };

  /**
   * Start streaming mic audio
   */
  const startMicrophone = useCallback(() => {
    if (!microphone || !processor || !microphoneAudioContext) {
      console.warn("startMicrophone called before setup");
      return;
    }

    // prevent double-connecting
    if (microphoneState === 2) {
      console.log("Microphone already started");
      return;
    }

    microphone.connect(processor);
    processor.connect(microphoneAudioContext.destination);

    setMicrophoneState(2);
    console.log("Microphone started");
  }, [processor, microphoneAudioContext, microphone, microphoneState]);

  const stopMicrophone = useCallback(async () => {
    // console.log("🛑 Stopping microphone, current state:", microphoneState);

    try {
      // Disconnect audio graph first
      if (microphone) {
        microphone.disconnect();
        // console.log("📡 Microphone source disconnected");
      }

      if (processor) {
        processor.disconnect();
        // console.log("⚙️ Processor disconnected");
      }

      // Stop all tracks in the media stream (this releases the mic hardware)
      if (micStream) {
        // console.log("🎤 Stopping media stream tracks...");
        micStream.getTracks().forEach((track) => {
          // console.log(
          //   `Stopping track: ${track.kind}, state: ${track.readyState}`
          // );
          if (track.readyState === "live") {
            track.stop();
            // console.log(`✅ Track ${track.kind} stopped`);
          }
        });
      }

      // Close audio context completely
      if (microphoneAudioContext && microphoneAudioContext.state !== "closed") {
        // console.log("🔊 Closing AudioContext...");
        await microphoneAudioContext.close();
        // console.log("✅ AudioContext closed");
      }

      // Reset state so next time it's a clean setup
      setMicrophone(null);
      setProcessor(null);
      setMicrophoneAudioContext(null);
      setMicStream(null);
      setMicrophoneState(null); // back to "not setup"

      // console.log("✅ Microphone fully stopped and released");
    } catch (err) {
      console.error("❌ Error while stopping microphone:", err);
    }
  }, [
    processor,
    microphoneAudioContext,
    microphone,
    microphoneState,
    micStream,
  ]);

  // Cleanup function to ensure microphone is released when component unmounts
  useEffect(() => {
    return () => {
      // console.log("🧹 Cleaning up microphone on unmount");
      if (micStream) {
        micStream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
            // console.log(`✅ Cleanup: Track ${track.kind} stopped`);
          }
        });
      }
      if (microphoneAudioContext && microphoneAudioContext.state !== "closed") {
        microphoneAudioContext.close();
        // console.log("✅ Cleanup: AudioContext closed");
      }
    };
  }, [micStream, microphoneAudioContext]);

  return (
    <MicrophoneContext.Provider
      value={{
        microphone,
        microphoneAudioContext,
        processor,
        micStream,
        microphoneState,
        setupMicrophone,
        startMicrophone,
        stopMicrophone,
      }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
};

function useMicrophone() {
  return useContext(MicrophoneContext);
}

export { MicrophoneContextProvider, useMicrophone };
