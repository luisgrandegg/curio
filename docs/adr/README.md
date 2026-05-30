# Architecture Decision Records

This directory holds Curio's Architecture Decision Records (ADRs) — short notes
capturing a significant decision, why we made it, and what it commits us to.

See `CLAUDE.md` → "Architecture decisions (ADRs)" for when and how to write one.

## How to add an ADR

1. Copy `0000-template.md` to the next number, e.g. `0002-my-decision.md`.
2. Fill in Context / Decision / Consequences. Keep it short.
3. Set the status (`Proposed` → `Accepted` on merge).
4. Add it to the index below and link it from your PR.

ADRs are **immutable** once merged. To revisit a decision, add a new ADR and
mark the old one `Superseded by ADR-NNNN`.

> Several foundational decisions already live in `MVP.md` and `Constitution.md`
> (cascaded STT→LLM→TTS pipeline, provider factory, data channels vs WebSocket,
> vision decoupled from voice). New decisions from here on are recorded as ADRs.

## Index

| ADR                                                        | Title                                                                | Status   |
| ---------------------------------------------------------- | -------------------------------------------------------------------- | -------- |
| [0001](./0001-record-architecture-decisions.md)            | Record architecture decisions in ADRs                                | Accepted |
| [0002](./0002-nestjs-esm-with-swc-tests.md)                | NestJS on ESM, with SWC for tests and dev                            | Accepted |
| [0003](./0003-vision-provider-and-lesson-parsing.md)       | VisionProvider abstraction and defensive lesson parsing              | Accepted |
| [0004](./0004-api-containerization-koyeb.md)               | API containerization (Docker image)                                  | Accepted |
| [0005](./0005-self-host-vps-instead-of-koyeb.md)           | Self-host api + agent on one VPS, instead of Koyeb                   | Accepted |
| [0006](./0006-livekit-token-minter-boundary.md)            | LiveKit token minting behind a TokenMinter boundary                  | Accepted |
| [0007](./0007-web-nextjs-build-and-versions.md)            | Web app build setup, and "latest stable" versions                    | Accepted |
| [0008](./0008-livekit-web-connection.md)                   | LiveKit on the web — declarative room at the page level              | Accepted |
| [0009](./0009-agent-cascaded-pipeline-provider-factory.md) | Agent — cascaded STT→LLM→TTS via a provider factory                  | Accepted |
| [0010](./0010-quiz-data-channel-protocol.md)               | Quiz updates over a typed LiveKit data channel                       | Accepted |
| [0011](./0011-quiz-state-pure-reducers.md)                 | Quiz UI state as pure reducers over the data channel                 | Accepted |
| [0012](./0012-agent-state-kid-labels.md)                   | Normalize agent state to a kid-facing label set                      | Accepted |
| [0013](./0013-agent-owned-quiz-tally.md)                   | The agent owns the quiz tally for the study summary                  | Accepted |
| [0014](./0014-read-aloud-tts-provider.md)                  | Read-aloud reuses the TTS-provider abstraction over REST             | Accepted |
| [0015](./0015-web-accessibility-layer.md)                  | Accessibility layer — presentation-only settings + read-aloud        | Accepted |
| [0016](./0016-api-hardening-headers-throttle-shutdown.md)  | API hardening — security headers, per-IP throttle, graceful shutdown | Accepted |
| [0017](./0017-child-safety-concept-screening.md)           | Child-safety screening of extracted concepts                         | Accepted |
