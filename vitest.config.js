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
});
