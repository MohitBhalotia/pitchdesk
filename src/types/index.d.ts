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
    resetPasswordTokenExpiry: Date | null;
    role: "founder" | "vc" | null;
    userPlan: "free" | "starter" | "professional" | "enterprise";
    company: mongoose.Schema.Types.ObjectId | null;
    provider: "credentials" | "google";
    signupStep2Done: boolean;
  }

  export interface Company extends Document {
    companyName: string;
    websiteUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Pitch extends Document {
    userId: mongoose.Schema.Types.ObjectId | null;
    recordingUrl: string | null;
    duration: number;
    conversationHistory: Message[];
  }

  // export interface Conversation {
  //   conversationDate: Date;
  //   messages: Message[];
  //   Duration: number
  // }

  export interface Message {
    role: "user" | "bot";
    content: string;
    timestamp: Date
  }

}


