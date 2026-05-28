# B12 — Read-aloud endpoint

**MVP step:** 14 · **Depends on:** B02 · **Status:** ☐

## Goal
`POST /tts/read-aloud` synthesizes text and returns audio **plus word-level
timestamps**, reusing the same TTS provider abstraction as the agent in a
non-LiveKit/REST context.

## Scope
- `tts/` module in `apps/api` using the shared `TTSProvider` (default Cartesia).
- `POST /tts/read-aloud` `{ text }` → audio + `word_timestamps`.
- Cartesia word timestamps are on by default — use them; do NOT integrate a
  third-party reader.
- `// PROD:` cache by text hash; rate-limit; cap text length.

## Acceptance criteria
- Endpoint returns playable audio and per-word timestamps for given text.
- Uses the same provider factory/abstraction as the agent (proves it sits at
  the right level — real-time AND on-demand).

## Verification
- `curl -XPOST .../tts/read-aloud -d '{"text":"..."}'` → audio + timestamps;
  confirm timestamps come back.

## Test plan / coverage
- Unit: request validation; provider invoked with `speed`; response shape
  (audio + timestamps). Mock the TTS provider.
- ≥ 70% coverage on the controller/service. `// TEST:` for live Cartesia.
