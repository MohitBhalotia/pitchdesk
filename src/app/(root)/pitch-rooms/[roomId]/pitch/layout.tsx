import type { ReactNode } from "react";
import { DeepgramContextProvider } from "@/context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "@/context/MicrophoneContextProvider";
import { VoiceBotProvider } from "@/context/VoiceBotContextProvider";

/**
 * The live voice-session mechanics (mic capture, the raw Deepgram
 * WebSocket, transcript buffering) live in these three context providers,
 * already used unchanged by the generic `/start-a-pitch` flow. Nesting them
 * here -- rather than duplicating a whole separate root layout the way
 * `src/app/start-pitch/layout.tsx` does -- keeps this page inside the normal
 * authenticated app shell, since `/pitch-rooms/[roomId]` already is.
 */
export default function PitchRoomSessionLayout({ children }: { children: ReactNode }) {
  return (
    <VoiceBotProvider>
      <MicrophoneContextProvider>
        <DeepgramContextProvider>{children}</DeepgramContextProvider>
      </MicrophoneContextProvider>
    </VoiceBotProvider>
  );
}
