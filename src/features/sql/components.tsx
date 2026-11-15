"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseKey, isLessonDone, setLessonDone, useProgress } from "@/features/progress/store";
import { CodeEditor } from "@/features/python/CodeEditor";
import type { LessonHref, LessonRef } from "@/features/python/components";
import { highlightSql } from "./highlight";
import {
  preloadSql,
  runSql,
  stopSql,
  useSqlState,
  type SqlMismatch,
  type SqlResult,
  type SqlTable,
} from "./runner";

// A leckékbe épített SQL futtató felülete:
// - SqlExample: futtatható (és kipróbálásra szerkeszthető) lekérdezés a lecke mintaadatbázisán;
// - SqlExercise: feladat szerkesztővel, futtatással és automatikus ellenőrzéssel (a megoldás
//   eredményével vetjük össze). A PostgreSQL (PGlite) csak az első futtatáskor töltődik be.
// Az eredmény cellái sima szövegként kerülnek a táblázatba (React), így a tanuló által beírt
// értékekből sem lehet HTML / szkript az oldalon.

// Egy futtatás eredménye és módja (a felület állapota).
type RunView = { result: SqlResult | null; mode: "run" | "check" } | null;

/** A futtatás közös logikája: eredmény, leállítás, „ez a komponens fut-e”. */
function useSqlRunner(setup: string) {
  const state = useSqlState();
  const [view, setView] = useState<RunView>(null);
  const [mine, setMine] = useState(false);

  async function run(
    code: string,
    opts: { solution?: string | null; check?: string | null; mode: "run" | "check" },
  ): Promise<SqlResult> {
    setMine(true);
    setView({ result: null, mode: opts.mode });
    const result = await runSql({
      setup,
      code,
      solution: opts.solution ?? null,
      check: opts.check ?? null,
    }).catch((): SqlResult => ({ ok: false, loadFailed: true, results: [] }));
    setMine(false);
    setView({ result, mode: opts.mode });
    return result;
  }

  const busy = mine && (state === "loading" || state === "running");
  return { state, view, run, busy };
}

/** Gomb a futtató eszköztárában (rámutatáskor előtölti a PostgreSQL-t). */
function ToolButton({
  onClick,
  children,
  primary = false,
  disabled = false,
}: {
  onClick: () => void;
  children: ReactNode;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerEnter={preloadSql}
      onFocus={preloadSql}
      disabled={disabled}
      className={
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
        (primary
          ? "bg-accent text-accent-fg hover:opacity-90"
          : "border border-line text-fg hover:border-accent hover:text-accent")
      }
    >
      {children}
    </button>
  );
}

/** A futtatás gombja: futás közben „Leállítás” lesz belőle. */
function RunButton({
  busy,
  state,
  onRun,
  primary,
  children,
}: {
  busy: boolean;
  state: string;
  onRun: () => void;
  primary?: boolean;
  children: ReactNode;
}) {
  const t = useTranslations("Sql");
  if (busy) {
    return (
      <ToolButton onClick={stopSql} primary={primary}>
        {state === "loading" ? (
          <>
            <span className="py-spinner" aria-hidden="true" />
            {t("loading")}
          </>
        ) : (
          <>■ {t("stop")}</>
        )}
      </ToolButton>
    );
  }
  return (
    <ToolButton onClick={onRun} primary={primary}>
      {children}
    </ToolButton>
  );
}

