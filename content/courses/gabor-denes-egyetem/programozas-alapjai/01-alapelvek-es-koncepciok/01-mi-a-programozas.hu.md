---
title: A programozás fogalma és jelentősége
summary: Mit jelent programozni, mire jó, és mi történik a gépben, amikor egy program fut.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- mit jelent a **program** és a **programozás**,
- miért kell egy gépnek minden lépést pontosan leírni,
- hol találkozol programokkal a mindennapokban és a mérnöki munkában.

## Mi a program?

A számítógép önmagában nem „okos”: csak nagyon egyszerű utasításokat tud végrehajtani (számokat összead, összehasonlít, adatot mozgat a memóriában), viszont ezeket másodpercenként milliárdszor. A **program** utasítások pontos sorozata, amely megmondja a gépnek, milyen lépésekben oldjon meg egy feladatot.

A **programozás** az a folyamat, amelynek során:

1. megértünk egy problémát,
2. kitaláljuk a megoldás lépéseit (ez az **algoritmus**),
3. a lépéseket leírjuk egy **programozási nyelven** (ez a **forráskód**),
4. kipróbáljuk, teszteljük és javítjuk.

> **Fontos:** a programozás nagyobb része gondolkodás és tervezés, nem gépelés. A jó programozó először megérti a feladatot, és csak utána kezd kódolni.

## Egy példa a hétköznapokból

Képzeld el, hogy egy robotnak kell elmagyaráznod, hogyan főzzön teát. Az „főzz teát” utasítás neki semmit nem mond. Le kell bontanod:

1. Tölts vizet a vízforralóba.
2. Kapcsold be a vízforralót.
3. Várj, amíg a víz felforr.
4. Tegyél egy filtert a bögrébe.
5. Öntsd a forró vizet a bögrébe.
6. Várj 3 percet, majd vedd ki a filtert.

Ez már majdnem program: pontos, sorrendben követhető lépések. A számítógépnek ugyanilyen részletesen kell mindent leírni.

## Az első Python sor

```python run
# A print() kiírja a képernyőre, amit a zárójelben kap.
print("Helló, világ!")
print("2 + 3 =", 2 + 3)
```

A gép a sorokat **fentről lefelé, egymás után** hajtja végre. Ez a **szekvencia**, a programok legalapvetőbb építőköve.

## Miért fontos a programozás?

- **Automatizálás:** ami ismétlődő, azt a gép gyorsabban és hiba nélkül elvégzi (pl. 10 000 számla kiállítása).
- **Pontos számítások:** mérnöki szimulációk, statisztikák, banki rendszerek.
- **Irányítás:** autók, repülők, orvosi eszközök, robotok vezérlése.
- **Kommunikáció és szórakozás:** weboldalak, mobilappok, játékok.
- **Mérnökinformatikusként** a programozás az alapnyelved: minden későbbi tárgy (adatbázisok, hálózatok, beágyazott rendszerek) erre épül.

## A program részei általában

| Rész             | Jelentés                 | Példa                              |
| ---------------- | ------------------------ | ---------------------------------- |
| Bemenet (input)  | adat, amit a program kap | a felhasználó beír egy számot      |
| Feldolgozás      | a számítás, döntések     | összeadás, összehasonlítás         |
| Kimenet (output) | az eredmény              | kiírás a képernyőre, fájlba mentés |

```python run
# Bemenet → feldolgozás → kimenet egy kis példán.
ar = 1200          # bemenet: egy termék ára forintban
darab = 3          # bemenet: hány darabot veszünk
fizetendo = ar * darab   # feldolgozás
print("Fizetendő:", fizetendo, "Ft")   # kimenet
```

## Összefoglalás

- A **program** pontos utasítássorozat, a **programozás** a probléma megértésétől a tesztelésig tart.
- A gép csak egyszerű lépéseket tud, ezért mindent részletesen le kell írni.
- A legtöbb program szerkezete: **bemenet → feldolgozás → kimenet**.
