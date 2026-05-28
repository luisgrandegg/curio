import type { ConfigService } from "@nestjs/config";
import { makeGeminiGenerate } from "./gemini-client.js";
import { GeminiVisionProvider } from "./gemini-vision.provider.js";
import type { VisionProvider } from "./vision-provider.interface.js";

/** Build the configured vision provider. Defaults to Gemini. */
export function createVisionProvider(config: ConfigService): VisionProvider {
  const provider = config.get<string>("VISION_PROVIDER") ?? "google";
  switch (provider) {
    case "google": {
      const apiKey = config.get<string>("GOOGLE_API_KEY") ?? "";
      const model = config.get<string>("VISION_MODEL") ?? "gemini-2.5-flash";
      return new GeminiVisionProvider(makeGeminiGenerate(apiKey, model));
    }
    default:
      throw new Error(`Unsupported VISION_PROVIDER: ${provider}`);
  }
}
