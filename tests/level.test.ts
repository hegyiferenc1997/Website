// A képzési szint segédfüggvényeinek tesztjei (BSc / MSc jelölés az egyetem neve mellett).
import { describe, expect, it } from "vitest";
import { levelShort, universityLabel } from "@/features/courses/level";

describe("képzési szint", () => {
  it("a név mellé teszi a rövidítést", () => {
    expect(universityLabel("Gábor Dénes Egyetem", "bsc")).toBe("Gábor Dénes Egyetem · BSc");
    expect(universityLabel("Gábor Dénes Egyetem", "msc")).toBe("Gábor Dénes Egyetem · MSc");
  });
  it("az „egyéb” szintnél csak a név marad", () => {
    expect(levelShort("other")).toBeNull();
    expect(universityLabel("X Egyetem", "other")).toBe("X Egyetem");
  });
});
