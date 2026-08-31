
  # Pitch Rooms, Knowledge Base, and RAG-Powered VC Agents

  ## 1. Architecture Summary

  PitchDesk currently sends microphone audio directly from the browser to Deepgram’s Voice Agent WebSocket. Deepgram manages speech recognition, the OpenAI reasoning model, and voice generation. Pitch transcripts are periodically
  saved to MongoDB, while Inngest already handles background pitch synchronization.

  The new architecture will extend this flow without replacing it:

  Generic VC session
  Browser → Existing Deepgram configuration → Existing pitch flow
           No room ID, no RAG tools, no startup context

  Pitch Room session
  Browser → Deepgram Voice Agent
               ↓ server-side tool call
        PitchDesk room tool API
               ↓
     Structured facts + Atlas retrieval
               ↓
        Room-only context returned

  Deepgram officially supports server-side function endpoints, so database retrieval can remain on PitchDesk’s backend instead of exposing MongoDB logic to the browser. Deepgram function calling
  (https://developers.deepgram.com/docs/voice-agents-function-calling)

  Document ingestion:

  Authenticated Cloudinary upload or pasted text
                   ↓
           Knowledge source record
                   ↓
          Inngest durable workflow
                   ↓
       Unstructured Auto document parsing
                   ↓
   Normalize → facts/metrics → intelligent chunks
                   ↓
         OpenAI batch embeddings
                   ↓
   MongoDB Atlas text + vector indexes
                   ↓
          Publish Knowledge Base

  Unstructured Auto can route simple PDF pages through fast extraction and complex pages through layout/OCR/vision processing, avoiding unnecessary vision cost. Unstructured partitioning
  (https://docs.unstructured.io/concepts/partitioning)

  Cloudinary files will use authenticated/private raw delivery, never ordinary public upload URLs. Cloudinary access control (https://cloudinary.com/documentation/control_access_to_media)

  ## 2. Phased Delivery

  ### Phase 0 — Safety Foundation and Generic-Flow Baseline

  - Add a global PITCH_ROOMS_ENABLED feature flag.
  - Capture automated snapshots of the existing generic agent settings, prompts, voices, cards, start-session response, transcript flow, credit deduction, interruption behavior, and evaluation flow.
  - Split voice configuration into:
      - Existing generic configuration builder, with unchanged output.
      - New server-only room configuration builder.

  - Refactor pitch creation/ending into shared server services so generic and room sessions use the same timing and credit rules.
  - Harden existing pitch and Deepgram-token endpoints to derive the user from the NextAuth server session. Client-supplied userId may be accepted temporarily for compatibility but must match the authenticated user.
  - Add Atlas vector/text index definitions and a deployment-time index readiness check.
  - Keep all Mongoose, Cloudinary, ingestion, and retrieval work in the Node runtime; route handlers remain thin App Router adapters.
  - Add openai, jose, and file-signature validation dependencies. Call Unstructured over HTTP to avoid another large SDK.

  Exit condition: generic agent configuration and behavior pass regression tests before any room feature is enabled.

  ### Phase 1 — Pitch Room Product Shell and Dedicated Agents

  - Replace the founder sidebar label “Start Pitch” with “Pitch Room”, linking to /pitch-rooms.
  - Redirect /start-a-pitch to /pitch-rooms for old bookmarks and dashboard links.
  - Build /pitch-rooms with:
      - The existing generic VC cards, unchanged and permanently available.
      - Custom room cards ordered by most recently updated.
      - Create-room dialog requiring only a room name.

  - Build /pitch-rooms/[roomId] with Knowledge Base, room settings, extracted metrics, room pitch history, and agent-selection sections.
  - Add optional editable practiceFocus inside room settings.
  - Seed three fixed room-only agents idempotently into the existing Agent collection:
      - Maya Shah — balanced strategic validator; feminine professional voice.
      - Kabir Malhotra — finance and metrics challenger; masculine confident voice.
      - Neha Rao — market, customer, and storytelling specialist; feminine conversational voice.

  - Give room agents explicit agentKind: "pitch_room" and stable slugs. They are not user-created Agent documents and cannot be selected for generic, competition, or incubation sessions.
  - A founder chooses any of the three room agents for every session. Knowledge and memory remain attached to the room, not to an individual agent.
  - Rooms without a ready Knowledge Base show “Create Knowledge Base”; room pitch start remains disabled until the first source is ready.
  - Room deletion is initially a reversible archive. Individual sources can be permanently removed.

  Exit condition: room CRUD, ownership, dedicated agent selection, legacy redirect, and unchanged generic cards all work behind the feature flag.

  ### Phase 2 — Knowledge Base Ingestion

  - Create one lazy, one-to-one Knowledge Base per room.
  - Support:
      - PDF, PPT/PPTX, DOC/DOCX.
      - XLS/XLSX, CSV.
      - TXT and Markdown.
      - PNG/JPEG scans.
      - Pasted text up to 50,000 characters per source.

  - Use signed direct-to-Cloudinary uploads to avoid routing 25 MB files through a Vercel Function.
  - Force room documents into an authenticated/private Cloudinary folder and verify the uploaded asset server-side before accepting it.
  - Trigger an idempotent Inngest workflow per source:
      1. Validate the Cloudinary asset, MIME signature, extension, quota, and duplicate content hash.
      2. Parse with Unstructured Auto.
      3. Preserve headings, reading order, page/slide/sheet locations, tables, images, charts, and parser confidence.
      4. Normalize headers/footers, repeated slide furniture, whitespace, and duplicate elements.
      5. Extract structured startup facts with OpenAI Structured Outputs and evidence locations.
      6. Chunk by semantic section rather than fixed characters: approximately 500–800 tokens, 80–120 overlap, with tables and slide context kept together.
      7. Embed chunks in batches using text-embedding-3-small; store the embedding model/version on each record.
      8. Build a concise startup brief and publish the Knowledge Base atomically.

  - Track detailed source stages: uploading, queued, parsing, extracting, embedding, ready, failed, and deleting.
  - Poll status every three seconds while processing, then back off. No additional WebSocket is necessary.
  - Preserve the last ready Knowledge Base if a later source fails.
  - Extract ARR, MRR, revenue, growth, CAC, LTV, users, burn, runway, valuation, funding ask, margins, churn, and other supported facts.
  - Store actual, projected, and historical values separately with period, unit, currency, confidence, source, and page/slide locator.
  - Flag conflicting values rather than silently picking one.
  - Allow founders to confirm, correct, or disable an extracted fact. User corrections become audited high-priority facts and do not overwrite the original source evidence.

  Exit condition: supported documents and pasted text reliably produce searchable chunks, a startup brief, structured facts, citations, and visible processing/error states.

  ### Phase 3 — Room Voice Agent and Live RAG

  - Add a room session endpoint:

  POST /api/pitch-rooms/:roomId/sessions
  {
    agentId,
    clientSessionId
  }

  → {
    pitch,
    remainingTimeSeconds,
    agent,
    voiceSettings
  }

  - Validate that:
      - The session user owns the room.
      - The room and Knowledge Base are active and ready.
      - The selected agent has agentKind: "pitch_room".
      - Existing pitch-time rules allow the session.

  - Extend Pitch with pitchRoomId, pitchMode, and a room-name snapshot. Legacy pitches default to generic behavior.
  - Compose the room prompt from:
      1. The selected room agent’s existing database system prompt.
      2. Room operating rules and tool-use instructions.
      3. The concise startup brief.
      4. Practice focus.
      5. Current known metric conflicts.
      6. A bounded memory digest once Phase 4 is enabled.

  - Clearly mark uploaded and retrieved content as untrusted reference data, never system instructions.
  - Keep the composed prompt under Deepgram’s managed prompt limit using deterministic section budgets; never truncate the agent persona.
  - Expose exactly three read-only Deepgram server-side tools:

  search_knowledge_base(query)
  get_startup_metrics(metric_names, optional_period)
  search_previous_pitch_memory(query)

  - Tool parameters never contain userId, roomId, or knowledgeBaseId. Those are taken exclusively from a short-lived signed room-session token.
  - Each token contains user, room, pitch, agent, Knowledge Base revision, expiry, and a random session ID. The backend also verifies an active RoomToolSession record for revocation and abuse control.
  - Every database query repeats exact userId + roomId + knowledgeBaseId filters. Atlas vector search indexes these fields for pre-filtering. Atlas vector filtering
    (https://www.mongodb.com/docs/search/query/operators-collectors/vectorSearch/)

  - Retrieval behavior:
      - Run vector and full-text search in parallel.
      - Fuse results in application code so the design does not depend on Atlas 8-only fusion operators.
      - Fetch approximately 20 candidates per search, deduplicate, and return at most 5–6 cited passages.
      - Cap tool output to roughly 3,500 characters.
      - Prefer structured facts for numerical questions.
      - Do not add an LLM reranker initially; enable one behind a flag only if evaluation data shows a meaningful quality gain.

  - Prompt the agent to use tools only when the startup brief lacks the answer, when verifying an important number, or when investigating a suspected inconsistency.
  - On timeout or no results, return a safe structured “not found” result so the VC asks the founder instead of inventing information.
  - The existing browser-to-Deepgram WebSocket, microphone pipeline, live transcript handling, audio playback, interruptions, session duration, and credit deductions remain unchanged.
  - Room pitches appear in My Pitches and evaluation with room and agent labels. Evaluation scoring itself remains unchanged.

  Exit condition: a room agent can retrieve only its room’s sources and structured facts during a normal low-latency voice conversation.

  ### Phase 4 — Persistent Room Memory

  - Emit an idempotent room.pitch.completed Inngest event only after the final transcript has been stored.
  - Generate one concise structured memory per completed room pitch containing:
      - Important founder claims and answers.
      - Weaknesses and unresolved questions.
      - Decisions or material changes.
      - New startup facts.
      - Recurring areas of difficulty.

  - Do not copy or embed the full transcript. Store one bounded searchable summary per pitch with an embedding and structured categories.
  - Enforce a unique room/pitch memory index so retries cannot create duplicates.
  - Regenerate a compact room memory digest after each completed session. Only this digest is included in future startup prompts.
  - search_previous_pitch_memory searches the concise memory summaries, not transcript sentences.
  - Add a recovery job for room pitches that contain transcript data but were abandoned without a clean End Session request.
  - Deleting a pitch deletes its derived memory and rebuilds the room memory digest.
  - Add a room Memory view where founders can inspect summaries and choose “Forget this session”.

  Exit condition: later sessions remember useful history without increasing prompt size with every past conversation.

  ### Phase 5 — Quality, Observability, and Rollout

  - Record ingestion duration, pages, parser route, embedding usage, source failures, tool latency, result count, no-result rate, Deepgram function failures, and memory-job outcomes.
  - Never log document bodies, retrieved passages, full prompts, or signed tool tokens.
  - Add retry and failure handling to each Inngest step; all writes use deterministic IDs/upserts. Inngest provides durable step retries and persisted progress. Inngest execution model
    (https://www.inngest.com/docs/learn/how-functions-are-executed)

  - Roll out through:
      1. Internal accounts.
      2. Small founder cohort.
      3. 10% beta.
      4. All founder accounts after security, cost, and latency gates pass.

  - Maintain kill switches for room creation, ingestion, and live room tools independently.
  - Track actual storage/parsing/embedding cost during beta before adding plan-specific entitlements.

  ## 3. Data and Interface Changes

   Model              Important fields
  ━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PitchRoom          userId, name/normalized name, practice focus, active/archived state, Knowledge Base reference, timestamps
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   KnowledgeBase      userId, roomId, status, active revision, startup brief, contradictions, source/storage statistics
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   KnowledgeSource    tenant IDs, file/text type, Cloudinary metadata, content hash, processing stage, revision, safe error
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   KnowledgeChunk     all tenant/source IDs, text, page/slide/sheet locator, element type, embedding, model version, ready state
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   StartupFact        canonical metric, raw/numeric value, period, currency/unit, actual/projected type, confidence, provenance, conflict state
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   RoomMemory         tenant IDs, pitch ID, structured summary fields, bounded searchable text, embedding
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   RoomToolSession    signed-token ID, tenant/room/pitch/agent scope, expiry, revocation and call counters
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   Existing Agent     additive agentKind, stable slug, specialty; existing prompts remain in the database
  ─────────────────  ───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
   Existing Pitch     additive pitchRoomId, pitchMode, room-name snapshot; legacy documents remain valid

  Public room APIs:

  - Room list/create/get/update/archive.
  - Knowledge Base create/get.
  - Upload-intent and upload-confirm endpoints.
  - Pasted-text create endpoint.
  - Source list/delete/retry endpoints.
  - Structured-fact confirm/correct/disable endpoints.
  - Room-agent list endpoint.
  - Room-session start endpoint.

  Internal Deepgram tool APIs require signed room-session authorization and are not valid with NextAuth cookies alone.

  All user-facing reads and mutations return 404 rather than exposing whether another user’s room/source exists.

  ## 4. Test and Acceptance Plan

  - Generic regression:
      - Existing agents produce identical settings and have no functions.
      - Existing generic cards still open the normal session.
      - Voice, transcript, interruption, timing, credits, competitions, incubations, and evaluation remain unchanged.

  - Isolation:
      - User A cannot list, mutate, download, or retrieve User B’s room data.
      - Room A retrieval never returns Room B chunks, metrics, or memories.
      - A forged room ID or tool argument cannot change token scope.
      - Generic settings contain no room context or room tools.

  - Ingestion:
      - Digital PDF, scanned PDF, PPT/PPTX, Word, spreadsheet, image, and pasted-text fixtures.
      - Tables/charts retain locators and meaningful normalized content.
      - Duplicate upload, forged Cloudinary confirmation, invalid MIME, oversized file, page limit, parser failure, retry, and source deletion.

  - Retrieval:
      - Gold question set targeting factual recall, exact numbers, exact names, tables, charts, and conflicting metrics.
      - Target retrieval recall@5 of at least 85% before beta expansion.
      - Numerical tool results must include period, unit, and source evidence.

  - Memory:
      - One memory per completed pitch.
      - No transcript-length memory records.
      - Relevant prior weakness can be retrieved later.
      - Deleting/forgetting a pitch removes derived memory.

  - Performance:
      - Generic sessions add no new application-side network hop.
      - Room tool endpoint p95 target: ≤1.2 seconds, with a 2.5-second graceful timeout.
      - Load-test parallel retrieval and per-user ingestion concurrency.

  - End-to-end:
      - Create room → create Knowledge Base → paste/upload → observe processing → select room VC → start voice session → invoke tool → end pitch → see memory in the next session.
      - CI uses mocked Deepgram/Unstructured/OpenAI services; staging includes controlled real-provider smoke tests.

  ## 5. Locked Defaults and Assumptions

  - Feature is available to all founder accounts during beta.
  - Limits: 5 rooms per user, 20 active sources per room, 25 MB per file, 100 MB total per room, and 200 pages/slides/sheets per document.
  - Files are stored in the existing Cloudinary account as authenticated raw assets.
  - Managed parsing uses Unstructured Auto; structured extraction and embeddings use OpenAI; retrieval uses MongoDB Atlas.
  - Production Atlas must support Vector Search and permit creating the required vector and full-text indexes; the local workspace has no database credentials to verify the current production cluster.
  - Room Knowledge Base updates apply to new sessions. An active voice session keeps the startup brief it started with, while tool retrieval only uses currently active sources.
  - No existing agent prompts are moved. The three room-agent prompts are stored in the same Agent collection as current prompts.
  - The Python evaluation service is not expanded into an ingestion worker.
  - No historical pitches require migration; missing pitchMode means generic.
  - No pricing or billing entitlement is added until beta usage data is available.