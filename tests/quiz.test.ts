// A feladatlapok (```quiz blokkok) tesztjei. Futtatás: pnpm test
// - a logikai kifejezések feldolgozása és kiértékelése;
// - a tananyag minden kvízblokkja hibátlanul feldolgozható, a magyar és az angol változat
//   ugyanazokat a jó válaszokat várja, és az egyszerűsítő feladatok megoldása tényleg egyenértékű
//   az eredeti kifejezéssel;
// - a Digitális technika minden leckéjének van kötelező feladata.

import { describe, expect, it } from "vitest";
import { loadContent } from "@/db/content";
import {
  checkExpr,
  checkInput,
  normalizeAnswer,
  parseExpr,
  parseQuiz,
  truthColumn,
  type QuizQuestion,
} from "@/features/quiz/logic";

describe("logikai kifejezések", () => {
  const col = (src: string, inputs: string[]) => truthColumn(parseExpr(src), inputs).join("");

  it("az alapműveletek és jelöléseik", () => {
    expect(col("A·B", ["A", "B"])).toBe("0001");
    expect(col("AB", ["A", "B"])).toBe("0001");
    expect(col("A and B", ["A", "B"])).toBe("0001");
    expect(col("A+B", ["A", "B"])).toBe("0111");
    expect(col("A⊕B", ["A", "B"])).toBe("0110");
    expect(col("A^B", ["A", "B"])).toBe("0110");
    expect(col("A⊙B", ["A", "B"])).toBe("1001");
    expect(col("A'", ["A"])).toBe("10");
    expect(col("A̅", ["A"])).toBe("10");
    expect(col("¬A", ["A"])).toBe("10");
    expect(col("(A+B)'", ["A", "B"])).toBe("1000");
  });

  it("az erősorrend: NEM > ÉS > XOR > VAGY", () => {
    expect(col("A + B·C", ["A", "B", "C"])).toBe(col("A + (B·C)", ["A", "B", "C"]));
    expect(col("A ⊕ B·C", ["A", "B", "C"])).toBe(col("A ⊕ (B·C)", ["A", "B", "C"]));
    expect(col("A + B ⊕ C", ["A", "B", "C"])).toBe(col("A + (B ⊕ C)", ["A", "B", "C"]));
    expect(col("A'B", ["A", "B"])).toBe("0100");
  });

  it("indexes változók (Q0, Q1)", () => {
    expect(col("Q1·Q0", ["Q1", "Q0"])).toBe("0001");
  });

  it("hibás kifejezésre kivétel", () => {
    expect(() => parseExpr("A +")).toThrow();
    expect(() => parseExpr("(A")).toThrow();
    expect(() => parseExpr("A ? B")).toThrow();
  });

  it("a válasz ellenőrzése: egyenértékűség, literálszám, ismeretlen változó", () => {
    const q = { inputs: ["A", "B", "C"], values: truthColumn(parseExpr("A + C"), ["A", "B", "C"]) };
    expect(checkExpr({ ...q, limit: 2 }, "C + A")).toBe("ok");
    expect(checkExpr({ ...q, limit: 2 }, "A + A'C")).toBe("too-long");
    expect(checkExpr({ ...q, limit: null }, "A + A'C")).toBe("ok");
    expect(checkExpr({ ...q, limit: null }, "A·C")).toBe("wrong");
    expect(checkExpr({ ...q, limit: null }, "A + D")).toBe("invalid");
    expect(checkExpr({ ...q, limit: null }, "A +")).toBe("invalid");
    // Közömbös sorral: a 7. sorban (ABC = 111) bármi lehet.
    const v = truthColumn(parseExpr("A·B'"), ["A", "B", "C"]);
    expect(checkExpr({ inputs: ["A", "B", "C"], values: v, limit: null, dc: [7] }, "A")).toBe(
      "wrong",
    );
    expect(checkExpr({ inputs: ["A", "B", "C"], values: v, limit: null, dc: [6, 7] }, "A")).toBe(
      "ok",
    );
  });

  it("a rövid válasz egységesítése", () => {
    expect(checkInput({ answers: ["1011"] }, " 10 11₂ ")).toBe(true);
    expect(checkInput({ answers: ["2,5"] }, "2.5")).toBe(true);
    expect(checkInput({ answers: ["3F"] }, "3f")).toBe(true);
    expect(checkInput({ answers: ["3F"] }, "")).toBe(false);
  });
});

describe("a kvíz szövege", () => {
  it("minden kérdésfajta feldolgozható", () => {
    const quiz = parseQuiz(
      [
        "? Mennyi 1011₂ tízes számrendszerben?",
        "= 11",
        "! 8 + 2 + 1",
        "? Melyik univerzális kapu?",
        "- AND",
        "+ NAND",
        "? Töltsd ki!",
        "table: A, B -> Y = A·B; Z = A+B",
        "? Egyszerűsítsd!",
        "expr: A, B -> A",
        "limit: 1",
        "same: A + A·B",
      ].join("\n"),
    );
    expect(quiz.questions.map((q) => q.kind)).toEqual(["input", "choice", "table", "expr"]);
    const table = quiz.questions[2] as Extract<QuizQuestion, { kind: "table" }>;
    expect(table.outputs.map((o) => o.values.join(""))).toEqual(["0001", "0111"]);
  });

  it("hibás kvízre kivétel", () => {
    expect(() => parseQuiz("= 1")).toThrow();
    expect(() => parseQuiz("? K\n+ a\n+ b")).toThrow();
    expect(() => parseQuiz("? K\ntable: A -> Y = B")).toThrow();
  });
});

