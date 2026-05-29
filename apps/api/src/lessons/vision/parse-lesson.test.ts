import { describe, expect, it } from "vitest";
import { LessonParseError, parseLessonResponse } from "./parse-lesson.js";

const ctx = { subject: "maths", childAge: 9 } as const;

const validConcepts = (n: number): string =>
  JSON.stringify(
    Array.from({ length: n }, (_, i) => ({
      label: `Idea ${i + 1}`,
      detail: `Detail ${i + 1}`,
    })),
  );

const lessonJson = (concepts: number): string =>
  `{"topicTitle":"Adding","summary":"We add numbers.","concepts":${validConcepts(concepts)}}`;

describe("parseLessonResponse", () => {
  it("parses clean JSON and trusts ctx subject/age", () => {
    const lesson = parseLessonResponse(lessonJson(5), ctx);
    expect(lesson.subject).toBe("maths");
    expect(lesson.childAge).toBe(9);
    expect(lesson.concepts).toHaveLength(5);
    expect(lesson.concepts[0]?.id).toBe("concept-1");
  });

  it("strips markdown fences and surrounding prose", () => {
    const raw = "Sure!\n```json\n" + lessonJson(6) + "\n```\nHope that helps.";
    expect(parseLessonResponse(raw, ctx).concepts).toHaveLength(6);
  });

  it("clamps to at most 8 concepts", () => {
    expect(parseLessonResponse(lessonJson(12), ctx).concepts).toHaveLength(8);
  });

  it("keeps a model-provided concept id when present", () => {
    const raw =
      '{"topicTitle":"T","summary":"S","concepts":[' +
      Array.from(
        { length: 5 },
        (_, i) => `{"id":"c${i}","label":"L${i}","detail":"D${i}"}`,
      ).join(",") +
      "]}";
    expect(parseLessonResponse(raw, ctx).concepts[0]?.id).toBe("c0");
  });

  it("throws on non-JSON output", () => {
    expect(() => parseLessonResponse("totally not json", ctx)).toThrow(
      LessonParseError,
    );
  });

  it("throws when fewer than 5 usable concepts", () => {
    expect(() => parseLessonResponse(lessonJson(3), ctx)).toThrow(
      LessonParseError,
    );
  });

  it("throws when topic or summary is missing", () => {
    const raw = `{"summary":"S","concepts":${validConcepts(5)}}`;
    expect(() => parseLessonResponse(raw, ctx)).toThrow(LessonParseError);
  });

  it("throws when concepts is not a list", () => {
    expect(() =>
      parseLessonResponse(
        '{"topicTitle":"T","summary":"S","concepts":"nope"}',
        ctx,
      ),
    ).toThrow(LessonParseError);
  });

  it("skips malformed concept entries", () => {
    const raw =
      '{"topicTitle":"T","summary":"S","concepts":[' +
      '{"label":"","detail":"d"},' +
      Array.from(
        { length: 5 },
        (_, i) => `{"label":"L${i}","detail":"D${i}"}`,
      ).join(",") +
      "]}";
    expect(parseLessonResponse(raw, ctx).concepts).toHaveLength(5);
  });
});
