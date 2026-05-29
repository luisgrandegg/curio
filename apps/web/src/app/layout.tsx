import type { Metadata } from "next";
import type { ReactNode } from "react";
import { A11ySettingsProvider } from "../hooks/useA11ySettings";
import "./globals.css";

export const metadata: Metadata = {
  title: "Curio — study with Pip",
  description: "A voice-first study buddy for curious kids.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Runtime font loads (no build-time fetch); fallbacks in globals.css. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource/opendyslexic@5/index.min.css"
        />
      </head>
      <body>
        <A11ySettingsProvider>{children}</A11ySettingsProvider>
      </body>
    </html>
  );
}
