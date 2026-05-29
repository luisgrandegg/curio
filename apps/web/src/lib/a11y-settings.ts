// Presentation-only accessibility settings (no LiveKit/agent logic touched),
// except Pip's speaking speed which maps to the TTS `speed` param.
export type FontChoice = "lexend" | "opendyslexic";
export type FontSize = "comfortable" | "large" | "xlarge";
export type ReadingTheme = "cream" | "high-contrast" | "tinted";

export interface A11ySettings {
  font: FontChoice;
  size: FontSize;
  theme: ReadingTheme;
  /** Cartesia speed, 0.6–2.0; slightly slow default for ages 8–10. */
  pipSpeed: number;
  /** Read-aloud word-by-word highlighting on/off. */
  highlight: boolean;
}

export const DEFAULT_SETTINGS: A11ySettings = {
  font: "lexend",
  size: "comfortable",
  theme: "cream",
  pipSpeed: 0.9,
  highlight: true,
};

const FONT_CLASS: Record<FontChoice, string> = {
  lexend: "font-lexend",
  opendyslexic: "font-dyslexic",
};
const SIZE_CLASS: Record<FontSize, string> = {
  comfortable: "a11y-size-comfortable",
  large: "a11y-size-large",
  xlarge: "a11y-size-xlarge",
};
const THEME_CLASS: Record<ReadingTheme, string> = {
  cream: "theme-cream",
  "high-contrast": "theme-high-contrast",
  tinted: "theme-tinted",
};

/** Root class names that apply the presentation settings. */
export function settingsToClassName(s: A11ySettings): string {
  return [FONT_CLASS[s.font], SIZE_CLASS[s.size], THEME_CLASS[s.theme]].join(
    " ",
  );
}
