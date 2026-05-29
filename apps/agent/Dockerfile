# Curio "Pip" agent — a persistent LiveKit worker (NOT an HTTP service).
# It must stay always-on (no scale-to-zero). See docs/adr/0005 + docs/deploy/vps.md.
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

# 2) Build only the agent; Turbo also builds its workspace deps (@curio/types).
COPY . .
RUN pnpm turbo run build --filter=agent

# No EXPOSE: the worker connects out to LiveKit and waits for jobs.
# PROD: `download-files` to prefetch the Silero VAD model and speed cold start;
# multi-stage prune to drop devDeps/sources.
CMD ["pnpm", "--filter", "agent", "start"]
