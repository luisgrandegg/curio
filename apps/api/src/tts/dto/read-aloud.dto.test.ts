import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { describe, expect, it } from "vitest";
import { ReadAloudDto } from "./read-aloud.dto.js";

const build = (raw: Record<string, unknown>) =>
  plainToInstance(ReadAloudDto, raw);

describe("ReadAloudDto", () => {
  it("accepts text alone and coerces a valid speed", async () => {
    const dto = build({ text: "Read me", speed: "1.2" });
    expect(dto.speed).toBe(1.2);
    expect(await validate(dto)).toHaveLength(0);
  });

  it("accepts text with no speed", async () => {
    expect(await validate(build({ text: "Read me" }))).toHaveLength(0);
  });

  it("rejects empty text and out-of-range speed", async () => {
    const errors = await validate(build({ text: "", speed: "9" }));
    const fields = errors.map((e) => e.property).sort();
    expect(fields).toEqual(["speed", "text"]);
  });
});
