# ADR-0002: NestJS on ESM, with SWC for tests and dev

- **Status:** Accepted
- **Date:** 2026-05-28
- **Deciders:** Curio team
- **Related:** backlog B02; ADR-0001; `apps/api`

## Context

`apps/api` is NestJS 11. Nest's dependency injection relies on **legacy
decorator metadata** (`emitDecoratorMetadata`), and the rest of the monorepo is
strict **ESM** (`"type": "module"`, NodeNext) with `verbatimModuleSyntax`. Two
frictions follow:

1. `verbatimModuleSyntax` elides type-only imports, but Nest needs the injected
   types to survive as runtime values for DI metadata.
2. Vitest transforms with esbuild, which does **not** emit decorator metadata —
   so DI silently breaks in tests.

We also want `@curio/types` (ESM-only) importable from the API without
`ERR_REQUIRE_ESM`, which rules out making the API CommonJS.

## Decision

Keep `apps/api` on **ESM**, with an app-local tsconfig that enables
`experimentalDecorators` + `emitDecoratorMetadata` and disables
`verbatimModuleSyntax`. Build with `tsc` (which emits the metadata). For Vitest
**and** local dev, transform with **SWC** (`unplugin-swc` in the Vitest config;
`@swc-node/register` for `node --watch` dev), configured for legacy decorators
with metadata. Relative imports keep `.js` extensions (NodeNext).

Alternatives rejected: **CommonJS API** (breaks importing the ESM-only
`@curio/types`, diverges from the monorepo); **esbuild-only tests** (no
decorator metadata → DI fails); **`@nestjs/cli`** (extra tool; `tsc` already
emits what we need).

## Consequences

- The API diverges from the root tsconfig on three compiler options; this is
  intentional and documented here so it isn't "fixed" back.
- Tests run against SWC-transformed sources while production runs `tsc` output —
  two transformers for one app. Acceptable and standard for NestJS + Vitest.
- `// TEST:` HTTP-level e2e (CORS, ValidationPipe) is deferred; current tests
  cover DI, controllers, and the auth flow via the testing module.
- New Nest apps (the agent worker stays plain ESM) should follow this pattern.
