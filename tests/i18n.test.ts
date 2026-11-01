import { describe, expect, it } from "vitest";
import en from "../messages/en.json";
import hu from "../messages/hu.json";
import * as gde from "@/db/data/gde-mernokinformatikus";
import { routing } from "@/i18n/routing";

/** Az összes kulcs pontokkal összefűzve, pl. "Layout.nav.home". */
function keys(obj: object, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === "object" && v !== null ? keys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}

describe("fordítások", () => {
  it("minden nyelvnek ugyanazok a szövegei vannak", () => {
    expect(keys(en).sort()).toEqual(keys(hu).sort());
  });

  it("minden útvonalnak van címe minden nyelven", () => {
    for (const value of Object.values(routing.pathnames)) {
      if (typeof value === "string") continue;
      expect(Object.keys(value).sort()).toEqual([...routing.locales].sort());
    }
  });

  it("minden GDE tárgynak és specializációnak van angol neve", () => {
    for (const c of gde.semesters.flat()) expect(c.en.trim(), c.name).not.toBe("");
    for (const s of gde.specializations) expect(s.en.trim(), s.name).not.toBe("");
  });
});
