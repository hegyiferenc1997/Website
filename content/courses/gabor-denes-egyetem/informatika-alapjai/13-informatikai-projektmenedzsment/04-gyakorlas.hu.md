---
title: Gyakorlás – informatikai projektmenedzsment
summary: Ellenőrző kérdések és összefoglaló feladatlap a projektháromszögről, a tervezésről és az agilis módszerekről.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. A megrendelő két héttel a határidő előtt három új funkciót kér, de a határidő és a költségvetés marad. Mit javasolsz?</summary>

A projektháromszög szerint ez csak a minőség rovására menne. Javaslat: rangsoroljátok a funkciókat; ami most kell, az kerüljön be egy kevésbé fontos helyett, a többi egy következő kiadásba – vagy egyeztessetek több időről vagy erőforrásról.

</details>

<details>
<summary>2. Mi a különbség a sprint-áttekintés és a visszatekintés között?</summary>

Az áttekintés a **termékről** szól: bemutatják az elkészült inkrementumot, és visszajelzést kérnek. A visszatekintés a **csapat munkájáról**: mi ment jól, min változtassanak.

</details>

<details>
<summary>3. Egy feladat 3 hét, és nincs a kritikus úton, 2 hét tartalékideje van. Mi történik, ha 1 hetet késik?</summary>

Semmi a projekt végére nézve: a tartalékidőn belül marad. (De utána már csak 1 hét tartaléka van.)

</details>

```python run
# Kockázati mátrix rangsorolása
kockazatok = [
    ("kulcsfejlesztő kiesik", 2, 5),
    ("külső API változik", 3, 3),
    ("késő visszajelzés", 4, 2),
    ("szerverhiba az átadáskor", 1, 4),
]
for nev, val, hatas in sorted(kockazatok, key=lambda k: k[1] * k[2], reverse=True):
    print(f"{val * hatas:2d}  {nev}")
```

## Összefoglaló feladatlap

```quiz required
? Mi **nem** jellemzője egy projektnek?
- egyszeri
- meghatározott céllal
- kezdő- és végponttal
+ folyamatos, végtelen működés
! A folyamatos működés nem projekt.

? Hogy hívják azt a diagramot, amely idővonalon mutatja a feladatokat és sorrendjüket?
= Gantt
= Gantt-diagram
! Henry Gantt nevéből.

? Mekkora a fenti listában a legnagyobb kockázati pontszám?
= 10
! 2 × 5 a kulcsfejlesztő kiesésénél.

? Melyik Scrum-esemény célja a csapat munkamódszerének javítása?
- sprinttervezés
- napi scrum
- sprint-áttekintés
+ visszatekintés
! Retrospective.

? Melyik kockázati válasz az, ha biztosítást kötsz?
- elkerülés
- csökkentés
+ áthárítás
- elfogadás
! A kár egy részét más viseli.

? Mit korlátoz a WIP-limit a Kanbanban?
+ hány feladat lehet egyszerre egy oszlopban
- a sprint hosszát
- a csapat létszámát
- a költségvetést
! Work In Progress.
```
