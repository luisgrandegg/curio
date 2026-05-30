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

  it("drops unsafe concepts before persisting", async () => {
    const vision: VisionProvider = {
      extractLesson: vi.fn().mockResolvedValue({
        ...lesson,
        concepts: [
          { id: "c1", label: "Carrying", detail: "Carry the ten." },
          { id: "c2", label: "Guns", detail: "How a gun works." },
        ],
      }),
    };
    const service = new LessonsService(vision, new LessonsStore());

    const result = await service.createFromImage("BASE64", 9, "maths");

    expect(result.concepts).toHaveLength(1);
    expect(result.concepts[0]?.label).toBe("Carrying");
  });

  it("rejects with a kind 422 when no safe concept remains", async () => {
    const vision: VisionProvider = {
      extractLesson: vi.fn().mockResolvedValue({
        ...lesson,
        concepts: [{ id: "c1", label: "Guns", detail: "How to shoot." }],
      }),
    };
    const service = new LessonsService(vision, new LessonsStore());

    await expect(
      service.createFromImage("BASE64", 9, "maths"),
    ).rejects.toMatchObject({ status: 422 });
  });
});
