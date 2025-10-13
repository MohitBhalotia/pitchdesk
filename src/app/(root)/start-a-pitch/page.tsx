"use client";

import React/*, { useState } */from "react";
import VCSummaryCard from "@/components/VCSummaryCard";
import { vcs/*, VC */} from "../../../../data/vc";

export default function MeetTheVCsPage() {

  return (
    <main className="bg-background text-primary py-6 px-4 sm:px-6 md:px-12 lg:px-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
          Meet the AI VCs
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-black dark:text-white mb-2">
          Click on a VC to explore their personality, philosophy, and
          deal-making style.
        </p>
        <span className="inline-block bg-primary/10 h-1 w-24 sm:w-32 rounded-full mt-4" />
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
