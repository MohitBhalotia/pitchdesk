/**
 * Expected MongoDB Atlas Search / Vector Search indexes for the RAG feature
 * (plans/RAG_feature.md, Sections 2 and 6). These are declared now (Phase 0)
 * so `check-atlas-indexes.ts` can be wired into deploys immediately, even
 * though the `KnowledgeChunk` collection itself is only created in Phase 2 —
 * until then this script is expected to report every index as missing.
 *
 * Field names mirror the mandatory chunk metadata block in Section 2:
 * every retrieval query filters on userId + roomId + knowledgeBaseId as
 * hard predicates, so those three fields are indexed as filter/token fields
 * on both indexes to keep pre-filtering fast and tenant-isolated.
 */

export interface AtlasIndexDefinition {
  /** Mongoose default collection name (lowercase, pluralized model name). */
  collection: string;
  name: string;
  type: "vectorSearch" | "search";
  /** Human description shown in the readiness-check output. */
  description: string;
  definition: Record<string, unknown>;
}

export const expectedAtlasIndexes: AtlasIndexDefinition[] = [
  {
    collection: "knowledgechunks",
    name: "knowledge_chunks_vector_index",
    type: "vectorSearch",
    description:
      "Vector search over KnowledgeChunk.embedding (text-embedding-3-small, 1536 dims), pre-filtered by tenant.",
    definition: {
      fields: [
        {
          type: "vector",
          path: "embedding",
          numDimensions: 1536,
          similarity: "cosine",
        },
        { type: "filter", path: "userId" },
        { type: "filter", path: "roomId" },
        { type: "filter", path: "knowledgeBaseId" },
      ],
    },
  },
  {
    collection: "knowledgechunks",
    name: "knowledge_chunks_text_index",
    type: "search",
    description:
      "Full-text search over KnowledgeChunk.text, run in parallel with vector search and fused in application code.",
    definition: {
      mappings: {
        dynamic: false,
        fields: {
          text: { type: "string" },
          userId: { type: "token" },
          roomId: { type: "token" },
          knowledgeBaseId: { type: "token" },
        },
      },
    },
  },
  {
    collection: "roommemories",
    name: "room_memories_vector_index",
    type: "vectorSearch",
    description:
      "Vector search over RoomMemory's bounded summary embedding, used by search_previous_pitch_memory.",
    definition: {
      fields: [
        {
          type: "vector",
          path: "embedding",
          numDimensions: 1536,
          similarity: "cosine",
        },
        { type: "filter", path: "userId" },
        { type: "filter", path: "roomId" },
      ],
    },
  },
];
