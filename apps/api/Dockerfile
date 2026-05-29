# Curio API (NestJS) — built for Koyeb as a Web service (port 3001).
# See docs/adr/0004 and DEPLOYMENT.md. // PROD: multi-stage prune + healthcheck.
FROM node:20-slim AS base
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"
# Skip the husky git-hook install — there is no .git in the build context.
ENV HUSKY=0
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate
WORKDIR /app

# 1) Install against the full workspace using only manifests, for layer caching.
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY packages/config/package.json ./packages/config/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/agent/package.json ./apps/agent/package.json
RUN pnpm install --frozen-lockfile

# 2) Build only the API; Turbo also builds its workspace deps (e.g. @curio/types).
COPY . .
RUN pnpm turbo run build --filter=api

EXPOSE 3001
CMD ["pnpm", "--filter", "api", "start"]
