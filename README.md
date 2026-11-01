# Engineering Maxxing

> Ahol eredményesen megszerezheted és gyakorolhatod a tudásodat egyetemi tanulmányaid előtt, alatt és után is.

Weboldal, amely a mérnökinformatikus hallgatók tanulmányait segíti: egyetemek, tantárgyak, jegyzetek és források egy helyen.
Magyarul és angolul érhető el (a magyar az alap, az angol oldalak címe `/en`-nel kezdődik).

## Indítás

Kell hozzá: [Node.js](https://nodejs.org) 22 vagy újabb, és [pnpm](https://pnpm.io) (`npm install -g pnpm`).

```bash
pnpm install
pnpm dev
```

Utána nyisd meg: http://localhost:3000

Adatbázist nem kell telepíteni: ha nincs megadva `DATABASE_URL`, a szerver egy beépített, memóriában futó
Postgrest indít, és betölti a kezdő adatot (Gábor Dénes Egyetem, Mérnökinformatikus BSc: 7 félév, minden tárgy kredittel; a mintatanterv a `src/db/data/` mappában van).

## Technológia

| Réteg             | Eszköz                                     |
| ----------------- | ------------------------------------------ |
| Keretrendszer     | Next.js (App Router, Cache Components)     |
| Nyelv             | TypeScript                                 |
| Többnyelvűség     | next-intl                                  |
| Adatbázis         | PostgreSQL + Drizzle ORM (helyben: PGlite) |
| Stílus            | Tailwind CSS (téma: `src/app/globals.css`) |
| Minőségbiztosítás | ESLint, Prettier, Vitest, GitHub Actions   |

## Szerkezet

```
src/
  app/[locale]/           oldalak (a [locale] a nyelv, magyarnál nem látszik az URL-ben)
  components/             saját UI komponensek
  features/courses/       egyetemek és tárgyak lekérdezései
  db/                     adatbázis séma, kapcsolat, kezdő adat
  i18n/                   nyelvek és fordított URL-ek
  proxy.ts                nyelvfelismerés, URL-átirányítás
messages/hu.json          minden felületi szöveg magyarul
messages/en.json          ugyanezek angolul
content/courses/          tananyag (MDX)
drizzle/                  adatbázis migrációk
```

## URL-ek

| Oldal        | URL                                                          |
| ------------ | ------------------------------------------------------------ |
| Főoldal      | `/`                                                          |
| Egyetemek    | `/egyetemek`                                                 |
| Egy egyetem  | `/egyetemek/gabor-denes-egyetem`                             |
| Egy tantárgy | `/egyetemek/gabor-denes-egyetem/targyak/programozas-alapjai` |

## Hasznos parancsok

| Parancs            | Mit csinál                                        |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | fejlesztői szerver                                |
| `pnpm build`       | éles build                                        |
| `pnpm lint`        | kódellenőrzés                                     |
| `pnpm typecheck`   | típusellenőrzés                                   |
| `pnpm test`        | tesztek                                           |
| `pnpm format`      | kód formázása                                     |
| `pnpm db:generate` | új migráció a `src/db/schema.ts` változásaiból    |
| `pnpm db:migrate`  | migrációk futtatása a `DATABASE_URL` adatbázison  |
| `pnpm db:seed`     | kezdő adat betöltése a `DATABASE_URL` adatbázisba |

## Szabályok

- Felületi szöveget ne írj közvetlenül a komponensbe: a `messages/hu.json`-ba **és** a `messages/en.json`-ba is kerüljön, és `getTranslations` / `useTranslations` olvassa. A tesztek jeleznek, ha valamelyik nyelvből hiányzik egy szöveg.
- Linkekhez a `@/i18n/navigation` `Link`-jét használd, ez tudja a magyar URL-eket.
- Az adatbázisban a neveket és leírásokat nyelvenként tároljuk (`{ "hu": "...", "en": "..." }`); új tárgynál az angol nevet is add meg (`en`).
