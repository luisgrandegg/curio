import * as cartesia from "@livekit/agents-plugin-cartesia";
import * as deepgram from "@livekit/agents-plugin-deepgram";
import * as google from "@livekit/agents-plugin-google";
import type { ProviderBundle, ProviderConfig } from "./types.js";

function assertNever(value: never, axis: string): never {
  throw new Error(`Unsupported ${axis} provider: ${String(value)}`);
}

function createStt(cfg: ProviderConfig["stt"]): ProviderBundle["stt"] {
  switch (cfg.provider) {
    case "deepgram":
      // env model is a free string; assert to the plugin's model union.
      return new deepgram.STT(
        cfg.model
          ? ({ model: cfg.model } as ConstructorParameters<
              typeof deepgram.STT
            >[0])
          : undefined,
      );
    default:
      return assertNever(cfg.provider, "STT");
  }
}

function createLlm(cfg: ProviderConfig["llm"]): ProviderBundle["llm"] {
  switch (cfg.provider) {
    case "google":
      return new google.LLM({ model: cfg.model });
    default:
      return assertNever(cfg.provider, "LLM");
  }
}

function createTts(cfg: ProviderConfig["tts"]): ProviderBundle["tts"] {
  switch (cfg.provider) {
    case "cartesia":
      return new cartesia.TTS(cfg.voice ? { voice: cfg.voice } : undefined);
    default:
      return assertNever(cfg.provider, "TTS");
  }
}

/** Build the STT→LLM→TTS bundle for the cascaded voice pipeline. */
export function createProviders(config: ProviderConfig): ProviderBundle {
  return {
    stt: createStt(config.stt),
    llm: createLlm(config.llm),
    tts: createTts(config.tts),
  };
}
