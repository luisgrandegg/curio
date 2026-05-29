import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["src/components/**", "src/lib/**"],
      // Hooks are thin LiveKit-context glue (verified by next build); their
      // logic lives in tested lib reducers.
      exclude: ["src/**/*.test.{ts,tsx}", "src/hooks/**"],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
