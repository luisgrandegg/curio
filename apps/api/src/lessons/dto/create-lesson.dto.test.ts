import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { CreateLessonDto } from "./create-lesson.dto.js";

// Mirrors what the global ValidationPipe does to multipart fields (all strings).
const build = (raw: Record<string, unknown>) =>
  plainToInstance(CreateLessonDto, raw);

describe("CreateLessonDto", () => {
  it("coerces the childAge string to a number and accepts a valid subject", async () => {
    const dto = build({ subject: "maths", childAge: "9" });
    expect(dto.childAge).toBe(9);
    expect(await validate(dto)).toHaveLength(0);
  });

  it("rejects an unknown subject and an out-of-range age", async () => {
    const errors = await validate(build({ subject: "art", childAge: "7" }));
    const fields = errors.map((e) => e.property).sort();
    expect(fields).toEqual(["childAge", "subject"]);
  });
});
