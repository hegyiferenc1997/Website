// Kódellenőrzés (pnpm lint) a Next.js ajánlott szabályaival.

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // A Next.js alapból kihagyott mappáinak felülírása: a .data/ (helyi adatbázis) is kimarad.
  globalIgnores([
    ".data/**",
    // A böngészős Python bemásolt (külső) fájljai.
    "public/pyodide/**",
    // A Next.js alapból kihagyott mappái:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
