import type { ReadAloudResponse, WordTimestamp } from "@curio/types";
import type { CartesiaSynthesize } from "./cartesia-tts.provider.js";

// TEST: live Cartesia call — exercised manually, not in unit tests. This is the
// ONLY Cartesia touchpoint. Cartesia's SSE TTS returns audio chunks plus
// word-level timestamps (add_timestamps), which drive the dyslexia-friendly
// karaoke highlight on the web. // PROD: cache by text hash; cap length; retry.
const CARTESIA_URL = "https://api.cartesia.ai/tts/sse";
const CARTESIA_VERSION = "2024-11-13";
const MIME_TYPE = "audio/wav";

interface SseChunk {
  type: string;
  data?: string; // base64 audio (type "chunk")
  word_timestamps?: { words: string[]; start: number[]; end: number[] };
}

function collectWords(chunk: SseChunk, into: WordTimestamp[]): void {
  const wt = chunk.word_timestamps;
  if (!wt) return;
  for (let i = 0; i < wt.words.length; i++) {
    into.push({
      word: wt.words[i] ?? "",
      start: wt.start[i] ?? 0,
      end: wt.end[i] ?? 0,
    });
  }
}

export function makeCartesiaSynthesize(
  apiKey: string,
  voiceId: string,
  model: string,
): CartesiaSynthesize {
  return async ({ text, speed }) => {
    const res = await fetch(CARTESIA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cartesia-Version": CARTESIA_VERSION,
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        model_id: model,
        transcript: text,
        voice: { mode: "id", id: voiceId, __experimental_controls: { speed } },
        output_format: {
          container: "wav",
          encoding: "pcm_f32le",
          sample_rate: 44100,
        },
        add_timestamps: true,
      }),
    });

    const audio: string[] = [];
    const words: WordTimestamp[] = [];
    for (const line of (await res.text()).split("\n")) {
      const payload = line.startsWith("data:") ? line.slice(5).trim() : "";
      if (!payload) continue;
      const chunk = JSON.parse(payload) as SseChunk;
      if (chunk.type === "chunk" && chunk.data) audio.push(chunk.data);
      collectWords(chunk, words);
    }

    const response: ReadAloudResponse = {
      audioBase64: audio.join(""),
      mimeType: MIME_TYPE,
      words,
    };
    return response;
  };
}
