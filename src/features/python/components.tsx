"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { courseKey, isLessonDone, setLessonDone, useProgress } from "@/features/progress/store";
import { CodeEditor } from "./CodeEditor";
import { preloadPython, runPython, stopPython, usePythonState, type RunResult } from "./runner";

// A leckékbe épített Python futtató felülete:
// - RunnableExample: futtatható (és kipróbálásra szerkeszthető) példa;
// - Exercise: feladat szerkesztővel, futtatással és automatikus ellenőrzéssel.
// A Python csak az első futtatáskor töltődik be (lásd runner.ts).

/** Egy lecke linkje (a lapozó és a „Tovább” gomb ezt kapja a szervertől). */
export type LessonHref = {
  pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]";
  params: { university: string; course: string; topic: string; lesson: string };
};

/** Melyik leckéhez tartozik a feladat (a haladás mentéséhez). */
export type LessonRef = { university: string; course: string; lesson: string };

// A beolvasást használó kódnál megjelenik a „Bemenet” mező.
const usesInput = (code: string) => /\binput\s*\(|sys\.stdin/.test(code);

// Egy futtatás kimenete és eredménye (a felület állapota).
type RunView = { output: string; result: RunResult | null; mode: "run" | "check" } | null;

/** A futtatás közös logikája: kimenet gyűjtése, eredmény, leállítás. */
function useRunner() {
  const locale = useLocale();
  const state = usePythonState();
  const [view, setView] = useState<RunView>(null);
  // Ez a komponens futtat-e éppen (egyszerre csak egy futtatás lehet az oldalon).
  const [mine, setMine] = useState(false);

  async function run(
    code: string,
    opts: { test?: string | null; stdin?: string; mode: "run" | "check" },
  ): Promise<RunResult> {
    setMine(true);
    setView({ output: "", result: null, mode: opts.mode });
    let output = "";
    const result = await runPython(
      { code, test: opts.test, stdin: opts.stdin, lang: locale },
      (text) => {
        output += text;
        setView({ output, result: null, mode: opts.mode });
      },
    ).catch((): RunResult => ({ ok: false, loadFailed: true }));
    setMine(false);
    setView({ output, result, mode: opts.mode });
    return result;
  }

  const busy = mine && (state === "loading" || state === "running");
  return { state, view, run, busy, mine, setView };
}

/** Gomb a futtató eszköztárában. */
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
      onPointerEnter={preloadPython}
      onFocus={preloadPython}
      disabled={disabled}
      className={
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50 " +
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
  const t = useTranslations("Python");
  if (busy) {
    return (
      <ToolButton onClick={stopPython} primary={primary}>
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

/** A „Bemenet” mező a beolvasást használó kódhoz: soronként egy beolvasott érték. */
function StdinField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const t = useTranslations("Python");
  return (
    <label className="py-stdin">
      <span>{t("stdin")}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        spellCheck={false}
        placeholder={t("stdinPlaceholder")}
      />
    </label>
  );
}

/** A kimenet doboza: a kiírt szöveg, alatta az esetleges hibaüzenet és az eredmény. */
function OutputPanel({ view, children }: { view: NonNullable<RunView>; children?: ReactNode }) {
  const t = useTranslations("Python");
  const { output, result } = view;
  const ref = useRef<HTMLPreElement>(null);
  // Hosszú kimenetnél mindig az alja látszik.
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [output]);
  return (
    <div className="py-output" role="status" aria-live="polite">
      <div className="py-output-head">
        <span>{t("output")}</span>
        {result === null && <span className="py-spinner" aria-hidden="true" />}
      </div>
      {output && <pre ref={ref}>{output}</pre>}
      {result === null && !output && <p className="py-note">{t("running")}</p>}
      {result && !output && !result.error && result.ok && view.mode === "run" && (
        <p className="py-note">{t("noOutput")}</p>
      )}
      {result?.timeout && <p className="py-fail">⏱ {t("timeout")}</p>}
      {result?.stopped && <p className="py-note">{t("stopped")}</p>}
      {result?.loadFailed && <p className="py-fail">{t("loadFailed")}</p>}
      {result?.error && view.mode === "run" && <pre className="py-error">{result.error}</pre>}
      {children}
    </div>
  );
}

/** Futtatható példa: a színezett kód, „Futtatás” gomb, és kérésre szerkeszthető másolat. */
export function RunnableExample({
  code,
  label,
  codeHtml,
}: {
  code: string;
  label: string;
  /** A szerveren színezett kód (Shiki), amíg a felhasználó nem kezdi szerkeszteni. */
  codeHtml: string;
}) {
  const t = useTranslations("Python");
  const { state, view, run, busy } = useRunner();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(code);
  const [stdin, setStdin] = useState("");
  const needsInput = usesInput(value);
  const start = () => void run(value, { stdin, mode: "run" });

  return (
    <div className="code-block py-block" data-role="run" data-lang="python">
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
          onFocus={preloadPython}
          label={t("editorLabel")}
        />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: codeHtml }} />
      )}
      {needsInput && <StdinField value={stdin} onChange={setStdin} />}
      {view && <OutputPanel view={view} />}
    </div>
  );
}

