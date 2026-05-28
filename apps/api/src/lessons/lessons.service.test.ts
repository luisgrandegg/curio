import type { Lesson } from "@curio/types";
import { describe, expect, it, vi } from "vitest";
import { LessonsService } from "./lessons.service.js";
import { LessonsStore } from "./lessons.store.js";
import type { VisionProvider } from "./vision/vision-provider.interface.js";

const lesson: Lesson = {
  topicTitle: "Adding",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: [{ id: "c1", label: "L", detail: "D" }],
};

describe("LessonsService", () => {
  it("extracts via the provider and persists with an id", async () => {
    const vision: VisionProvider = {
      extractLesson: vi.fn().mockResolvedValue(lesson),
    };
    const store = new LessonsStore();
    const service = new LessonsService(vision, store);

    const result = await service.createFromImage("BASE64", 9, "maths");

    expect(vision.extractLesson).toHaveBeenCalledWith("BASE64", 9, "maths");
    expect(result.id).toBeTruthy();
    expect(store.get(result.id)).toEqual(result);
  });
});
