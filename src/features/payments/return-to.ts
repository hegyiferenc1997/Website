// A visszatérési cím ellenőrzése: csak az oldalon belüli útvonal lehet (pl. /egyetemek/…),
// így a ?back= paraméterrel senki nem irányíthat át egy idegen oldalra.

/** Biztonságos, oldalon belüli útvonal, különben a főoldal. */
export function safeReturnTo(value: unknown): string {
  if (typeof value !== "string") return "/";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  return value;
}
