# B15 — Accessibility pass

**MVP step:** 17 · **Depends on:** B13 · **Status:** ☑ Done

> Acceptance criteria, not optional.

## Goal

Verify the whole app meets the accessibility baseline and the
redundant-multimodality principle.

## Scope (verify each, fix where it fails)

- **Redundant multimodality:** every important signal in text + voice +
  icon/colour. A non-reader can always hear it and recognise it by shape/colour.
- **Keyboard:** full keyboard navigation; visible focus states everywhere.
- **Screen readers:** `aria-live="polite"` on transcript and Pip's state;
  updates announced.
- **Controls:** all real `<button>`s with descriptive labels.
- **Colour is never the only signal** (scorecard = icon + label + colour).
- **Reduced motion:** `prefers-reduced-motion` disables celebration animations.
- **Typography defaults** applied app-wide (Lexend/cream/spacing rules).

## Acceptance criteria

- Tab through the entire flow with visible focus; nothing is mouse-only.
- Screen reader announces transcript + agent-state changes.
- Every status conveyed without relying on colour.

## Verification

- Keyboard-only walkthrough of `/`, `/review`, `/quiz`. Screen-reader check of
  transcript + state. Toggle reduced motion and confirm animations stop.

## Test plan / coverage

- Unit/integration: focus-order and aria-attribute assertions on key
  components; reduced-motion gating; non-colour status indicators present.
- ≥ 70% coverage on accessibility-bearing component logic.

## Outcome (done)

- Audited the flow against the MVP accessibility baseline — most was already in
  place (icon+label+colour scorecard, `aria-live` transcript/avatar, real
  labelled buttons, `motion-safe:` animations). One gap fixed: a **global
  `:focus-visible`** outline (clear keyboard focus on custom ring buttons), plus
  a `prefers-reduced-motion` media-query safety net.
- `components/accessibility.test.tsx` locks the cross-cutting guarantees:
  motion gated behind `motion-safe`, `aria-live` regions, accessible control
  names, colour-not-only status text.
- `docs/accessibility-checklist.md` — the manual keyboard / screen-reader /
  reduced-motion / typography walkthrough for release.
