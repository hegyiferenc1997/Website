// Melyik félévhez tartozik egy tárgy (a vásárlás félévenként történik).

/**
 * A tárgy félévének kulcsa: a legkorábbi ajánlott félév a szakok közül; 0, ha egyikben sincs félév megadva
 * (az egyetem oldalán ezek a „félév nélküli” csoportban vannak, és együtt vásárolhatók meg).
 */
export function courseSemester(programCourses: { recommendedSemester: number | null }[]): number {
  const list = programCourses
    .map((p) => p.recommendedSemester)
    .filter((s): s is number => s !== null)
    .sort((a, b) => a - b);
  return list[0] ?? 0;
}
