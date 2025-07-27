import { Document } from "mongoose";
declare global {
  export interface User extends Document {
    fullName: string;
    email: string;
    password: string;
    profileImage?: string;
    isVerified: boolean;
    verificationCode: string | null;
    verificationExpiry: Date | null;
    resetPasswordToken: string | null;
    role: "founder" | "vc" | null;
    userPlan: "free" | "starter" | "professional" | "enterprise";
    company: moongose.Schema.Types.ObjectId | null;
    provider: "credentials" | "google";
  }

  export interface Company extends Document {
    companyName: string;
    websiteUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }
}
