import type { ReadAloudResponse } from "@curio/types";

/**
 * On-demand text-to-speech for read-aloud. This is the same TTS-abstraction
 * idea the agent uses in real time (inside LiveKit), exercised here over REST —
 * which is the point: the boundary sits at the right level.
 */
export interface TtsProvider {
  synthesize(text: string, speed: number): Promise<ReadAloudResponse>;
}

/** Nest DI token for the configured {@link TtsProvider}. */
export const TTS_PROVIDER = Symbol("TTS_PROVIDER");
