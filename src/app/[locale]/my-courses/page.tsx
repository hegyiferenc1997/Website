import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card, EmptyState, PageHeader, SectionTitle } from "@/components/ui";
import { getAccountDb } from "@/db";
import { addDemoPurchasesAction } from "@/features/account/actions";
import { deletePurchaseAction } from "@/features/admin/actions";
import { getAdminState } from "@/features/admin/god-mode";
import { formatDate } from "@/features/account/format";
import { getPurchases, type Purchase } from "@/features/account/purchases";
import { getSessionUser } from "@/features/auth/server";
import { localize } from "@/features/courses/localize";
import { getCourseCatalog, getUniversities } from "@/features/courses/queries";
import { formatHuf, isPlanId } from "@/features/payments/plans";
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
  const [t, tUni, tPay, locale, user] = await Promise.all([
    getTranslations("MyCoursesPage"),
    getTranslations("UniversityPage"),
    getTranslations("Payments"),
    getLocale(),
    getSessionUser(),
  ]);
  if (!user) return <EmptyState>{t("signedOut")}</EmptyState>;
  // God mode-ban (admin) a sorok törölhetők, hogy kipróbálható legyen az üres állapot.
  const { godMode } = await getAdminState();

  const now = new Date();
  const [{ active, expired }, catalog, universities] = await Promise.all([
    getAccountDb().then((db) => getPurchases(db, user.id, now)),
    getCourseCatalog(),
    getUniversities(),
  ]);

  // A vásárlás megnevezése: félév-vásárlásnál a félév és az egyetem (link az egyetem oldalára), alatta
  // a csomag és az ár; régi, tárgyankénti vásárlásnál a tárgy neve (a vásárlás csak a slugokat tárolja).
  const courseCell = (p: Purchase) => {
    if (p.semester !== null) {
      const u = universities.find((u) => u.slug === p.universitySlug);
      if (!u) return <span className="text-muted">{t("unknownCourse")}</span>;
      return (
        <Link
          href={{ pathname: "/universities/[university]", params: { university: u.slug } }}
          className="grid justify-items-center gap-0.5 hover:text-accent"
        >
          <span className="font-semibold">
            {p.semester === 0 ? tUni("noSemester") : tUni("semester", { semester: p.semester })}
          </span>
          <span className="text-xs text-muted">{localize(u.name, locale)}</span>
          {isPlanId(p.plan) && (
            <span className="font-mono text-xs text-muted">
              {tPay(`plans.${p.plan}.name`)}
              {p.amountHuf !== null && <> · {formatHuf(p.amountHuf, locale)}</>}
            </span>
          )}
        </Link>
      );
    }
    const c = catalog.find(
      (c) => c.slug === p.courseSlug && c.university.slug === p.universitySlug,
    );
    if (!c) return <span className="text-muted">{t("unknownCourse")}</span>;
    return (
      <Link
        href={{
          pathname: "/universities/[university]/courses/[course]",
          params: { university: p.universitySlug, course: c.slug },
        }}
        className="grid justify-items-center gap-0.5 hover:text-accent"
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
          <Table
            headers={[t("course"), t("purchasedAt"), t("remaining"), t("status")]}
            withDelete={godMode}
          >
            {active.map((p) => (
              <tr key={p.id}>
                <td className={cellClass}>{courseCell(p)}</td>
                <td className={`${cellClass} font-mono`}>{formatDate(p.purchasedAt, locale)}</td>
                <td className={`${cellClass} font-mono`}>{formatDate(p.expiresAt, locale)}</td>
                <td className={cellClass}>
                  {/* Zöld címke a hátralévő idővel */}
                  <span className="whitespace-nowrap rounded-md border border-accent px-2 py-0.5 font-mono text-xs text-accent">
                    {remaining(p)}
                  </span>
                </td>
                {godMode && <DeleteCell id={p.id} label={t("delete")} />}
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
          <Table
            headers={[t("course"), t("purchasedAt"), t("expiresAt"), t("status")]}
            withDelete={godMode}
          >
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
                {godMode && <DeleteCell id={p.id} label={t("delete")} />}
              </tr>
            ))}
          </Table>
        )}
      </section>

      {/* God mode: az összes vásárlás törlése egy gombbal */}
      {godMode && active.length + expired.length > 0 && (
        <form action={deletePurchaseAction}>
          <input type="hidden" name="id" value="all" />
          <button type="submit" className={dangerButtonClass + " px-4 py-2.5 text-sm"}>
            ⚡ {t("deleteAll")}
          </button>
        </form>
      )}

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

// Egy táblázatcella stílusa (függőlegesen is középre igazítva).
const cellClass = "px-4 py-3 align-middle";

// A törlés gombok kinézete (piros keret, csak god mode-ban látszik).
const dangerButtonClass =
  "rounded-md border border-[var(--danger,#e5534b)] font-mono text-[var(--danger,#e5534b)] transition-colors hover:bg-[var(--danger,#e5534b)] hover:text-bg";

/** God mode: egy vásárlás törlése gomb a sor végén. */
function DeleteCell({ id, label }: { id: number; label: string }) {
  return (
    <td className={`${cellClass} w-24`}>
      <form action={deletePurchaseAction}>
        <input type="hidden" name="id" value={id} />
        <button type="submit" className={dangerButtonClass + " px-2 py-0.5 text-xs"}>
          {label}
        </button>
      </form>
    </td>
  );
}

/**
 * Keretes táblázat fejléccel, középre igazított tartalommal, egyforma széles oszlopokkal; keskeny kijelzőn vízszintesen görgethető.
 * withDelete: god mode-ban egy keskeny, fejléc nélküli oszlop a törlés gomboknak.
 */
function Table({
  headers,
  children,
  withDelete = false,
}: {
  headers: string[];
  children: ReactNode;
  withDelete?: boolean;
}) {
  return (
    <Card padded={false} className="overflow-x-auto">
      <table className="w-full min-w-[36rem] table-fixed text-center text-sm">
        <thead className="border-b border-line text-xs text-muted">
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">
                {h}
              </th>
            ))}
            {withDelete && <th scope="col" className="w-24" aria-hidden="true" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </Card>
  );
}
