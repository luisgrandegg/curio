# B07 — Agent base + providers ⭐

**MVP step:** 8 · **Depends on:** B04 · **Status:** ☐

> Load-bearing checkpoint: first audio from Pip. Validating the provider
> pipeline and that audio reaches `/quiz` is the whole point of this step.

## Goal

The LiveKit worker joins a room and speaks a fixed greeting via TTS, using
providers from a config-driven factory.

## Scope

- `apps/agent/src/main.ts` — `defineAgent`, worker entry ("Pip").
- `providers/types.ts` — `ProviderConfig`, `ProviderBundle`.
- `providers/factory.ts` — `createProviders(config) → { stt, llm, tts }`,
  `satisfies never` exhaustive default. Defaults: Deepgram + Gemini + Cartesia.
- `providers/README.md` — abstraction + "next step: hexagonal ports/adapters".
- Cascaded STT → LLM → TTS pipeline (not Gemini Realtime).
- Provider selection from env (`STT_PROVIDER`, `LLM_PROVIDER`, etc.).

## Acceptance criteria

- Worker registers with LiveKit and joins the room for a session.
- Pip speaks an audible fixed greeting that reaches the `/quiz` client.
- Swapping a provider env var changes the provider with no logic changes.

## Verification

- Start a quiz; hear Pip's greeting in `/quiz`. Check worker logs show
  registration + room join.

## Test plan / coverage

- Unit: `createProviders` for each provider branch + exhaustive default;
  env-driven defaults. Mock LiveKit plugin constructors.
- ≥ 70% coverage on the factory. `// TEST:` for live-audio e2e.
