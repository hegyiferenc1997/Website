import { and, eq, notInArray, sql } from "drizzle-orm";
import type { Database } from "./index";
import { loadContent } from "./content";
import {
  courses,
  lessons,
  programCourses,
  programs,
  specializations,
  topics,
  universities,
} from "./schema";
import * as gde from "./data/gde-mernokinformatikus";

/**
 * Kezdő adat: a Gábor Dénes Egyetem Mérnökinformatikus BSc szakja mind a 7 félévvel,
 * a tárgyakkal, kreditekkel és az 5–6. félév két specializációjával.
 * Aktív tárgyak: Programozási alapok és Operációs rendszerek (1. félév), Digitális technika és Innováció- és projektmenedzsment
 * (3. félév), a többi helykitöltő.
 * A témakörök és leckék a content/courses mappából jönnek (lásd content.ts).
 * Többször is futtatható: a meglévő sorokat frissíti, nem duplikál.
 */
export async function seed(db: Database) {
  // 1. Az egyetem (beszúrás, vagy ha már van, frissítés).
  const universityName = { hu: "Gábor Dénes Egyetem", en: "Gábor Dénes University" };
  const [university] = await db
    .insert(universities)
    .values({
      slug: "gabor-denes-egyetem",
      name: universityName,
      country: "HU",
      city: "Budapest",
      website: "https://gde.hu",
    })
    .onConflictDoUpdate({
      target: universities.slug,
      set: { name: universityName, updatedAt: sql`now()` },
    })
    .returning();

  // 2. A szak.
  const programName = { hu: "Mérnökinformatikus", en: "Computer Science Engineering" };
  const [program] = await db
    .insert(programs)
    .values({
      universityId: university.id,
      slug: "mernokinformatikus-bsc",
      name: programName,
      level: "bsc",
    })
    .onConflictDoUpdate({
      target: [programs.universityId, programs.slug],
      set: { name: programName, updatedAt: sql`now()` },
    })
    .returning();

  // 3. A specializációk; az azonosítóikat megjegyezzük a tárgyakhoz.
  const specializationIds = new Map<string, number>();
  for (const [position, s] of gde.specializations.entries()) {
    const [row] = await db
      .insert(specializations)
      .values({ programId: program.id, slug: s.slug, name: { hu: s.name, en: s.en }, position })
      .onConflictDoUpdate({
        target: [specializations.programId, specializations.slug],
        set: { name: { hu: s.name, en: s.en }, position, updatedAt: sql`now()` },
      })
      .returning();
    specializationIds.set(s.slug, row.id);
  }

  // 4. Félévenként a tárgyak, és hogy melyik félévben, milyen jelleggel szerepelnek a szakon.
  for (const [index, list] of gde.semesters.entries()) {
    for (const c of list) {
      const values = {
        name: { hu: c.name, en: c.en },
        credits: c.credits,
        language: "hu",
        isActive: c.active ?? false,
      };
      const [course] = await db
        .insert(courses)
        .values({ universityId: university.id, slug: c.slug ?? gde.slugify(c.name), ...values })
        .onConflictDoUpdate({
          target: [courses.universityId, courses.slug],
          set: { ...values, updatedAt: sql`now()` },
        })
        .returning();

      const link = {
        recommendedSemester: index + 1,
        requirement: c.elective ? ("elective" as const) : ("mandatory" as const),
        specializationId: c.specialization ? specializationIds.get(c.specialization)! : null,
      };
      await db
        .insert(programCourses)
        .values({ programId: program.id, courseId: course.id, ...link })
        .onConflictDoUpdate({
          target: [programCourses.programId, programCourses.courseId],
          set: link,
        });
    }
  }

  // 5. A témakörök és leckék a content mappából.
  await seedContent(db);
}

/**
 * A tananyag (témakörök, leckék) betöltése a mappából. A mappában már nem szereplő
 * témakörök és leckék törlődnek, így egy átnevezés nem hagy maga után árva sort.
 */
export async function seedContent(db: Database) {
  for (const content of loadContent()) {
    const university = await db.query.universities.findFirst({
      where: eq(universities.slug, content.university),
    });
    const course =
      university &&
      (await db.query.courses.findFirst({
        where: and(eq(courses.universityId, university.id), eq(courses.slug, content.course)),
      }));
    if (!course) {
      throw new Error(`Ismeretlen tárgy a tananyagban: ${content.university}/${content.course}`);
    }

    // A mappában lévő témakörök mentése; az azonosítókat gyűjtjük, hogy a többit törölhessük.
    const keptTopics: number[] = [];
    for (const t of content.topics) {
      const values = { position: t.position, title: t.title, description: t.description };
      const [topic] = await db
        .insert(topics)
        .values({ courseId: course.id, slug: t.slug, ...values })
        .onConflictDoUpdate({
          target: [topics.courseId, topics.slug],
          set: { ...values, updatedAt: sql`now()` },
        })
        .returning();
      keptTopics.push(topic.id);

      // Ugyanez a témakör leckéivel.
      const keptLessons: number[] = [];
      for (const l of t.lessons) {
        const lessonValues = {
          position: l.position,
          kind: l.kind,
          title: l.title,
          summary: l.summary,
          body: l.body,
          minutes: l.minutes,
          hasExercise: l.hasExercise,
        };
        const [lesson] = await db
          .insert(lessons)
          .values({ topicId: topic.id, slug: l.slug, ...lessonValues })
          .onConflictDoUpdate({
            target: [lessons.topicId, lessons.slug],
            set: { ...lessonValues, updatedAt: sql`now()` },
          })
          .returning({ id: lessons.id });
        keptLessons.push(lesson.id);
      }
      // A mappából már eltávolított leckék törlése.
      await db
        .delete(lessons)
        .where(
          keptLessons.length
            ? and(eq(lessons.topicId, topic.id), notInArray(lessons.id, keptLessons))
            : eq(lessons.topicId, topic.id),
        );
    }
    // A mappából már eltávolított témakörök törlése.
    await db
      .delete(topics)
      .where(
        keptTopics.length
          ? and(eq(topics.courseId, course.id), notInArray(topics.id, keptTopics))
          : eq(topics.courseId, course.id),
      );
  }
}
