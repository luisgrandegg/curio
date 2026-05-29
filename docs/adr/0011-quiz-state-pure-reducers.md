# ADR-0011: Quiz UI state as pure reducers over the data channel

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B09; ADR-0008 (web room); ADR-0010 (data protocol)

## Context

`/quiz` must render a live transcript and scorecard from two LiveKit streams:
`TranscriptionReceived` segments and `quiz`-topic data messages. We want this
logic unit-tested without a live room, and the panels accessible (a non-reader
must perceive state).

## Decision

Split state from transport. **Pure reducers + a decoder live in `lib/`**
(`reduceTranscript` upserts segments by id so a final replaces its partial;
`decodeQuizMessage` validates bytes → `QuizMessage`; `seedScorecard` +
`reduceScorecard` fold messages immutably). **Thin hooks in `hooks/`**
(`useTranscript`, `useScorecard`) subscribe via `useRoomContext` + RoomEvent and
dispatch the reducers; they're excluded from coverage (SDK glue, verified by
`next build`). **Presentational panels** (`TranscriptPanel`, `ScorecardPanel`)
render from props and are fully tested. Scorecard status is shown as **icon +
label + colour** (never colour alone); transcript is a `role="log"`
`aria-live="polite"` region; mastery animation is `motion-safe:` only.

Alternatives rejected: doing the folding inside the hooks (couples logic to the
SDK, hard to test); a global store (overkill for one screen's ephemeral state).

## Consequences

- The transcript/scorecard logic is tested at ~99%; the live wiring is a thin,
  build-checked layer over it.
- Child identity (`child-<sessionId>`) distinguishes child vs tutor segments —
  no dependency on SDK participant-kind specifics.
- `summary` messages are tracked now and surfaced by the B11 study-summary modal.
