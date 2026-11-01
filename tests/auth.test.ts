import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { createLocalDb } from "@/db/local";
import { accounts, users } from "@/db/schema";
import { createAuth } from "@/features/auth/config";

async function setup() {
  const db = await createLocalDb();
  return { db, auth: createAuth(db) };
}

describe("bejelentkezés", () => {
  it("regisztráció után a jelszó csak hash-ként tárolódik, és be lehet lépni", async () => {
    const { db, auth } = await setup();
    await auth.api.signUpEmail({
      body: { name: "Teszt Elek", email: "Teszt@Example.com", password: "nagyontitkos1" },
    });

    const user = await db.query.users.findFirst({ where: eq(users.email, "teszt@example.com") });
    expect(user?.name).toBe("Teszt Elek");
    const account = await db.query.accounts.findFirst({ where: eq(accounts.userId, user!.id) });
    expect(account?.providerId).toBe("credential");
    expect(account?.password).toBeTruthy();
    expect(account?.password).not.toContain("nagyontitkos1");

    const res = await auth.api.signInEmail({
      body: { email: "teszt@example.com", password: "nagyontitkos1" },
      asResponse: true,
    });
    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("em.session_token=");
    expect(cookie.toLowerCase()).toContain("httponly");
  });

  it("hibás jelszóval és túl rövid jelszóval nem enged", async () => {
    const { auth } = await setup();
    await auth.api.signUpEmail({
      body: { name: "A", email: "a@example.com", password: "nagyontitkos1" },
    });
    await expect(
      auth.api.signInEmail({ body: { email: "a@example.com", password: "rossz-jelszo" } }),
    ).rejects.toThrow();
    await expect(
      auth.api.signUpEmail({ body: { name: "B", email: "b@example.com", password: "rovid" } }),
    ).rejects.toThrow();
  });

  it("ugyanazzal az e-mail címmel nem lehet kétszer regisztrálni", async () => {
    const { auth } = await setup();
    const body = { name: "A", email: "dupla@example.com", password: "nagyontitkos1" };
    await auth.api.signUpEmail({ body });
    await expect(auth.api.signUpEmail({ body })).rejects.toThrow();
  });
});
