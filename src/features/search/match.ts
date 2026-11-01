// Kereső logika: ékezet- és kisbetű-független, több szóra is működik (minden szónak illeszkednie kell).

export type SearchItem = {
  kind: "university" | "course";
  /** Egyedi azonosító a listához, pl. "course:gde/matematika". */
  key: string;
  title: string;
  /** Kisebb szöveg a cím alatt, pl. „Gábor Dénes Egyetem · 1. félév · 5 kredit”. */
  meta: string;
  /** Minden szöveg, amire keresni lehet (név, egyetem, város, tárgykód, rövidítés). */
  keywords: string;
  university: string;
  course?: string;
};

/** Kisbetűs, ékezet nélküli alak: „Gábor Dénes” → „gabor denes”. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Az összes találat, jobb egyezés elöl: előbb ahol a név a beírt szöveggel kezdődik,
 * aztán ahol egy szó kezdődik vele, aztán ahol a név tartalmazza, végül ahol csak pl. az egyetem neve illik.
 */
export function search(items: SearchItem[], query: string): SearchItem[] {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(/\s+/);

  const scored: { item: SearchItem; score: number }[] = [];
  for (const item of items) {
    const title = normalize(item.title);
    const haystack = `${title} ${normalize(item.keywords)}`;
    if (!words.every((w) => haystack.includes(w))) continue;
    const score = title.startsWith(q)
      ? 0
      : title.split(/[\s\-–]+/).some((part) => part.startsWith(words[0]))
        ? 1
        : title.includes(words[0])
          ? 2
          : 3;
    scored.push({ item, score });
  }

  const collator = new Intl.Collator("hu");
  return scored
    .sort(
      (a, b) =>
        a.score - b.score ||
        collator.compare(a.item.title, b.item.title) ||
        collator.compare(a.item.meta, b.item.meta),
    )
    .map((s) => s.item);
}
