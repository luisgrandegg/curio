import { describe, expect, it, vi } from "vitest";
import type { ProviderConfig } from "./types.js";

// Replace the heavy plugin SDKs with light, named stand-ins. The factories are
// hoisted, so they must be self-contained (no outer references).
vi.mock("@livekit/agents-plugin-deepgram", () => ({
  STT: class STT {
    constructor(public opts?: unknown) {}
  },
}));
vi.mock("@livekit/agents-plugin-google", () => ({
  LLM: class LLM {
    constructor(public opts?: unknown) {}
  },
}));
vi.mock("@livekit/agents-plugin-cartesia", () => ({
  TTS: class TTS {
    constructor(public opts?: unknown) {}
  },
}));

import { createProviders } from "./factory.js";

const base: ProviderConfig = {
  stt: { provider: "deepgram", model: "nova-3" },
  llm: { provider: "google", model: "gemini-2.5-flash" },
  tts: { provider: "cartesia", voice: "warm" },
};

const optsOf = (instance: unknown): unknown =>
  (instance as { opts?: unknown }).opts;
const nameOf = (instance: unknown): string =>
  (instance as object).constructor.name;

describe("createProviders", () => {
  it("builds the configured STT/LLM/TTS and forwards model/voice", () => {
    const bundle = createProviders(base);

    expect(nameOf(bundle.stt)).toBe("STT");
    expect(nameOf(bundle.llm)).toBe("LLM");
    expect(nameOf(bundle.tts)).toBe("TTS");

    expect(optsOf(bundle.stt)).toEqual({ model: "nova-3" });
    expect(optsOf(bundle.llm)).toEqual({ model: "gemini-2.5-flash" });
    expect(optsOf(bundle.tts)).toEqual({ voice: "warm" });
  });

  it("omits optional opts when model/voice are absent", () => {
    const bundle = createProviders({
      stt: { provider: "deepgram" },
      llm: { provider: "google", model: "gemini-2.5-flash" },
      tts: { provider: "cartesia" },
    });
    expect(optsOf(bundle.stt)).toBeUndefined();
    expect(optsOf(bundle.tts)).toBeUndefined();
  });

  it("rejects an unsupported provider on each axis (exhaustive default)", () => {
    const bad = (axis: keyof ProviderConfig): ProviderConfig =>
      ({
        ...base,
        [axis]: { ...base[axis], provider: "nope" },
      }) as unknown as ProviderConfig;
    expect(() => createProviders(bad("stt"))).toThrow(/Unsupported STT/);
    expect(() => createProviders(bad("llm"))).toThrow(/Unsupported LLM/);
    expect(() => createProviders(bad("tts"))).toThrow(/Unsupported TTS/);
  });
});
