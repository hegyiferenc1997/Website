# Innováció- és projektmenedzsment – tananyag

Ebben a mappában van a 3. féléves Innováció- és projektmenedzsment tárgy tananyaga. Indításkor (és
`pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tantárgyleírás 15 témakörét követi: `01-innovacio-alapelvei-es-kreativitas` …
`15-projektmenedzsment-szoftverek-es-eszkozok`. Az 1–5. témakör az innovációról, a 6–15. a
projektmenedzsmentről szól; a 15. témakör egy összefoglaló projekttel zárul, amely a tárgy összes
módszerét egy kis szoftverprojekten alkalmazza. Minden témakör az alapleckék után egy `…-melyebben-…`
leckével és egy `gyakorlas` (kind: practice) leckével zárul.

- A **Mélyebben** lecke ugyanazt a témát számokkal, szimulációval (` ```python run `) és interaktív ábrával
  (` ```plot `) mutatja be (pl. ötletgenerálás valószínűségei, Bass-diffúzió, LTV/CAC, NPV és IRR,
  Pareto és szigmaszint, hálóterv kritikus úttal, PERT és Monte Carlo, EVM, burndown, RACI-ellenőrzés,
  érintettrács, kockázati tartalék és szabályozó kártya, Kanban-mutatók), saját kötelező kvízzel.
- A **gyakorló** lecke ellenőrző kérdésekkel és összefoglaló feladatlappal (kötelező kvíz) indul, a végén
  pedig „További gyakorló feladatok (nem kötelezők)” szakasz van: 3 számolós Python-feladat
  (` ```python starter ` + rejtett megoldás + ` ```python test `) és egy nem kötelező gyors kvíz. A
  ` ```python run ` és starter/solution/test blokkokat a `tests/python-examples.test.ts` lefuttatja.

A mappák, a `topic.json` és a lecke fájlok felépítése ugyanaz,
mint a Programozási alapoknál (lásd `../programozas-alapjai/README.md`).

## Kötelező feladat: kvíz

A leckék kötelező feladata egy **kvízblokk**, ugyanúgy, mint a Digitális technikánál (a formátum leírása:
`../digitalis-technika/README.md`). Leckénként pontosan egy ` ```quiz required ` blokk kell; a gyakorló
leckében ez az összefoglaló feladatlap. Itt csak begépelős (`=`) és feleletválasztós (`+` / `-`)
kérdések vannak.

Szabályok:

- A magyar és az angol kvíz ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben, a
  feleletválasztásnál a jó válasz ugyanazon a helyen van (a teszt ellenőrzi).
- Számos válasznál a magyar fájlban tizedesvessző, az angolban tizedespont van – a normalizálás
  mindkettőt elfogadja, de a magyar fájlban érdemes mindkét alakot felsorolni (`= 0,8` és `= 0.8`).
- A számolós feladatok (kritikus út, tartalékidő, várható érték, megszerzett érték, súlyozott mátrix)
  eredményét kézzel ellenőriztük; ha egy példát módosítasz, a leckében és a gyakorló leckében is
  igazítsd hozzá.
- Az ábrák (hálóterv, Gantt, Kanban-tábla, hisztogram) ` ```text ` blokkban vannak; az interaktív ` ```plot `
  ábrák magyar és angol változata csak a címben és a feliratokban különbözhet (a teszt ellenőrzi).
