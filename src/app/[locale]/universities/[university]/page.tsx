import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getUniversities, getUniversity } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

type Props = PageProps<"/[locale]/universities/[university]">;

export async function generateStaticParams() {
  const list = await getUniversities();
  return list.map((u) => ({ university: u.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university: slug } = await params;
  const [university, locale] = await Promise.all([getUniversity(slug), getLocale()]);
  return university ? { title: localize(university.name, locale) } : {};
}

// Egy egyetem oldala
export default async function UniversityPage({ params }: Props) {
  const { university: slug } = await params;
  const [university, locale, t] = await Promise.all([
    getUniversity(slug),
    getLocale(),
    getTranslations("UniversityPage"),
  ]);
  if (!university) notFound();

  return (
    <>
      <h1>{localize(university.name, locale)}</h1>
      {university.city && <p>{university.city}</p>}
      {university.website && (
        <p>
          <a href={university.website}>{t("website")}</a>
        </p>
      )}

      <h2>{t("coursesTitle")}</h2>
      {university.courses.length === 0 ? (
        <p>{t("noCourses")}</p>
      ) : (
        <ul>
          {university.courses.map((c) => (
            <li key={c.id}>
              <Link
                href={{
                  pathname: "/universities/[university]/courses/[course]",
                  params: { university: university.slug, course: c.slug },
                }}
              >
                {localize(c.name, locale)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
