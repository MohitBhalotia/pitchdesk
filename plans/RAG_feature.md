# Pitch Rooms, Knowledge Base, and RAG-Powered VC Agents

## 1. Architecture Summary

PitchDesk currently sends microphone audio directly from the browser to Deepgram's Voice Agent WebSocket. Deepgram manages speech recognition, the OpenAI reasoning model, and voice generation. Pitch transcripts are periodically saved to MongoDB via a batched Inngest job. The new architecture extends this without replacing it, and adds two new pieces of infrastructure: a dedicated background-job worker and a Redis cache/queue store.

```
Generic VC session (UNCHANGED)
Browser → Existing Deepgram configuration → Existing pitch flow
         No room ID, no RAG tools, no startup context, flat pre-merged systemPrompt

Pitch Room session (NEW)
Browser → Deepgram Voice Agent
             ↓ server-side tool call (Next.js API route, live path — never the worker)
      PitchDesk room tool API
             ↓ reads: Mongo Atlas vector+text search, Redis cache (session token, retrieval cache)
   Structured facts + Atlas retrieval, tenant-filtered
             ↓
      Room-only context returned (≤1.2s p95)

Document ingestion / room memory (NEW, async, off the live path)
Next.js API route → validates + writes status record → enqueues BullMQ job
                                                            ↓
                                            Dedicated Node worker (VPS, Docker)
                                                            ↓
                              Unstructured parse → normalize → extract facts → chunk
                                                            ↓
                                      OpenAI embeddings (with Redis embedding cache)
                                                            ↓
                                   MongoDB Atlas text + vector indexes, tenant-scoped
                                                            ↓
                                            Publish Knowledge Base / Room Memory
```

Deepgram officially supports server-side function endpoints, so retrieval logic stays on PitchDesk's backend instead of exposing MongoDB logic to the browser ([Deepgram function calling](https://developers.deepgram.com/docs/voice-agents-function-calling)). Unstructured Auto routes simple PDF pages through fast extraction and complex pages through layout/OCR/vision processing ([Unstructured partitioning](https://docs.unstructured.io/concepts/partitioning)). Cloudinary files use authenticated/private raw delivery ([Cloudinary access control](https://cloudinary.com/documentation/control_access_to_media)).

**Two job systems, deliberately separated, not merged:**
- **Inngest** — stays exactly as-is for existing app jobs (pitch credit sync/batching, transactional email). Not touched, not migrated.
- **BullMQ + dedicated worker** (new) — all new RAG-heavy async work: document ingestion, room-memory generation, digest rebuilds, abandoned-session recovery, async eval sampling. These are long-running/bursty (OCR, embeddings) and benefit from a persistent worker without serverless execution-time limits, plus BullMQ's native retries/backoff/concurrency/dedup.

The dividing line: **if it's new RAG/room async work → BullMQ worker. If it's existing app behavior (credits, email) → stays on Inngest.** Live, latency-sensitive reads (tool calls, session-token checks) never go through either queue — they're synchronous Mongo/Redis reads from the Next.js API route itself.

## 2. RAG Pipeline Engineering Standards

This section is the "how we guarantee accuracy, speed, and isolation" contract that every ingestion/retrieval piece in Phases 2–4 must follow.

**Ingestion & chunking**
- Parse with Unstructured Auto; preserve headings, reading order, page/slide/sheet locations, tables, images, parser confidence.
- Normalize headers/footers, repeated slide furniture, whitespace, duplicate elements before chunking.
- Chunk by semantic section, not fixed characters: ~500–800 tokens, 80–120 overlap, tables/slide context kept intact (never split mid-table).
- Extract structured startup facts (ARR, MRR, CAC, LTV, burn, runway, valuation, etc.) via OpenAI Structured Outputs with evidence locations; store actual/projected/historical separately with period, unit, currency, confidence, and flag conflicts instead of silently picking one.

