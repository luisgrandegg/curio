import type { WordTimestamp } from "@curio/types";

/**
 * Index of the word being spoken at time `t` (seconds), or -1 if none.
 * Drives the karaoke-style highlight as the read-aloud audio plays.
 */
export function wordIndexAt(words: WordTimestamp[], t: number): number {
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (w && t >= w.start && t < w.end) return i;
  }
  return -1;
}
