"use client";
import { Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextGenerateEffect from "@/components/ui/typewriter";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AppHero() {
  const router=useRouter()
  return (
    <section className=" mt-10 mb-30 min-h-screen container mx-auto max-w-7xl px-4 py-20 animate-in fade-in duration-500">
      <div
        className="mb-4 inline-block w-fit rounded-full border bg-white/5 px-4 py-1.5 backdrop-blur-lg animate-in fade-in duration-700 delay-200"
        style={{ boxShadow: "0 0 10px 0 #e60a6430 inset" }}
      >
        <span className="text-sm font-medium">
          <Command className="mr-2 inline-block h-4 w-4" />
          Introducing Pitch Desk
        </span>
      </div>

      <div className="relative z-10 mt-6">
        <h1 className="mb-4 text-left text-5xl font-normal tracking-tight md:text-7xl">
          <span className="text-foreground">
            <TextGenerateEffect words="Simulate VC Rooms &" />
          </span>
          <br />
          <span className="text-foreground font-medium">
            <TextGenerateEffect words=" Refine Your Pitch." />
          </span>
        </h1>

        <p className="text-foreground/50 mb-8 max-w-2xl text-left text-lg md:text-xl animate-in slide-in-from-bottom-4 duration-500 delay-400">
          Pitch with power. Land the deal. AI VC agents listen to your pitch in
          real time, ask sharp questions, give instant feedback, and simulate
          VCs with diverse personalities
        </p>

        <div className="flex flex-col items-start gap-4 sm:flex-row animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <Button
          onClick={() => router.push('/signup/step1')}
            size="lg"
            className="rounded-full bg-gradient-to-b from-primary/80 to-primary/90 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
          >
            Try it for Free
          </Button>
          {/* <Button size="lg" variant="link">
            View Markets <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>
      </div>

      <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}>
          
          <div className="border-2 border-black relative mt-10 z-10 mx-auto max-w-5xl rounded-2xl shadow-[0_0_50px_rgba(155,135,245,0.2)]">
            <div
              style={{
                backgroundImage: "var(--dashboard-src)",
              }}
              role="img"
              aria-label="Quick Voice Dashboard"
              className="h-full w-full aspect-[20/10.5]  rounded-2xl border border-white/10 bg-cover "
            />
          </div>
        </motion.div>
    </section>  
  );
}
