import mongoose, { Model, Schema } from "mongoose";

/**
 * Mandatory metadata block from plans/RAG_feature.md Section 2. Every
 * retrieval query filters on userId + roomId + knowledgeBaseId as hard,
 * non-optional predicates — this is what guarantees one room's agent can
 * never retrieve another room's (or another user's) chunks.
 */
const KnowledgeChunkSchema = new Schema<KnowledgeChunk>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "PitchRoom", required: true },
    knowledgeBaseId: {
      type: Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      required: true,
    },
    knowledgeBaseRevision: { type: Number, required: true },
    sourceId: { type: Schema.Types.ObjectId, ref: "KnowledgeSource", required: true },
    sourceType: { type: String, enum: ["file", "pasted_text"], required: true },
    elementType: {
      type: String,
      enum: ["heading", "paragraph", "table", "chart", "image_caption"],
      required: true,
    },
    locator: { type: String, default: null },
    chunkIndex: { type: Number, required: true },
    tokenCount: { type: Number, required: true },
    text: { type: String, required: true },
    embedding: { type: [Number], required: true },
    embeddingModel: { type: String, required: true },
    embeddingModelVersion: { type: String, required: true },
    contentHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Every retrieval query filters on this triple first — see module docblock.
KnowledgeChunkSchema.index({ userId: 1, roomId: 1, knowledgeBaseId: 1 });
KnowledgeChunkSchema.index({ sourceId: 1 });

const KnowledgeChunkModel: Model<KnowledgeChunk> =
  mongoose.models.KnowledgeChunk ||
  mongoose.model<KnowledgeChunk>("KnowledgeChunk", KnowledgeChunkSchema);

export default KnowledgeChunkModel;
