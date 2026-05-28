# Claude Code — Kickoff Prompt for Curio

> Paste this as your first message to Claude Code in an empty project folder, with `MVP.md`, `PIP_SYSTEM_PROMPT.md`, and `DEPLOYMENT.md` present in the root.

---

## Your task

You are building **Curio**, a voice-driven study tutor for children aged 8–10. A child takes a photo of a school lesson; Curio extracts the key concepts using a multimodal LLM; then an AI tutor named **Pip** runs a short spoken quiz, asking questions out loud, listening to the child's spoken answers, and tracking progress on a visual scorecard.

The full spec is in `MVP.md` — read it fully before doing anything. It is a pnpm + Turborepo monorepo with three apps (`web`, `api`, `agent`) plus shared packages, using the LiveKit Node.js Agents SDK for the real-time voice session.

Pip's system prompt lives in `PIP_SYSTEM_PROMPT.md` — use it verbatim (adapted only to inject lesson concepts and child age at runtime) when you reach the agent step.

Deployment guidance lives in `DEPLOYMENT.md` (Vercel for `web`, Koyeb for `api` + `agent`). Only consult it when you reach the deployment-prep step; do not deploy anything yourself — produce the config files and hand the operator the steps.

## Rules of engagement (important)

1. **Read `MVP.md` completely before writing any code.** Then confirm back, in 5–8 bullets, your understanding of the architecture and the build order. Do not write code yet. Wait for the "go".

2. **Work strictly in the order given in "Order of Implementation" in MVP.md.** One numbered step at a time. After each step:
   - State which step you just finished.
   - Tell the operator exactly how to verify it works (the command to run, what they should see).
   - STOP and wait for confirmation before starting the next step.

3. **Never skip ahead or combine steps.** If a later step seems trivial, still stop at the checkpoint. Validation of each layer (especially the vision endpoint in step 4 and the first audio from the agent in step 8) is the whole point.

4. **When a step needs external credentials** (LiveKit, Gemini, Deepgram, Cartesia keys), pause and tell the operator precisely which env vars to set and where to get them, rather than guessing or stubbing silently.

5. **Prefer the simplest thing that works.** Where production code would differ, leave a `// PROD:` comment instead of building the production version. Do not add features not in the spec.

6. **Respect the constraints in MVP.md**: TypeScript strict, no `any` without an explanatory comment, pinned dependency versions (no `^`/`~`), pnpm@9.x, Node 20. Use the provider factory pattern for STT/LLM/TTS and the VisionProvider interface for the photo step — no provider SDK calls scattered through business logic.

7. **The child-safety and accessibility sections in MVP.md are acceptance criteria, not decoration.** When you reach the agent and the safety/accessibility passes (steps 9, 15, 16, 17), treat those requirements as must-pass.

## How to handle problems

- If something in `MVP.md` is ambiguous or seems wrong, ask before improvising.
- If a dependency version or API has changed and the spec's example code no longer matches, surface what changed and propose the fix before applying it. The LiveKit Agents JS SDK evolves fast and is in beta — expect minor API drift and surface it rather than silently working around it.
- If a step fails verification, fix it before moving on. Never move to the next step on a broken checkpoint.

## First action

Read `MVP.md`, `PIP_SYSTEM_PROMPT.md`, and `DEPLOYMENT.md`, then give a brief understanding summary and the verification plan for Step 1. Then stop and wait for the go.
