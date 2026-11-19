# Adatbázisok – tananyag

Ebben a mappában van a 3. féléves Adatbázisok tárgy tananyaga. Indításkor (és `pnpm db:seed`
futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tanmenet 19 témakörét követi, ugyanabban a sorrendben:
`01-adatbazisrendszerek-alapelvei-es-tipusai` … `19-adatbazisok-gyakorlati-alkalmazasa`. Minden
témakör 3 alapleckéből (a 8. témakörben 4), egy `melyebben-…` leckéből és egy `gyakorlas` (kind: practice)
leckéből áll; az utolsó témakör utolsó leckéje a tárgy záró gyakorlása.

- A **Mélyebben** lecke ugyanazt a témát több szemszögből, gyakorlati esettanulmánnyal és sok futtatható
  példával dolgozza fel (saját kötelező feladattal).
- A **gyakorlás** lecke az ellenőrző kérdések és a kötelező összefoglaló feladat után a „További gyakorló
  feladatok (nem kötelezők)” szakaszban 5–6 megoldható SQL feladatot ad (` ```sql starter ` +
  ` ```sql solution `, szükség esetén ` ```sql test `). Ezek nem zárnak le semmit, csak gyakorlásra valók.

A mappák, a `topic.json` és a lecke fájlok felépítése ugyanaz, mint a Programozási alapoknál (lásd
`../programozas-alapjai/README.md`).

**Szabály:** a tárgy követelményei (számonkérés, ZH-k, pontok, jegyek, aláírás, oktató, irodalom) soha
nem kerülnek a tananyagba (a `tests/quiz.test.ts` egy egyszerű szókereséssel ellenőrzi). A leckék csak
a témával foglalkoznak, a lehető leghallgatóbarátabb módon: példa előbb, definíció utána.

## Kötelező feladat: kvíz vagy SQL

Leckénként pontosan egy kötelező feladat van:

- ` ```quiz required ` blokk (formátum: `../digitalis-technika/README.md`); a magyar és az angol kvíz
  ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben, ugyanazokkal a válaszokkal;
- vagy ` ```sql starter required ` feladat, amelyet a hallgató a böngészőben futtat.

## A böngészős SQL-futtató

Az SQL blokkok egy valódi PostgreSQL-ben futnak a hallgató böngészőjében (PGlite, háttérszálon:
`public/sql/worker.mjs` + `public/sql/engine.mjs`). Nincs szerver, amit a kód elérne: minden futtatás egy
friss, memóriában lévő adatbázis-másolaton történik, így a hallgató semmit nem ronthat el tartósan.

| Jelölés                     | Jelentés                                                                      |
| --------------------------- | ----------------------------------------------------------------------------- |
| ` ```sql setup `            | a lecke mintaadatbázisa; a lecke további SQL blokkjai ezen futnak             |
| ` ```sql run `              | futtatható példa (mindig a friss mintaadatbázison)                            |
| ` ```sql starter required ` | a lecke kötelező feladata; a hallgató kódja után az ellenőrzés fut            |
| ` ```sql solution `         | a megoldás (`<details><summary>Megoldás</summary>` blokkban)                  |
| ` ```sql test `             | opcionális ellenőrző lekérdezés: a hallgató kódja és a megoldás után is lefut |
| ` ```sql `                  | csak megjelenített kód                                                        |

Az ellenőrzés a hallgató és a megoldás **utolsó táblázatos eredményét** veti össze (vagy, ha van
`test` blokk, annak eredményét): az oszlopok nevét nem nézi, a számokat 6 tizedesre egységesíti, és a
sorrend csak akkor számít, ha a megoldás (vagy a `test`) tartalmaz `ORDER BY`-t.

### Közös mintaadatbázisok

A gyakran használt mintaadatbázisok az `sql/` mappában vannak, nyelvenként (`név.hu.sql`, `név.en.sql`).
A leckébe a `<!-- sql-setup: név -->` sor illeszti be őket (`src/db/content.ts`):

- `egyetem`: hallgatók, tárgyak, jelentkezések (6 hallgató, kis és áttekinthető);
- `webshop`: 5000 vásárló, 20 termék, 20 000 rendelés, 40 000 tétel (indexeléshez, riportokhoz);
- `eladasok`: csillagséma egy üzletláncról (dátum-, termék- és bolt-dimenzió, 5840 eladás).

Ha egy mintaadatbázist módosítasz, az összes rá épülő feladat várt eredménye megváltozhat – a
`pnpm test` megmutatja, melyik.

### Tesztek

A `tests/sql-examples.test.ts` minden `run` blokkot lefuttat, a megoldásnak át kell mennie az
ellenőrzésen, a kötelező feladat kiinduló kódjának pedig **el kell buknia**. A teszt azt nem tudja, hogy
a `test` blokk eredménye értelmes-e – új feladatnál a megoldás kimenetét érdemes egyszer szemmel is
megnézni.
