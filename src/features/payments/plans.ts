// A vásárolható csomagok: időtartam és ár. Az árak egyelőre ideiglenesek (helykitöltők).
// Kliens és szerver oldalon is használható (nincs benne adatbázis vagy titkos adat).

/** A csomagok azonosítói. */
export const PLAN_IDS = ["week", "month", "semester"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/** Egy csomag: hány napig érvényes és mennyibe kerül (forintban). */
export type Plan = { id: PlanId; days: number; priceHuf: number };

/** A három csomag a kártyák sorrendjében. */
export const PLANS: Plan[] = [
  { id: "week", days: 7, priceHuf: 1990 },
  { id: "month", days: 30, priceHuf: 3990 },
  { id: "semester", days: 180, priceHuf: 5990 },
];

/** A kiemelt („legjobb ár”) csomag. */
export const BEST_PLAN: PlanId = "semester";

/** Létező csomag-e (a felhasználótól érkező értékek ellenőrzéséhez). */
export function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && (PLAN_IDS as readonly string[]).includes(value);
}

/** Egy csomag az azonosítója alapján. */
export function getPlan(id: PlanId): Plan {
  return PLANS.find((p) => p.id === id)!;
}

/** A legolcsóbb csomag ára (a „…-tól” felirathoz). */
export const MIN_PRICE_HUF = Math.min(...PLANS.map((p) => p.priceHuf));

/** Ár forintban a nyelvnek megfelelő formában, pl. „1 990 Ft” / „HUF 1,990”. */
export function formatHuf(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale === "hu" ? "hu-HU" : "en-US", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
    // Négyjegyű számnál is legyen ezres tagolás (1 990 Ft), a magyar alapbeállítás ezt kihagyná.
    useGrouping: "always",
  }).format(amount);
}
