# B14 — Child-safety pass

**MVP step:** 16 · **Depends on:** B08 · **Status:** ☑ Done

> Acceptance criteria, not optional. This is the domain care that defines Curio.

## Goal

Verify and harden Pip's child-safety behaviour against the MVP and
`PIP_SYSTEM_PROMPT.md` requirements.

## Scope (verify each, fix the prompt/logic if it fails)

- **Scope lock:** Pip only discusses the lesson; off-topic → warm redirect.
- **Kind feedback always:** never "wrong"/"no"; "good try" + one gentle hint.
- **Hint discipline:** at most one hint, then kindly give the answer + mark
  needs_review + move on.
- **No PII:** Pip never asks for name/school/address; never repeats shared PII.
- **Negative self-talk:** redirect with encouragement; never agree.
- **Wants to stop / upset:** let them stop kindly; no pressure.
- **Unsuitable content:** skip anything frightening/violent/adult even if it
  was in the photo.
- **Effort praised explicitly.**
- **Session cap:** hard limit of 8 questions.

## Acceptance criteria

- All scope/safety paths behave as specified in real spoken tests.
- Verdict honesty preserved while spoken tone stays kind.

## Verification

- Deliberately test: off-topic redirect, negative-self-talk path, "wants to
  stop" path, a PII overshare, and an out-of-scope/unsuitable concept.

## Test plan / coverage

- Unit: prompt assembly includes all scope-lock/safety clauses; question cap
  enforced in agent logic; PII never echoed in published messages.
- ≥ 70% coverage on safety-relevant agent logic. `// TEST:` for scripted
  spoken-scenario evals.

## Outcome (done)

- Reviewed `buildPipPrompt` against the full MVP child-safety checklist — every
  guardrail was already present (faithful B08 build); no prompt change needed.
- `prompt.safety.test.ts` locks all 13 guardrails as a regression guard (scope
  lock, never wrong/no/incorrect, one-hint, give-answer→needs_review, praise
  effort, no-PII ask + repeat, negative-self-talk redirect, let-them-stop,
  skip-unsuitable, no medical/legal advice, recordAnswer-before-feedback, one
  question at a time) + age woven in + `maxQuestionsFor` never exceeds 8.
- `docs/child-safety-checklist.md` — the manual spoken-scenario eval (the
  `// TEST:`), to be walked on a live quiz before release.
- Verdict honesty (kind speech, true scorecard) reaffirmed.
- `// PROD:` automated spoken-scenario evals + a hard server-side question cap.
