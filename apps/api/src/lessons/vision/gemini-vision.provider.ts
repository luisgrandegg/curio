import type { ChildAge, Lesson, Subject } from "@curio/types";
import { parseLessonResponse } from "./parse-lesson.js";
import { buildVisionPrompt } from "./vision-prompt.js";
import type { VisionProvider } from "./vision-provider.interface.js";

/** The single call the provider needs from a vision model — SDK lives behind it. */
export type VisionGenerate = (input: {
  prompt: string;
  imageBase64: string;
  mimeType: string;
}) => Promise<string>;

/** Gemini-backed {@link VisionProvider}; all SDK specifics are in `generate`. */
export class GeminiVisionProvider implements VisionProvider {
  constructor(private readonly generate: VisionGenerate) {}

  async extractLesson(
    imageBase64: string,
    age: ChildAge,
    subject: Subject,
  ): Promise<Lesson> {
    const raw = await this.generate({
      prompt: buildVisionPrompt(age, subject),
      imageBase64,
      // PROD: detect real mime type from the upload instead of assuming JPEG.
      mimeType: "image/jpeg",
    });
    return parseLessonResponse(raw, { subject, childAge: age });
  }
}
