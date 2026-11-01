import { and, asc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getDb } from "@/db";
import { courses, lessons, universities } from "@/db/schema";

// Az eredmények gyorsítótárazva vannak; adatmódosítás után a "courses" címkével érvényteleníthetők.

export async function getUniversities() {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  return db.query.universities.findMany({
    orderBy: asc(universities.slug),
    with: { courses: { columns: { id: true } } },
  });
}

/** A már használható tananyaggal rendelkező tárgyak az egyetemükkel, a főoldali listához. */
export async function getCourses() {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  return db.query.courses.findMany({
    where: eq(courses.isActive, true),
    orderBy: asc(courses.slug),
    with: { university: true, programCourses: { with: { program: true } } },
  });
}

export async function getUniversity(slug: string) {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  const university = await db.query.universities.findFirst({
    where: eq(universities.slug, slug),
    with: {
      courses: {
        orderBy: asc(courses.slug),
        with: {
          programCourses: { with: { specialization: true } },
          topics: {
            columns: { slug: true },
            orderBy: (t, { asc }) => asc(t.position),
            with: {
              lessons: { columns: { slug: true }, orderBy: (l, { asc }) => asc(l.position) },
            },
          },
        },
      },
    },
  });
  return university ?? null;
}

export async function getCourse(universitySlug: string, courseSlug: string) {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  const university = await db.query.universities.findFirst({
    where: eq(universities.slug, universitySlug),
  });
  if (!university) return null;

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.universityId, university.id), eq(courses.slug, courseSlug)),
    with: {
      programCourses: { with: { program: true, specialization: true } },
      topics: {
        orderBy: (t, { asc }) => asc(t.position),
        with: {
          lessons: {
            columns: { body: false },
            orderBy: (l, { asc }) => asc(l.position),
          },
        },
      },
      resources: true,
    },
  });
  return course ? { ...course, university } : null;
}

/** Minden egyetem és tárgy slugja, a build idején előre generált oldalakhoz. */
export async function getCourseSlugs() {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  const rows = await db.query.courses.findMany({ with: { university: true } });
  return rows.map((c) => ({ university: c.university.slug, course: c.slug }));
}

/**
 * Minden tárgy az egyetemével és az ajánlott félévével, a Tárgyak oldalhoz és a keresőhöz.
 * Egy tárgy egyetemenként külön sor, így ugyanaz a tárgynév több egyetemnél is megjelenik.
 */
export async function getCourseCatalog() {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  const rows = await db.query.courses.findMany({
    orderBy: asc(courses.slug),
    columns: { slug: true, name: true, code: true, credits: true, isActive: true },
    with: {
      university: { columns: { slug: true, name: true, city: true } },
      programCourses: { columns: { recommendedSemester: true } },
    },
  });
  return rows.map(({ programCourses, ...c }) => ({
    ...c,
    semester:
      programCourses
        .map((p) => p.recommendedSemester)
        .filter((s): s is number => s !== null)
        .sort((a, b) => a - b)[0] ?? null,
  }));
}

/**
 * Egy lecke a teljes szövegével, a tárgy vázlatával (oldalsáv) és az előző/következő leckével.
 * A leckék sorrendje a témakörökön át folytonos: egy témakör utolsó leckéje után a következő első jön.
 */
export async function getLesson(
  universitySlug: string,
  courseSlug: string,
  topicSlug: string,
  lessonSlug: string,
) {
  "use cache";
  cacheTag("courses");
  const course = await getCourse(universitySlug, courseSlug);
  if (!course) return null;
  const flat = course.topics.flatMap((topic) => topic.lessons.map((lesson) => ({ topic, lesson })));
  const index = flat.findIndex((x) => x.topic.slug === topicSlug && x.lesson.slug === lessonSlug);
  if (index === -1) return null;

  const db = await getDb();
  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, flat[index].lesson.id),
  });
  if (!lesson) return null;
  return {
    course,
    topic: flat[index].topic,
    lesson,
    number: flat[index].topic.lessons.indexOf(flat[index].lesson) + 1,
    prev: flat[index - 1] ?? null,
    next: flat[index + 1] ?? null,
  };
}

/** Minden lecke URL-paramétere, a build idején előre generált oldalakhoz. */
export async function getLessonSlugs() {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  const rows = await db.query.lessons.findMany({
    columns: { slug: true },
    with: {
      topic: {
        columns: { slug: true },
        with: {
          course: { columns: { slug: true }, with: { university: { columns: { slug: true } } } },
        },
      },
    },
  });
  return rows.map((l) => ({
    university: l.topic.course.university.slug,
    course: l.topic.course.slug,
    topic: l.topic.slug,
    lesson: l.slug,
  }));
}
