# ADR-0006: LiveKit token minting behind a TokenMinter boundary

- **Status:** Accepted
- **Date:** 2026-05-29
- **Deciders:** Curio team
- **Related:** backlog B04; ADR-0001; ADR-0003 (same provider-boundary pattern)

## Context

A quiz session needs a LiveKit access token so the child's browser can join the
room. Minting uses `livekit-server-sdk`. Per the Constitution, SDK calls must
not leak into business logic, and `SessionsService` should be unit-testable
without the SDK. The session/room identity model also needs pinning: the agent
later fetches "its" session, so room name and session id must line up.

## Decision

Define a `TokenMinter` interface (`mint(roomName, identity) → { token, url }`),
injected via a Nest token and built by a config-driven factory.
`LivekitTokenMinter` is the only `livekit-server-sdk` touchpoint: a 1h token
with `roomJoin` + `canPublish` + `canSubscribe`, scoped to one room. **Room name
= sessionId**, participant **identity = `child-<sessionId>`**. `SessionsService`
depends on the interface, so it's tested with a fake; the real minter is tested
by decoding the JWT and asserting the grants.

Alternatives rejected: calling `AccessToken` directly in the service (couples
to the SDK, awkward to test); a separate random room name (an extra id to map
the agent back to the session for no benefit).

## Consequences

- Swapping/upgrading the LiveKit SDK touches one class; services are unaffected.
- The agent can fetch session state by room name (`GET /sessions/:id`) with no
  extra lookup table.
- Sessions are in-memory with a `pending` scorecard seeded from lesson concepts;
  `end` flips status to `ended`. `// PROD:` persistence; `// PROD/B11:` persist
  the agent-generated study summary on end.
