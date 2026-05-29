# ADR-0008: LiveKit on the web — declarative room at the page level

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B06; ADR-0006 (token minting); ADR-0007 (web build)

## Context

The `/quiz` screen must join a LiveKit room with the token minted by
`POST /sessions`, request the mic, and let the child end the quiz. We want the
testable logic (HTTP, storage, presentation) to stay unit-testable without a
live WebRTC connection, and we don't want `livekit-client` imported into test
files.

## Decision

Use `@livekit/components-react`'s **declarative `LiveKitRoom`** as the single
connection point, rendered only in `app/quiz/page.tsx` (which is excluded from
coverage and verified by `next build`). Everything else is plain and tested:
`createSession`/`endSession` in the api-client, a `session-store`
(sessionStorage) bridging `/review` → `/quiz`, a presentational `QuizLayout`
(three labelled landmarks), and `AudioControls` (mute via `useLocalParticipant`,
End quiz via a callback) — tested with the LiveKit hook mocked.

`/review` "Start quiz" → `createSession(lesson.id)` → `saveSession` → `/quiz`.
`/quiz` redirects home if there's no session; `onError` shows a kind message;
End quiz best-effort-calls `endSession`, clears the store, returns home.

Alternatives rejected: an imperative `Room` wrapped in a custom hook (more code,
re-implements what `LiveKitRoom` gives declaratively); importing `livekit-client`
into shared modules (drags the heavy SDK into jsdom tests).

## Consequences

- The room/connection is verified by build + manual run (needs a real LiveKit
  project); unit tests cover the surrounding logic at 100%.
- Panels are placeholders; B09/B10 fill transcript, scorecard, and avatar state.
- Robust mic-denial / agent-timeout / reconnect handling is deferred to B16;
  B06 ships a basic friendly `onError` only.
