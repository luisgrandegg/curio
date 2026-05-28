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

| ADR                                                  | Title                                                   | Status   |
| ---------------------------------------------------- | ------------------------------------------------------- | -------- |
| [0001](./0001-record-architecture-decisions.md)      | Record architecture decisions in ADRs                   | Accepted |
| [0002](./0002-nestjs-esm-with-swc-tests.md)          | NestJS on ESM, with SWC for tests and dev               | Accepted |
| [0003](./0003-vision-provider-and-lesson-parsing.md) | VisionProvider abstraction and defensive lesson parsing | Accepted |
