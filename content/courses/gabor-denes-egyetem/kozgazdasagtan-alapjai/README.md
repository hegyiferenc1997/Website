# Közgazdaságtan alapjai – tananyag

Ebben a mappában van az 1. féléves Közgazdaságtan alapjai (B-KOZGAL) tárgy tananyaga. Indításkor (és
`pnpm db:seed` futtatásakor) az oldal innen tölti be az adatbázisba a témaköröket és a leckéket.

A szerkezet a tanmenet 12 témakörét követi, ugyanabban a sorrendben:
`01-kozgazdasagtan-es-gazdasagi-rendszerek` … `12-kozgazdasagtan-az-informatikaban`. Az 1–4. témakör
főleg mikroökonómia, a 6–11. makroökonómia, az 5. és a 12. mindkettőt érinti. Minden témakör 3 leckéből
és egy `gyakorlas` (kind: practice) leckéből áll, ellenőrző kérdésekkel és összefoglaló feladatlappal; a 12. témakör gyakorló leckéje a tárgy záró, vegyes feladatsora. A mappák, a `topic.json` és a lecke fájlok
felépítése ugyanaz, mint a Programozási alapoknál (lásd `../programozas-alapjai/README.md`).

**Szabály:** a tárgy követelményei (számonkérés, ZH-k, pontok, jegyek, aláírás, oktató) soha nem kerülnek
a tananyagba (a teszt egy egyszerű szókereséssel ellenőrzi).

## Kötelező feladat: kvíz

Leckénként pontosan egy ` ```quiz required ` blokk van, begépelős (`=`) és feleletválasztós (`+` / `-`)
kérdésekkel. A formátum leírása: `../digitalis-technika/README.md`.

- A magyar és az angol kvíz ugyanazokat a kérdéseket tartalmazza ugyanabban a sorrendben, a
  feleletválasztásnál a jó válasz ugyanazon a helyen van, és a számos válaszok megegyeznek (a teszt
  ellenőrzi).
- Tizedes válaszoknál a magyar fájlban is mindkét alakot felsoroljuk (`= 0,5` és `= 0.5`); negatív
  számnál a sima kötőjelet és a mínuszjelet is (`= -2` és `= −2`).
- A számolós feladatok (egyensúly, rugalmasság, költségek, kamatos kamat, multiplikátor, GDP, ráták,
  árfolyam, LTV) eredményét Pythonnal ellenőriztük. Ha egy példát módosítasz, a leckében és a gyakorló
  leckében is igazítsd hozzá.

## Képletek, ábrák, kód

- Képletek KaTeX-szel (`$…$`, `$$…$$`), lásd `../matematika/README.md`.
- Interaktív ábrák ` ```plot ` blokkban (termelési lehetőségek határa, kereslet-kínálat és egyensúly,
  költséggörbék, kamatos kamat, Phillips-görbe, növekedés, termelési függvény, Lorenz-görbe). A magyar és
  az angol ábra csak a címben és a feliratokban különbözhet (a teszt ellenőrzi).
- Két ` ```python run ` példa (kamatos kamat, előfizetéses egységgazdaságtan) – a
  `tests/python-examples.test.ts` lefuttatja őket.
- Diagramok ` ```text ` blokkban.

## Időszerű adatok

A magyar adatok (adókulcsok, inflációs cél, betétbiztosítási határ, euróövezet tagjai, MNB-kamatcsúcs,
munkanélküliségi ráta, uniós szabályozások) 2026 novemberi állapotot tükröznek. Változás esetén főleg az 5.,
a 6., a 7., a 9. és a 12. témakört kell frissíteni.
