# ADR-0004: API containerization (Docker image)

- **Status:** Accepted
- **Date:** 2026-05-28
- **Deciders:** Curio team
- **Related:** backlog B18; ADR-0002; ADR-0005 (where it runs)

## Context

`apps/api` (NestJS) ships as a container so it can run anywhere. It lives in a
pnpm + Turborepo monorepo, so the image must install the whole workspace, build
only the API (plus workspace deps like `@curio/types`), and start the server.
We want this early to de-risk the monorepo-in-Docker path while the API is
structurally stable. **Where** the image runs is a separate decision (ADR-0005).

## Decision

Ship a single-stage `apps/api/Dockerfile` on `node:20-slim` with pnpm 9.15.4 via
corepack. Copy workspace **manifests first** and run `pnpm install
--frozen-lockfile` (cacheable layer), then copy sources and
`pnpm turbo run build --filter=api`. Start with `pnpm --filter api start`
(`node dist/main.js`). Set `HUSKY=0` so the git-hook install is skipped (no
`.git` in the image), and add a `.dockerignore` to keep `node_modules`/`dist`/
`.git` out of the build context.

The image is **platform-agnostic** — it runs the same on a VPS, Render, Cloud
Run, or any container host — so the hosting choice can change without touching
this artifact. Alternatives rejected: **multi-stage prune now** (deferred as
`// PROD:`); **buildpacks** (less predictable for a pnpm workspace).

## Consequences

- Reproducible image that builds only what it needs; runs on any container host.
- Carries devDeps + sources until a `// PROD:` multi-stage prune; fine for MVP.
- All workspace manifests are copied so `--frozen-lockfile` validates cleanly.
- Not yet verified by a real `docker build` (no Docker daemon in the dev
  sandbox); build/start commands are verified. Operator confirms on first build.
