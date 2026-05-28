// Quiz scorecard + study summary contracts. Mirrors MVP.md.

/** A concept's mastery state on the scorecard. */
export const CONCEPT_STATUSES = [
  "pending",
  "mastered",
  "needs_review",
] as const;
export type ConceptStatus = (typeof CONCEPT_STATUSES)[number];

export interface ScorecardEntry {
  conceptId: string;
  status: ConceptStatus;
  attempts: number;
}

export interface StudySummary {
  conceptsCovered: number;
  /** Concept labels the child mastered. */
  mastered: string[];
  /** Concept labels to review next time. */
  needsReview: string[];
  /** Warm closing message for the child. */
  encouragement: string;
}

export const isConceptStatus = (value: unknown): value is ConceptStatus =>
  typeof value === "string" &&
  (CONCEPT_STATUSES as readonly string[]).includes(value);
