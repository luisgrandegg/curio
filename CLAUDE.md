# CLAUDE.md — Working on Curio

Light guide for developing Curio. Read `Constitution.md` for *why*; read
`MVP.md` for *what*. This file is *how*.

## What Curio is (one line)
A voice-first study tutor for children 8–10: photo → extracted concepts →
spoken quiz with "Pip". Monorepo: `apps/web` (Next.js), `apps/api` (NestJS),
`apps/agent` (LiveKit worker), `packages/*` (shared).

## Non-negotiables (from the Constitution)
- A child's wellbeing first. Feedback is always kind; effort is always praised.
- Voice-first: never put reading/typing on the core quiz path.
- Accessibility & child-safety sections in `MVP.md` are acceptance criteria.
- Warmth to the child, honest verdicts to the scorecard.
- Keep providers behind factories/interfaces — no SDK calls in business logic.
- Prefer the simplest thing that works; mark production gaps with `// PROD:`.

## Quality bars (enforced on every change)
- **File size:** keep source files **under 300 lines**. Split when they grow.
- **Coverage:** **minimum 70% coverage on every change.** New/changed code must
  ship with tests. Mark intended-but-skipped tests with `// TEST:`.
- **TypeScript:** strict, no `any` without an explanatory comment.
- **Deps:** pinned versions (no `^`/`~`), `pnpm@9.x`, Node 20.
- **Lint/format:** ESLint + Prettier (shared config in `packages/config`).

## Workflow (every task)
1. **Start from a fresh branch** off the latest `main` — never develop on
   `main`. Name it for the work (e.g. `feat/vision-endpoint`).
2. **Write the session test plan** before coding — see below.
3. Build in thin slices; follow `MVP.md`'s order of implementation.
4. Keep files small, tests green, coverage ≥ 70%.
5. **Open a PR when finished.** Don't merge your own WIP into `main`.
6. **Delete the session test plan** when the session finishes.

## Session test plan
At the **start of each session**, propose a test plan and write it to
`.claude/session/` (one file per session, e.g.
`.claude/session/<branch-or-date>.md`). Use
`.claude/session/TEMPLATE.md` as the starting point. The plan states what
you'll change, how you'll verify it, and which tests cover the ≥70% bar.
**Delete the plan file when the session is done** (the work is captured in the
PR by then). `.claude/session/` is git-ignored except the template.

## Pre-push gate
A `pre-push` hook runs **lint, test, and build on affected
services/packages/apps** via Turborepo's `--affected` filter:

```bash
pnpm turbo run lint test build --affected
```

The hook lives in `.husky/pre-push`. It activates after `pnpm install` (husky
`prepare`). If a push is blocked, fix the failure — don't bypass with
`--no-verify` unless you have a documented reason.

## Verifying your work
Each `MVP.md` step lists how to verify it (a `curl`, a screen, audio reaching
`/quiz`). Don't move past a broken checkpoint. The vision endpoint (step 4) and
first agent audio (step 8) are the load-bearing checks.

## Backlog
The MVP is cut into work items under `backlog/`. Pick the next unblocked item,
respect its dependencies, and check it off when its acceptance criteria pass.
