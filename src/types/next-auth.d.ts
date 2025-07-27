import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    fullName?: string;
    email?: string;
    isVerified?: boolean;
    role?: "founder" | "vc" | null;
    userPlan?: "free" | "starter" | "professional" | "enterprise";
    provider?: "google" | "credentials";
  }
  interface Session {
    user: {
      _id?: string;
      fullName?: string;
      email?: string;
      isVerified?: boolean;
      role?: "founder" | "vc" | null;
      userPlan?: "free" | "starter" | "professional" | "enterprise";
      provider?: "google" | "credentials";
    } & DefaultSession["user"];
  }
}

// Another method
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    fullName?: string;
    email?:string
    isVerified?: boolean;
    role?:"founder"|"vc"|null;
    userPlan?: "free" | "starter" | "professional" | "enterprise";
    provider?:"google"|"credentials"
  }
}
