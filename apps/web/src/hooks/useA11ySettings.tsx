"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { SettingsPanel } from "../components/SettingsPanel";
import {
  type A11ySettings,
  DEFAULT_SETTINGS,
  settingsToClassName,
} from "../lib/a11y-settings";

interface A11yContextValue {
  settings: A11ySettings;
  update: (patch: Partial<A11ySettings>) => void;
}

const A11yContext = createContext<A11yContextValue | null>(null);

// Settings live in React state only (no persistence). `// PROD:` persist a
// per-child accessibility profile.
export function A11ySettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT_SETTINGS);
  const value = useMemo<A11yContextValue>(
    () => ({
      settings,
      update: (patch) => setSettings((s) => ({ ...s, ...patch })),
    }),
    [settings],
  );

  return (
    <A11yContext.Provider value={value}>
      <div className={`a11y-root ${settingsToClassName(settings)}`}>
        <SettingsPanel settings={settings} onChange={value.update} />
        {children}
      </div>
    </A11yContext.Provider>
  );
}

export function useA11ySettings(): A11yContextValue {
  const ctx = useContext(A11yContext);
  if (!ctx) {
    throw new Error("useA11ySettings must be used within A11ySettingsProvider");
  }
  return ctx;
}
