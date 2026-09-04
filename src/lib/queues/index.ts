import { Queue } from "bullmq";
import { createQueueConnection } from "./connection";
import { QUEUE_NAMES, defaultJobOptions, type QueueName } from "./queueNames";

const queues = new Map<QueueName, Queue>();

function getQueue(name: QueueName): Queue {
  let queue = queues.get(name);
  if (!queue) {
    queue = new Queue(name, {
      connection: createQueueConnection(),
      defaultJobOptions,
    });
    queues.set(name, queue);
  }
  return queue;
}

// --- ingest-source ---------------------------------------------------------
// Job data/consumer implemented in Phase 2 alongside the KnowledgeSource model.
export interface IngestSourceJobData {
  sourceId: string;
  revision: number;
}

export function enqueueIngestSource(data: IngestSourceJobData) {
  return getQueue(QUEUE_NAMES.INGEST_SOURCE).add(QUEUE_NAMES.INGEST_SOURCE, data, {
    jobId: `ingest:${data.sourceId}:${data.revision}`,
  });
}

// --- generate-room-memory ---------------------------------------------------
// Job data/consumer implemented in Phase 4 alongside the RoomMemory model.
export interface GenerateRoomMemoryJobData {
  pitchId: string;
}

export function enqueueGenerateRoomMemory(data: GenerateRoomMemoryJobData) {
  return getQueue(QUEUE_NAMES.GENERATE_ROOM_MEMORY).add(
    QUEUE_NAMES.GENERATE_ROOM_MEMORY,
    data,
    { jobId: `memory:${data.pitchId}` }
  );
}

// --- regenerate-room-memory-digest ------------------------------------------
export interface RegenerateRoomMemoryDigestJobData {
  roomId: string;
  version: number;
}

export function enqueueRegenerateRoomMemoryDigest(
  data: RegenerateRoomMemoryDigestJobData
) {
  return getQueue(QUEUE_NAMES.REGENERATE_ROOM_MEMORY_DIGEST).add(
    QUEUE_NAMES.REGENERATE_ROOM_MEMORY_DIGEST,
    data,
    { jobId: `digest:${data.roomId}:${data.version}` }
  );
}

// --- recover-abandoned-room-pitch -------------------------------------------
export interface RecoverAbandonedRoomPitchJobData {
  pitchId: string;
}

export function enqueueRecoverAbandonedRoomPitch(
  data: RecoverAbandonedRoomPitchJobData
) {
  return getQueue(QUEUE_NAMES.RECOVER_ABANDONED_ROOM_PITCH).add(
    QUEUE_NAMES.RECOVER_ABANDONED_ROOM_PITCH,
    data,
    { jobId: `recover:${data.pitchId}` }
  );
}

// --- eval-sample-async -------------------------------------------------------
// Fire-and-forget from a live tool call — callers must never await this.
// Job data / consumer implemented in Phase 5 (src/lib/rag/toolHandler.ts
// samples ~1% of search_knowledge_base calls; worker/src/eval scores them
// offline). `query`/`resultText` live here in queued Redis data for the
// worker's LLM-judge to score against — never written to console/log output
// (Section 5's "never log document bodies/passages/prompts" rule is about
// logs, not this legitimate, access-scoped evaluation pipeline).
export interface EvalSampleAsyncJobData {
  callId: string;
  toolName: string;
  roomId: string;
  query: string;
  resultText: string;
  found: boolean;
}

export function enqueueEvalSampleAsync(data: EvalSampleAsyncJobData) {
  return getQueue(QUEUE_NAMES.EVAL_SAMPLE_ASYNC).add(
    QUEUE_NAMES.EVAL_SAMPLE_ASYNC,
    data,
    { jobId: `evalsample:${data.callId}` }
  );
}

export { QUEUE_NAMES };
