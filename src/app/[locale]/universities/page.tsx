import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { EmptyState, LinkCardBody, PageHeader } from "@/components/ui";
import { localize } from "@/features/courses/localize";
import { getUniversities } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("UniversitiesPage");
  return { title: t("title") };
}

// Egyetemek listája, kártyarácsban
export default async function UniversitiesPage() {
  const [t, locale, list] = await Promise.all([
    getTranslations("UniversitiesPage"),
    getLocale(),
    getUniversities(),
  ]);

  return (
    <div className="grid gap-10">
      <PageHeader title={t("title")}>{t("intro")}</PageHeader>
      {list.length === 0 ? (
        <EmptyState>{t("empty")}</EmptyState>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((u) => (
            <li key={u.id}>
              <Link
                className="group block h-full"
                href={{ pathname: "/universities/[university]", params: { university: u.slug } }}
              >
                <LinkCardBody
                  title={localize(u.name, locale)}
                  meta={[u.city, t("courseCount", { count: u.courses.length })]
                    .filter(Boolean)
                    .join(" · ")}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
