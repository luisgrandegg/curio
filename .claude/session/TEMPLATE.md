# Session test plan — <branch / date>

> Copy this to `.claude/session/<branch-or-date>.md` at the start of a session.
> Fill it in, use it to guide the work, and **delete it when the session ends**
> (the PR is the durable record by then). Only this TEMPLATE.md is committed.

## Goal of this session

<one or two sentences: what this session delivers>

## Branch

<fresh branch name, off latest main>

## Scope of change

- <files / apps / packages this touches>
- Backlog item(s): <e.g. backlog/E01-api-vision.md>

## Test plan (how we'll prove it works)

- **Unit/integration tests to add or update:**
  - <test 1 — what it asserts>
  - <test 2 — ...>
- **Coverage target:** ≥ 70% on changed code. Note any `// TEST:` gaps.
- **Manual verification** (from the MVP step):
  - <command to run / screen to open / what you should see>

## Constitution checks

- [ ] Kindness — nothing here makes a child feel bad, rushed, or unsafe
- [ ] Voice-first — core quiz path needs no reading/typing
- [ ] Redundant multimodality — important signals in text + voice + icon/colour
- [ ] Privacy — collects/exposes nothing about the child it doesn't need
- [ ] Simplicity — smallest change that works; `// PROD:` for prod gaps

## Definition of done

- [ ] Files under 300 lines
- [ ] Coverage ≥ 70% on the change
- [ ] Lint + test + build pass (pre-push gate green)
- [ ] MVP verification step passes
- [ ] PR opened
- [ ] This session plan deleted
