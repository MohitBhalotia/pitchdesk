"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Rocket, FileText, TrendingUp, Sparkles } from "lucide-react";
import Image from "next/image";

const features = [
  {
    step: "01",
    title: "Present Your Pitch",
    content:
      "Select your preferred VC personality and pitch in English. Navigate through negotiation rounds and receive final verdicts on your presentation.",
    icon: <Rocket className="h-6 w-6" />,
    bigIcon: <Rocket className="h-14 w-14" />,
    image: "/images/step1-present-pitch.png",
    color: "bg-mint text-mint-foreground",
    line: "bg-mint/30",
    ring: "ring-mint/30",
  },
  {
    step: "02",
    title: "Get Your Curated Pitch Report",
    content:
      "A detailed analysis of your pitch and the Q&A session by our AI-powered pitch analyzer. Get suggestions and changes to make it better.",
    icon: <FileText className="h-6 w-6" />,
    bigIcon: <FileText className="h-14 w-14" />,
    image: "/images/step2-pitch-report.png",
    color: "bg-yellow text-yellow-foreground",
    line: "bg-yellow/30",
    ring: "ring-yellow/30",
  },
  {
    step: "03",
    title: "Increased Visibility Among Investors",
    content:
      "Build your presence among our partnered venture capitalists and list yourself on our crowdfunding platform.",
    icon: <TrendingUp className="h-6 w-6" />,
    bigIcon: <TrendingUp className="h-14 w-14" />,
    image: "/images/step3-investor-visibility.png",
    color: "bg-pink text-pink-foreground",
    line: "bg-pink/30",
    ring: "ring-pink/30",
  },
  {
    step: "04",
    title: "Don't Have a Pitch Yet?",
    content:
      "Get a personalized pitch script written by our highly trained AI agent — tailored to your startup and your market.",
    icon: <Sparkles className="h-6 w-6" />,
    bigIcon: <Sparkles className="h-14 w-14" />,
    image: "/images/step4-pitch-script.png",
    color: "bg-lavender text-lavender-foreground",
    line: "bg-lavender/30",
    ring: "ring-lavender/30",
  },
];

function StepImage({ feature }: { feature: (typeof features)[number] }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center rounded-2xl",
          feature.color
        )}
      >
        {feature.bigIcon}
      </div>
    );
  }

  return (
    <Image
      src={feature.image}
      alt={feature.title}
      className="h-full w-full rounded-2xl object-cover"
      width={1000}
      height={500}
      onError={() => setFailed(true)}
    />
  );
}

export default function FeatureSteps() {
  return (
    <div id="features" className="mx-auto w-full max-w-6xl mt-10 px-6 py-20">
      <div className="mx-auto mb-20 max-w-2xl text-center">
        <span className="inline-block mb-4 rounded-full bg-mint px-4 py-1.5 text-sm font-medium text-mint-foreground">
          How it works
        </span>
        <h2 className="mb-4 text-3xl font-display font-extrabold text-ink md:text-5xl">
          Perfect Your Pitch!
        </h2>
        <p className="text-ink/60 mt-3 text-lg">
          PitchDesk helps you refine your pitch and generates personalized
          pitches with increased chances of cracking the deal of your dreams.
        </p>
      </div>

      <div className="relative">
        {/* Center timeline */}
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block" />

        <div className="flex flex-col gap-16 md:gap-24">
          {features.map((feature, index) => {
            const imageFirst = index % 2 === 0;
            return (
              <div
                key={feature.step}
                className="relative grid items-center gap-8 md:grid-cols-2 md:gap-16"
              >
                {/* Step marker on the timeline */}
                <div
                  className={cn(
                    "absolute left-1/2 top-1/2 z-10 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-lg font-display font-bold md:flex",
                    feature.color
                  )}
                >
                  {feature.step}
                </div>

                <motion.div
                  initial={{ opacity: 0, x: imageFirst ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "relative h-[220px] overflow-hidden rounded-3xl p-3 ring-2 ring-offset-2 ring-offset-background md:h-[320px]",
                    feature.line,
                    feature.ring,
                    imageFirst ? "md:order-1" : "md:order-2"
                  )}
                >
                  <StepImage feature={feature} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: imageFirst ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                  className={cn(imageFirst ? "md:order-2" : "md:order-1")}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl md:hidden",
                      feature.color
                    )}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-sm font-semibold text-ink/40 md:hidden">
                    Step {feature.step}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-ink md:text-3xl mt-1">
                    {feature.title}
                  </h3>
                  <p className="text-ink/60 text-base md:text-lg mt-3 leading-relaxed">
                    {feature.content}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
