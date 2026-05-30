import type { LessonConcept } from "@curio/types";
import { describe, expect, it } from "vitest";
import { isConceptSafe, screenConcepts } from "./concept-safety.js";

function concept(label: string, detail: string): LessonConcept {
  return { id: "c", label, detail };
}

describe("concept-safety", () => {
  it("passes through age-appropriate study concepts", () => {
    expect(isConceptSafe(concept("Carrying", "Carry the ten."))).toBe(true);
    expect(isConceptSafe(concept("Capital of France", "Paris."))).toBe(true);
  });

  it("flags unsafe topics in either label or detail", () => {
    expect(isConceptSafe(concept("Guns", "How a gun works."))).toBe(false);
    expect(isConceptSafe(concept("Chemistry", "How to make meth."))).toBe(
      false,
    );
  });

  it("is case-insensitive", () => {
    expect(isConceptSafe(concept("MURDER mystery", "x"))).toBe(false);
  });

  it("does not flag safe words that merely contain a substring", () => {
    // "weed" matches but "seaweed" should not (word boundary).
    expect(isConceptSafe(concept("Seaweed", "A kind of algae."))).toBe(true);
  });

  it("screenConcepts keeps only the safe ones", () => {
    const safe = screenConcepts([
      concept("Sums", "12 + 9 = 21."),
      concept("Violence", "How to stab someone."),
      concept("Capitals", "Madrid is in Spain."),
    ]);
    expect(safe).toHaveLength(2);
    expect(safe.map((c) => c.label)).toEqual(["Sums", "Capitals"]);
  });
});
