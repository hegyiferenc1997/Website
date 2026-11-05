# Személyes kompetencia és kommunikáció fejlesztése – tananyag

Ebben a mappában van az 1. féléves Személyes kompetencia és kommunikáció fejlesztése tárgy tananyaga.
Indításkor (és `pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a
leckéket.

A szerkezet a tanmenet 18 témakörét követi, ugyanabban a sorrendben:
`01-kommunikacio-alapjai-es-tipusai` … `18-uzleti-es-kozossegi-kommunikacio-az-informatikaban`. Minden
témakör 3 leckéből és egy `gyakorlas` (kind: practice) leckéből áll, ellenőrző kérdésekkel és
összefoglaló feladatlappal; a 18. témakör gyakorló leckéje a tárgy záró, vegyes feladatsora (egy
csapatprojekt története). A mappák, a `topic.json` és a lecke fájlok felépítése ugyanaz, mint a
Programozási alapoknál (lásd `../programozas-alapjai/README.md`).

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

- Két interaktív ` ```plot ` ábra: a csapaton belüli kommunikációs csatornák száma ($k(k-1)/2$, 11.
  témakör) és a felejtési görbe (15. témakör). A magyar és az angol ábra csak a címben és a feliratokban
  különbözhet (a teszt ellenőrzi). Az `x` és az `n` foglalt paraméternév.
- Öt ` ```python run ` példa (ZOPA, Eisenhower-mátrix, ismétlési ütemterv, leíró statisztika stb.) – a
  `tests/python-examples.test.ts` lefuttatja őket.
- Beágyazott minták (e-mail, README, jegyzet) ` ```text ` blokkban.
