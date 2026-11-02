"use client";

import { useEffect, useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { lessonKey } from "./data";
import { GATE_STYLE_ID } from "./gate-script";
import { PROGRESS_STYLE_ID } from "./script";
import {
  courseKey,
  courseRatio,
  doneCount,
  firstOpenIndex,
  isLessonDone,
  isLessonLocked,
  setLastCourse,
  setLessonDone,
  setOpenSemesters,
  useProgress,
} from "./store";

/**
 * Amint a React a mentett haladással rajzolt, a ProgressScript ideiglenes stílusa törölhető,
 * innentől a React kezeli a lenyitást (különben a stílus nyitva tartaná a fület bezárás után is).
 */
function useHandOverFromScript(ready: boolean) {
  useEffect(() => {
    if (ready) document.getElementById(PROGRESS_STYLE_ID)?.remove();
  }, [ready]);
}

/** Vékony haladásjelző csík százalékkal. */
export function ProgressBar({ ratio, label }: { ratio: number; label: string }) {
  const percent = Math.round(ratio * 100);
  return (
    <span className="flex items-center gap-2.5">
      <span
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
      >
        <span
          className="block h-full rounded-full bg-accent transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </span>
      <span className="w-9 text-right font-mono text-xs text-muted tabular-nums">{percent}%</span>
    </span>
  );
}

/** Egy tárgy a félév haladásához; a leckék "témakör/lecke" azonosítók (lásd lessonKey). */
export type SemesterCourse = { slug: string; credits: number; lessons: string[] };

/**
 * Lenyitható félév: fejlécben a félév neve, kreditösszeg és haladás
 * (a félév összes listázott tárgyára, kredittel súlyozva).
 * Alapból minden félév zárva; a felhasználó választását megjegyezzük.
 * A mentett állapotot a ProgressScript már az első kirajzolás előtt alkalmazza (nincs villanás).
 */
export function SemesterSection({
  university,
  semester,
  title,
  credits,
  courses,
  children,
}: {
  university: string;
  semester: number;
  title: string;
  /** A félév hivatalos kreditösszege (közös tárgyak + egy specializáció). */
  credits: number;
  courses: SemesterCourse[];
  children: ReactNode;
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  const panelId = useId();
  const openList = progress?.openSemesters[university] ?? [];
  const open = openList.includes(semester);
  useHandOverFromScript(progress !== null);

  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);
  const weighted = courses.reduce(
    (s, c) => s + c.credits * courseRatio(progress, courseKey(university, c.slug), c.lessons),
    0,
  );
  const ratio = totalCredits > 0 ? weighted / totalCredits : 0;

  function toggle() {
    setOpenSemesters(
      university,
      open ? openList.filter((s) => s !== semester) : [...openList, semester],
    );
  }

  return (
    <section className="rounded-lg border border-line bg-surface">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="grid w-full gap-3 rounded-lg px-5 py-4 text-left transition-colors hover:bg-surface-hover sm:grid-cols-[1fr_minmax(0,16rem)] sm:items-center sm:gap-6"
      >
        <span className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            data-semester-chevron={`${university}:${semester}`}
            className={"font-mono text-accent transition-transform " + (open ? "rotate-90" : "")}
          >
            ›
          </span>
          <span className="font-mono text-base font-bold text-highlight">{title}</span>
          <span className="text-sm text-muted">
            {t("courseCount", { count: courses.length })} · {t("credits", { credits })}
          </span>
        </span>
        <ProgressBar ratio={ratio} label={t("semesterProgress", { title })} />
      </button>
      {/* A „hidden” attribútum helyett osztály, hogy a ProgressScript stílusa felülírhassa. */}
      <div
        id={panelId}
        data-semester-panel={`${university}:${semester}`}
        className={(open ? "grid" : "hidden") + " gap-3 border-t border-line p-5"}
      >
        {children}
      </div>
    </section>
  );
}

/** Egy tárgy haladása a kártyán, és „itt tartasz” jelzés, ha ez volt az utoljára megnyitott tárgy. */
export function CourseCardProgress({
  university,
  course,
  lessons,
}: {
  university: string;
  course: string;
  lessons: string[];
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  const isLast = progress?.lastCourse[university] === course;
  useHandOverFromScript(progress !== null);
  return (
    <span className="grid gap-2 pt-1">
      <ProgressBar
        ratio={courseRatio(progress, courseKey(university, course), lessons)}
        label={t("courseProgress")}
      />
      <span
        data-last-course={`${university}:${course}`}
        className={
          (isLast ? "inline-block" : "hidden") +
          " w-fit rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent"
        }
      >
        {t("youAreHere")}
      </span>
    </span>
  );
}

/** A tárgy oldalán: megjegyzi, hogy ennél a tárgynál tart, és mutatja a haladást. */
export function CourseProgressHeader({
  university,
  course,
  lessons,
}: {
  university: string;
  course: string;
  lessons: string[];
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  useEffect(() => setLastCourse(university, course), [university, course]);
  return (
    <div className="max-w-md">
      <ProgressBar
        ratio={courseRatio(progress, courseKey(university, course), lessons)}
        label={t("courseProgress")}
      />
    </div>
  );
}

/** A ProgressScript ezzel az attribútummal jelöli meg (még a React előtt) az elvégzett leckéket. */
const doneAttr = (university: string, course: string, lesson: string) =>
  `${courseKey(university, course)}:${lesson}`;

// Melyik lecke: egyetem, tárgy és a „témakör/lecke” azonosító.
type LessonRef = { university: string; course: string; lesson: string };

// Egy lecke kész-állapota és a váltó függvény (a pipához és a „Kész” gombhoz).
function useLessonDone({ university, course, lesson }: LessonRef) {
  const progress = useProgress();
  useHandOverFromScript(progress !== null);
  const key = courseKey(university, course);
  const done = isLessonDone(progress, key, lesson);
  return [done, () => setLessonDone(key, lesson, !done)] as const;
}

/** Kis jelölőnégyzet a leckék listájában. */
export function LessonDoneToggle(props: LessonRef & { title: string }) {
  const t = useTranslations("Progress");
  const [done, toggle] = useLessonDone(props);
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={t("markLessonDone", { title: props.title })}
      onClick={toggle}
      data-lesson-done={doneAttr(props.university, props.course, props.lesson)}
      className={
        "lesson-done inline-flex size-5 shrink-0 items-center justify-center rounded border border-line font-mono text-xs text-transparent transition-colors hover:border-accent" +
        (done ? " is-done" : "")
      }
    >
      ✓
    </button>
  );
}

/** Nagy „Kész” gomb a lecke alján. */
export function LessonDoneButton(props: LessonRef) {
  const t = useTranslations("Progress");
  const [done, toggle] = useLessonDone(props);
  return (
    <button
      type="button"
      aria-pressed={done}
      onClick={toggle}
      data-lesson-done={doneAttr(props.university, props.course, props.lesson)}
      className={
        "lesson-done inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-sm text-fg transition-colors hover:border-accent" +
        (done ? " is-done" : "")
      }
    >
      <span data-when="todo" className={done ? "hidden" : ""}>
        {t("markDoneButton")}
      </span>
      <span data-when="done" className={done ? "" : "hidden"}>
        ✓ {t("doneButton")}
      </span>
    </button>
  );
}

/** Egy témakör elvégzett leckéinek száma, pl. „2/4”. */
export function TopicProgress({
  university,
  course,
  lessons,
}: {
  university: string;
  course: string;
  lessons: string[];
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  const done = doneCount(progress, courseKey(university, course), lessons);
  return (
    <span
      className={
        "font-mono text-xs tabular-nums " +
        (done === lessons.length && lessons.length > 0 ? "text-accent" : "text-muted")
      }
      aria-label={t("topicProgress", { done, total: lessons.length })}
    >
      {done}/{lessons.length}
    </span>
  );
}

/**
 * „Tananyag indítása” gomb a tárgy oldalán: a sorrendben első, még ki nem pipált leckére visz.
 * Szerveren és az első kirajzoláskor az első leckére mutat (ugyanaz a felirat, így nincs villanás),
 * a mentett haladás betöltése után a link átáll a következő elvégzendő leckére.
 * Ha minden lecke kész, az első leckére visz.
 */
export function StartCourseLink({
  university,
  course,
  lessons,
  children,
}: {
  university: string;
  course: string;
  /** A tárgy összes leckéje sorrendben (témakör és lecke slug). */
  lessons: { topic: string; lesson: string }[];
  children: ReactNode;
}) {
  const progress = useProgress();
  const key = courseKey(university, course);
  const next =
    lessons.find((l) => !isLessonDone(progress, key, lessonKey(l.topic, l.lesson))) ?? lessons[0];
  return (
    <Link
      href={{
        pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]",
        params: { university, course, topic: next.topic, lesson: next.lesson },
      }}
      className="w-fit rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
    >
      {children}
    </Link>
  );
}

/** Kész-jelző a leckék listájában azoknál a leckéknél, amelyek a feladat teljesítésével lesznek készek. */
export function LessonDoneMark(props: LessonRef & { title: string }) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  useHandOverFromScript(progress !== null);
  const done = isLessonDone(progress, courseKey(props.university, props.course), props.lesson);
  return (
    <span
      role="img"
      aria-label={
        done
          ? t("lessonDoneLabel", { title: props.title })
          : t("lessonTodoLabel", { title: props.title })
      }
      data-lesson-done={doneAttr(props.university, props.course, props.lesson)}
      className={
        "lesson-done inline-flex size-5 shrink-0 items-center justify-center rounded border border-line font-mono text-xs text-transparent" +
        (done ? " is-done" : "")
      }
    >
      ✓
    </span>
  );
}

/** A lecke „Kész” állapota a lecke alján, ha a leckét a feladat teljesítése zárja le (nem kattintható). */
export function LessonExerciseStatus(props: LessonRef) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  useHandOverFromScript(progress !== null);
  const done = isLessonDone(progress, courseKey(props.university, props.course), props.lesson);
  return (
    <p
      data-lesson-done={doneAttr(props.university, props.course, props.lesson)}
      className={
        "lesson-done inline-flex w-fit items-center gap-2 rounded-md border border-line px-4 py-2 font-mono text-sm text-muted" +
        (done ? " is-done" : "")
      }
    >
      <span data-when="todo" className={done ? "hidden" : ""}>
        {t("exerciseTodo")}
      </span>
      <span data-when="done" className={done ? "" : "hidden"}>
        ✓ {t("exerciseDone")}
      </span>
    </p>
  );
}

