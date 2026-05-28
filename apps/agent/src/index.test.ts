import { describe, expect, it } from "vitest";
import { agentPlaceholder } from "./index.js";

describe("agent placeholder", () => {
  it("returns the placeholder banner", () => {
    expect(agentPlaceholder()).toContain("Curio agent placeholder");
  });
});
