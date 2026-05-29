# B03 — Vision + lessons endpoint ⭐

**MVP step:** 4 · **Depends on:** B02 · **Status:** ☑ Done

> Load-bearing checkpoint: this is the entire Phase-1 path. Get it solid before
> any voice work. Visual understanding is fully decoupled from the voice session.

## Goal

`POST /lessons` turns an uploaded photo + `{ subject, childAge }` into a
structured `Lesson` via a swappable `VisionProvider`.

## Scope

- `lessons/vision/` — `VisionProvider` interface:
  `extractLesson(imageBase64, age, subject): Promise<Lesson>`.
- `GeminiVisionProvider` using `@google/genai` (`gemini-2.5-flash`); strict JSON
  out, parse defensively (no markdown fences).
- `lessons.controller.ts` + `lessons.service.ts` — multipart upload → Lesson.
- Vision provider selected via `VISION_PROVIDER` factory (default google).
- `// PROD:` validate/scan images, strip EXIF, virus scan, size limits.

## Acceptance criteria

- Returns a valid `Lesson` (topic, summary, 5–8 age-appropriate concepts).
- Concepts are simple and quizable; language suits the child's age.
- Provider abstraction: no Gemini SDK calls outside the provider impl.

## Verification

- `curl -F image=@page.jpg -F subject=maths -F childAge=9 .../lessons` →
  structured JSON `Lesson`.

## Test plan / coverage

- Unit: defensive JSON parsing (fenced/garbled output), concept count clamp
  (5–8), subject/age passthrough. Mock the provider for service tests.
- ≥ 70% coverage on service + parsing. `// TEST:` for live-provider e2e.

## Outcome (done)

- `VisionProvider` interface + env-driven factory (default Gemini), injected by
  Nest token. The only `@google/genai` call is the lazy `gemini-client.ts`
  (`// TEST:`, coverage-excluded); the provider depends on a `VisionGenerate` fn.
- Pure `parseLessonResponse`: strips JSON code fences and surrounding prose,
  validates shape, assigns missing concept ids, clamps 5–8, and throws
  `LessonParseError` otherwise; trusts request `subject`/`childAge`, never the
  model.
- `POST /lessons` (multipart `image` + `CreateLessonDto`) → `LessonResponse`
  (id from in-memory `LessonsStore`, exported for B04). Unreadable photo →
  friendly **422**; missing photo → **400**.
- Decision recorded in **ADR-0003**.
- 27 tests, **97.7%** coverage (parser, factory, provider, store, service,
  controller error mapping, DTO coercion, AppModule integration with a fake
  provider). Live Gemini path needs `GOOGLE_API_KEY` (`// TEST:`).
