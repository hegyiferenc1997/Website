"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { getAccountDb } from "@/db";
import { getSessionUser } from "@/features/auth/server";
import { getUniversity } from "@/features/courses/queries";
import { grantSemesterAccess } from "./grant";
import { isPlanId } from "./plans";
import { getPaymentProvider, isMockPayments } from "./provider";
import { safeReturnTo } from "./return-to";

// Szerveren futó műveletek a vásárláshoz: fizetés indítása és a próba-fizetés jóváhagyása.

/** A rendelés adatai az űrlapból, ellenőrizve; null, ha valami hibás. */
async function readOrder(form: FormData) {
  const universitySlug = String(form.get("university") ?? "");
  const semester = Number(form.get("semester"));
  const plan = form.get("plan");
  if (!Number.isInteger(semester) || semester < 0 || semester > 20 || !isPlanId(plan)) return null;
  // Csak létező egyetemre lehet vásárolni.
  if (!(await getUniversity(universitySlug))) return null;
  return { universitySlug, semester, plan, returnTo: safeReturnTo(form.get("back")) };
}

/** „Megvásárlás” egy csomagra: a fizetési szolgáltató oldalára irányít (most a próba-fizetésre). */
export async function startCheckoutAction(form: FormData) {
  const [user, order] = await Promise.all([getSessionUser(), readOrder(form)]);
  // Vendég nem vásárolhat (a gomb ilyenkor a bejelentkezést nyitja meg); hibás adatnál nem történik semmi.
  if (!user || !order) return;
  const { url } = await getPaymentProvider().createCheckout({
    ...order,
    userId: user.id,
    email: user.email,
    locale: String(form.get("locale") ?? "hu"),
  });
  redirect(url);
}

/**
 * Próba-fizetés jóváhagyása: rögzíti a vásárlást, és visszavisz oda, ahonnan a vásárlás indult.
 * Csak akkor működik, ha nincs valódi szolgáltató beállítva (PAYMENT_PROVIDER = mock vagy üres).
 */
export async function confirmMockCheckoutAction(form: FormData) {
  if (!isMockPayments()) return;
  const [user, order] = await Promise.all([getSessionUser(), readOrder(form)]);
  if (!user || !order) return;
  // Az oldal betöltésekor kapott egyedi azonosító: dupla kattintásra sem lesz két vásárlás.
  const nonce = String(form.get("nonce") ?? "") || randomUUID();
  await grantSemesterAccess(await getAccountDb(), {
    userId: user.id,
    universitySlug: order.universitySlug,
    semester: order.semester,
    plan: order.plan,
    provider: "mock",
    providerRef: `mock_${nonce}`,
  });
  redirect(order.returnTo);
}
