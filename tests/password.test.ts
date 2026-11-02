// Tesztek a jelszó szabályaihoz és az erősségjelzőhöz. Futtatás: pnpm test

import { describe, expect, it } from "vitest";
import { checkPassword, isPasswordValid, passwordStrength } from "@/features/auth/shared";

describe("jelszó szabályok", () => {
  it("mind a négy szabályt ellenőrzi", () => {
    expect(checkPassword("abc")).toEqual({
      length: false,
      upper: false,
      digit: false,
      special: false,
    });
    expect(checkPassword("Árvíztűrő-1")).toEqual({
      length: true,
      upper: true,
      digit: true,
      special: true,
    });
    expect(isPasswordValid("Jelszo-12")).toBe(true);
    expect(isPasswordValid("Jelszo 12")).toBe(false); // a szóköz nem speciális karakter
    expect(isPasswordValid("jelszo-12")).toBe(false);
  });

  it("az erősség 0–4 között nő", () => {
    expect(passwordStrength("")).toBe(0);
    expect(passwordStrength("abc")).toBe(1);
    expect(passwordStrength("Abcdefg1")).toBe(2);
    expect(passwordStrength("Abcdef-1")).toBe(3);
    expect(passwordStrength("Abcdefgh-123")).toBe(4);
  });
});
