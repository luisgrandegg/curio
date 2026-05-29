import type { ConfigService } from "@nestjs/config";
import { describe, expect, it } from "vitest";
import { CartesiaTtsProvider } from "./cartesia-tts.provider.js";
import { createTtsProvider } from "./tts.factory.js";

const configWith = (values: Record<string, string>): ConfigService =>
  ({ get: (key: string) => values[key] }) as unknown as ConfigService;

describe("createTtsProvider", () => {
  it("defaults to a Cartesia provider", () => {
    expect(createTtsProvider(configWith({}))).toBeInstanceOf(
      CartesiaTtsProvider,
    );
  });

  it("builds Cartesia for TTS_PROVIDER=cartesia", () => {
    const provider = createTtsProvider(
      configWith({ TTS_PROVIDER: "cartesia", CARTESIA_API_KEY: "k" }),
    );
    expect(provider).toBeInstanceOf(CartesiaTtsProvider);
  });

  it("throws for an unsupported provider", () => {
    expect(() =>
      createTtsProvider(configWith({ TTS_PROVIDER: "elevenlabs" })),
    ).toThrow(/Unsupported TTS_PROVIDER/);
  });
});
