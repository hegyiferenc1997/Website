"use server";

import { refresh } from "next/cache";
import { and, eq } from "drizzle-orm";
import { getAccountDb } from "@/db";
import { adminSettings, coursePurchases } from "@/db/schema";
import { getSessionUser } from "@/features/auth/server";
import { isAdminEmail } from "./admin-emails";
import { getAdminState } from "./god-mode";

// Szerveren futó admin műveletek: a god mode be- és kikapcsolása, és god mode-ban a vásárlások törlése.

/** A god mode állapotának mentése; nem admin felhasználónál nem történik semmi. */
export async function setGodModeAction(on: boolean) {
  const user = await getSessionUser();
  // A jogosultságot itt, a szerveren ellenőrizzük: a böngészőből érkező kérésben nem bízunk.
  if (!user || !isAdminEmail(user.email)) return;
  const db = await getAccountDb();
  const godMode = on === true;
  await db
    .insert(adminSettings)
    .values({ userId: user.id, godMode, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: adminSettings.userId,
      set: { godMode, updatedAt: new Date() },
    });
  // Az oldal újrarajzolása az új állapottal (zárolás / fizetési fal).
  refresh();
}

/** Csak bekapcsolt god mode-ban engedünk törölni; a felhasználó azonosítója, vagy null. */
async function godModeUserId(): Promise<string | null> {
  const [user, admin] = await Promise.all([getSessionUser(), getAdminState()]);
  return user && admin.godMode ? user.id : null;
}

/**
 * God mode: a saját vásárlásaid törlése a Tananyagaim oldalon (hogy látszódjon az üres állapot).
 * Az űrlap „id” mezője egy vásárlás azonosítója, vagy „all” = az összes.
 */
export async function deletePurchaseAction(form: FormData) {
  const userId = await godModeUserId();
  if (!userId) return;
  const id = String(form.get("id") ?? "");
  const db = await getAccountDb();
  // Mindig csak a saját sorai törölhetők (a user_id feltétel miatt más vásárlásához nem nyúlhat).
  if (id === "all") {
    await db.delete(coursePurchases).where(eq(coursePurchases.userId, userId));
  } else if (/^\d+$/.test(id)) {
    await db
      .delete(coursePurchases)
      .where(and(eq(coursePurchases.userId, userId), eq(coursePurchases.id, Number(id))));
  }
  refresh();
}
