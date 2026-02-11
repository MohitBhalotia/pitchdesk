import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import SessionWrapper from "../components/SessionWrapper";
import { Toaster } from "../components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pitchdesk.in'),
  title: {
    default: "PitchDesk | AI-Powered Pitch Practice & VC Simulation Platform",
    template: "%s | PitchDesk",
  },
  description: "Practice your startup pitch with AI judges, generate pitch scripts, compete in virtual demo days, and get discovered by VCs. The complete AI pitch training platform for founders.",
  keywords: [
    "AI pitch simulator",
    "startup pitch practice",
    "VC simulator",
    "pitch script generator",
    "pitch competitions",
    "startup fundraising",
    "AI pitch feedback",
    "virtual pitch room",
    "demo day platform",
    "pitch training",
  ],
  authors: [{ name: "PitchDesk Team" }],
  creator: "PitchDesk",
  publisher: "PitchDesk",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pitchdesk.in",
    title: "PitchDesk | AI-Powered Pitch Practice & VC Simulation Platform",
    description: "Practice your startup pitch with AI judges, generate pitch scripts, and get discovered by VCs. The complete AI pitch training platform.",
    siteName: "PitchDesk",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PitchDesk - AI Pitch Simulator",
      },
    ],
  },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "PitchDesk | AI-Powered Pitch Practice Platform",
  //   description: "Practice your startup pitch with AI judges and get discovered by VCs.",
  //   images: ["/og-image.png"],
  //   creator: "@pitchdesk",
  // },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

if (process.env.NODE_ENV !== "development") {
  console.log = () => { }
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper>
            {children}
            <Toaster position="bottom-right" richColors />
          </SessionWrapper>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
