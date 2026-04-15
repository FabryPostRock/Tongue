// vitest.config.js
import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: "dist", // cartella di output
    sourcemap: true, // abilita la generazione delle source map
  },
  test: {
    // clearMocks: true equivale a chiamare vi.clearAllMocks() prima di ogni test
    clearMocks: true,
    // mockReset: true equivale a chiamare vi.resetAllMocks() prima di ogni test
    mockReset: true,
  },
});
