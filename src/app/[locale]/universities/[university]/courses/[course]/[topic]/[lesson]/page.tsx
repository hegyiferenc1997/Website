import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { universityLabel } from "@/features/courses/level";
import { localize } from "@/features/courses/localize";
import { courseLessons } from "@/features/courses/lessons";
import { getLesson, getLessonSlugs } from "@/features/courses/queries";
import { renderLessonSegments, type LessonSegment } from "@/features/lessons/markdown";
import {
  CourseProgressHeader,
  GatedLessonLink,
  LessonDoneButton,
} from "@/features/progress/components";
import { lessonKey } from "@/features/progress/data";
import { Exercise, RunnableExample, type LessonRef } from "@/features/python/components";
import { Quiz } from "@/features/quiz/Quiz";
import { Plot } from "@/features/plot/Plot";
import { hasMath, KATEX_VERSION } from "@/features/lessons/math";
import { Link } from "@/i18n/navigation";
import { courseSemester } from "@/features/courses/semester";
import { getUniversityAccess, hasFullAccess } from "@/features/payments/access";
import { isLessonOpen } from "@/features/payments/lesson-access";
import { BuyButton } from "@/features/payments/BuyButton";
import { LockedNotice } from "@/features/payments/LockedNotice";

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

/**
 * A Markdown → HTML átalakítás eredménye gyorsítótárban marad, csak a szöveg változásakor fut újra.
 * Az eredmény darabokból áll: sima HTML, futtatható példa és feladat (lásd renderLessonSegments).
 */
async function renderLessonBody(markdown: string, locale: string) {
  "use cache";
  return renderLessonSegments(markdown, locale);
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
  // A hozzáférés (megvásárolt félévek) is kell, ezért ez a rész kérésenként készül.
  const [data, locale, t, tUni, access] = await Promise.all([
    getLesson(p.university, p.course, p.topic, p.lesson),
    getLocale(),
    getTranslations("LessonPage"),
    getTranslations("UniversityPage"),
    getUniversityAccess(p.university),
  ]);
  // Ismeretlen lecke → 404 oldal.
  if (!data) notFound();
  const { course, topic, lesson, number, prev, next } = data;
  const semester = courseSemester(course.programCourses);
  const semesterTitle = semester === 0 ? tUni("noSemester") : tUni("semester", { semester });
  // Teljes hozzáférés: bármelyik aktív csomag vagy admin god mode. Ilyenkor minden lecke nyitva.
  const paid = hasFullAccess(access);
  // A tárgy összes leckéje sorrendben, és hányadik ez közülük (vásárlás nélkül csak az első nyitott).
  const allLessons = courseLessons(course);
  const thisKey = lessonKey(topic.slug, lesson.slug);
  const index = allLessons.indexOf(thisKey);
  const open = isLessonOpen(paid, index);
  // Zárolt leckénél a szöveg el sem készül, és nem is kerül a böngészőbe.
  const segments = open ? await renderLessonBody(localize(lesson.body, locale), locale) : [];
  // Van-e képlet a leckében (csak akkor töltjük be a képletszedő stíluslapját és betűit).
  const math = segments.some(
    (s) =>
      (s.kind === "html" && hasMath(s.html)) ||
      (s.kind === "quiz" && hasMath(JSON.stringify(s.questions))),
  );

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
  const lessonRef: LessonRef = { university, course: course.slug, lesson: thisKey };
  const nextLesson = next && {
    href: href(next.topic.slug, next.lesson.slug),
    title: localize(next.lesson.title, locale),
  };
  // Nyitott-e a következő lecke (ha nem, a feladat „Tovább” gombja sem jelenik meg).
  const nextOpen = isLessonOpen(paid, index + 1);
  // Folyamatos sorszám a leckék linkjeihez (a zároláshoz).
  let position = 0;

  // Tartalomjegyzék: a tárgy összes témaköre és leckéje, az aktuális kiemelve.
  // Asztali nézetben bal oldalt áll, mobilon lenyitható dobozban van.
  const outline = (
    <nav aria-label={t("outline")} className="grid gap-4 text-sm">
      <div className="grid gap-2">
        <Link href={courseHref} className="font-mono font-bold text-fg hover:text-accent">
          {localize(course.name, locale)}
        </Link>
        <CourseProgressHeader university={university} course={course.slug} lessons={allLessons} />
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
                    <GatedLessonLink
                      locked={!isLessonOpen(paid, position++)}
                      href={href(x.slug, l.slug)}
                      current={current}
                      className={
                        "-ml-px block border-l py-1 pl-3 transition-colors " +
                        (current
                          ? "border-accent text-accent"
                          : "border-transparent text-muted hover:border-muted hover:text-fg")
                      }
                    >
                      {localize(l.title, locale)}
                    </GatedLessonLink>
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
      {math && <MathAssets />}
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
                  {universityLabel(
                    localize(course.university.name, locale),
                    course.university.level,
                  )}
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

        {/* Zárolt lecke (nincs vásárlás, és nem az első lecke): a lecke helyett üzenet, vásárlás gombbal. */}
        {!open && (
          <LockedNotice title={t("lockedTitle")} text={t("lockedText")}>
            <BuyButton
              university={university}
              semester={semester}
              semesterTitle={semesterTitle}
              signedIn={access.user !== null}
              activeUntil={null}
              size="large"
            />
            <Link href={courseHref} className="font-mono text-sm text-muted hover:text-accent">
              ← {t("backToCourse")}
            </Link>
          </LockedNotice>
        )}

        {/* Nyitott lecke: a szöveg, alul a kézzel ki-be kapcsolható „Kész” gomb és a lapozás. */}
        {open && (
          <>
            <LessonBody
              segments={segments}
              lessonRef={lessonRef}
              next={nextOpen ? nextLesson : null}
            />

            <footer className="grid gap-6 border-t border-line pt-6">
              <div>
                <LessonDoneButton {...lessonRef} />
              </div>
              <LessonPager
                nextLocked={!nextOpen}
                prev={
                  prev && {
                    href: href(prev.topic.slug, prev.lesson.slug),
                    title: localize(prev.lesson.title, locale),
                  }
                }
                next={nextLesson}
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
          </>
        )}
      </article>
    </div>
  );
}

