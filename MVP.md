# Curio — Voice Study Tutor

## What this is

Curio is a voice-driven study tutor for children aged 8–10. A child (or parent) takes a photo of a school lesson, the app extracts the key concepts from the image, and then an AI tutor named **Pip** runs a short spoken quiz — asking questions out loud, listening to the child's spoken answers, giving warm feedback in real time, and tracking progress on a visual scorecard.

The product is voice-first by design: the quiz happens by listening and speaking, not reading and writing. This sidesteps the core decoding barrier of dyslexia and other reading difficulties, and makes the experience natural for young children regardless of reading fluency.

This document is the spec for building Curio. It is written to be fed to Claude Code along with `CLAUDE_CODE_KICKOFF.md`, `PIP_SYSTEM_PROMPT.md`, and `DEPLOYMENT.md`. Prefer the simplest thing that works. Where production code would differ from what we ship here, leave a `// PROD:` comment instead of building the production version.

---

## Product description

A web app with two phases.

### Phase 1 — Lesson capture (no voice, no LiveKit)
1. Child/parent lands on home page, picks a subject and the child's age (8, 9, or 10).
2. Takes or uploads a photo of a lesson page (textbook, worksheet, notebook).
3. Backend sends the image to a multimodal LLM, which returns a structured lesson: a topic title, a child-friendly summary, and a list of 5–8 key concepts/facts to quiz on.
4. UI shows the extracted concepts so the parent can sanity-check before starting.

### Phase 2 — Spoken quiz session (voice, LiveKit, WebRTC)
1. Child clicks "Start quiz". App connects to a LiveKit room.
2. Pip joins the room and greets the child warmly by voice.
3. Pip asks one question at a time, out loud, based on the lesson concepts.
4. Child answers by speaking. STT transcribes; the LLM evaluates whether the answer is correct, partially correct, or incorrect.
5. Pip gives warm, encouraging spoken feedback and (if wrong) a gentle hint, then either re-asks or moves on.
6. As the quiz progresses, a tool call updates a visual scorecard: which concepts are mastered, which need review.
7. After 5–8 questions, Pip wraps up encouragingly and the app shows a study summary: concepts covered, what the child did well, what to review.

### UI layout during the quiz (single screen)

Three columns, full viewport height, bright and friendly:

- **Left (280px)**: Big friendly tutor avatar with agent state (listening / thinking / speaking, with clear visual + simple text label like "Pip is listening!"), audio controls (mute, end quiz).
- **Center (flex)**: Current question shown large and readable, plus a live transcript of the conversation below it. Streaming text as it arrives. Auto-scroll.
- **Right (360px)**: Scorecard — each lesson concept as a card: not-yet-asked (grey), got-it (green star), needs-review (amber). Progress bar ("Question 3 of 6"). Celebration micro-animation when a concept is mastered.

---

## Child-safety & age-appropriateness requirements (build these in)

This section is acceptance criteria, not an afterthought. We are building something children will use; the care reflects that.

- **Tutor persona (Pip)**: warm, patient, encouraging, never condescending. Simple vocabulary suited to ages 8–10. Short sentences.
- **Feedback on wrong answers is ALWAYS kind**: never "wrong" or "no". Use "good try!", "close — let's think about it together", then a gentle hint. Effort is praised explicitly.
- **No negative self-talk reinforcement**: if a child says "I'm stupid" or "I can't do this", Pip gently redirects with encouragement and never agrees.
- **Scope lock in the system prompt**: Pip ONLY discusses the lesson material. If the child tries to go off-topic, asks for personal info, or the conversation drifts anywhere unsafe, Pip warmly redirects to the quiz. Pip never asks for the child's personal information (full name, address, school, etc.).
- **No data collection on the child**: session is ephemeral, in-memory only. `// PROD: COPPA/GDPR-K compliance, parental consent flow, no PII retention, audited data handling.`
- **Parent-visible**: the full transcript is on screen so a supervising parent can see everything Pip says.
- **Session length cap**: hard limit of 8 questions to respect attention spans and avoid fatigue.

Document these in the README under "Designing for children".

---

## Accessibility — dyslexia-friendly design (required, first-class)

A meaningful share of children aged 8–10 have reading difficulties (dyslexia and related). Curio is well-positioned to help them BECAUSE it is voice-first: the quiz is done by listening and speaking, which sidesteps the core decoding barrier of dyslexia by design. We treat that as a designed-for property, not an accident.

