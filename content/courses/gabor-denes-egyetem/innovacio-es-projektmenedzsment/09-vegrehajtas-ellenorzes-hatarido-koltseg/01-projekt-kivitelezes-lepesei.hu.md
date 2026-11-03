---
title: A projekt kivitelezésének lépései
summary: Hogyan megy a terv a valóságba? Alapterv, munkaengedélyezés, státuszmegbeszélés és RAG-jelentés, probléma és kockázat különbsége, eltéréskezelés és integrált változáskezelés.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi az **alapterv** (baseline), és miért kell „befagyasztani”,
- hogyan **követed** a munkát (státuszmegbeszélés, RAG-jelentés),
- mi a különbség a **probléma** és a **kockázat** között,
- hogyan kezeld az **eltéréseket** és a **változásokat**.

## Az alapterv (baseline)

A tervezés végén a jóváhagyott **terjedelem-, ütem- és költségtervet** **alaptervként** rögzítjük. Ehhez mérjük a valós teljesítést. Az alaptervet csak **jóváhagyott változáskéréssel** szabad módosítani – különben nem tudnánk, mihez képest késünk.

## A kivitelezés ciklusa

```text
 alapterv → munkaengedélyezés → végrehajtás → mérés (tény)
     ▲                                          │
     └── beavatkozás / változáskérés ◄── terv–tény összevetés
```

1. **Munkaengedélyezés** – a munkacsomagokat hivatalosan kiadjuk a felelősnek (ki, mit, mikorra, milyen keretből).
2. **Végrehajtás** – a csapat dolgozik, a PM elhárítja az akadályokat, koordinál.
3. **Mérés** – a tényleges előrehaladás, idő- és költségfelhasználás összegyűjtése.
4. **Összevetés** – terv vs. tény (eltérések: határidő, költség, minőség, terjedelem).
5. **Beavatkozás** – korrekciós intézkedés vagy változáskérés.

## Státuszmegbeszélés és státuszjelentés

- **Státuszmegbeszélés**: rendszeres (pl. heti), rövid, napirend szerint: mi készült el, mi következik, milyen akadályok és kockázatok vannak.
- **Státuszjelentés**: a szponzornak és a vezetésnek szól, egy oldalon. Gyakran **RAG**-színkóddal (_Red–Amber–Green_):

| Szín                     | Jelentés                                            |
| ------------------------ | --------------------------------------------------- |
| 🟢 **zöld**              | terv szerint halad                                  |
| 🟡 **sárga** (borostyán) | kisebb eltérés, a csapat kezeli, figyelni kell      |
| 🔴 **piros**             | jelentős eltérés, vezetői döntés vagy segítség kell |

> A „görögdinnye-projekt”: kívül zöld, belül piros – a jelentés szépíti a valóságot. A jó PM korán szól a bajról.

## Probléma vagy kockázat?

| Kockázat (_risk_)                 | Probléma (_issue_)                          |
| --------------------------------- | ------------------------------------------- |
| **még nem** következett be        | **már** bekövetkezett                       |
| valószínűsége < 100%              | 100%, kezelni kell                          |
| kockázatnyilvántartásban vezetjük | **problémanaplóban** (_issue log_) vezetjük |
| pl. „a kulcsfejlesztő kiléphet”   | pl. „a kulcsfejlesztő felmondott”           |

A problémanapló tartalma: leírás, hatás, felelős, határidő, állapot.

## Eltérések kezelése

Ha a tény eltér a tervtől:

- **korrekciós intézkedés** – visszahozzuk a projektet a tervre (pl. túlóra, erőforrás-átcsoportosítás),
- **megelőző intézkedés** – hogy a jövőben ne forduljon elő,
- **hibajavítás** – egy hibás eredmény kijavítása,
- **változáskérés** – ha a terven kell módosítani.

## Integrált változáskezelés

Minden változáskérés **egy helyen**, egységes folyamatban fut:

1. a változáskérés **rögzítése** (ki, mit, miért),
2. **hatáselemzés** – terjedelem, idő, költség, minőség, kockázat,
3. **döntés** – a **változásbizottság** (CCB, _Change Control Board_) vagy a szponzor jóváhagyja / elutasítja,
4. jóváhagyás esetén az **alapterv frissítése**, a csapat tájékoztatása,
5. a megvalósítás követése.

A változáskezelést a 14. témakörben részletezzük.

## Összefoglalás

- Az alapterv a jóváhagyott terv; csak jóváhagyott változással módosítható.
- Ciklus: munkaengedélyezés → végrehajtás → mérés → összevetés → beavatkozás.
- RAG-státusz: zöld / sárga / piros.
- Kockázat: még nem történt meg; probléma: már megtörtént (problémanapló).
- Integrált változáskezelés: rögzítés, hatáselemzés, döntés (CCB), alapterv frissítése.

## A lecke feladata

```quiz required
? Mi az **alapterv** (baseline)?
+ a jóváhagyott terjedelem-, ütem- és költségterv, amelyhez a tényt mérjük
- az első piszkozat, amit bármikor módosíthatunk
- a projekt utolsó státuszjelentése
- a csapattagok listája
! Csak jóváhagyott változáskéréssel módosítható.

? „A felhőszolgáltató bejelentette, hogy holnaptól 30%-kal emeli az árait.” Kockázat vagy probléma?
- kockázat
+ probléma
! Már bekövetkezett, kezelni kell → problémanapló.

? Mit jelent a **piros** RAG-státusz?
- terv szerint halad
- kisebb eltérés, a csapat kezeli
+ jelentős eltérés, vezetői döntés vagy segítség kell
- a projekt lezárult
! Red–Amber–Green.

? Ki dönt jellemzően egy nagyobb változáskérésről?
- bármelyik fejlesztő
+ a változásbizottság (CCB) vagy a szponzor
- a megrendelő ügyfélszolgálata
- senki, automatikusan elfogadjuk
! Change Control Board.

? Melyik a változáskezelés **második** lépése a rögzítés után?
- az alapterv frissítése
+ hatáselemzés
- a csapat tájékoztatása
- a megvalósítás
! Előbb meg kell érteni, mire hat a változás.
```
