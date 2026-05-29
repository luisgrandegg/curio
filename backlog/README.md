# Curio — MVP Backlog

The MVP (`../MVP.md`) cut into shippable work items, in dependency order. Each
item is one PR-sized slice with its own acceptance criteria and verification.

**How to use:** pick the next unblocked item, branch fresh, write a session test
plan (`.claude/session/`), build, keep coverage ≥ 70% and files < 300 lines,
open a PR. Don't start an item until its dependencies are done.

Every item must also pass the Constitution's product decision tests
(kindness, voice-first, redundancy, privacy, simplicity, parent-visible).

## Order & status

| #   | Item                                                            | Depends on    | Status |
| --- | --------------------------------------------------------------- | ------------- | ------ |
| B00 | [Monorepo foundations](./B00-monorepo-foundations.md)           | —             | ☑      |
| B01 | [Shared types](./B01-shared-types.md)                           | B00           | ☑      |
| B02 | [API base](./B02-api-base.md)                                   | B00, B01      | ☑      |
| B03 | [Vision + lessons endpoint](./B03-api-vision-lessons.md) ⭐     | B02           | ☑      |
| B04 | [Sessions + LiveKit token](./B04-api-sessions-token.md)         | B03           | ☑      |
| B05 | [Web base + capture + review](./B05-web-base-capture-review.md) | B01, B03      | ☑      |
| B06 | [Web LiveKit connect](./B06-web-livekit-connect.md)             | B04, B05      | ☐      |
| B07 | [Agent base + providers](./B07-agent-base-providers.md) ⭐      | B04           | ☐      |
| B08 | [Agent tutor prompt + tools](./B08-agent-prompt-tools.md)       | B07           | ☐      |
| B09 | [Web transcript + scorecard](./B09-web-transcript-scorecard.md) | B06, B08      | ☐      |
| B10 | [Web agent-state avatar](./B10-web-agent-state-avatar.md)       | B06, B08      | ☐      |
| B11 | [Study summary (agent + modal)](./B11-study-summary.md)         | B08, B09      | ☐      |
| B12 | [Read-aloud endpoint](./B12-api-read-aloud.md)                  | B02           | ☐      |
| B13 | [Web accessibility layer](./B13-web-accessibility-layer.md)     | B05, B12      | ☐      |
| B14 | [Child-safety pass](./B14-child-safety-pass.md)                 | B08           | ☐      |
| B15 | [Accessibility pass](./B15-accessibility-pass.md)               | B13           | ☐      |
| B16 | [Error states + polish](./B16-error-states-polish.md)           | B09, B10, B11 | ☐      |
| B17 | [README + docs](./B17-readme-docs.md)                           | most          | ☐      |
| B18 | [Deployment prep](./B18-deployment-prep.md)                     | B17           | ☐      |

⭐ = load-bearing checkpoint. Get it solid before building on it.

## Milestones

- **Phase 1 complete (photo → concepts):** B00–B03, B05.
- **First voice (Pip speaks in the room):** through B07.
- **Full quiz loop:** through B11.
- **Accessible & safe:** B12–B15.
- **Demo-ready & deployable:** B16–B18.
