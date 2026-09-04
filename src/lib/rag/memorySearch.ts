import mongoose from "mongoose";
import RoomMemoryModel from "@/models/RoomMemoryModel";
import { embedTexts } from "@/lib/ingestion/embedTexts";

/**
 * Live search backing the `search_previous_pitch_memory` Deepgram tool
 * (plans/RAG_feature.md Phase 4). Searches `RoomMemory` summaries via the
 * `room_memories_vector_index` Atlas index declared in Phase 0 -- never
 * transcript sentences. Filters on userId + roomId as hard predicates, same
 * tenant-isolation contract as knowledge-base retrieval.
 */

const VECTOR_INDEX = "room_memories_vector_index";
const RESULT_LIMIT = 3;
const MAX_OUTPUT_CHARS = 2000;

export interface MemorySearchScope {
  userId: string;
  roomId: string;
}

export interface RetrievedMemory {
  summaryText: string;
  createdAt: string;
}

interface RawMemoryHit {
  summaryText: string;
  createdAt: Date;
}

export async function searchPreviousPitchMemory(
  scope: MemorySearchScope,
  query: string
): Promise<RetrievedMemory[]> {
  const [queryVector] = await embedTexts([query]);

  let hits: RawMemoryHit[] = [];
  try {
    hits = await RoomMemoryModel.aggregate([
      {
        $vectorSearch: {
          index: VECTOR_INDEX,
          path: "embedding",
          queryVector,
          numCandidates: 50,
          limit: RESULT_LIMIT,
          filter: {
            $and: [
              { userId: new mongoose.Types.ObjectId(scope.userId) },
              { roomId: new mongoose.Types.ObjectId(scope.roomId) },
            ],
          },
        },
      },
      { $project: { summaryText: 1, createdAt: 1 } },
    ]);
  } catch (error) {
    console.error("Previous-pitch-memory vector search failed:", error);
    return [];
  }

  const results: RetrievedMemory[] = [];
  let totalChars = 0;
  for (const hit of hits) {
    if (totalChars >= MAX_OUTPUT_CHARS) break;
    const remaining = MAX_OUTPUT_CHARS - totalChars;
    const text = hit.summaryText.length > remaining ? `${hit.summaryText.slice(0, remaining)}...` : hit.summaryText;
    results.push({ summaryText: text, createdAt: new Date(hit.createdAt).toISOString() });
    totalChars += text.length;
  }
  return results;
}
