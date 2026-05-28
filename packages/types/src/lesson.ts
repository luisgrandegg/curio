// Lesson domain contracts (photo → structured lesson). Mirrors MVP.md.

/** Subjects a lesson can belong to. Const array is the single source of truth. */
export const SUBJECTS = [
  "maths",
  "science",
  "history",
  "geography",
  "language",
  "other",
] as const;
export type Subject = (typeof SUBJECTS)[number];

/** Curio targets children aged 8–10. */
export const CHILD_AGES = [8, 9, 10] as const;
export type ChildAge = (typeof CHILD_AGES)[number];

export interface LessonConcept {
  id: string;
  /** Short, kid-friendly, e.g. "Adding two-digit numbers". */
  label: string;
  /** One sentence the tutor can quiz on. */
  detail: string;
}

export interface Lesson {
  /** e.g. "Two-digit addition". */
  topicTitle: string;
  /** 1–2 child-friendly sentences. */
  summary: string;
  subject: Subject;
  childAge: ChildAge;
  /** 5–8 items. */
  concepts: LessonConcept[];
}

export const isSubject = (value: unknown): value is Subject =>
  typeof value === "string" && (SUBJECTS as readonly string[]).includes(value);

export const isChildAge = (value: unknown): value is ChildAge =>
  value === 8 || value === 9 || value === 10;
