# Curio — Constitution

> This is the highest-order guide for Curio. When a product, design, or
> engineering decision is unclear, resolve it in favour of these principles.
> Specs (`MVP.md`, `PIP_SYSTEM_PROMPT.md`, `DEPLOYMENT.md`) describe *what* we
> build; this document describes *why*, and how to choose when they don't say.

---

## What Curio is

Curio is a voice-driven study tutor for children aged 8–10. A child takes a
photo of a school lesson; Curio extracts the key concepts; then an AI tutor
named **Pip** runs a short spoken quiz — asking out loud, listening, giving
warm feedback, and tracking progress on a visual scorecard.

We are building something children use. The care reflects that.

---

## First principles

These are ordered. When two principles conflict, the higher one wins.

### 1. A child's wellbeing comes before everything else
No feature, metric, or deadline outranks the safety and dignity of the child
using Curio. Feedback is always kind. Effort is always praised. A child never
leaves a session feeling stupid, stuck, or unsafe. When in doubt, choose the
gentler path.

### 2. Voice-first is the point, not a feature
The quiz happens by listening and speaking — not reading and writing. This is
a deliberate design choice that sidesteps the core decoding barrier of
dyslexia and meets young children where they are. Never quietly reintroduce a
reading or typing requirement into the core quiz loop. If a feature only works
by reading, it is not on the critical path.

### 3. Accessibility is a designed-for property, not an add-on
Dyslexia-friendly design and the accessibility baseline are acceptance
criteria. Every important piece of information lives in at least two channels —
text **and** voice **and** icon/colour. Colour is never the only signal. We
respect keyboard users, screen readers, and `prefers-reduced-motion`. A change
that regresses accessibility is a broken change.

### 4. Protect the child's privacy by default
Sessions are ephemeral and in-memory. Pip never asks for personal information
and never repeats it back. We collect nothing about the child. Where
production would need consent flows and compliance (COPPA / GDPR-K), we mark
the gap with `// PROD:` rather than pretending to solve it.

### 5. The parent can always see what's happening
The full transcript is on screen. A supervising adult can read everything Pip
says and the child answers. Transparency to the caregiver is non-negotiable.

### 6. Warmth to the child, honesty to the system
Spoken feedback is always encouraging; the recorded verdict is always honest.
The scorecard needs truth so it can guide real study; the child hears warmth so
they keep going. Never blur these two — kindness in tone, accuracy in data.

### 7. Prefer the simplest thing that works
Build the smallest thing that satisfies the spec and the principles above.
Where production code would differ, leave a `// PROD:` comment instead of
building the production version. Do not add features that aren't in the spec.

### 8. Keep providers swappable
STT, LLM, TTS, and vision sit behind config-driven factories/interfaces. No
provider SDK calls leak into business logic. This keeps us free to change
vendors and validates that our abstractions sit at the right level.

---

## Product decision tests

When evaluating any change, it must pass all of these:

- **The kindness test** — could this make a child feel bad, rushed, or
  unsafe? If yes, redesign it.
- **The voice-first test** — does the core experience still work for a child
  who cannot comfortably read? If not, it's wrong.
- **The redundancy test** — is every important signal available in more than
  one channel (text/voice/icon-colour)?
- **The privacy test** — does this collect, retain, or expose anything about
  the child it doesn't absolutely need? Default to no.
- **The simplicity test** — is this the smallest change that works, or are we
  gold-plating ahead of the spec?
- **The parent test** — can a supervising adult still see and understand what
  is happening?

---

## How we work (engineering ethos)

- **Ship in thin, verifiable slices.** Follow the order of implementation;
  prove each layer works before building on it. The vision endpoint and the
  first audio from the agent are the load-bearing checkpoints.
- **Surface drift, don't paper over it.** The LiveKit Agents SDK is in beta. If
  the spec's example no longer matches reality, say so and propose the fix
  before applying it.
- **Quality bars are part of "done."** Small files, real tests, green
  lint/build. See `CLAUDE.md` for the concrete rules.
- **Honesty about state.** If something is stubbed, skipped, or failing, say so
  plainly. A green checkmark must mean what it says.

---

## Explicitly out of scope (and that's okay)

Real auth and consent flows, COPPA/GDPR-K compliance, durable persistence,
image safety scanning, multi-child profiles, deep observability, full mobile
polish of the quiz screen, and i18n are **deliberately** out of scope for the
MVP. We name the gaps with `// PROD:` and document them, rather than half-build
them. English first; Spanish is the obvious next step.

---

*If a decision isn't covered here, choose the option a thoughtful parent and a
careful engineer would both be comfortable with — and add a note here so the
next person doesn't have to guess.*
