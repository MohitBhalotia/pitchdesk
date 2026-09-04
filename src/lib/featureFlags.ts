/**
 * Global kill switch for the pitch-room feature (plans/RAG_feature.md).
 * While disabled, room routes/UI must not be reachable and the generic
 * pitch flow is the only path — this is the Phase 0 safety net every later
 * phase builds behind.
 */
export function isPitchRoomsEnabled(): boolean {
  return process.env.PITCH_ROOMS_ENABLED === "true";
}

/**
 * Client-safe mirror of the same flag, for UI that decides in the browser
 * (nav links, redirects) whether to show the room experience at all — the
 * actual security boundary is always the server-side check above (every
 * `/api/pitch-rooms/*` route and `middleware.ts` re-check it). Keep both
 * env vars in sync when flipping this feature on.
 */
export function isPitchRoomsEnabledClient(): boolean {
  return process.env.NEXT_PUBLIC_PITCH_ROOMS_ENABLED === "true";
}

/**
 * Independent kill switches (Phase 5, Section 5) layered under the master
 * `PITCH_ROOMS_ENABLED` flag — each defaults to "on" once the feature is on
 * overall, but can be individually flipped off without touching the others.
 * Lets ops kill just live room tools (say, a runaway OpenAI/Atlas cost or a
 * bad retrieval regression) without also blocking room creation, or pause
 * new ingestion during a provider outage without booting founders out of
 * live sessions that don't need it.
 */
export function isRoomCreationEnabled(): boolean {
  return isPitchRoomsEnabled() && process.env.PITCH_ROOM_CREATION_ENABLED !== "false";
}

export function isRoomIngestionEnabled(): boolean {
  return isPitchRoomsEnabled() && process.env.PITCH_ROOM_INGESTION_ENABLED !== "false";
}

export function isRoomToolsEnabled(): boolean {
  return isPitchRoomsEnabled() && process.env.PITCH_ROOM_TOOLS_ENABLED !== "false";
}

/**
 * Staged-rollout percentage gate (Section 5: internal accounts -> small
 * cohort -> 10% beta -> all founder accounts). `PITCH_ROOMS_ROLLOUT_PERCENT`
 * defaults to 100 (everyone who passes the flags above) when unset; a
 * founder is deterministically bucketed by their own userId, so the same
 * user's access doesn't flip between requests as the percentage is dialed
 * up, and a lower percentage is always a strict subset of a higher one.
 */
export function isPitchRoomsEnabledForUser(userId: string): boolean {
  if (!isPitchRoomsEnabled()) return false;

  const raw = process.env.PITCH_ROOMS_ROLLOUT_PERCENT;
  if (!raw) return true;

  const percent = Number(raw);
  if (!Number.isFinite(percent) || percent >= 100) return true;
  if (percent <= 0) return false;

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return hash % 100 < percent;
}
