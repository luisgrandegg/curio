import { GoogleGenAI } from "@google/genai";
import type { VisionGenerate } from "./gemini-vision.provider.js";

// TEST: live Gemini call — exercised manually / in integration, not unit tests.
// This is the ONLY @google/genai touchpoint; everything else is provider-agnostic.
// The client is created lazily so building the provider never needs a real key.
export function makeGeminiGenerate(
  apiKey: string,
  model: string,
): VisionGenerate {
  return async ({ prompt, imageBase64, mimeType }) => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: prompt },
        { inlineData: { mimeType, data: imageBase64 } },
      ],
    });
    return response.text ?? "";
  };
}
