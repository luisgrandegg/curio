import { describe, expect, it } from "vitest";
import {
  type A11ySettings,
  DEFAULT_SETTINGS,
  settingsToClassName,
} from "./a11y-settings";

describe("settingsToClassName", () => {
  it("maps the defaults (Lexend / comfortable / cream)", () => {
    expect(settingsToClassName(DEFAULT_SETTINGS)).toBe(
      "font-lexend a11y-size-comfortable theme-cream",
    );
  });

  it("maps each non-default choice to its class", () => {
    const s: A11ySettings = {
      font: "opendyslexic",
      size: "xlarge",
      theme: "high-contrast",
      pipSpeed: 1.2,
      highlight: false,
    };
    expect(settingsToClassName(s)).toBe(
      "font-dyslexic a11y-size-xlarge theme-high-contrast",
    );
  });
});
