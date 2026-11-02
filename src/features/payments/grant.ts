import { and, desc, eq, gt } from "drizzle-orm";
import type { Database } from "@/db";
import { coursePurchases } from "@/db/schema";
import { getPlan, type PlanId } from "./plans";

// A sikeres fizetés rögzítése: hozzáférés egy egyetem egy félévéhez a csomag időtartamára.
// Minden fizetési szolgáltató (próba, később pl. Stripe) ezt hívja, így a hozzáférés logikája egy helyen van.

/** Egy kifizetett rendelés adatai. */
export type PaidOrder = {
  userId: string;
  universitySlug: string;
  semester: number;
  plan: PlanId;
  /** A szolgáltató neve, pl. „mock” vagy „stripe”. */
  provider: string;
  /** A szolgáltató egyedi azonosítója a fizetéshez; ugyanazt a fizetést kétszer nem rögzítjük. */
  providerRef: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Hozzáférés rögzítése. Ha a félévre már van aktív hozzáférés, az új időszak annak a végétől számít
 * (meghosszabbítás), így a korábban kifizetett napok nem vesznek el. Visszaadja a lejárat idejét.
 */
export async function grantSemesterAccess(db: Database, order: PaidOrder, now = new Date()) {
  const plan = getPlan(order.plan);
  // A félév legkésőbb lejáró, még aktív hozzáférése (ha van).
  const [current] = await db
    .select({ expiresAt: coursePurchases.expiresAt })
    .from(coursePurchases)
    .where(
      and(
        eq(coursePurchases.userId, order.userId),
        eq(coursePurchases.universitySlug, order.universitySlug),
        eq(coursePurchases.semester, order.semester),
        gt(coursePurchases.expiresAt, now),
      ),
    )
    .orderBy(desc(coursePurchases.expiresAt))
    .limit(1);
  const start = current ? current.expiresAt : now;
  const expiresAt = new Date(start.getTime() + plan.days * DAY_MS);

  // Ha ugyanazt a fizetést már rögzítettük (pl. dupla kattintás, újraküldött értesítés), nem lesz új sor.
  await db
    .insert(coursePurchases)
    .values({
      userId: order.userId,
      universitySlug: order.universitySlug,
      semester: order.semester,
      plan: plan.id,
      amountHuf: plan.priceHuf,
      provider: order.provider,
      providerRef: order.providerRef,
      purchasedAt: now,
      expiresAt,
    })
    .onConflictDoNothing({ target: coursePurchases.providerRef });
  return expiresAt;
}
