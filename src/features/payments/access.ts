import "server-only";
import { cache } from "react";
import { and, eq, gt } from "drizzle-orm";
import { getAccountDb } from "@/db";
import { coursePurchases } from "@/db/schema";
import { getSessionUser, type SessionUser } from "@/features/auth/server";
import { isGodMode } from "@/features/admin/god-mode";

// Ki mihez fér hozzá. Általános szabály (minden tárgyra, a jövőbeliekre is):
// ha a felhasználónak van BÁRMILYEN aktív vásárlása (bármelyik csomag, bármelyik egyetem/félév),
// akkor minden lecke nyitva van, sorrendi zárolás nélkül. Vásárlás nélkül (vendégnek is) minden tárgyban
// csak az első témakör első leckéje nyitott (lásd lesson-access.ts).
// Kérésenként egyszer kérdezzük le (React cache), akárhány komponens kéri is.

/** Egy egyetem aktív félévei: félév száma → meddig érvényes (a vásárlás gombok „Aktív: …-ig” feliratához). */
export type SemesterPasses = Map<number, Date>;

/**
 * A hozzáférés állapota egy oldalhoz: ki van bejelentkezve, melyik félévei aktívak az egyetemen,
 * meddig tart a teljes hozzáférése (bármelyik aktív vásárlás legkésőbbi lejárata), és be van-e
 * kapcsolva az admin „god mode”-ja (ilyenkor minden nyitva, fizetés nélkül).
 */
export type AccessInfo = {
  user: SessionUser | null;
  passes: SemesterPasses;
  fullUntil: Date | null;
  godMode: boolean;
};

/** Teljes hozzáférése van-e: van aktív vásárlása (bármelyik csomag), vagy god mode-ban van. */
export function hasFullAccess(access: AccessInfo): boolean {
  return access.godMode || access.fullUntil !== null;
}

/** A bejelentkezett felhasználó összes aktív vásárlása (kérésenként egyszer lekérve). */
const getActivePurchases = cache(async (userId: string) => {
  const db = await getAccountDb();
  return db
    .select({
      universitySlug: coursePurchases.universitySlug,
      semester: coursePurchases.semester,
      expiresAt: coursePurchases.expiresAt,
    })
    .from(coursePurchases)
    .where(and(eq(coursePurchases.userId, userId), gt(coursePurchases.expiresAt, new Date())));
});

/** A hozzáférés egy egyetem oldalaihoz (vendégnek üres). */
export const getUniversityAccess = cache(async (universitySlug: string): Promise<AccessInfo> => {
  const [user, godMode] = await Promise.all([getSessionUser(), isGodMode()]);
  const passes: SemesterPasses = new Map();
  if (!user) return { user, passes, fullUntil: null, godMode: false };
  const rows = await getActivePurchases(user.id);
  let fullUntil: Date | null = null;
  for (const r of rows) {
    // A teljes hozzáférés a legkésőbb lejáró vásárlásig tart.
    if (!fullUntil || r.expiresAt > fullUntil) fullUntil = r.expiresAt;
    // Félévenként a legkésőbbi lejárat számít (csak ennél az egyetemnél).
    if (r.universitySlug !== universitySlug || r.semester === null) continue;
    const prev = passes.get(r.semester);
    if (!prev || r.expiresAt > prev) passes.set(r.semester, r.expiresAt);
  }
  return { user, passes, fullUntil, godMode };
});
