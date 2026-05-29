import type { ConfigService } from "@nestjs/config";
import type { ReadAloudResponse } from "@curio/types";
import { describe, expect, it, vi } from "vitest";
import { TtsController } from "./tts.controller.js";
import type { TtsProvider } from "./tts-provider.interface.js";

const response: ReadAloudResponse = {
  audioBase64: "QUJD",
  mimeType: "audio/wav",
  words: [],
};

const configWith = (speed?: string): ConfigService =>
  ({ get: () => speed }) as unknown as ConfigService;

describe("TtsController", () => {
  it("uses the requested speed when provided", async () => {
    const synthesize = vi.fn().mockResolvedValue(response);
    const tts: TtsProvider = { synthesize };
    const controller = new TtsController(tts, configWith("0.9"));

    await controller.readAloud({ text: "Hello", speed: 1.5 });
    expect(synthesize).toHaveBeenCalledWith("Hello", 1.5);
  });

  it("falls back to the configured default speed", async () => {
    const synthesize = vi.fn().mockResolvedValue(response);
    const tts: TtsProvider = { synthesize };
    const controller = new TtsController(tts, configWith("0.8"));

    await controller.readAloud({ text: "Hello" });
    expect(synthesize).toHaveBeenCalledWith("Hello", 0.8);
  });
});
