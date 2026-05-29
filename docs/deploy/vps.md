# Deploying Curio (VPS + Vercel)

Hosting per [ADR-0005](../adr/0005-self-host-vps-instead-of-koyeb.md): a single
small **VPS** runs the API + the always-on **agent** via `docker-compose`, with
**Caddy** terminating automatic HTTPS; the **web** app is on **Vercel**. The two
non-negotiables: the agent must stay always-on, and every surface must be HTTPS
(browser camera/mic + LiveKit need a secure context).

> Do not commit secrets. Everything is configured through `.env` (see
> `.env.example`) and the Vercel dashboard.

## 0. Prerequisites

- A small VPS (~$5/mo, e.g. Hetzner / DigitalOcean), Docker + Compose installed.
- A **hostname** for the API (a cheap domain or a free dynamic-DNS name), with a
  DNS **A record** pointing at the VPS IP. Caddy needs it to issue a cert.
- Keys: LiveKit Cloud (URL + key + secret), Google (Gemini), Deepgram, Cartesia.

## 1. API + agent on the VPS

```bash
git clone <repo> && cd curio
cp .env.example .env        # then fill in every value, including:
#   API_DOMAIN=api.your-domain.example      # the API hostname (for Caddy)
#   CORS_ORIGIN=https://<your-web>.vercel.app
#   LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET
#   GOOGLE_API_KEY / DEEPGRAM_API_KEY / CARTESIA_API_KEY / JWT_SECRET
docker compose up -d --build
```

This starts three containers: `api` (internal :3001), `agent` (no ports — it
dials out to LiveKit), and `caddy` (:80/:443, auto-HTTPS for `$API_DOMAIN`).
Verify:

```bash
curl https://api.your-domain.example/health   # {"ok":true}
docker compose logs -f agent                   # registered with LiveKit
```

## 2. Web on Vercel

- Import the repo; set **Root Directory** to `apps/web` (Vercel detects the pnpm
  workspace and installs from the repo root).
- Environment variables:
  - `NEXT_PUBLIC_API_URL=https://api.your-domain.example`
  - `NEXT_PUBLIC_LIVEKIT_URL=wss://<project>.livekit.cloud`
- Deploy. Note the `https://<your-web>.vercel.app` URL.

## 3. Wire CORS, then test

- Put the Vercel URL in `CORS_ORIGIN` on the VPS `.env`, then
  `docker compose up -d` to restart the API with it.
- From a **phone**, open the Vercel URL, allow camera + mic, and run the full
  flow: photo → concepts → Start quiz → talk with Pip → study summary. All
  surfaces are HTTPS, so camera/mic work.

## What this does NOT do (`// PROD:`)

- No custom CDN, autoscaling, or replicas (single instance per service).
- No persistent storage — sessions/lessons are in-memory; a redeploy wipes them.
- No CI gate before deploy, no observability/tracing across STT/LLM/TTS.
- Free-tier RAM caps: the agent runs the STT→LLM→TTS pipeline and is the most
  likely to need a bigger box first.
