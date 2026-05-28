import { describe, expect, it } from "vitest";
import prettierConfig from "./prettier/index.js";
import eslintBase, { base } from "./eslint/index.js";

describe("@curio/config", () => {
  it("exports a Prettier config with the project conventions", () => {
    expect(prettierConfig.semi).toBe(true);
    expect(prettierConfig.singleQuote).toBe(false);
    expect(prettierConfig.printWidth).toBe(80);
  });

  it("exports a non-empty flat ESLint config array", () => {
    expect(Array.isArray(base)).toBe(true);
    expect(base.length).toBeGreaterThan(0);
    expect(eslintBase).toBe(base);
  });
});
