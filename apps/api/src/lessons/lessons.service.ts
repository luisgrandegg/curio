import {
  Inject,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import type { ChildAge, LessonResponse, Subject } from "@curio/types";
import { LessonsStore } from "./lessons.store.js";
import { screenConcepts } from "./safety/concept-safety.js";
import {
  VISION_PROVIDER,
  type VisionProvider,
} from "./vision/vision-provider.interface.js";

const UNSAFE_LESSON_MESSAGE =
  "We couldn't make a safe quiz from that photo — try a different page!";

@Injectable()
export class LessonsService {
  constructor(
    @Inject(VISION_PROVIDER) private readonly vision: VisionProvider,
    private readonly store: LessonsStore,
  ) {}

  async createFromImage(
    imageBase64: string,
    childAge: ChildAge,
    subject: Subject,
  ): Promise<LessonResponse> {
    const lesson = await this.vision.extractLesson(
      imageBase64,
      childAge,
      subject,
    );
    // Child-safety: never put un-screened model output in front of a child.
    const concepts = screenConcepts(lesson.concepts);
    if (concepts.length === 0) {
      throw new UnprocessableEntityException(UNSAFE_LESSON_MESSAGE);
    }
    return this.store.save({ ...lesson, concepts });
  }
}
