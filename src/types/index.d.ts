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
    userPlan: "free" | "standard" | "pro" | "enterprise";
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
    sessionId: string;
    userId: mongoose.Schema.Types.ObjectId | null;
    lastUpdated: Date;
    startTime: Date;
    endTime: Date | null;
    duration?: number;
    conversationHistory?: Message[];
  }

  // export interface Conversation {
  //   conversationDate: Date;
  //   messages: Message[];
  //   Duration: number
  // }

  export interface Message {
    role: "user" | "bot";
    content: string;
    timestamp: string
  }

  export interface IPlan extends Document {
    name: "free" | "standard" | "pro" | "enterprise"
    amount: number
    pitchesTime: number // in minutes
    englishVCs: number
    hindiVCs: number
    capatalistConnecction: boolean
    priorityEmailSupport: boolean
    pitchAnalysis: boolean
    pitchImprovement: boolean
    personalisedPitch: boolean
  }

  export interface IUserPlan extends Document {
    userId: mongoose.Schema.Types.ObjectId 
    planId: mongoose.Schema.Types.ObjectId
    isActive: boolean
    pitchTimeRemaining: number
  }

  export interface IOrder extends Document {
    userId: mongoose.Schema.Types.ObjectId
    planId: mongoose.Schema.Types.ObjectId

    razorpayOrderId: string
    razorPaymentId?: string
    razorpaySignature?: string

    amount: number
    currency: string

    status: "created" | "paid" | "failed" | "pending"

    createdAt: Date
    updatedAt: Date
  }

  export interface IGeneratedPitchSchema extends Document {
    userId: mongoose.Schema.Types.ObjectId
    title: string
    pitch: string
    createdAt: Date
    updatedAt: Date
  }


}


