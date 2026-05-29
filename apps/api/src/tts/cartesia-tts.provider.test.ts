import type { ReadAloudResponse } from "@curio/types";
import { describe, expect, it, vi } from "vitest";
import { CartesiaTtsProvider } from "./cartesia-tts.provider.js";

const response: ReadAloudResponse = {
  audioBase64: "QUJD",
  mimeType: "audio/wav",
  words: [{ word: "Hi", start: 0, end: 0.3 }],
};

describe("CartesiaTtsProvider", () => {
  it("forwards text + speed to the synth fn and returns its result", async () => {
    const synth = vi.fn().mockResolvedValue(response);
    const provider = new CartesiaTtsProvider(synth);

    const result = await provider.synthesize("Hi there", 0.8);

    expect(result).toEqual(response);
    expect(synth).toHaveBeenCalledWith({ text: "Hi there", speed: 0.8 });
  });
});
