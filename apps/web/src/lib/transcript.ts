import type { TranscriptEntry } from "@curio/types";

/**
 * Upsert a transcript entry by id: a final segment replaces its earlier partial
 * (same id); a new id is appended. Pure and immutable.
 */
export function reduceTranscript(
  state: TranscriptEntry[],
  entry: TranscriptEntry,
): TranscriptEntry[] {
  const index = state.findIndex((e) => e.id === entry.id);
  if (index === -1) return [...state, entry];
  const next = state.slice();
  next[index] = entry;
  return next;
}
