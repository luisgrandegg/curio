import type { TranscriptEntry } from "@curio/types";
import { describe, expect, it } from "vitest";
import { reduceTranscript } from "./transcript";

const entry = (over: Partial<TranscriptEntry>): TranscriptEntry => ({
  id: "s1",
  participant: "tutor",
  text: "hello",
  isFinal: false,
  timestamp: 1,
  ...over,
});

describe("reduceTranscript", () => {
  it("appends a new segment", () => {
    const out = reduceTranscript([], entry({}));
    expect(out).toHaveLength(1);
  });

  it("replaces a partial with its final by id", () => {
    const partial = entry({ id: "s1", text: "hel", isFinal: false });
    const final = entry({ id: "s1", text: "hello", isFinal: true });
    const out = reduceTranscript([partial], final);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ text: "hello", isFinal: true });
  });

  it("keeps distinct ids in order", () => {
    const out = reduceTranscript([entry({ id: "a" })], entry({ id: "b" }));
    expect(out.map((e) => e.id)).toEqual(["a", "b"]);
  });
});
