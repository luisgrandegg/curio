# B00 — Monorepo foundations

**MVP step:** 1 · **Depends on:** — · **Status:** ☑ Done

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
- **CI (GitHub Actions):** `.github/workflows/ci.yml` runs the same affected
  gate (format check + lint/test/build) on PRs and pushes to `main`.

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

## Outcome (done)

- pnpm 9.15.4 + Turborepo 2.9.16; Node 20–22; TypeScript 5.9.3 strict (plus
  `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, NodeNext).
- `@curio/config` ships shared flat ESLint, Prettier, and tsconfig presets.
- `apps/{web,api,agent}` are minimal TS placeholders (real frameworks land in
  B05/B02/B07) — each lints, typechecks, tests (Vitest + v8 coverage, 70%
  thresholds), and builds.
- Vitest coverage gate set to 70% lines/branches/functions/statements.
- Pre-push hook + CI both run `turbo run lint test build --affected`.
- Verified locally: `pnpm install`, full gate, `--affected` gate, and
  `format:check` all green.
