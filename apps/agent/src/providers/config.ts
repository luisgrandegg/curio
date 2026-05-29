import type { ProviderConfig } from "./types.js";

/** Default to the supported provider; accept it explicitly; reject others. */
function pick<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
  fallback: T,
  name: string,
): T {
  if (!value) return fallback;
  if ((allowed as readonly string[]).includes(value)) return value as T;
  throw new Error(`Unsupported ${name}: ${value}`);
}

/** Read provider selection from the environment (Deepgram + Gemini + Cartesia). */
export function parseProviderConfig(
  env: NodeJS.ProcessEnv = process.env,
): ProviderConfig {
  return {
    stt: {
      provider: pick(
        env.STT_PROVIDER,
        ["deepgram"],
        "deepgram",
        "STT_PROVIDER",
      ),
      model: env.STT_MODEL || undefined,
    },
    llm: {
      provider: pick(env.LLM_PROVIDER, ["google"], "google", "LLM_PROVIDER"),
      model: env.LLM_MODEL || "gemini-2.5-flash",
    },
    tts: {
      provider: pick(
        env.TTS_PROVIDER,
        ["cartesia"],
        "cartesia",
        "TTS_PROVIDER",
      ),
      voice: env.TTS_VOICE || undefined,
    },
  };
}
