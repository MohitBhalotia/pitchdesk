"use client";

import Image from "next/image";
import { useState } from "react";
import { Users, Presentation, Handshake } from "lucide-react";

function AboutIllustrationPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-mint/50 via-yellow/30 to-lavender/40 p-6 md:p-10">
      <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-mint-deep/25 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-pink/40 blur-2xl" />

      <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-5 py-4 shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mint-deep text-mint-deep-foreground">
            <Users className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-ink/70">Founders</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-5 py-4 shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow text-yellow-foreground">
            <Presentation className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-ink/70">Pitch decks</span>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-2xl bg-white px-5 py-4 shadow-lg">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-pink text-pink-foreground">
            <Handshake className="h-5 w-5" />
          </div>
          <span className="text-xs font-medium text-ink/70">Mentors &amp; VCs</span>
        </div>
      </div>
    </div>
  );
}

export default function AboutHeroImage() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full aspect-[12/5]">
        <AboutIllustrationPlaceholder />
      </div>
    );
  }

  return (
    <Image
      src="/images/about-team-illustration.jpg"
      alt="Founders and mentors collaborating on a pitch"
      width={1200}
      height={500}
      className="w-full rounded-2xl object-cover"
      onError={() => setFailed(true)}
    />
  );
}
