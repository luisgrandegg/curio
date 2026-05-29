# ADR-0009: Agent — cascaded STT→LLM→TTS via a provider factory

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B07; ADR-0003/0006 (same provider-boundary pattern); MVP
  "Provider Abstraction"

## Context

The "Pip" worker (`@livekit/agents` v1.4) runs the spoken quiz. It must talk to
STT/LLM/TTS vendors without leaking SDK calls into agent logic, stay
unit-testable without a live room or API keys, and avoid the Node SDK's known
Gemini-Realtime issues. We also can't run the worker in CI (no keys/audio), so
the build must typecheck against the real SDK and tests must cover the
deterministic core.

## Decision

Use the **cascaded STT → LLM → TTS** pipeline (not Realtime). Selection is
config-driven: `parseProviderConfig(env)` → `createProviders(config)` returns a
`ProviderBundle` (`{ stt, llm, tts }` of LiveKit interfaces). The factory is the
only place that imports `@livekit/agents-plugin-*`; its `switch` has an
`assertNever` default, so an unhandled provider is a compile error. Defaults:
**Deepgram + Gemini + Cartesia**.

Provider unions list only vendors we ship plugins for (narrower than MVP's
illustrative wider union) so exhaustiveness is real and compiles; adding one is
"install plugin + add case + extend union." `main.ts` (worker entry, VAD load,
`AgentSession`, fixed greeting) is thin and excluded from coverage — verified by
build + operator run.

Alternatives rejected: Gemini Realtime end-to-end (known Node-SDK issues, per
MVP); constructing plugins inline in `main.ts` (couples the entry to vendors,
untestable).

## Consequences

- Swapping a vendor is one factory case + env var; agent logic is untouched.
- `parseProviderConfig` + `createProviders` are tested at 100% (plugins mocked);
  the live worker (audio reaching `/quiz`) needs an operator with LiveKit +
  Deepgram/Cartesia/Gemini keys — flagged in the PR.
- Hexagonal ports/adapters remain the documented next step (providers/README).
- B08 builds on this: real Pip prompt (lesson injected) + quiz tools + data msgs.
