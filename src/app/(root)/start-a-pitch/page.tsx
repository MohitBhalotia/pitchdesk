"use client";

import React /*, { useState } */ from "react";
import VCSummaryCard from "@/components/VCSummaryCard";
import { vcs  } from "../../../../data/vc";
import PopupVideo from "@/components/PopupVideo";

export default function MeetTheVCsPage() {
  return (
    <main className="bg-background  py-6 px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center flex items-center justify-center gap-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            Meet the AI VCs
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-black dark:text-white mb-2">
            Click on a VC to explore their personality, philosophy, and
            deal-making style.
          </p>
        </div>
        <div className="mr-4 sm:mr-20 flex flex-col items-center justify-center gap-2">
          <PopupVideo videoUrl="https://res.cloudinary.com/mohitbhalotia/video/upload/v1762169522/pitch-practice_nsqhjw.mp4" />
          <p className="font-semibold  text-lg hidden sm:block">How it works?</p>
        </div>
      </div>

      {/* VC Cards */}
      <div className="mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {vcs.map((vc) => (
          <VCSummaryCard key={vc.id} {...vc} />
        ))}
      </div>
    </main>
  );
}
