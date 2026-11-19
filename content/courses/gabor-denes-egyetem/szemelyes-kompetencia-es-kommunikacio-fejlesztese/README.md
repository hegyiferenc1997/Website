# Személyes kompetencia és kommunikáció fejlesztése – tananyag

Ebben a mappában van az 1. féléves Személyes kompetencia és kommunikáció fejlesztése tárgy tananyaga.
Indításkor (és `pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a
leckéket.

A szerkezet a tanmenet 18 témakörét követi, ugyanabban a sorrendben:
`01-kommunikacio-alapjai-es-tipusai` … `18-uzleti-es-kozossegi-kommunikacio-az-informatikaban`. Minden
témakör 3 alapleckéből, egy `04-melyebben-…` leckéből és egy `05-gyakorlas` (kind: practice) leckéből
áll; a 18. témakör gyakorló leckéje a tárgy záró, vegyes feladatsora (egy csapatprojekt története).

- A **Mélyebben** lecke ugyanazt a témát számokkal, kis programokkal (` ```python run `), gyakran
  interaktív ábrával (` ```plot `) és több nézőpontból mutatja be (pl. zaj és visszakérdezés
  valószínűsége, beszédtempó és Bayes-tétel a testbeszédhez, LIX-mutató, Pareto-hatékony tárgyalási
  csomagok, kapcsolati háló mint gráf, Condorcet-tétel, jelszóentrópia, korrekciós szorzó és EDD,
  Leitner-doboz, 360 fokos visszajelzés és kalibráció, hibahatár és A/B teszt, rendelkezésre állás és
  buszfaktor), saját kötelező kvízzel.
- A **gyakorló** lecke ellenőrző kérdésekkel és összefoglaló feladatlappal (kötelező kvíz) indul, a végén
  pedig „További gyakorló feladatok (nem kötelezők)” szakasz van: 3 számolós Python-feladat
  (` ```python starter ` + rejtett megoldás + ` ```python test `) és egy nem kötelező gyors kvíz.

A mappák, a `topic.json` és a lecke fájlok felépítése ugyanaz, mint a Programozási alapoknál (lásd
`../programozas-alapjai/README.md`).

Az egymáshoz közeli nevű témakörök más-más hangsúlyt kapnak: a 9. a kapcsolatépítés alapjai, a 12. a
személyes márka (portfólió, GitHub, LinkedIn); a 10. a csapatszerepek, vezetés és visszajelzés, a 11. a
csoportfejlődés, a csoportos döntés és a mindennapi csapatkommunikáció.

**Szabály:** a tárgy követelményei (számonkérés, ZH-k, pontok, jegyek, aláírás, oktató) soha nem kerülnek
a tananyagba (a teszt egy egyszerű szókereséssel ellenőrzi).

## Kötelező feladat: kvíz

Leckénként pontosan egy ` ```quiz required ` blokk van, begépelős (`=`) és feleletválasztós (`+` / `-`)
kérdésekkel. A formátum leírása: `../digitalis-technika/README.md`.

- A magyar és az angol kvíz ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben, a
  feleletválasztásnál a jó válasz ugyanazon a helyen van, és a számos válaszok megegyeznek (a teszt
  ellenőrzi).
- Tizedes válaszoknál a magyar fájlban is mindkét alakot felsoroljuk (`= 13,5` és `= 13.5`).
- A legtöbb kérdés helyzetfelismerő (melyik technika, stílus, hiba illik a történetre); ha egy példát
  módosítasz, a gyakorló leckében is igazítsd hozzá.

## Ábrák, kód

- 16 interaktív ` ```plot ` ábra (pl. kommunikációs csatornák száma $k(k-1)/2$, felejtési görbe,
  hibahatár a mintaméret függvényében, megengedett leállás). A magyar és az angol ábra csak a címben és
  a feliratokban különbözhet (a teszt ellenőrzi). Az `x`, az `n` és az `e` foglalt paraméternév.
- 55 ` ```python run ` példa és 54 starter/megoldás/teszt hármas a gyakorló leckékben – a
  `tests/python-examples.test.ts` lefuttatja őket (a megoldásnak át kell mennie a teszten).
- Beágyazott minták (e-mail, README, jegyzet) ` ```text ` blokkban.
