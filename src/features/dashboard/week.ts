import { budapestDay } from "@/features/account/activity";

// A heti tanulási grafikon napjai (külön fájlban, hogy a tesztek is elérjék).

// Egy nap ezredmásodpercben.
const DAY_MS = 24 * 60 * 60 * 1000;

/** A mostani hét napjai (hétfőtől vasárnapig) a magyar időzóna szerint, „ÉÉÉÉ-HH-NN” alakban. */
export function currentWeekDays(now: Date): string[] {
  const today = budapestDay(now);
  // Délben UTC: így a napok léptetésénél nem zavar be a téli / nyári időszámítás.
  const noon = new Date(`${today}T12:00:00Z`);
  const sinceMonday = (noon.getUTCDay() + 6) % 7;
  return Array.from({ length: 7 }, (_, i) =>
    new Date(noon.getTime() + (i - sinceMonday) * DAY_MS).toISOString().slice(0, 10),
  );
}
