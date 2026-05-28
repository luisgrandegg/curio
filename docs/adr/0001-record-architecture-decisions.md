# ADR-0001: Record architecture decisions in ADRs

- **Status:** Accepted
- **Date:** 2026-05-28
- **Deciders:** Curio team
- **Related:** `CLAUDE.md` → "Architecture decisions (ADRs)"

## Context

Curio's structural choices currently live across `MVP.md`, `Constitution.md`,
and commit messages. As the codebase grows, contributors need a durable,
discoverable record of _why_ each significant decision was made — not just
_what_ the code does. Without one, decisions get silently re-litigated or
reversed, and the reasoning behind non-obvious choices (provider boundaries,
protocols, deploy shape) is lost.

## Decision

We will record every architecture decision as an Architecture Decision Record
(ADR) in `docs/adr/`, using the lightweight Context / Decision / Consequences
format in `0000-template.md`. ADRs are numbered sequentially, are immutable
once merged, and are superseded (never edited) when a decision changes.

We considered keeping decisions only in `MVP.md`/PR descriptions (rejected: not
discoverable, mutable, easily lost) and a heavier RFC process (rejected:
too much ceremony for a small project that values "the simplest thing that
works").

## Consequences

- Any structurally significant change ships with an ADR, linked from its PR.
- New contributors can read `docs/adr/` to understand the system's "why".
- Slight per-decision overhead — mitigated by keeping ADRs short and reserving
  them for decisions that are costly to reverse.
- Foundational decisions already captured in `MVP.md`/`Constitution.md` are not
  back-filled wholesale; they're referenced, and new decisions accrue here.
