import {  Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import TextGenerateEffect from "@/components/ui/typewriter"
import { BorderBeam } from "@/components/ui/border-beam"
import Image from "next/image"

export default function appHero() {
  return (
    <section className="relative container mx-auto max-w-6xl px-4 py-20 animate-in fade-in duration-500">
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
              Pitch with power. Land the deal.
              AI VC agents listen to your pitch in real time,
              ask sharp questions, give instant feedback,
              and simulate VCs with diverse personalities
        </p>

        <div className="flex flex-col items-start gap-4 sm:flex-row animate-in slide-in-from-bottom-4 duration-500 delay-500">
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-b from-rose-500 to-rose-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]"
          >
              Try it for Free 
          </Button>
          {/* <Button size="lg" variant="link">
            View Markets <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>
      </div>

      <div className="relative mx-auto mt-20 max-w-5xl overflow-hidden rounded-xl animate-in slide-in-from-bottom-8 duration-700 delay-600">
        <div className="overflow-hidden rounded-xl">
          <Image
            src="https://blocks.mvp-subha.me/assets/trading-hero/db.jpg"
            alt="CryptoTrade Dashboard"
            className="h-auto w-full"
          />
        </div>
        <BorderBeam duration={6} size={400} className="from-transparent via-red-500 to-transparent" />
        <BorderBeam duration={6} delay={3} size={400} className="from-transparent via-blue-500 to-transparent" />
      </div>
    </section>
  )
}
