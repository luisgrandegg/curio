import type { ChildAge, Lesson, Subject } from "@curio/types";

/**
 * Turns a lesson photo into a structured {@link Lesson}. Implementations live
 * behind this interface so the photo-understanding model is swappable and never
 * leaks SDK calls into the lessons business logic.
 */
export interface VisionProvider {
  extractLesson(
    imageBase64: string,
    age: ChildAge,
    subject: Subject,
  ): Promise<Lesson>;
}

/** Nest DI token for the configured {@link VisionProvider}. */
export const VISION_PROVIDER = Symbol("VISION_PROVIDER");
