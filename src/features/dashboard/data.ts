import "server-only";
import type { Database } from "@/db";
import { budapestDay, getActivity, getDailySeconds } from "@/features/account/activity";
import { currentWeekDays } from "./week";
import { getPurchases } from "@/features/account/purchases";
import { localize } from "@/features/courses/localize";
import { getCourse, getCourses } from "@/features/courses/queries";
import { courseSemester } from "@/features/courses/semester";
import { getUniversityAccess } from "@/features/payments/access";
import {
  emptyProgress,
  lessonKey,
  sanitizeProgress,
  type Progress,
} from "@/features/progress/data";

// Az irányítópult adatai egy helyen (szerver oldal): haladás tárgyanként, heti tanulási idő, előfizetések.

/** Egy lecke az irányítópult kártyáján: azonosító, cím és a témaköre címe (a „következő lecke” kiírásához). */
export type DashboardLesson = {
  topic: string;
  lesson: string;
  title: string;
  topicTitle: string;
};

/** Egy tárgy az irányítópulton: adatai, leckéi sorrendben, a szerveren tárolt haladás és a hozzáférés. */
export type DashboardCourse = {
  university: string;
  universityName: string;
  course: string;
  name: string;
  semester: number;
  lessons: DashboardLesson[];
  /** A fiókban tárolt elvégzett leckék ("témakör/lecke"); a böngésző frissebb adata felülírhatja. */
  serverDone: string[];
  /** Meg van-e véve a tárgy féléve (ha nem, a leckék nem nyithatók meg). */
  paid: boolean;
};

/** Egy nap a heti grafikonon. */
export type WeekDay = { day: string; seconds: number; isToday: boolean };

/** Egy aktív félév-hozzáférés (egyetemenként és félévenként a legkésőbbi lejárattal). */
export type ActivePass = {
  universitySlug: string;
  semester: number;
  expiresAt: Date;
};

/** A felhasználó fiókban tárolt haladása (üres, ha még nincs mentve). */
async function getServerProgress(db: Database, userId: string): Promise<Progress> {
  const row = await db.query.userProgress.findFirst({
    where: (p, { eq }) => eq(p.userId, userId),
  });
  return row ? sanitizeProgress(row.data) : emptyProgress;
}

/**
 * Minden adat az irányítópulthoz egyszerre (párhuzamosan lekérve).
 * Tárgyak: amelyekben már haladt, amelyiket utoljára nyitotta meg, vagy amelyiknek a félévét megvette;
 * ha egyik sincs, az összes használható tárgy (hogy legyen mivel kezdeni).
 */
export async function getDashboard(db: Database, userId: string, locale: string, now: Date) {
  const week = currentWeekDays(now);
  const [progress, activity, daily, purchases, active] = await Promise.all([
    getServerProgress(db, userId),
    getActivity(db, userId),
    getDailySeconds(db, userId, week[0]),
    getPurchases(db, userId, now),
    getCourses(),
  ]);

  // A tárgyak a leckéikkel és a hozzáféréssel.
  const all = await Promise.all(
    active.map(async (c) => {
      const [full, access] = await Promise.all([
        getCourse(c.university.slug, c.slug),
        getUniversityAccess(c.university.slug),
      ]);
      if (!full) return null;
      const semester = courseSemester(full.programCourses);
      const key = `${c.university.slug}/${c.slug}`;
      const course: DashboardCourse = {
        university: c.university.slug,
        universityName: localize(c.university.name, locale),
        course: c.slug,
        name: localize(full.name, locale),
        semester,
        lessons: full.topics.flatMap((t) =>
          t.lessons.map((l) => ({
            topic: t.slug,
            lesson: l.slug,
            title: localize(l.title, locale),
            topicTitle: localize(t.title, locale),
          })),
        ),
        serverDone: progress.doneLessons[key] ?? [],
        paid: access.passes.has(semester),
      };
      // Foglalkozott-e már vele: van elvégzett leckéje, ezt nyitotta meg utoljára, vagy megvette.
      const started =
        course.lessons.some((l) => course.serverDone.includes(lessonKey(l.topic, l.lesson))) ||
        progress.lastCourse[c.university.slug] === c.slug ||
        course.paid;
      return { course, started };
    }),
  );
  const list = all.filter((x) => x !== null);
  const startedCourses = list.filter((x) => x.started).map((x) => x.course);
  const courses = startedCourses.length > 0 ? startedCourses : list.map((x) => x.course);

  // Aktív hozzáférések: egyetemenként és félévenként csak a legkésőbbi lejárat számít.
  const passMap = new Map<string, ActivePass>();
  for (const p of purchases.active) {
    if (p.semester === null) continue;
    const k = `${p.universitySlug}:${p.semester}`;
    const prev = passMap.get(k);
    if (!prev || p.expiresAt > prev.expiresAt)
      passMap.set(k, {
        universitySlug: p.universitySlug,
        semester: p.semester,
        expiresAt: p.expiresAt,
      });
  }
  const passes = [...passMap.values()].sort(
    (a, b) => a.expiresAt.getTime() - b.expiresAt.getTime(),
  );

  const today = budapestDay(now);
  const weekDays: WeekDay[] = week.map((day) => ({
    day,
    seconds: daily.get(day) ?? 0,
    isToday: day === today,
  }));

  return {
    courses,
    weekDays,
    weekSeconds: weekDays.reduce((sum, d) => sum + d.seconds, 0),
    totalSeconds: activity?.totalSeconds ?? 0,
    passes,
  };
}
