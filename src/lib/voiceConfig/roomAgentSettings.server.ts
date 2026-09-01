/**
 * Server-only counterpart to `genericAgentSettings.ts`. Will compose the
 * Deepgram Settings payload for a pitch-room session — static persona +
 * room operating rules + startup brief + practice focus + known metric
 * conflicts + memory digest, per Section 3 of plans/RAG_feature.md — and
 * attach the three read-only room tools. This must never run in the
 * browser: the composed prompt embeds per-room startup data and the signed
 * room-session token.
 *
 * Scaffolded in Phase 0 so the generic and room builders are separate
 * modules from day one (the generic one must stay untouched); implemented
 * in Phase 3.
 */
export interface RoomAgentSettingsInput {
  roomId: string;
  agentId: string;
}

export function buildRoomAgentSettings(input: RoomAgentSettingsInput): never {
  void input;
  throw new Error("buildRoomAgentSettings is not implemented until Phase 3");
}
