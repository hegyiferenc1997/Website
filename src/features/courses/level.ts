// Képzési szintek (BSc = alapszak, MSc = mesterszak, …): sorrend és rövid jelölés a kiíráshoz.

/** A képzési szintek abban a sorrendben, ahogy az Egyetemek oldalon a szakaszok követik egymást. */
export const DEGREE_LEVELS = ["bsc", "msc", "phd", "other"] as const;

/** Egy képzési szint azonosítója (megegyezik az adatbázis degree_level értékeivel). */
export type DegreeLevel = (typeof DEGREE_LEVELS)[number];

// A nemzetközi rövidítések minden nyelven ugyanazok, ezért nem kell fordítani őket.
const SHORT: Record<DegreeLevel, string | null> = {
  bsc: "BSc",
  msc: "MSc",
  phd: "PhD",
  other: null,
};

/** A szint rövidítése (pl. „BSc”); az „egyéb” szintnek nincs, akkor null. */
export const levelShort = (level: DegreeLevel) => SHORT[level];

/**
 * Az egyetem neve a képzési szinttel, pl. „Gábor Dénes Egyetem · BSc”, hogy az azonos nevű
 * BSc és MSc bejegyzés mindenhol megkülönböztethető legyen.
 */
export const universityLabel = (name: string, level: DegreeLevel) => {
  const short = levelShort(level);
  return short ? `${name} · ${short}` : name;
};
