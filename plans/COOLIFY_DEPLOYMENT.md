# Pitchdesk on Coolify — Deployment Plan & Runbook

## Live status (2026-09-13, after first real deploy attempt)

`dev` was merged into `main` and pushed — this already triggered a real
deploy via an existing GitHub webhook (auto-deploy-on-push is confirmed
working, no extra setup needed there):

- **pitchdesk-worker: deployed and healthy.** Logs confirm `connected to
  MongoDB`, `connected to Redis`, listening on all 5 queues. Redis/Mongo
  wiring is correct.
- **pitchdesk-web: built and started, but not reachable.** Next.js logs show
  a clean `✓ Ready`, but Coolify's Traefik proxy returns `502 Bad Gateway`
  on the app's placeholder domain. A restart produced a fresh container with
  the same result, which points at the proxy/Docker-network layer rather
  than the app itself. Not yet resolved — see §11.
- **pitchdesk-api: still failing to build.** Root cause found: Coolify's
  "Dockerfile Location" (`/backend/Dockerfile`) is applied *relative to*
  "Base Directory" (`/backend`), so it's actually looking for
  `backend/backend/Dockerfile`, which doesn't exist. Fix is a one-field
  change in the Coolify UI (§1) — no MCP tool exists to edit application
  config, only to read/deploy/control, so this needs to be done by hand.

## Section index below (original plan)

Status as of 2026-09-14. VPS: "Contabo" (public IP `169.58.222.221`), Coolify
project "PitchDesk" (single `production` environment), 3 apps:

| App | UUID | Build | Port |
|---|---|---|---|
| pitchdesk-web (Next.js) | `bfble9iqylvt93oz73ghprgb` | Dockerfile at `/Dockerfile`, context = repo root | 3000 |
| pitchdesk-api (FastAPI) | `1q36xzc2b0wuekqbugqonqpb` | Dockerfile at `/backend/Dockerfile`, context = `/backend` | 8000 |
| pitchdesk-worker (BullMQ) | `fszxzwm860lffsetniseflaz` | Dockerfile at `/worker/Dockerfile`, context = repo root | n/a (no HTTP server) |
| shared-redis (Nexus project) | `6lmlg7sq0ebizyh1yo42qrkw` | redis:7.2, password-auth, not publicly exposed | 6379 (internal only) |

All three apps currently show `exited:unhealthy` with **zero deployment
history** — nothing has actually been built/deployed yet.

---

## 1. ~~Critical blocker~~ RESOLVED: `main` now has everything, one Coolify field still needs a manual fix

`dev` has been merged into `main` and pushed (done). That immediately
triggered real deploys via an existing GitHub webhook.

**pitchdesk-api needs one manual fix in the Coolify UI before it will build**
— I have no tool that can edit application config, only read/deploy/control:

1. Open pitchdesk-api in Coolify → Configuration → General/Build settings.
2. Change **Dockerfile Location** from `/backend/Dockerfile` to `/Dockerfile`.
3. Leave **Base Directory** as `/backend`.
4. Redeploy (push a commit, or click Redeploy — either triggers a build).

Why: Coolify resolves Dockerfile Location *relative to* Base Directory, so
the current value resolves to `backend/backend/Dockerfile`, which doesn't
exist — that's the exact build failure in the logs.

If Vercel is still connected to this repo it will also auto-redeploy from
`main` now (harmless — everything here works fine on Vercel too — see §7 for
winding it down once Coolify is confirmed fully working).

---

## 2. What I changed just now

- **Seeded the 3 pitch-room agent personas into MongoDB.** The persona work
  (Maya Shah / Kabir Malhotra / Neha Rao — balanced validator, metrics
  challenger, market/storytelling coach) was already written in
  `scripts/seed-room-agents.ts` from an earlier phase, but had never actually
  been run — the database had 0 `pitch_room` agents. It's seeded now (27
  existing generic agents untouched). Style is intentionally different from
  the 7-8 generic VC judges (which use an "emotional VC judge" persona
  template): room coaches speak as a recurring mentor across sessions, per
  `ROOM_OPERATING_RULES` in that script. If you want them different, edit
  the `systemPrompt`/`voice` fields in that file and re-run it — it's
  idempotent (upserts by `slug`).
