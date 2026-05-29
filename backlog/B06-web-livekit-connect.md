# B06 — Web LiveKit connect

**MVP step:** 7 · **Depends on:** B04, B05 · **Status:** ☑ Done

## Goal

`/quiz` connects to a LiveKit room with a minted token and the child's own
participant is present.

## Scope

- `/review` "Start quiz" → `POST /sessions` → navigate to `/quiz`.
- `useLiveKitSession()` — token fetch + connect + `endQuiz()` (calls
  `/sessions/:id/end`).
- `LiveKitRoom` + `AgentSessionProvider` from `@livekit/components-react`.
- Three-panel layout shell (avatar / center / scorecard) — panels filled later.
- `AudioControls` — mute toggle (`useLocalParticipant`), End Quiz.

## Acceptance criteria

- Connecting to the room succeeds; local participant visible.
- Mic permission requested on connect; denial handled gracefully.
- End Quiz disconnects and calls the end endpoint.

## Verification

- From `/review`, start a quiz; `/quiz` shows "connected" and own participant.

## Test plan / coverage

- Unit: `useLiveKitSession` token-fetch + connect + end flow (mock the LiveKit
  client); mic-denied branch.
- ≥ 70% coverage on the session hook.

## Outcome (done)

- `/review` "Start quiz" → `createSession(lesson.id)` → `saveSession` → `/quiz`.
- `/quiz`: declarative `LiveKitRoom` (connect + audio) + `RoomAudioRenderer` +
  `QuizLayout`; redirects home if no session; friendly `onError`; End quiz
  best-effort `endSession` → clear → home. (Decision: ADR-0008 — room lives at
  the page level instead of a `useLiveKitSession` hook, which is simpler with
  the declarative component.)
- `QuizLayout`: three labelled landmarks (avatar / conversation / scorecard +
  controls); panels are placeholders for B09/B10. `AudioControls`: mute via
  `useLocalParticipant` + End quiz.
- 19 web tests, **100%** coverage on components/lib (api-client `createSession`/
  `endSession`, `session-store`, `QuizLayout`, `AudioControls` with LiveKit
  mocked); `/quiz` verified by `next build`.
- Mic-denial/agent-timeout/reconnect robustness deferred to B16 (basic
  `onError` only here). Connecting to a real room needs a LiveKit project.
