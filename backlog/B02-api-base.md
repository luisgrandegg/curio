# B02 — API base

**MVP step:** 3 · **Depends on:** B00, B01 · **Status:** ☐

## Goal

NestJS 11 app boots with config, CORS, and a health check.

## Scope

- `apps/api/src/main.ts` + `app.module.ts` bootstrap.
- `ConfigModule` reading env (PORT, JWT_SECRET, provider vars, CORS_ORIGIN).
- `app.enableCors({ origin: process.env.CORS_ORIGIN })`.
- `GET /health` returning `{ ok: true }`.
- Mock parent auth: `POST /auth/login` returns a JWT. `// PROD: real auth.`

## Acceptance criteria

- `pnpm dev:api` starts on `PORT` (default 3001).
- `GET /health` returns 200.
- `POST /auth/login` with mock creds returns a JWT; bad creds → 401.

## Verification

- `curl localhost:3001/health` → `{ ok: true }`.
- `curl -XPOST localhost:3001/auth/login -d '{...}'` → token.

## Test plan / coverage

- e2e/unit: health 200; login success + failure paths; config loads.
- ≥ 70% coverage on auth controller/service and config wiring.
