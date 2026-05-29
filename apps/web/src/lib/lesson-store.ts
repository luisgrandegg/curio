import type { LessonResponse } from "@curio/types";

// Bridges the extracted lesson from `/` to `/review`. Ephemeral by design —
// a refresh loses it (documented). `// PROD:` a proper client store.
const KEY = "curio.lesson";

export function saveLesson(lesson: LessonResponse): void {
  sessionStorage.setItem(KEY, JSON.stringify(lesson));
}

export function loadLesson(): LessonResponse | null {
  const raw = sessionStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as LessonResponse) : null;
}

export function clearLesson(): void {
  sessionStorage.removeItem(KEY);
}
