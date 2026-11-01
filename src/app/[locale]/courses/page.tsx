import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EmptyState, LinkCardBody, PageHeader, SectionTitle } from "@/components/ui";
import { localize } from "@/features/courses/localize";
import { getCourseCatalog } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("CoursesPage");
  return { title: t("title") };
}

// Tárgyak listája: előbb a tananyaggal már rendelkezők, aztán a „hamarosan” tárgyak, ábécérendben.
// Minden kártyán ott az egyetem, a félév és a kredit, így az azonos nevű tárgyak is megkülönböztethetők.
export default async function CoursesPage() {
  const [t, locale, catalog] = await Promise.all([
    getTranslations("CoursesPage"),
    getLocale(),
    getCourseCatalog(),
  ]);

  const collator = new Intl.Collator(locale);
  const sorted = catalog
    .map((c) => ({ ...c, title: localize(c.name, locale) }))
    .sort(
      (a, b) =>
        collator.compare(a.title, b.title) ||
        collator.compare(localize(a.university.name, locale), localize(b.university.name, locale)),
    );
  const sections = [
    { title: t("activeTitle"), list: sorted.filter((c) => c.isActive) },
    { title: t("comingTitle"), list: sorted.filter((c) => !c.isActive) },
  ].filter((s) => s.list.length > 0);

  return (
    <div className="grid gap-10">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      {sections.length === 0 ? (
        <EmptyState>{t("empty")}</EmptyState>
      ) : (
        sections.map((s) => (
          <section key={s.title} className="grid gap-4">
            <SectionTitle>
              {s.title} <span className="text-muted">· {t("count", { count: s.list.length })}</span>
            </SectionTitle>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {s.list.map((c) => (
                <li key={`${c.university.slug}/${c.slug}`}>
                  <Link
                    className="group block h-full"
                    href={{
                      pathname: "/universities/[university]/courses/[course]",
                      params: { university: c.university.slug, course: c.slug },
                    }}
                  >
                    <LinkCardBody
                      title={c.title}
                      meta={[
                        localize(c.university.name, locale),
                        c.semester !== null ? t("semester", { semester: c.semester }) : null,
                        c.credits !== null ? t("credits", { credits: c.credits }) : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
