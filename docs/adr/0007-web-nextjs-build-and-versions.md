# ADR-0007: Web app build setup, and "latest stable" versions

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B05; ADR-0002 (the API's analogous ESM/SWC choice)

## Context

`apps/web` becomes a real Next.js app. Two things need deciding: how it builds
and tests within the strict-ESM monorepo, and which framework version to pin.
The MVP names Next.js 15 + shadcn/ui, but the maintainer asked to use **latest
stable**. Next ships its own bundler/typecheck and a `next-env.d.ts` that (in
v16) references generated `.next/types`, which complicates a standalone `tsc`.

## Decision

- **Versions:** use latest stable — **Next 16**, React 19, Tailwind 4 — a
  deliberate deviation from the MVP's Next 15. Recorded here per ADR-0001.
- **Build/test:** `next build` (Turbopack) is the build; an app-local tsconfig
  extends the base but switches to `moduleResolution: bundler`, `jsx: preserve`,
  `noEmit`, DOM libs, and `verbatimModuleSyntax: false`. Tests run on Vitest with
  `@vitejs/plugin-react` + jsdom + Testing Library (cleanup in `vitest.setup.ts`).
- **`typecheck` depends on `build`** (turbo) so Next's generated `.next/types`
  exist first. The CI/pre-push gate is `lint test build`, and `next build`
  already type-checks, so this only affects local full runs.
- **No shadcn CLI:** hand-rolled Tailwind components for now (`// PROD:` adopt
  shadcn). Fonts load via a runtime `<link>` (not `next/font`) to avoid a
  build-time network fetch.

Alternatives rejected: Next 15 (maintainer wants latest); `next/font/google`
(build-time fetch fails offline); committing a hand-edited `next-env.d.ts` (Next
regenerates it).

## Consequences

- We track Next's latest major; upgrades may need follow-up ADRs.
- Web coverage targets components/lib/hooks; `src/app/**` pages/layout are
  verified by `next build` rather than unit tests.
- The lesson is passed `/` → `/review` via `sessionStorage` (refresh loses it —
  documented); replaced by real state/persistence later.
