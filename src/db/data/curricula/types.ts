// A mintatanterv-adatfájlok közös típusai és rövid segédfüggvényei (egyetemenként és szintenként egy fájl).

/** Egy tárgy a mintatantervben. */
export type CurriculumCourse = {
  /** URL-azonosító; ha nincs megadva, a névből készül. */
  slug?: string;
  name: string;
  /** Angol név. */
  en: string;
  /** Kredit; null, ha a forrás nem adja meg. */
  credits: number | null;
  /** Csak ezen a specializáción szerepel (a specializations lista slugja). */
  specialization?: string;
  /** Kötelezően választható / választható tárgy (a félév kreditösszegébe nem számít bele). */
  elective?: boolean;
};

/** Egy forrásdokumentum, amelyből a tanterv készült. */
export type CurriculumSource = { url: string; title: string };

/** Egy egyetem egy szakjának (BSc vagy MSc) mintatanterve. */
export type Curriculum = {
  /** Az egyetem alap slugja (a universities.ts-ből); az MSc bejegyzés slugja ehhez kap „-msc” végződést. */
  university: string;
  level: "bsc" | "msc";
  /** A hivatalos források (az egyetem oldalán megjelennek). */
  sources: CurriculumSource[];
  /** Rövid megjegyzés, ha a tanterv hiányos vagy következtetett (hu + en). */
  note?: { hu: string; en: string };
  specializations?: { slug: string; name: string; en: string }[];
  /** Félévenként a tárgyak; a tömb első eleme az 1. félév. */
  semesters: CurriculumCourse[][];
  /** Félév nélküli tárgyak (pl. választható tárgycsoportok, amelyeknek a forrás nem ad félévet). */
  unscheduled?: CurriculumCourse[];
};

/** Kötelező tárgy. */
export const k = (name: string, en: string, credits: number | null): CurriculumCourse => ({
  name,
  en,
  credits,
});

/** (Kötelezően) választható tárgy. */
export const v = (name: string, en: string, credits: number | null): CurriculumCourse => ({
  name,
  en,
  credits,
  elective: true,
});

/** Egy specializáció tárgyait előállító segéd: spec("slug")("Név", "Name", 5). */
export const spec =
  (specialization: string, elective = false) =>
  (name: string, en: string, credits: number | null): CurriculumCourse => ({
    name,
    en,
    credits,
    specialization,
    ...(elective ? { elective } : {}),
  });
