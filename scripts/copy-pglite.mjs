// A böngészős SQL futtató (PGlite = PostgreSQL WebAssemblyben) fájljainak bemásolása a
// public/pglite/<verzió>/ mappába. A `pnpm install` után automatikusan lefut (postinstall), így a fájlok
// a saját szerverünkről töltődnek. A mappa nincs a gitben (.gitignore).

import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "node_modules", "@electric-sql", "pglite", "dist");
const { version } = JSON.parse(readFileSync(path.join(src, "..", "package.json"), "utf8"));
const dest = path.join(root, "public", "pglite", version);

// Csak a futtatáshoz szükséges fájlok: a főmodul és darabjai, a WASM motor és az adatfájl
// (a kiegészítők, a térképfájlok és a Node-os változatok nem kellenek).
const FILES = readdirSync(src).filter(
  (f) =>
    /^(index|chunk-[\w-]+|pglite|initdb)\.js$/.test(f) || /^(pglite|initdb)\.(wasm|data)$/.test(f),
);

mkdirSync(dest, { recursive: true });
for (const file of FILES) {
  const target = path.join(dest, file);
  // Ha már ott van, nem másoljuk újra (a verziószám a mappanévben van).
  if (!existsSync(target)) copyFileSync(path.join(src, file), target);
}
console.log(`PGlite ${version} → public/pglite/${version}/ (${FILES.length} fájl)`);
