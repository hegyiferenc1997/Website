// Tesztek az irányítópult félévenkénti csoportosításához és lapozásához. Futtatás: pnpm test

import { describe, expect, it } from "vitest";
import { groupBySemester, pageCount, pageItems } from "@/features/dashboard/paging";

describe("irányítópult lapozás", () => {
  it("félévek szerint csoportosít, növekvő sorrendben, a félév nélküli a végén", () => {
    const groups = groupBySemester([
      { semester: 3, id: "a" },
      { semester: 0, id: "b" },
      { semester: 1, id: "c" },
      { semester: 3, id: "d" },
    ]);
    expect(groups.map((g) => [g.semester, g.items.map((i) => i.id)])).toEqual([
      [1, ["c"]],
      [3, ["a", "d"]],
      [0, ["b"]],
    ]);
  });

  it("oldalanként legfeljebb 3 elem", () => {
    const items = [1, 2, 3, 4, 5, 6, 7];
    expect(pageCount(items.length)).toBe(3);
    expect(pageItems(items, 1)).toEqual([1, 2, 3]);
    expect(pageItems(items, 2)).toEqual([4, 5, 6]);
    expect(pageItems(items, 3)).toEqual([7]);
    // Határon kívüli oldalszám: az első / utolsó oldal.
    expect(pageItems(items, 0)).toEqual([1, 2, 3]);
    expect(pageItems(items, 9)).toEqual([7]);
    expect(pageCount(0)).toBe(1);
    expect(pageCount(3)).toBe(1);
  });
});