// A tananyag összes kvízblokkja leckénként és nyelvenként.
type Found = { where: string; lesson: string; lang: string; required: boolean; text: string };
function quizBlocks(): Found[] {
  const out: Found[] = [];
  const re = /^```quiz([^\n]*)\n([\s\S]*?)^```\s*$/gm;
  for (const course of loadContent())
    for (const topic of course.topics)
      for (const lesson of topic.lessons)
        for (const [lang, body] of Object.entries(lesson.body)) {
          if (!body) continue;
          const id = `${course.course}/${topic.slug}/${lesson.slug}`;
          for (const m of body.matchAll(re))
            out.push({
              where: `${id}.${lang}`,
              lesson: id,
              lang,
              required: /\brequired\b/.test(m[1]),
              text: m[2],
            });
        }
  return out;
}

// Egy kérdés „jó válasza” nyelvfüggetlen alakban (a két nyelv összehasonlításához).
function answerKey(q: QuizQuestion): string {
  switch (q.kind) {
    case "choice":
      return `choice:${q.choices.length}:${q.correct}`;
    case "table":
      return `table:${q.inputs.join(",")}:${q.outputs.map((o) => o.values.join("")).join("|")}`;
    case "expr":
      return `expr:${q.inputs.join(",")}:${q.values.join("")}:${q.limit}:${q.dc.join(",")}`;
    case "input":
      // Szám jellegű válasznál a két nyelvnek egyeznie kell; szöveges válasznál csak a fajta.
      return /^[-+]?[0-9a-f.,x ]+$/i.test(q.answers[0])
        ? `input:${normalizeAnswer(q.answers[0])}`
        : "input:text";
  }
}

describe("a tananyag feladatlapjai", () => {
  const blocks = quizBlocks();

  it("minden kvízblokk hibátlan", () => {
    const problems: string[] = [];
    for (const b of blocks) {
      try {
        parseQuiz(b.text);
      } catch (e) {
        problems.push(`${b.where}: ${(e as Error).message}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("az egyszerűsítő feladatok megoldása egyenértékű az eredeti kifejezéssel", () => {
    const problems: string[] = [];
    for (const b of blocks)
      for (const q of parseQuiz(b.text).questions) {
        if (q.kind !== "expr" || !q.same) continue;
        // A közömbös sorokat kihagyjuk az összevetésből.
        const original = truthColumn(parseExpr(q.same), q.inputs);
        if (original.some((v, i) => v !== q.values[i] && !q.dc.includes(i)))
          problems.push(`${b.where}: ${q.same} ≠ ${q.expr}`);
      }
    expect(problems).toEqual([]);
  });

  it("a magyar és az angol változat ugyanazt kérdezi, ugyanazzal a jó válasszal", () => {
    const problems: string[] = [];
    const byLesson = new Map<string, Record<string, string[]>>();
    for (const b of blocks) {
      const entry = byLesson.get(b.lesson) ?? {};
      (entry[b.lang] ??= []).push(
        (b.required ? "R " : "") + parseQuiz(b.text).questions.map(answerKey).join(" ; "),
      );
      byLesson.set(b.lesson, entry);
    }
    for (const [lesson, langs] of byLesson) {
      if (!langs.en) continue;
      if (JSON.stringify(langs.hu) !== JSON.stringify(langs.en))
        problems.push(
          `${lesson}\n hu: ${langs.hu?.join("\n     ")}\n en: ${langs.en.join("\n     ")}`,
        );
    }
    expect(problems).toEqual([]);
  });

  it("leckénként legfeljebb egy kötelező feladat van", () => {
    const counts = new Map<string, number>();
    for (const b of blocks) if (b.required) counts.set(b.where, (counts.get(b.where) ?? 0) + 1);
    expect([...counts].filter(([, n]) => n > 1)).toEqual([]);
  });
});

describe("Digitális technika", () => {
  const course = loadContent().find((c) => c.course === "digitalis-technika");

  it("van tananyaga, és minden leckének van kötelező feladata", () => {
    expect(course?.topics.length).toBe(13);
    const missing = course!.topics.flatMap((t) =>
      t.lessons.filter((l) => !l.hasExercise).map((l) => `${t.slug}/${l.slug}`),
    );
    expect(missing).toEqual([]);
  });

  it("minden lecke két nyelven elérhető", () => {
    const missing = course!.topics.flatMap((t) =>
      t.lessons.filter((l) => !l.body.en).map((l) => `${t.slug}/${l.slug}`),
    );
    expect(missing).toEqual([]);
  });
});

describe("Innováció- és projektmenedzsment", () => {
  const course = loadContent().find((c) => c.course === "innovacio-es-projektmenedzsment");

  it("van tananyaga, és minden leckének van kötelező feladata", () => {
    expect(course?.topics.length).toBe(15);
    const missing = course!.topics.flatMap((t) =>
      t.lessons.filter((l) => !l.hasExercise).map((l) => `${t.slug}/${l.slug}`),
    );
    expect(missing).toEqual([]);
  });

  it("minden lecke két nyelven elérhető", () => {
    const missing = course!.topics.flatMap((t) =>
      t.lessons.filter((l) => !l.body.en).map((l) => `${t.slug}/${l.slug}`),
    );
    expect(missing).toEqual([]);
  });
});
