import type { QuizMessage } from "@curio/types";
import { describe, expect, it } from "vitest";
import { decodeQuizMessage } from "./quiz-decode";

const encode = (value: unknown): Uint8Array =>
  new TextEncoder().encode(JSON.stringify(value));

describe("decodeQuizMessage", () => {
  it("decodes each known message type", () => {
    const record: QuizMessage = {
      type: "recordAnswer",
      conceptId: "c1",
      verdict: "correct",
      childResponse: "yes",
    };
    expect(decodeQuizMessage(encode(record))).toEqual(record);
    expect(
      decodeQuizMessage(
        encode({
          type: "updateScorecard",
          conceptId: "c1",
          status: "mastered",
        }),
      ),
    ).toMatchObject({ type: "updateScorecard" });
  });

  it("returns null for unknown types and bad JSON", () => {
    expect(decodeQuizMessage(encode({ type: "nope" }))).toBeNull();
    expect(decodeQuizMessage(encode({ noType: true }))).toBeNull();
    expect(decodeQuizMessage(new TextEncoder().encode("not json"))).toBeNull();
  });
});
