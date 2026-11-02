---
title: Gyakorlás – logikai kapuk és Boole-algebra
summary: Ellenőrző kérdések és összefoglaló feladatlap: igazságtáblák, De Morgan, algebrai egyszerűsítés, univerzális kapuk, logikai családok.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért van két változóra pontosan 16 logikai függvény?</summary>

Mert a 4 bemeneti kombináció mindegyikéhez 0 vagy 1 tartozhat, így 2<sup>4</sup> = 16 különböző kimeneti oszlop létezik.

</details>

<details>
<summary>2. Mikor hamis az A → B implikáció, és mi a kifejezése?</summary>

Csak akkor, ha A = 1 és B = 0. Kifejezése: A̅ + B.

</details>

<details>
<summary>3. Mi a különbség egy kifejezés duálisa és negáltja között?</summary>

A duálisban a · és + jeleket és a 0, 1 konstansokat cseréljük, a változókhoz nem nyúlunk. A negáltban (De Morgan) ezen felül minden változót is negálunk. Pl. A + B duálisa A·B, negáltja A̅·B̅.

</details>

<details>
<summary>4. Miért felesleges a BC tag az AB + A̅C + BC kifejezésben?</summary>

Mert ha B = C = 1, akkor A = 1 esetén az AB, A = 0 esetén az A̅C tag már 1, így a BC tag soha nem változtat a kimeneten (konszenzus).

</details>

<details>
<summary>5. Hogyan lesz egy ÉS–VAGY hálózatból NAND–NAND hálózat?</summary>

Minden kaput NAND-ra cserélünk, a bekötés változatlan marad (kettős negálás + De Morgan). Egy közvetlenül a VAGY kapura menő változót negálva kell bekötni.

</details>

<details>
<summary>6. Miért nem szabad két totem-pole kimenetet összekötni?</summary>

Mert ha az egyik 1-et, a másik 0-t hajt, a két kimeneti tranzisztoron át rövidzár alakul ki a táp és a föld között, ami tönkreteheti az IC-ket.

</details>

## Összefoglaló feladatlap

```quiz required
? Töltsd ki: Y = (A ⊕ B)·C és Z = A·B + C
table: A, B, C -> Y = (A⊕B)·C; Z = A·B + C
! Számold ki soronként előbb A ⊕ B-t és A·B-t.

? Egyszerűsítsd: F = A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
expr: A, B, C -> C'
limit: 1
same: A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
! Emeld ki C̅-t.

? Egyszerűsítsd: F = A'·B + A·B' + A·B
expr: A, B -> A + B
limit: 2
same: A'·B + A·B' + A·B
! Az A·B tagot kétszer is felhasználhatod.

? Egyszerűsítsd: F = A·B + B·C + B'·C
expr: A, B, C -> A·B + C
limit: 3
same: A·B + B·C + B'·C
! B·C + B̅·C = C.

? Egyszerűsítsd: F = X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
expr: X, Y, Z -> X·Y + X·Z + Y·Z
limit: 6
same: X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
! Az XYZ tagot mindhárom szomszédjával összevonhatod.

? Alakítsd át úgy, hogy negálás csak a változókon legyen: ((A + B)'·C)'
expr: A, B, C -> A + B + C'
same: ((A + B)'·C)'
! Törd meg a vonalat kétszer.

? Hány kétbemenetű NOR kapu kell egy NAND kapu megépítéséhez?
= 4
! ÉS = 3 NOR, utána még egy NOR-inverter.

? Melyik logikai család fogyaszt nyugalomban szinte semmit?
- TTL
+ CMOS
- mindkettő ugyanannyit
! A komplementer tranzisztorpár közül nyugalomban mindig az egyik zárva van.

? Az A ⊙ B (XNOR) melyik alakja helyes?
- A·B' + A'·B
+ A·B + A'·B'
- (A + B)·(A' + B')
- A' + B
! XNOR: akkor 1, ha a két bemenet egyezik.
```
