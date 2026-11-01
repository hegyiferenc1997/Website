import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createLocalDb } from "@/db/local";
import { courses } from "@/db/schema";
import { seed } from "@/db/seed";

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
    expect(await db.query.universities.findMany()).toHaveLength(1);
    expect(await db.query.courses.findMany()).toHaveLength(50);
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
    expect(active.map((c) => c.slug)).toEqual(["programozas-alapjai"]);
  });
});
