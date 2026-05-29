import type { ConceptStatus, StudySummary } from "@curio/types";

export interface ConceptState {
  label: string;
  status: ConceptStatus;
}

/** Warm closing message — kind in every case, never implies failure. */
function encouragement(mastered: number, needsReview: number): string {
  if (mastered > 0 && needsReview === 0) {
    return "Wow — you remembered everything! I'm so proud of you. 🌟";
  }
  if (mastered === 0) {
    return "You worked so hard today, and that's what matters most. Let's practise these again soon!";
  }
  return `Great job — you've got ${mastered} down! We'll practise the rest next time. 💪`;
}

/** Build the study summary from the concept statuses Pip recorded. */
export function buildStudySummary(states: ConceptState[]): StudySummary {
  const mastered = states
    .filter((s) => s.status === "mastered")
    .map((s) => s.label);
  const needsReview = states
    .filter((s) => s.status === "needs_review")
    .map((s) => s.label);
  return {
    conceptsCovered: mastered.length + needsReview.length,
    mastered,
    needsReview,
    encouragement: encouragement(mastered.length, needsReview.length),
  };
}
