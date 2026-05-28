# B14 — Child-safety pass

**MVP step:** 16 · **Depends on:** B08 · **Status:** ☐

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
