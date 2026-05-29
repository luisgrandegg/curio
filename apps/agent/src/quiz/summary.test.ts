import { describe, expect, it } from "vitest";
import { type ConceptState, buildStudySummary } from "./summary.js";

const states = (
  spec: Array<[string, ConceptState["status"]]>,
): ConceptState[] => spec.map(([label, status]) => ({ label, status }));

describe("buildStudySummary", () => {
  it("splits mastered and needs-review and counts covered", () => {
    const summary = buildStudySummary(
      states([
        ["Adding", "mastered"],
        ["Carrying", "needs_review"],
        ["Estimating", "pending"],
      ]),
    );
    expect(summary.mastered).toEqual(["Adding"]);
    expect(summary.needsReview).toEqual(["Carrying"]);
    expect(summary.conceptsCovered).toBe(2);
  });

  it("celebrates a clean sweep", () => {
    const s = buildStudySummary(
      states([
        ["A", "mastered"],
        ["B", "mastered"],
      ]),
    );
    expect(s.encouragement).toMatch(/proud/i);
  });

  it("is kind when nothing was mastered", () => {
    const s = buildStudySummary(states([["A", "needs_review"]]));
    expect(s.encouragement).toMatch(/hard|practise/i);
    expect(s.encouragement).not.toMatch(/fail|wrong|bad/i);
  });

  it("is encouraging on a mixed result", () => {
    const s = buildStudySummary(
      states([
        ["A", "mastered"],
        ["B", "needs_review"],
      ]),
    );
    expect(s.encouragement).toMatch(/Great job/i);
  });
});
