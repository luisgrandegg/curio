import { randomUUID } from "node:crypto";
import { Injectable } from "@nestjs/common";
import type { Lesson, LessonResponse } from "@curio/types";

/**
 * In-memory lesson store. A lesson is created in Phase 1 and read back when a
 * quiz session starts (B04). `// PROD:` real persistence + TTL/eviction.
 */
@Injectable()
export class LessonsStore {
  private readonly lessons = new Map<string, LessonResponse>();

  save(lesson: Lesson): LessonResponse {
    const stored: LessonResponse = { ...lesson, id: randomUUID() };
    this.lessons.set(stored.id, stored);
    return stored;
  }

  get(id: string): LessonResponse | undefined {
    return this.lessons.get(id);
  }
}
