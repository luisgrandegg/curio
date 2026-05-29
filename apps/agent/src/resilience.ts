import { voice } from "@livekit/agents";

/** Warm, kid-friendly line Pip says when the language model is unavailable. */
export const PIP_FALLBACK_LINE =
  "Oops — my brain needs a tiny rest! Let's try that again in just a moment.";

export interface FallbackOptions {
  /** Minimum gap between fallback lines, so a burst of retries says it once. */
  cooldownMs?: number;
  now?: () => number;
}

/**
 * Keep the quiz from freezing when the LLM errors (e.g. the provider rate-limits
 * us): Pip speaks a warm fallback line via TTS — which is independent of the LLM
 * — instead of going silent. The session already retries; this handles the case
 * where it still can't answer, so the child is never left hanging.
 */
export function installLlmFallback(
  session: voice.AgentSession,
  say: (text: string) => unknown,
  { cooldownMs = 15_000, now = Date.now }: FallbackOptions = {},
): void {
  let lastSpokenAt = Number.NEGATIVE_INFINITY;
  session.on(voice.AgentSessionEventTypes.Error, (ev: voice.ErrorEvent) => {
    // The error event also fires for STT/TTS; only the LLM going down leaves a
    // silent gap mid-conversation that we need to fill.
    const error = ev.error as { type?: string } | null | undefined;
    if (error?.type !== "llm_error") return;

    const at = now();
    if (at - lastSpokenAt < cooldownMs) return;
    lastSpokenAt = at;
    try {
      say(PIP_FALLBACK_LINE);
    } catch {
      // Best-effort reassurance — never let the fallback itself crash the job.
    }
  });
}
