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
    // Phase 4: the compact cross-session digest injected into future room
    // prompts. `memoryDigestVersion` bumps on every regeneration -- used as
    // the BullMQ job-dedup key (`digest:{roomId}:{version}`) and as the
    // Redis memory-digest cache's invalidation signal.
    memoryDigest?: string | null;
    memoryDigestVersion: number;
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
    // Pitch-room fields (plans/RAG_feature.md Phase 3, Section 6). Unset on
    // every pre-existing/generic pitch -- absence means "generic", no
    // migration required.
    pitchRoomId?: mongoose.Schema.Types.ObjectId | null;
    pitchMode?: "generic" | "room";
    roomName?: string | null;
    agentName?: string | null;
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

  /**
   * One bounded, structured memory per completed room pitch
   * (plans/RAG_feature.md Phase 4). Never stores the transcript -- only a
   * searchable summary plus its embedding, categorized into what future
   * sessions actually need to recall. Unique on (roomId, pitchId) so a
   * retried `generate-room-memory` job can never create a duplicate.
   */
  export interface RoomMemory extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    pitchId: mongoose.Schema.Types.ObjectId;
    founderClaims: string[];
    weaknesses: string[];
    decisions: string[];
    newFacts: string[];
    recurringDifficulties: string[];
    /** Bounded (~1,500 char) text combining the categories above -- what gets embedded. */
    summaryText: string;
    embedding: number[];
    embeddingModel: string;
    embeddingModelVersion: string;
    createdAt: Date;
    updatedAt: Date;
  }

  /**
   * Scope record backing a signed, short-lived room-session token (Section 4
   * & 6). Tool-call routes verify the bearer token's signature/expiry, then
   * check this record isn't revoked -- the Redis validation cache in front
   * of it exists purely for latency, never as the source of truth.
   */
  export interface RoomToolSession extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    roomId: mongoose.Schema.Types.ObjectId;
    pitchId: mongoose.Schema.Types.ObjectId;
    agentId: mongoose.Schema.Types.ObjectId;
    knowledgeBaseId: mongoose.Schema.Types.ObjectId | null;
    knowledgeBaseRevision: number;
    expiresAt: Date;
    revoked: boolean;
    // Circuit breaker (Section 2): consecutive tool-call failures within this
    // session. Reset to 0 on any successful call; at 3, callers short-circuit
    // to "not found" without touching Mongo/OpenAI for the rest of the session.
    consecutiveFailures: number;
    callCount: number;
    createdAt: Date;
    updatedAt: Date;
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

