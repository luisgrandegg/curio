# B09 — Web transcript + scorecard

**MVP step:** 10 · **Depends on:** B06, B08 · **Status:** ☐

## Goal
The center transcript and right-hand scorecard render live from LiveKit
transcription + `quiz` data messages.

## Scope
- `useTranscript()` — `RoomEvent.TranscriptionReceived`; partial→final
  replacement per participant.
- `useScorecard()` — `RoomEvent.DataReceived` on `topic: 'quiz'`; applies
  `recordAnswer` / `updateScorecard` / `summary` immutably.
- `TranscriptPanel` — `role="log" aria-live="polite"`; tutor left, child right;
  partials italic; auto-scroll.
- `ScorecardPanel` — concept cards (pending grey / mastered green star /
  needs-review amber), progress bar ("Question 3 of 6"), mastery celebration
  micro-animation (respect `prefers-reduced-motion`).

## Acceptance criteria
- Transcript streams and finalizes correctly per speaker.
- Scorecard updates as Pip records answers and marks concepts.
- States use icon + label + colour (never colour alone).

## Verification
- Run a quiz; watch transcript stream and scorecard cards flip state live.

## Test plan / coverage
- Unit: `useTranscript` partial/final reducer; `useScorecard` reducer for each
  message type (immutability); panel render per state.
- ≥ 70% coverage on both hooks' reducers.
