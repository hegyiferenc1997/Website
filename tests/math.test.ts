// A matematikai eszközök tesztjei. Futtatás: pnpm test
// - a függvénykifejezések elemzése és kiértékelése (features/math/expr.ts);
// - a képletes kvízválaszok ellenőrzése (fn:);
// - a függvényábrák (```plot) leírása;
// - a tananyag minden képlete ($…$) és minden ábrája hibátlan.

import { describe, expect, it } from "vitest";
import { Marked } from "marked";
import { loadContent } from "@/db/content";
import { checkFn, evalMath, parseMath } from "@/features/math/expr";
import { mathExtension } from "@/features/lessons/math";
import { integrate, parsePlot } from "@/features/plot/spec";
import { parseQuiz } from "@/features/quiz/logic";

// Egy kifejezés értéke x = 2-nél.
const at2 = (s: string) => evalMath(parseMath(s), { x: 2 });

describe("függvénykifejezések", () => {
  it("műveletek, erősorrend, implicit szorzás", () => {
    expect(at2("2x + 1")).toBe(5);
    expect(at2("-x^2")).toBe(-4);
    expect(at2("2^3^2")).toBe(512);
    expect(at2("3(x+1)")).toBe(9);
    expect(at2("(x+1)(x-1)")).toBe(3);
    expect(at2("x²+1")).toBe(5);
    expect(at2("|x-5|")).toBe(3);
    expect(at2("√(x+2)")).toBe(2);
    expect(at2("4!")).toBe(24);
    expect(at2("binom(5, 2)")).toBe(10);
    expect(at2("(-8)^(1/3)")).toBeCloseTo(-2);
  });

  it("függvények zárójellel és anélkül", () => {
    expect(at2("sin^2 x + cos^2 x")).toBeCloseTo(1);
    expect(at2("x sin x")).toBeCloseTo(2 * Math.sin(2));
    expect(at2("e^-x")).toBeCloseTo(Math.exp(-2));
    expect(at2("ln x")).toBeCloseTo(Math.log(2));
    expect(at2("log(2, 8)")).toBeCloseTo(3);
    expect(at2("xe^x")).toBeCloseTo(2 * Math.exp(2));
  });

  it("összegzés (Taylor-polinom)", () => {
    expect(at2("sum(k, 0, 15, x^k/k!)")).toBeCloseTo(Math.exp(2), 6);
  });

  it("hibás kifejezésre kivétel", () => {
    expect(() => parseMath("x +")).toThrow();
    expect(() => parseMath("(x")).toThrow();
    expect(() => parseMath("y + 1")).toThrow();
    expect(() => parseMath("x $ 2")).toThrow();
  });

  it("képletes válasz ellenőrzése", () => {
    const d = { vars: ["x"], expr: "2x sin x + x^2 cos x", domain: [-3, 3] as [number, number] };
    expect(checkFn({ ...d, upToConstant: false }, "x(2sin(x) + x cos(x))")).toBe("ok");
    expect(checkFn({ ...d, upToConstant: false }, "2x cos x")).toBe("wrong");
    expect(checkFn({ ...d, upToConstant: false }, "2x +")).toBe("invalid");
    const i = { vars: ["x"], expr: "x^3/3", domain: [-3, 3] as [number, number] };
    expect(checkFn({ ...i, upToConstant: true }, "x^3/3 + 7")).toBe("ok");
    expect(checkFn({ ...i, upToConstant: true }, "x^3/3 + C")).toBe("ok");
    expect(checkFn({ ...i, upToConstant: false }, "x^3/3 + 7")).toBe("wrong");
  });
});