/** A zárolás ideiglenes stílusának törlése, amint a React a mentett haladással rajzolt. */
function useHandOverGate(ready: boolean) {
  useEffect(() => {
    if (ready) document.getElementById(GATE_STYLE_ID)?.remove();
  }, [ready]);
}

// Egy tárgy leckéi a zároláshoz: a tárgy és a leckék sorrendben ("témakör/lecke").
type GateProps = { university: string; course: string; lessons: string[] };

/** A zárolás állapota az index. leckére, és a hozzá tartozó HTML attribútumok. */
function useGate({ university, course, lessons }: GateProps, index: number) {
  const progress = useProgress();
  useHandOverGate(progress !== null);
  const key = courseKey(university, course);
  const locked = isLessonLocked(progress, key, lessons, index);
  return {
    progress,
    key,
    locked,
    attrs: { "data-gate": `${key}#${index}`, "data-locked": locked ? "" : undefined },
  };
}

/**
 * Lecke link, amely zárolt, amíg az előző leckék nincsenek kész: halványabb, lakat ikon,
 * kattintásra nem visz sehova, és egérrel fölé érve megmondja, miért.
 */
export function GatedLessonLink({
  gate,
  index,
  href,
  className,
  children,
  current,
  lockIcon = true,
}: {
  gate: GateProps;
  index: number;
  href: {
    pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]";
    params: { university: string; course: string; topic: string; lesson: string };
  };
  className?: string;
  children: ReactNode;
  current?: boolean;
  /** false: a lakat ikont a hívó teszi a megfelelő helyre (a .gate-lock osztállyal). */
  lockIcon?: boolean;
}) {
  const t = useTranslations("Progress");
  const { locked, attrs } = useGate(gate, index);
  return (
    <Link
      href={href}
      {...attrs}
      aria-current={current ? "page" : undefined}
      aria-disabled={locked || undefined}
      data-tooltip={locked ? t("lockedHint") : undefined}
      onClick={(e) => {
        if (locked) e.preventDefault();
      }}
      className={"gate-link " + (className ?? "")}
    >
      {lockIcon && (
        <span className="gate-lock mr-1.5 hidden" aria-hidden="true">
          🔒
        </span>
      )}
      {children}
    </Link>
  );
}

