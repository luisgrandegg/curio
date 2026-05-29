import type { llm, stt, tts } from "@livekit/agents";

// The provider unions are intentionally the set we ship plugins for. Adding a
// provider = install its plugin + add a `case` + extend the union (the
// `assertNever` default keeps the switch exhaustive). See README.
export interface ProviderConfig {
  stt: { provider: "deepgram"; model?: string };
  llm: { provider: "google"; model: string };
  tts: { provider: "cartesia"; voice?: string };
}

export interface ProviderBundle {
  stt: stt.STT;
  llm: llm.LLM;
  tts: tts.TTS;
}
