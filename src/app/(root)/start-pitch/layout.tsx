import type { ReactNode } from "react";
import { Inter, Fira_Code } from "next/font/google";
import localFont from "next/font/local";
import { DeepgramContextProvider } from "../../../context/DeepgramContextProvider";
import { MicrophoneContextProvider } from "../../../context/MicrophoneContextProvider";
import { VoiceBotProvider } from "../../../context/VoiceBotContextProvider";
import AnimatedBackground from "../../../components/AnimatedBackground";

import "../../globals.css";
import { sharedOpenGraphMetadata } from "../../../lib/constants";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "fallback",
});
const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
  display: "fallback",
});
const favorit = localFont({
  src: "../../../fonts/ABCFavorit-Bold.woff2",
  weight: "700",
  variable: "--font-favorit",
  display: "fallback",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Voice Agent",
  description: "Voice Agent",
  openGraph: sharedOpenGraphMetadata,
  twitter: {
    card: "summary_large_image",
    site: "@VoiceAgent",
    creator: "@VoiceAgent",
  },
};

const fonts = [inter, fira, favorit].map((font) => font.variable).join(" ");

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${fonts} font-inter`}>
      <body>
          <VoiceBotProvider>
            <MicrophoneContextProvider>
              <DeepgramContextProvider>
                <AnimatedBackground>
                  {children}
                </AnimatedBackground>
              </DeepgramContextProvider>
            </MicrophoneContextProvider>
          </VoiceBotProvider>
      </body>
    </html>
  );
}
