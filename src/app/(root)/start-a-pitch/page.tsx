"use client";

import React, { useState } from 'react';

import VCSummaryCard from '@/components/VCSummaryCard';
import { vcs, VC } from '../../../../data/aiVCs';

export default function MeetTheVCsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedVc, setSelectedVc] = useState<VC | null>(null);


  return (
    <main className="bg-background text-primary py-6 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center ">
        <h1 className="text-5xl font-extrabold mb-4 text-foreground">Meet the AI VCs</h1>
        <p className="text-xl text-black dark:text-white mb-2">Click on a VC to explore their personality, philosophy, and deal-making style.</p>
        <span className="inline-block bg-primary/10 h-1 w-32 rounded-full mt-4" />
       
      </div>
      <div className="grid grid-cols-1 px-30 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {vcs.map((vc) => (
          <VCSummaryCard key={vc.id} {...vc} onClick={() => setSelectedVc(vc)} />
        ))}
      </div>

    </main>
  );
}

