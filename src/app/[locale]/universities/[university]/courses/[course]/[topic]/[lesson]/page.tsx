import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { localize } from "@/features/courses/localize";
import { courseLessons } from "@/features/courses/lessons";
import { getLesson, getLessonSlugs } from "@/features/courses/queries";
import { renderMarkdown } from "@/features/lessons/markdown";
import { CourseProgressHeader, LessonDoneButton } from "@/features/progress/components";
import { lessonKey } from "@/features/progress/data";
import { Link } from "@/i18n/navigation";

// Az oldal bemenete: az URL paraméterei (nyelv, egyetem, tárgy, témakör, lecke).
type Props = PageProps<"/[locale]/universities/[university]/courses/[course]/[topic]/[lesson]">;
// Egy lecke linkjének típusa (minden lecke link erre az útvonalra mutat).
type LessonHref = {
  pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]";
  params: { university: string; course: string; topic: string; lesson: string };
};

// Build idején minden lecke oldala előre elkészül, így azonnal betölt.
export async function generateStaticParams() {
  return getLessonSlugs();
}

// Fülcím és leírás: a lecke címe és összefoglalója.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params;
  const [data, locale] = await Promise.all([
    getLesson(p.university, p.course, p.topic, p.lesson),
    getLocale(),
  ]);
  if (!data) return {};
  return {
    title: `${localize(data.lesson.title, locale)} – ${localize(data.course.name, locale)}`,
    description: localize(data.lesson.summary, locale) ?? undefined,
  };
}

/** A Markdown → HTML átalakítás eredménye gyorsítótárban marad, csak a szöveg változásakor fut újra. */
async function renderLessonBody(markdown: string) {
  "use cache";
  return renderMarkdown(markdown);
}

// Egy lecke oldala: balra a tárgy tartalomjegyzéke, középen a lecke, alul „Kész” gomb és lapozás.
export default async function LessonPage({ params }: Props) {
  const t = await getTranslations("Common");
  return (
    <Suspense fallback={<p className="text-muted">{t("loading")}</p>}>
      <LessonContent params={params} />
    </Suspense>
  );
}

