# Deployment — Curio

> Target: zero-cost (free-tier) deployment that works from a real phone (camera photo capture + microphone for the voice quiz). The hard requirement driving everything: **HTTPS is mandatory** because browser `getUserMedia` (camera + mic) only works in secure contexts, and the LiveKit voice session also needs it.

This document is for the operator (the human deploying Curio). Claude Code should NOT attempt to run deploys itself; it should produce the config/files described here and hand the operator the click-by-click steps.

---

## The key architectural fact that determines hosting

The three apps have two DIFFERENT runtime profiles:

| App | Runtime profile | Can it sleep / scale-to-zero? |
|---|---|---|
| `apps/web` (Next.js) | HTTP, request-driven | Yes — only active when someone loads it |
| `apps/api` (NestJS) | HTTP, request-driven | Yes — tolerates cold start (token minting, vision, sessions, read-aloud) |
| `apps/agent` (LiveKit worker) | **Persistent process**, always connected to LiveKit, waiting to join rooms | **NO — must be always-on** |

The agent is NOT an HTTP service. It is a long-running worker that connects to LiveKit Cloud and stays connected. This single fact rules out:
- Serverless/edge (Vercel Functions, Cloudflare Workers) — no persistent connections.
- Any free tier that sleeps after inactivity (Render free web services spin down after 15 min) — the agent must not sleep.

---

## Chosen free-tier split: Vercel + Koyeb

| App | Platform | Why |
|---|---|---|
| `apps/web` | **Vercel** | Native Next.js host, genuine free tier, automatic HTTPS, no sleep, no card. Git push → deploy. |
| `apps/api` | **Koyeb** | Free tier, Git deploy, automatic HTTPS. Keeping api + agent on one platform is simpler. |
| `apps/agent` | **Koyeb** | **Free tier with NO sleep mode** — the agent stays connected continuously. This is the deciding feature. |
| LiveKit, Gemini, Deepgram, Cartesia | Managed SaaS | Not deployed by us; configured via API keys as env vars. |

All three deployed surfaces get valid HTTPS automatically, which satisfies the camera/mic requirement on mobile.

> Watch item: free tiers cap RAM (often ~0.5 GB/service). The agent runs an STT→LLM→TTS pipeline and is the most likely to brush the memory ceiling. If the agent OOMs or restarts on Koyeb free, that single service is the candidate to bump to a minimal paid tier — keep `web` and `api` free regardless. Note also Koyeb may require a credit card in some regions even on the free Hobby plan; pick a region that doesn't if avoiding a card matters.

---

## Repo prerequisites for clean deploys

Claude Code should ensure these exist so each platform builds the right app from the monorepo.

### 1. Each app builds independently
- Root `package.json` uses pnpm workspaces + Turborepo (already in MVP.md).
- Each app has its own `build` and `start` script and can be built in isolation via Turborepo filters, e.g. `pnpm turbo run build --filter=web`.

