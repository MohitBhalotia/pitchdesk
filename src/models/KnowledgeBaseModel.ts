import mongoose, { Model, Schema } from "mongoose";

/**
 * One lazy, one-to-one Knowledge Base per room (plans/RAG_feature.md
 * Section 9) — created the moment a room's first source is added, not at
 * room-creation time. `activeRevision` bumps on every successful re-publish
 * so retrieval caches (Section 4) know to invalidate.
 */
const ContradictionSchema = new Schema<KnowledgeBaseContradiction>(
  {
    metric: { type: String, required: true },
    period: { type: String, default: null },
    factIds: [{ type: Schema.Types.ObjectId, ref: "StartupFact" }],
    note: { type: String, required: true },
  },
  { _id: false }
);

const KnowledgeBaseSchema = new Schema<KnowledgeBase>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "PitchRoom", required: true, unique: true },
    status: {
      type: String,
      enum: ["empty", "processing", "ready", "failed"],
      default: "empty",
    },
    activeRevision: { type: Number, default: 0 },
    startupBrief: { type: String, default: null },
    contradictions: { type: [ContradictionSchema], default: [] },
    sourceCount: { type: Number, default: 0 },
    totalBytes: { type: Number, default: 0 },
    chunkCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const KnowledgeBaseModel: Model<KnowledgeBase> =
  mongoose.models.KnowledgeBase ||
  mongoose.model<KnowledgeBase>("KnowledgeBase", KnowledgeBaseSchema);

export default KnowledgeBaseModel;
