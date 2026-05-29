import type { LessonResponse } from "@curio/types";
import { beforeEach, describe, expect, it } from "vitest";
import { clearLesson, loadLesson, saveLesson } from "./lesson-store";

const lesson: LessonResponse = {
  id: "l1",
  topicTitle: "Adding",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: [{ id: "c1", label: "L", detail: "D" }],
};

describe("lesson-store", () => {
  beforeEach(() => sessionStorage.clear());

  it("returns null when nothing is stored", () => {
    expect(loadLesson()).toBeNull();
  });

  it("round-trips a saved lesson", () => {
    saveLesson(lesson);
    expect(loadLesson()).toEqual(lesson);
  });

  it("clears the stored lesson", () => {
    saveLesson(lesson);
    clearLesson();
    expect(loadLesson()).toBeNull();
  });
});
