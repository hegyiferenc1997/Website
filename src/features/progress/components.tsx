"use client";

import { useEffect, useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { PROGRESS_STYLE_ID } from "./script";
import {
  courseKey,
  courseRatio,
  setLastCourse,
  setOpenSemesters,
  toggleTopic,
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

export type SemesterCourse = { slug: string; credits: number; topics: string[] };

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
    (s, c) => s + c.credits * courseRatio(progress, courseKey(university, c.slug), c.topics),
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
  topics,
}: {
  university: string;
  course: string;
  topics: string[];
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  const isLast = progress?.lastCourse[university] === course;
  useHandOverFromScript(progress !== null);
  return (
    <span className="grid gap-2 pt-1">
      <ProgressBar
        ratio={courseRatio(progress, courseKey(university, course), topics)}
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
  topics,
}: {
  university: string;
  course: string;
  topics: string[];
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  useEffect(() => setLastCourse(university, course), [university, course]);
  return (
    <div className="max-w-md">
      <ProgressBar
        ratio={courseRatio(progress, courseKey(university, course), topics)}
        label={t("courseProgress")}
      />
    </div>
  );
}

/** Témakör elvégzettnek jelölése. */
export function TopicDoneToggle({
  university,
  course,
  topic,
}: {
  university: string;
  course: string;
  topic: string;
}) {
  const t = useTranslations("Progress");
  const progress = useProgress();
  const key = courseKey(university, course);
  const done = progress?.doneTopics[key]?.includes(topic) ?? false;
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      aria-label={t("markDone")}
      onClick={() => toggleTopic(key, topic)}
      className={
        "inline-flex size-5 shrink-0 items-center justify-center rounded border font-mono text-xs transition-colors " +
        (done
          ? "border-accent bg-accent text-accent-fg"
          : "border-line text-transparent hover:border-accent")
      }
    >
      ✓
    </button>
  );
}
