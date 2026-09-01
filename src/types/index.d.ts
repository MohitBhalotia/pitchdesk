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
    userPlan: "free" | "standard" | "pro" | "enterprise" | "mini";
    company: mongoose.Schema.Types.ObjectId | null;
    provider: "credentials" | "google";
    signupStep2Done: boolean;
    pitchSequence: number;
  }

  export interface PitchRoom extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    name: string;
    practiceFocus?: string | null;
    status: "active" | "archived";
    // Populated in Phase 2 once KnowledgeBase exists.
    knowledgeBaseId?: mongoose.Schema.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export type KnowledgeBaseStatus = "empty" | "processing" | "ready" | "failed";

  export interface KnowledgeBaseContradiction {
    metric: string;
    period?: string | null;
    factIds: mongoose.Schema.Types.ObjectId[];
    note: string;
  }

  export interface KnowledgeBase extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    status: KnowledgeBaseStatus;
    activeRevision: number;
    startupBrief: string | null;
    contradictions: KnowledgeBaseContradiction[];
    sourceCount: number;
    totalBytes: number;
    chunkCount: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export type KnowledgeSourceStage =
    | "uploading"
    | "queued"
    | "parsing"
    | "extracting"
    | "embedding"
    | "ready"
    | "failed"
    | "deleting";

  export type KnowledgeSourceType = "file" | "pasted_text";

  export interface KnowledgeSource extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    knowledgeBaseId: mongoose.Schema.Types.ObjectId;
    sourceType: KnowledgeSourceType;
    fileName?: string | null;
    fileType?: string | null;
    cloudinaryPublicId?: string | null;
    cloudinaryResourceType?: string | null;
    cloudinaryFormat?: string | null;
    cloudinaryBytes?: number | null;
    pastedText?: string | null;
    contentHash?: string | null;
    stage: KnowledgeSourceStage;
    revision: number;
    errorMessage?: string | null;
    pageCount?: number | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export type ChunkElementType = "heading" | "paragraph" | "table" | "chart" | "image_caption";

  export interface KnowledgeChunk extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    knowledgeBaseId: mongoose.Schema.Types.ObjectId;
    knowledgeBaseRevision: number;
    sourceId: mongoose.Schema.Types.ObjectId;
    sourceType: KnowledgeSourceType;
    elementType: ChunkElementType;
    locator?: string | null;
    chunkIndex: number;
    tokenCount: number;
    text: string;
    embedding: number[];
    embeddingModel: string;
    embeddingModelVersion: string;
    contentHash: string;
    createdAt: Date;
  }

  export type StartupFactValueType = "actual" | "projected" | "historical";
  export type StartupFactProvenance = "extracted" | "founder_correction";
  export type StartupFactStatus = "active" | "disabled";

  export interface StartupFact extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    knowledgeBaseId: mongoose.Schema.Types.ObjectId;
    metric: string;
    rawValue: string;
    numericValue: number | null;
    unit?: string | null;
    currency?: string | null;
    period?: string | null;
    valueType: StartupFactValueType;
    confidence: number;
    provenance: StartupFactProvenance;
    status: StartupFactStatus;
    sourceId?: mongoose.Schema.Types.ObjectId | null;
    locator?: string | null;
    supersedesFactId?: mongoose.Schema.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Company extends Document {
    companyName: string;
    websiteUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface PitchOverview {
    oneLiner?: string;
    problem?: string;
    solution?: string;
    market?: string;
    keyMetrics?: string;
    businessModel?: string;
    ask?: string;
    team?: string;
    strengths?: string[];
    concerns?: string[];
    analystTake?: string;
  }

  export interface Pitch extends Document {
    sessionId: string;
    userId: mongoose.Schema.Types.ObjectId | null;
    competitionId: mongoose.Schema.Types.ObjectId | null;
    incubationId: mongoose.Schema.Types.ObjectId | null;
    agentId: mongoose.Schema.Types.ObjectId | null;
    pitchNumber?: number;
    title: string
    lastUpdated: Date;
    startTime: Date;
    endTime: Date | null;
    duration?: number;
    conversationHistory?: Message[];
    creditsUsed?: number;
    overview?: PitchOverview;
  }

  interface Agent {
    name: string;
    voice: string;
    firstMessage: string;
    systemPrompt: string;
    image: string;
    agentKind?: "generic" | "pitch_room";
    slug?: string;
    description?: string;
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

  export interface IPlan extends Document {
    name: "free" | "standard" | "pro" | "enterprise" | "mini"
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