// A lecke tartalma: adatok betöltése, Markdown → HTML, majd az oldal felépítése.
async function LessonContent({ params }: Pick<Props, "params">) {
  const p = await params;
  const [data, locale, t] = await Promise.all([
    getLesson(p.university, p.course, p.topic, p.lesson),
    getLocale(),
    getTranslations("LessonPage"),
  ]);
  // Ismeretlen lecke → 404 oldal.
  if (!data) notFound();
  const { course, topic, lesson, number, prev, next } = data;
  const html = await renderLessonBody(localize(lesson.body, locale));

  const university = course.university.slug;
  // Hányadik témakörben vagyunk (1-től számolva).
  const topicNumber = course.topics.findIndex((x) => x.id === topic.id) + 1;
  // Linkek egy másik leckére, illetve vissza a tárgy oldalára.
  const href = (topicSlug: string, lessonSlug: string): LessonHref => ({
    pathname: "/universities/[university]/courses/[course]/[topic]/[lesson]",
    params: { university, course: course.slug, topic: topicSlug, lesson: lessonSlug },
  });
  const courseHref = {
    pathname: "/universities/[university]/courses/[course]" as const,
    params: { university, course: course.slug },
  };

  // Tartalomjegyzék: a tárgy összes témaköre és leckéje, az aktuális kiemelve.
  // Asztali nézetben bal oldalt áll, mobilon lenyitható dobozban van.
  const outline = (
    <nav aria-label={t("outline")} className="grid gap-4 text-sm">
      <div className="grid gap-2">
        <Link href={courseHref} className="font-mono font-bold text-fg hover:text-accent">
          {localize(course.name, locale)}
        </Link>
        <CourseProgressHeader
          university={university}
          course={course.slug}
          lessons={courseLessons(course)}
        />
      </div>
      <ol className="grid gap-3">
        {course.topics.map((x, i) => (
          <li key={x.id} className="grid gap-1">
            <span className="font-mono text-xs text-muted">
              {String(i + 1).padStart(2, "0")} {localize(x.title, locale)}
            </span>
            <ol className="grid border-l border-line">
              {x.lessons.map((l) => {
                const current = l.id === lesson.id;
                return (
                  <li key={l.id}>
                    <Link
                      href={href(x.slug, l.slug)}
                      aria-current={current ? "page" : undefined}
                      className={
                        "-ml-px block border-l py-1 pl-3 transition-colors " +
                        (current
                          ? "border-accent text-accent"
                          : "border-transparent text-muted hover:border-muted hover:text-fg")
                      }
                    >
                      {localize(l.title, locale)}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto">
        {outline}
      </aside>

      <article className="grid gap-8">
        {/* A lecke fejléce: morzsamenü, hol tartunk, cím, összefoglaló */}
        <header className="grid gap-3">
          <nav aria-label={t("breadcrumb")} className="text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-x-2">
              <li>
                <Link
                  href={{ pathname: "/universities/[university]", params: { university } }}
                  className="hover:text-accent"
                >
                  {localize(course.university.name, locale)}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={courseHref} className="text-accent hover:underline">
                  {localize(course.name, locale)}
                </Link>
              </li>
            </ol>
          </nav>
          <p className="font-mono text-xs text-muted">
            {t("position", { topic: topicNumber, lesson: number })} ·{" "}
            {localize(topic.title, locale)}
            {lesson.minutes !== null && <> · {t("minutes", { minutes: lesson.minutes })}</>}
          </p>
          <h1 className="text-3xl leading-tight sm:text-4xl">{localize(lesson.title, locale)}</h1>
          {lesson.summary && (
            <p className="max-w-2xl text-lg text-muted">{localize(lesson.summary, locale)}</p>
          )}
        </header>

        {/* Mobilon a tartalomjegyzék lenyitható (JavaScript nélkül). */}
        <details className="rounded-lg border border-line bg-surface px-4 py-3 lg:hidden">
          <summary className="cursor-pointer font-mono text-sm text-muted">
            <span className="text-accent">{"// "}</span>
            {t("outline")}
          </summary>
          <div className="pt-4">{outline}</div>
        </details>

        {/* A tananyag a repó content/ mappájából jön (megbízható forrás), ezért beilleszthető HTML-ként. */}
        <div className="lesson-body" dangerouslySetInnerHTML={{ __html: html }} />

        {/* Alul: „Kész” gomb és lapozás az előző / következő leckére */}
        <footer className="grid gap-6 border-t border-line pt-6">
          <div>
            <LessonDoneButton
              university={university}
              course={course.slug}
              lesson={lessonKey(topic.slug, lesson.slug)}
            />
          </div>
          <LessonPager
            prev={
              prev && {
                href: href(prev.topic.slug, prev.lesson.slug),
                title: localize(prev.lesson.title, locale),
              }
            }
            next={
              next && {
                href: href(next.topic.slug, next.lesson.slug),
                title: localize(next.lesson.title, locale),
              }
            }
            courseHref={courseHref}
            labels={{
              nav: t("lessonNav"),
              prev: t("prev"),
              next: t("next"),
              finished: t("finished"),
              back: t("backToCourse"),
            }}
          />
        </footer>
      </article>
    </div>
  );
}

/** Előző / következő lecke. Az utolsó lecke után vissza a tárgy oldalára. */
function LessonPager({
  prev,
  next,
  courseHref,
  labels,
}: {
  prev: { href: LessonHref; title: string } | null;
  next: { href: LessonHref; title: string } | null;
  courseHref: {
    pathname: "/universities/[university]/courses/[course]";
    params: { university: string; course: string };
  };
  labels: { nav: string; prev: string; next: string; finished: string; back: string };
}) {
  // Közös kinézet a lapozó kártyákhoz.
  const card =
    "group grid gap-1 rounded-lg border border-line bg-surface px-4 py-3 transition-colors hover:border-accent hover:bg-surface-hover";
  return (
    <nav aria-label={labels.nav} className="grid gap-3 sm:grid-cols-2">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="font-mono text-xs text-muted">← {labels.prev}</span>
          <span className="group-hover:text-accent">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link href={next.href} className={card + " sm:text-right"}>
          <span className="font-mono text-xs text-muted">{labels.next} →</span>
          <span className="group-hover:text-accent">{next.title}</span>
        </Link>
      ) : (
        <Link href={courseHref} className={card + " sm:text-right"}>
          <span className="font-mono text-xs text-muted">{labels.finished}</span>
          <span className="group-hover:text-accent">{labels.back} →</span>
        </Link>
      )}
    </nav>
  );
}
