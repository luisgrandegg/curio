# B01 — Shared types

**MVP step:** 2 · **Depends on:** B00 · **Status:** ☐

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
