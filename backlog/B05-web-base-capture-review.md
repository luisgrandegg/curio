# B05 — Web base + capture + review

**MVP step:** 6 · **Depends on:** B01, B03 · **Status:** ☐

## Goal
Next.js app with login, the `/` capture screen, and the `/review` screen
showing concepts returned by `POST /lessons`.

## Scope
- Next.js 15 (App Router) + React 19 + Tailwind 4 + shadcn/ui.
- `lib/api-client.ts` typed against `packages/types`.
- `/` — `SubjectAgePicker` + `PhotoCapture` (camera via `getUserMedia`/file
  input). Submit → `POST /lessons` → navigate to `/review`.
- `/review` — `ConceptList` shows extracted concepts for parent sanity-check;
  "Start quiz" stub (wired in B06).
- Layout: bright, warm, rounded; large tap targets and readable text.

## Acceptance criteria
- Photo → concepts round-trip works end to end against the running API.
- Camera works in a secure context; file upload fallback works.
- Dyslexia-friendly typography defaults applied (Lexend, cream bg, spacing).

## Verification
- Load `/`, pick subject + age, upload a photo, see real concepts on `/review`.

## Test plan / coverage
- Unit: `api-client` request/response mapping; `SubjectAgePicker` selection
  state; `ConceptList` render. Mock fetch.
- ≥ 70% coverage on `api-client` and capture/review components' logic.
