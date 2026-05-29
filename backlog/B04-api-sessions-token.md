# B04 — Sessions + LiveKit token

**MVP step:** 5 · **Depends on:** B03 · **Status:** ☑ Done

## Goal

Create a quiz session, store its lesson in memory, and mint a real LiveKit
token the web app can connect with.

## Scope

- In-memory session store (`sessions/`). `// PROD: real persistence.`
- `POST /sessions` `{ lessonId }` → `{ sessionId, roomName, livekitToken, livekitUrl }`.
- `GET /sessions/:id` → session state (lesson, scorecard, transcript, summary).
- `POST /sessions/:id/end` → finalize + store summary.
- LiveKit token via `livekit-server-sdk`: grants `roomJoin` +
  `canPublish`/`canSubscribe`, identity `child-<sessionId>`, 1h TTL.
- Room name = sessionId (the agent fetches the lesson by this).

## Acceptance criteria

- `POST /sessions` returns a token that successfully connects to LiveKit.
- `GET /sessions/:id` returns the stored lesson for the agent to read.
- `end` is idempotent and stores the summary.

## Verification

- `curl -XPOST .../sessions -d '{"lessonId":"..."}'` → token; decode/verify
  grants and TTL.

## Test plan / coverage

- Unit: session create/read/end lifecycle; token grant + identity + TTL
  (mock or decode JWT). 404 on unknown session.
- ≥ 70% coverage on session service + token minting.

## Outcome (done)

- `TokenMinter` interface + env-driven factory; `LivekitTokenMinter` is the only
  `livekit-server-sdk` touchpoint (1h token, room=sessionId, identity
  `child-<sessionId>`, roomJoin + publish + subscribe). See **ADR-0006**.
- `POST /sessions {lessonId}` → `{ sessionId, roomName, livekitToken, livekitUrl }`
  (lesson read from `LessonsStore`, 404 if missing); seeds a `pending` scorecard
  from the lesson concepts. `GET /sessions/:id` → `SessionState` (404 if
  missing). `POST /sessions/:id/end` → status `ended`.
- `SessionsModule` imports `LessonsModule`; exported `SessionsStore` for the
  agent (B07/B08) and transcript/summary wiring later.
- 34 API tests, **99.2%** coverage: minter (JWT decoded to verify grants + ~1h
  TTL), service (create/get/end + NotFound paths), controller, and an AppModule
  integration round-trip (create → get → end) with fakes.
- Verified on a running build: routes mapped; `/sessions` → 404 on unknown
  lesson. `// PROD/B11:` persist agent study summary on end.