This section is acceptance criteria, not a nice-to-have.

### Guiding principle: redundant multimodality

Every important piece of information is available in at least two channels — text + voice + icon/color. A child who cannot comfortably read the on-screen text can always hear it and recognise it by shape/color.

### Read-aloud with synchronized highlighting

Any block of on-screen text (lesson summary, each concept, the study summary) has a speaker button that reads it aloud using the SAME TTS provider as the agent (Cartesia), invoked on demand. As it reads, the currently-spoken word is highlighted (karaoke-style). This word-by-word highlight is the single most helpful read-aloud feature for dyslexic readers.

- **Technical basis (verified)**: Cartesia's WebSocket TTS returns word-level timestamps (`word_timestamps`, on by default in the LiveKit plugin). Use these timestamps to drive the highlight. Do NOT integrate a third-party reader product — the existing TTS layer already provides this.
- **Architecture note (important design point)**: read-aloud is NOT part of the LiveKit voice session. It is a separate REST endpoint in `apps/api` — `POST /tts/read-aloud` `{ text }` → returns audio + word timestamps. This means the `TTSProvider` abstraction is exercised in TWO contexts: real-time (the agent, inside LiveKit) and on-demand (read-aloud, over REST). This validates that the provider abstraction was placed at the right level.
- The read-aloud endpoint uses the same provider factory; default Cartesia. `// PROD: cache generated audio per text hash to avoid re-synthesis.`

### Typography & layout (presentation-only settings)

- **Font**: default to Lexend (high-legibility sans-serif designed for reading fluency, available on Google Fonts). Offer OpenDyslexic as an opt-in alternative. Evidence on dyslexia-specific fonts is mixed, so we offer choice rather than forcing one.
- **Size & spacing**: large base font, line-height ~1.5, short line lengths (max ~60 chars), generous paragraph spacing.
- **Contrast**: high contrast but NOT pure black on pure white. Default to a warm off-white / cream background with dark grey text to reduce visual stress.
- **Never**: italic body text, justified text, long unbroken text blocks, all-caps.

### Settings panel

A simple, obvious settings control (gear icon, top corner) opens presentation/accessibility settings. None of these touch LiveKit or agent logic — they are all presentation + a TTS speed param:

- Font size (3 steps: comfortable / large / extra-large)
- Dyslexia-friendly font toggle (Lexend default ↔ OpenDyslexic)
- Reading theme (cream / high-contrast / tinted)
- Pip's speaking speed (Cartesia `speed` param, 0.6–2.0; default slightly slower than 1.0 for this age group)
- Read-aloud highlighting on/off

Settings are held in React state (no persistence). `// PROD: persist per-child accessibility profile.`

### Accessibility baseline (in addition to the above)

- Full keyboard navigation; visible focus states.
- `aria-live="polite"` regions for the transcript and Pip's state so screen readers announce updates.
- All controls are real `<button>`s with descriptive labels.
- Color is never the only signal (scorecard states use icon + label + color, not color alone).
- Respect `prefers-reduced-motion` (disable celebration animations when set).

Document all of this in the README under an "Accessibility" heading.

---

## Tech Stack

### Monorepo
- **Tooling**: pnpm workspaces + Turborepo
- **Node**: v20 LTS
- **TypeScript**: 5.x, strict mode, project references
- **Linting/formatting**: ESLint + Prettier, shared config in `packages/config`

### Apps
- `apps/web` — Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui
- `apps/api` — NestJS 11 (lesson/vision endpoint, LiveKit token minting, mock auth, session state)
- `apps/agent` — Standalone Node.js worker using `@livekit/agents` (the "Pip" tutor)

### Shared packages
- `packages/types` — Shared types (lesson schema, quiz/scorecard, transcript, agent state, API contracts)
- `packages/config` — Shared ESLint, Prettier, tsconfig base

### External services (free-tier friendly)
- **LiveKit Cloud** — WebRTC infrastructure (free tier)
- **Google Gemini** (`@livekit/agents-plugin-google`) — multimodal vision (photo→concepts) AND the quiz LLM. One provider covers both, generous free tier.
- **Deepgram** — STT (free credits)
- **Cartesia** — TTS (free credits), warm/friendly voice for "Pip". Used in TWO contexts: real-time agent speech (inside LiveKit) and on-demand read-aloud with word-level timestamps (REST endpoint, for dyslexia-friendly highlighting). Word timestamps are supported natively (`word_timestamps`, on by default).

