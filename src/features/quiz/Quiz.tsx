"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseKey, isLessonDone, setLessonDone, useProgress } from "@/features/progress/store";
import type { LessonHref, LessonRef } from "@/features/python/components";
import { checkExpr, checkInput, inputRows, type ExprCheck, type QuizQuestion } from "./logic";

// A leckékbe épített feladatlap (kvíz): rövid válasz, feleletválasztás, igazságtábla kitöltése és
// logikai kifejezés begépelése. Az ellenőrzés a böngészőben fut (lásd logic.ts); a kötelező feladatlap
// hibátlan kitöltése késznek jelöli a leckét, és feloldja a következőt (mint a Python-feladatoknál).

// Egy kérdés válasza: szöveg (input/expr), választott sorszám (choice), vagy a táblázat cellái (table).
type Answer = string | number | (0 | 1 | null)[][] | null;

// Egy kérdés ellenőrzésének eredménye.
type Verdict = "ok" | "wrong" | "invalid" | "too-long" | "empty";

/** Üres válasz a kérdés fajtája szerint. */
function emptyAnswer(q: QuizQuestion): Answer {
  if (q.kind === "table") return q.outputs.map((o) => o.values.map(() => null));
  if (q.kind === "choice") return null;
  return "";
}

/** Egy kérdés ellenőrzése. */
function judge(q: QuizQuestion, a: Answer): Verdict {
  switch (q.kind) {
    case "input":
      if (typeof a !== "string" || !a.trim()) return "empty";
      return checkInput(q, a) ? "ok" : "wrong";
    case "choice":
      if (typeof a !== "number") return "empty";
      return a === q.correct ? "ok" : "wrong";
    case "expr": {
      if (typeof a !== "string" || !a.trim()) return "empty";
      const r: ExprCheck = checkExpr(q, a);
      return r;
    }
    case "table": {
      const cells = a as (0 | 1 | null)[][];
      if (cells.some((col) => col.some((v) => v === null))) return "empty";
      return q.outputs.every((o, i) => o.values.every((v, r) => cells[i][r] === v)) ? "ok" : "wrong";
    }
  }
}

