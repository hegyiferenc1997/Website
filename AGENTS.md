<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Kommentelési szabály (a projekt tulajdonosának kérése)

Minden kód rövid, lényegretörő **magyar** kommenteket kap:

- minden fájl elején 1–2 sor arról, mire való a fájl;
- minden fontosabb függvény, komponens és típus előtt egy rövid magyarázat;
- a nem magától értetődő lépéseknél (miért így, nem csak mit) egy sor.

Ez az új és a módosított kódra is mindig vonatkozik.

## Kipróbáló parancsok (a projekt tulajdonosának kérése)

Minden elkészült változtatáshoz (PR / ág) adj bemásolható PowerShell parancsokat a helyi kipróbáláshoz
(a tulajdonos Windows + VS Code + pnpm környezetben dolgozik), pl.:

```powershell
git fetch origin
git checkout <ág-neve>
git pull
pnpm install
pnpm dev
```

és írd le, hogyan lehet visszaállni: `git checkout main`.

## Kattintható elemek (a projekt tulajdonosának kérése)

Minden kattintható elem fölött kéz alakú egérmutató legyen (`cursor: pointer`). A `globals.css`
alapstílusa ezt megadja a linkekre, gombokra, `summary`-ra, jelölőnégyzetekre és a `role="button"` stb.
elemekre; ha új, kattintható, de nem ilyen elem készül (pl. kattintható `div`), kapjon `cursor-pointer` osztályt.

## Súgó-buborék az ikonos gombokon

A csak ikont tartalmazó gombok `data-tooltip="…"` attribútumot kapnak (kétnyelvű szöveggel a messages fájlokból),
így egérrel fölé érve megjelenik, mit csinálnak (lásd `globals.css`, „Súgó-buborék”).

## Leckék zárolása (a projekt tulajdonosának kérése, minden jelenlegi és jövőbeli tárgyra)

- Ha a felhasználónak van **bármilyen aktív vásárlása** (bármelyik csomag, bármelyik egyetem/félév), akkor
  **minden tárgy minden leckéje nyitva van**, lakat és sorrendi zárolás nélkül (`hasFullAccess`,
  `src/features/payments/access.ts`). Az admin god mode ugyanígy mindent megnyit.
- Vásárlás nélkül, illetve kijelentkezve minden tárgyban **csak az első témakör első leckéje** nyitott,
  a többi lakattal zárolt (`isLessonOpen`, `src/features/payments/lesson-access.ts`). A zárolt lecke
  szövege nem kerül a böngészőbe; a zárolásról mindig a szerver dönt (nincs villanás).
- Minden megnyitható lecke **kézzel ki-be pipálható** (kész / nem kész), akkor is, ha van benne kötelező
  feladat (a sikeres feladat is késznek jelöli). Új tárgynál ne vezess be más zárolási szabályt.
