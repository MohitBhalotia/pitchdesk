import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function OAuthButtons() {
  return (
    <div>
      <Button
        variant="outline"
        type="button"
        className="w-full flex justify-center"
        onClick={() => signIn("google", { callbackUrl: "/callBack" })}
      >
        <span className="flex items-center gap-2">
          <Image src="/google.svg" alt="Google" width={20} height={20} />
          Continue with Google
        </span>
      </Button>
    </div>
  );
}
