import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { getCourse, getCourseSlugs } from "@/features/courses/queries";
import { Card, Chip, EmptyState, SectionTitle } from "@/components/ui";
import { Link } from "@/i18n/navigation";
import {
  CourseProgressHeader,
  LessonDoneToggle,
  TopicProgress,
} from "@/features/progress/components";
import { courseLessons } from "@/features/courses/lessons";
import { lessonKey } from "@/features/progress/data";

// Az oldal bemenete: az URL paraméterei (nyelv, egyetem, tárgy).
type Props = PageProps<"/[locale]/universities/[university]/courses/[course]">;

// Build idején minden tárgy oldala előre elkészül, így azonnal betölt.
export async function generateStaticParams() {
  return getCourseSlugs();
}

// Fülcím: „Tárgy – Egyetem”.
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

// A tárgy oldal tartalma: fejléc az adatokkal, témakörök a leckékkel, források.
async function CourseContent({ params }: Pick<Props, "params">) {
  const { university, course: slug } = await params;
  const [course, locale, t, tNav] = await Promise.all([
    getCourse(university, slug),
    getLocale(),
    getTranslations("CoursePage"),
    getTranslations("Layout.nav"),
  ]);
  // Ismeretlen tárgy → 404 oldal.
  if (!course) notFound();

  const description = localize(course.description, locale);
  // Az első lecke, ahová a „Kezdés” gomb visz.
  const first = course.topics.find((x) => x.lessons.length > 0);
  // Egy lecke linkje (a nyelvnek megfelelő URL-t a Link állítja elő).
  const lessonHref = (topic: string, lesson: string) => ({
    pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]" as const,
    params: { university: course.university.slug, course: course.slug, topic, lesson },
  });

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        {/* Morzsamenü: Egyetemek / <egyetem neve> */}
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
          lessons={courseLessons(course)}
        />
        {first && (
          <Link
            href={lessonHref(first.slug, first.lessons[0].slug)}
            className="w-fit rounded-md bg-accent px-4 py-2 font-mono text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
          >
            {t("start")} →
          </Link>
        )}

        {/* Címkék: tárgykód, kredit, nyelv, szak és félév, specializáció, választható-e */}
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

      {/* Balra a témakörök és leckék, jobbra a források (mobilon egymás alatt) */}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section className="grid gap-4">
          <SectionTitle>{t("topics")}</SectionTitle>
          {course.topics.length === 0 ? (
            <EmptyState>{t("noTopics")}</EmptyState>
          ) : (
            <ol className="grid gap-4">
              {course.topics.map((topic, i) => (
                <li key={topic.id}>
                  <Card padded={false}>
                    {/* Témakör fejléce: sorszám, cím, leírás és „2/4” haladás */}
                    <div className="flex items-start gap-4 border-b border-line px-5 py-4">
                      <span className="pt-0.5 font-mono text-sm text-accent tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="grid flex-1 gap-1">
                        <h3 className="text-base">{localize(topic.title, locale)}</h3>
                        {topic.description && (
                          <p className="text-sm text-muted">
                            {localize(topic.description, locale)}
                          </p>
                        )}
                      </div>
                      <TopicProgress
                        university={course.university.slug}
                        course={course.slug}
                        lessons={topic.lessons.map((l) => lessonKey(topic.slug, l.slug))}
                      />
                    </div>
                    {/* A témakör leckéi: kész-pipa, sorszám, cím, becsült idő */}
                    <ol className="divide-y divide-line">
                      {topic.lessons.map((lesson, j) => {
                        const title = localize(lesson.title, locale);
                        return (
                          <li key={lesson.id} className="flex items-center gap-4 px-5 py-3">
                            <LessonDoneToggle
                              university={course.university.slug}
                              course={course.slug}
                              lesson={lessonKey(topic.slug, lesson.slug)}
                              title={title}
                            />
                            <span className="w-8 font-mono text-xs text-muted tabular-nums">
                              {i + 1}.{j + 1}
                            </span>
                            <Link
                              href={lessonHref(topic.slug, lesson.slug)}
                              className="flex-1 hover:text-accent"
                            >
                              {title}
                            </Link>
                            {lesson.minutes !== null && (
                              <span className="hidden font-mono text-xs text-muted sm:inline">
                                {t("minutes", { minutes: lesson.minutes })}
                              </span>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </Card>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="grid gap-4">
          {/* Források: jegyzetek, videók, linkek (külső link új lapon) */}
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
