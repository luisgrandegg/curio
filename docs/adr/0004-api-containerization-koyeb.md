# ADR-0004: API containerization for Koyeb

- **Status:** Accepted
- **Date:** 2026-05-28
- **Deciders:** Curio team
- **Related:** backlog B18; DEPLOYMENT.md; ADR-0002

## Context

`apps/api` deploys to Koyeb as a Web service (HTTPS, request-driven). It lives in
a pnpm + Turborepo monorepo, so the image must install the whole workspace,
build only the API (plus its workspace deps like `@curio/types`), and start the
NestJS server. We want this early to de-risk the monorepo-in-Docker path while
the API is structurally stable, ahead of the web/agent images.

## Decision

Ship a single-stage `apps/api/Dockerfile` on `node:20-slim` with pnpm 9.15.4 via
corepack. Copy workspace **manifests first** and run `pnpm install
--frozen-lockfile` (cacheable layer), then copy sources and
`pnpm turbo run build --filter=api`. Start with `pnpm --filter api start`
(`node dist/main.js`). Set `HUSKY=0` so the git-hook install is skipped (no
`.git` in the image), and add a `.dockerignore` to keep `node_modules`/`dist`/
`.git` out of the build context.

Alternatives rejected: **multi-stage prune now** (more moving parts before
we've even deployed once — deferred as `// PROD:`); **buildpacks** (less
predictable for a pnpm workspace than an explicit Dockerfile, per DEPLOYMENT.md).

## Consequences

- The API image is reproducible and builds only what it needs.
- Image carries devDeps + sources until a `// PROD:` multi-stage prune lands;
  fine for the free-tier MVP.
- All workspace manifests are copied so `--frozen-lockfile` validates cleanly —
  the web/agent manifests must stay present even though those apps aren't built.
- The web (Vercel) and agent (always-on Koyeb worker) images are **not** here;
  they land with their feature work (B05/B07) and are tied together in B18.
- Not yet verified by a real `docker build` (no daemon in the dev sandbox); the
  operator confirms on first Koyeb build. The build/start commands are verified.
