# ADR-0014: Read-aloud reuses the TTS-provider abstraction over REST

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B12; ADR-0003/0006/0009 (provider boundaries); MVP
  "Accessibility — read-aloud"

## Context

Dyslexia-friendly read-aloud needs on-demand TTS that returns audio **plus
word-level timestamps** (to drive karaoke highlighting). The agent already does
TTS, but in real time inside LiveKit. The MVP's design point: the same TTS
abstraction should also serve a one-shot REST call — proving the boundary sits
at the right level.

## Decision

Add a REST `TtsProvider` interface (`synthesize(text, speed) →
ReadAloudResponse`) in `apps/api`, selected by an env factory (default
Cartesia), injected via a Nest token — mirroring `VisionProvider`/`TokenMinter`.
`CartesiaTtsProvider` depends only on a `CartesiaSynthesize` function; the sole
Cartesia call lives in `cartesia-client.ts` (SSE with `add_timestamps`, marked
`// TEST:`, coverage-excluded). `POST /tts/read-aloud` validates a `ReadAloudDto`
(text 1–2000, optional speed 0.6–2.0) and returns audio + words, defaulting
speed from `TTS_DEFAULT_SPEED`.

This is a **separate REST shape** from the agent's streaming LiveKit TTS, not a
literal code-share — the abstraction (a provider returning synthesized speech)
is what's exercised in two contexts, as the MVP intended.

Alternatives rejected: routing read-aloud through the LiveKit agent (wrong shape
— it's a one-shot HTTP request, not a room turn); a third-party reader widget
(the MVP explicitly reuses our TTS layer).

## Consequences

- The web (B13) gets `{ audioBase64, mimeType, words }` to highlight word-by-word.
- Only `cartesia-client.ts` knows Cartesia; swapping TTS vendors is a factory
  case. The live SSE call is operator-verified (needs a key).
- `// PROD:` cache by text hash, rate-limit, and cap text length.
