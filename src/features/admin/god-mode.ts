import "server-only";
import { cache } from "react";
import { eq } from "drizzle-orm";
import { getAccountDb } from "@/db";
import { adminSettings } from "@/db/schema";
import { getSessionUser } from "@/features/auth/server";
import { isAdminEmail } from "./admin-emails";

// „God mode”: az admin fiókjának kapcsolója, amellyel minden lecke nyitva van
// (nincs sorrendi zárolás, és nem kell megvenni a félévet). Mindig a szerver dönti el,
// a böngésző csak a végeredményt kapja meg.

/** Az admin állapota a kéréshez: admin-e a bejelentkezett felhasználó, és be van-e kapcsolva a god mode. */
export type AdminState = { isAdmin: boolean; godMode: boolean };

/** Kérésenként egyszer kérdezzük le (React cache), akárhány komponens kéri is. */
export const getAdminState = cache(async (): Promise<AdminState> => {
  const user = await getSessionUser();
  // Nem admin (vagy vendég): adatbázis-lekérdezés sem kell.
  if (!user || !isAdminEmail(user.email)) return { isAdmin: false, godMode: false };
  const db = await getAccountDb();
  const [row] = await db
    .select({ godMode: adminSettings.godMode })
    .from(adminSettings)
    .where(eq(adminSettings.userId, user.id))
    .limit(1);
  return { isAdmin: true, godMode: row?.godMode ?? false };
});

/** Be van-e kapcsolva a god mode az aktuális kérés felhasználójának. */
export async function isGodMode(): Promise<boolean> {
  return (await getAdminState()).godMode;
}
