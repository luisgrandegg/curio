import type {
  ChildAge,
  CreateSessionResponse,
  LessonResponse,
  Subject,
} from "@curio/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface CreateLessonInput {
  subject: Subject;
  childAge: ChildAge;
  image: File;
}

/** Kid-friendly message shown when a lesson can't be extracted. */
export const UNREADABLE_MESSAGE =
  "Hmm, I couldn't read that page — try another photo with good light.";

/** Upload a lesson photo and get back the extracted concepts. */
export async function createLesson(
  input: CreateLessonInput,
): Promise<LessonResponse> {
  const form = new FormData();
  form.append("subject", input.subject);
  form.append("childAge", String(input.childAge));
  form.append("image", input.image);

  const res = await fetch(`${API_URL}/lessons`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(UNREADABLE_MESSAGE);
  return (await res.json()) as LessonResponse;
}

/** Friendly message when a quiz session can't be started. */
export const SESSION_START_MESSAGE =
  "We couldn't start the quiz just now — let's try again.";

/** Create a quiz session for a lesson and get LiveKit connection details. */
export async function createSession(
  lessonId: string,
): Promise<CreateSessionResponse> {
  const res = await fetch(`${API_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId }),
  });
  if (!res.ok) throw new Error(SESSION_START_MESSAGE);
  return (await res.json()) as CreateSessionResponse;
}

/** Finalize a quiz session. Best-effort; never blocks leaving the screen. */
export async function endSession(sessionId: string): Promise<void> {
  await fetch(`${API_URL}/sessions/${sessionId}/end`, { method: "POST" });
}
