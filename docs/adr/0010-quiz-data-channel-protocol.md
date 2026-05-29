# ADR-0010: Quiz updates over a typed LiveKit data channel

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B08; ADR-0009 (agent); `@curio/types` `QuizMessage`

## Context

While Pip runs the spoken quiz, the web app needs structured updates (answer
recorded, concept mastered, summary) to drive the transcript/scorecard. Options:
a separate WebSocket from the agent to the web, or LiveKit's in-room data
channel. The agent and web are already joined to the same room.

## Decision

Publish all agent→frontend updates as a **typed `QuizMessage`** (discriminated
union in `@curio/types`) JSON-encoded over the **LiveKit data channel**,
reliably, on the shared **`quiz` topic** (`QUIZ_DATA_TOPIC`). No separate
WebSocket. The agent's tools (`recordAnswer`, `updateScorecard`) build the
message and call `publishQuizMessage(publisher, msg)`; the publisher is the
room's local participant, abstracted behind a tiny `DataPublisher` interface so
the logic is testable without the SDK. The `recordAnswer` **verdict is the
model's honest judgement** — warmth goes to the child in speech, truth goes to
the scorecard in data.

Alternatives rejected: a separate WebSocket (another connection, auth, and
lifecycle to manage when the room already carries reliable data); untyped JSON
blobs (the shared `QuizMessage` union keeps agent and web in lockstep).

## Consequences

- One transport (the room) carries audio + structured updates; B09 consumes the
  same `quiz` topic on the web.
- The message contract lives in `@curio/types`, so a change is a compile error
  on both sides. The agent now depends on `@curio/types` at runtime.
- `llm.tool` definitions live in `quiz/tools.ts`; the publish + message logic is
  unit-tested (fake publisher). Live tool-calling is operator/B14-verified.