/**
 * A lecke szövege: a sima HTML darabok és a futtatható részek (példák, feladatok) sorban.
 * A HTML darabok „display: contents” dobozban vannak, így a .lesson-body rácsának térközei megmaradnak.
 */
function LessonBody({
  segments,
  lessonRef,
  next,
}: {
  segments: LessonSegment[];
  lessonRef: LessonRef;
  next: { href: LessonHref; title: string } | null;
}) {
  return (
    <div className="lesson-body">
      {segments.map((s, i) =>
        s.kind === "html" ? (
          // A tananyag a repó content/ mappájából jön (megbízható forrás), ezért beilleszthető HTML-ként.
          <div key={i} className="contents" dangerouslySetInnerHTML={{ __html: s.html }} />
        ) : s.kind === "run" ? (
          <RunnableExample key={i} code={s.code} label={s.label} codeHtml={s.codeHtml} />
        ) : s.kind === "plot" ? (
          <Plot key={i} spec={s.spec} />
        ) : s.kind === "quiz" ? (
          <Quiz
            key={i}
            questions={s.questions}
            required={s.required}
            lessonRef={lessonRef}
            next={s.required ? next : null}
          />
        ) : (
          <Exercise
            key={i}
            index={s.index}
            starter={s.starter}
            test={s.test}
            required={s.required}
            label={s.label}
            lessonRef={lessonRef}
            next={s.required ? next : null}
          />
        ),
      )}
    </div>
  );
}

/**
 * A képletszedő (KaTeX) stíluslapja és a leggyakoribb betűi. A React a <head>-be teszi őket; a betűk
 * előtöltése miatt a képletek már az első kirajzoláskor a végleges alakjukban jelennek meg.
 */
function MathAssets() {
  const base = `/katex/${KATEX_VERSION}`;
  const fonts = [
    "KaTeX_Main-Regular",
    "KaTeX_Math-Italic",
    "KaTeX_Size1-Regular",
    "KaTeX_Size2-Regular",
  ];
  return (
    <>
      {fonts.map((f) => (
        <link
          key={f}
          rel="preload"
          href={`${base}/fonts/${f}.woff2`}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      <link rel="stylesheet" href={`${base}/katex.min.css`} precedence="default" />
    </>
  );
}

/**
 * Előző / következő lecke. Az utolsó lecke után vissza a tárgy oldalára.
 * Vásárlás nélkül a következő lecke zárolt (lakattal).
 */
function LessonPager({
  nextLocked,
  prev,
  next,
  courseHref,
  labels,
}: {
  nextLocked: boolean;
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
        <GatedLessonLink
          locked={nextLocked}
          href={next.href}
          className={card + " sm:text-right"}
          lockIcon={false}
        >
          <span className="font-mono text-xs text-muted">
            <span className="gate-lock mr-1.5 hidden" aria-hidden="true">
              🔒
            </span>
            {labels.next} →
          </span>
          <span className="group-hover:text-accent">{next.title}</span>
        </GatedLessonLink>
      ) : (
        <Link href={courseHref} className={card + " sm:text-right"}>
          <span className="font-mono text-xs text-muted">{labels.finished}</span>
          <span className="group-hover:text-accent">{labels.back} →</span>
        </Link>
      )}
    </nav>
  );
}
