# ADR-0005: Self-host api + agent on one VPS, instead of Koyeb

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Supersedes:** the Koyeb hosting choice in `DEPLOYMENT.md`
- **Related:** ADR-0004 (the image); backlog B18; B07 (agent)

## Context

`DEPLOYMENT.md` chose Vercel (web) + Koyeb (api + agent) for a zero-cost deploy,
banking on Koyeb's free, no-sleep tier for the always-on agent worker. In
practice Koyeb now requires a card and quotes ~$30/mo for our shape — the exact
"watch item" that doc flagged. The hard constraint is unchanged: the **agent**
is a persistent LiveKit worker that must **not** scale-to-zero; the **api** can
sleep; **HTTPS is mandatory** (browser camera/mic + LiveKit).

## Decision

Host **api + agent on a single small always-on VPS** (~$5/mo, e.g. Hetzner /
DigitalOcean) via `docker-compose`, with a **Caddy** reverse proxy terminating
automatic HTTPS (Let's Encrypt) in front of the api. Keep **web on Vercel**
(free, native Next.js, HTTPS). HTTPS on the VPS needs a hostname, so a cheap
domain or a free dynamic-DNS name is part of setup.

One box runs both services, which directly satisfies the agent's no-sleep need
and removes per-platform free-tier quirks. The container images are unchanged
(ADR-0004) — only where they run changed.

Alternatives rejected: **pay Koyeb ~$30/mo** (unnecessary for an MVP);
**$0 multi-platform** (api on Render/Cloud Run free + agent on Oracle Always-Free)
— genuinely free but more accounts, cold starts, and Oracle setup friction for a
demo.

## Consequences

- Predictable ~$5/mo, always-on; the agent's persistence requirement is met by
  construction. Web stays free on Vercel.
- We own the box: OS patching, Caddy/TLS, and a hostname are now our concern
  (`// PROD:` backups, monitoring, log shipping, non-root containers).
- `docker-compose.yml` + `Caddyfile` + a VPS runbook land when the **agent**
  exists (B07) — compose is only meaningful with both services; tracked in B18.
- `DEPLOYMENT.md`'s Koyeb sections are superseded here; treat this ADR + the
  forthcoming runbook as the source of truth.