**Chunk & fact metadata (mandatory on every stored record) — this is what makes retrieval fast, accurate, and tenant-isolated:**
```
userId, roomId, knowledgeBaseId, knowledgeBaseRevision, sourceId,
sourceType, elementType (heading|paragraph|table|chart|image_caption),
pageOrSlideOrSheetLocator, chunkIndex, tokenCount,
embeddingModel, embeddingModelVersion, contentHash, createdAt
```
Every retrieval query filters on `userId + roomId + knowledgeBaseId` as hard, non-optional predicates — this is the mechanism that guarantees Room A's agent can never retrieve Room B's (or another user's) chunks, memories, or facts. Atlas vector search pre-filters on these fields ([Atlas vector filtering](https://www.mongodb.com/docs/search/query/operators-collectors/vectorSearch/)).

**Retrieval**
- Run vector search and full-text search in parallel; fuse results in application code (don't depend on Atlas 8-only fusion operators).
- Fetch ~20 candidates, dedupe, return at most 5–6 cited passages; cap tool output to ~3,500 characters.
- Prefer structured facts over prose for numerical questions.
- **No LLM reranker by default.** Only add one behind a flag if the offline eval harness (Section 7) shows a meaningful recall/precision gain — reranking adds latency and this feature is latency-sensitive by design.

**Tool-calling contract**
- Exactly three read-only Deepgram server-side tools: `search_knowledge_base(query)`, `get_startup_metrics(metric_names, optional_period)`, `search_previous_pitch_memory(query)`.
- Tool arguments never carry `userId`/`roomId`/`knowledgeBaseId` — those come only from a short-lived signed room-session token, verified against a `RoomToolSession` record (with a Redis cache in front, see Section 4).
- Strict Zod-validated input/output schemas per tool (zod is already a project dependency).
- Per-call timeout (2.5s) via `AbortController`; on timeout or empty results, return a safe structured "not found" so the agent asks the founder instead of inventing information — never let a tool call hang the voice session.
- Circuit breaker: if a room's tool calls fail repeatedly within a session (e.g., 3 consecutive failures), short-circuit to "not found" immediately for the rest of that session rather than retrying a failing dependency mid-conversation.

## 3. Room Agent Persona & Prompt Architecture

Today's generic flow (`vc/bots/route.ts` → flat `Agent.systemPrompt` → `stsConfig()` forwards verbatim) **stays completely unchanged**. Room agents need a second, new mechanism because part of their prompt is static (persona) and part changes every session (brief, memory, practice focus):

1. **Static base persona** — seeded once, same pattern as today: three fixed `Agent` documents (`agentKind: "pitch_room"`) with a pre-composed `systemPrompt` written specifically for a *recurring practice-room relationship* (aware it will see this founder across multiple sessions, encouraged to reference the knowledge base and tools). Stored and read exactly like existing agents — no new field type needed beyond `agentKind`/`slug`/`specialty`.
2. **Dynamic room-session composition (new)** — a new `buildRoomSessionPrompt()` function, analogous to but entirely separate from `stsConfig()`, invoked only at room-session start:
   ```
   agent.systemPrompt (static persona, unchanged read)
   + room operating rules & tool-use instructions (static template)
   + startup brief (per-KB, changes on ingestion)
   + practice focus (per-room, founder-editable)
   + known metric conflicts (per-KB)
   + memory digest (per-room, changes after each completed pitch — Phase 4)
   ```
   Assembled fresh each session, never written back onto `Agent.systemPrompt` — the agent document itself stays immutable per session. Deterministic section budgets keep the composed prompt under Deepgram's limit; the persona section is never truncated, only the dynamic sections are budgeted. Uploaded/retrieved content is always marked as untrusted reference data, never as instructions.

This gives the room flow prompt parity with the generic flow's "base + persona" spirit while acknowledging the generic flow has no runtime composition today and room agents genuinely need one.

## 4. Background Jobs, Queues & Caching Architecture

**Decision (confirmed with user): add a dedicated Node/TypeScript worker + self-hosted Redis, not tied to Vercel.**

- New `worker/` directory in the same repo (sibling to `src/` and `backend/`, same pattern as the existing Python `backend/`). It imports the existing Mongoose models directly from `src/models/*` (no schema duplication/drift) and connects to the same MongoDB Atlas cluster.
- Runs as a long-lived Node process in Docker on a VPS (docker-compose: `worker` service + `redis` service). `REDIS_URL` is a plain env var — no hosting lock-in; it can point at a VPS container, a managed Redis, or anywhere else.
- New deps: `bullmq`, `ioredis` (Node side, for both the API routes as producers and the worker as consumer), `openai`, `jose` (Deepgram/room-session token signing), plus a file-signature validation lib. Unstructured is called over HTTP — no SDK needed.
- Next.js API routes are **producers only** — they validate input, write an initial Mongo status record (`queued`), and call `queue.add(...)`. They never process ingestion/memory work inline. The worker is the sole consumer.
- **Mongo status fields remain the source of truth**, not BullMQ job state — if Redis is ever flushed, a reconciliation sweep can re-enqueue anything stuck `processing` past a timeout.

**Queues (all on the worker):**

| Queue | Trigger | Job key (dedup) | Notes |
|---|---|---|---|
| `ingest-source` | New/retried `KnowledgeSource` | `ingest:{sourceId}:{revision}` | Full Phase 2 pipeline; concurrency capped (e.g. 1 in-flight per room via a Mongo-level guard, plus a global cap to bound OpenAI/Unstructured cost) |
| `generate-room-memory` | `room.pitch.completed` (fired from existing `end-pitch`/Inngest flow, same trigger point as today) | `memory:{pitchId}` | LLM summarization + embedding of one completed pitch; unique room/pitch index prevents duplicates even across retries |
| `regenerate-room-memory-digest` | After a memory job completes, or a pitch/session is "forgotten" | `digest:{roomId}:{version}` | Rebuilds the compact digest injected into future prompts |
| `recover-abandoned-room-pitch` | Scheduled sweep | `recover:{pitchId}` | Catches room pitches with transcript data but no clean End Session |
| `eval-sample-async` | Fire-and-forget from a live tool call (Section 7) | `evalsample:{callId}` | Never awaited by the live request |

**Reliability config, applied to every queue (retries, concurrency, status, duplicacy):**
- Deterministic `jobId` per job (table above) — BullMQ rejects/no-ops duplicate `jobId`s, giving native dedup on top of the Mongo state machine.
- `attempts: 5` with exponential backoff (base 5s, cap ~5min); validation errors that can never succeed (bad MIME, oversized file) short-circuit to `failed` immediately instead of retrying.
- Per-queue concurrency limits tuned to protect OpenAI/Unstructured spend and keep one room's ingestion from starving others.
- `removeOnComplete`/`removeOnFail` with age/count limits so Redis doesn't grow unbounded.
- Source/memory status fields reuse the existing stage-based state machine style already implied by Phase 2 (`uploading → queued → parsing → extracting → embedding → ready/failed/deleting`), extended with the same shape for memory jobs (`pending → generating → ready/failed`).

**Caching (Redis, same instance, separate key namespace from BullMQ's own):**
- **Embedding cache** — key `sha256(text + model + version)`, avoids recomputation for duplicate chunk content and safely absorbs ingestion retries.
- **RoomToolSession validation cache** — TTL = token expiry; avoids a Mongo round-trip on every single live tool call, directly serving the ≤1.2s p95 latency target.
- **Retrieval-result cache** — short TTL (5–10 min), keyed by `roomId + knowledgeBaseRevision + queryHash`; auto-invalidated by revision bump on new ingestion.
- **Room memory digest cache** — keyed by `roomId + latestPitchId`; invalidated on new memory write.
- Every cache read has a graceful fallback to live Mongo/compute on miss or Redis-down — **cache is purely an optimization, never a correctness dependency.**
- **Explicitly not cached:** full LLM conversational turns/responses — those are live, personalized, and must stay real-time.

**Ops notes:** Redis persistence (AOF) enabled since BullMQ needs job durability; Redis bound to localhost/internal Docker network with `requirepass`, never exposed publicly; worker runs under Docker restart-policy/process manager; worker has its own env (`MONGODB_URI`, `REDIS_URL`, `OPENAI_API_KEY`, `CLOUDINARY_*`, `UNSTRUCTURED_API_KEY`). Optional Bull Board dashboard for queue observability in Phase 5.

## 5. Phased Delivery

### Phase 0 — Safety Foundation, Generic-Flow Baseline, and New Infra Scaffolding
- Add a global `PITCH_ROOMS_ENABLED` feature flag.
- Snapshot existing generic agent settings/prompts/voices/cards/start-session response/transcript flow/credit deduction/interruption behavior/evaluation flow for regression testing.
- Split voice configuration into the existing generic builder (unchanged output) and a new server-only room configuration builder.
- Refactor pitch creation/ending into shared server services so generic and room sessions use the same timing/credit rules.
- Harden `start-pitch`/Deepgram-token endpoints to derive the user from the NextAuth server session (today `start-pitch/route.ts` trusts a client-supplied `userId` directly — this is the specific gap to close). Client-supplied `userId` may be accepted temporarily but must match the authenticated user.
- Add Atlas vector/text index definitions and a deployment-time index readiness check.
- Scaffold the new `worker/` directory (Docker, docker-compose with a `redis` service, its own env), add `bullmq`, `ioredis`, `openai`, `jose` deps, and shared `src/lib/redis.ts` (cache client) + `src/lib/queues/*` (BullMQ producer definitions importable by both Next.js routes and the worker).
- Keep all Mongoose/Cloudinary/ingestion/retrieval work in the Node runtime; route handlers remain thin App Router adapters.

Exit condition: generic agent configuration/behavior pass regression tests, and the worker+Redis scaffolding boots and connects to Mongo/Redis, before any room feature is enabled.

### Phase 1 — Pitch Room Product Shell and Dedicated Agents
- Replace the founder sidebar label "Start Pitch" with "Pitch Room", linking to `/pitch-rooms`; redirect `/start-a-pitch` to `/pitch-rooms` for old bookmarks.
- Build `/pitch-rooms`: existing generic VC cards unchanged, custom room cards ordered by most recently updated, create-room dialog requiring only a room name.
- Build `/pitch-rooms/[roomId]`: Knowledge Base, room settings, extracted metrics, room pitch history, agent-selection sections. Optional editable `practiceFocus`.
- Seed three fixed room-only agents idempotently into the existing `Agent` collection, each with a persona authored per Section 3 (aware of the recurring room relationship):
  - Maya Shah — balanced strategic validator; feminine professional voice.
  - Kabir Malhotra — finance and metrics challenger; masculine confident voice.
  - Neha Rao — market, customer, and storytelling specialist; feminine conversational voice.
- Add `agentKind: "pitch_room"` and stable `slug` to `Agent`; room agents are not selectable for generic/competition/incubation sessions. Knowledge and memory attach to the room, not the individual agent — a founder can pick any of the three per session.
- Rooms without a ready Knowledge Base show "Create Knowledge Base"; room pitch start stays disabled until the first source is ready. Room deletion is a reversible archive; individual sources can be permanently removed.

Exit condition: room CRUD, ownership, dedicated agent selection, legacy redirect, and unchanged generic cards all work behind the feature flag.

### Phase 2 — Knowledge Base Ingestion
- One lazy, one-to-one Knowledge Base per room. Supported inputs: PDF, PPT/PPTX, DOC/DOCX, XLS/XLSX, CSV, TXT/Markdown, PNG/JPEG scans, pasted text up to 50,000 characters.
- Signed direct-to-Cloudinary uploads (avoid routing large files through a Vercel Function); authenticated/private folder; server-side asset verification before acceptance.
- Founder-facing API route validates + writes a `queued` `KnowledgeSource` record, then enqueues `ingest-source` on the new BullMQ worker (Section 4) — the route itself does no parsing/embedding work.
- Worker pipeline per Section 2's standards: validate (MIME signature, extension, quota, duplicate content hash) → parse with Unstructured Auto → normalize → extract structured facts (OpenAI Structured Outputs + evidence locations) → semantic chunk → embed in batches with `text-embedding-3-small` (checking the Redis embedding cache first) → build a concise startup brief → publish the Knowledge Base atomically.
- Track detailed source stages (`uploading, queued, parsing, extracting, embedding, ready, failed, deleting`); poll status every 3s while processing, then back off. Preserve the last ready Knowledge Base if a later source fails.
- Extract ARR, MRR, revenue, growth, CAC, LTV, users, burn, runway, valuation, funding ask, margins, churn, etc.; store actual/projected/historical separately with period/unit/currency/confidence/source/locator; flag conflicts rather than silently picking one. Founders can confirm/correct/disable an extracted fact — corrections become audited high-priority facts and never overwrite original source evidence.

Exit condition: supported documents and pasted text reliably produce searchable chunks, a startup brief, structured facts, citations, and visible processing/error states, with all heavy work running on the worker (not inline in a Next.js route).

### Phase 3 — Room Voice Agent and Live RAG
- Room session endpoint: `POST /api/pitch-rooms/:roomId/sessions { agentId, clientSessionId } → { pitch, remainingTimeSeconds, agent, voiceSettings }`. Validates room ownership, KB readiness, `agentKind: "pitch_room"`, and existing pitch-time rules.
- Extend `Pitch` with `pitchRoomId`, `pitchMode`, a room-name snapshot, **plus `agentId` and an `agentName` snapshot** (today `PitchModel` has no `agentId` at all — this closes that gap and is what lets the evaluation page show which VC/room a pitch came from, Section 6).
- Compose the room prompt via `buildRoomSessionPrompt()` (Section 3). Keep composed prompt under Deepgram's limit with deterministic section budgets; never truncate the persona.
- Expose exactly the three read-only tools from Section 2, backed by a signed short-lived room-session token (user/room/pitch/agent/KB-revision/expiry/random session ID) verified against a `RoomToolSession` record — with a Redis validation cache in front (Section 4) to stay inside the latency budget.
- Retrieval behavior per Section 2 (parallel vector+text, app-level fusion, ~20→5-6 results, ~3,500 char cap, no reranker unless eval data justifies one).
- These tool-call routes are synchronous Next.js API handlers reading Mongo + Redis directly — **never routed through the BullMQ worker**, which is for durable async jobs only.
- Existing browser-to-Deepgram WebSocket, microphone pipeline, transcript handling, audio playback, interruptions, session duration, and credit deductions remain unchanged.
- Room pitches appear in My Pitches and evaluation with room and agent labels (reading the new `Pitch.pitchRoomId`/`roomName`/`agentId`/`agentName` fields — no change to the evaluation scoring engine, the FastAPI `/evaluate` call, or `PitchEvalModel`). This is the entire scope of "show room/VC in evaluation": the evaluation page/API stay as-is, only the header display gains a room/VC badge when those fields are present.

Exit condition: a room agent can retrieve only its room's sources and structured facts during a normal low-latency voice conversation, and evaluation correctly labels room-originated pitches.

### Phase 4 — Persistent Room Memory
- After the final transcript is stored (same trigger point as today's `end-pitch`/`updatePitch` flow), enqueue `generate-room-memory` on the BullMQ worker (idempotent via the `memory:{pitchId}` job key plus a unique room/pitch Mongo index — dedup enforced at both layers).
- Worker generates one concise structured memory per completed room pitch: important founder claims/answers, weaknesses/unresolved questions, decisions/material changes, new startup facts, recurring areas of difficulty. Never copies/embeds the full transcript — one bounded searchable summary with an embedding and structured categories.
- After each completed session, enqueue `regenerate-room-memory-digest`; only this compact digest (cached per Section 4) is included in future startup prompts. `search_previous_pitch_memory` searches memory summaries, not transcript sentences.
- `recover-abandoned-room-pitch` sweep catches room pitches with transcript data but no clean End Session.
- Deleting a pitch deletes its derived memory and re-enqueues a digest rebuild. Add a room Memory view where founders can inspect summaries and "Forget this session."

Exit condition: later sessions remember useful history without growing prompt size with every past conversation, and memory jobs are duplicate-proof under retry.

### Phase 5 — Quality, Observability, Evaluation, and Rollout
- Record ingestion duration/pages/parser route/embedding usage/source failures, tool latency/result count/no-result rate, Deepgram function failures, memory-job outcomes, **plus queue depth, job retry counts, and cache hit rates** (embedding/retrieval/token-validation caches).
- Never log document bodies, retrieved passages, full prompts, or signed tool tokens.
- Retry/failure handling on every worker job per Section 4's reliability config; all writes use deterministic IDs/upserts.
- **RAG & agent evaluation (Section 7):** offline gold-set harness gates beta expansion; async production sampling runs continuously via `eval-sample-async`, entirely off the live path.
- Rollout: internal accounts → small founder cohort → 10% beta → all founder accounts, gated on security/cost/latency (and now recall@5/groundedness) thresholds.
- Independent kill switches for room creation, ingestion, and live room tools. Track actual storage/parsing/embedding/worker cost during beta before adding plan-specific entitlements.

## 6. Data and Interface Changes

| Model | Important fields |
|---|---|
| `PitchRoom` | userId, name/normalized name, practiceFocus, active/archived state, Knowledge Base reference, timestamps |
| `KnowledgeBase` | userId, roomId, status, active revision, startup brief, contradictions, source/storage statistics |
| `KnowledgeSource` | tenant IDs, file/text type, Cloudinary metadata, content hash, processing stage, revision, safe error |
| `KnowledgeChunk` | all tenant/source IDs + full metadata block from Section 2, text, locator, element type, embedding, model version, ready state |
| `StartupFact` | canonical metric, raw/numeric value, period, currency/unit, actual/projected type, confidence, provenance, conflict state |
| `RoomMemory` | tenant IDs, pitch ID, structured summary fields, bounded searchable text, embedding |
| `RoomToolSession` | signed-token ID, tenant/room/pitch/agent scope, expiry, revocation and call counters |
| Existing `Agent` | additive `agentKind`, stable `slug`, `specialty`; existing prompts remain in the database, unchanged read path |
| Existing `Pitch` | additive `pitchRoomId`, `pitchMode`, room-name snapshot, **`agentId`, `agentName` snapshot** (new — closes the gap where `PitchModel` currently has no agent reference at all); legacy documents remain valid with these unset |

**Public room APIs:** room list/create/get/update/archive; Knowledge Base create/get; upload-intent/upload-confirm; pasted-text create; source list/delete/retry; structured-fact confirm/correct/disable; room-agent list; room-session start. Internal Deepgram tool APIs require signed room-session authorization, not NextAuth cookies alone. All user-facing reads/mutations return 404 rather than revealing whether another user's room/source exists.

**Evaluation page/API:** no changes to the scoring engine, the FastAPI `/evaluate` contract, or `PitchEvalModel`. The evaluation page reads the new `Pitch.pitchRoomId`/`roomName`/`agentId`/`agentName` fields to show a room/VC badge when present; generic pitches render exactly as today.

## 7. RAG & Agent Evaluation

Offline harness **plus** async production sampling, with a hard rule that neither ever adds latency to a live voice session.

- **Offline gold-set harness** — a repeatable script/scheduled job run in CI/staging only, never against production traffic. Gold question set targets factual recall, exact numbers/names, tables, charts, conflicting metrics. Gates beta expansion at retrieval **recall@5 ≥ 85%**; also tracks MRR, structured-fact accuracy, and groundedness (LLM-judge, run offline).
- **Async production sampling** — a low-probability sampler (e.g. ~1% of live tool calls) fires a fire-and-forget event onto the `eval-sample-async` BullMQ queue from the tool-call handler; never awaited, never blocks the response. The worker later scores sampled query/result pairs offline (retrieval relevance, groundedness, structured-fact accuracy) into a lightweight metrics collection for a dashboard, giving ongoing visibility into real-world drift without touching the hot path.
- **Hard rule:** zero additional synchronous LLM calls, reranking hops, or blocking I/O on the live tool-call path for evaluation purposes — every evaluation mechanism is offline or async/fire-and-forget. This directly protects the ≤1.2s p95 / realtime latency goal.
- Metrics tracked over time: retrieval recall@5/MRR, structured-fact accuracy, no-result rate, groundedness score, tool latency p50/p95, cache hit rates (Section 4).

## 8. Test and Acceptance Plan

- **Generic regression:** existing agents produce identical settings and have no functions; existing generic cards still open the normal session; voice, transcript, interruption, timing, credits, competitions, incubations, and evaluation remain unchanged.
- **Isolation:** User A cannot list/mutate/download/retrieve User B's room data; Room A retrieval never returns Room B chunks/metrics/memories; a forged room ID or tool argument cannot change token scope; generic settings contain no room context or room tools.
- **Ingestion:** digital PDF, scanned PDF, PPT/PPTX, Word, spreadsheet, image, and pasted-text fixtures; tables/charts retain locators and meaningful normalized content; duplicate upload, forged Cloudinary confirmation, invalid MIME, oversized file, page limit, parser failure, retry, and source deletion all handled correctly — including verifying BullMQ job dedup (retriggering the same source doesn't double-process).
- **Retrieval:** gold question set (Section 7); recall@5 ≥ 85% before beta expansion; numerical tool results include period/unit/source evidence.
- **Memory:** one memory per completed pitch; no transcript-length memory records; relevant prior weakness retrievable later; deleting/forgetting a pitch removes derived memory; duplicate `room.pitch.completed` events (retry) never create duplicate memories.
- **Jobs/queues:** verify retry+backoff on a forced worker failure, concurrency caps hold under parallel ingestion, a killed/restarted worker resumes from Mongo status (not lost), and duplicate job keys are no-ops.
- **Caching:** verify correctness is unaffected when Redis is unavailable (cold-cache/no-cache behavior matches warm-cache behavior, just slower); verify cache invalidation on KB revision bump and new memory writes.
- **Performance:** generic sessions add no new application-side network hop; room tool endpoint p95 target ≤1.2s with a 2.5s graceful timeout; load-test parallel retrieval and per-user ingestion concurrency.
- **End-to-end:** create room → create Knowledge Base → paste/upload → observe processing → select room VC → start voice session → invoke tool → end pitch → see memory in the next session → see room/VC label in evaluation. CI uses mocked Deepgram/Unstructured/OpenAI/Redis services; staging includes controlled real-provider smoke tests.

## 9. Locked Defaults and Assumptions

- Feature available to all founder accounts during beta.
- Limits: 5 rooms/user, 20 active sources/room, 25 MB/file, 100 MB total/room, 200 pages/slides/sheets per document.
- Files stored in the existing Cloudinary account as authenticated raw assets.
- Managed parsing via Unstructured Auto; structured extraction and embeddings via OpenAI (`text-embedding-3-small`); retrieval via MongoDB Atlas. Ingestion/embedding logic lives in the new Node worker, not the Python FastAPI service — the Python service stays scoped to pitch evaluation/valuation only, unchanged.
- Production Atlas must support Vector Search and permit creating the required indexes.
- Room Knowledge Base updates apply to new sessions; an active voice session keeps the startup brief it started with.
- No existing agent prompts are moved; the three room-agent prompts live in the same `Agent` collection.
- No historical pitches require migration; missing `pitchMode`/`agentId` means generic.
- No pricing/billing entitlement added until beta usage data is available.
- **New infra:** BullMQ + a dedicated Node worker + self-hosted Redis (VPS/Docker, hosting-agnostic via `REDIS_URL`) for all new RAG-heavy async jobs; Inngest is untouched and keeps handling existing app jobs (credit sync, email). Redis also backs the caching layer (embeddings, tool-session validation, retrieval results, memory digests) — always with a live-compute fallback, never a correctness dependency.
- **No reranker** unless the offline eval harness shows a meaningful gain. **No synchronous evaluation** on the live path, ever.
