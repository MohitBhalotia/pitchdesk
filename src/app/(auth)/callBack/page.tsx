"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function CallBackPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const completeSignup = async () => {
      if (status === "authenticated" && session?.user && !session.user.signupStep2Done && !processing) {
        setProcessing(true);
        try {
          const storedRole = sessionStorage.getItem("authRole") || "founder";
          
          const step2Data = {
            role: storedRole,
            company: "",
            websiteUrl: "",
          };

          const res = await axios.post("/api/users/update", step2Data);
          
          if (res.status === 200) {
            await update();
            sessionStorage.removeItem("authRole");
            
            if (storedRole === "vc") {
              // For VC, redirect to verification pending even after Google signup
              toast.success("Registration successful! Your VC account is pending verification.");
              window.location.replace("/verification-pending");
              return;
            }

            const storedRedirect = sessionStorage.getItem("authRedirect");
            if (storedRedirect) {
              sessionStorage.removeItem("authRedirect");
              window.location.replace(storedRedirect);
            } else {
              window.location.replace("/dashboard");
            }
          } else {
            toast.error("Failed to complete profile setup.");
            router.replace("/signup");
          }
        } catch (error) {
          console.error("Error completing signup:", error);
          toast.error("An error occurred during signup.");
          router.replace("/signup");
        } finally {
          setProcessing(false);
        }
      } else if (status === "authenticated" && session?.user?.signupStep2Done) {
        const storedRedirect = sessionStorage.getItem("authRedirect");
        if (storedRedirect) {
          sessionStorage.removeItem("authRedirect");
          router.replace(storedRedirect);
        } else {
          router.replace("/dashboard");
        }
      }
    };

    completeSignup();
  }, [status, session, router, update, processing]);

  return (
    <div className="min-h-svh flex flex-col items-center justify-center text-center">
      <div className="animate-pulse space-y-4">
        <div className="h-12 w-12 bg-primary/20 rounded-full mx-auto"></div>
        <p className="text-lg font-medium">Completing your setup...</p>
      </div>
    </div>
  );
}
