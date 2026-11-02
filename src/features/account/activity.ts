import { and, eq, gte, sql } from "drizzle-orm";
import type { Database } from "@/db";
import { userActivity, userActivityDays } from "@/db/schema";

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

/** Egy dátum napja a magyar időzóna szerint, „ÉÉÉÉ-HH-NN” alakban (a napi összesítő kulcsa). */
export function budapestDay(date: Date): string {
  // Az en-CA nyelvi formátum pont ÉÉÉÉ-HH-NN alakú dátumot ad.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Budapest" }).format(date);
}

/**
 * Hozzáadja az eltöltött időt az összesítőhöz és a mai naphoz. Sosem ad hozzá többet, mint amennyi
 * az előző jelentés óta ténylegesen eltelt, így több nyitott fül vagy hamis kérés sem növeli meg az időt.
 */
export async function addActiveTime(db: Database, userId: string, seconds: number, now: Date) {
  const s = Math.max(0, Math.min(MAX_REPORT_SECONDS, Math.floor(seconds)));
  if (s === 0) return;
  await db.transaction(async (tx) => {
    // Az előző jelentés ideje (a sor zárolásával, hogy két egyszerre érkező kérés ne számoljon duplán).
    const [row] = await tx
      .select({ lastActiveAt: userActivity.lastActiveAt })
      .from(userActivity)
      .where(eq(userActivity.userId, userId))
      .for("update");
    // Az előző jelentés óta eltelt másodpercek (+2 mp tűrés az időzítés pontatlansága miatt).
    const elapsed = row?.lastActiveAt
      ? Math.max(0, Math.floor((now.getTime() - row.lastActiveAt.getTime()) / 1000) + 2)
      : s;
    const added = Math.min(s, elapsed);

    await tx
      .insert(userActivity)
      .values({ userId, totalSeconds: added, lastActiveAt: now })
      .onConflictDoUpdate({
        target: userActivity.userId,
        set: { totalSeconds: sql`${userActivity.totalSeconds} + ${added}`, lastActiveAt: now },
      });
    if (added === 0) return;
    // A mai nap összesítője.
    await tx
      .insert(userActivityDays)
      .values({ userId, day: budapestDay(now), seconds: added })
      .onConflictDoUpdate({
        target: [userActivityDays.userId, userActivityDays.day],
        set: { seconds: sql`${userActivityDays.seconds} + ${added}` },
      });
  });
}

/** A felhasználó napi tanulási ideje a megadott napoktól (ÉÉÉÉ-HH-NN) kezdve: nap → másodperc. */
export async function getDailySeconds(db: Database, userId: string, fromDay: string) {
  const rows = await db
    .select({ day: userActivityDays.day, seconds: userActivityDays.seconds })
    .from(userActivityDays)
    .where(and(eq(userActivityDays.userId, userId), gte(userActivityDays.day, fromDay)));
  return new Map(rows.map((r) => [r.day, r.seconds]));
}

/** A felhasználó aktivitása (belépések, összes idő), vagy null, ha még nincs adat. */
export async function getActivity(db: Database, userId: string) {
  const row = await db.query.userActivity.findFirst({
    where: (a, { eq }) => eq(a.userId, userId),
  });
  return row ?? null;
}
