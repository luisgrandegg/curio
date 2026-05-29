import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

// NestJS DI needs decorator metadata, which esbuild (Vitest's default) drops.
// SWC emits it; see docs/adr/0002.
export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: "es6" },
      jsc: {
        target: "es2022",
        parser: { syntax: "typescript", decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
  test: {
    setupFiles: ["reflect-metadata"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/main.ts",
        // Thin SDK glue (the only @google/genai call); covered manually.
        "src/lessons/vision/gemini-client.ts",
      ],
      thresholds: { lines: 70, functions: 70, branches: 70, statements: 70 },
    },
  },
});
