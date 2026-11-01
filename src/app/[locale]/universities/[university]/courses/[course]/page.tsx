import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getCourse, getCourseSlugs } from "@/features/courses/queries";
import { Card, Chip, EmptyState, SectionTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import { CourseProgressHeader, TopicDoneToggle } from "@/features/progress/components";

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
    <Suspense fallback={<p className="text-muted">{t("loading")}</p>}>
      <CourseContent params={params} />
    </Suspense>
  );
}

async function CourseContent({ params }: Pick<Props, "params">) {
  const { university, course: slug } = await params;
  const [course, locale, t, tNav] = await Promise.all([
    getCourse(university, slug),
    getLocale(),
    getTranslations("CoursePage"),
    getTranslations("Layout.nav"),
  ]);
  if (!course) notFound();

  const description = localize(course.description, locale);

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <nav aria-label={t("breadcrumb")} className="text-sm text-muted">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li>
              <Link href="/universities" className="hover:text-accent">
                {tNav("universities")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={{
                  pathname: "/universities/[university]",
                  params: { university: course.university.slug },
                }}
                className="text-accent hover:underline"
              >
                {localize(course.university.name, locale)}
              </Link>
            </li>
          </ol>
        </nav>
        <h1 className="text-3xl leading-tight sm:text-4xl">{localize(course.name, locale)}</h1>
        {description && <p className="max-w-2xl text-lg text-muted">{description}</p>}
        <CourseProgressHeader
          university={course.university.slug}
          course={course.slug}
          topics={course.topics.map((x) => x.slug)}
        />

        <div className="flex flex-wrap gap-2">
          {course.code && <Chip label={t("code")}>{course.code}</Chip>}
          {course.credits !== null && <Chip label={t("credits")}>{course.credits}</Chip>}
          {course.language && (
            <Chip label={t("language")}>
              {new Intl.DisplayNames([locale], { type: "language" }).of(course.language)}
            </Chip>
          )}
          {course.programCourses.map((pc) => (
            <Chip
              key={pc.programId}
              label={`${localize(pc.program.name, locale)} ${t(`level.${pc.program.level}`)}`}
            >
              {pc.recommendedSemester !== null &&
                t("semester", { semester: pc.recommendedSemester })}
            </Chip>
          ))}
          {course.programCourses.map(
            (pc) =>
              pc.specialization && (
                <Chip key={`spec-${pc.programId}`} label={t("specializationLabel")}>
                  {localize(pc.specialization.name, locale)}
                </Chip>
              ),
          )}
          {course.programCourses.some((pc) => pc.requirement === "elective") && (
            <Chip label={t("type")}>{t("elective")}</Chip>
          )}
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="grid gap-4">
          <SectionTitle>{t("topics")}</SectionTitle>
          {course.topics.length === 0 ? (
            <EmptyState>{t("noTopics")}</EmptyState>
          ) : (
            <Card className="p-0">
              <ol className="divide-y divide-line">
                {course.topics.map((topic, i) => (
                  <li key={topic.id} className="flex items-center gap-4 px-5 py-3.5">
                    <TopicDoneToggle
                      university={course.university.slug}
                      course={course.slug}
                      topic={topic.slug}
                    />
                    <span className="font-mono text-xs text-muted tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{localize(topic.title, locale)}</span>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </section>

        <section className="grid gap-4">
          <SectionTitle>{t("resources")}</SectionTitle>
          {course.resources.length === 0 ? (
            <EmptyState>{t("noResources")}</EmptyState>
          ) : (
            <Card>
              <ul className="grid gap-2.5">
                {course.resources.map((r) => (
                  <li key={r.id}>
                    {r.url ? (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-accent hover:underline"
                      >
                        {localize(r.title, locale)} ↗
                      </a>
                    ) : (
                      localize(r.title, locale)
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
