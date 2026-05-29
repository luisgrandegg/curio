import type { Lesson } from "@curio/types";
import { describe, expect, it } from "vitest";
import { buildPipPrompt, maxQuestionsFor } from "./prompt.js";

const lesson = (count: number): Lesson => ({
  topicTitle: "Two-digit addition",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: Array.from({ length: count }, (_, i) => ({
    id: `c${i + 1}`,
    label: `Concept ${i + 1}`,
    detail: `Detail ${i + 1}`,
  })),
});

describe("maxQuestionsFor", () => {
  it("is concepts + 2, capped at 8", () => {
    expect(maxQuestionsFor(3)).toBe(5);
    expect(maxQuestionsFor(5)).toBe(7);
    expect(maxQuestionsFor(6)).toBe(8);
    expect(maxQuestionsFor(8)).toBe(8);
  });
});

describe("buildPipPrompt", () => {
  it("injects topic, age, subject, concepts, and the question budget", () => {
    const prompt = buildPipPrompt(lesson(5));
    expect(prompt).toContain("Two-digit addition");
    expect(prompt).toContain("9 years old");
    expect(prompt).toContain("(maths)");
    expect(prompt).toContain("1. Concept 1 — Detail 1");
    expect(prompt).toContain("5. Concept 5 — Detail 5");
    expect(prompt).toContain("about 7 questions"); // maxQuestionsFor(5)
  });

  it("carries the core child-safety guardrails", () => {
    const prompt = buildPipPrompt(lesson(5));
    expect(prompt).toMatch(/NEVER say "wrong"/);
    expect(prompt).toMatch(/ONLY about today's lesson|ONLY these concepts/);
    expect(prompt).toMatch(/personal information/i);
    expect(prompt).toMatch(/at most ONE hint/);
  });
});
