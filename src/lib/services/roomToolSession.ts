import { SignJWT, jwtVerify, errors as joseErrors } from "jose";
import mongoose from "mongoose";
import RoomToolSessionModel from "@/models/RoomToolSessionModel";
import { cacheGet, cacheSet } from "@/lib/redis";
import { logMetric } from "@/lib/observability/metrics";

/**
 * Signing/verification for the short-lived room-session token that Deepgram
 * carries on every server-side tool call (plans/RAG_feature.md Section 2 &
 * 4). Tool arguments never carry userId/roomId/knowledgeBaseId -- those come
 * only from this token, verified against a `RoomToolSession` Mongo record
 * with a Redis validation cache in front of it.
 */

function getSecretKey(): Uint8Array {
  const secret = process.env.ROOM_SESSION_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ROOM_SESSION_TOKEN_SECRET is not configured");
  }
  return new TextEncoder().encode(secret);
}

export interface RoomToolSessionScope {
  sessionId: string;
  userId: string;
  roomId: string;
  pitchId: string;
  agentId: string;
  knowledgeBaseId: string | null;
  knowledgeBaseRevision: number;
  expiresAt: Date;
}

export interface CreateRoomToolSessionInput {
  userId: string;
  roomId: string;
  pitchId: string;
  agentId: string;
  knowledgeBaseId: string | null;
  knowledgeBaseRevision: number;
  /** How long the token (and its backing record) stay valid. */
  ttlSeconds: number;
}

const MIN_TTL_SECONDS = 60;
// Hard ceiling independent of a session's claimed remaining time -- a forged
// or stale remainingTime can never mint a token that outlives a normal pitch.
const MAX_TTL_SECONDS = 3 * 60 * 60;

export async function createRoomToolSession({
  userId,
  roomId,
  pitchId,
  agentId,
  knowledgeBaseId,
  knowledgeBaseRevision,
  ttlSeconds,
}: CreateRoomToolSessionInput): Promise<{ token: string; expiresAt: Date; sessionId: string }> {
  const clampedTtl = Math.min(Math.max(ttlSeconds, MIN_TTL_SECONDS), MAX_TTL_SECONDS);
  const expiresAt = new Date(Date.now() + clampedTtl * 1000);

  const record = await RoomToolSessionModel.create({
    userId,
    roomId,
    pitchId,
    agentId,
    knowledgeBaseId,
    knowledgeBaseRevision,
    expiresAt,
  });

  const sessionId = String(record._id);
  const token = await new SignJWT({
    uid: userId,
    rid: roomId,
    pid: pitchId,
    aid: agentId,
    kbid: knowledgeBaseId,
    kbrev: knowledgeBaseRevision,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sessionId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getSecretKey());

  return { token, expiresAt, sessionId };
}

function cacheKeyForSession(sessionId: string): string {
  return `roomtoolsession:${sessionId}`;
}

/**
 * Verifies signature + expiry, then confirms the backing record is still
 * valid (not revoked, not expired server-side) -- caching that confirmation
 * for the remainder of the token's life so a normal voice session's tool
 * calls don't each cost a Mongo round trip. Returns null for any failure;
 * callers must treat null as "respond not-found", never throw into the
 * Deepgram tool-call path.
 */
export async function verifyRoomToolSessionToken(
  token: string
): Promise<RoomToolSessionScope | null> {
  let sessionId: string;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (!payload.sub) return null;
    sessionId = payload.sub;
  } catch (error) {
    if (
      !(error instanceof joseErrors.JWTExpired) &&
      !(error instanceof joseErrors.JWSSignatureVerificationFailed)
    ) {
      console.error("Room tool session token verification failed:", error);
    }
    return null;
  }

  const cached = await cacheGet(cacheKeyForSession(sessionId));
  if (cached) {
    try {
      const scope = JSON.parse(cached) as RoomToolSessionScope;
      if (new Date(scope.expiresAt).getTime() > Date.now()) {
        logMetric("cache_lookup", { cacheType: "room_tool_session", hit: true });
        return scope;
      }
    } catch {
      // fall through to a fresh Mongo lookup
    }
  }
  logMetric("cache_lookup", { cacheType: "room_tool_session", hit: false });

  if (!mongoose.Types.ObjectId.isValid(sessionId)) return null;
  const record = await RoomToolSessionModel.findById(sessionId).lean();
  if (!record || record.revoked || record.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  const scope: RoomToolSessionScope = {
    sessionId,
    userId: String(record.userId),
    roomId: String(record.roomId),
    pitchId: String(record.pitchId),
    agentId: String(record.agentId),
    knowledgeBaseId: record.knowledgeBaseId ? String(record.knowledgeBaseId) : null,
    knowledgeBaseRevision: record.knowledgeBaseRevision,
    expiresAt: record.expiresAt,
  };

  const ttlSeconds = Math.max(1, Math.floor((record.expiresAt.getTime() - Date.now()) / 1000));
  await cacheSet(cacheKeyForSession(sessionId), JSON.stringify(scope), ttlSeconds);

  return scope;
}

/** Circuit-breaker threshold (Section 2): 3 consecutive failures short-circuits the rest of the session. */
export const CIRCUIT_BREAKER_THRESHOLD = 3;

function failureCacheKey(sessionId: string): string {
  return `roomtoolsession:failures:${sessionId}`;
}

/**
 * Reads the current consecutive-failure count for a session. Redis-first for
 * latency, falling back to the Mongo record when the cache is cold or Redis
 * is unavailable -- never a hard dependency (Section 4).
 */
export async function getConsecutiveFailures(sessionId: string): Promise<number> {
  const cached = await cacheGet(failureCacheKey(sessionId));
  if (cached !== null) {
    const parsed = Number(cached);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (!mongoose.Types.ObjectId.isValid(sessionId)) return 0;
  const record = await RoomToolSessionModel.findById(sessionId).select("consecutiveFailures").lean();
  return record?.consecutiveFailures ?? 0;
}

/**
 * Records the outcome of one tool call: a failure increments the breaker
 * (capped to avoid unbounded counters), a success resets it to zero. The
 * Mongo write happens too (fire-and-forget from the caller's perspective is
 * fine here since neither the breaker nor the response depends on it
 * completing), keeping the record honest for anything inspecting it later.
 */
export async function recordToolCallOutcome(
  scope: RoomToolSessionScope,
  success: boolean
): Promise<void> {
  const ttlSeconds = Math.max(1, Math.floor((scope.expiresAt.getTime() - Date.now()) / 1000));

  if (success) {
    await cacheSet(failureCacheKey(scope.sessionId), "0", ttlSeconds);
    await RoomToolSessionModel.updateOne(
      { _id: scope.sessionId },
      { $set: { consecutiveFailures: 0 }, $inc: { callCount: 1 } }
    );
    return;
  }

  const current = await getConsecutiveFailures(scope.sessionId);
  const next = Math.min(current + 1, CIRCUIT_BREAKER_THRESHOLD);
  await cacheSet(failureCacheKey(scope.sessionId), String(next), ttlSeconds);
  await RoomToolSessionModel.updateOne(
    { _id: scope.sessionId },
    { $set: { consecutiveFailures: next }, $inc: { callCount: 1 } }
  );
}
