export interface PitchRoomSummary {
  _id: string;
  name: string;
  practiceFocus: string | null;
  status: "active" | "archived";
  knowledgeBaseId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoomAgentSummary {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  voice: string;
  firstMessage: string;
}

export type KnowledgeBaseStatus = "empty" | "processing" | "ready" | "failed";

export interface KnowledgeBaseSummary {
  status: KnowledgeBaseStatus;
  startupBrief?: string | null;
  contradictions?: { metric: string; period: string | null; note: string }[];
  sourceCount?: number;
  chunkCount?: number;
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

export interface KnowledgeSourceSummary {
  _id: string;
  sourceType: "file" | "pasted_text";
  fileName?: string | null;
  fileType?: string | null;
  stage: KnowledgeSourceStage;
  errorMessage?: string | null;
  createdAt: string;
}

export interface StartupFactSummary {
  _id: string;
  metric: string;
  rawValue: string;
  numericValue: number | null;
  unit?: string | null;
  currency?: string | null;
  period?: string | null;
  valueType: "actual" | "projected" | "historical";
  confidence: number;
  provenance: "extracted" | "founder_correction";
}
