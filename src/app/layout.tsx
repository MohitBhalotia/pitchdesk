import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/auth";
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

const displayFont = localFont({
  src: "../fonts/ABCFavorit-Bold.woff2",
  weight: "700",
  variable: "--font-display",
  display: "swap",
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
    "pitch deck generator",
    "pitch deck maker",
    "pitchdeck",
    "pitch competitions",
    "startup fundraising",
    "AI pitch feedback",
    "virtual pitch room",
    "demo day platform",
    "pitch training",
    "best AI pitch practice",
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


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionWrapper session={session}>
            {children}
            <Toaster position="bottom-right" richColors />
          </SessionWrapper>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
