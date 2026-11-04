// A képletszedő (KaTeX) stíluslapjának és betűtípusainak bemásolása a public/katex/<verzió>/ mappába.
// A `pnpm install` után automatikusan lefut (postinstall). A stíluslapot csak a képletet tartalmazó
// leckék töltik be, a fő betűtípusokat előre (preload), így a képletek nem villannak.
// A mappa nincs a gitben (.gitignore).

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "node_modules", "katex", "dist");
const { version } = JSON.parse(
  readFileSync(path.join(root, "node_modules", "katex", "package.json"), "utf8"),
);
const dest = path.join(root, "public", "katex", version);

mkdirSync(path.join(dest, "fonts"), { recursive: true });
// A stíluslap; a betűtípusokat a fonts/ almappából hivatkozza.
const css = path.join(dest, "katex.min.css");
if (!existsSync(css)) copyFileSync(path.join(src, "katex.min.css"), css);
// Csak a woff2 betűtípusok kellenek (minden mai böngésző ezt választja elsőként).
for (const file of readdirSync(path.join(src, "fonts"))) {
  if (!file.endsWith(".woff2")) continue;
  const target = path.join(dest, "fonts", file);
  if (!existsSync(target)) copyFileSync(path.join(src, "fonts", file), target);
}
console.log(`KaTeX ${version} → public/katex/${version}/`);
