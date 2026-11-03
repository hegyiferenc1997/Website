"use server";

import { refresh } from "next/cache";
import { getAccountDb } from "@/db";
import { adminSettings } from "@/db/schema";
import { getSessionUser } from "@/features/auth/server";
import { isAdminEmail } from "./admin-emails";

// Szerveren futó művelet: a god mode be- és kikapcsolása (csak admin fióknak).

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
