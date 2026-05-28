# B02 — API base

**MVP step:** 3 · **Depends on:** B00, B01 · **Status:** ☑ Done

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

## Outcome (done)

- NestJS 11 (ESM) bootstrap with global `ConfigModule`, `enableCors`
  (`CORS_ORIGIN`), and a `ValidationPipe`.
- `GET /health` → `{ ok: true }`; `POST /auth/login` (validated `LoginDto`) →
  `{ token }` via `JwtModule` (1h TTL); bad creds → 401, invalid body → 400.
- Build/test toolchain decision recorded in **ADR-0002** (ESM + `tsc` build +
  SWC for Vitest/dev, since esbuild can't emit decorator metadata).
- Tests: `HealthController`, `AuthService` (JWT verify + both failure paths),
  and an `AppModule` integration test — **100%** coverage (18/18 stmts,
  14/14 branches, 6/6 funcs); `main.ts` bootstrap excluded.
- Verified against a running build: `/health`, login good/bad/invalid via curl.
- `// TEST:` HTTP-level CORS/pipe e2e deferred.
