import type { LessonConcept } from "@curio/types";
import { describe, expect, it } from "vitest";
import { createQuizTracker } from "./tracker.js";

const concepts: LessonConcept[] = [
  { id: "c1", label: "Adding", detail: "d1" },
  { id: "c2", label: "Carrying", detail: "d2" },
];

describe("createQuizTracker", () => {
  it("seeds every concept as pending with its label", () => {
    expect(createQuizTracker(concepts).snapshot()).toEqual([
      { label: "Adding", status: "pending" },
      { label: "Carrying", status: "pending" },
    ]);
  });

  it("updates a concept's status and ignores unknown ids", () => {
    const tracker = createQuizTracker(concepts);
    tracker.setStatus("c1", "mastered");
    tracker.setStatus("nope", "needs_review");
    expect(tracker.snapshot()[0]).toEqual({
      label: "Adding",
      status: "mastered",
    });
    expect(tracker.snapshot()[1]).toEqual({
      label: "Carrying",
      status: "pending",
    });
  });
});
