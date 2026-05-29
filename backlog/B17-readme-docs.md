# B17 — README + docs

**MVP step:** 19 · **Depends on:** most items · **Status:** ☑ Done

## Goal

A README that lets a newcomer understand Curio and run it in under 5 minutes,
and that documents the design decisions and intentional gaps.

## Scope — README must include

1. What Curio is (one paragraph) + the voice-first design philosophy.
2. Mermaid diagram: web ↔ LiveKit ↔ agent ↔ (STT/LLM/TTS); api on the side for
   vision + token + session + read-aloud.
3. Quick start (works in < 5 min).
4. Design decisions: vision decoupled from voice; cascaded vs realtime pipeline
   and why; data channels vs separate WS; provider factory.
5. **Designing for children** (the child-safety section).
6. **Accessibility** — dyslexia-friendly design, voice-first rationale,
   read-aloud-with-highlighting; note the `TTSProvider` abstraction is used in
   BOTH real-time (agent) and on-demand (read-aloud) contexts.
7. Provider abstraction strategy (factory now, hexagonal later).
8. What's missing for production (the out-of-scope list).
9. Note: verdict honesty vs kind spoken feedback is deliberate.
10. Note: refresh mid-quiz loses the session; quiz screen is desktop/tablet-first.

## Acceptance criteria

- A new dev follows quick start and runs the full flow without external help
  beyond providing API keys.
- All required sections present and accurate.

## Verification

- Fresh-clone walkthrough following only the README.

## Test plan / coverage

- Docs item: verify Mermaid renders and quick-start commands are correct. No
  code coverage target; ensure linked commands actually run.
