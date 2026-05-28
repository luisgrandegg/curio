import {
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import type { LessonResponse } from "@curio/types";
import { describe, expect, it, vi } from "vitest";
import { LessonsController } from "./lessons.controller.js";
import type { LessonsService } from "./lessons.service.js";
import { LessonParseError } from "./vision/parse-lesson.js";

const fileWith = (text: string) =>
  ({ buffer: Buffer.from(text) }) as Express.Multer.File;

const dto = { subject: "maths", childAge: 9 } as const;

const controllerWith = (service: Partial<LessonsService>) =>
  new LessonsController(service as LessonsService);

describe("LessonsController", () => {
  it("converts the upload to base64 and returns the lesson", async () => {
    const saved = { id: "abc", topicTitle: "T" } as LessonResponse;
    const createFromImage = vi.fn().mockResolvedValue(saved);
    const controller = controllerWith({ createFromImage });

    const result = await controller.create(fileWith("hello"), { ...dto });

    expect(result).toBe(saved);
    expect(createFromImage).toHaveBeenCalledWith(
      Buffer.from("hello").toString("base64"),
      9,
      "maths",
    );
  });

  it("rejects a request with no photo", async () => {
    const controller = controllerWith({ createFromImage: vi.fn() });
    await expect(
      controller.create(undefined, { ...dto }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("maps an unreadable photo to a friendly 422", async () => {
    const controller = controllerWith({
      createFromImage: vi.fn().mockRejectedValue(new LessonParseError("bad")),
    });
    await expect(
      controller.create(fileWith("x"), { ...dto }),
    ).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it("rethrows unexpected errors unchanged", async () => {
    const boom = new Error("network down");
    const controller = controllerWith({
      createFromImage: vi.fn().mockRejectedValue(boom),
    });
    await expect(controller.create(fileWith("x"), { ...dto })).rejects.toBe(
      boom,
    );
  });
});
