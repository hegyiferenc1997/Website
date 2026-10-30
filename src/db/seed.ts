import { eq } from "drizzle-orm";
import type { Database } from "./index";
import { courses, programCourses, programs, universities } from "./schema";

/**
 * Kezdő adat: a Gábor Dénes Egyetem és a Programozás alapjai tárgy.
 * Csak biztos adatot tartalmaz; a tárgykód, kredit, félév és tematika később kerül be.
 * Többször futtatható: ha az egyetem már létezik, nem csinál semmit.
 */
export async function seed(db: Database) {
  const existing = await db.query.universities.findFirst({
    where: eq(universities.slug, "gabor-denes-egyetem"),
  });
  if (existing) return;

  const [gde] = await db
    .insert(universities)
    .values({
      slug: "gabor-denes-egyetem",
      name: { hu: "Gábor Dénes Egyetem", en: "Gábor Dénes University" },
      country: "HU",
      city: "Budapest",
      website: "https://gde.hu",
    })
    .returning();

  const [program] = await db
    .insert(programs)
    .values({
      universityId: gde.id,
      slug: "mernokinformatikus-bsc",
      name: { hu: "Mérnökinformatikus", en: "Computer Engineering" },
      level: "bsc",
    })
    .returning();

  const [course] = await db
    .insert(courses)
    .values({
      universityId: gde.id,
      slug: "programozas-alapjai",
      name: { hu: "Programozás alapjai", en: "Programming Basics" },
      language: "hu",
    })
    .returning();

  await db.insert(programCourses).values({ programId: program.id, courseId: course.id });
}
