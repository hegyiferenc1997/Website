// Tesztek az adatbázishoz: migrációk, kezdő adat, tananyag betöltése. Futtatás: pnpm test

import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createLocalDb } from "@/db/local";
import { courses, lessons } from "@/db/schema";
import { seed, seedContent } from "@/db/seed";

describe("adatbázis", () => {
  it("a migrációk lefutnak, és a kezdő adat betöltődik", async () => {
    const db = await createLocalDb();
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, "programozas-alapjai"),
      with: { university: true, programCourses: { with: { program: true } } },
    });

    expect(course?.name.hu).toBe("Programozási alapok");
    expect(course?.credits).toBe(8);
    expect(course?.isActive).toBe(true);
    expect(course?.programCourses[0].recommendedSemester).toBe(1);
    expect(course?.university.slug).toBe("gabor-denes-egyetem");
    expect(course?.programCourses).toHaveLength(1);
  });

  it("a kezdő adat többször is betölthető duplikálás nélkül", async () => {
    const db = await createLocalDb();
    await seed(db);
    // GDE (BSc) + 11 helykitöltő egyetem: 8 BSc-n és MSc-n is, 3 csak BSc-n = 20 bejegyzés.
    expect(await db.query.universities.findMany()).toHaveLength(20);
    expect(await db.query.courses.findMany()).toHaveLength(50);
  });

  it("a helykitöltő egyetemek szintenként külön sort kapnak, tárgyak nélkül", async () => {
    const db = await createLocalDb();
    const list = await db.query.universities.findMany({ with: { courses: true } });
    const bme = list.filter((u) => u.shortName === "BME");
    expect(bme.map((u) => [u.slug, u.level]).sort()).toEqual([
      ["budapesti-muszaki-es-gazdasagtudomanyi-egyetem", "bsc"],
      ["budapesti-muszaki-es-gazdasagtudomanyi-egyetem-msc", "msc"],
    ]);
    expect(bme.every((u) => u.courses.length === 0)).toBe(true);
    // A Dunaújvárosi Egyetemnek csak alapszakja van.
    expect(list.filter((u) => u.shortName === "DUE").map((u) => u.level)).toEqual(["bsc"]);
  });

  it("mind a 7 félév és a két specializáció betöltődik", async () => {
    const db = await createLocalDb();
    const links = await db.query.programCourses.findMany({ with: { specialization: true } });
    const semesters = new Set(links.map((l) => l.recommendedSemester));
    expect([...semesters].sort()).toEqual([1, 2, 3, 4, 5, 6, 7]);

    const specs = await db.query.specializations.findMany();
    expect(specs.map((s) => s.name.hu)).toEqual([
      "Multimédia és digitális képfeldolgozás",
      "Szoftverfejlesztés",
    ]);
    const swInSem6 = links.filter(
      (l) => l.recommendedSemester === 6 && l.specialization?.slug === "szoftverfejlesztes",
    );
    expect(swInSem6).toHaveLength(4);

    const active = await db.query.courses.findMany({ where: eq(courses.isActive, true) });
    // Aktív tárgyak: Informatika alapjai, Közgazdaságtan alapjai, Matematika, Programozási alapok, Operációs rendszerek, Személyes kompetencia (1. félév), Digitális technika és Innováció- és projektmenedzsment (3. félév).
    expect(active.map((c) => c.slug).sort()).toEqual([
      "digitalis-technika",
      "informatika-alapjai",
      "innovacio-es-projektmenedzsment",
      "kozgazdasagtan-alapjai",
      "matematika",
      "operacios-rendszerek",
      "programozas-alapjai",
      "szemelyes-kompetencia-es-kommunikacio-fejlesztese",
    ]);
  });
});

describe("tananyag", () => {
  it("a Programozási alapok témakörei és leckéi betöltődnek, mindkét nyelven", async () => {
    const db = await createLocalDb();
    const course = await db.query.courses.findFirst({
      where: eq(courses.slug, "programozas-alapjai"),
      with: {
        topics: {
          orderBy: (t, { asc }) => asc(t.position),
          with: { lessons: { orderBy: (l, { asc }) => asc(l.position) } },
        },
      },
    });
    const topics = course!.topics;
    expect(topics.length).toBeGreaterThan(3);
    expect(topics.length).toBe(19);
    expect(topics[0].slug).toBe("alapelvek-es-koncepciok");
    for (const topic of topics) {
      expect(topic.title.en, topic.slug).toBeTruthy();
      expect(topic.lessons.length, topic.slug).toBeGreaterThan(0);
      for (const lesson of topic.lessons) {
        expect(lesson.title.en, lesson.slug).toBeTruthy();
        expect(lesson.body.hu.length, lesson.slug).toBeGreaterThan(50);
        expect(lesson.body.en, lesson.slug).toBeTruthy();
      }
    }
  });

  it("a mappából törölt lecke az adatbázisból is eltűnik", async () => {
    const db = await createLocalDb();
    const [topic] = await db.query.topics.findMany({ limit: 1 });
    await db.insert(lessons).values({
      topicId: topic.id,
      slug: "regi-lecke",
      position: 99,
      title: { hu: "Régi" },
      body: { hu: "…" },
    });
    await seedContent(db);
    expect(await db.query.lessons.findFirst({ where: eq(lessons.slug, "regi-lecke") })).toBe(
      undefined,
    );
  });
});
