"use server";

import { refresh } from "next/cache";
import { getAccountDb } from "@/db";
import { getSessionUser } from "@/features/auth/server";
import { addDemoPurchases } from "./purchases";

// Szerveren futó műveletek a fiók oldalaihoz.

/** Fejlesztéshez: példa-vásárlások a bejelentkezett felhasználónak (élesben nem csinál semmit). */
export async function addDemoPurchasesAction() {
  if (process.env.NODE_ENV !== "development") return;
  const user = await getSessionUser();
  if (!user) return;
  await addDemoPurchases(await getAccountDb(), user.id, new Date());
  refresh();
}
