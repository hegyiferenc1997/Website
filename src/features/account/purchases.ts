import { desc, eq } from "drizzle-orm";
import type { Database } from "@/db";
import { coursePurchases } from "@/db/schema";

// A megvásárolt tananyagok lekérése, szétválogatva még aktívakra és lejártakra (szerver oldal).

/** Egy vásárlás, ahogy az oldal megkapja. */
export type Purchase = {
  id: number;
  universitySlug: string;
  courseSlug: string;
  purchasedAt: Date;
  expiresAt: Date;
};

/** A felhasználó vásárlásai: az aktívak a hamarabb lejárókkal elöl, a lejártak a legutóbbival elöl. */
export async function getPurchases(db: Database, userId: string, now: Date) {
  const rows: Purchase[] = await db
    .select({
      id: coursePurchases.id,
      universitySlug: coursePurchases.universitySlug,
      courseSlug: coursePurchases.courseSlug,
      purchasedAt: coursePurchases.purchasedAt,
      expiresAt: coursePurchases.expiresAt,
    })
    .from(coursePurchases)
    .where(eq(coursePurchases.userId, userId))
    .orderBy(desc(coursePurchases.expiresAt));
  const active = rows.filter((p) => p.expiresAt > now).reverse();
  const expired = rows.filter((p) => p.expiresAt <= now);
  return { active, expired };
}

/** Fejlesztéshez: egy aktív és egy lejárt példa-vásárlás, hogy látszódjanak a táblázatok. */
export async function addDemoPurchases(db: Database, userId: string, now: Date) {
  const day = 24 * 60 * 60 * 1000;
  await db.insert(coursePurchases).values([
    {
      userId,
      universitySlug: "gabor-denes-egyetem",
      courseSlug: "programozas-alapjai",
      purchasedAt: new Date(now.getTime() - 10 * day),
      expiresAt: new Date(now.getTime() + 170 * day),
    },
    {
      userId,
      universitySlug: "gabor-denes-egyetem",
      courseSlug: "programozas-alapjai",
      purchasedAt: new Date(now.getTime() - 400 * day),
      expiresAt: new Date(now.getTime() - 220 * day),
    },
  ]);
}