### 2. `apps/web` — Vercel config
- Vercel project "Root Directory" set to `apps/web`.
- Because it's a pnpm monorepo, set the install command to run at repo root so the workspace resolves. Provide a `vercel.json` in `apps/web` only if overrides are needed; otherwise configure in the dashboard.
- Build command: `pnpm turbo run build --filter=web` (or Vercel's Next.js default if root directory handling resolves the workspace).
- Output: Next.js default.

### 3. `apps/api` and `apps/agent` — Koyeb config
Koyeb can build from a Dockerfile or buildpack. For a pnpm monorepo, a small per-app Dockerfile is the most predictable. Claude Code should create:

- `apps/api/Dockerfile`
- `apps/agent/Dockerfile`

Each Dockerfile pattern (Node 20, pnpm, build only its app):
```dockerfile
# apps/api/Dockerfile  (agent is analogous, swap api->agent and the start cmd)
FROM node:20-slim AS base
RUN corepack enable && corepack prepare pnpm@9 --activate
WORKDIR /app

# Copy workspace manifests first for better caching
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/api/package.json ./apps/api/package.json

RUN pnpm install --frozen-lockfile

# Copy sources and build just this app + its package deps
COPY . .
RUN pnpm turbo run build --filter=api

EXPOSE 3001
CMD ["pnpm", "--filter", "api", "start"]
```

For `apps/agent`, there's no `EXPOSE` (not an HTTP service) and the start command runs the LiveKit worker:
```dockerfile
# apps/agent/Dockerfile (tail)
CMD ["pnpm", "--filter", "agent", "start"]
```

- On Koyeb, create TWO services from the same repo: one pointing at `apps/api/Dockerfile` (type: Web service, port 3001), one at `apps/agent/Dockerfile` (type: **Worker** — no public port, no health check on a port).
- Set each service's autodeploy to the `main` branch (Git push → redeploy).

---

## Environment variables per platform

Never commit secrets. Set these in each platform's dashboard.

### Vercel (`apps/web`)
```
NEXT_PUBLIC_API_URL=https://<api-service>.koyeb.app
NEXT_PUBLIC_LIVEKIT_URL=wss://<project>.livekit.cloud
```

### Koyeb — `apps/api`
```
PORT=3001
JWT_SECRET=<generate a real secret>
LIVEKIT_URL=wss://<project>.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
GOOGLE_API_KEY=...            # vision + LLM
DEEPGRAM_API_KEY=...          # if api ever needs it; primarily agent
CARTESIA_API_KEY=...          # read-aloud endpoint
TTS_DEFAULT_SPEED=0.9
VISION_PROVIDER=google
VISION_MODEL=gemini-2.5-flash
MOCK_PARENT_EMAIL=parent@curio.local
MOCK_PARENT_PASSWORD=demo1234
CORS_ORIGIN=https://<web-app>.vercel.app   # lock CORS to the Vercel origin
```

### Koyeb — `apps/agent`
```
LIVEKIT_URL=wss://<project>.livekit.cloud
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
GOOGLE_API_KEY=...
DEEPGRAM_API_KEY=...
CARTESIA_API_KEY=...
STT_PROVIDER=deepgram
LLM_PROVIDER=google
LLM_MODEL=gemini-2.5-flash
TTS_PROVIDER=cartesia
TTS_VOICE=<warm Cartesia voice id>
API_BASE_URL=https://<api-service>.koyeb.app   # agent fetches lesson from api
```

---

## CORS / origin wiring (don't skip — common mobile failure)

Because web (Vercel) and api (Koyeb) are on different origins:
- `apps/api` must enable CORS for the Vercel origin (`CORS_ORIGIN` above). NestJS: `app.enableCors({ origin: process.env.CORS_ORIGIN })`.
- The LiveKit token is minted by `apps/api` and used by `apps/web` to connect directly to LiveKit Cloud — that connection is web→LiveKit, not web→api, so no CORS issue there.
- `// PROD: tighten CSP, set secure cookies, real origin allowlist.`

---

## Deploy order (for the operator)

1. **LiveKit Cloud**: create project, copy `LIVEKIT_URL`, API key + secret.
2. **Get provider keys**: Google AI Studio (Gemini), Deepgram, Cartesia.
3. **Koyeb — api**: connect repo, point at `apps/api/Dockerfile`, set env vars, deploy. Note the public URL.
4. **Koyeb — agent**: same repo, point at `apps/agent/Dockerfile`, type Worker, set env vars (including `API_BASE_URL` from step 3), deploy. Confirm logs show it registered with LiveKit.
5. **Vercel — web**: import repo, root dir `apps/web`, set `NEXT_PUBLIC_*` env vars (API URL from step 3), deploy. Note the public URL.
6. **Back to Koyeb api**: set `CORS_ORIGIN` to the Vercel URL from step 5, redeploy api.
7. **Test from phone**: open the Vercel URL on the phone, allow camera + mic, run the full flow (photo → concepts → voice quiz). Both must work because all surfaces are HTTPS.

---

## Verifying the mobile path specifically

- Camera: the `/` capture screen should open the rear camera on a phone (`<input capture>` / `getUserMedia`). If it errors, it's almost always a non-HTTPS context — confirm you're on the `https://` Vercel URL, not an IP.
- Mic: the `/quiz` screen requests mic on connect; iOS Safari prompts per-session. Handle denial gracefully (already in MVP.md error cases).
- See MVP.md "Accessibility" + the note that the 3-column quiz layout is desktop/tablet-first. The capture screen should be usable on a phone; the quiz screen may be cramped — documented as such.

---

## What this deployment does NOT do (document in README)
- No custom domain (use the platform-provided URLs).
- No CDN tuning, no edge config beyond Vercel defaults.
- No autoscaling, no replicas (single instance per service).
- No persistent storage (sessions are in-memory; a redeploy/restart wipes them).
- No observability/tracing across the STT/LLM/TTS pipeline. `// PROD: OTEL.`
- No CI gating before deploy (Git push deploys directly). `// PROD: required checks, preview environments, promotion flow.`
- Free-tier RAM caps may require bumping the agent to a paid tier under load.
