// Tesztek a lecke fájlok beolvasásához. Futtatás: pnpm test

import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "@/db/content";

describe("lecke fájlok", () => {
  it("a fejléc és a szöveg szétválik (Windows sorvégekkel is)", () => {
    const { data, body } = parseFrontmatter(
      "---\r\ntitle: Mi a program?\r\nminutes: 10\r\n---\r\n\r\nSzöveg: **félkövér**\r\n",
    );
    expect(data).toEqual({ title: "Mi a program?", minutes: "10" });
    expect(body).toBe("Szöveg: **félkövér**");
  });

  it("fejléc nélkül az egész fájl a szöveg", () => {
    expect(parseFrontmatter("csak szöveg")).toEqual({ data: {}, body: "csak szöveg" });
  });
});
