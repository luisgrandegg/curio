# Accessibility manual checklist

The component-level guarantees are locked by
`apps/web/src/components/accessibility.test.tsx`, but some things can only be
confirmed by driving the real app. The Accessibility section of `MVP.md` is
acceptance criteria — walk these before a release. Curio is voice-first, so the
core quiz works by listening and speaking; this checklist covers the surrounding
UI.

## Keyboard only (no mouse)

- [ ] Tab through `/`, `/review`, `/quiz`: every control is reachable in a
      sensible order; nothing is mouse-only.
- [ ] A clear focus ring is visible on each focused control (global
      `:focus-visible`).
- [ ] Buttons activate with Enter/Space; the settings gear opens/closes; the
      study-summary modal is operable and takes focus on open.

## Screen reader

- [ ] Transcript updates are announced (`role="log"`, `aria-live="polite"`).
- [ ] Pip's state changes are announced ("Pip is listening!/thinking…/talking!").
- [ ] Every control has a descriptive name (gear = "Accessibility settings",
      read-aloud = "Read … aloud", mute/End quiz, Start quiz).

## Colour & motion

- [ ] Scorecard status is legible without colour: icon + text label
      ("Not yet" / "Got it!" / "Review") + colour.
- [ ] Turn on OS "reduce motion": the mastery pulse / avatar animation stop
      (Tailwind `motion-safe:` + the reduced-motion media query).

## Typography

- [ ] Lexend by default; OpenDyslexic toggle works; size + theme change live.
- [ ] Cream (not pure white) background, dark-grey (not pure black) text,
      generous line-height; no italic body / justified / all-caps blocks.

## Redundant multimodality

- [ ] Every important signal is in at least two channels (text + voice + icon/
      colour). A child who can't comfortably read can hear it and recognise it
      by shape/colour.
