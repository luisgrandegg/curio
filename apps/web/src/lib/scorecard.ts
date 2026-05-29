import type { LessonConcept, QuizMessage, ScorecardEntry } from "@curio/types";

/** Start every concept as pending with no attempts. */
export function seedScorecard(concepts: LessonConcept[]): ScorecardEntry[] {
  return concepts.map((c) => ({
    conceptId: c.id,
    status: "pending",
    attempts: 0,
  }));
}

/** Apply a quiz data message to the scorecard, immutably. */
export function reduceScorecard(
  state: ScorecardEntry[],
  message: QuizMessage,
): ScorecardEntry[] {
  switch (message.type) {
    case "recordAnswer":
      return state.map((e) =>
        e.conceptId === message.conceptId
          ? { ...e, attempts: e.attempts + 1 }
          : e,
      );
    case "updateScorecard":
      return state.map((e) =>
        e.conceptId === message.conceptId
          ? { ...e, status: message.status }
          : e,
      );
    case "summary":
      return state;
    default:
      return state;
  }
}
