// Ellenőrzi, hogy a tananyag Python példái és feladatmegoldásai tényleg lefutnak hiba nélkül.
// - ```python run blokk: önmagában lefut;
// - ```python solution + utána ```python test: a megoldás és az ellenőrzés együtt lefut (az assert-ek igazak).
// Ha nincs Python a gépen, a teszt kimarad (a CI-ban és a fejlesztői gépen futhat).

import { spawnSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadContent } from "@/db/content";
import { parseCodeInfo } from "@/features/lessons/code-info";

// Az elérhető Python parancs (Windowson „python”, máshol gyakran „python3”).
const PYTHON = ["python3", "python"].find(
  (cmd) => spawnSync(cmd, ["--version"], { encoding: "utf8" }).status === 0,
);

// A beolvasást (input) használó példák ezt kapják bemenetként: sok „5”-ös sor.
const STDIN = "5\n".repeat(50);

/** Egy lefuttatandó kódrészlet: hol van, és mi a kód. */
type Snippet = { where: string; code: string };

/** A Markdown szöveg kódblokkjai sorrendben, a szerepükkel. */
function codeBlocks(markdown: string) {
  const out: { lang: string; role: string | null; code: string }[] = [];
  const re = /^```([^\n]*)\n([\s\S]*?)^```\s*$/gm;
  for (const m of markdown.matchAll(re)) {
    const { lang, role } = parseCodeInfo(m[1]);
    out.push({ lang, role, code: m[2] });
  }
  return out;
}

// Az összes futtatandó részlet összegyűjtése minden lecke minden nyelvi változatából.
function collect(): Snippet[] {
  const snippets: Snippet[] = [];
  for (const course of loadContent()) {
    for (const topic of course.topics) {
      for (const lesson of topic.lessons) {
        for (const [lang, body] of Object.entries(lesson.body)) {
          if (!body) continue;
          const where = `${course.course}/${topic.slug}/${lesson.slug}.${lang}`;
          let lastSolution: string | null = null;
          for (const block of codeBlocks(body)) {
            if (block.lang !== "python") continue;
            if (block.role === "run") snippets.push({ where, code: block.code });
            if (block.role === "solution") lastSolution = block.code;
            if (block.role === "test") {
              if (!lastSolution) throw new Error(`Ellenőrzés megoldás nélkül: ${where}`);
              snippets.push({
                where: `${where} (megoldás + ellenőrzés)`,
                code: lastSolution + "\n" + block.code,
              });
            }
          }
        }
      }
    }
  }
  return snippets;
}

describe.skipIf(!PYTHON)("a tananyag Python kódjai", () => {
  const snippets = collect();

  it("van mit ellenőrizni", () => {
    expect(snippets.length).toBeGreaterThan(0);
  });

  it.each(snippets.map((s) => [s.where, s] as const))("%s", (_where, { code }) => {
    // Ideiglenes mappában fut, hogy a fájlkezelős példák ne szemeteljék tele a projektet.
    const result = spawnSync(PYTHON!, ["-X", "utf8", "-c", code], {
      input: STDIN,
      encoding: "utf8",
      cwd: mkdtempSync(path.join(tmpdir(), "em-py-")),
      timeout: 10_000,
    });
    expect(result.stderr, code).toBe("");
    expect(result.status).toBe(0);
  });
});
