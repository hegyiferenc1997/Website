import { sql } from "drizzle-orm";
import type { Database } from "@/db";
import { userActivity } from "@/db/schema";

// A belépések és az oldalon töltött idő mentése és lekérése (szerver oldal).

/** Egy jelentésben legfeljebb ennyi másodpercet fogadunk el (a böngésző percenként jelent). */
export const MAX_REPORT_SECONDS = 120;

/** Belépéskor: a mostani belépés lesz az utolsó, az eddigi utolsó pedig az előző. */
export async function recordLogin(db: Database, userId: string, at: Date) {
  await db
    .insert(userActivity)
    .values({ userId, lastLoginAt: at })
    .onConflictDoUpdate({
      target: userActivity.userId,
      set: { previousLoginAt: sql`${userActivity.lastLoginAt}`, lastLoginAt: at },
    });
}

/**
 * Hozzáadja az eltöltött időt az összesítőhöz. Sosem ad hozzá többet, mint amennyi az előző
 * jelentés óta ténylegesen eltelt, így több nyitott fül vagy hamis kérés sem növeli meg az időt.
 */
export async function addActiveTime(db: Database, userId: string, seconds: number, now: Date) {
  const s = Math.max(0, Math.min(MAX_REPORT_SECONDS, Math.floor(seconds)));
  if (s === 0) return;
  // Az előző jelentés óta eltelt másodpercek (+2 mp tűrés az időzítés pontatlansága miatt).
  const elapsed = sql`greatest(0, floor(extract(epoch from (${now.toISOString()}::timestamptz - ${userActivity.lastActiveAt}))) + 2)`;
  await db
    .insert(userActivity)
    .values({ userId, totalSeconds: s, lastActiveAt: now })
    .onConflictDoUpdate({
      target: userActivity.userId,
      set: {
        totalSeconds: sql`${userActivity.totalSeconds} + least(${s}, coalesce(${elapsed}, ${s}))::int`,
        lastActiveAt: now,
      },
    });
}

/** A felhasználó aktivitása (belépések, összes idő), vagy null, ha még nincs adat. */
export async function getActivity(db: Database, userId: string) {
  const row = await db.query.userActivity.findFirst({
    where: (a, { eq }) => eq(a.userId, userId),
  });
  return row ?? null;
}
