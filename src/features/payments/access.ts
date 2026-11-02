import "server-only";
import { cache } from "react";
import { and, eq, gt, isNotNull } from "drizzle-orm";
import { getAccountDb } from "@/db";
import { coursePurchases } from "@/db/schema";
import { getSessionUser, type SessionUser } from "@/features/auth/server";

// Ki mihez fér hozzá: a bejelentkezett felhasználó aktív félév-hozzáférései egy egyetemen.
// Kérésenként egyszer kérdezzük le (React cache), akárhány komponens kéri is.

/** Egy egyetem aktív félévei: félév száma → meddig érvényes. */
export type SemesterPasses = Map<number, Date>;

/** A hozzáférés állapota egy oldalhoz: ki van bejelentkezve, és melyik félévei aktívak. */
export type AccessInfo = { user: SessionUser | null; passes: SemesterPasses };

/** A bejelentkezett felhasználó aktív félévei az adott egyetemen (vendégnek üres). */
export const getUniversityAccess = cache(async (universitySlug: string): Promise<AccessInfo> => {
  const user = await getSessionUser();
  const passes: SemesterPasses = new Map();
  if (!user) return { user, passes };
  const db = await getAccountDb();
  const rows = await db
    .select({ semester: coursePurchases.semester, expiresAt: coursePurchases.expiresAt })
    .from(coursePurchases)
    .where(
      and(
        eq(coursePurchases.userId, user.id),
        eq(coursePurchases.universitySlug, universitySlug),
        isNotNull(coursePurchases.semester),
        gt(coursePurchases.expiresAt, new Date()),
      ),
    );
  // Félévenként a legkésőbbi lejárat számít.
  for (const r of rows) {
    const prev = passes.get(r.semester!);
    if (!prev || r.expiresAt > prev) passes.set(r.semester!, r.expiresAt);
  }
  return { user, passes };
});
