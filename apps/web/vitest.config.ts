import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/components/**", "src/lib/**", "src/hooks/**"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
