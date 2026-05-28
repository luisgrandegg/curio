# B08 — Agent tutor prompt + tools

**MVP step:** 9 · **Depends on:** B07 · **Status:** ☐

## Goal
Pip runs the real quiz: injects the lesson, follows the system prompt, asks one
question at a time, and publishes structured updates over data channels.

## Scope
- On entry: fetch lesson via `GET /sessions/:id` (room name = sessionId), build
  system prompt from `PIP_SYSTEM_PROMPT.md` (inject age, subject, topic,
  concept list, `maxQuestions = min(8, concepts+2)`).
- `prompt.ts` — assembles the template verbatim with interpolation.
- Tools (`llm.tool()` + Zod), all publishing `topic: 'quiz'` data messages:
  - `recordAnswer({ conceptId, verdict, childResponse })`
  - `updateScorecard({ conceptId, status })`
- Verdict honesty preserved (correct/partial/incorrect) — kind tone, true data.

## Acceptance criteria
- Pip greets, asks one question at a time, evaluates answers.
- `recordAnswer` is called before spoken feedback; `updateScorecard` marks
  mastery/needs-review.
- Data messages are reliable and topic-scoped (no separate WebSocket).

## Verification
- Run a spoken session; observe questions, feedback, and data messages on the
  `quiz` topic (log on the client).

## Test plan / coverage
- Unit: prompt assembly (interpolation, maxQuestions math, concept list
  formatting); tool argument validation (Zod) + published-message shape.
- ≥ 70% coverage on prompt builder + tools. `// TEST:` for live dialogue.
