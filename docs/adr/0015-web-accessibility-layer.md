# ADR-0015: Accessibility layer — presentation-only settings + read-aloud

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B13; ADR-0014 (read-aloud endpoint); MVP "Accessibility"

## Context

Dyslexia-friendly support is a first-class acceptance criterion: adjustable
typography/theme, and read-aloud with word-by-word highlighting. It must not
touch LiveKit/agent logic (except Pip's speaking speed → TTS `speed`), and the
logic should be testable without audio playback.

## Decision

A React context (`A11ySettingsProvider`) holds presentation settings (font,
size, theme, Pip speed, highlight) in state only and applies them via a root
class (`settingsToClassName`) + CSS variables; a gear `SettingsPanel` edits
them. Read-aloud splits into a **pure core** (`wordIndexAt` for the active word;
`readAloud` api-client call) and **browser glue** (`useReadAloud`: `Audio` +
`timeupdate`; the `ReadAloud` composition) which is excluded from coverage and
verified manually. Presentational `ReadAloudText`/`ReadAloudButton`/
`SettingsPanel` are fully tested. Read-aloud is wired onto the lesson summary,
each concept, and the study summary. Fonts load at runtime via `<link>`
(Lexend + OpenDyslexic) — no build-time fetch.

Alternatives rejected: a third-party reader widget (MVP reuses our TTS layer —
ADR-0014); persisting settings (deferred — `// PROD:` per-child profile);
`next/font` (build-time network fetch).

## Consequences

- Settings are presentation-only; only Pip speed crosses into behaviour (as a
  TTS param), satisfying the "no LiveKit/agent logic" rule.
- The dyslexia-critical word highlight is driven by Cartesia timestamps via the
  pure `wordIndexAt`; the audio plumbing is thin, build-checked glue.
- `// PROD:` persist a per-child accessibility profile; cache synthesized audio.
