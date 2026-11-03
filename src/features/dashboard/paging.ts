// Segédfüggvények az irányítópult „hol tartasz” részéhez: félévek szerinti csoportosítás és lapozás.
// Tiszta függvények (nincs React bennük), így könnyen tesztelhetők.

/** Ennyi tárgykártya fér egy oldalra. */
export const COURSES_PER_PAGE = 3;

/** Egy félév csoportja: a félév száma (0 = nincs megadva) és a hozzá tartozó elemek. */
export type SemesterGroup<T> = { semester: number; items: T[] };

/**
 * Félévek szerint csoportosít, növekvő sorrendben; a félév nélküli (0) csoport a végére kerül.
 * A csoporton belül megtartja az eredeti sorrendet.
 */
export function groupBySemester<T extends { semester: number }>(items: T[]): SemesterGroup<T>[] {
  const map = new Map<number, T[]>();
  for (const item of items) {
    const list = map.get(item.semester);
    if (list) list.push(item);
    else map.set(item.semester, [item]);
  }
  // Rendezési kulcs: a 0 (nincs félév) a legnagyobb, hogy hátra kerüljön.
  const order = (s: number) => (s === 0 ? Number.MAX_SAFE_INTEGER : s);
  return [...map]
    .sort(([a], [b]) => order(a) - order(b))
    .map(([semester, items]) => ({ semester, items }));
}

/** Hány oldal kell ennyi elemhez (legalább 1, hogy üres listánál is legyen „1. oldal”). */
export function pageCount(total: number, size = COURSES_PER_PAGE): number {
  return Math.max(1, Math.ceil(total / size));
}

/** Az adott oldal elemei (1-től számozva); a túl nagy vagy kicsi oldalszámot a határra igazítja. */
export function pageItems<T>(items: T[], page: number, size = COURSES_PER_PAGE): T[] {
  const p = Math.min(Math.max(1, page), pageCount(items.length, size));
  return items.slice((p - 1) * size, p * size);
}