> Avoid Gemini Realtime end-to-end on the Node SDK — there are known issues (AgentSession not transitioning to running). Use the cascaded STT → LLM → TTS pipeline instead.

---

## Provider Abstraction (required)

Providers must be swappable without touching agent logic. Use a config-driven factory.

```
apps/agent/src/providers/
├── types.ts      # ProviderConfig, ProviderBundle
├── factory.ts    # createProviders(config) -> { stt, llm, tts }
└── README.md     # explains the abstraction + "next step: hexagonal ports/adapters"
```

```ts
// providers/types.ts
import type { llm, stt, tts } from '@livekit/agents';

export interface ProviderConfig {
  stt: { provider: 'deepgram' | 'openai-whisper'; model?: string };
  llm: { provider: 'google' | 'openai'; model: string };
  tts: { provider: 'cartesia' | 'openai' | 'google'; voice?: string };
}

export interface ProviderBundle {
  stt: stt.STT;
  llm: llm.LLM;
  tts: tts.TTS;
}
```

`factory.ts` switches on `provider`, using `satisfies never` in the default case for exhaustive compile-time checks. Provider selection comes from env vars (`STT_PROVIDER`, `LLM_PROVIDER`, `TTS_PROVIDER`, `LLM_MODEL`, `TTS_VOICE`) with defaults of Deepgram + Gemini + Cartesia.

**Vision provider** (used in `apps/api`, not the agent) is abstracted the same way: a `VisionProvider` interface with an `extractLesson(image, age, subject): Promise<Lesson>` method, default implementation backed by Gemini. This keeps the photo-understanding decoupled from the voice session entirely.

README must note hexagonal ports/adapters (defining our own `LanguageModel`/`SpeechToText` interfaces wrapping LiveKit) as the production next step, and why it's deliberately NOT done here.

---

## Repo Structure

```
curio/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── page.tsx               # Home: subject + age + photo capture
│   │   │   ├── review/page.tsx        # Show extracted concepts, confirm start
│   │   │   ├── quiz/page.tsx          # Active voice quiz session
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── capture/
│   │   │   │   ├── PhotoCapture.tsx    # camera + file upload
│   │   │   │   └── SubjectAgePicker.tsx
│   │   │   ├── review/
│   │   │   │   └── ConceptList.tsx
│   │   │   ├── a11y/
│   │   │   │   ├── ReadAloudButton.tsx    # speaker btn + karaoke highlight
│   │   │   │   ├── ReadAloudText.tsx      # wraps text, renders word spans
│   │   │   │   └── SettingsPanel.tsx      # font/size/theme/speed/read-aloud
│   │   │   ├── quiz/
│   │   │   │   ├── TutorAvatarPanel.tsx
│   │   │   │   ├── QuestionDisplay.tsx
│   │   │   │   ├── TranscriptPanel.tsx
│   │   │   │   ├── ScorecardPanel.tsx
│   │   │   │   ├── AudioControls.tsx
│   │   │   │   └── StudySummaryModal.tsx
│   │   │   └── ui/                     # shadcn primitives
│   │   ├── hooks/
│   │   │   ├── useLiveKitSession.ts
│   │   │   ├── useAgentState.ts
│   │   │   ├── useTranscript.ts
│   │   │   ├── useScorecard.ts
│   │   │   ├── useReadAloud.ts         # fetch audio+timestamps, drive highlight
│   │   │   └── useA11ySettings.ts      # accessibility settings context
│   │   ├── lib/api-client.ts
│   │   └── package.json
│   │
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── auth/                   # mock parent auth
│   │   │   ├── lessons/                # photo -> structured lesson (vision)
│   │   │   │   ├── lessons.controller.ts
│   │   │   │   ├── lessons.service.ts
│   │   │   │   └── vision/             # VisionProvider interface + Gemini impl
│   │   │   ├── livekit/                # token minting
│   │   │   ├── tts/                    # read-aloud endpoint (TTSProvider, REST)
│   │   │   ├── sessions/               # quiz session state (in-memory)
│   │   │   └── config/
│   │   └── package.json
│   │
│   └── agent/
│       ├── src/
│       │   ├── main.ts                 # worker entry (defineAgent), "Pip"
│       │   ├── prompt.ts               # socratic kid-tutor system prompt
│       │   ├── providers/              # factory + types + README
│       │   └── tools/
│       │       ├── recordAnswer.ts
│       │       ├── updateScorecard.ts
│       │       └── generateStudySummary.ts
│       └── package.json
│
├── packages/
│   ├── types/src/{lesson,quiz,transcript,index}.ts
│   └── config/{eslint,prettier,tsconfig}/
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── README.md
```

