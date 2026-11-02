// Tesztek a haladás ellenőrzéséhez és összefésüléséhez. Futtatás: pnpm test

import { describe, expect, it } from "vitest";
import { emptyProgress, mergeProgress, sanitizeProgress } from "@/features/progress/data";

describe("haladás", () => {
  it("a hibás vagy ismeretlen részeket eldobja", () => {
    expect(sanitizeProgress(null)).toEqual(emptyProgress);
    expect(
      sanitizeProgress({
        openSemesters: { gde: [1, 2, 2, -1, "x", 1.5] },
        lastCourse: { gde: "programozas-alapjai", rossz: 5 },
        doneLessons: { "gde/prog": ["a", "a", "", 3] },
        idegen: "mező",
      }),
    ).toEqual({
      openSemesters: { gde: [1, 2] },
      lastCourse: { gde: "programozas-alapjai" },
      doneLessons: { "gde/prog": ["a"] },
    });
  });

  it("bejelentkezéskor a vendég haladása hozzáadódik a fiókéhoz", () => {
    const local = {
      openSemesters: { gde: [1] },
      lastCourse: { gde: "uj" },
      doneLessons: { "gde/prog": ["a", "b"] },
    };
    const remote = {
      openSemesters: { gde: [3] },
      lastCourse: { gde: "regi", bme: "x" },
      doneLessons: { "gde/prog": ["b", "c"], "gde/matek": ["d"] },
    };
    expect(mergeProgress(local, remote)).toEqual({
      openSemesters: { gde: [3, 1] },
      lastCourse: { gde: "uj", bme: "x" },
      doneLessons: { "gde/prog": ["b", "c", "a"], "gde/matek": ["d"] },
    });
  });
});

describe("leckék haladása", () => {
  it("a régi, témakör alapú jelölések eldobódnak", () => {
    expect(sanitizeProgress({ doneTopics: { "gde/prog": ["a"] } }).doneLessons).toEqual({});
  });
});
