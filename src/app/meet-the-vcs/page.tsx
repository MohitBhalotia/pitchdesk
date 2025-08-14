"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import VCSummaryCard from '@/components/VCSummaryCard';
import ProfileCard from '@/components/ProfileCard';
import { vcs, VC } from '../../../data/aiVCs';

export default function MeetTheVCsPage() {
  const [selectedVc, setSelectedVc] = useState<VC | null>(null);
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

  // Split VCs: first 6 English, next 6 Hindi
  const englishVCs = vcs.slice(0, 6);
  const hindiVCs = vcs.slice(6, 12);
  const shownVCs = language === 'english' ? englishVCs : hindiVCs;

  return (
    <main className="min-h-screen bg-[#09090b] text-[#fafafa] py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center mb-14">
        <h1 className="text-5xl font-extrabold mb-4 text-[#fafafa]">Meet the AI VCs</h1>
        <p className="text-xl text-[#fafafa]/80 mb-2">Click on a VC to explore their personality, philosophy, and deal-making style.</p>
        <span className="inline-block bg-[#fafafa]/10 h-1 w-32 rounded-full mt-4" />
       <div className="flex justify-center gap-4 mt-8">
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors border-2 border-teal-400/60 dark:border-violet-500/60 text-lg ${language === 'english' ? 'bg-teal-500/90 text-white shadow-lg' : 'bg-transparent text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/30'}`}
            onClick={() => setLanguage('english')}
          >
            English
          </button>
          <button
            className={`px-6 py-2 rounded-full font-semibold transition-colors border-2 border-violet-400/60 dark:border-teal-500/60 text-lg ${language === 'hindi' ? 'bg-violet-500/90 text-white shadow-lg' : 'bg-transparent text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30'}`}
            onClick={() => setLanguage('hindi')}
          >
            Hindi
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 px-30 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {shownVCs.map((vc) => (
          <VCSummaryCard key={vc.id} {...vc} onClick={() => setSelectedVc(vc)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedVc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedVc(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ProfileCard {...selectedVc} />
              <button
                onClick={() => setSelectedVc(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

