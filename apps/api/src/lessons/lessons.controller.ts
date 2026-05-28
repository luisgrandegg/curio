import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { LessonResponse } from "@curio/types";
import { CreateLessonDto } from "./dto/create-lesson.dto.js";
import { LessonsService } from "./lessons.service.js";
import { LessonParseError } from "./vision/parse-lesson.js";

const UNREADABLE_MESSAGE =
  "Hmm, I couldn't read that page — try another photo with good light.";

@Controller("lessons")
export class LessonsController {
  constructor(private readonly lessons: LessonsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: CreateLessonDto,
  ): Promise<LessonResponse> {
    if (!file?.buffer?.length) {
      throw new BadRequestException("A lesson photo is required");
    }
    try {
      return await this.lessons.createFromImage(
        file.buffer.toString("base64"),
        dto.childAge,
        dto.subject,
      );
    } catch (error) {
      // Turn a model that couldn't read the page into a kind, retryable answer.
      if (error instanceof LessonParseError) {
        throw new UnprocessableEntityException(UNREADABLE_MESSAGE);
      }
      throw error;
    }
  }
}
