import { SUBJECTS } from "@curio/types";
import { describe, expect, it } from "vitest";
import { StubVisionProvider } from "./stub-vision.provider.js";

describe("StubVisionProvider", () => {
  it("returns a canned 5-8 concept lesson for every subject", async () => {
    const provider = new StubVisionProvider();
    for (const subject of SUBJECTS) {
      const lesson = await provider.extractLesson("ignored", 9, subject);
      expect(lesson.subject).toBe(subject);
      expect(lesson.childAge).toBe(9);
      expect(lesson.topicTitle.length).toBeGreaterThan(0);
      expect(lesson.concepts.length).toBeGreaterThanOrEqual(5);
      expect(lesson.concepts.length).toBeLessThanOrEqual(8);
      expect(lesson.concepts[0]).toMatchObject({ id: "concept-1" });
      for (const c of lesson.concepts) {
        expect(c.label.length).toBeGreaterThan(0);
        expect(c.detail.length).toBeGreaterThan(0);
      }
    }
  });
});
