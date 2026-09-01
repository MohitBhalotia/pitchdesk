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
