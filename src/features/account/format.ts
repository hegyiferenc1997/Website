// Dátumok kiírása a Profil és a Tananyagaim oldalon.

/**
 * Dátum és időpont a nyelv szokása szerint (pl. „2026. november 2. 15:30”).
 * Fix magyar időzónával, hogy a szerveren készült oldal ne függjön a szerver beállításától.
 */
export function formatDateTime(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Budapest",
  }).format(date);
}

/** Csak a dátum (pl. „2026. november 2.”). */
export function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "Europe/Budapest" }).format(
    date,
  );
}
