import type { ConfigService } from "@nestjs/config";
import { makeCartesiaSynthesize } from "./cartesia-client.js";
import { CartesiaTtsProvider } from "./cartesia-tts.provider.js";
import type { TtsProvider } from "./tts-provider.interface.js";

/** Build the configured read-aloud TTS provider. Defaults to Cartesia. */
export function createTtsProvider(config: ConfigService): TtsProvider {
  const provider = config.get<string>("TTS_PROVIDER") ?? "cartesia";
  switch (provider) {
    case "cartesia": {
      const apiKey = config.get<string>("CARTESIA_API_KEY") ?? "";
      const voice = config.get<string>("TTS_VOICE") ?? "";
      const model = config.get<string>("TTS_MODEL") ?? "sonic-2";
      return new CartesiaTtsProvider(
        makeCartesiaSynthesize(apiKey, voice, model),
      );
    }
    default:
      throw new Error(`Unsupported TTS_PROVIDER: ${provider}`);
  }
}
