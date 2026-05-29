import type { ChildAge, LessonResponse, Subject } from "@curio/types";

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
