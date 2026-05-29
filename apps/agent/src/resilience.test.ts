import { EventEmitter } from "node:events";
import { voice } from "@livekit/agents";
import { describe, expect, it, vi } from "vitest";
import { PIP_FALLBACK_LINE, installLlmFallback } from "./resilience.js";

const ERROR_EVENT = voice.AgentSessionEventTypes.Error;

/** Minimal stand-in for AgentSession — only `.on`/`.emit` are exercised. */
function fakeSession(): {
  session: voice.AgentSession;
  emit: EventEmitter["emit"];
} {
  const ee = new EventEmitter();
  return {
    session: ee as unknown as voice.AgentSession,
    emit: ee.emit.bind(ee),
  };
}

const llmError = { error: { type: "llm_error" } };

describe("installLlmFallback", () => {
  it("speaks the fallback line when the LLM errors", () => {
    const { session, emit } = fakeSession();
    const say = vi.fn();
    installLlmFallback(session, say);

    emit(ERROR_EVENT, llmError);

    expect(say).toHaveBeenCalledTimes(1);
    expect(say).toHaveBeenCalledWith(PIP_FALLBACK_LINE);
  });

  it("ignores non-LLM errors (STT/TTS handle themselves)", () => {
    const { session, emit } = fakeSession();
    const say = vi.fn();
    installLlmFallback(session, say);

    emit(ERROR_EVENT, { error: { type: "tts_error" } });
    emit(ERROR_EVENT, { error: null });

    expect(say).not.toHaveBeenCalled();
  });

  it("debounces a burst of errors to one line per cooldown", () => {
    const { session, emit } = fakeSession();
    const say = vi.fn();
    let t = 1000;
    installLlmFallback(session, say, { cooldownMs: 15_000, now: () => t });

    emit(ERROR_EVENT, llmError); // spoken
    t += 5_000;
    emit(ERROR_EVENT, llmError); // within cooldown -> skipped
    t += 11_000; // now 16s since first -> past cooldown
    emit(ERROR_EVENT, llmError); // spoken again

    expect(say).toHaveBeenCalledTimes(2);
  });

  it("never throws if say() fails", () => {
    const { session, emit } = fakeSession();
    const say = vi.fn(() => {
      throw new Error("tts down");
    });
    installLlmFallback(session, say);

    expect(() => emit(ERROR_EVENT, llmError)).not.toThrow();
  });
});
