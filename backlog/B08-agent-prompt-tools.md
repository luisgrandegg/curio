# B08 — Agent tutor prompt + tools

**MVP step:** 9 · **Depends on:** B07 · **Status:** ☑ Done

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

## Outcome (done)

- `prompt.ts`: `buildPipPrompt(lesson)` interpolates the PIP_SYSTEM_PROMPT
  template (age, subject, topic, numbered concept list, `maxQuestionsFor` =
  min(8, concepts+2)) including the scope-lock + kind-feedback guardrails.
- `session-client.ts`: `fetchSession(sessionId)` reads the lesson from the API
  (room name = sessionId).
- `quiz/publish.ts` + `quiz/tools.ts`: `recordAnswer` / `updateScorecard`
  (`llm.tool` + zod) publish typed `QuizMessage`s on the reliable `quiz` data
  channel; verdict is forwarded honestly. Decision in **ADR-0010**.
- `main.ts` wires fetch → prompt → tools → `AgentSession`, then `generateReply`
  for Pip's opening turn.
- 14 tests, **100%** coverage on prompt/session-client/publish/tools with the
  publisher and SDK boundaries faked; `main.ts` excluded. Typechecks against the
  real SDK.
- Live tool-calling discipline (recordAnswer-before-feedback, one-hint) is
  prompt-driven and verified in the B14 child-safety pass / operator run.
