import StartupFactModel from "@/models/StartupFactModel";
import KnowledgeBaseModel from "@/models/KnowledgeBaseModel";
import { detectFactConflicts } from "@/lib/ingestion/factConflicts";
import { getOwnedRoom } from "./pitchRooms";

export class StartupFactError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "StartupFactError";
    this.status = status;
  }
}

export async function listFactsForRoom(userId: string, roomId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) return null;
  return StartupFactModel.find({ roomId, status: "active" })
    .sort({ metric: 1, period: 1 })
    .lean();
}

async function refreshContradictions(roomId: string, knowledgeBaseId: string) {
  const facts = await StartupFactModel.find({ roomId, status: "active" }).lean();
  const contradictions = detectFactConflicts(facts);
  await KnowledgeBaseModel.updateOne({ _id: knowledgeBaseId }, { $set: { contradictions } });
}

async function findOwnedFact(userId: string, roomId: string, factId: string) {
  const room = await getOwnedRoom(userId, roomId);
  if (!room) {
    throw new StartupFactError("Pitch room not found", 404);
  }
  const fact = await StartupFactModel.findOne({ _id: factId, roomId, userId });
  if (!fact) {
    throw new StartupFactError("Fact not found", 404);
  }
  return fact;
}

/** Confirming raises confidence to 1 -- the founder has vouched for it directly. */
export async function confirmFact(userId: string, roomId: string, factId: string) {
  const fact = await findOwnedFact(userId, roomId, factId);
  fact.status = "active";
  fact.confidence = 1;
  await fact.save();
  return fact;
}

export async function disableFact(userId: string, roomId: string, factId: string) {
  const fact = await findOwnedFact(userId, roomId, factId);
  fact.status = "disabled";
  await fact.save();
  await refreshContradictions(roomId, String(fact.knowledgeBaseId));
  return fact;
}

export interface CorrectFactInput {
  rawValue: string;
  numericValue?: number | null;
  unit?: string | null;
  currency?: string | null;
  period?: string | null;
  valueType?: StartupFactValueType;
}

/**
 * A correction never overwrites the original evidence -- it disables the
 * original (kept, for audit) and creates a new fact with provenance
 * "founder_correction" that supersedes it.
 */
export async function correctFact(
  userId: string,
  roomId: string,
  factId: string,
  correction: CorrectFactInput
) {
  const original = await findOwnedFact(userId, roomId, factId);
  if (!correction.rawValue?.trim()) {
    throw new StartupFactError("A corrected value is required", 400);
  }

  original.status = "disabled";
  await original.save();

  const corrected = await StartupFactModel.create({
    userId,
    roomId,
    knowledgeBaseId: original.knowledgeBaseId,
    metric: original.metric,
    rawValue: correction.rawValue.trim(),
    numericValue: correction.numericValue ?? null,
    unit: correction.unit ?? original.unit,
    currency: correction.currency ?? original.currency,
    period: correction.period ?? original.period,
    valueType: correction.valueType ?? original.valueType,
    confidence: 1,
    provenance: "founder_correction",
    status: "active",
    sourceId: original.sourceId,
    locator: original.locator,
    supersedesFactId: original._id,
  });

  await refreshContradictions(roomId, String(original.knowledgeBaseId));
  return corrected;
}
