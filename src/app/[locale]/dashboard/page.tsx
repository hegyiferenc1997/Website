import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card, EmptyState, PageHeader, SectionTitle } from "@/components/ui";
import { getAccountDb } from "@/db";
import { formatDateUntil } from "@/features/account/format";
import { getSessionUser } from "@/features/auth/server";
import { universityLabel } from "@/features/courses/level";
import { localize } from "@/features/courses/localize";
import { getUniversities } from "@/features/courses/queries";
import { DashboardCourseList } from "@/features/dashboard/CourseList";
import { getDashboard, type WeekDay } from "@/features/dashboard/data";
import { Link } from "@/i18n/navigation";

// Személyes irányítópult: hol tartasz a tárgyakban, mi a következő lecke, mennyit tanultál a héten,
// és meddig érvényesek az előfizetéseid. Később ide kerülnek az ismétlőkártyák, a jegyzetek és az XP is.

// Fülcím; személyes oldal, a keresők ne vegyék fel.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DashboardPage");
  return { title: t("title"), robots: { index: false } };
}

// A cím azonnal megjelenik, a személyes adatok rögtön utána érkeznek (ugyanabban a válaszban).
export default async function DashboardPage() {
  const t = await getTranslations("DashboardPage");
  return (
    <div className="grid gap-8">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      <Suspense fallback={<Card className="text-muted">{t("loading")}</Card>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

// Egy nap ezredmásodpercben (a hátralévő napokhoz).
const DAY_MS = 24 * 60 * 60 * 1000;

// Az irányítópult tartalma a bejelentkezett felhasználó adataival.
async function DashboardContent() {
  const [t, tUni, locale, user] = await Promise.all([
    getTranslations("DashboardPage"),
    getTranslations("UniversityPage"),
    getLocale(),
    getSessionUser(),
  ]);
  if (!user) return <EmptyState>{t("signedOut")}</EmptyState>;

  const now = new Date();
  const [data, universities] = await Promise.all([
    getAccountDb().then((db) => getDashboard(db, user.id, locale, now)),
    getUniversities(),
  ]);

  // Időtartam „1 óra 25 perc” alakban.
  const duration = (seconds: number) =>
    t("duration", {
      hours: Math.floor(seconds / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
    });
  // Hátralévő idő: napokban, az utolsó napon órákban.
  const remaining = (until: Date) => {
    const ms = until.getTime() - now.getTime();
    return ms >= DAY_MS
      ? t("remainingDays", { days: Math.floor(ms / DAY_MS) })
      : t("remainingHours", { hours: Math.floor(ms / (60 * 60 * 1000)) });
  };

  return (
    <div className="grid gap-10">
      {/* Üdvözlés */}
      <p className="font-mono text-lg text-fg">
        <span className="text-accent">$ </span>
        {t("greeting", { name: user.name })}
      </p>

      {/* Két oszlop: fent „hol tartasz” és heti tanulás, alatta előfizetések és összes tanulás.
          Keskeny kijelzőn egymás alá kerülnek, ebben a sorrendben. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* Hol tartasz a tárgyakban */}
        <section className="grid content-start gap-4">
          <SectionTitle>{t("coursesTitle")}</SectionTitle>
          {data.courses.length === 0 ? (
            <EmptyState>{t("coursesEmpty")}</EmptyState>
          ) : (
            // Félévenként, oldalanként legfeljebb 3 tárgy
            <DashboardCourseList courses={data.courses} userId={user.id} />
          )}
        </section>

        {/* Heti tanulási idő */}
        <section className="grid content-start gap-4">
          <SectionTitle>{t("weekTitle")}</SectionTitle>
          <Card>
            <WeekChart
              days={data.weekDays}
              locale={locale}
              total={duration(data.weekSeconds)}
              totalLabel={t("weekTotal")}
              minutesLabel={(minutes) => t("minutes", { minutes })}
            />
          </Card>
          <p className="text-xs text-muted">{t("weekHint")}</p>
        </section>

        {/* Aktív előfizetések */}
        <section className="grid content-start gap-4">
          <SectionTitle>{t("subscriptionsTitle")}</SectionTitle>
          {data.passes.length === 0 ? (
            <EmptyState>{t("subscriptionsEmpty")}</EmptyState>
          ) : (
            <Card padded={false}>
              <ul className="divide-y divide-line">
                {data.passes.map((p) => {
                  const u = universities.find((u) => u.slug === p.universitySlug);
                  return (
                    <li
                      key={`${p.universitySlug}:${p.semester}`}
                      className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                    >
                      <span className="grid gap-0.5">
                        <span className="font-semibold text-fg">
                          {p.semester === 0
                            ? tUni("noSemester")
                            : tUni("semester", { semester: p.semester })}
                        </span>
                        <span className="text-xs text-muted">
                          {u
                            ? universityLabel(localize(u.name, locale), u.level)
                            : p.universitySlug}{" "}
                          · {t("until", { date: formatDateUntil(p.expiresAt, locale) })}
                        </span>
                      </span>
                      {/* Zöld címke a hátralévő idővel (mint a Tananyagaim oldalon) */}
                      <span className="whitespace-nowrap rounded-md border border-accent px-2 py-0.5 font-mono text-xs text-accent">
                        {remaining(p.expiresAt)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
          <Link href="/my-courses" className="w-fit text-sm text-muted hover:text-accent">
            {t("allPurchases")} →
          </Link>
        </section>

        {/* Az oldalon töltött idő összesen */}
        <section className="grid content-start gap-4">
          <SectionTitle>{t("totalTitle")}</SectionTitle>
          <StatTile label={t("statTotal")} value={duration(data.totalSeconds)} />
        </section>
      </div>

      {/* Hely a későbbi funkcióknak: ismétlőkártyák, jegyzetek, XP */}
      <section className="grid gap-4">
        <SectionTitle>{t("soonTitle")}</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["flashcards", "notes", "xp"] as const).map((k) => (
            <div
              key={k}
              className="grid gap-1 rounded-lg border border-dashed border-line px-5 py-4 text-sm"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-fg">{t(`soon.${k}.title`)}</span>
                <span className="rounded bg-accent-soft px-1.5 py-0.5 font-mono text-xs text-accent">
                  {t("soonBadge")}
                </span>
              </span>
              <span className="text-muted">{t(`soon.${k}.text`)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Egy szám kártyán: felirat, nagy érték, opcionális kis magyarázat. */
function StatTile({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="grid content-start gap-1 rounded-lg border border-line bg-surface px-5 py-4">
      <span className="text-xs text-muted">{label}</span>
      <span className="font-mono text-2xl font-bold text-fg tabular-nums">{value}</span>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  );
}

/**
 * Heti oszlopdiagram: hétfőtől vasárnapig a napi tanulási idő. A mai nap felirata kiemelt,
 * egérrel egy oszlop fölé érve a pontos idő látszik; felolvasónak egy rejtett lista írja le.
 */
function WeekChart({
  days,
  locale,
  total,
  totalLabel,
  minutesLabel,
}: {
  days: WeekDay[];
  locale: string;
  total: string;
  totalLabel: string;
  minutesLabel: (minutes: number) => string;
}) {
  // A skála teteje: a legtöbb perc, de legalább 30, hogy pár perc ne tűnjön teli oszlopnak.
  const max = Math.max(30, ...days.map((d) => Math.round(d.seconds / 60)));
  // A nap rövid és hosszú neve (pl. „Sze” / „szerda”), délben UTC-vel, hogy a dátum ne csússzon el.
  const dayName = (day: string, weekday: "short" | "long") =>
    new Intl.DateTimeFormat(locale, { weekday, timeZone: "UTC" }).format(
      new Date(`${day}T12:00:00Z`),
    );

  return (
    <div className="grid gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted">{totalLabel}</span>
        <span className="font-mono text-lg font-bold text-fg tabular-nums">{total}</span>
      </div>
      {/* Az oszlopok; aria-hidden, mert a lenti lista írja le ugyanezt */}
      <div aria-hidden="true" className="grid h-36 grid-cols-7 items-end gap-2">
        {days.map((d) => {
          const minutes = Math.round(d.seconds / 60);
          return (
            <div
              key={d.day}
              data-tooltip={`${dayName(d.day, "long")}: ${minutesLabel(minutes)}`}
              className="grid h-full grid-rows-[1fr_auto] gap-1.5"
            >
              <div className="flex items-end">
                <div
                  className={
                    "w-full rounded-t bg-accent " + (minutes === 0 ? "h-0.5 opacity-40" : "")
                  }
                  style={
                    minutes > 0 ? { height: `${Math.max(4, (minutes / max) * 100)}%` } : undefined
                  }
                />
              </div>
              <span
                className={
                  "text-center font-mono text-xs " +
                  (d.isToday ? "font-bold text-accent" : "text-muted")
                }
              >
                {dayName(d.day, "short")}
              </span>
            </div>
          );
        })}
      </div>
      <ul className="sr-only">
        {days.map((d) => (
          <li key={d.day}>
            {dayName(d.day, "long")}: {minutesLabel(Math.round(d.seconds / 60))}
          </li>
        ))}
      </ul>
    </div>
  );
}
