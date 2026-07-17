"use client";
import { CircleAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextGenerateEffect from "@/components/ui/typewriter";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "../kibo-ui/banner";

export default function AppHero() {
  const router = useRouter();
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
              <span className="bg-clip-text text-transparent [background-image:linear-gradient(90deg,#e0879e,#a5a9e0)]">
                pitch.
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
          </div>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          <div className="relative rounded-3xl bg-pink/40 p-4">
            <Image
              src="/images/hero-pitch-illustration.png"
              alt="Founder pitching to a panel of AI VC judges"
              width={900}
              height={700}
              className="h-full w-full rounded-2xl object-cover"
              priority
            />
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
