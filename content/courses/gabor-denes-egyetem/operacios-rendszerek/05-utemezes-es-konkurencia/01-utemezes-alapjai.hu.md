---
title: Az ütemezés alapjai
summary: CPU- és I/O-löketek, az ütemező feladata, a megszakítható és nem megszakítható ütemezés, és a mérőszámok.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **CPU-löket** és az **I/O-löket**, és miért ezek váltakozása adja az ütemezés értelmét,
- mi a különbség a **megszakítható** (preemptív) és a **nem megszakítható** ütemezés között,
- melyek az ütemezés **mérőszámai**: kihasználtság, átbocsátás, körülfordulási, várakozási és válaszidő.

## Löketek

Egy folyamat élete **CPU-löketek** (számol) és **I/O-löketek** (lemezre, hálózatra, felhasználóra vár) váltakozása:

```text
[ CPU 5 ms ] → [ lemezolvasás 8 ms ] → [ CPU 3 ms ] → [ billentyűre vár … ] → [ CPU 1 ms ] → vége
```

- **CPU-igényes** folyamat: hosszú CPU-löketek (pl. videókódolás, tömörítés).
- **I/O-igényes** folyamat: rövid CPU-löketek, sok várakozás (pl. szövegszerkesztő, böngésző).

Amíg egy folyamat I/O-ra vár, a processzor **másnak** dolgozhat – ezt teszi lehetővé az ütemező.

## Az ütemező és a diszpécser

- A **rövid távú ütemező** (_CPU scheduler_) a **kész sorból** kiválasztja, melyik folyamat (szál) fusson következőként. Másodpercenként sokszor fut, ezért gyorsnak kell lennie.
- A **diszpécser** (_dispatcher_) végrehajtja a döntést: **környezetváltás** (elmenti a régi folyamat regisztereit a PCB-jébe, betölti az újét), felhasználói módba vált, és odaugrik, ahol az új folyamat abbahagyta.

### Mikor dönt az ütemező?

1. a futó folyamat **várakozni** kezd (I/O),
2. a futó folyamat **befejeződik**,
3. lejár az **időszelete** (időzítő megszakítás),
4. egy várakozó folyamat **kész** lesz (pl. befejeződött az I/O-ja).

- **Nem megszakítható** (_non-preemptive_, kooperatív): csak az 1–2. esetben vált – a folyamat addig fut, amíg önként le nem mond a CPU-ról.
- **Megszakítható** (_preemptive_): a 3–4. esetben is **elveheti** a CPU-t. Minden mai asztali és szerver OS így működik.

## Mérőszámok

| Mérőszám                              | Jelentés                                      | Cél  |
| ------------------------------------- | --------------------------------------------- | ---- |
| **CPU-kihasználtság**                 | az idő hány százalékában dolgozik a CPU       | max. |
| **átbocsátóképesség** (_throughput_)  | időegység alatt befejezett folyamatok száma   | max. |
| **körülfordulási idő** (_turnaround_) | a beérkezéstől a befejeződésig eltelt idő     | min. |
| **várakozási idő** (_waiting_)        | a kész sorban töltött idő összesen            | min. |
| **válaszidő** (_response_)            | a beérkezéstől az **első** futásig eltelt idő | min. |

Két hasznos képlet (ha a folyamat nem végez I/O-t):

- **körülfordulási idő = befejezés − beérkezés**
- **várakozási idő = körülfordulási idő − CPU-löket**

Példa: egy folyamat a 2. ms-ban érkezik, 5 ms CPU-t igényel, és a 12. ms-ban fejeződik be. Körülfordulási ideje 12 − 2 = **10 ms**, várakozási ideje 10 − 5 = **5 ms**.

## Összefoglalás

- A folyamatok CPU- és I/O-löketeket váltogatnak; az I/O alatt a CPU mást futtathat.
- Az ütemező választ a kész sorból, a diszpécser végzi a környezetváltást.
- Preemptív ütemezésnél az OS elveheti a CPU-t (időszelet lejárta), nem preemptívnél nem.
- Körülfordulási idő = befejezés − beérkezés; várakozási idő = körülfordulási idő − löket.

## A lecke feladata

```quiz required
? Melyik ütemezési fajtánál veheti el az OS a CPU-t a futó folyamattól, például az időszelet lejártakor?
+ megszakítható (preemptív)
- nem megszakítható (kooperatív)
- kötegelt
- statikus
! Minden mai asztali OS preemptív.

? Egy folyamat a 0. ms-ban érkezik, és a 9. ms-ban fejeződik be. Mennyi a körülfordulási ideje (ms)?
= 9
! Befejezés − beérkezés = 9 − 0.

? Egy folyamat körülfordulási ideje 14 ms, CPU-lökete 6 ms (I/O nincs). Mennyi a várakozási ideje (ms)?
= 8
! 14 − 6 = 8.

? Melyik mérőszám az időegység alatt befejezett folyamatok száma?
- válaszidő
+ átbocsátóképesség (throughput)
- várakozási idő
- CPU-kihasználtság
! Pl. 30 folyamat percenként.

? Mi a diszpécser feladata?
- Kiválasztani a következő folyamatot.
+ Végrehajtani a környezetváltást, és elindítani a kiválasztott folyamatot.
- Fájlokat törölni.
- A memóriát lapokra osztani.
! A döntést az ütemező hozza, a diszpécser hajtja végre.
```