// A mentett piszkozat a böngészőben (hogy ne vesszen el a kód, ha elnavigál).
const draftKey = (ref: LessonRef | undefined, index: number, locale: string) =>
  ref ? `em:code:${courseKey(ref.university, ref.course)}/${ref.lesson}#${index}:${locale}` : null;

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
 * Feladat: szerkesztő a kiinduló kóddal, „Futtatás” és „Ellenőrzés” gomb.
 * A kötelező feladat sikeres ellenőrzése késznek jelöli a leckét (és ezzel feloldja a következőt).
 */
export function Exercise({
  index,
  starter,
  test,
  required,
  label,
  lessonRef,
  next,
}: {
  index: number;
  starter: string;
  test: string | null;
  required: boolean;
  label: string;
  lessonRef?: LessonRef;
  /** A következő lecke (a siker után „Tovább” link). */
  next?: { href: LessonHref; title: string } | null;
}) {
  const t = useTranslations("Python");
  const locale = useLocale();
  const progress = useProgress();
  const { state, view, run, busy } = useRunner();
  const [value, setValue] = useState(starter);
  const [stdin, setStdin] = useState("");
  const key = draftKey(lessonRef, index, locale);
  // Van-e mentett (a kiinduló kódtól eltérő) piszkozat, amit vissza lehet tölteni.
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
  const needsInput = usesInput(value);

  // Szerkesztés: a piszkozat mentése (a kiinduló kóddal egyező kódot nem tároljuk).
  function change(next: string) {
    setValue(next);
    setDraft(null);
    writeDraft(key, next === starter ? null : next);
  }

  const runOnly = () => void run(value, { stdin, mode: "run" });
  async function check() {
    const result = await run(value, { test, stdin, mode: "check" });
    if (result.ok && required && lessonRef) {
      setLessonDone(courseKey(lessonRef.university, lessonRef.course), lessonRef.lesson, true);
    }
  }

  const result = view?.mode === "check" ? view.result : null;

  return (
    <div
      className={"code-block py-block py-exercise" + (required ? " is-required" : "")}
      data-role="starter"
      data-lang="python"
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
          {test && (
            <RunButton busy={busy && view?.mode === "check"} state={state} onRun={check} primary>
              ✓ {t("check")}
            </RunButton>
          )}
        </span>
      </div>
      <CodeEditor
        value={value}
        onChange={change}
        onRun={test ? check : runOnly}
        onFocus={preloadPython}
        label={t("editorLabel")}
      />
      {needsInput && <StdinField value={stdin} onChange={setStdin} />}
      {view && (
        <OutputPanel view={view}>
          {result && result.ok && (
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
          )}
          {result && !result.ok && result.error && (
            <div className="py-fail-box">
              <p className="py-fail">
                ✗ {result.phase === "test" ? t("failedTest") : t("failedCode")}
              </p>
              <pre className="py-error">{result.error}</pre>
            </div>
          )}
        </OutputPanel>
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
      <p className="py-keys">{t("keys")}</p>
    </div>
  );
}
