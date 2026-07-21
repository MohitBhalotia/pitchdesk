"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "3+", label: "AI VC personas" },
  { value: "24/7", label: "Practice availability" },
  { value: "Instant", label: "Pitch feedback" },
  { value: "Multilingual", label: "AI VC support" },
];

export default function StatsBand() {
  return (
    <div className="mx-auto max-w-7xl px-6 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="-rotate-1 rounded-3xl bg-mint-deep px-6 py-10 sm:px-10 md:py-12"
      >
        <div className="rotate-1 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <div className="text-3xl font-display font-extrabold text-mint-deep-foreground md:text-4xl">
                {stat.value}
              </div>
              <p className="text-mint-deep-foreground/70 text-sm mt-1 md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
