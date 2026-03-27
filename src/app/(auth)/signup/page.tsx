"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Briefcase } from "lucide-react";

export default function SignupRoleSelection() {
  const router = useRouter();

  const handleRoleSelect = (role: "founder" | "vc") => {
    router.push(`/signup/step1?role=${role}`);
  };

  return (
    <div className="flex flex-col min-h-svh items-center justify-center p-6 bg-background">
      <div className="w-full max-w-2xl space-y-8">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full">
              <Image
                src="/logo.png"
                alt="PitchDesk Logo"
                width={48}
                height={48}
                className="dark:invert rounded-full"
              />
            </div>
            <span className="text-2xl font-bold">PitchDesk</span>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">How will you be using PitchDesk?</h1>
          <p className="text-muted-foreground">Choose the role that best describes you to get started.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card 
            className="cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-lg group"
            onClick={() => handleRoleSelect("founder")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">I am a Founder</CardTitle>
              <CardDescription>
                I want to refine my pitch, practice with AI, and connect with investors.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Sign up as Founder &rarr;
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-lg group"
            onClick={() => handleRoleSelect("vc")}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">I am a VC / Investor</CardTitle>
              <CardDescription>
                I want to discover promising startups and manage my investment pipeline.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Sign up as Investor &rarr;
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
