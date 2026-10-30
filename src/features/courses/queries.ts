import { and, asc, eq } from "drizzle-orm";
import { cacheTag } from "next/cache";
import { getDb } from "@/db";
import { courses, universities } from "@/db/schema";

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

/** Az összes tárgy az egyetemével, a főoldali listához. */
export async function getCourses() {
  "use cache";
  cacheTag("courses");
  const db = await getDb();
  return db.query.courses.findMany({
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
    with: { courses: { orderBy: asc(courses.slug), with: { programCourses: true } } },
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
      programCourses: { with: { program: true } },
      topics: { orderBy: (t, { asc }) => asc(t.position) },
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