- **FastAPI CORS was `allow_origins=["*"]` + `allow_credentials=True`** —
  any website could call it from a browser. Restricted to
  `https://pitchdesk.in` / `https://www.pitchdesk.in` (overridable via a new
  `CORS_ALLOWED_ORIGINS` env var, comma-separated), dropped credentials
  (nothing there needs cookies), and limited methods/headers.
- **FastAPI had zero request auth at all.** Added a shared-secret check
  (`INTERNAL_API_KEY` env var + `X-Internal-Api-Key` header) enforced on
  every route except `/` and `/health`. If `INTERNAL_API_KEY` isn't set the
  check is skipped, so local dev is unaffected. Verified locally: no
  header → 401, wrong header → 401, correct header → passes through.
- **Every Next.js server-side call into FastAPI now sends that header**
  (8 route files updated; new `src/lib/fastapiClient.ts` helper for future
  code).
- **Two pages called FastAPI directly from the browser** (`start-pitch`'s
  5-minute summary, `generate-pitch`'s submit) — that would have required
  shipping the secret to the browser, defeating the point. Added same-origin
  proxy routes (`/api/fastapi-proxy/five-min-summary`,
  `/api/fastapi-proxy/generate-pitch`) and pointed both pages at those
  instead. FastAPI is no longer reachable from the browser at all now.
- Dropped the now-unused `fastapi.pitchdesk.in` / old Vercel backend origins
  from the CSP `connect-src` (nothing in the browser calls them anymore).
- Committed a `.gitignore` fix (`.env*.local`, `backend/.vercel`) that
  `vercel env pull` had left as an uncommitted local change.
- `npm run build` and a local FastAPI smoke test both pass with these
  changes.

All of this is committed and pushed to `dev` already (not `main` — see §1).

---

## 3. Env vars — what's set, what's missing, what's wrong

I can only see **key names** on Coolify (never values, by design), so I
verified this by grepping the codebase for every `process.env`/`os.getenv`
call and diffing against the configured keys.

### pitchdesk-api (FastAPI) — only had 3 keys, needs 5 more
Currently set: `GEMINI_API_KEY`, `GEMINI_MODEL` (unused in code, harmless),
`OPENAI_API_KEY`.

**Add:**
| Key | Value |
|---|---|
| `INTERNAL_API_KEY` | Generate one: `openssl rand -hex 32`. Must be the **exact same value** on pitchdesk-web. |
| `CORS_ALLOWED_ORIGINS` | `https://pitchdesk.in,https://www.pitchdesk.in` |

FastAPI needs no `MONGO_URI` or `REDIS_URL` — it never touches either
directly (confirmed by grep).

### pitchdesk-web (Next.js) — 26 keys set, add 2 + fix 2
**Add:**
| Key | Value |
|---|---|
| `INTERNAL_API_KEY` | Same value as pitchdesk-api's. |
| `NEXTAUTH_URL` | `https://pitchdesk.in` — NextAuth v4 infers this on Vercel but not reliably behind Coolify's Traefik proxy; set it explicitly. |

**Fix (production values, not dev):**
| Key | Should be |
|---|---|
| `FASTAPI_BACKEND` | Internal Coolify hostname, e.g. `http://<pitchdesk-api internal hostname>:8000` — **not** a public URL. See §4. |
| `NEXT_PUBLIC_FASTAPI_BACKEND` | Since browser no longer calls FastAPI at all (per §2), this can also just be the internal hostname now — it's only read server-side. Keeping it as a real public URL also still works, just does an unnecessary public round-trip. |
| `NEXT_PUBLIC_APP_URL` | `https://pitchdesk.in` |
| `REDIS_URL` | Copy the exact connection string from the Coolify **shared-redis** resource → Configuration tab (includes username/password + internal host). Don't hand-construct it. |
| `MONGO_URI` | Your Atlas connection string — same one used everywhere else. |
| `PITCH_ROOMS_ENABLED` / `NEXT_PUBLIC_PITCH_ROOMS_ENABLED` | Leave `false` until you've smoke-tested a full room session end-to-end post-deploy, then flip both to `true` (comment on the key already says this). |

Double check none of these still hold **Vercel preview/dev values** —
e.g. an old `NEXTAUTH_SECRET` from a preview deployment, or a dev-only
Google OAuth client ID/secret. If your Google OAuth client's authorized
redirect URIs don't already include `https://pitchdesk.in/api/auth/callback/google`,
add it in Google Cloud Console.

### pitchdesk-worker — 8 keys set, this one looks complete
`MONGO_URI`, `REDIS_URL`, `OPENAI_API_KEY`, `CLOUDINARY_*` (3), `UNSTRUCTURED_API_KEY`,
`UNSTRUCTURED_API_URL` — matches everything the worker's shared `src/lib`
imports actually need. Just make sure `MONGO_URI` and `REDIS_URL` here are
the **identical values** as pitchdesk-web (same DB, same Redis — the worker
and web app coordinate through both).

---

## 4. Internal networking (Redis, service-to-service calls)

All 4 resources sit on Coolify's single shared `coolify` Docker network on
the Contabo server, so none of this needs to touch the public internet:

- **Redis**: already `is_public: false`, password-protected, image
  `redis:7.2`. Correct as-is — don't expose it publicly. Get the exact
  internal `REDIS_URL` from its Coolify page (Configuration tab shows the
  ready-to-paste connection string) and use that same value in both
  pitchdesk-web and pitchdesk-worker.
- **pitchdesk-web → pitchdesk-api**: should also go over the internal
  network rather than round-tripping through the public domain. Open the
  pitchdesk-api resource page in Coolify — it shows the container's internal
  hostname (Coolify assigns one per app; I can't read it via the API/MCP
  token, only you can see it in the dashboard). Set `FASTAPI_BACKEND` (and
  optionally `NEXT_PUBLIC_FASTAPI_BACKEND`) on pitchdesk-web to
  `http://<that internal hostname>:8000`. If it's not obvious in the UI, a
  quick way to confirm from a shell on the server:
  `docker network inspect coolify | grep -A2 pitchdesk-api`.
- **Mongo Atlas**: external, not on this network. In Atlas → Network Access,
  add `169.58.222.221/32` (the Contabo server's public IP) to the IP
  access list, or the deploys will hang/timeout on `dbConnect()`.

---

## 5. Docker/build config — verified correct

Checked each Coolify app's build config against the actual Dockerfiles in
the repo:

- **pitchdesk-web**: base directory `/`, Dockerfile `/Dockerfile`, port 3000.
  Matches the multi-stage Dockerfile (needs `output: "standalone"`, which is
  set). Build-time env vars: remember any `NEXT_PUBLIC_*` var must be marked
  "Build Variable" in Coolify (not just runtime), or it won't get inlined
  into the client bundle.
- **pitchdesk-api**: base directory `/backend`, Dockerfile
  `/backend/Dockerfile`, port 8000. Correct — `backend/Dockerfile` installs
  `requirements.txt` and runs uvicorn on 0.0.0.0:8000.
- **pitchdesk-worker**: base directory `/` (root context), Dockerfile
  `/worker/Dockerfile`, no exposed port (correct — it's a queue consumer,
  not an HTTP server; health check is already disabled for it, leave it
  disabled). `worker/Dockerfile` deliberately builds from the repo root so
  it can import Mongoose models straight from `src/models` — the base
  directory setting matches that requirement exactly.
- Health checks: pitchdesk-api's health check path is `/` — FastAPI also has
  a dedicated `/health` route; point Coolify's health check at `/health`
  instead (Configuration → Health Checks) and enable it. pitchdesk-web's `/`
  health check is fine (public homepage, no auth).
- No `.env` files leak into any image — `.dockerignore` for the web app
  should be added if missing (check root `.dockerignore`); `backend/.dockerignore`
  already excludes `.env*`.

---

## 6. Deploying

Once `main` is updated (§1) and the env vars above are filled in:

1. Deploy **pitchdesk-api** first (nothing depends on it being up, but web/worker
   will error loudly if it isn't).
2. Deploy **pitchdesk-worker**.
3. Deploy **pitchdesk-web** last.
4. Watch each deployment's logs as it builds; then check `/health` on the
   API and the homepage on web.

I'll trigger these through the Coolify MCP `deploy` tool and watch
`get_deployment(include_log_summary=true)` for each one — say the word once
`main` is updated and the env vars are in, and I'll run all three and report
back pass/fail with logs.

---

## 7. Domains — what to do in Coolify vs. your registrar/Cloudflare

In **Coolify**:
- pitchdesk-api → Configuration → Domains → set `fastapi.pitchdesk.in`
  (replacing the sslip.io placeholder). Coolify/Traefik will auto-issue a
  Let's Encrypt cert once the DNS record below resolves to this server.
- pitchdesk-web → Domains → set `pitchdesk.in` and `www.pitchdesk.in`.
- pitchdesk-worker needs no domain (no HTTP server).

At your **DNS provider** (Cloudflare, GoDaddy, wherever `pitchdesk.in` is
managed):
- `A  pitchdesk.in       → 169.58.222.221`
- `A  www.pitchdesk.in   → 169.58.222.221`
- `A  fastapi.pitchdesk.in → 169.58.222.221`
- If the domain is on Cloudflare with the orange-cloud proxy on, either
  turn proxying **off** (grey cloud) for these three records so Coolify's
  own Let's Encrypt cert issuance works, or keep it on and set Cloudflare's
  SSL mode to "Full (strict)" once Coolify's cert is live — don't leave it
  on "Flexible" (that causes redirect loops with Traefik forcing HTTPS).
- Nothing to change for the Razorpay webhook — same `pitchdesk.in` domain.

---

## 8. Auto-deploy on push + knowing when a deploy succeeded

Two things you asked about:

**Auto-deploy on git push** — Coolify supports this without manual
redeploys, but it depends on which GitHub source is attached to these apps.
I found two GitHub sources configured on your team: a generic "Public
GitHub" source and a dedicated "pitchdesk-git" GitHub App. Check each app's
Configuration → Source in Coolify:
- If it's the dedicated **pitchdesk-git GitHub App**: auto-deploy on push to
  `main` should already work out of the box (the App registers its own
  webhook on install) — just confirm "Automatic Deployment" is toggled on
  under each app's General settings.
- If it's the plain **Public GitHub** source: you need to add a webhook by
  hand — each app's page has a "Webhooks" tab showing a Payload URL and
  Secret; add those as a webhook in GitHub (repo → Settings → Webhooks →
  Add webhook, content type `application/json`, paste the secret, event:
  "Just the push event").

**Knowing a deploy succeeded (Vercel-style)** — Coolify doesn't post GitHub
commit-status checks unless you're on the GitHub App integration (check the
same Configuration → Source panel — if it's the App, you'll already see
✔/✖ marks on commits). For anything else, use Coolify's own notifications:
Team/Project Settings → Notifications → connect Discord/Slack/Telegram/email
and enable "Deployment success" and "Deployment failure" events. I can't
set this up for you (no write access to notification settings via MCP) —
takes about 2 minutes in the UI.

---

## 9. Winding down Vercel

Don't touch Vercel until pitchdesk-web, pitchdesk-api and the worker are all
confirmed healthy on Coolify end-to-end (a real pitch session + a real
pitch-room session, including a document upload if you want to check the
RAG ingestion path). Once confirmed:
1. Update DNS (§7) to point at Coolify — traffic moves over.
2. In Vercel, remove the production domain from both the `pitchdesk`
   (Next.js) and `pitchdesk-fastapi`/`pitchdesk-backend` projects, or just
   delete those projects outright once you're confident.
3. Cancel/downgrade the Vercel plan if you were paying for it because of
   this project specifically.
Keep Vercel around (domain detached, project intact) for a few days as a
rollback option before fully deleting anything.

---

## 10. Security checklist

Done already (this session):
- [x] FastAPI CORS restricted to `pitchdesk.in`.
- [x] FastAPI requires `X-Internal-Api-Key` on every non-health route.
- [x] Browser no longer talks to FastAPI directly at all.
- [x] Redis is internal-only, password-protected.

Still to do, your side:
- [ ] MongoDB Atlas → Network Access → allow only the Contabo IP
  (`169.58.222.221`) instead of `0.0.0.0/0`, if it's currently open to
  everywhere.
- [ ] Rotate `NEXTAUTH_SECRET`, `ROOM_SESSION_TOKEN_SECRET`, and all API
  keys that were sitting in Vercel's env panel, **if** you ever shared that
  project with someone external or suspect exposure — otherwise reusing the
  same values is fine.
- [ ] Server firewall: only 22 (SSH), 80/443 (Traefik) should be reachable
  from the public internet on the Contabo box. Coolify's dashboard port and
  Redis/Mongo ports should not be publicly exposed — check with `ufw status`
  or your provider's firewall panel.
- [ ] Consider rate-limiting the public FastAPI endpoints eventually (e.g.
  Traefik middleware or a simple in-memory limiter) — not urgent given
  `INTERNAL_API_KEY` now blocks casual abuse, but worth doing before any
  paid-tier scaling.
- [ ] Set up the Coolify deployment notifications from §8 so a failed
  deploy doesn't go unnoticed.
- [ ] Keep regular Mongo Atlas backups (likely already on since it's
  Atlas-managed) and enable Coolify's Redis backup schedule if you care
  about queue/cache persistence across a Redis restart (queues will just
  redo in-flight jobs if lost — check BullMQ job retry settings if this
  matters to you).

---

## 11. Open issue: pitchdesk-web gets 502 from Traefik

The app itself is fine — container logs show `▲ Next.js 15.4.10` /
`✓ Ready` on every start, including after a manual restart that produced a
fresh container. But `curl` against its placeholder domain
(`bfble9iqylvt93oz73ghprgb.169.58.222.221.sslip.io`) returns:
- HTTP: `502 Bad Gateway` (Traefik's own generic error page — it matched a
  route for the host but couldn't reach the backend).
- HTTPS: `503 Service Unavailable`.

This is consistent with the new container not being (or not yet being)
correctly registered with Traefik on the shared `coolify` Docker network —
not an application bug. I didn't go further because the next natural fix
(restarting the shared Traefik/proxy service) briefly affects every other
app on this server, including your Veqiro apps, and you asked me to wait
rather than do that. To check/fix this yourself:
- In Coolify, open pitchdesk-web → check if the UI shows any proxy/domain
  warning (sometimes visible there but not over the API).
- Try Coolify's server-level "Restart Proxy" (Server → Contabo → Proxy tab)
  during a low-traffic moment — it's a few seconds of blip for all apps on
  this server, not destructive.
- Or tell me to go ahead and I'll trigger it and verify pitchdesk-web (and
  confirm Veqiro's apps come back clean) right after.
- If a proxy restart doesn't fix it, the next thing to check (needs SSH,
  which I don't have) is `docker network inspect coolify` to confirm the
  pitchdesk-web container is actually attached to it.

## Your action items — full checklist

### A. Unblock the two broken deploys
- [ ] **pitchdesk-api**: Configuration → Build settings → change **Dockerfile
  Location** from `/backend/Dockerfile` to `/Dockerfile` (keep Base
  Directory as `/backend`). Redeploy after.
- [ ] **pitchdesk-web** (502 from Traefik, §11): open its Coolify page and
  check for a proxy/domain warning, or use Server → Contabo → Proxy →
  Restart Proxy (few-second blip for every app on the server, incl.
  Veqiro's) — or tell me to do it and I'll verify Veqiro's apps too
  afterward.

### B. Env vars to add
- [ ] `INTERNAL_API_KEY` — generate once (`openssl rand -hex 32`), paste the
  **same value** into both pitchdesk-web and pitchdesk-api.
- [ ] `CORS_ALLOWED_ORIGINS` on pitchdesk-api — `https://pitchdesk.in,https://www.pitchdesk.in`
- [ ] `NEXTAUTH_URL` on pitchdesk-web — `https://pitchdesk.in`

### C. Env vars to fix (currently wrong/placeholder values)
- [ ] `FASTAPI_BACKEND` (pitchdesk-web) → pitchdesk-api's **internal**
  Coolify hostname, e.g. `http://<internal-hostname>:8000` (see it on
  pitchdesk-api's Coolify page) — not a public URL.
- [ ] `NEXT_PUBLIC_FASTAPI_BACKEND` (pitchdesk-web) → can be the same
  internal hostname now (browser never calls FastAPI anymore).
- [ ] `REDIS_URL` (pitchdesk-web + pitchdesk-worker) → copy the exact
  connection string from the shared-redis resource's Configuration tab in
  Coolify. Make sure it's identical on both apps.
- [ ] `MONGO_URI` (pitchdesk-web) → your real Atlas connection string.
- [ ] `NEXT_PUBLIC_APP_URL` (pitchdesk-web) → `https://pitchdesk.in`
- [ ] Double check `NEXTAUTH_SECRET`, Google OAuth client ID/secret, and
  every other copied-from-Vercel value isn't a stale preview/dev value.
- [ ] Leave `PITCH_ROOMS_ENABLED` / `NEXT_PUBLIC_PITCH_ROOMS_ENABLED` as
  `false` until step F below passes.

### D. Database & networking
- [ ] MongoDB Atlas → Network Access → whitelist `169.58.222.221` (the
  Contabo server's IP).
- [ ] pitchdesk-api health check: Configuration → Health Checks → point at
  `/health` instead of `/`, enable it.

### E. Domains / DNS / Cloudflare
- [ ] Coolify → pitchdesk-api → Domains → set `fastapi.pitchdesk.in`
  (replace the sslip.io placeholder).
- [ ] Coolify → pitchdesk-web → Domains → set `pitchdesk.in` and
  `www.pitchdesk.in`.
- [ ] At your DNS provider: `A` records for `pitchdesk.in`,
  `www.pitchdesk.in`, and `fastapi.pitchdesk.in`, all → `169.58.222.221`.
- [ ] If DNS is on Cloudflare with the orange-cloud proxy on: either turn it
  **off** (grey cloud) for these 3 records so Coolify's Let's Encrypt cert
  issuance works, or keep it on and set SSL mode to **Full (strict)** once
  Coolify's cert is live (never "Flexible" — causes redirect loops).
- [ ] Google Cloud Console → OAuth client → confirm
  `https://pitchdesk.in/api/auth/callback/google` is in the authorized
  redirect URIs (domain isn't changing, so likely already fine — just
  confirm).
- [ ] Razorpay webhook: no change needed, same `pitchdesk.in` domain.

### F. GitHub / CI-CD / deploy visibility
- [ ] Auto-deploy-on-push already works (confirmed — pushing to `main`
  triggered real builds via an existing webhook). Just confirm "Automatic
  Deployment" is toggled on for all 3 apps in Coolify, General settings.
- [ ] Set up Coolify deploy notifications so you get a Vercel-style signal:
  Team/Project Settings → Notifications → connect Discord/Slack/Telegram/
  email → enable "Deployment success" and "Deployment failure".
- [ ] (Optional) Check each app's Configuration → Source — if it's on the
  dedicated "pitchdesk-git" GitHub App rather than generic "Public GitHub",
  you also get ✔/✖ commit-status checks on GitHub itself, Vercel-style.

### G. Security
- [ ] Server firewall: confirm only ports 22 (SSH) and 80/443 (Traefik) are
  publicly reachable on the Contabo box — not Coolify's dashboard port, not
  Redis/Mongo. Check `ufw status` or your provider's firewall panel.
- [ ] Rotate `NEXTAUTH_SECRET` / `ROOM_SESSION_TOKEN_SECRET` / any API key
  only if you think it was ever exposed outside your own Vercel account —
  otherwise reusing existing values is fine.
- [ ] (Later, not urgent) Consider rate-limiting the public FastAPI/Next
  endpoints before any paid-tier scaling.

### H. Before going fully live
- [ ] Smoke-test a full generic pitch session end-to-end on the new
  Coolify-served domain.
- [ ] Smoke-test a full pitch-room session, including a knowledge-base
  document upload (exercises the worker's ingestion pipeline).
- [ ] Flip `PITCH_ROOMS_ENABLED` and `NEXT_PUBLIC_PITCH_ROOMS_ENABLED` to
  `true` once both pass.
- [ ] Only then start winding down Vercel (§9) — detach the domain first,
  keep the Vercel project around for a few days as a rollback option before
  deleting anything.
