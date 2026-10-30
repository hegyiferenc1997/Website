import { getLocale, getTranslations } from "next-intl/server";
import { LinkCardBody, SectionTitle } from "@/components/ui";
import { localize } from "@/features/courses/localize";
import { getCourses, getUniversities } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

// Főoldal: bemutatkozás, tantárgyak, egyetemek.
export default async function HomePage() {
  const [t, tUni, locale, courses, universities] = await Promise.all([
    getTranslations("HomePage"),
    getTranslations("UniversitiesPage"),
    getLocale(),
    getCourses(),
    getUniversities(),
  ]);

  return (
    <div className="grid gap-14">
      <section className="grid gap-5 py-4 sm:py-8">
        <p className="font-mono text-sm text-accent">{t("eyebrow")}</p>
        <h1 className="max-w-3xl text-3xl leading-tight sm:text-5xl sm:leading-[1.1]">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg text-muted">{t("intro")}</p>
        <div>
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-semibold text-accent-fg transition-opacity hover:opacity-90"
          >
            {t("browseUniversities")} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        <SectionTitle>{t("coursesTitle")}</SectionTitle>
        {courses.length === 0 ? (
          <p className="text-muted">{t("noCourses")}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <li key={c.id}>
                <Link
                  className="group block h-full"
                  href={{
                    pathname: "/universities/[university]/courses/[course]",
                    params: { university: c.university.slug, course: c.slug },
                  }}
                >
                  <LinkCardBody
                    title={localize(c.name, locale)}
                    meta={localize(c.university.name, locale)}
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-4">
        <SectionTitle>{t("universitiesTitle")}</SectionTitle>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((u) => (
            <li key={u.id}>
              <Link
                className="group block h-full"
                href={{ pathname: "/universities/[university]", params: { university: u.slug } }}
              >
                <LinkCardBody
                  title={localize(u.name, locale)}
                  meta={[u.city, tUni("courseCount", { count: u.courses.length })]
                    .filter(Boolean)
                    .join(" · ")}
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
