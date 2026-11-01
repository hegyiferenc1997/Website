import { describe, expect, it } from "vitest";
import { emptyProgress, mergeProgress, sanitizeProgress } from "@/features/progress/data";

describe("haladás", () => {
  it("a hibás vagy ismeretlen részeket eldobja", () => {
    expect(sanitizeProgress(null)).toEqual(emptyProgress);
    expect(
      sanitizeProgress({
        openSemesters: { gde: [1, 2, 2, -1, "x", 1.5] },
        lastCourse: { gde: "programozas-alapjai", rossz: 5 },
        doneTopics: { "gde/prog": ["a", "a", "", 3] },
        idegen: "mező",
      }),
    ).toEqual({
      openSemesters: { gde: [1, 2] },
      lastCourse: { gde: "programozas-alapjai" },
      doneTopics: { "gde/prog": ["a"] },
    });
  });

  it("bejelentkezéskor a vendég haladása hozzáadódik a fiókéhoz", () => {
    const local = {
      openSemesters: { gde: [1] },
      lastCourse: { gde: "uj" },
      doneTopics: { "gde/prog": ["a", "b"] },
    };
    const remote = {
      openSemesters: { gde: [3] },
      lastCourse: { gde: "regi", bme: "x" },
      doneTopics: { "gde/prog": ["b", "c"], "gde/matek": ["d"] },
    };
    expect(mergeProgress(local, remote)).toEqual({
      openSemesters: { gde: [3, 1] },
      lastCourse: { gde: "uj", bme: "x" },
      doneTopics: { "gde/prog": ["b", "c", "a"], "gde/matek": ["d"] },
    });
  });
});
