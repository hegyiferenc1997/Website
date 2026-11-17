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
import { placeholderUniversities } from "./data/universities";
import { curricula, curriculumSlug } from "./data/curricula";
import type { Curriculum, CurriculumCourse } from "./data/curricula/types";

/**
 * Kezdő adat: a Gábor Dénes Egyetem Mérnökinformatikus BSc szakja mind a 7 félévvel,
 * a tárgyakkal, kreditekkel és az 5–6. félév két specializációjával.
 * Aktív tárgyak: Informatika alapjai, Közgazdaságtan alapjai, Matematika, Programozási alapok,
 * Operációs rendszerek és Személyes kompetencia és kommunikáció fejlesztése (1. félév),
 * Adatbázisok, Digitális technika és Innováció- és projektmenedzsment (3. félév), a többi helykitöltő.
 * Mellette a többi magyar egyetem (BSc / MSc): ahol a mintatanterv fel van dolgozva (data/curricula), ott a tárgyakkal,
 * tananyag nélkül; a többi tárgyak nélküli helykitöltő (data/universities.ts).
 * A témakörök és leckék a content/courses mappából jönnek (lásd content.ts).
 * Többször is futtatható: a meglévő sorokat frissíti, nem duplikál.
 */
export async function seed(db: Database) {
  // 1. Az egyetem (beszúrás, vagy ha már van, frissítés). Ez a BSc (alapszakos) bejegyzés; egy majdani
  // mesterszak saját sort kap (pl. slug: "gabor-denes-egyetem-msc", level: "msc").
  const universityName = { hu: "Gábor Dénes Egyetem", en: "Gábor Dénes University" };
  const [university] = await db
    .insert(universities)
    .values({
      slug: "gabor-denes-egyetem",
      name: universityName,
      shortName: "GDE",
      country: "HU",
      city: "Budapest",
      website: "https://gde.hu",
      level: "bsc",
    })
    .onConflictDoUpdate({
      target: universities.slug,
      set: { name: universityName, shortName: "GDE", level: "bsc", updatedAt: sql`now()` },
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

  // 5. A többi egyetem helykitöltőként (tárgyak nélkül), szintenként külön sorban.
  await seedPlaceholderUniversities(db);

  // 6. A feldolgozott mintatantervek tárgyai (tananyag nélkül, „hamarosan” jelöléssel).
  for (const c of curricula) await seedCurriculum(db, c);

  // 7. A témakörök és leckék a content mappából.
  await seedContent(db);
}

/**
 * A még tananyag nélküli egyetemek: csak a név, rövidítés, város és szint kerül be, tárgy nem.
 * Az MSc bejegyzés slugja „-msc” végződést kap (lásd schema.ts, universities).
 */
async function seedPlaceholderUniversities(db: Database) {
  for (const u of placeholderUniversities) {
    for (const level of u.levels) {
      const values = {
        name: { hu: u.name, en: u.en },
        shortName: u.short,
        level,
        country: "HU",
        city: u.city,
        website: u.website,
      };
      await db
        .insert(universities)
        .values({ slug: level === "bsc" ? u.slug : `${u.slug}-${level}`, ...values })
        .onConflictDoUpdate({
          target: universities.slug,
          set: { ...values, updatedAt: sql`now()` },
        });
    }
  }
}

/**
 * Egy egyetem+szint mintatantervének betöltése: szak, specializációk, tárgyak, félévek.
 * Ha ugyanaz a tárgy (slug) több specializációban is szerepel, közös tárgy lesz (egy tárgynak egy kapcsolata
 * lehet a szakkal). Minden tárgy inaktív, mert még nincs tananyaga.
 */
async function seedCurriculum(db: Database, c: Curriculum) {
  const slug = curriculumSlug(c);
  const university = await db.query.universities.findFirst({ where: eq(universities.slug, slug) });
  if (!university) throw new Error(`Ismeretlen egyetem a tantervben: ${slug}`);

  const programName = { hu: "Mérnökinformatikus", en: "Computer Science Engineering" };
  const [program] = await db
    .insert(programs)
    .values({
      universityId: university.id,
      slug: `mernokinformatikus-${c.level}`,
      name: programName,
      level: c.level,
    })
    .onConflictDoUpdate({
      target: [programs.universityId, programs.slug],
      set: { name: programName, updatedAt: sql`now()` },
    })
    .returning();

  const specializationIds = new Map<string, number>();
  for (const [position, s] of (c.specializations ?? []).entries()) {
    const name = { hu: s.name, en: s.en };
    const [row] = await db
      .insert(specializations)
      .values({ programId: program.id, slug: s.slug, name, position })
      .onConflictDoUpdate({
        target: [specializations.programId, specializations.slug],
        set: { name, position, updatedAt: sql`now()` },
      })
      .returning();
    specializationIds.set(s.slug, row.id);
  }

  // Tárgyak slug szerint összevonva: az első előfordulás félévét kapják; több specializáció esetén közösek.
  type Entry = { course: CurriculumCourse; semester: number | null; specialization: string | null };
  const entries = new Map<string, Entry>();
  const all: [CurriculumCourse, number | null][] = [
    ...c.semesters.flatMap((list, i) => list.map((x): [CurriculumCourse, number] => [x, i + 1])),
    ...(c.unscheduled ?? []).map((x): [CurriculumCourse, null] => [x, null]),
  ];
  for (const [course, semester] of all) {
    const key = course.slug ?? gde.slugify(course.name);
    const existing = entries.get(key);
    if (!existing) {
      entries.set(key, { course, semester, specialization: course.specialization ?? null });
    } else if (existing.specialization !== (course.specialization ?? null)) {
      existing.specialization = null;
    }
  }

  for (const [key, { course, semester, specialization }] of entries) {
    if (specialization && !specializationIds.has(specialization)) {
      throw new Error(`Ismeretlen specializáció (${slug}): ${specialization}`);
    }
    const values = {
      name: { hu: course.name, en: course.en },
      credits: course.credits,
      language: "hu",
      isActive: false,
    };
    const [row] = await db
      .insert(courses)
      .values({ universityId: university.id, slug: key, ...values })
      .onConflictDoUpdate({
        target: [courses.universityId, courses.slug],
        set: { ...values, updatedAt: sql`now()` },
      })
      .returning();
    const link = {
      recommendedSemester: semester,
      requirement: course.elective ? ("elective" as const) : ("mandatory" as const),
      specializationId: specialization ? specializationIds.get(specialization)! : null,
    };
    await db
      .insert(programCourses)
      .values({ programId: program.id, courseId: row.id, ...link })
      .onConflictDoUpdate({
        target: [programCourses.programId, programCourses.courseId],
        set: link,
      });
  }
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
