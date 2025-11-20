"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CallBackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Check if there's a stored redirect URL from OAuth flow
      const storedRedirect = sessionStorage.getItem("authRedirect");
      
      if (session.user.signupStep2Done) {
        if (storedRedirect) {
          sessionStorage.removeItem("authRedirect");
          router.replace(storedRedirect);
        } else {
          router.replace("/dashboard");
        }
      } else {
        // If user hasn't completed step 2, go to step 2 first
        // Store redirect URL to use after step 2 completion
        router.replace("/signup/step2");
      }
    }
  }, [status, session, router]);

  return (
    <div className="min-h-svh flex items-center justify-center text-center mt-10">
      Redirecting...
    </div>
  );
}
