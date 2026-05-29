# ADR-0013: The agent owns the quiz tally for the study summary

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B11; ADR-0010 (data channel); ADR-0011 (web reducers)

## Context

At the end of a quiz Pip must produce a `StudySummary` (mastered vs to-review +
a warm closing line). The truth about each concept's status lives in the
verdicts/statuses Pip recorded during the session. Who assembles the summary —
the agent or the web app?

## Decision

The **agent owns the tally**. A small in-memory `QuizTracker` (seeded from the
lesson concepts) is updated by `updateScorecard`; `generateStudySummary` reads
its snapshot, builds the summary with a **pure `buildStudySummary`** (whose
`encouragement` is kind in every branch), publishes it as a `summary`
`QuizMessage`, and returns `{ generated: true }`. The web simply renders the
received summary in `StudySummaryModal` (a labelled, focus-managed dialog with a
parent-facing "Copy summary"). The web already tracks `summary` from the data
channel (B09), so no extra fetch.

Alternatives rejected: the web computing the summary from its scorecard (the
agent has the authoritative verdicts and the question budget; duplicating the
logic risks drift); persisting via the API before showing it (unnecessary for
the modal — `// PROD:` persist on `/sessions/:id/end`).

## Consequences

- One source of truth for the summary (the agent); the web is a pure renderer.
- The encouragement copy is unit-tested across all-mastered / none / mixed —
  always kind, never implies failure.
- `// PROD:` persist the summary to the session on end for later parent review.
