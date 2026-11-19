# Informatika alapjai – tananyag

Ebben a mappában van az 1. féléves Informatika alapjai (B-INFOAP) tárgy tananyaga. Indításkor (és
`pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tantárgyleírás 16 témakörét követi, ugyanabban a sorrendben:
`01-adatok-es-informaciok` … `16-szerverek-telepitese-es-uzemeltetese`. Minden témakör 5 leckéből áll:

- 3 alaplecke (`01`–`03`),
- egy **Mélyebben** lecke (`04-melyebben-…`), amely kis futtatható programokkal, interaktív ábrával
  (` ```plot `) és több nézőpontból (felhasználó, fejlesztő, üzemeltető, cégvezetés) mélyíti el a témát,
- egy `gyakorlas` (kind: practice) lecke (`05`), ellenőrző kérdésekkel és összefoglaló feladatlappal,
  a végén egy nem kötelező „További gyakorló feladatok” résszel: 3 számolós Python-feladat
  (kiinduló kód, elrejtett megoldás, ellenőrző teszt) és egy gyors kvíz.

A 16. témakör gyakorló leckéje a tárgy záró összefoglalója. Összesen 16 interaktív ábra, 116
` ```python run ` példa és 53 starter/megoldás/teszt hármas van a tárgyban. A mappák, a `topic.json` és a lecke fájlok
felépítése ugyanaz, mint a Programozási alapoknál (lásd `../programozas-alapjai/README.md`).

A tárgy követelményei (számonkérés, pontok, jegyek) szándékosan nincsenek a leckékben.

## Kötelező feladatok

- A 8. témakör (Python alapjai) leckéinek kötelező feladata **Python-program**
  (` ```python starter required ` + megoldás + ` ```python test `), mint a Programozási alapoknál.
- Az összes többi lecke kötelező feladata egy **kvízblokk** (` ```quiz required `), begépelős (`=`) és
  feleletválasztós (`+` / `-`) kérdésekkel. A formátum leírása: `../digitalis-technika/README.md`.

Szabályok:

- Leckénként pontosan egy kötelező feladat van.
- A magyar és az angol kvíz ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben, a
  feleletválasztásnál a jó válasz ugyanazon a helyen van, és a számos válaszok megegyeznek (a teszt
  ellenőrzi).
- A számolós kérdések (számrendszerek, bináris keresés, kritikus út, sebesség, rendelkezésre állás,
  RAID-kapacitás, mozgóátlag) eredményét Pythonnal ellenőriztük. Ha egy példát módosítasz, a leckében
  és a gyakorló leckében is igazítsd hozzá.
- A ` ```python run ` blokkok futtatható példák, a `tests/python-examples.test.ts` lefuttatja őket.
  Ne használj bennük olyan modult, amely a böngészős Pythonban (Pyodide) nincs alapból betöltve
  (pl. `sqlite3`); az SQL-példák ezért ` ```sql ` blokkban, csak megjelenítve vannak.
- Kódszínezés: ` ```bash `, ` ```powershell `, ` ```sql `, ` ```html `, ` ```cpp `, ` ```json `,
  ` ```yaml `, ` ```nginx `; ábrák és diagramok ` ```text ` blokkban.
- A verziószámok (Ubuntu Server 26.04 LTS, Python 3.14, PostgreSQL 18) 2026 novemberi állapotot
  tükröznek; új kiadásnál a 8. és a 16. témakört frissíteni kell.
