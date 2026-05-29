# ADR-0012: Normalize agent state to a kid-facing label set

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B10; ADR-0011 (same lib/hook/panel split)

## Context

LiveKit's `useVoiceAssistant` exposes a wider state union
(`disconnected | connecting | pre-connect-buffering | failed | initializing |
idle | listening | thinking | speaking`) than our `AgentState`
(`disconnected | connecting | listening | thinking | speaking`). The avatar must
show a calm, warm, child-readable status — not raw SDK states.

## Decision

A pure `normalizeAgentState(raw)` maps the SDK union onto our `AgentState`
(`idle`→`listening` since the agent is connected and waiting;
`initializing`/`pre-connect-buffering`→`connecting`; `failed`/unknown→
`disconnected`), and `agentStateLabel` returns the kid-facing copy ("Pip is
listening!", "Pip is thinking…", "Pip is talking!"). `TutorAvatarPanel` is
presentational (state in an `aria-live` label + `motion-safe` animation, plus a
`bars` slot for the speaking `BarVisualizer`); `useAgentState` is a thin
`useVoiceAssistant` wrapper (excluded from coverage). State is conveyed by text
**and** motion — never colour alone.

Alternatives rejected: using the raw SDK state in the UI (leaks vendor states,
unfriendly copy, breaks if the union changes); a colour-only indicator (fails
the redundant-multimodality principle).

## Consequences

- The avatar's mapping + labels are unit-tested; the SDK wiring is a one-line
  build-checked hook.
- If LiveKit adds states, the default arm keeps the UI safe (`disconnected`)
  until we map them.
