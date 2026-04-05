"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, Briefcase, Loader2, Zap, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function SignupRoleSelection() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRoleSelect = async (role: "founder" | "vc") => {
    // If user is already authenticated but missing role selection (e.g. from direct Google login)
    if (status === "authenticated" && !session?.user?.signupStep2Done) {
      setIsProcessing(true);
      try {
        const res = await axios.post("/api/users/update", {
          role,
          company: "",
          websiteUrl: "",
        });

        if (res.status === 200) {
          await update(); // Refresh session data
          
          if (role === "vc") {
            toast.success("Registration successful! Your account is pending verification.");
            window.location.replace("/verification-pending");
          } else {
            toast.success("Welcome to PitchDesk!");
            window.location.replace("/dashboard");
          }
        }
      } catch (error) {
        console.error("Error updating role:", error);
        toast.error("Failed to update role. Please try again.");
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Default flow for guest users
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
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-lg group ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
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
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-600/80 dark:text-green-400/70 mb-3">
                <Zap className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Instant access, start pitching right after signup</span>
              </div>
              <div className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up as Founder →"}
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary hover:shadow-lg group ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
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
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600/80 dark:text-amber-400/70 mb-3">
                <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Manually verified by our team before access is granted</span>
              </div>
              <div className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign up as Investor →"}
              </div>
            </CardContent>
          </Card>
        </div>

        {!session?.user && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
