import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { desc, eq } from "drizzle-orm";
import { Card, EmptyState, PageHeader } from "@/components/ui";
import { getAccountDb } from "@/db";
import { sessions } from "@/db/schema";
import { getActivity } from "@/features/account/activity";
import { formatDateTime } from "@/features/account/format";
import { getSessionUser } from "@/features/auth/server";

// Fülcím; személyes oldal, a keresők ne vegyék fel.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("ProfilePage");
  return { title: t("title"), robots: { index: false } };
}

// Profil: a cím azonnal megjelenik, a személyes adatok (belépések, összes idő) rögtön utána érkeznek.
export default async function ProfilePage() {
  const t = await getTranslations("ProfilePage");
  return (
    <div className="grid max-w-2xl gap-8">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      <Suspense fallback={<Card className="text-muted">{t("loading")}</Card>}>
        <ProfileDetails />
      </Suspense>
    </div>
  );
}

// A bejelentkezett felhasználó adatai kérésenként lekérve.
async function ProfileDetails() {
  const [t, locale, user] = await Promise.all([
    getTranslations("ProfilePage"),
    getLocale(),
    getSessionUser(),
  ]);
  if (!user) return <EmptyState>{t("signedOut")}</EmptyState>;

  const db = await getAccountDb();
  const activity = await getActivity(db, user.id);
  // Ha a belépés még a funkció előtt történt, a legutóbbi munkamenet kezdete az utolsó belépés.
  let lastLogin = activity?.lastLoginAt ?? null;
  if (!lastLogin) {
    const latest = await db.query.sessions.findFirst({
      where: eq(sessions.userId, user.id),
      orderBy: desc(sessions.createdAt),
      columns: { createdAt: true },
    });
    lastLogin = latest?.createdAt ?? null;
  }
  const previousLogin = activity?.previousLoginAt ?? null;
  const total = activity?.totalSeconds ?? 0;

  // A sorok: felirat és érték.
  const rows = [
    { label: t("name"), value: user.name },
    { label: t("email"), value: user.email },
    { label: t("lastLogin"), value: lastLogin ? formatDateTime(lastLogin, locale) : t("never") },
    {
      label: t("previousLogin"),
      value: previousLogin ? formatDateTime(previousLogin, locale) : t("never"),
    },
    {
      label: t("totalTime"),
      value: t("duration", {
        hours: Math.floor(total / 3600),
        minutes: Math.floor((total % 3600) / 60),
      }),
      hint: t("totalTimeHint"),
    },
  ];

  return (
    <Card padded={false}>
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[14rem_1fr] sm:gap-4">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className="grid gap-1">
              <span className="break-all font-mono text-fg">{r.value}</span>
              {r.hint && <span className="text-xs text-muted">{r.hint}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
