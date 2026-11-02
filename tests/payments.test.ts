// Tesztek a félévenkénti vásárláshoz: hozzáférés rögzítése, meghosszabbítás, csomagok, visszatérési cím.
// Futtatás: pnpm test

import { describe, expect, it } from "vitest";
import { createLocalDb } from "@/db/local";
import { coursePurchases, users } from "@/db/schema";
import { courseSemester } from "@/features/courses/semester";
import { grantSemesterAccess } from "@/features/payments/grant";
import { formatHuf, isPlanId, PLANS } from "@/features/payments/plans";
import { safeReturnTo } from "@/features/payments/return-to";

const DAY = 24 * 60 * 60 * 1000;

// Új adatbázis egy felhasználóval.
async function setup() {
  const db = await createLocalDb({ seed: false });
  await db.insert(users).values({ id: "u1", name: "Teszt", email: "t@example.com" });
  return db;
}

// Egy próba-rendelés az 1. félévre.
const order = (plan: "week" | "month" | "semester", ref: string) => ({
  userId: "u1",
  universitySlug: "gabor-denes-egyetem",
  semester: 1,
  plan,
  provider: "mock",
  providerRef: ref,
});

describe("félév vásárlás", () => {
  it("a csomag hosszával nyit hozzáférést", async () => {
    const db = await setup();
    const now = new Date("2026-11-02T12:00:00Z");
    const until = await grantSemesterAccess(db, order("week", "a"), now);
    expect(until.getTime() - now.getTime()).toBe(7 * DAY);
  });

  it("aktív hozzáférésnél a lejárattól hosszabbít (nem vész el nap)", async () => {
    const db = await setup();
    const now = new Date("2026-11-02T12:00:00Z");
    await grantSemesterAccess(db, order("month", "a"), now);
    const later = new Date(now.getTime() + 5 * DAY);
    const until = await grantSemesterAccess(db, order("week", "b"), later);
    expect(until.getTime() - now.getTime()).toBe(37 * DAY);
  });

  it("ugyanazt a fizetést kétszer nem rögzíti", async () => {
    const db = await setup();
    const now = new Date("2026-11-02T12:00:00Z");
    await grantSemesterAccess(db, order("semester", "same"), now);
    await grantSemesterAccess(db, order("semester", "same"), now);
    expect(await db.select().from(coursePurchases)).toHaveLength(1);
  });
});

describe("csomagok és segédfüggvények", () => {
  it("három csomag: heti, havi, féléves", () => {
    expect(PLANS.map((p) => [p.id, p.days, p.priceHuf])).toEqual([
      ["week", 7, 1990],
      ["month", 30, 3990],
      ["semester", 180, 5990],
    ]);
    expect(isPlanId("month")).toBe(true);
    expect(isPlanId("year")).toBe(false);
  });

  it("forint formázás ezres tagolással", () => {
    expect(formatHuf(1990, "hu").replace(/\s/g, " ")).toBe("1 990 Ft");
  });

  it("visszatérési cím csak az oldalon belül", () => {
    expect(safeReturnTo("/egyetemek/x")).toBe("/egyetemek/x");
    expect(safeReturnTo("//evil.com")).toBe("/");
    expect(safeReturnTo("https://evil.com")).toBe("/");
    expect(safeReturnTo(undefined)).toBe("/");
  });

  it("a tárgy féléve a legkorábbi ajánlott félév, ennek hiányában 0", () => {
    expect(courseSemester([{ recommendedSemester: 3 }, { recommendedSemester: 1 }])).toBe(1);
    expect(courseSemester([{ recommendedSemester: null }])).toBe(0);
  });
});