---

## Shared Types (`packages/types`)

```ts
// lesson.ts
export type Subject = 'maths' | 'science' | 'history' | 'geography' | 'language' | 'other';

export interface LessonConcept {
  id: string;
  label: string;          // short, kid-friendly, e.g. "Adding two-digit numbers"
  detail: string;         // one sentence the tutor can quiz on
}

export interface Lesson {
  topicTitle: string;     // e.g. "Two-digit addition"
  summary: string;        // 1–2 child-friendly sentences
  subject: Subject;
  childAge: 8 | 9 | 10;
  concepts: LessonConcept[]; // 5–8 items
}

// quiz.ts
export type ConceptStatus = 'pending' | 'mastered' | 'needs_review';

export interface ScorecardEntry {
  conceptId: string;
  status: ConceptStatus;
  attempts: number;
}

export interface StudySummary {
  conceptsCovered: number;
  mastered: string[];      // concept labels
  needsReview: string[];   // concept labels
  encouragement: string;   // warm closing message for the child
}

// transcript.ts
export type AgentState = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

export interface TranscriptEntry {
  id: string;
  participant: 'tutor' | 'child';
  text: string;
  isFinal: boolean;
  timestamp: number;
}
```

---

## `apps/api` (NestJS)

In-memory state, single mock parent user.

**Endpoints**:
- `POST /auth/login` — mock; returns JWT. `// PROD: real auth, parental account.`
- `POST /lessons` — multipart image upload + `{ subject, childAge }`. Calls `VisionProvider.extractLesson()`, returns a `Lesson`. **All photo understanding happens here, before any voice session — visual understanding is fully decoupled from the voice session.**
- `POST /sessions` — body `{ lessonId }`. Creates quiz session, mints LiveKit token, returns `{ sessionId, roomName, livekitToken, livekitUrl }`. The lesson is stored in session state so the agent can fetch it.
- `GET /sessions/:id` — returns session state (lesson, scorecard, transcript, summary if done). The agent reads the lesson from here on join.
- `POST /sessions/:id/end` — finalizes, stores summary.
- `POST /tts/read-aloud` — body `{ text }`. Uses the shared TTS provider (default Cartesia) to synthesize the text and returns the audio plus word-level timestamps, used by the frontend for karaoke-style highlighting (dyslexia accessibility). This deliberately reuses the same provider abstraction as the agent, in a non-LiveKit/REST context. `// PROD: cache by text hash; rate-limit; cap text length.`

**Vision** (`lessons/vision/`):
- `VisionProvider` interface: `extractLesson(imageBase64: string, age: 8|9|10, subject: Subject): Promise<Lesson>`.
- `GeminiVisionProvider` implementation using `@google/genai` with `gemini-2.5-flash`. Prompt instructs: extract age-appropriate concepts, produce 5–8 quizable facts, keep language simple. Must return strict JSON (no markdown fences) — parse defensively.
- `// PROD: validate/scan uploaded images, strip EXIF, virus scan, size limits.`

**LiveKit token minting**: `livekit-server-sdk`, grants `roomJoin` + `canPublish`/`canSubscribe`, identity `child-<sessionId>`, 1h TTL.

---

## `apps/agent` (LiveKit Worker — "Pip")

Reference: https://github.com/livekit-examples/agent-starter-node

**On entry**: connect, read the lesson for this room (fetch `GET /sessions/:id` via API using room name = sessionId), build the system prompt with the lesson concepts injected, then start the AgentSession with providers from the factory.

**System prompt** — see `PIP_SYSTEM_PROMPT.md` for the full template and assembly guidance.

**Tools** (`llm.tool()` + Zod):
- `recordAnswer({ conceptId, verdict: 'correct'|'partial'|'incorrect', childResponse })` → publishes a data message (`topic: 'quiz'`) so the frontend can react.
- `updateScorecard({ conceptId, status })` → publishes scorecard update to the room (`topic: 'quiz'`).
- `generateStudySummary()` → builds `StudySummary` from session state, publishes `summary` data message, returns `{ generated: true }`.

