// A leckék zárolásának általános szabálya (szerveren és böngészőben is használható).
// Teljes hozzáféréssel (bármelyik aktív csomag vagy god mode) minden lecke nyitva van, sorrendi zárolás nincs.
// Nélküle (vendégnek is) minden tárgyban csak az első témakör első leckéje nyitott, ingyenes kipróbálásra.

/** Hány lecke nyitott ingyen minden tárgy elején (a tárgy leckéinek sorrendjében). */
export const FREE_LESSONS_PER_COURSE = 1;

/** Megnyitható-e a tárgy index. leckéje (0-tól számolva, a tárgy összes leckéjének sorrendjében). */
export function isLessonOpen(fullAccess: boolean, index: number): boolean {
  return fullAccess || (index >= 0 && index < FREE_LESSONS_PER_COURSE);
}