/**
 * A lecke tartalma, amely zárolt, amíg az előző leckék nincsenek kész. Ilyenkor a tartalom helyett
 * egy üzenet látszik, linkkel az első el nem végzett leckére.
 */
export function LessonGate({
  gate,
  index,
  children,
}: {
  gate: GateProps;
  index: number;
  children: ReactNode;
}) {
  const t = useTranslations("Progress");
  const { progress, key, attrs } = useGate(gate, index);
  // Az első el nem végzett lecke; a haladás betöltése előtt az első lecke (ugyanaz a felirat, nincs villanás).
  const open =
    gate.lessons[Math.min(firstOpenIndex(progress, key, gate.lessons), gate.lessons.length - 1)];
  const [topic, lesson] = (progress ? open : gate.lessons[0]).split("/");
  return (
    <div {...attrs} className="grid gap-8">
      <div className="gate-notice hidden gap-3 rounded-lg border border-line bg-surface p-6">
        <p className="font-mono text-lg text-highlight">🔒 {t("lockedTitle")}</p>
        <p className="text-muted">{t("lockedText")}</p>
        <Link
          href={{
            pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]",
            params: { university: gate.university, course: gate.course, topic, lesson },
          }}
          className="w-fit rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          {t("goToOpen")} →
        </Link>
      </div>
      <div className="gate-content grid gap-8">{children}</div>
    </div>
  );
}
