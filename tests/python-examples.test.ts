// Ellenőrzi, hogy a tananyag Python példái és feladatai tényleg működnek. Ugyanazt a keretet
// (public/python/harness.py) használja, mint a böngészős futtató, így ami itt átmegy, az az oldalon is.
// - ```python run blokk: önmagában hiba nélkül lefut;
// - ```python solution + utána ```python test: a megoldás átmegy az ellenőrzésen;
// - kötelező feladat (```python starter required): a kiinduló kód még NEM megy át (különben semmit sem
//   kellene tenni), és minden leckében pontosan egy ilyen van, megoldással és ellenőrzéssel.
// Ha nincs Python a gépen, a futtatós tesztek kimaradnak.

import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
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
const HARNESS_DIR = path.resolve(__dirname, "..", "public", "python");

/** Egy futtatandó eset: hol van, a kód, az ellenőrzés, és hogy át kell-e mennie. */
type Case = { where: string; code: string; test: string | null; shouldPass: boolean };

/** A Markdown szöveg kódblokkjai sorrendben, a szerepükkel. */
function codeBlocks(markdown: string) {
  const out: { lang: string; role: string | null; required: boolean; code: string }[] = [];
  const re = /^```([^\n]*)\n([\s\S]*?)^```\s*$/gm;
  for (const m of markdown.matchAll(re)) out.push({ ...parseCodeInfo(m[1]), code: m[2] });
  return out;
}

// Az összes eset összegyűjtése minden lecke minden nyelvi változatából.
function collect(): { cases: Case[]; problems: string[] } {
  const cases: Case[] = [];
  const problems: string[] = [];
  for (const course of loadContent()) {
    for (const topic of course.topics) {
      for (const lesson of topic.lessons) {
        for (const [lang, body] of Object.entries(lesson.body)) {
          if (!body) continue;
          const where = `${course.course}/${topic.slug}/${lesson.slug}.${lang}`;
          const blocks = codeBlocks(body).filter((b) => b.lang === "python");
          let lastSolution: string | null = null;
          let requiredStarter: string | null = null;
          let requiredCount = 0;
          for (const block of blocks) {
            if (block.role === "run") {
              cases.push({ where, code: block.code, test: null, shouldPass: true });
            }
            if (block.role === "starter") {
              lastSolution = null;
              requiredStarter = block.required ? block.code : null;
              if (block.required) requiredCount++;
            }
            if (block.role === "solution") lastSolution = block.code;
            if (block.role === "test") {
              if (!lastSolution) {
                problems.push(`Ellenőrzés megoldás nélkül: ${where}`);
                continue;
              }
              cases.push({
                where: `${where} (megoldás + ellenőrzés)`,
                code: lastSolution,
                test: block.code,
                shouldPass: true,
              });
              if (requiredStarter !== null) {
                cases.push({
                  where: `${where} (kiinduló kód – nem mehet át)`,
                  code: requiredStarter,
                  test: block.code,
                  shouldPass: false,
                });
                requiredStarter = null;
              }
            }
          }
          if (lesson.hasExercise && requiredCount !== 1) {
            problems.push(`${where}: ${requiredCount} kötelező feladat (pontosan 1 kell)`);
          }
          if (requiredStarter !== null)
            problems.push(`${where}: a kötelező feladatnak nincs ellenőrzése`);
        }
      }
    }
  }
  return { cases, problems };
}

const { cases, problems } = collect();

describe("a tananyag feladatai", () => {
  it("minden lecke szerkezete rendben (kötelező feladat, megoldás, ellenőrzés)", () => {
    expect(problems).toEqual([]);
  });

  it("a Programozási alapok minden leckéjének van kötelező feladata", () => {
    const course = loadContent().find((c) => c.course === "programozas-alapjai");
    const missing = course!.topics.flatMap((t) =>
      t.lessons.filter((l) => !l.hasExercise).map((l) => `${t.slug}/${l.slug}`),
    );
    expect(missing).toEqual([]);
  });
});

describe.skipIf(!PYTHON)("a tananyag Python kódjai", () => {
  it("van mit ellenőrizni", () => {
    expect(cases.length).toBeGreaterThan(0);
  });

  it.each(cases.map((c) => [c.where, c] as const))("%s", (_where, { code, test, shouldPass }) => {
    // Ideiglenes mappában fut, hogy a fájlkezelős példák ne szemeteljék tele a projektet.
    const dir = mkdtempSync(path.join(tmpdir(), "em-py-"));
    writeFileSync(path.join(dir, "case.json"), JSON.stringify({ code, test, stdin: STDIN }));
    const script = [
      "import json, sys",
      `sys.path.insert(0, ${JSON.stringify(HARNESS_DIR)})`,
      "import harness",
      "c = json.load(open('case.json', encoding='utf-8'))",
      "r = harness.run(c['code'], c['test'], c['stdin'])",
      "json.dump(r, open('result.json', 'w', encoding='utf-8'))",
    ].join("\n");
    const proc = spawnSync(PYTHON!, ["-X", "utf8", "-c", script], {
      encoding: "utf8",
      cwd: dir,
      timeout: 10_000,
    });
    expect(proc.stderr, code).toBe("");
    const result = JSON.parse(readFileSync(path.join(dir, "result.json"), "utf8")) as {
      ok: boolean;
      error: string | null;
    };
    if (shouldPass) expect(result.error, code).toBeNull();
    expect(result.ok, code).toBe(shouldPass);
  });
});
