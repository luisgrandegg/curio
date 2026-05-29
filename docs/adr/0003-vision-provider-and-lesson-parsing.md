# ADR-0003: VisionProvider abstraction and defensive lesson parsing

- **Status:** Accepted
- **Date:** 2026-05-28
- **Deciders:** Curio team
- **Related:** backlog B03; ADR-0001; MVP "Provider Abstraction"

## Context

Phase 1 turns a lesson photo into a structured `Lesson` via a multimodal LLM
(Gemini by default). Two risks: (1) the Constitution forbids SDK calls leaking
into business logic, and (2) LLMs return unreliable text — markdown fences,
surrounding prose, missing fields, too few/many concepts — which must not crash
the endpoint or reach a child as a raw error.

## Decision

Define a `VisionProvider` interface (`extractLesson(imageBase64, age, subject)`)
selected by an env-driven factory (default `google`), injected via a Nest token.
The Gemini implementation depends only on a `VisionGenerate` function; the sole
`@google/genai` call lives in `gemini-client.ts` (lazy client, marked `// TEST:`,
excluded from coverage). All model output goes through a **pure**
`parseLessonResponse` that strips fences/prose, validates shape, assigns missing
concept ids, clamps to 5–8 concepts, and throws `LessonParseError` otherwise.
`subject`/`childAge` come from the trusted request, never the model. The
controller maps `LessonParseError` → **422** with a kind, retryable message.

Alternatives rejected: calling the SDK directly in the service (couples us to
Gemini, untestable); trusting model JSON as-is (brittle); a JSON-schema
validator dependency (the hand-written guard is small and gives friendlier
errors).

## Consequences

- Swapping vision models is a factory case + a `VisionGenerate`; nothing else
  changes. The parser is reused unchanged.
- The parser is unit-tested across fences/prose/garbage/clamping; the live
  Gemini call is the only untested line, verified manually with a real key.
- Lessons are held in an in-memory `LessonsStore` (exported for B04 sessions).
  `// PROD:` persistence, EXIF strip / virus scan / size + mime validation.
