# B16 — Error states + polish

**MVP step:** 18 · **Depends on:** B09, B10, B11 · **Status:** ☑ Done

## Goal

Every failure mode degrades into a kind, kid-friendly state with a retry — no
white screens, no scary errors.

## Scope (build each)

- **Photo unreadable / no concepts:** "Hmm, I couldn't read that page — try
  another photo with good light." + retry.
- **Mic permission denied:** kid-friendly empty state + retry.
- **Token minting fails:** toast + retry, no white screen.
- **Agent never joins (10s):** "Pip is taking a nap — let's try again." + retry
  (detect via `RoomEvent.ParticipantConnected`).
- **Connection lost:** auto-reconnect banner ("Reconnecting to Pip..."), resume
  transcript.
- **Empty/garbled STT:** Pip re-asks gently (prompt-handled).
- **Refresh mid-quiz:** session lost (acceptable; documented).
- General visual polish per MVP styling notes.

## Acceptance criteria

- All listed error cases show the specified friendly state and recover.
- No raw errors or blank screens reach the child.

## Verification

- Force each failure (deny mic, kill agent, drop network, bad photo) and
  confirm the friendly state + retry.

## Test plan / coverage

- Unit: each error branch renders its friendly state; 10s agent-join timeout;
  reconnect banner toggling.
- ≥ 70% coverage on error-handling logic.

## Outcome (done)

- Already handled before this item: unreadable photo / no concepts (`/`),
  token/session-start failure (`/review`), garbled STT (Pip re-asks, prompt).
- New `lib/quiz-status.ts` (`quizBanner(phase)`) + `QuizBanner` cover the `/quiz`
  states: connecting, waiting, **Pip-didn't-join (10s) → retry**, reconnecting,
  **mic-denied → retry**, failed → retry. Kind copy, `role=status/alert`.
- `/quiz` derives the phase from `useConnectionState` + `useRemoteParticipants`
  - a 10s timer + `onMediaDeviceFailure`/`onError`; Retry reloads.
- ~99% web coverage on the mapping + banner; page/LiveKit glue excluded.
- Refresh mid-quiz loses the session (acceptable; documented for README B17).
