import type { ChildAge, Subject } from "@curio/types";

/** Instruction for the vision model: strict JSON, age-appropriate, quizable. */
export function buildVisionPrompt(age: ChildAge, subject: Subject): string {
  return [
    `You are helping build a study quiz for a ${age}-year-old child.`,
    `The photo shows a ${subject} lesson page.`,
    "Extract the key ideas a child this age should remember.",
    "",
    "Return ONLY strict JSON (no markdown, no code fences) shaped exactly as:",
    "{",
    '  "topicTitle": "short kid-friendly topic",',
    '  "summary": "1-2 simple sentences a child understands",',
    '  "concepts": [{ "label": "short idea", "detail": "one quizable sentence" }]',
    "}",
    "",
    "Provide between 5 and 8 concepts. Keep language simple and concrete.",
    "Skip anything frightening or unsuitable for a young child.",
  ].join("\n");
}
