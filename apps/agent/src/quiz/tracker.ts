import type { ConceptStatus, LessonConcept } from "@curio/types";
import type { ConceptState } from "./summary.js";

export interface QuizTracker {
  setStatus(conceptId: string, status: ConceptStatus): void;
  snapshot(): ConceptState[];
}

/** In-memory tally of concept statuses for this room, seeded all-pending. */
export function createQuizTracker(concepts: LessonConcept[]): QuizTracker {
  const states = new Map<string, ConceptState>(
    concepts.map((c) => [c.id, { label: c.label, status: "pending" }]),
  );
  return {
    setStatus(conceptId, status) {
      const current = states.get(conceptId);
      if (current) current.status = status;
    },
    snapshot() {
      return [...states.values()].map((s) => ({ ...s }));
    },
  };
}
