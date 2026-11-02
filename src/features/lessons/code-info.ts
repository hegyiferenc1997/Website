// A lecke kódblokkjainak fejléce (```nyelv szerep [required]). Külön fájlban van, hogy a tesztek és a
// tananyag betöltője (seed) is használhassa (a markdown.ts csak a szerveren tölthető be).

// A kódblokk szerepe a nyelv utáni szóból, pl. ```python run. A böngészős Python futtató ez alapján
// tudja, mit lehet futtatni: run = önálló példa, starter = feladat kiinduló kódja, solution = megoldás,
// test = ellenőrző kód (a megoldás vagy a tanuló kódja után fut, assert sorokkal).
export const CODE_ROLES = ["run", "starter", "solution", "test"] as const;
export type CodeRole = (typeof CODE_ROLES)[number];

/**
 * A ```nyelv szerep [required] fejléc szétbontása. A „required” jelző a starter blokkon azt jelenti,
 * hogy ez a lecke kötelező feladata: csak a sikeres ellenőrzés után számít késznek a lecke.
 */
export function parseCodeInfo(info: string | undefined): {
  lang: string;
  role: CodeRole | null;
  required: boolean;
} {
  const [lang = "", role = "", ...flags] = (info ?? "").trim().toLowerCase().split(/\s+/);
  const known = (CODE_ROLES as readonly string[]).includes(role) ? (role as CodeRole) : null;
  return { lang, role: known, required: known === "starter" && flags.includes("required") };
}

/** Van-e a leckében kötelező feladat (```python starter required vagy ```quiz required blokk). */
export function hasRequiredExercise(markdown: string): boolean {
  return /^```(python[ \t]+starter|quiz)[ \t]+required\b/m.test(markdown);
}

/** Kvízblokk-e (```quiz [required]), és ha igen, a lecke kötelező feladata-e. */
export function parseQuizInfo(info: string | undefined): { quiz: boolean; required: boolean } {
  const [lang = "", ...flags] = (info ?? "").trim().toLowerCase().split(/\s+/);
  return { quiz: lang === "quiz", required: lang === "quiz" && flags.includes("required") };
}
