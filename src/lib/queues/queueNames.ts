/**
 * The five BullMQ queues from Section 4 of plans/RAG_feature.md. All new
 * RAG/room async work goes here — existing app jobs (credit sync, email)
 * stay on Inngest, untouched.
 */
export const QUEUE_NAMES = {
  INGEST_SOURCE: "ingest-source",
  GENERATE_ROOM_MEMORY: "generate-room-memory",
  REGENERATE_ROOM_MEMORY_DIGEST: "regenerate-room-memory-digest",
  RECOVER_ABANDONED_ROOM_PITCH: "recover-abandoned-room-pitch",
  EVAL_SAMPLE_ASYNC: "eval-sample-async",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/**
 * Shared reliability defaults (Section 4): retries with exponential
 * backoff, and bounded Redis growth. A job whose failure can never succeed
 * (bad MIME, oversized file, etc.) should still short-circuit to `failed`
 * immediately — that's a per-job decision the worker's processor makes by
 * throwing a non-retryable error, not something configured here.
 */
export const defaultJobOptions = {
  attempts: 5,
  backoff: {
    type: "exponential" as const,
    delay: 5000,
  },
  removeOnComplete: { age: 24 * 60 * 60, count: 1000 },
  removeOnFail: { age: 7 * 24 * 60 * 60, count: 5000 },
};
