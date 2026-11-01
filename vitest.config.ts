import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    include: ["tests/**/*.test.ts"],
    // A beépített Postgres (PGlite) indítása párhuzamos tesztek mellett több másodperc is lehet.
    testTimeout: 30_000,
  },
});
