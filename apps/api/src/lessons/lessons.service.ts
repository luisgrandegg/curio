import { Inject, Injectable } from "@nestjs/common";
import type { ChildAge, LessonResponse, Subject } from "@curio/types";
import { LessonsStore } from "./lessons.store.js";
import {
  VISION_PROVIDER,
  type VisionProvider,
} from "./vision/vision-provider.interface.js";

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
    return this.store.save(lesson);
  }
}
