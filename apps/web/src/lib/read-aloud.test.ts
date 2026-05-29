import type { WordTimestamp } from "@curio/types";
import { describe, expect, it } from "vitest";
import { wordIndexAt } from "./read-aloud";

const words: WordTimestamp[] = [
  { word: "Two", start: 0, end: 0.5 },
  { word: "plus", start: 0.5, end: 1 },
  { word: "two", start: 1, end: 1.4 },
];

describe("wordIndexAt", () => {
  it("finds the word spoken at a given time", () => {
    expect(wordIndexAt(words, 0.2)).toBe(0);
    expect(wordIndexAt(words, 0.7)).toBe(1);
    expect(wordIndexAt(words, 1.2)).toBe(2);
  });

  it("returns -1 before the first word and after the last", () => {
    expect(wordIndexAt(words, -0.1)).toBe(-1);
    expect(wordIndexAt(words, 2)).toBe(-1);
    expect(wordIndexAt([], 0.5)).toBe(-1);
  });
});
