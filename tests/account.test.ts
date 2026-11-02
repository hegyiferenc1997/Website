// Tesztek a Profil és a Tananyagaim adataihoz: belépések, összesített idő, vásárlások. Futtatás: pnpm test

import { describe, expect, it } from "vitest";
import { createLocalDb } from "@/db/local";
import { users } from "@/db/schema";
import {
  addActiveTime,
  budapestDay,
  getActivity,
  getDailySeconds,
  recordLogin,
} from "@/features/account/activity";
import { addDemoPurchases, getPurchases } from "@/features/account/purchases";
import { createAuth } from "@/features/auth/config";

// Új adatbázis egy felhasználóval.
async function setup() {
  const db = await createLocalDb({ seed: false });
  await db.insert(users).values({ id: "u1", name: "Teszt", email: "t@example.com" });
  return db;
}

describe("fiók adatai", () => {
  it("belépéskor az eddigi utolsó belépés lesz az előző", async () => {
    const db = await setup();
    const first = new Date("2026-11-01T10:00:00Z");
    const second = new Date("2026-11-02T12:00:00Z");
    await recordLogin(db, "u1", first);
    await recordLogin(db, "u1", second);
    const a = await getActivity(db, "u1");
    expect(a?.lastLoginAt?.toISOString()).toBe(second.toISOString());
    expect(a?.previousLoginAt?.toISOString()).toBe(first.toISOString());
  });

  it("az idő összeadódik, de nem több, mint amennyi eltelt", async () => {
    const db = await setup();
    const t0 = new Date("2026-11-02T10:00:00Z");
    await addActiveTime(db, "u1", 60, t0);
    await addActiveTime(db, "u1", 60, new Date(t0.getTime() + 60_000));
    expect((await getActivity(db, "u1"))?.totalSeconds).toBe(120);
    // Egy másik fül 1 mp-cel később szintén 60-at jelent: csak az eltelt idő (+2 mp tűrés) adódik hozzá.
    await addActiveTime(db, "u1", 60, new Date(t0.getTime() + 61_000));
    expect((await getActivity(db, "u1"))?.totalSeconds).toBe(123);
    // Túl nagy érték: legfeljebb 120 mp számít.
    await addActiveTime(db, "u1", 99999, new Date(t0.getTime() + 3_600_000));
    expect((await getActivity(db, "u1"))?.totalSeconds).toBe(243);
  });

  it("az idő a magyar idő szerinti naphoz is hozzáadódik", async () => {
    const db = await setup();
    // 23:30 UTC = másnap 00:30 Budapesten (téli időszámítás).
    const late = new Date("2026-11-02T23:30:00Z");
    await addActiveTime(db, "u1", 60, late);
    await addActiveTime(db, "u1", 60, new Date(late.getTime() + 60_000));
    expect(budapestDay(late)).toBe("2026-11-03");
    const days = await getDailySeconds(db, "u1", "2026-11-02");
    expect(days.get("2026-11-03")).toBe(120);
    expect(days.get("2026-11-02")).toBeUndefined();
  });

  it("a vásárlások aktívra és lejártra válnak szét", async () => {
    const db = await setup();
    const now = new Date();
    await addDemoPurchases(db, "u1", now);
    const { active, expired } = await getPurchases(db, "u1", now);
    expect(active).toHaveLength(1);
    expect(expired).toHaveLength(1);
    expect(active[0].expiresAt > now).toBe(true);
    expect(expired[0].expiresAt <= now).toBe(true);
  });

  it("bejelentkezéskor feljegyzi a belépés idejét", async () => {
    const db = await createLocalDb({ seed: false });
    const auth = createAuth(db);
    const res = await auth.api.signUpEmail({
      body: { name: "Belépő", email: "b@example.com", password: "Nagyon-titkos1" },
    });
    await auth.api.signInEmail({ body: { email: "b@example.com", password: "Nagyon-titkos1" } });
    const a = await getActivity(db, res.user.id);
    expect(a?.lastLoginAt).toBeInstanceOf(Date);
    expect(a?.previousLoginAt).toBeInstanceOf(Date);
  });
});

describe("irányítópult", () => {
  it("a hét hétfőtől vasárnapig tart, a magyar idő szerint", async () => {
    const { currentWeekDays } = await import("@/features/dashboard/week");
    // 2026-11-02 hétfő.
    expect(currentWeekDays(new Date("2026-11-02T10:00:00Z"))).toEqual([
      "2026-11-02",
      "2026-11-03",
      "2026-11-04",
      "2026-11-05",
      "2026-11-06",
      "2026-11-07",
      "2026-11-08",
    ]);
    // Vasárnap késő este UTC-ben már hétfő Budapesten → új hét.
    expect(currentWeekDays(new Date("2026-11-08T23:30:00Z"))[0]).toBe("2026-11-09");
  });
});
