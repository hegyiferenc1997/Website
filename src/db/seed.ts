import { sql } from "drizzle-orm";
import type { Database } from "./index";
import { courses, programCourses, programs, specializations, universities } from "./schema";
import * as gde from "./data/gde-mernokinformatikus";

/**
 * Kezdő adat: a Gábor Dénes Egyetem Mérnökinformatikus BSc szakja mind a 7 félévvel,
 * a tárgyakkal, kreditekkel és az 5–6. félév két specializációjával.
 * Egyelőre csak a Programozási alapok tárgy aktív, a többi helykitöltő.
 * Többször is futtatható: a meglévő sorokat frissíti, nem duplikál.
 */
export async function seed(db: Database) {
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
}
