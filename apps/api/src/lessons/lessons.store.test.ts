import type { Lesson } from "@curio/types";
import { describe, expect, it } from "vitest";
import { LessonsStore } from "./lessons.store.js";

const lesson: Lesson = {
  topicTitle: "Adding",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: [{ id: "c1", label: "L", detail: "D" }],
};

describe("LessonsStore", () => {
  it("assigns an id on save and round-trips by get", () => {
    const store = new LessonsStore();
    const saved = store.save(lesson);
    expect(saved.id).toMatch(/[0-9a-f-]{36}/);
    expect(store.get(saved.id)).toEqual(saved);
  });

  it("returns undefined for an unknown id", () => {
    expect(new LessonsStore().get("missing")).toBeUndefined();
  });
});
