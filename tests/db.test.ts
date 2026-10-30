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

    expect(course?.name.hu).toBe("Programozás alapjai");
    expect(course?.university.slug).toBe("gabor-denes-egyetem");
    expect(course?.programCourses).toHaveLength(1);
  });

  it("a kezdő adat többször is betölthető duplikálás nélkül", async () => {
    const db = await createLocalDb();
    await seed(db);
    expect(await db.query.universities.findMany()).toHaveLength(1);
  });
});
