import type { Metadata } from "next";
import { randomUUID } from "node:crypto";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { formatDate, formatDateUntil } from "@/features/account/format";
import { localize } from "@/features/courses/localize";
import { getUniversity } from "@/features/courses/queries";
import { getUniversityAccess } from "@/features/payments/access";
import { confirmMockCheckoutAction } from "@/features/payments/actions";
import { formatHuf, getPlan, isPlanId } from "@/features/payments/plans";
import { isMockPayments } from "@/features/payments/provider";
import { safeReturnTo } from "@/features/payments/return-to";

// Próba fizetési oldal: a rendelés összegzése és egy „Fizetés (próba)” gomb, valódi terhelés nélkül.
// Valódi szolgáltatónál (pl. Stripe) ennek a helyén a szolgáltató saját fizetési oldala lesz.

// Az oldal bemenete: a rendelés adatai a címben (?university=…&semester=…&plan=…&back=…).
type Props = PageProps<"/[locale]/checkout">;

// Fülcím; a keresők ne vegyék fel.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Checkout");
  return { title: t("title"), robots: { index: false } };
}

// A cím azonnal megjelenik, az összegzés (bejelentkezés és hozzáférés ellenőrzése után) rögtön utána.
export default async function CheckoutPage({ searchParams }: Props) {
  const t = await getTranslations("Checkout");
  return (
    <div className="grid max-w-2xl gap-8">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      <Suspense fallback={<Card className="text-muted">{t("loading")}</Card>}>
        <CheckoutSummary searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;

// A rendelés összegzése és a jóváhagyó űrlap.
async function CheckoutSummary({ searchParams }: Pick<Props, "searchParams">) {
  const q = await searchParams;
  // Egy paraméter szövegként (ha többször szerepel, az első).
  const param = (name: string) => {
    const v = q[name];
    return Array.isArray(v) ? v[0] : v;
  };
  const universitySlug = param("university") ?? "";
  const semester = Number(param("semester"));
  const planId = param("plan");
  const back = safeReturnTo(param("back"));

  const [t, tUni, tPay, locale, university, access] = await Promise.all([
    getTranslations("Checkout"),
    getTranslations("UniversityPage"),
    getTranslations("Payments"),
    getLocale(),
    getUniversity(universitySlug),
    getUniversityAccess(universitySlug),
  ]);

  if (!isMockPayments()) return <EmptyState>{t("unavailable")}</EmptyState>;
  if (!access.user) return <EmptyState>{t("signedOut")}</EmptyState>;
  if (!university || !Number.isInteger(semester) || !isPlanId(planId)) {
    return <EmptyState>{t("invalid")}</EmptyState>;
  }

  const plan = getPlan(planId);
  // Meddig lesz érvényes: ha már van aktív hozzáférés, annak a végétől számít (meghosszabbítás).
  const current = access.passes.get(semester);
  const now = new Date();
  const start = current && current > now ? current : now;
  const expiresAt = new Date(start.getTime() + plan.days * DAY_MS);
  const semesterTitle = semester === 0 ? tUni("noSemester") : tUni("semester", { semester });

  // Az összegzés sorai: felirat és érték.
  const rows: [string, string][] = [
    [t("university"), localize(university.name, locale)],
    [t("semester"), semesterTitle],
    [t("plan"), `${tPay(`plans.${plan.id}.name`)} · ${tPay("days", { days: plan.days })}`],
    [t("validUntil"), formatDate(expiresAt, locale)],
  ];

  return (
    <div className="grid gap-6">
      {/* Figyelmeztetés: ez csak próba, nincs valódi fizetés */}
      <p className="rounded-md border border-dashed border-highlight/60 px-4 py-3 font-mono text-xs text-highlight">
        ⚠ {t("mockBanner")}
      </p>

      <Card padded={false}>
        <dl className="divide-y divide-line">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-4 px-5 py-3">
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-right">{value}</dd>
            </div>
          ))}
          {current && (
            <p className="px-5 py-3 text-sm text-accent">
              {tPay("extendNote", { date: formatDateUntil(current, locale) })}
            </p>
          )}
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="font-mono text-sm">{t("total")}</dt>
            <dd className="font-mono text-2xl font-bold tabular-nums">
              {formatHuf(plan.priceHuf, locale)}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Jóváhagyás: rögzíti a vásárlást, és visszavisz oda, ahonnan jött */}
      <form action={confirmMockCheckoutAction} className="flex flex-wrap items-center gap-4">
        <input type="hidden" name="university" value={university.slug} />
        <input type="hidden" name="semester" value={semester} />
        <input type="hidden" name="plan" value={plan.id} />
        <input type="hidden" name="back" value={back} />
        {/* Egyedi azonosító ehhez a megnyitáshoz: dupla kattintásra sem lesz két vásárlás */}
        <input type="hidden" name="nonce" value={randomUUID()} />
        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-2.5 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
        >
          {t("pay", { price: formatHuf(plan.priceHuf, locale) })}
        </button>
        {/* A „back” már nyelvnek megfelelő, kész útvonal, ezért sima <a> (nem a fordító Link). */}
        <a href={back} className="font-mono text-sm text-muted hover:text-accent">
          {t("cancel")}
        </a>
      </form>
    </div>
  );
}
