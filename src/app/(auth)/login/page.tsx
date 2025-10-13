"use client";
import { Sparkles } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-row justify-between min-h-svh lg:grid-cols-2">
      <div className="flex flex-2/3 flex-col gap-4 p-6 md:p-10 w-full">
        <div className="flex justify-center items-center gap-4 md:justify-start">
          {/* <Sparkles className="h-5 w-5 text-white" />
          <Link href="/">
            <h1 className="text-2xl font-bold">Pitch Desk</h1>
          </Link> */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full ">

              <Image
                src="/logo.png"
                alt="PitchDesk Logo"
                width={40}
                height={40}
                className="dark:invert rounded-full"
              />

            </div>
            <span className="  text-xl font-bold ">
              PitchDesk
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs mt-10">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="hidden flex-1/2 lg:block p-4 rounded-lg h-screen">
        <Image
          loading="lazy"
          width={1000}
          height={1000}
          src="/Shark.jpeg"
          alt="LoginBg"
          className="rounded-lg object-cover h-full w-full"
        />
      </div>
    </div>
  );
}
