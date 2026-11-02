// A lecke kódblokkjainak fejléce (```nyelv szerep). Külön fájlban van, hogy a tesztek is használhassák
// (a markdown.ts csak a szerveren tölthető be).

// A kódblokk szerepe a nyelv utáni szóból, pl. ```python run. A későbbi böngészős Python futtató ez alapján
// tudja, mit lehet futtatni: run = önálló példa, starter = feladat kiinduló kódja, solution = megoldás,
// test = ellenőrző kód (a megoldás vagy a tanuló kódja után fut, assert sorokkal).
export const CODE_ROLES = ["run", "starter", "solution", "test"] as const;
export type CodeRole = (typeof CODE_ROLES)[number];

/** A ```nyelv szerep fejléc szétbontása: { nyelv, szerep }. */
export function parseCodeInfo(info: string | undefined): { lang: string; role: CodeRole | null } {
  const [lang = "", role = ""] = (info ?? "").trim().toLowerCase().split(/\s+/);
  return {
    lang,
    role: (CODE_ROLES as readonly string[]).includes(role) ? (role as CodeRole) : null,
  };
}
