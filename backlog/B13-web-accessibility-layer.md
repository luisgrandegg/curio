# B13 — Web accessibility layer

**MVP step:** 15 · **Depends on:** B05, B12 · **Status:** ☐

## Goal
Dyslexia-friendly read-aloud with synchronized highlighting, plus a settings
panel — the first-class accessibility layer.

## Scope
- `useA11ySettings()` context + `SettingsPanel` (gear icon): font size (3
  steps), Lexend ↔ OpenDyslexic toggle, reading theme (cream / high-contrast /
  tinted), Pip speaking speed (Cartesia `speed` 0.6–2.0, default ~0.9),
  read-aloud highlighting on/off. React state only. `// PROD: persist profile.`
- `useReadAloud()` — fetch audio + word timestamps from `/tts/read-aloud`,
  drive karaoke-style word highlight.
- `ReadAloudButton` (speaker btn) + `ReadAloudText` (wraps text, word spans).
- Apply to lesson summary, each concept, and the study summary.
- Typography defaults: Lexend, cream bg, line-height ~1.5, short lines; never
  italic body / justified / all-caps / long unbroken blocks.

## Acceptance criteria
- Read-aloud highlights the currently-spoken word in sync with audio.
- Settings change presentation only (no LiveKit/agent logic touched), except
  Pip speed which maps to the TTS `speed` param.
- Respects `prefers-reduced-motion`.

## Verification
- Press a speaker button on the summary/concepts; hear audio with word-by-word
  highlight; toggle each setting and see it apply.

## Test plan / coverage
- Unit: `useReadAloud` timestamp→highlight index logic; `useA11ySettings`
  reducer; `ReadAloudText` span rendering; theme/font class mapping.
- ≥ 70% coverage on the highlight logic and settings reducer.
