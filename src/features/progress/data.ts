// A haladás adatszerkezete, ellenőrzése és összefésülése. A böngésző és a szerver is ezt használja.

export type Progress = {
  /** Lenyitott félévek egyetemenként. */
  openSemesters: Record<string, number[]>;
  /** Az utoljára megnyitott tárgy egyetemenként (a tárgy slugja). */
  lastCourse: Record<string, string>;
  /** Elvégzett leckék tárgyanként ("egyetem/tárgy" kulcs → "témakör/lecke" azonosítók). */
  doneLessons: Record<string, string[]>;
};

/** Egy lecke azonosítója a tárgyon belül, pl. "vezerlesi-szerkezetek/for-ciklus". */
export const lessonKey = (topic: string, lesson: string) => `${topic}/${lesson}`;

export const emptyProgress: Progress = { openSemesters: {}, lastCourse: {}, doneLessons: {} };

/** A tárolt haladás felső mérete (bájt), hogy egy fiók ne tölthesse tele az adatbázist. */
export const MAX_PROGRESS_BYTES = 64 * 1024;

const MAX_KEYS = 500;
const MAX_ITEMS = 500;
const MAX_STRING = 200;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const isShortString = (v: unknown): v is string =>
  typeof v === "string" && v.length > 0 && v.length <= MAX_STRING;

function cleanRecord<T>(value: unknown, clean: (v: unknown) => T | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  if (!isRecord(value)) return out;
  for (const [key, v] of Object.entries(value).slice(0, MAX_KEYS)) {
    if (!isShortString(key) || key === "__proto__") continue;
    const cleaned = clean(v);
    if (cleaned !== undefined) out[key] = cleaned;
  }
  return out;
}

const uniqueList = <T>(list: T[]) => [...new Set(list)].slice(0, MAX_ITEMS);

/** Bármilyen bemenetből érvényes haladást készít; az ismeretlen vagy hibás részeket eldobja. */
export function sanitizeProgress(value: unknown): Progress {
  const v = isRecord(value) ? value : {};
  return {
    openSemesters: cleanRecord(v.openSemesters, (list) =>
      Array.isArray(list)
        ? uniqueList(list.filter((n): n is number => Number.isInteger(n) && n > 0 && n < 100))
        : undefined,
    ),
    lastCourse: cleanRecord(v.lastCourse, (s) => (isShortString(s) ? s : undefined)),
    doneLessons: cleanRecord(v.doneLessons, (list) =>
      Array.isArray(list) ? uniqueList(list.filter(isShortString)) : undefined,
    ),
  };
}

/**
 * Vendégként gyűjtött haladás összefésülése a fiókban tárolttal bejelentkezéskor.
 * Az elvégzett leckék és a lenyitott félévek uniója marad meg; az „itt tartasz” tárgynál
 * a böngészőben lévő (frissebb) érték nyer.
 */
export function mergeProgress(local: Progress, remote: Progress): Progress {
  const union = <T>(a: Record<string, T[]>, b: Record<string, T[]>) => {
    const out: Record<string, T[]> = { ...b };
    for (const [k, list] of Object.entries(a)) out[k] = uniqueList([...(b[k] ?? []), ...list]);
    return out;
  };
  return {
    openSemesters: union(local.openSemesters, remote.openSemesters),
    lastCourse: { ...remote.lastCourse, ...local.lastCourse },
    doneLessons: union(local.doneLessons, remote.doneLessons),
  };
}
