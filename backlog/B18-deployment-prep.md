# B18 — Deployment prep

**MVP step:** 20 · **Depends on:** B17 · **Status:** ☐

> Produce the config/files and hand the operator the steps. Do NOT run deploys.
> See `DEPLOYMENT.md` for the full operator guide.

## Goal

Everything in the repo needed for the Vercel (web) + Koyeb (api + agent)
free-tier deployment, with the two non-negotiables satisfied: the agent is
always-on, and all surfaces are HTTPS (camera/mic requirement).

## Progress (incremental)

- ☑ **API image** — `apps/api/Dockerfile` + `.dockerignore` + ADR-0004 landed
  early (build/start commands verified; container build pending operator, no
  Docker daemon in dev sandbox).
- ☐ **web image / Vercel config** — folded into B05 (real Next.js app).
- ☐ **agent image** (always-on worker) — folded into B07 (real LiveKit worker).
- ☐ **Tie-together** — operator runbook + CORS origin wiring once all three exist.

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
