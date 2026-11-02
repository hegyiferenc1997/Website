// A böngészős Python (Pyodide) fájljainak bemásolása a public/pyodide/<verzió>/ mappába.
// A `pnpm install` után automatikusan lefut (postinstall), így a fájlok a saját szerverünkről
// töltődnek (gyors, nem függ külső CDN-től). A mappa nincs a gitben (.gitignore).

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "node_modules", "pyodide");
const { version } = JSON.parse(readFileSync(path.join(src, "package.json"), "utf8"));
const dest = path.join(root, "public", "pyodide", version);

// Csak a futtatáshoz szükséges fájlok (a konzol- és térképfájlok nem kellenek).
const FILES = [
  "pyodide.mjs",
  "pyodide.asm.mjs",
  "pyodide.asm.wasm",
  "python_stdlib.zip",
  "pyodide-lock.json",
];

mkdirSync(dest, { recursive: true });
for (const file of FILES) {
  const target = path.join(dest, file);
  // Ha már ott van, nem másoljuk újra (a verziószám a mappanévben van).
  if (!existsSync(target)) copyFileSync(path.join(src, file), target);
}
console.log(`Pyodide ${version} → public/pyodide/${version}/`);
