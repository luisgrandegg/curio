import { describe, expect, it } from "vitest";
import { parseProviderConfig } from "./config.js";

describe("parseProviderConfig", () => {
  it("defaults to Deepgram + Gemini + Cartesia when env is empty", () => {
    const config = parseProviderConfig({});
    expect(config.stt).toEqual({ provider: "deepgram", model: undefined });
    expect(config.llm).toEqual({
      provider: "google",
      model: "gemini-2.5-flash",
    });
    expect(config.tts).toEqual({ provider: "cartesia", voice: undefined });
  });

  it("honors explicit valid providers, model, and voice", () => {
    const config = parseProviderConfig({
      STT_PROVIDER: "deepgram",
      STT_MODEL: "nova-3",
      LLM_PROVIDER: "google",
      LLM_MODEL: "gemini-2.0-flash",
      TTS_PROVIDER: "cartesia",
      TTS_VOICE: "warm-voice-id",
    });
    expect(config.stt.model).toBe("nova-3");
    expect(config.llm.model).toBe("gemini-2.0-flash");
    expect(config.tts.voice).toBe("warm-voice-id");
  });

  it("throws on an unsupported provider", () => {
    expect(() => parseProviderConfig({ TTS_PROVIDER: "elevenlabs" })).toThrow(
      /Unsupported TTS_PROVIDER/,
    );
  });
});
