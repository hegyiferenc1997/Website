import "server-only";
import { mockProvider } from "./mock";
import type { PlanId } from "./plans";

// A fizetési szolgáltató felülete. Most csak a próba-fizetés („mock”) létezik; egy valódi szolgáltató
// (pl. Stripe) egy új fájlba kerül ugyanezzel a felülettel, és a PAYMENT_PROVIDER környezeti változó választja ki.
// Valódi szolgáltatónál a fizetés sikerét a szolgáltató értesítése (webhook) jelzi, ami a grantSemesterAccess-t hívja.

/** Egy elindítandó rendelés: ki, melyik egyetem melyik félévét, melyik csomaggal. */
export type CheckoutOrder = {
  userId: string;
  email: string;
  universitySlug: string;
  semester: number;
  plan: PlanId;
  /** A nyelv, amelyen a fizetési oldal megjelenjen. */
  locale: string;
  /** Hova térjen vissza a felhasználó (az oldalon belüli útvonal, pl. /egyetemek/gabor-denes-egyetem). */
  returnTo: string;
};

/** Egy fizetési szolgáltató: elindítja a fizetést, és megmondja, hova kell átirányítani a felhasználót. */
export interface PaymentProvider {
  /** A szolgáltató neve (a vásárlások táblában is ez szerepel). */
  id: string;
  /** Fizetés indítása; a visszaadott címre kell átirányítani a felhasználót. */
  createCheckout(order: CheckoutOrder): Promise<{ url: string }>;
}

/** A beállított szolgáltató (PAYMENT_PROVIDER, alapból „mock”). */
export function getPaymentProvider(): PaymentProvider {
  const id = process.env.PAYMENT_PROVIDER ?? "mock";
  switch (id) {
    case "mock":
      return mockProvider;
    // case "stripe": return stripeProvider;  ← ide jön majd a valódi szolgáltató
    default:
      throw new Error(`Ismeretlen fizetési szolgáltató: ${id}`);
  }
}

/** Próba-fizetés van-e beállítva (csak ekkor használható a próba fizetési oldal). */
export function isMockPayments(): boolean {
  return (process.env.PAYMENT_PROVIDER ?? "mock") === "mock";
}