All agent→frontend structured updates go over **LiveKit data channels** (reliable, topic-scoped), not a separate WebSocket.

---

## `apps/web` (Next.js)

**Flow across 3 routes**: `/` (capture) → `/review` (confirm concepts) → `/quiz` (voice session).

**`/` home**: SubjectAgePicker + PhotoCapture (camera via `getUserMedia`/file input). On submit → `POST /lessons` → navigate to `/review` with the returned lesson.

**`/review`**: ConceptList shows extracted concepts so a parent can sanity-check. "Start quiz" → `POST /sessions` → navigate to `/quiz`.

**`/quiz`**: `LiveKitRoom` + `AgentSessionProvider` from `@livekit/components-react`. Three-panel kid-friendly layout.

**Hooks**:
- `useAgentState()` — typed `AgentState` from the agent participant attributes; drives the avatar.
- `useTranscript()` — `RoomEvent.TranscriptionReceived`; partial→final replacement per participant.
- `useScorecard()` — `RoomEvent.DataReceived` on `topic: 'quiz'`; applies `recordAnswer`/`updateScorecard`/`summary` messages immutably.
- `useLiveKitSession()` — token fetch + connect + `endQuiz()` (calls `/sessions/:id/end`).

**Components**:
- `TutorAvatarPanel` — large friendly avatar; animates per agent state; big simple label ("Pip is listening!", "Pip is thinking...", "Pip is talking!"). Use `BarVisualizer` for speaking.
- `QuestionDisplay` — current question large and high-contrast, dyslexia-friendly font size.
- `TranscriptPanel` — `role="log" aria-live="polite"`; tutor left, child right; partials italic.
- `ScorecardPanel` — concept cards (pending/mastered/needs_review), progress bar, celebration micro-animation on mastery.
- `AudioControls` — mute toggle (`useLocalParticipant`), End Quiz.
- `StudySummaryModal` — friendly recap; "what you did great", "let's practice next time"; parent-facing "Copy summary" button.

**Styling**: bright, warm, rounded, playful but not cluttered. Large tap targets, large readable text. High contrast. Friendly iconography (lucide-react). Calm color palette with one cheerful accent.

**Accessibility**: keyboard navigable, `aria-live` for transcript and agent state, focus management on modal, large fonts, high contrast. See full Accessibility section above.

---

## Error & edge cases (build these)
- **Photo unreadable / no concepts extracted**: friendly "Hmm, I couldn't read that page — try another photo with good light." Retry.
- **Mic permission denied**: kid-friendly empty state + retry.
- **Token minting fails**: toast + retry, no white screen.
- **Agent never joins (10s)**: "Pip is taking a nap — let's try again." Retry. Detect via `RoomEvent.ParticipantConnected`.
- **Connection lost**: auto-reconnect banner ("Reconnecting to Pip..."), resume transcript.
- **Empty/garbled STT (kids mumble)**: tutor re-asks gently (handled in prompt).
- **Refresh mid-quiz**: session lost (acceptable; document in README).

---

## Intentionally out of scope (document in README)
- Real auth / parental accounts / consent flow
- COPPA / GDPR-K compliance, PII handling, data residency
- Real persistence (DB, audit log, encryption at rest)
- Image safety scanning, EXIF stripping, content moderation pipeline
- Multi-child profiles, progress over time
- Observability (OTEL, traces across STT/LLM/TTS)
- Tests beyond a couple of smoke tests on critical hooks
- Mobile-responsive polish (desktop/tablet first; the capture screen should work on mobile, the 3-column quiz layout is cramped on phones — documented)
- i18n (English first; Spanish is the obvious next step)

---

## Environment Variables

```
# Root
LIVEKIT_URL=wss://<project>.livekit.cloud
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
GOOGLE_API_KEY=
DEEPGRAM_API_KEY=
CARTESIA_API_KEY=

# Provider selection (with defaults)
STT_PROVIDER=deepgram
LLM_PROVIDER=google
LLM_MODEL=gemini-2.5-flash
TTS_PROVIDER=cartesia
TTS_VOICE=            # a warm, friendly Cartesia voice id
TTS_DEFAULT_SPEED=0.9 # slightly slower default for ages 8-10 (Cartesia 0.6-2.0)
VISION_PROVIDER=google
VISION_MODEL=gemini-2.5-flash

# apps/api
PORT=3001
JWT_SECRET=dev-only-change-me
MOCK_PARENT_EMAIL=parent@curio.local
MOCK_PARENT_PASSWORD=demo1234

# apps/web
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_LIVEKIT_URL=wss://<project>.livekit.cloud
```

