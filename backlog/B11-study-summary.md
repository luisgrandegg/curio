# B11 — Study summary (agent + modal)

**MVP steps:** 12, 13 · **Depends on:** B08, B09 · **Status:** ☐

## Goal

Pip wraps up by generating a study summary; the web app shows a friendly recap
modal at the end of the quiz.

## Scope

- Agent: `generateStudySummary()` tool — builds `StudySummary` from session
  state, publishes a `summary` data message, returns `{ generated: true }`.
- Pip calls it when all concepts are covered or `maxQuestions` is reached, then
  says a warm, proud goodbye.
- Web: `StudySummaryModal` — "what you did great", "let's practice next time";
  parent-facing "Copy summary" button; focus management on open.

## Acceptance criteria

- Summary reflects real scorecard state (mastered vs needs-review).
- Modal is keyboard-accessible with managed focus.
- Tone is encouraging; nothing makes the child feel they failed.

## Verification

- Finish a quiz; Pip wraps up and the summary modal appears with correct
  mastered/review lists.

## Test plan / coverage

- Unit: summary builder from session state; modal render from a `StudySummary`;
  copy-to-clipboard; focus trap.
- ≥ 70% coverage on summary builder + modal logic.
