"use client";
import Image from "next/image";
import Link from "next/link";
import Step1Form from "./Step1Form";

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <div className="w-full lg:w-1/2 flex flex-col p-6 md:p-12">
        <div className="flex justify-center md:justify-start items-center gap-3 mb-8">
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
            <span className="text-xl font-bold">
              PitchDesk
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs mt-10">
            <Step1Form />
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
