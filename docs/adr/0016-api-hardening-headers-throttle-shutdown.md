# ADR-0016: API hardening — security headers, per-IP throttle, graceful shutdown

- Status: Accepted
- Date: 2026-05-30
- Deciders: Curio team

## Context

`apps/api/src/main.ts` carried a standing `// PROD: graceful shutdown hooks,
helmet, request logging, rate limiting` marker. The API is published to the
public internet behind Caddy (ADR-0005) and calls paid providers (Gemini
vision, Cartesia TTS). Before real children use it we want three baseline
protections:

1. Security response headers (clickjacking, MIME sniffing, referrer leakage).
2. A request rate limit so an abusive burst can't run up the provider bills or
   starve a child's live session.
3. Graceful shutdown so a container restart drains in-flight requests instead
   of dropping a quiz mid-answer.

Constraints: deps are pinned and kept minimal; everything must be unit-testable
to hold the ≥70% coverage bar; the API is JSON-only and served cross-origin to
the web app (so a strict CSP would break nothing useful and risks breakage).

## Decision

- **Headers:** use `helmet` (the library the original marker named) in
  `main.ts`, with `contentSecurityPolicy: false` — a JSON API gains nothing from
  a default-src CSP and it would only risk breaking cross-origin use.
- **Throttle:** a hand-rolled, dependency-free fixed-window `RateLimiter`
  (`apps/api/src/security/rate-limit.ts`) behind a global `ThrottleGuard`
  (`APP_GUARD`) registered by `SecurityModule`. The limiter takes an injectable
  `now`, so the logic is fully deterministic in tests, and self-sweeps expired
  windows so its map stays bounded. Health checks are exempt. Limits are env-
  tunable (`RATE_LIMIT_MAX`, `RATE_LIMIT_WINDOW_MS`).
- **Shutdown:** `app.enableShutdownHooks()` plus `trust proxy` so `req.ip`
  reflects the real client through Caddy.

## Consequences

- The public surface is meaningfully harder to abuse with a few small,
  100%-covered files and one new pinned dep (`helmet`).
- The throttle is per-process and in-memory. `// PROD:` once the API runs more
  than one instance, back the limiter with a shared store (Redis). Marked in the
  source.
- Request logging from the original marker is still outstanding; a narrower
  `// PROD:` for a structured logger remains in `main.ts`.

## Alternatives considered

- **`@nestjs/throttler`** instead of a hand-rolled limiter: heavier and less
  transparent for what is a tiny fixed-window need; the custom limiter is
  simpler to reason about and test deterministically.
- **Hand-rolled headers** instead of helmet: rejected — helmet is the
  maintained, idiomatic choice and is exactly what the marker called for.
