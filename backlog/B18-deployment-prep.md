# B18 — Deployment prep

**MVP step:** 20 · **Depends on:** B17 · **Status:** ☑ Done

> Produce the config/files and hand the operator the steps. Do NOT run deploys.
> See `DEPLOYMENT.md` for the full operator guide.

## Goal

Everything in the repo needed for the Vercel (web) + Koyeb (api + agent)
free-tier deployment, with the two non-negotiables satisfied: the agent is
always-on, and all surfaces are HTTPS (camera/mic requirement).

## Hosting platform

Koyeb (per `DEPLOYMENT.md`) now requires a card / ~$30/mo, so we switched to a
single small **VPS** running api + agent via `docker-compose` (Caddy for HTTPS),
web on **Vercel**. See **ADR-0005** (supersedes the Koyeb choice).

## Progress (incremental)

- ☑ **API image** — `apps/api/Dockerfile` + `.dockerignore` + ADR-0004.
- ☑ **agent image** — `apps/agent/Dockerfile` (no EXPOSE; persistent worker;
  `pnpm --filter agent start`).
- ☑ **docker-compose.yml + Caddyfile** — api + always-on agent + Caddy
  (auto-HTTPS for `$API_DOMAIN`). Validated with `docker compose config`.
- ☑ **VPS runbook** — `docs/deploy/vps.md` (provision → `.env` → compose up →
  Vercel for web → CORS wiring → phone test).
- ☑ **web / Vercel** — documented in the runbook (root dir `apps/web`).

## Scope

- `apps/api/Dockerfile` — Node 20, pnpm, builds only `api`, EXPOSE 3001,
  starts the web service.
- `apps/agent/Dockerfile` — same base, no EXPOSE, starts the LiveKit **worker**
  (always-on; must not scale-to-zero/sleep).
- `apps/web` — Vercel config (root dir `apps/web`; workspace-aware install;
  `vercel.json` only if overrides needed).
- Confirm each app builds in isolation via `pnpm turbo run build --filter=<app>`.
- CORS: `apps/api` enables CORS for the Vercel origin via `CORS_ORIGIN`.
- A concise operator runbook (or link to `DEPLOYMENT.md`) with the deploy order.

## Acceptance criteria

- `docker build` succeeds for both `api` and `agent` Dockerfiles.
- Agent service is configured as a worker (no public port / port health check).
- No secrets committed; env vars documented per platform.

## Verification

- Build both images locally; confirm agent image starts the worker and api
  image serves on 3001. Operator follows `DEPLOYMENT.md` deploy order.

## Test plan / coverage

- Infra item: validate Dockerfiles build and start commands resolve. No unit
  coverage target; `// PROD:` note that there's no CI gating before deploy.

## Outcome (done)

- `apps/agent/Dockerfile` mirrors the api image (manifests-first frozen install,
  `turbo run build --filter=agent`, `HUSKY=0`); no EXPOSE — it's a persistent
  worker. API Dockerfile comment de-Koyeb'd → VPS/Caddy.
- Root `docker-compose.yml` (api + agent + Caddy) + `Caddyfile` (auto-HTTPS for
  `$API_DOMAIN`, reverse-proxy to api); `API_DOMAIN` added to `.env.example`.
- `docs/deploy/vps.md` — the operator runbook (VPS + Vercel, CORS, phone test).
- Verified: clean `turbo run build --filter=agent` + start entry; `docker
compose config` validates all three services. The actual `docker build` /
  `compose up` is operator-run (no Docker daemon in the dev sandbox).
- **Backlog complete (19/19).**