/** Egy lekérdezés eredménye táblázatban (vagy „N sor módosult” üzenet). */
function ResultTable({ table, caption }: { table: SqlTable; caption?: string }) {
  const t = useTranslations("Sql");
  if (table.columns.length === 0) {
    return (
      <p className="py-note">
        {table.command || "OK"}
        {table.affected !== null && table.affected > 0
          ? ` · ${t("affected", { n: table.affected })}`
          : ""}
      </p>
    );
  }
  return (
    <div className="sql-result">
      {caption && <p className="py-note">{caption}</p>}
      <div className="table-wrap sql-table">
        <table>
          <thead>
            <tr>
              {table.columns.map((c, i) => (
                <th key={i}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) =>
                  cell === null ? (
                    <td key={c} className="sql-null">
                      NULL
                    </td>
                  ) : (
                    <td key={c}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="py-note">
        {t("rows", { n: table.total })}
        {table.total > table.rows.length ? ` · ${t("truncated", { n: table.rows.length })}` : ""}
      </p>
    </div>
  );
}

/** Az eltérés szöveges magyarázata. */
function mismatchText(t: ReturnType<typeof useTranslations>, m: SqlMismatch): string {
  switch (m.reason) {
    case "noResult":
      return t("noResult");
    case "columns":
      return t("columns", { got: m.got, expected: m.expected });
    case "rowCount":
      return t("rowCount", { got: m.got, expected: m.expected });
    case "row":
      return t("rowDiff", { row: m.row });
    case "values":
      return t("values");
  }
}

/** A kimenet doboza: hibaüzenet vagy az utasítások eredményei, alatta az ellenőrzés eredménye. */
function OutputPanel({ view, children }: { view: NonNullable<RunView>; children?: ReactNode }) {
  const t = useTranslations("Sql");
  const { result } = view;
  return (
    <div className="py-output" role="status" aria-live="polite">
      <div className="py-output-head">
        <span>{t("output")}</span>
        {result === null && <span className="py-spinner" aria-hidden="true" />}
      </div>
      {result === null && <p className="py-note">{t("running")}</p>}
      {result?.timeout && <p className="py-fail">⏱ {t("timeout")}</p>}
      {result?.stopped && <p className="py-note">{t("stopped")}</p>}
      {result?.loadFailed && <p className="py-fail">{t("loadFailed")}</p>}
      {result?.empty && <p className="py-note">{t("empty")}</p>}
      {result?.error && (
        <div className="py-fail-box">
          <p className="py-fail">
            ✗ {result.phase === "setup" ? t("failedSetup") : result.phase === "check" ? t("failedCheckQuery") : t("failedCode")}
            {result.line ? ` (${t("line", { line: result.line })})` : ""}
          </p>
          <pre className="py-error">
            {result.error}
            {result.hint ? `\n${t("hint")}: ${result.hint}` : ""}
          </pre>
        </div>
      )}
      {result?.results.map((table, i) => <ResultTable key={i} table={table} />)}
      {result && result.ok && result.results.length === 0 && !result.empty && (
        <p className="py-note">{t("noOutput")}</p>
      )}
      {children}
    </div>
  );
}

/** Futtatható SQL példa: a színezett kód, „Futtatás” gomb, és kérésre szerkeszthető másolat. */
export function SqlExample({
  code,
  setup,
  label,
  codeHtml,
}: {
  code: string;
  setup: string;
  label: string;
  /** A szerveren színezett kód (Shiki), amíg a felhasználó nem kezdi szerkeszteni. */
  codeHtml: string;
}) {
  const t = useTranslations("Sql");
  const { state, view, run, busy } = useSqlRunner(setup);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(code);
  const start = () => void run(value, { mode: "run" });

  return (
    <div className="code-block py-block" data-role="run" data-lang="sql">
      <div className="code-label py-toolbar">
        <span>{label}</span>
        <span className="py-actions">
          {editing ? (
            <ToolButton
              onClick={() => {
                setValue(code);
                setEditing(false);
              }}
            >
              ↺ {t("reset")}
            </ToolButton>
          ) : (
            <ToolButton onClick={() => setEditing(true)}>✎ {t("edit")}</ToolButton>
          )}
          <RunButton busy={busy} state={state} onRun={start} primary>
            ▶ {t("run")}
          </RunButton>
        </span>
      </div>
      {editing ? (
        <CodeEditor
          value={value}
          onChange={setValue}
          onRun={start}
          onFocus={preloadSql}
          label={t("editorLabel")}
          highlight={highlightSql}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
      )}
      {view && <OutputPanel view={view} />}
    </div>
  );
}

// A mentett piszkozat a böngészőben (hogy ne vesszen el a kód, ha elnavigál).
const draftKey = (ref: LessonRef | undefined, index: number, locale: string) =>
  ref ? `em:sql:${courseKey(ref.university, ref.course)}/${ref.lesson}#${index}:${locale}` : null;

function readDraft(key: string | null): string | null {
  if (!key) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeDraft(key: string | null, value: string | null) {
  if (!key) return;
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

/**
 * SQL feladat: szerkesztő a kiinduló kóddal, „Futtatás” és „Ellenőrzés” gomb. Az ellenőrzés a tanuló
 * és a megoldás eredményét veti össze; a kötelező feladat sikere késznek jelöli a leckét (bejelentkezve).
 */
export function SqlExercise({
  index,
  starter,
  solution,
  check,
  setup,
  required,
  label,
  lessonRef,
  canMarkDone = true,
  next,
}: {
  index: number;
  starter: string;
  solution: string | null;
  check: string | null;
  setup: string;
  required: boolean;
  label: string;
  lessonRef?: LessonRef;
  canMarkDone?: boolean;
  next?: { href: LessonHref; title: string } | null;
}) {
  const t = useTranslations("Sql");
  const locale = useLocale();
  const progress = useProgress();
  const { state, view, run, busy } = useSqlRunner(setup);
  const [value, setValue] = useState(starter);
  const key = draftKey(lessonRef, index, locale);
  const [draft, setDraft] = useState<string | null>(null);
  useEffect(() => {
    const saved = readDraft(key);
    // A böngészőből olvasott piszkozat csak a betöltés után ismert (a szerveren nincs localStorage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved && saved !== starter) setDraft(saved);
  }, [key, starter]);

  const done =
    required && lessonRef
      ? isLessonDone(progress, courseKey(lessonRef.university, lessonRef.course), lessonRef.lesson)
      : false;

  // Szerkesztés: a piszkozat mentése (a kiinduló kóddal egyező kódot nem tároljuk).
  function change(nextValue: string) {
    setValue(nextValue);
    setDraft(null);
    writeDraft(key, nextValue === starter ? null : nextValue);
  }

  const runOnly = () => void run(value, { mode: "run" });
  async function verify() {
    const result = await run(value, { solution, check, mode: "check" });
    if (result.ok && required && lessonRef && canMarkDone) {
      setLessonDone(courseKey(lessonRef.university, lessonRef.course), lessonRef.lesson, true);
    }
  }

  const result = view?.mode === "check" ? view.result : null;

  return (
    <div
      className={"code-block py-block py-exercise" + (required ? " is-required" : "")}
      data-role="starter"
      data-lang="sql"
    >
      <div className="code-label py-toolbar">
        <span>{label}</span>
        <span className="py-actions">
          {draft !== null && (
            <ToolButton
              onClick={() => {
                setValue(draft);
                setDraft(null);
              }}
            >
              ⟲ {t("restoreDraft")}
            </ToolButton>
          )}
          <ToolButton onClick={() => change(starter)} disabled={value === starter}>
            ↺ {t("reset")}
          </ToolButton>
          <RunButton busy={busy && view?.mode === "run"} state={state} onRun={runOnly}>
            ▶ {t("run")}
          </RunButton>
          {solution !== null && (
            <RunButton busy={busy && view?.mode === "check"} state={state} onRun={verify} primary>
              ✓ {t("check")}
            </RunButton>
          )}
        </span>
      </div>
      <CodeEditor
        value={value}
        onChange={change}
        onRun={solution !== null ? verify : runOnly}
        onFocus={preloadSql}
        label={t("editorLabel")}
        highlight={highlightSql}
      />
      {view && (
        <OutputPanel view={view}>
          {result && result.ok && (
            <div className="py-pass">
              <p>✓ {t("passed")}</p>
              {required && lessonRef && canMarkDone && (
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
          )}
          {result && !result.ok && result.mismatch && (
            <div className="py-fail-box">
              <p className="py-fail">✗ {mismatchText(t, result.mismatch)}</p>
              {result.got && <ResultTable table={result.got} caption={t("gotCaption")} />}
              {result.expected && (
                <ResultTable table={result.expected} caption={t("expectedCaption")} />
              )}
            </div>
          )}
        </OutputPanel>
      )}
      {/* A kötelező feladat állapota: a ProgressScript a React előtt is helyesen mutatja (nincs villanás). */}
      {required && lessonRef && canMarkDone && (
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
      <p className="py-keys">{t("keys")}</p>
    </div>
  );
}
