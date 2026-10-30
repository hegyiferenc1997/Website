import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getCourse, getCourseSlugs } from "@/features/courses/queries";
import { Link } from "@/i18n/navigation";

type Props = PageProps<"/[locale]/universities/[university]/courses/[course]">;

export async function generateStaticParams() {
  return getCourseSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { university, course: slug } = await params;
  const [course, locale] = await Promise.all([getCourse(university, slug), getLocale()]);
  if (!course) return {};
  return {
    title: `${localize(course.name, locale)} – ${localize(course.university.name, locale)}`,
  };
}

// Egy tárgy oldala
// Az URL-ből érkező adat (params) <Suspense>-en belül töltődik, így a navigáció azonnali:
// a keret rögtön megjelenik, a tartalom pedig betöltés után kerül a helyére.
export default async function CoursePage({ params }: Props) {
  const t = await getTranslations("Common");
  return (
    <Suspense fallback={<p>{t("loading")}</p>}>
      <CourseContent params={params} />
    </Suspense>
  );
}

async function CourseContent({ params }: Pick<Props, "params">) {
  const { university, course: slug } = await params;
  const [course, locale, t] = await Promise.all([
    getCourse(university, slug),
    getLocale(),
    getTranslations("CoursePage"),
  ]);
  if (!course) notFound();

  const description = localize(course.description, locale);

  return (
    <>
      <p>
        <Link
          href={{
            pathname: "/universities/[university]",
            params: { university: course.university.slug },
          }}
        >
          {localize(course.university.name, locale)}
        </Link>
      </p>
      <h1>{localize(course.name, locale)}</h1>
      {description && <p>{description}</p>}

      <dl>
        <dt>{t("code")}</dt>
        <dd>{course.code ?? t("unknown")}</dd>
        <dt>{t("credits")}</dt>
        <dd>{course.credits ?? t("unknown")}</dd>
        <dt>{t("language")}</dt>
        <dd>
          {course.language
            ? new Intl.DisplayNames([locale], { type: "language" }).of(course.language)
            : t("unknown")}
        </dd>
      </dl>

      {course.programCourses.length > 0 && (
        <>
          <h2>{t("programs")}</h2>
          <ul>
            {course.programCourses.map((pc) => (
              <li key={pc.programId}>
                {localize(pc.program.name, locale)} ({t(`level.${pc.program.level}`)})
                {pc.recommendedSemester !== null &&
                  ` – ${t("semester", { semester: pc.recommendedSemester })}`}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>{t("topics")}</h2>
      {course.topics.length === 0 ? (
        <p>{t("noTopics")}</p>
      ) : (
        <ol>
          {course.topics.map((topic) => (
            <li key={topic.id}>{localize(topic.title, locale)}</li>
          ))}
        </ol>
      )}

      {course.resources.length > 0 && (
        <>
          <h2>{t("resources")}</h2>
          <ul>
            {course.resources.map((r) => (
              <li key={r.id}>
                {r.url ? (
                  <a href={r.url}>{localize(r.title, locale)}</a>
                ) : (
                  localize(r.title, locale)
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
