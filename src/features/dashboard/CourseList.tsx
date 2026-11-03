"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DashboardCourseCard } from "./CourseCard";
import type { DashboardCourse } from "./data";
import { COURSES_PER_PAGE, groupBySemester, pageCount, pageItems } from "./paging";

// A „hol tartasz” rész tartalma: fent félévválasztó fülek, alattuk a kiválasztott félév tárgyai,
// oldalanként legfeljebb 3 kártya, több tárgynál lapozóval.
// A szerver az első félév első oldalával rajzolja meg, így betöltéskor nincs villanás.

export function DashboardCourseList({
  courses,
  userId,
}: {
  courses: DashboardCourse[];
  userId: string;
}) {
  const t = useTranslations("DashboardPage");
  const tUni = useTranslations("UniversityPage");
  const groups = groupBySemester(courses);

  // A kiválasztott félév és oldal; alapból az első félév első oldala.
  const [semester, setSemester] = useState(groups[0]?.semester ?? 0);
  const [page, setPage] = useState(1);

  const group = groups.find((g) => g.semester === semester) ?? groups[0];
  if (!group) return null;
  const pages = pageCount(group.items.length);
  const current = Math.min(page, pages);
  const visible = pageItems(group.items, current);

  // A félév felirata (pl. „3. félév”).
  const semesterLabel = (s: number) =>
    s === 0 ? tUni("noSemester") : tUni("semester", { semester: s });

  // Félévváltáskor az első oldalra ugrunk.
  const selectSemester = (s: number) => {
    setSemester(s);
    setPage(1);
  };

  return (
    <div className="grid gap-4">
      {/* Félévválasztó fülek (csak ha több félévben is van tárgy) */}
      {groups.length > 1 && (
        <div role="tablist" aria-label={t("semesterTabs")} className="flex flex-wrap gap-2">
          {groups.map((g) => {
            const selected = g.semester === group.semester;
            return (
              <button
                key={g.semester}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectSemester(g.semester)}
                className={
                  "rounded-md border px-3 py-1.5 font-mono text-sm transition-colors " +
                  (selected
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line text-muted hover:border-accent hover:text-fg")
                }
              >
                {semesterLabel(g.semester)}
                <span className="ml-1.5 text-xs opacity-70">{g.items.length}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Egyetlen félévnél a fülek helyett csak a félév neve látszik */}
      {groups.length === 1 && (
        <span className="font-mono text-sm text-muted">{semesterLabel(group.semester)}</span>
      )}

      {/* A kiválasztott félév aktuális oldalának kártyái */}
      <div role={groups.length > 1 ? "tabpanel" : undefined} className="grid gap-4">
        {visible.map((c) => (
          <DashboardCourseCard key={`${c.university}/${c.course}`} data={c} userId={userId} />
        ))}
      </div>

      {/* Lapozó: csak ha a félévben több tárgy van, mint ami egy oldalra fér */}
      {group.items.length > COURSES_PER_PAGE && (
        <nav aria-label={t("pagination")} className="flex flex-wrap items-center gap-2">
          <PagerButton
            label="‹"
            tooltip={t("prevPage")}
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
          />
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <PagerButton
              key={p}
              label={String(p)}
              tooltip={t("page", { page: p })}
              active={p === current}
              onClick={() => setPage(p)}
            />
          ))}
          <PagerButton
            label="›"
            tooltip={t("nextPage")}
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
          />
          <span className="ml-1 font-mono text-xs text-muted tabular-nums">
            {t("pageInfo", { page: current, pages })}
          </span>
        </nav>
      )}
    </div>
  );
}

/** Egy gomb a lapozóban: oldalszám vagy nyíl; az aktuális oldal kiemelt, a letiltott halvány. */
function PagerButton({
  label,
  tooltip,
  active = false,
  disabled = false,
  onClick,
}: {
  label: string;
  tooltip: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={tooltip}
      aria-current={active ? "page" : undefined}
      data-tooltip={disabled ? undefined : tooltip}
      disabled={disabled}
      onClick={onClick}
      className={
        "grid h-8 min-w-8 place-items-center rounded-md border px-2 font-mono text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 " +
        (active
          ? "border-accent bg-accent text-accent-fg"
          : "border-line text-fg hover:border-accent hover:bg-surface-hover")
      }
    >
      {label}
    </button>
  );
}
