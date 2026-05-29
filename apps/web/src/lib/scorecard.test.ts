import type { LessonConcept } from "@curio/types";
import { describe, expect, it } from "vitest";
import { reduceScorecard, seedScorecard } from "./scorecard";

const concepts: LessonConcept[] = [
  { id: "c1", label: "L1", detail: "D1" },
  { id: "c2", label: "L2", detail: "D2" },
];

describe("seedScorecard", () => {
  it("starts every concept pending with no attempts", () => {
    expect(seedScorecard(concepts)).toEqual([
      { conceptId: "c1", status: "pending", attempts: 0 },
      { conceptId: "c2", status: "pending", attempts: 0 },
    ]);
  });
});

describe("reduceScorecard", () => {
  const seed = seedScorecard(concepts);

  it("increments attempts on recordAnswer", () => {
    const out = reduceScorecard(seed, {
      type: "recordAnswer",
      conceptId: "c1",
      verdict: "partial",
      childResponse: "x",
    });
    expect(out[0]).toMatchObject({ conceptId: "c1", attempts: 1 });
    expect(out[1]).toMatchObject({ conceptId: "c2", attempts: 0 });
  });

  it("sets status on updateScorecard", () => {
    const out = reduceScorecard(seed, {
      type: "updateScorecard",
      conceptId: "c2",
      status: "mastered",
    });
    expect(out[1]).toMatchObject({ conceptId: "c2", status: "mastered" });
  });

  it("ignores summary and unknown concepts", () => {
    expect(
      reduceScorecard(seed, {
        type: "summary",
        summary: {
          conceptsCovered: 0,
          mastered: [],
          needsReview: [],
          encouragement: "Great job!",
        },
      }),
    ).toEqual(seed);
    expect(
      reduceScorecard(seed, {
        type: "updateScorecard",
        conceptId: "missing",
        status: "mastered",
      }),
    ).toEqual(seed);
  });
});
