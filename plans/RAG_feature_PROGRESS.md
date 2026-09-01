# RAG Feature — Phase Progress

Tracking implementation of `plans/RAG_feature.md`. Update this file at the end of every phase.

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Safety Foundation & Infra Scaffolding | ✅ Done | completed 2026-09-02 |
| Phase 1 — Pitch Room Product Shell | ✅ Done | completed 2026-09-02 |
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

## Phase 1 checklist

- [x] Sidebar label: "Start pitch" → "Pitch Room" (`/pitch-rooms`) — only when `NEXT_PUBLIC_PITCH_ROOMS_ENABLED=true`; falls back to the existing "Start pitch" / `/start-a-pitch` link otherwise, so this is safe to ship with the flag off
- [x] `/start-a-pitch` → `/pitch-rooms` legacy redirect in `middleware.ts`, active only when `PITCH_ROOMS_ENABLED=true`; and the reverse guard (`/pitch-rooms` → `/start-a-pitch`) when the flag is off, so there's no dead route either way
- [x] `/pitch-rooms`: existing generic VC cards (`data/vc.ts` + `VCSummaryCard`) rendered unchanged, room cards above them sorted by most-recently-updated, create-room dialog that only asks for a name
- [x] `/pitch-rooms/[roomId]`: settings (name + practiceFocus, both editable), Knowledge Base / metrics / pitch-history sections with honest empty states (their real data models don't exist until Phase 2/3), agent-selection grid
- [x] Three fixed room agents authored and ready to seed via `npm run seed:room-agents` (idempotent, upserts by `slug`) — **not run against the DB yet, see below**
- [x] `Agent` model: added `agentKind` ("generic" | "pitch_room") and unique-sparse `slug`; `start-pitch/route.ts` now rejects `agentId`s that resolve to a `pitch_room` agent (400), closing the gap where a room agent could otherwise be used through the generic/competition/incubation flow
- [x] `PitchRoom` model + `src/lib/services/pitchRooms.ts` (list/create/get-owned/update/archive/restore), enforcing the Section 9 "5 rooms/user" limit and 404-not-403 on any room owned by someone else
- [x] `GET/POST /api/pitch-rooms`, `GET/PATCH/DELETE /api/pitch-rooms/[roomId]` (DELETE archives, never hard-deletes), `GET /api/pitch-rooms/agents` (excludes `systemPrompt` from the response) — all behind `isPitchRoomsEnabled()`, all returning 404 (not 403) for the disabled-feature and not-owned cases alike
- [x] Regression tests for the new `pitchRooms` service (12 new tests, 31 total); `tsc --noEmit`, lint, `npm test`, and `npm run build` all pass clean, including the two new page routes and three new API routes

**Action needed from you before this phase is actually live:** run `npm run seed:room-agents` (add `--dry-run` first if you want to preview) to create Maya Shah, Kabir Malhotra, and Neha Rao in the `Agent` collection, then set `PITCH_ROOMS_ENABLED=true` and `NEXT_PUBLIC_PITCH_ROOMS_ENABLED=true`. I did not run the seed script myself since it writes to whatever database `MONGO_URI` points to, and I didn't want to write to your database without you explicitly greenlighting it.

## Assumptions made without asking (flag if wrong)

- Voice assignment for the three room agents (all Deepgram Aura, no `vcId` — these are system agents, not VC-created bots, so they use the same TTS branch as other built-in agents): Maya Shah → `aura-asteria-en` (professional), Kabir Malhotra → `aura-orion-en` (masculine, confident), Neha Rao → `aura-luna-en` (conversational). Easy to change in `scripts/seed-room-agents.ts` and re-run — it's idempotent.
- Built three simple placeholder avatar SVGs (`public/room-agents/*.svg`, colored circle + initials) since no real artwork exists yet and the agent-selection grid needed something other than a broken image.
- The room detail page's Knowledge Base / metrics / pitch-history sections are intentionally inert placeholders — there is nothing to wire them to until Phase 2 (KnowledgeBase/StartupFact models) and Phase 3 (`Pitch.pitchRoomId`). The "Start pitch" button per agent is disabled until a room has a knowledge base, which means end-to-end room pitching genuinely does not work yet — that's expected; Phase 1's bar is CRUD + ownership + navigation + agent listing, not a working session.

## Not done in Phase 0 (deliberately out of the named scope)

- `GET /api/agents` (`src/app/api/(console)/agents/route.ts`) still returns a full `Agent` document — including `systemPrompt` — to any caller who knows an `agentId`, no auth check at all. This is a real pre-existing gap, but Phase 0's plan text names only `start-pitch` and the Deepgram token endpoint. Left untouched; worth a explicit decision from the user on whether to fix it (and whether room-agent prompts must never be served from this route once Phase 1 adds them).

## Decisions / assumptions made without asking (flag if wrong)

- No test framework existed in the repo. Added **Vitest** (lightweight, TS-native, no extra config vs Jest) rather than a manual checklist, since the plan's own acceptance criteria (Section 8) assume automated regression coverage.
- Worker is added to the **same npm project** (no separate `worker/package.json`) and run via `tsx` (already a devDependency) instead of a compiled build step — this is what lets it `import` `src/models/*` directly with zero schema duplication, per the plan's explicit requirement. Docker just runs `npx tsx worker/src/index.ts` from the repo root.
- Atlas index *definitions* are written now (JSON + a readiness-check script) but reference the `KnowledgeChunk`/`StartupFact` collections that are only actually created in Phase 2 — the script will correctly report "missing" until Phase 2 ships, which is expected and intentional for a deploy-time gate that turns green later.
- Did not touch `src/app/api/(console)/agents/route.ts` (`GET /api/agents`) even though it returns a full `Agent` document — including `systemPrompt` — to any unauthenticated caller who knows an `agentId`. This is a real pre-existing gap but it's outside Phase 0's explicitly named scope (only `start-pitch` and the Deepgram token endpoint are named). Flagged for the user to decide whether to fix separately.
