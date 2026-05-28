# B06 — Web LiveKit connect

**MVP step:** 7 · **Depends on:** B04, B05 · **Status:** ☐

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
