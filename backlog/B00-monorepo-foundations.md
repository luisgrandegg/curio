# B00 — Monorepo foundations

**MVP step:** 1 · **Depends on:** — · **Status:** ☐

## Goal
A working pnpm + Turborepo monorepo skeleton that builds, lints, and
typechecks across empty `apps/*` and `packages/*`.

## Scope
- pnpm workspaces (`pnpm-workspace.yaml`), `pnpm@9.x`, Node 20.
- Turborepo (`turbo.json`) with `dev`, `build`, `lint`, `typecheck` pipelines.
- Root `package.json` scripts (see MVP "Scripts").
- `packages/config` — shared ESLint, Prettier, `tsconfig.base.json`.
- Empty `apps/web`, `apps/api`, `apps/agent` placeholders.
- `.env.example` with all vars from MVP "Environment Variables".
- Husky `prepare` script so `.husky/pre-push` activates on install.

## Acceptance criteria
- `pnpm install` succeeds; husky hook installed.
- `pnpm turbo run lint build typecheck` passes on the empty skeleton.
- `pnpm turbo run lint test build --affected` runs (the pre-push command).
- TypeScript strict mode on; pinned dep versions (no `^`/`~`).

## Verification
- Run `pnpm install` then `pnpm build` and `pnpm lint` from root — all green.
- Confirm `git push` triggers the pre-push gate.

## Test plan / coverage
- Skeleton has little executable code; add a trivial test in `packages/config`
  or a smoke test so the `test` pipeline exists and passes.
- `// TEST:` mark where per-app suites will live.
