import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card, EmptyState, PageHeader, SectionTitle } from "@/components/ui";
import { getAccountDb } from "@/db";
import { addDemoPurchasesAction } from "@/features/account/actions";
import { formatDate } from "@/features/account/format";
import { getPurchases, type Purchase } from "@/features/account/purchases";
import { getSessionUser } from "@/features/auth/server";
import { localize } from "@/features/courses/localize";
import { getCourseCatalog } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

// Fülcím; személyes oldal, a keresők ne vegyék fel.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MyCoursesPage");
  return { title: t("title"), robots: { index: false } };
}

// Tananyagaim: a cím azonnal megjelenik, a vásárlások táblázatai rögtön utána érkeznek.
export default async function MyCoursesPage() {
  const t = await getTranslations("MyCoursesPage");
  return (
    <div className="grid gap-8">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      <Suspense fallback={<Card className="text-muted">{t("loading")}</Card>}>
        <PurchaseTables />
      </Suspense>
    </div>
  );
}

// Egy nap ezredmásodpercben (a hátralévő idő kiszámításához).
const DAY_MS = 24 * 60 * 60 * 1000;

// A bejelentkezett felhasználó vásárlásai két táblázatban: aktívak, alatta a lejártak.
async function PurchaseTables() {
  const [t, locale, user] = await Promise.all([
    getTranslations("MyCoursesPage"),
    getLocale(),
    getSessionUser(),
  ]);
  if (!user) return <EmptyState>{t("signedOut")}</EmptyState>;

  const now = new Date();
  const [{ active, expired }, catalog] = await Promise.all([
    getAccountDb().then((db) => getPurchases(db, user.id, now)),
    getCourseCatalog(),
  ]);

  // A tárgy neve és egyeteme a tananyag-adatbázisból (a vásárlás csak a slugokat tárolja).
  const courseCell = (p: Purchase) => {
    const c = catalog.find(
      (c) => c.slug === p.courseSlug && c.university.slug === p.universitySlug,
    );
    if (!c) return <span className="text-muted">{t("unknownCourse")}</span>;
    return (
      <Link
        href={{
          pathname: "/universities/[university]/courses/[course]",
          params: { university: p.universitySlug, course: p.courseSlug },
        }}
        className="grid gap-0.5 hover:text-accent"
      >
        <span className="font-semibold">{localize(c.name, locale)}</span>
        <span className="text-xs text-muted">{localize(c.university.name, locale)}</span>
      </Link>
    );
  };

  // Hátralévő idő: napokban, az utolsó napon órákban.
  const remaining = (p: Purchase) => {
    const ms = p.expiresAt.getTime() - now.getTime();
    return ms >= DAY_MS
      ? t("remainingDays", { days: Math.floor(ms / DAY_MS) })
      : t("remainingHours", { hours: Math.floor(ms / (60 * 60 * 1000)) });
  };

  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="grid gap-10">
      <section className="grid gap-4">
        <SectionTitle>{t("activeTitle")}</SectionTitle>
        {active.length === 0 ? (
          <EmptyState>
            {t("activeEmpty")} {t("noPayments")}
          </EmptyState>
        ) : (
          <Table headers={[t("course"), t("purchasedAt"), t("remaining")]}>
            {active.map((p) => (
              <tr key={p.id}>
                <td className={cellClass}>{courseCell(p)}</td>
                <td className={`${cellClass} font-mono`}>{formatDate(p.purchasedAt, locale)}</td>
                <td className={`${cellClass} font-mono`}>
                  {/* Lejárat dátuma, utána zárójelben a hátralévő idő */}
                  {formatDate(p.expiresAt, locale)}{" "}
                  <span className="text-accent">({remaining(p)})</span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </section>

      <section className="grid gap-4">
        <SectionTitle>{t("expiredTitle")}</SectionTitle>
        {expired.length === 0 ? (
          <EmptyState>{t("expiredEmpty")}</EmptyState>
        ) : (
          <Table headers={[t("course"), t("purchasedAt"), t("expiresAt"), t("status")]}>
            {expired.map((p) => (
              <tr key={p.id} className="text-muted">
                <td className={cellClass}>{courseCell(p)}</td>
                <td className={`${cellClass} font-mono`}>{formatDate(p.purchasedAt, locale)}</td>
                <td className={`${cellClass} font-mono`}>{formatDate(p.expiresAt, locale)}</td>
                <td className={cellClass}>
                  {/* Piros „Lejárt” címke */}
                  <span className="rounded-md border border-[var(--danger,#e5534b)] px-2 py-0.5 font-mono text-xs text-[var(--danger,#e5534b)]">
                    {t("expired")}
                  </span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </section>

      {/* Csak `pnpm dev` alatt: példa adatok, hogy fizetés nélkül is kipróbálhatók legyenek a táblázatok. */}
      {isDev && (
        <form action={addDemoPurchasesAction}>
          <button
            type="submit"
            className="rounded-md border border-dashed border-line px-4 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-fg"
          >
            {t("demoButton")}
          </button>
        </form>
      )}
    </div>
  );
}

// Egy táblázatcella stílusa.
const cellClass = "px-4 py-3 align-top";

/** Keretes táblázat fejléccel; keskeny kijelzőn vízszintesen görgethető. */
function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <Card padded={false} className="overflow-x-auto">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="border-b border-line text-xs text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </Card>
  );
}
