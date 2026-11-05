---
title: Incidens- és válságkommunikáció
summary: Mi a teendő, amikor leáll a szolgáltatás: belső koordináció, állapotjelzés a felhasználóknak, a jó incidensüzenet, és a hibáztatásmentes utólagos elemzés.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan kommunikál a csapat **belül** egy incidens alatt,
- hogyan tájékoztasd a **felhasználókat**,
- milyen egy jó **incidensüzenet**,
- mi a **hibáztatásmentes utólagos elemzés** (postmortem).

## Mi az incidens?

**Incidens**: egy nem tervezett esemény, amely rontja vagy megszakítja a szolgáltatást – leáll a weboldal, nem működik a fizetés, adatszivárgás gyanúja merül fel. Ilyenkor a kommunikáció legalább annyira fontos, mint a technikai javítás.

## Belső kommunikáció

- Legyen egy **incidensfelelős** (incident commander), aki koordinál – nem feltétlenül ő javít.
- Egy **közös csatorna** az incidensnek (pl. egy külön chatcsatorna), hogy az információ ne szóródjon szét.
- Rendszeres, rövid **állapotfrissítés**: mit tudunk, mit csinálunk, mi a következő lépés.
- Az idővonalat **jegyzeteljék** (mikor mi történt) – az utólagos elemzéshez kell.

## Kommunikáció a felhasználók felé

Az emberek a bizonytalanságot rosszabbul viselik, mint a rossz hírt. Ezért:

- **Korán** jelezd, hogy tudtok a problémáról – akkor is, ha még nem tudjátok az okát.
- **Rendszeresen** frissíts (pl. 30 percenként), akkor is, ha nincs új hír („még dolgozunk rajta”).
- Használj **állapotoldalt** (status page), ahol a felhasználók maguk is ellenőrizhetik a helyzetet.
- Légy **őszinte** és **konkrét**, ne bagatellizálj, és ne találgass.
- A végén jelezd a **megoldást**, és ha kell, kérj **bocsánatot**.

## A jó incidensüzenet

```text
[Vizsgálat alatt] 10:42
Tudunk róla, hogy egyes felhasználók nem tudnak bejelentkezni a mobilalkalmazásba.
A webes felület működik. Vizsgáljuk az okát; legközelebb 11:15-kor frissítünk.

[Azonosítva] 11:10
Az okot azonosítottuk: egy ma reggeli frissítés hibát okozott a bejelentkezési
szolgáltatásban. Visszaállítjuk az előző verziót.

[Megoldva] 11:35
A bejelentkezés 11:28 óta ismét működik. Elnézést kérünk a kellemetlenségért.
Néhány napon belül közzétesszük az utólagos elemzést.
```

Elemei: **mi** a hatás (kit érint), **mit** tudunk, **mit** teszünk, **mikor** jön a következő frissítés.

## Hibáztatásmentes utólagos elemzés

Az incidens után a csapat írásban elemzi, mi történt – **nem a bűnöst keresi**, hanem azt, hogy a **rendszer és a folyamat** hogyan tette lehetővé a hibát (lásd „5 miért”, 3. témakör, és pszichológiai biztonság, 11. témakör).

Miért hibáztatásmentes? Ha az emberek félnek a büntetéstől, eltitkolják a hibákat, és a szervezet nem tanul belőlük.

Egy tipikus szerkezet:

1. **Összefoglaló** – mi történt, mennyi ideig, kit érintett.
2. **Idővonal** – mikor mit vettek észre, mit csináltak.
3. **Kiváltó ok és közreható tényezők**.
4. **Mi ment jól** (pl. gyors észlelés) és **mi nem**.
5. **Teendők** – felelőssel és határidővel (pl. automatikus teszt a bejelentkezésre, fokozatos kiadás).

## Összefoglalás

- Incidensnél egy koordinátor, egy közös csatorna, rendszeres állapotfrissítés és idővonal.
- A felhasználók felé: korán, rendszeresen, őszintén, konkrétan; állapotoldal.
- Jó incidensüzenet: hatás, amit tudunk, amit teszünk, mikor jön a következő frissítés.
- Utólagos elemzés: hibáztatásmentes, a rendszert és a folyamatot vizsgálja, teendőkkel zárul.

## A lecke feladata

```quiz required
? Mikor érdemes először tájékoztatni a felhasználókat egy leállásról?
- csak ha már megvan a megoldás
+ minél korábban, akkor is, ha még nem ismert az ok
- soha, hátha nem veszik észre
- egy héttel később, egy hírlevélben
! A bizonytalanság rosszabb a rossz hírnél.

? Mi **nem** része egy jó incidensüzenetnek?
- kit érint a probléma
- mit teszünk
- mikor jön a következő frissítés
+ annak a fejlesztőnek a neve, aki a hibát okozta
! Tények, nem bűnbak.

? Mi a hibáztatásmentes utólagos elemzés fő célja?
- megtalálni és megbüntetni a hibást
+ megérteni, hogyan tette lehetővé a rendszer és a folyamat a hibát, és megelőzni az ismétlődést
- eltitkolni a hibát a vezetőség elől
- minél hosszabb dokumentumot írni
! Ha félnek, eltitkolják a hibákat.

? A leállás 10:42-kor kezdődött, és 11:28-kor szűnt meg. Hány percig tartott?
= 46
! 11:28 − 10:42 = 46 perc.
```
