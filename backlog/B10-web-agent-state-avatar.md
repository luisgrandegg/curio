# B10 — Web agent-state avatar

**MVP step:** 11 · **Depends on:** B06, B08 · **Status:** ☐

## Goal

The left panel shows Pip with a clear, friendly state: listening / thinking /
speaking, in both visual and simple text form.

## Scope

- `useAgentState()` — typed `AgentState` from the agent participant attributes.
- `TutorAvatarPanel` — large friendly avatar; animates per state; big simple
  label ("Pip is listening!", "Pip is thinking...", "Pip is talking!").
- `BarVisualizer` for the speaking state.

## Acceptance criteria

- Avatar state tracks the real agent state with no noticeable lag.
- State is conveyed redundantly (visual + text), readable by a non-reader via
  shape/animation.
- Respects `prefers-reduced-motion`.

## Verification

- During a quiz, the avatar label/animation matches whether Pip is listening,
  thinking, or speaking.

## Test plan / coverage

- Unit: `useAgentState` maps participant attributes → `AgentState`; panel
  renders correct label/visual per state.
- ≥ 70% coverage on the hook + panel state mapping.