describe("függvényábrák", () => {
  it("a leírás feldolgozása", () => {
    const spec = parsePlot(
      [
        "title: Parabola",
        "x: -3, 3",
        "y: -1, 9",
        "param: a = 1, 0, 3, 0.1",
        "f: a x^2 # f",
        "tangent: x^2 @ a",
        "area: x^2 @ 0, a",
        "riemann: x^2 @ 0, 2, 4",
        "seq: 1/n @ 1, 20",
        "point: a, a^2 # P",
        "value: f(a) = a^2",
      ].join("\n"),
    );
    expect(spec.params[0]).toEqual({ name: "a", value: 1, min: 0, max: 3, step: 0.1 });
    expect(spec.items.map((i) => i.kind)).toEqual([
      "f",
      "tangent",
      "area",
      "riemann",
      "seq",
      "point",
      "value",
    ]);
  });

  it("hibás ábrára kivétel", () => {
    expect(() => parsePlot("f: y^2")).toThrow();
    expect(() => parsePlot("x: 3, 1\nf: x")).toThrow();
    expect(() => parsePlot("param: a = 5, 0, 3, 1\nf: a x")).toThrow();
  });

  it("a numerikus integrál pontos", () => {
    expect(integrate((x) => x * x, 0, 3)).toBeCloseTo(9, 8);
    expect(integrate(Math.sin, 0, Math.PI)).toBeCloseTo(2, 8);
  });
});

describe("a tananyag képletei és ábrái", () => {
  const marked = new Marked(mathExtension);
  const lessons = loadContent().flatMap((course) =>
    course.topics.flatMap((topic) =>
      topic.lessons.flatMap((lesson) =>
        Object.entries(lesson.body).map(([lang, body]) => ({
          where: `${course.course}/${topic.slug}/${lesson.slug}.${lang}`,
          body: body ?? "",
        })),
      ),
    ),
  );

  it("minden képlet hibátlanul kiszedhető", () => {
    const problems: string[] = [];
    for (const l of lessons) {
      try {
        marked.parse(l.body, { async: false });
      } catch (e) {
        problems.push(`${l.where}: ${(e as Error).message.slice(0, 200)}`);
      }
    }
    expect(problems).toEqual([]);
  });

  it("a képletes kvízkérdések várt válasza a próbapontokon kiszámolható (elfogadja önmagát)", () => {
    const problems: string[] = [];
    const re = /^```quiz[^\n]*\n([\s\S]*?)^```\s*$/gm;
    for (const l of lessons)
      for (const m of l.body.matchAll(re))
        for (const q of parseQuiz(m[1]).questions)
          if (q.kind === "fn" && checkFn(q, q.expr) !== "ok")
            problems.push(`${l.where}: ${q.expr}`);
    expect(problems).toEqual([]);
  });

  it("minden ábra hibátlan", () => {
    const problems: string[] = [];
    const re = /^```plot\n([\s\S]*?)^```\s*$/gm;
    for (const l of lessons)
      for (const m of l.body.matchAll(re)) {
        try {
          parsePlot(m[1]);
        } catch (e) {
          problems.push(`${l.where}: ${(e as Error).message}`);
        }
      }
    expect(problems).toEqual([]);
  });

  it("a magyar és az angol lecke ugyanannyi ábrát tartalmaz, ugyanazokkal a képletekkel", () => {
    const re = /^```plot\n([\s\S]*?)^```\s*$/gm;
    const byLesson = new Map<string, Record<string, string>>();
    for (const l of lessons) {
      const id = l.where.replace(/\.(hu|en)$/, "");
      const lang = l.where.slice(-2);
      // Csak a kifejezések számítanak (a címek és feliratok nyelvenként mások).
      const shapes = [...l.body.matchAll(re)]
        .map((m) =>
          m[1]
            .split("\n")
            .filter((line) => !line.startsWith("title:"))
            .map((line) => line.replace(/#.*$/, "").replace(/^value:.*=/, "value:="))
            .join("|"),
        )
        .join(" ;; ");
      (byLesson.get(id) ?? byLesson.set(id, {}).get(id)!)[lang] = shapes;
    }
    const problems = [...byLesson]
      .filter(([, v]) => v.en !== undefined && v.hu !== v.en)
      .map(([id]) => id);
    expect(problems).toEqual([]);
  });
});