/** A feladatlap: kérdések, „Ellenőrzés” gomb, eredmény. */
export function Quiz({
  questions,
  required,
  lessonRef,
  next,
}: {
  questions: QuizQuestion[];
  required: boolean;
  lessonRef?: LessonRef;
  /** A következő lecke (a siker után „Tovább” link). */
  next?: { href: LessonHref; title: string } | null;
}) {
  const t = useTranslations("Quiz");
  const progress = useProgress();
  const [answers, setAnswers] = useState<Answer[]>(() => questions.map(emptyAnswer));
  // Az utolsó ellenőrzés eredménye kérdésenként (null: még nem ellenőrizte).
  const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);

  const done =
    required && lessonRef
      ? isLessonDone(progress, courseKey(lessonRef.university, lessonRef.course), lessonRef.lesson)
      : false;

  // Egy válasz módosítása; az adott kérdés eredménye eltűnik, amíg újra nem ellenőrzi.
  function setAnswer(i: number, a: Answer) {
    setAnswers((prev) => prev.map((x, j) => (j === i ? a : x)));
    setVerdicts((prev) => prev && prev.map((v, j) => (j === i ? "empty" : v)));
  }

  function check() {
    const result = questions.map((q, i) => judge(q, answers[i]));
    setVerdicts(result);
    if (result.every((v) => v === "ok") && required && lessonRef) {
      setLessonDone(courseKey(lessonRef.university, lessonRef.course), lessonRef.lesson, true);
    }
  }

  function reset() {
    setAnswers(questions.map(emptyAnswer));
    setVerdicts(null);
  }

  const correct = verdicts?.filter((v) => v === "ok").length ?? 0;
  const allOk = verdicts !== null && correct === questions.length;

  return (
    <div className={"code-block quiz-block" + (required ? " is-required" : "")} data-role="quiz">
      <div className="code-label py-toolbar">
        <span>{required ? t("labelRequired") : t("label")}</span>
        <span className="py-actions">
          <button type="button" className="quiz-btn" onClick={reset}>
            ↺ {t("reset")}
          </button>
        </span>
      </div>

      <ol className="quiz-list">
        {questions.map((q, i) => (
          <li key={i} className="quiz-q" data-verdict={verdicts?.[i] ?? undefined}>
            <div className="quiz-prompt">
              <span className="quiz-num">{i + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: q.prompt }} />
            </div>
            <QuestionInput
              q={q}
              index={i}
              answer={answers[i]}
              onChange={(a) => setAnswer(i, a)}
              onEnter={check}
            />
            {verdicts && verdicts[i] !== "empty" && (
              <Feedback verdict={verdicts[i]} hint={q.hint} limit={q.kind === "expr" ? q.limit : null} />
            )}
            {verdicts && verdicts[i] === "empty" && verdicts.some((v) => v !== "empty") && (
              <p className="quiz-note">{t("unanswered")}</p>
            )}
          </li>
        ))}
      </ol>

      <div className="quiz-footer">
        <button type="button" className="quiz-btn is-primary" onClick={check}>
          ✓ {t("check")}
        </button>
        {verdicts && !allOk && (
          <span className="quiz-score">{t("score", { correct, total: questions.length })}</span>
        )}
      </div>

      {allOk && (
        <div className="quiz-result">
          <div className="py-pass">
            <p>✓ {t("passed")}</p>
            {required && lessonRef && (
              <p className="text-sm">
                {t("lessonDone")}{" "}
                {next && (
                  <Link href={next.href} className="font-medium underline">
                    {t("nextLesson", { title: next.title })} →
                  </Link>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      {/* A kötelező feladat állapota: a ProgressScript a React előtt is helyesen mutatja (nincs villanás). */}
      {required && lessonRef && (
        <p
          className={"py-required-status" + (done ? " is-done" : "")}
          data-exercise-done={`${courseKey(lessonRef.university, lessonRef.course)}:${lessonRef.lesson}`}
        >
          <span data-when="todo" className={done ? "hidden" : ""}>
            {t("requiredHint")}
          </span>
          <span data-when="done" className={done ? "" : "hidden"}>
            ✓ {t("requiredDone")}
          </span>
        </p>
      )}
    </div>
  );
}

/** Visszajelzés egy kérdés alatt: jó / rossz, és rossz válasznál a tipp. */
function Feedback({
  verdict,
  hint,
  limit,
}: {
  verdict: Verdict;
  hint: string | null;
  limit: number | null;
}) {
  const t = useTranslations("Quiz");
  if (verdict === "ok") return <p className="quiz-ok">✓ {t("correct")}</p>;
  const message =
    verdict === "invalid" ? t("invalidExpr") : verdict === "too-long" ? t("tooLong", { limit: limit ?? 0 }) : t("wrong");
  return (
    <div className="quiz-bad">
      <p>✗ {message}</p>
      {hint && verdict === "wrong" && (
        <p className="quiz-hint">
          <span>{t("hint")}: </span>
          <span dangerouslySetInnerHTML={{ __html: hint }} />
        </p>
      )}
    </div>
  );
}

/** A kérdés fajtájának megfelelő beviteli mező. */
function QuestionInput({
  q,
  index,
  answer,
  onChange,
  onEnter,
}: {
  q: QuizQuestion;
  index: number;
  answer: Answer;
  onChange: (a: Answer) => void;
  onEnter: () => void;
}) {
  const t = useTranslations("Quiz");
  // Enter a szövegmezőben: ellenőrzés.
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onEnter();
    }
  };

  if (q.kind === "input" || q.kind === "expr") {
    return (
      <div className="quiz-field">
        <input
          type="text"
          value={answer as string}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKey}
          spellCheck={false}
          autoComplete="off"
          aria-label={t("answerLabel", { n: index + 1 })}
          placeholder={q.kind === "expr" ? t("exprPlaceholder") : t("inputPlaceholder")}
        />
        {q.kind === "expr" && <p className="quiz-note">{t("exprHelp")}</p>}
      </div>
    );
  }

  if (q.kind === "choice") {
    return (
      <div className="quiz-choices" role="radiogroup" aria-label={t("answerLabel", { n: index + 1 })}>
        {q.choices.map((c, j) => (
          <label key={j} className={"quiz-choice" + (answer === j ? " is-selected" : "")}>
            <input
              type="radio"
              name={`quiz-${index}`}
              checked={answer === j}
              onChange={() => onChange(j)}
            />
            <span dangerouslySetInnerHTML={{ __html: c }} />
          </label>
        ))}
      </div>
    );
  }

  // Igazságtábla: a bemenetek adottak, a kimeneti cellák kattintásra váltanak: ? → 0 → 1 → 0 …
  const cells = answer as (0 | 1 | null)[][];
  const rows = inputRows(q.inputs);
  const toggle = (col: number, row: number) => {
    const v = cells[col][row];
    const nextValue: 0 | 1 = v === 0 ? 1 : 0;
    onChange(cells.map((c, i) => (i === col ? c.map((x, r) => (r === row ? nextValue : x)) : c)));
  };
  return (
    <div className="quiz-table-wrap">
      <table className="quiz-table">
        <thead>
          <tr>
            {q.inputs.map((name) => (
              <th key={name}>{name}</th>
            ))}
            {q.outputs.map((o) => (
              <th key={o.name} className="is-output">
                {o.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((env, r) => (
            <tr key={r}>
              {q.inputs.map((name) => (
                <td key={name}>{env[name]}</td>
              ))}
              {q.outputs.map((o, col) => (
                <td key={o.name} className="is-output">
                  <button
                    type="button"
                    className="quiz-cell"
                    data-empty={cells[col][r] === null ? "" : undefined}
                    onClick={() => toggle(col, r)}
                    aria-label={t("cellLabel", { output: o.name, row: r + 1 })}
                  >
                    {cells[col][r] ?? "?"}
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="quiz-note">{t("tableHelp")}</p>
    </div>
  );
}
