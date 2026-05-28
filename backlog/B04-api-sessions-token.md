# B04 — Sessions + LiveKit token

**MVP step:** 5 · **Depends on:** B03 · **Status:** ☐

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