---

## Scripts (root `package.json`)
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "turbo run dev --filter=api",
    "dev:agent": "turbo run dev --filter=agent",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write \"**/*.{ts,tsx,md,json}\""
  }
}
```

---

## Order of Implementation (build and verify each step before the next)

1. **Monorepo skeleton** — pnpm workspaces, Turborepo, shared configs, empty apps.
2. **`packages/types`** — all shared types first.
3. **`apps/api` base** — NestJS bootstrap, ConfigModule, health check.
4. **`apps/api` vision** — `VisionProvider` + Gemini impl + `POST /lessons`. Test with a real photo via `curl`/Postman, confirm structured JSON lesson comes back. **This is the whole Phase-1 path; get it solid before any voice work.**
5. **`apps/api` LiveKit token** — `POST /sessions` returning a real token. Test with `curl`.
6. **`apps/web` base** — Next.js + Tailwind + shadcn; login; `/` capture screen; `/review` showing concepts from `POST /lessons`.
7. **`apps/web` LiveKit connect** — `/quiz` connects to room with token; confirm own participant.
8. **`apps/agent` base + providers** — provider factory; worker joins room and says a fixed greeting via TTS. Verify audio reaches `/quiz`.
9. **`apps/agent` tutor prompt + tools** — inject lesson, socratic prompt, `recordAnswer`/`updateScorecard`, data-channel publishing.
10. **`apps/web` transcript + scorecard** — subscribe and render.
11. **`apps/web` agent state avatar** — wire `useAgentState`.
12. **`apps/agent` study summary** — `generateStudySummary`.
13. **`apps/web` summary modal** — end-of-quiz flow.
14. **`apps/api` read-aloud endpoint** — `POST /tts/read-aloud` returning audio + word timestamps via the shared TTS provider. Test with `curl`, confirm timestamps come back.
15. **`apps/web` accessibility layer** — `useA11ySettings` context + `SettingsPanel` (font, size, theme, Pip speed, read-aloud toggle); `useReadAloud` + `ReadAloudButton`/`ReadAloudText` with synchronized word highlighting on the lesson summary, concepts, and study summary. Apply dyslexia-friendly typography defaults (Lexend, cream background, spacing). Respect `prefers-reduced-motion`.
16. **Child-safety pass** — verify prompt scope-lock, kind feedback, redirects; the safety section above is acceptance criteria, not optional.
17. **Accessibility pass** — verify redundant multimodality (text+voice+icon), keyboard nav, aria-live regions, color-not-only signals; the accessibility section is acceptance criteria, not optional.
18. **Error states + polish.**
19. **README** — what Curio is, Mermaid architecture diagram, quick start (<5 min), design decisions, "designing for children", accessibility, provider abstraction strategy, what's missing for production.
20. **Deployment prep** — create the per-app Dockerfiles and platform config described in `DEPLOYMENT.md` (Vercel for `web`, Koyeb for `api` + `agent`, agent as an always-on worker). Do NOT run deploys; produce the files and hand the operator the step-by-step. The agent's always-on requirement and the HTTPS-for-camera/mic requirement are the two non-negotiables.

---

## README must include
1. What Curio is (one paragraph) and the voice-first design philosophy.
2. Mermaid diagram: web ↔ LiveKit ↔ agent ↔ (STT/LLM/TTS); api on the side for vision + token + session + read-aloud.
3. Quick start (works in <5 min).
4. Design decisions (vision decoupled from voice; cascaded vs realtime pipeline and why; data channels vs separate WS; provider factory).
5. Designing for children (the child-safety section).
6. Accessibility — dyslexia-friendly design, voice-first rationale, and the read-aloud-with-highlighting feature. Explicitly note that the `TTSProvider` abstraction is used in both real-time (agent) and on-demand (read-aloud) contexts.
7. Provider abstraction strategy (factory now, hexagonal later).
8. What's missing for production.

---

## Out-of-band notes
- Pin dependency versions (no `^`/`~`) for reproducibility.
- Use `pnpm@9.x`.
- TypeScript strict, no `any` without an explanatory comment.
- `// TEST:` comments where production tests would go.
