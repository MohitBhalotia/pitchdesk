"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Flame, Handshake, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Persona {
  name: string;
  role: string;
  description: string;
  question: string;
  icon: React.ElementType;
  image: string;
  color: string;
  soft: string;
  foreground: string;
}

const personas: Persona[] = [
  {
    name: "The Validator",
    role: "Idea Validator VC",
    description:
      "Stress-tests your startup concept before you even open your deck — market size, competition, and whether the problem is real.",
    question: "“Why will this still matter in 3 years?”",
    icon: Search,
    image: "/images/vc-persona-validator.png",
    color: "bg-mint",
    soft: "bg-mint/25",
    foreground: "text-mint-foreground",
  },
  {
    name: "The Griller",
    role: "Grilling Session VC",
    description:
      "Fires tough, rapid-fire questions just like a real investor panel — built to toughen up your answers under pressure.",
    question: "“Walk me through your unit economics. Now.”",
    icon: Flame,
    image: "/images/vc-persona-griller.png",
    color: "bg-yellow",
    soft: "bg-yellow/25",
    foreground: "text-yellow-foreground",
  },
  {
    name: "The Closer",
    role: "Verdict VC",
    description:
      "Weighs everything you presented and delivers a final, honest call — the deal terms, the doubts, and what would change their mind.",
    question: "“Here’s what it would take for me to say yes.”",
    icon: Handshake,
    image: "/images/vc-persona-closer.png",
    color: "bg-pink",
    soft: "bg-pink/25",
    foreground: "text-pink-foreground",
  },
];

function PersonaAvatar({ persona }: { persona: Persona }) {
  const [failed, setFailed] = useState(false);
  const Icon = persona.icon;

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-full",
          persona.color,
          persona.foreground
        )}
      >
        <Icon className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-20 overflow-hidden rounded-full">
      <Image
        src={persona.image}
        alt={persona.name}
        fill
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function AIVCPanel() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-20">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <span className="inline-block mb-4 rounded-full bg-lavender px-4 py-1.5 text-sm font-medium text-lavender-foreground">
          <Sparkles className="mr-1 inline-block h-3.5 w-3.5" />
          Meet the panel
        </span>
        <h2 className="mb-4 text-3xl font-display font-extrabold text-ink md:text-5xl">
          Meet Your AI VC Panel
        </h2>
        <p className="text-ink/60 mt-3 text-lg">
          Three distinct AI investor personalities, each pushing you in a
          different way — so the real pitch feels easy by comparison.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {personas.map((persona, index) => (
          <motion.div
            key={persona.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn(
              "flex flex-col items-center rounded-3xl p-8 text-center",
              persona.soft
            )}
          >
            <PersonaAvatar persona={persona} />
            <h3 className="mt-5 text-xl font-display font-bold text-ink">
              {persona.name}
            </h3>
            <span
              className={cn(
                "mt-1 mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium",
                persona.color,
                persona.foreground
              )}
            >
              {persona.role}
            </span>
            <p className="text-ink/60 text-sm leading-relaxed">
              {persona.description}
            </p>

            <div className="relative mt-6 w-full max-w-[220px] rounded-2xl rounded-bl-sm bg-ink px-5 py-3">
              <p className="text-xs text-cream leading-snug">
                {persona.question}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
