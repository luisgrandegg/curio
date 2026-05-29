"use client";

import { useState } from "react";
import type {
  A11ySettings,
  FontChoice,
  FontSize,
  ReadingTheme,
} from "../lib/a11y-settings";

export interface SettingsPanelProps {
  settings: A11ySettings;
  onChange: (patch: Partial<A11ySettings>) => void;
}

const FONTS: [FontChoice, string][] = [
  ["lexend", "Lexend"],
  ["opendyslexic", "OpenDyslexic"],
];
const SIZES: [FontSize, string][] = [
  ["comfortable", "Comfortable"],
  ["large", "Large"],
  ["xlarge", "Extra large"],
];
const THEMES: [ReadingTheme, string][] = [
  ["cream", "Cream"],
  ["high-contrast", "High contrast"],
  ["tinted", "Tinted"],
];

const chip = (active: boolean): string =>
  `rounded-xl px-3 py-2 text-base ${active ? "bg-sky-600 text-white" : "bg-white ring-1 ring-slate-300"}`;

export function SettingsPanel({ settings, onChange }: SettingsPanelProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed right-4 top-4 z-40">
      <button
        type="button"
        aria-label="Accessibility settings"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-full bg-white px-3 py-2 text-2xl ring-1 ring-slate-300"
      >
        <span aria-hidden="true">⚙️</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Accessibility settings"
          className="mt-2 flex w-72 flex-col gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-300"
        >
          <fieldset className="flex flex-col gap-2">
            <legend className="font-bold">Font</legend>
            <div className="flex flex-wrap gap-2">
              {FONTS.map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={settings.font === v}
                  className={chip(settings.font === v)}
                  onClick={() => onChange({ font: v })}
                >
                  {l}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-bold">Text size</legend>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={settings.size === v}
                  className={chip(settings.size === v)}
                  onClick={() => onChange({ size: v })}
                >
                  {l}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-bold">Reading theme</legend>
            <div className="flex flex-wrap gap-2">
              {THEMES.map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={settings.theme === v}
                  className={chip(settings.theme === v)}
                  onClick={() => onChange({ theme: v })}
                >
                  {l}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1 font-bold">
            Pip&apos;s speaking speed
            <input
              type="range"
              min={0.6}
              max={2.0}
              step={0.1}
              value={settings.pipSpeed}
              aria-label="Pip's speaking speed"
              onChange={(e) => onChange({ pipSpeed: Number(e.target.value) })}
            />
          </label>

          <label className="flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={settings.highlight}
              onChange={(e) => onChange({ highlight: e.target.checked })}
            />
            Read-aloud highlighting
          </label>
        </div>
      ) : null}
    </div>
  );
}
