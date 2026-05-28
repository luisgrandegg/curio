import { describe, expect, it } from "vitest";
import { apiPlaceholder } from "./index.js";

describe("api placeholder", () => {
  it("returns the placeholder banner", () => {
    expect(apiPlaceholder()).toContain("Curio API placeholder");
  });
});
