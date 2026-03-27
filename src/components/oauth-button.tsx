import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

interface OAuthButtonsProps {
  disabled?: boolean;
}

export default function OAuthButtons({ disabled = false }: OAuthButtonsProps) {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect");
  
  const handleGoogleSignIn = () => {
    // Store redirect URL in sessionStorage before OAuth redirect
    if (redirectUrl) {
      sessionStorage.setItem("authRedirect", redirectUrl);
    }
    
    // Store role in sessionStorage so it can be used after callback
    const role = searchParams?.get("role");
    if (role) {
      sessionStorage.setItem("authRole", role);
    }
    
    signIn("google", { callbackUrl: "/callBack" });
  };

  return (
    <div>
      <Button
        variant="outline"
        type="button"
        className="w-full flex justify-center"
        onClick={handleGoogleSignIn}
        disabled={disabled}
      >
        <span className="flex items-center gap-2">
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Continue with Google
        </span>
      </Button>
    </div>
  );
}
