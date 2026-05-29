import type { Lesson } from "@curio/types";
import { describe, expect, it } from "vitest";
import { buildPipPrompt, maxQuestionsFor } from "./prompt.js";

const lesson: Lesson = {
  topicTitle: "Two-digit addition",
  summary: "We add numbers.",
  subject: "maths",
  childAge: 9,
  concepts: Array.from({ length: 5 }, (_, i) => ({
    id: `c${i + 1}`,
    label: `Concept ${i + 1}`,
    detail: `Detail ${i + 1}`,
  })),
};

// Child-safety acceptance criteria (MVP + PIP_SYSTEM_PROMPT.md) locked as a
// regression guard. Each must appear in the assembled prompt.
const GUARDRAILS: [string, RegExp][] = [
  [
    "scope lock — only lesson concepts",
    /ONLY these concepts|ONLY about today's lesson concepts/,
  ],
  ["never says wrong/no/incorrect", /NEVER say "wrong", "no", or "incorrect"/],
  ["at most one hint", /at most ONE hint per question/],
  [
    "gives the answer then needs_review",
    /kindly tell them the answer.*mark it needs_review/s,
  ],
  ["praises effort", /praise EFFORT/],
  [
    "never asks for personal information",
    /NEVER ask for any personal information/,
  ],
  ["does not repeat shared PII", /do not repeat them or ask follow-ups/],
  ["redirects negative self-talk", /puts themselves down, do NOT agree/],
  ["lets the child stop", /let them stop kindly\. Never pressure/],
  ["skips unsuitable content", /frightening, violent, adult, or unsuitable/],
  [
    "no medical/legal/safety advice",
    /do not give medical, legal, or safety advice/,
  ],
  [
    "records the verdict before speaking",
    /recordAnswer tool.*BEFORE you say your feedback/s,
  ],
  ["one question at a time", /Ask ONE question at a time/],
];

describe("Pip prompt — child-safety guardrails", () => {
  const prompt = buildPipPrompt(lesson);

  it.each(GUARDRAILS)("includes: %s", (_name, pattern) => {
    expect(prompt).toMatch(pattern);
  });

  it("weaves the child's age into the age-appropriateness rule", () => {
    expect(prompt).toMatch(/inappropriate for a 9-year-old/);
  });

  it("states a question budget and never exceeds the hard cap of 8", () => {
    expect(prompt).toMatch(/about 7 questions/); // min(8, 5 + 2)
    for (let n = 0; n <= 20; n++) {
      expect(maxQuestionsFor(n)).toBe(Math.min(8, n + 2));
      expect(maxQuestionsFor(n)).toBeLessThanOrEqual(8);
    }
  });
});
