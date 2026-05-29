import type { ConfigService } from "@nestjs/config";
import { describe, expect, it } from "vitest";
import { GeminiVisionProvider } from "./gemini-vision.provider.js";
import { StubVisionProvider } from "./stub-vision.provider.js";
import { createVisionProvider } from "./vision.factory.js";

// Minimal ConfigService stand-in: only `get` is used by the factory.
const configWith = (values: Record<string, string>): ConfigService =>
  ({ get: (key: string) => values[key] }) as unknown as ConfigService;

describe("createVisionProvider", () => {
  it("defaults to a Gemini provider when VISION_PROVIDER is unset", () => {
    const provider = createVisionProvider(configWith({}));
    expect(provider).toBeInstanceOf(GeminiVisionProvider);
  });

  it("builds a Gemini provider for VISION_PROVIDER=google", () => {
    const provider = createVisionProvider(
      configWith({ VISION_PROVIDER: "google", GOOGLE_API_KEY: "k" }),
    );
    expect(provider).toBeInstanceOf(GeminiVisionProvider);
  });

  it("builds the offline stub provider for VISION_PROVIDER=stub", () => {
    const provider = createVisionProvider(
      configWith({ VISION_PROVIDER: "stub" }),
    );
    expect(provider).toBeInstanceOf(StubVisionProvider);
  });

  it("throws for an unsupported provider", () => {
    expect(() =>
      createVisionProvider(configWith({ VISION_PROVIDER: "openai" })),
    ).toThrow(/Unsupported VISION_PROVIDER/);
  });
});
