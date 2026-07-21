"use client";
import { CircleAlert, Sparkles, Mic, Bot, MessageSquareText, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextGenerateEffect from "@/components/ui/typewriter";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "../kibo-ui/banner";

function HeroIllustrationPlaceholder() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-mint/60 via-lavender/40 to-pink/40 p-6 md:p-10">
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-yellow/50 blur-2xl" />
      <div className="absolute -bottom-10 -right-6 h-40 w-40 rounded-full bg-mint-deep/30 blur-2xl" />

      {/* Founder card */}
      <div className="relative z-10 flex flex-col items-center gap-2 rounded-2xl bg-white px-6 py-5 shadow-lg">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-cream">
          <Mic className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-ink/70">You, pitching</span>
      </div>

      {/* Floating AI VC judge chips */}
      <div className="absolute left-6 top-8 flex -rotate-6 items-center gap-2 rounded-xl bg-mint-deep px-3 py-2 text-mint-deep-foreground shadow-md md:left-10 md:top-10">
        <Bot className="h-4 w-4" />
        <span className="text-xs font-medium">AI VC #1</span>
      </div>
      <div className="absolute right-4 top-16 flex rotate-3 items-center gap-2 rounded-xl bg-yellow px-3 py-2 text-yellow-foreground shadow-md md:right-8 md:top-20">
        <MessageSquareText className="h-4 w-4" />
        <span className="text-xs font-medium">Sharp question</span>
      </div>
      <div className="absolute bottom-8 left-10 flex rotate-2 items-center gap-2 rounded-xl bg-pink px-3 py-2 text-pink-foreground shadow-md md:bottom-12 md:left-16">
        <TrendingUp className="h-4 w-4" />
        <span className="text-xs font-medium">Instant verdict</span>
      </div>
    </div>
  );
}

export default function AppHero() {
  const router = useRouter();
  const [heroImageFailed, setHeroImageFailed] = useState(false);
  return (
    <section className="mt-28 mb-20 container mx-auto max-w-7xl px-6 py-10 animate-in fade-in duration-500">
      <div className="mb-6">
        <Banner className="rounded-2xl bg-lavender text-ink">
          <BannerIcon icon={CircleAlert} className="border-ink/10 bg-ink/5" />
          <BannerTitle>
            You can now compete in various competitions across the world!
          </BannerTitle>
          <div className="ml-auto flex items-center gap-2">
            <BannerAction
              onClick={() => router.push("/competitions")}
              className="hover:bg-ink/10 hover:text-ink"
            >
              Learn more
            </BannerAction>
            <BannerClose className="hover:bg-ink/10 hover:text-ink" />
          </div>
        </Banner>
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative z-10">
          <div className="mb-6 inline-flex w-fit items-center rounded-full bg-mint px-4 py-1.5 animate-in fade-in duration-700 delay-200">
            <Sparkles className="mr-2 inline-block h-4 w-4 text-mint-foreground" />
            <span className="text-sm font-medium text-mint-foreground">
              Introducing PitchDesk
            </span>
          </div>

          <h1 className="mb-6 text-left text-5xl font-display font-extrabold tracking-tight md:text-6xl">
            <span className="text-ink">
              <TextGenerateEffect words="Simulate VC rooms." />
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-ink"
            >
              Refine your{" "}
              <span className="relative inline-block">
                <span className="bg-clip-text text-transparent [background-image:linear-gradient(90deg,#e0879e,#a5a9e0)]">
                  pitch.
                </span>
                <svg
                  viewBox="0 0 120 12"
                  className="absolute -bottom-1 left-0 h-3 w-full text-mint-deep"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8 C 20 2, 40 10, 60 5 S 100 2, 118 7"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
            </motion.span>
          </h1>

          <p className="text-ink/60 mb-10 max-w-lg text-left text-lg md:text-xl animate-in slide-in-from-bottom-4 duration-500 delay-400">
            AI VC agents listen to your pitch in real time, ask sharp
            questions, give instant feedback, and help you land the deal.
          </p>

          <div className="flex flex-col items-start gap-4 sm:flex-row animate-in slide-in-from-bottom-4 duration-500 delay-500">
            <Button
              onClick={() => router.push("/signup")}
              size="lg"
              className="rounded-full bg-ink text-cream hover:bg-ink/90 px-8 py-6 text-base"
            >
              Try it for Free
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              size="lg"
              variant="outline"
              className="rounded-full border-ink/20 px-8 py-6 text-base hover:bg-muted"
            >
              See How It Works
            </Button>
          </div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="relative rounded-3xl bg-pink/40 p-4">
            {heroImageFailed ? (
              <div className="aspect-[9/7] w-full">
                <HeroIllustrationPlaceholder />
              </div>
            ) : (
              <Image
                src="/images/hero-pitch-illustration.png"
                alt="Founder pitching to a panel of AI VC judges"
                width={900}
                height={700}
                className="h-full w-full rounded-2xl object-cover"
                priority
                onError={() => setHeroImageFailed(true)}
              />
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        <div className="relative mt-16 z-10 mx-auto max-w-5xl rounded-3xl border border-border bg-white p-2 shadow-sm">
          <Image
            src="/light-dashboard.png"
            alt="PitchDesk dashboard preview"
            width={1440}
            height={704}
            className="h-full w-full aspect-[22.5/11] rounded-2xl object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}
