# B07 — Agent base + providers ⭐

**MVP step:** 8 · **Depends on:** B04 · **Status:** ☑ Done

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

## Outcome (done)

- `apps/agent` is now a real `@livekit/agents` v1.4 worker (plain ESM).
  `providers/{types,config,factory}.ts` + README; `main.ts` connects, builds the
  bundle, loads Silero VAD, starts an `AgentSession`, and `say`s a fixed greeting.
- `parseProviderConfig(env)` defaults to Deepgram + Gemini + Cartesia and
  rejects unsupported providers; `createProviders` switches per axis with an
  `assertNever` exhaustive default (the only `@livekit/agents-plugin-*` imports).
  Decision recorded in **ADR-0009** (cascaded pipeline, not Realtime).
- 6 tests, **100%** coverage on `config` + `factory` (plugins mocked);
  `main.ts` excluded. Typechecks against the real SDK; `tsc` build emits dist.
- **Operator-verified step:** running the worker (audio reaching `/quiz`) needs
  LiveKit + Deepgram/Cartesia/Gemini keys — can't run in CI. Flagged in the PR.
  SDK is stable v1.4, so low drift risk, but surface any API change on first run.
