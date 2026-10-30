import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getUniversities } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("UniversitiesPage");
  return { title: t("title") };
}

// Egyetemek listája
export default async function UniversitiesPage() {
  const [t, locale, list] = await Promise.all([
    getTranslations("UniversitiesPage"),
    getLocale(),
    getUniversities(),
  ]);

  return (
    <>
      <h1>{t("title")}</h1>
      {list.length === 0 ? (
        <p>{t("empty")}</p>
      ) : (
        <ul>
          {list.map((u) => (
            <li key={u.id}>
              <Link
                href={{ pathname: "/universities/[university]", params: { university: u.slug } }}
              >
                {localize(u.name, locale)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
