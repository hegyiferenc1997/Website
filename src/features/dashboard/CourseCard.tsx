"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProgressBar } from "@/features/progress/components";
import { lessonKey } from "@/features/progress/data";
import { courseKey, progressOwner, useProgress } from "@/features/progress/store";
import type { DashboardCourse } from "./data";

// Egy tárgy kártyája az irányítópulton: haladás, elvégzett leckék száma és a következő lecke.
// A szerver a fiókban tárolt haladással rajzolja meg (nincs villanás); betöltés után a böngészőben
// lévő, esetleg frissebb haladás veszi át (pl. ha az utolsó pipa még nem ért fel a szerverre).

export function DashboardCourseCard({ data, userId }: { data: DashboardCourse; userId: string }) {
  const t = useTranslations("DashboardPage");
  const tProgress = useTranslations("Progress");
  const progress = useProgress();

  // A böngésző haladását csak akkor használjuk, ha ennek a felhasználónak a gyorsítótára.
  const local = progress !== null && progressOwner() === userId ? progress : null;
  const done = new Set(
    local?.doneLessons[courseKey(data.university, data.course)] ?? data.serverDone,
  );

  const total = data.lessons.length;
  const doneCount = data.lessons.filter((l) => done.has(lessonKey(l.topic, l.lesson))).length;
  // A következő lecke: a sorrendben első, még el nem végzett (a leckék sorban nyílnak).
  const next = data.lessons.find((l) => !done.has(lessonKey(l.topic, l.lesson))) ?? null;
  const finished = total > 0 && next === null;
  const target = next ?? data.lessons[0];

  return (
    <div className="grid gap-4 rounded-lg border border-line bg-surface p-5">
      {/* Fejléc: tárgy neve (link a tárgy oldalára), alatta az egyetem */}
      <div className="grid gap-1">
        <Link
          href={{
            pathname: "/universities/[university]/courses/[course]",
            params: { university: data.university, course: data.course },
          }}
          className="font-mono text-base font-bold text-fg hover:text-accent"
        >
          {data.name}
        </Link>
        <span className="text-sm text-muted">{data.universityName}</span>
      </div>

      {/* Haladás: csík és „x / y lecke kész” */}
      <div className="grid gap-1.5">
        <ProgressBar ratio={total ? doneCount / total : 0} label={tProgress("courseProgress")} />
        <span className="font-mono text-xs text-muted tabular-nums">
          {t("lessonsDone", { done: doneCount, total })}
        </span>
      </div>

      {/* Következő lecke és a folytatás gomb; megvásárolatlan félévnél a vásárlás helye */}
      {total === 0 ? null : data.paid ? (
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
          <div className="grid min-w-0 gap-0.5">
            <span className="text-xs text-muted">{finished ? t("finished") : t("nextLesson")}</span>
            {!finished && (
              <>
                <span className="truncate font-semibold text-fg">{target.title}</span>
                <span className="truncate text-xs text-muted">{target.topicTitle}</span>
              </>
            )}
          </div>
          <Link
            href={{
              pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]",
              params: {
                university: data.university,
                course: data.course,
                topic: target.topic,
                lesson: target.lesson,
              },
            }}
            className="rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            {finished ? t("review") : doneCount === 0 ? t("start") : t("continue")} →
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span className="text-sm text-muted">🔒 {t("locked")}</span>
          <Link
            href={{
              pathname: "/universities/[university]",
              params: { university: data.university },
            }}
            className="rounded-md border border-line px-4 py-2 font-mono text-sm text-fg transition-colors hover:border-accent hover:bg-surface-hover"
          >
            {t("buy")} →
          </Link>
        </div>
      )}
    </div>
  );
}
