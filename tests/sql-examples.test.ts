// Ellenőrzi, hogy a tananyag SQL példái és feladatai tényleg működnek. Ugyanazt a motort
// (public/sql/engine.mjs) és ugyanazt a PostgreSQL-t (PGlite) használja, mint a böngészős futtató,
// így ami itt átmegy, az az oldalon is.
// - ```sql setup: a lecke mintaadatbázisa, hiba nélkül felépül;
// - ```sql run: a mintaadatbázison hiba nélkül lefut;
// - ```sql starter (+ solution, + opcionális test): a megoldás átmegy az ellenőrzésen, a kötelező
//   feladat kiinduló kódja viszont még NEM (különben semmit sem kellene tenni).

import { PGlite } from "@electric-sql/pglite";
import { describe, expect, it } from "vitest";
import { loadContent } from "@/db/content";
import { parseCodeInfo } from "@/features/lessons/code-info";
// Sima JavaScript modul a public mappából (a böngésző is ezt tölti be).
import { compareResults, createSqlEngine } from "../public/sql/engine.mjs";

/** Egy futtatandó eset. */
type Case = {
  where: string;
  setup: string;
  code: string;
  solution: string | null;
  check: string | null;
  shouldPass: boolean;
};

// Az összes SQL eset összegyűjtése minden lecke minden nyelvi változatából.
function collect(): { cases: Case[]; problems: string[] } {
  const cases: Case[] = [];
  const problems: string[] = [];
  const re = /^```([^\n]*)\n([\s\S]*?)^```\s*$/gm;
  for (const course of loadContent())
    for (const topic of course.topics)
      for (const lesson of topic.lessons)
        for (const [lang, body] of Object.entries(lesson.body)) {
          if (!body) continue;
          const where = `${course.course}/${topic.slug}/${lesson.slug}.${lang}`;
          const blocks = [...body.matchAll(re)]
            .map((m) => ({ ...parseCodeInfo(m[1]), code: m[2] }))
            .filter((b) => b.lang === "sql" && b.role);
          let setup = "";
          blocks.forEach((b, i) => {
            if (b.role === "setup") setup = b.code;
            if (b.role === "run")
              cases.push({ where: `${where} (példa)`, setup, code: b.code, solution: null, check: null, shouldPass: true });
            if (b.role !== "starter") return;
            // A feladat megoldása és ellenőrzése a következő starter előtt.
            let solution: string | null = null;
            let check: string | null = null;
            for (const n of blocks.slice(i + 1)) {
              if (n.role === "starter") break;
              if (n.role === "solution" && solution === null) solution = n.code;
              if (n.role === "test" && check === null) check = n.code;
            }
            if (solution === null) {
              problems.push(`${where}: az SQL feladatnak nincs megoldása`);
              return;
            }
            cases.push({ where: `${where} (megoldás)`, setup, code: solution, solution, check, shouldPass: true });
            if (b.required)
              cases.push({ where: `${where} (kiinduló kód – nem mehet át)`, setup, code: b.code, solution, check, shouldPass: false });
          });
        }
  return { cases, problems };
}

const { cases, problems } = collect();
const engine = createSqlEngine(PGlite);

describe("az eredmények összevetése", () => {
  const t = (rows: (string | null)[][], cols = 1) => ({
    columns: Array.from({ length: cols }, (_, i) => `c${i}`),
    rows,
    allRows: rows,
    total: rows.length,
  });
  it("a sorrend csak ORDER BY-nál számít, a számok formája nem", () => {
    expect(compareResults(t([["1"], ["2"]]), t([["2"], ["1"]]), false)).toBeNull();
    expect(compareResults(t([["1"], ["2"]]), t([["2"], ["1"]]), true)).toEqual({ reason: "row", row: 1 });
    expect(compareResults(t([["2.50"]]), t([["2.5"]]), true)).toBeNull();
    expect(compareResults(t([["3.3333333333"]]), t([["3.33333333333333"]]), true)).toBeNull();
    expect(compareResults(t([[null]]), t([["NULL"]]), true)).not.toBeNull();
  });
  it("oszlop- és sorszám eltérés", () => {
    expect(compareResults(t([["1"]], 1), t([["1", "2"]], 2), false)?.reason).toBe("columns");
    expect(compareResults(t([["1"]]), t([["1"], ["1"]]), false)?.reason).toBe("rowCount");
    expect(compareResults(null, t([["1"]]), false)?.reason).toBe("noResult");
  });
});

describe("a tananyag SQL feladatai", () => {
  it("minden SQL feladatnak van megoldása", () => {
    expect(problems).toEqual([]);
  });

  it("a futtató hibát jelez a hibás kódra, és nem engedi a túl hosszú kódot", async () => {
    const bad = await engine.run({ code: "SELEC 1" });
    expect(bad.ok).toBe(false);
    expect(bad.phase).toBe("code");
    const long = await engine.run({ code: "-- ".padEnd(30_000, "x") });
    expect(long.ok).toBe(false);
  });

  it.each(cases.map((c) => [c.where, c] as const))("%s", async (_where, c) => {
    const result = await engine.run(c);
    if (c.shouldPass) expect(result.error ?? result.mismatch ?? null, c.code).toBeNull();
    expect(result.ok, c.code).toBe(c.shouldPass);
  });
});
