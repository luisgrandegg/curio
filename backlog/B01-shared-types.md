# B01 — Shared types

**MVP step:** 2 · **Depends on:** B00 · **Status:** ☑ Done

## Goal

All cross-app contracts defined once in `packages/types`, consumed by web, api,
and agent.

## Scope

- `packages/types/src/lesson.ts` — `Subject`, `LessonConcept`, `Lesson`.
- `packages/types/src/quiz.ts` — `ConceptStatus`, `ScorecardEntry`, `StudySummary`.
- `packages/types/src/transcript.ts` — `AgentState`, `TranscriptEntry`.
- `packages/types/src/index.ts` — barrel export.
- API contract types for the endpoints (request/response shapes).

## Acceptance criteria

- Types match MVP "Shared Types" exactly (field names, unions).
- Package builds and is importable from each app via the workspace.
- No `any`. Unions are exhaustive where used (`satisfies never` downstream).

## Verification

- Import a type in each app stub; `pnpm typecheck` passes.

## Test plan / coverage

- Type-level package; add type assertion tests (e.g. `tsd`-style or compile
  checks) and a small runtime guard/util test if any helpers are added.
- ≥ 70% coverage on any runtime helper exported here.

## Outcome (done)

- `@curio/types` built package: `src/{lesson,quiz,transcript,messages,api,
index}.ts`. Types match MVP "Shared Types" exactly; unions are single-sourced
  from `const` arrays (`SUBJECTS`, `CHILD_AGES`, `CONCEPT_STATUSES`,
  `AGENT_STATES`, `QUIZ_VERDICTS`).
- Added the LiveKit `quiz`-topic data-channel contract (`QuizMessage` union +
  `QUIZ_DATA_TOPIC`) and the HTTP request/response shapes for every endpoint
  (auth, lessons, sessions, read-aloud).
- Runtime guards (`isSubject`/`isChildAge`/`isConceptStatus`/`isAgentState`/
  `isQuizVerdict`) tested at **100%** (17/17 stmts, 11/11 branches, 5/5 funcs).
- Wired into `apps/{web,api,agent}` via `import type`; each app's `typecheck`
  resolves `@curio/types` (turbo `^build` emits its `.d.ts` first).
- Full gate green: `lint typecheck test build` across 18 tasks.
