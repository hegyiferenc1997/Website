---
title: Függvénymegadás – SOP, POS, mintermek és maxtermek
summary: Az igazságtáblából kanonikus diszjunktív (SOP) és konjunktív (POS) alak; minterm, maxterm, Σm és ΠM jelölés.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **kombinációs hálózat** tervezésének menete,
- mi a **minterm** és a **maxterm**,
- hogyan írod fel az igazságtáblából a **kanonikus SOP** (diszjunktív) és **POS** (konjunktív) alakot,
- a rövid **Σm** és **ΠM** jelölést.

## A tervezés menete

A **kombinációs hálózat** kimenetei kizárólag a bemenetek pillanatnyi értékétől függenek. Tervezése:

1. **Szöveges feladat** → bemenetek és kimenetek kijelölése.
2. **Igazságtábla** felírása.
3. **Logikai függvény** felírása az igazságtáblából (SOP vagy POS alak).
4. **Egyszerűsítés** (algebrailag vagy Karnaugh-táblával).
5. **Kapcsolási rajz**, megvalósítás (kapukkal, NAND–NAND alakban, FPGA-n …).

## Minterm és maxterm

Vegyünk egy háromváltozós függvényt (A, B, C). Az igazságtábla minden sorához tartozik:

- egy **minterm** (m<sub>i</sub>): olyan ÉS-tag, amely **pontosan abban az egy sorban 1**. A sor 1-es bitjei ponáltan, 0-s bitjei negáltan szerepelnek.
- egy **maxterm** (M<sub>i</sub>): olyan VAGY-tag, amely **pontosan abban az egy sorban 0**. Itt fordítva: a 0-s bitek ponáltan, az 1-es bitek negáltan.

| sor (i) | A B C | minterm m<sub>i</sub> | maxterm M<sub>i</sub> |
| ------- | ----- | --------------------- | --------------------- |
| 0       | 0 0 0 | A̅·B̅·C̅                 | A + B + C             |
| 1       | 0 0 1 | A̅·B̅·C                 | A + B + C̅             |
| 2       | 0 1 0 | A̅·B·C̅                 | A + B̅ + C             |
| 3       | 0 1 1 | A̅·B·C                 | A + B̅ + C̅             |
| 4       | 1 0 0 | A·B̅·C̅                 | A̅ + B + C             |
| 5       | 1 0 1 | A·B̅·C                 | A̅ + B + C̅             |
| 6       | 1 1 0 | A·B·C̅                 | A̅ + B̅ + C             |
| 7       | 1 1 1 | A·B·C                 | A̅ + B̅ + C̅             |

Megfigyelés: M<sub>i</sub> = (m<sub>i</sub>)̅ (De Morgan).

## SOP – szorzatok összege (diszjunktív normálalak)

A függvény a **kimenet 1-es soraihoz tartozó mintermek VAGY-kapcsolata**.

**Példa** – egy háromfős szavazógép (többség): Y = 1, ha legalább két bemenet 1.

| sor | A B C | Y   |
| --- | ----- | --- |
| 0   | 0 0 0 | 0   |
| 1   | 0 0 1 | 0   |
| 2   | 0 1 0 | 0   |
| 3   | 0 1 1 | 1   |
| 4   | 1 0 0 | 0   |
| 5   | 1 0 1 | 1   |
| 6   | 1 1 0 | 1   |
| 7   | 1 1 1 | 1   |

**Kanonikus SOP:** Y = A̅BC + AB̅C + ABC̅ + ABC
**Rövid jelölés:** Y = **Σm(3, 5, 6, 7)**

A **kanonikus** (szabályos) alakban **minden tagban minden változó** szerepel, ponáltan vagy negáltan. Egyszerűsítés után: Y = AB + AC + BC.

## POS – összegek szorzata (konjunktív normálalak)

A függvény a **kimenet 0-s soraihoz tartozó maxtermek ÉS-kapcsolata**.

Ugyanerre a táblára: Y = (A + B + C)(A + B + C̅)(A + B̅ + C)(A̅ + B + C)
**Rövid jelölés:** Y = **ΠM(0, 1, 2, 4)**

A Σm és a ΠM **kiegészítik egymást**: ami nincs a Σm listában, az a ΠM listában van (és fordítva).

## Melyiket válaszd?

- Ha kevés az **1-es** sor → SOP rövidebb.
- Ha kevés a **0-s** sor → POS rövidebb.
- SOP → ÉS–VAGY → **NAND–NAND**; POS → VAGY–ÉS → **NOR–NOR** megvalósítás.

```python run
# Mintermek és maxtermek listája egy függvényből
from itertools import product

def tobbseg(a, b, c):
    return int(a + b + c >= 2)

mintermek, maxtermek = [], []
for i, (a, b, c) in enumerate(product((0, 1), repeat=3)):
    (mintermek if tobbseg(a, b, c) else maxtermek).append(i)
print("Y = Σm", tuple(mintermek))
print("Y = ΠM", tuple(maxtermek))
```

## Összefoglalás

- Minterm: ÉS-tag, egy sorban 1; maxterm: VAGY-tag, egy sorban 0.
- SOP = az 1-es sorok mintermjeinek összege, Σm(…); POS = a 0-s sorok maxtermjeinek szorzata, ΠM(…).
- A két lista kiegészíti egymást.

## A lecke feladata

```quiz required
? Mi a 6-os sorhoz tartozó minterm háromváltozós (A, B, C) függvénynél? Írd fel kifejezésként!
expr: A, B, C -> A·B·C'
! 6 = 110: A = 1, B = 1, C = 0.

? Mi az 5-ös sorhoz tartozó maxterm (A, B, C)? Írd fel kifejezésként!
expr: A, B, C -> A' + B + C'
! 5 = 101; a maxtermben az 1-es bitek negáltan szerepelnek.

? Töltsd ki: F = Σm(1, 2, 4, 7)
table: A, B, C -> F = A'B'C + A'BC' + AB'C' + ABC
! Az 1, 2, 4, 7 sorszámú sorokban 1 a kimenet.

? Egy háromváltozós függvény F = Σm(0, 3, 5, 6). Hogyan szól ugyanez ΠM alakban? (Add meg a sorszámokat vesszővel, növekvő sorrendben!)
= 1, 2, 4, 7
= 1,2,4,7
! Ami nincs a Σm listában, az a ΠM listában van.

? Írd fel a kanonikus SOP alakot, majd egyszerűsítsd: F = Σm(2, 3, 6, 7)
expr: A, B, C -> B
limit: 1
same: A'BC' + A'BC + ABC' + ABC
! Mind a négy sorban B = 1.
```
