"use client";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Step1Form from "./Step1Form";

export default function Step1Page() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12">
        <div className="flex justify-center md:justify-start items-center gap-3 mb-8">
          <Sparkles className="h-5 w-5 text-primary" />
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Pitch Desk
            </h1>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center lg:text-left mb-6">
              <h2 className="text-center text-2xl md:text-3xl font-bold tracking-tight">
                Get Started
              </h2>
              <p className="text-center text-muted-foreground mt-2 text-sm md:text-base">
                Create your account to start crafting the perfect pitch
              </p>
            </div>

            <Step1Form />
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6">
        <div className="w-full max-w-lg h-auto rounded-xl overflow-hidden">
          <Image
            loading="lazy"
            src="/Shark.jpeg"
            alt="SignUpBg"
            width={800}
            height={800}
            className="rounded-xl object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
