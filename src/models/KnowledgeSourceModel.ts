import mongoose, { Model, Schema } from "mongoose";

export const SUPPORTED_FILE_TYPES = [
  "pdf",
  "ppt",
  "pptx",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "md",
  "png",
  "jpg",
  "jpeg",
] as const;

/**
 * One uploaded file or pasted-text block feeding a room's Knowledge Base.
 * `stage` is the source of truth for ingestion progress (Section 4) — BullMQ
 * job state is not authoritative, so a reconciliation sweep can always
 * re-derive what to do from this field alone.
 */
const KnowledgeSourceSchema = new Schema<KnowledgeSource>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "PitchRoom", required: true },
    knowledgeBaseId: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      required: true,
    },
    sourceType: {
      type: String,
      enum: ["file", "pasted_text"],
      required: true,
    },
    fileName: { type: String, default: null },
    fileType: { type: String, enum: [...SUPPORTED_FILE_TYPES, null], default: null },
    cloudinaryPublicId: { type: String, default: null },
    cloudinaryResourceType: { type: String, default: null },
    cloudinaryFormat: { type: String, default: null },
    cloudinaryBytes: { type: Number, default: null },
    pastedText: { type: String, default: null },
    contentHash: { type: String, default: null },
    stage: {
      type: String,
      enum: [
        "uploading",
        "queued",
        "parsing",
        "extracting",
        "embedding",
        "ready",
        "failed",
        "deleting",
      ],
      default: "uploading",
    },
    revision: { type: Number, default: 1 },
    errorMessage: { type: String, default: null },
    pageCount: { type: Number, default: null },
  },
  { timestamps: true }
);

KnowledgeSourceSchema.index({ roomId: 1, stage: 1 });
KnowledgeSourceSchema.index({ roomId: 1, contentHash: 1 });

const KnowledgeSourceModel: Model<KnowledgeSource> =
  mongoose.models.KnowledgeSource ||
  mongoose.model<KnowledgeSource>("KnowledgeSource", KnowledgeSourceSchema);

export default KnowledgeSourceModel;
