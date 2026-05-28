import { describe, expect, it } from "vitest";
import { webPlaceholder } from "./index.js";

describe("web placeholder", () => {
  it("returns the placeholder banner", () => {
    expect(webPlaceholder()).toContain("Curio web placeholder");
  });
});
