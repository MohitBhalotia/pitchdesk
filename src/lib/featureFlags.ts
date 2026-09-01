/**
 * Global kill switch for the pitch-room feature (plans/RAG_feature.md).
 * While disabled, room routes/UI must not be reachable and the generic
 * pitch flow is the only path — this is the Phase 0 safety net every later
 * phase builds behind.
 */
export function isPitchRoomsEnabled(): boolean {
  return process.env.PITCH_ROOMS_ENABLED === "true";
}
