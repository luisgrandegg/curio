import type { LessonConcept } from "@curio/types";

// Defense-in-depth child-safety screen. The vision model is prompted to stay
// age-appropriate, but we never trust a model's output for a child's quiz: every
// extracted concept is screened here against a blocklist of unsafe topics before
// it can become quiz material.
// PROD: back this with a real moderation API and keep this deterministic list as
// a fast, offline backstop. The list is intentionally conservative — for an
// 8–10yo study tutor a false drop is far cheaper than a harmful question.
const UNSAFE_PATTERNS: RegExp[] = [
  /\b(sex|sexual|porn|nude|naked|genital)\b/i,
  /\b(suicide|self[-\s]?harm)\b/i,
  /\bkill\s+(yourself|himself|herself|themselves)\b/i,
  /\b(cocaine|heroin|meth|marijuana|weed|drugs?)\b/i,
  /\b(gun|guns|shoot|shooting|stab|murder|rape)\b/i,
  /\b(fuck|shit|bitch|asshole|bastard)\b/i,
];

export function isConceptSafe(concept: LessonConcept): boolean {
  const text = `${concept.label} ${concept.detail}`;
  return !UNSAFE_PATTERNS.some((pattern) => pattern.test(text));
}

/** Returns only the concepts safe to put in front of a child. */
export function screenConcepts(concepts: LessonConcept[]): LessonConcept[] {
  return concepts.filter(isConceptSafe);
}
