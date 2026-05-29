import type { QuizMessage } from "@curio/types";

const TYPES = new Set(["recordAnswer", "updateScorecard", "summary"]);

/** Decode a `quiz`-topic data-channel payload into a typed message, or null. */
export function decodeQuizMessage(payload: Uint8Array): QuizMessage | null {
  try {
    const data: unknown = JSON.parse(new TextDecoder().decode(payload));
    if (
      typeof data === "object" &&
      data !== null &&
      "type" in data &&
      typeof (data as { type: unknown }).type === "string" &&
      TYPES.has((data as { type: string }).type)
    ) {
      return data as QuizMessage;
    }
    return null;
  } catch {
    return null;
  }
}
