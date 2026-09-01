# RAG Feature — Phase Progress

Tracking implementation of `plans/RAG_feature.md`. Update this file at the end of every phase.

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Safety Foundation & Infra Scaffolding | ✅ Done | completed 2026-09-02 |
| Phase 1 — Pitch Room Product Shell | ⬜ Not started | |
| Phase 2 — Knowledge Base Ingestion | ⬜ Not started | |
| Phase 3 — Room Voice Agent & Live RAG | ⬜ Not started | |
| Phase 4 — Persistent Room Memory | ⬜ Not started | |
| Phase 5 — Quality, Observability, Eval, Rollout | ⬜ Not started | |

## Phase 0 checklist

- [x] `PITCH_ROOMS_ENABLED` global feature flag — `src/lib/featureFlags.ts`
- [x] Auth hardening: `start-pitch` and `authenticate` derive user from NextAuth session (reject body/session mismatch) — `src/lib/services/authGuard.ts`
- [x] Shared pitch services: extracted pitch-creation (`src/lib/services/pitchSession.ts`) and credit-deduction (`src/lib/services/pitchCredits.ts`) logic out of `start-pitch`/`end-pitch`/Inngest `updatePitch`, which previously had two independently-maintained copies of the same branching logic
- [x] Split voice/session config: `src/lib/voiceConfig/genericAgentSettings.ts` (extracted verbatim from `stsConfig`, output unchanged) + `src/lib/voiceConfig/roomAgentSettings.server.ts` (throws "not implemented" stub, real logic lands in Phase 3)
- [x] Atlas vector/text index definitions (`scripts/atlas/indexDefinitions.ts`) + deployment-time readiness check (`scripts/atlas/check-atlas-indexes.ts`, run via `npm run atlas:check-indexes`)
- [x] `worker/` scaffold (`worker/src/index.ts`, `worker/Dockerfile`, root `docker-compose.yml` with a `redis` service), `bullmq`/`ioredis`/`openai`/`jose` added as dependencies, `src/lib/redis.ts` (cache client with graceful fallback), `src/lib/queues/*` (BullMQ producer definitions for all 5 Section-4 queues)
- [x] Regression tests — introduced Vitest (`npm test`), 19 tests across 4 files covering the generic Settings builder, both shared services, and the auth guard
- [x] Exit check: `npx tsc --noEmit`, `npm run lint`, `npm test`, and `npm run build` all pass clean

## Behavior changes made along the way (not silent — flagging explicitly)

1. **`start-pitch` and `/api/authenticate` now require a valid NextAuth session.** A request with no session gets 401; a session whose user doesn't match a supplied body `userId` gets 403. Previously both endpoints trusted the body `userId` outright — this was the exact gap Phase 0 named. Any legitimate logged-in client is unaffected since the frontend already sends the real session's user.
2. **Converged an inconsistency between `end-pitch` and Inngest's `updatePitch`** that existed before this refactor: `end-pitch` silently no-opped when an incubation pitch had no matching `IncubationParticipant` record, while Inngest's version returned a hard failure for the same case. The shared `deductPitchCredits` now always throws `INCUBATION_PARTICIPANT_NOT_FOUND` (the stricter of the two), so both paths agree.
3. **Inngest's periodic `update-pitch` (fired every 10s during an active session) no longer requires a `UserPlan` document to exist for competition/incubation pitches.** The old code fetched and required a `userPlanModel` row up front for every pitch type, even though competition/incubation deductions don't touch it. The shared function now only requires one where it's actually used (plain practice pitches, and the practice-competition branch) — matching `end-pitch`'s always-worked behavior, which governs session-ending and is authoritative for credits.

None of these change what a normal, currently-logged-in founder experiences; they close a real trust gap and remove a real inconsistency. Flagging in case anything downstream (e.g. a saved test account with a stale session) surfaces an edge case.

## Not done in Phase 0 (deliberately out of the named scope)

- `GET /api/agents` (`src/app/api/(console)/agents/route.ts`) still returns a full `Agent` document — including `systemPrompt` — to any caller who knows an `agentId`, no auth check at all. This is a real pre-existing gap, but Phase 0's plan text names only `start-pitch` and the Deepgram token endpoint. Left untouched; worth a explicit decision from the user on whether to fix it (and whether room-agent prompts must never be served from this route once Phase 1 adds them).

## Decisions / assumptions made without asking (flag if wrong)

- No test framework existed in the repo. Added **Vitest** (lightweight, TS-native, no extra config vs Jest) rather than a manual checklist, since the plan's own acceptance criteria (Section 8) assume automated regression coverage.
- Worker is added to the **same npm project** (no separate `worker/package.json`) and run via `tsx` (already a devDependency) instead of a compiled build step — this is what lets it `import` `src/models/*` directly with zero schema duplication, per the plan's explicit requirement. Docker just runs `npx tsx worker/src/index.ts` from the repo root.
- Atlas index *definitions* are written now (JSON + a readiness-check script) but reference the `KnowledgeChunk`/`StartupFact` collections that are only actually created in Phase 2 — the script will correctly report "missing" until Phase 2 ships, which is expected and intentional for a deploy-time gate that turns green later.
- Did not touch `src/app/api/(console)/agents/route.ts` (`GET /api/agents`) even though it returns a full `Agent` document — including `systemPrompt` — to any unauthenticated caller who knows an `agentId`. This is a real pre-existing gap but it's outside Phase 0's explicitly named scope (only `start-pitch` and the Deepgram token endpoint are named). Flagged for the user to decide whether to fix separately.
