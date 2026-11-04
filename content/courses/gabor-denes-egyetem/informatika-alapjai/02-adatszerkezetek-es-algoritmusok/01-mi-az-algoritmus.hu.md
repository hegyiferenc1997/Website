---
title: Mi az algoritmus?
summary: Az algoritmus tulajdonságai, leírása pszeudokóddal és folyamatábrával, a három vezérlési szerkezet.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **algoritmus**, és milyen tulajdonságai vannak,
- hogyan írható le **pszeudokóddal** és **folyamatábrával**,
- mi a három alapvető **vezérlési szerkezet**.

## Definíció

Az **algoritmus** egy feladat megoldásának **véges számú, egyértelmű lépésből álló** leírása. A recept, a bútor összeszerelési útmutatója vagy a GPS útvonaltervezése mind algoritmus.

Egy jó algoritmus:

- **véges**: egyszer véget ér,
- **egyértelmű**: minden lépés pontosan meghatározott,
- van **bemenete** és **kimenete**,
- **elvégezhető**: minden lépése ténylegesen végrehajtható,
- **általános**: nem csak egy konkrét esetre, hanem a feladat egész osztályára működik.

## Leírás pszeudokóddal

A **pszeudokód** a programnyelvhez hasonló, de kötetlen leírás. Például a legnagyobb elem megkeresése egy listában:

```text
legnagyobb(lista):
    max ← lista első eleme
    minden x elemre a listában:
        ha x > max, akkor max ← x
    vissza: max
```

## Leírás folyamatábrával

A **folyamatábra** rajzban mutatja ugyanezt: ovális = start/stop, téglalap = művelet, rombusz = döntés, paralelogramma = be- vagy kivitel.

```text
   ( START )
       │
  /  lista  /          ← bemenet
       │
 [ max ← első elem ]
       │
  ◇ van még elem? ──nem──► / max / ──► ( STOP )
       │ igen
  ◇ x > max? ──nem──┐
       │ igen       │
 [ max ← x ]        │
       └────────────┴──► vissza a „van még elem?” kérdéshez
```

## A három vezérlési szerkezet

Bármely algoritmus felépíthető háromféle szerkezetből (Böhm–Jacopini-tétel):

| Szerkezet      | Jelentése                       | Példa                          |
| -------------- | ------------------------------- | ------------------------------ |
| **szekvencia** | lépések egymás után             | „olvasd be, add össze, írd ki” |
| **elágazás**   | feltételtől függő lépés         | „ha esik, vigyél esernyőt”     |
| **ciklus**     | ismétlés, amíg egy feltétel áll | „amíg van elem, nézd meg”      |

```python run
# A legnagyobb elem keresése: szekvencia, ciklus és elágazás egyben
lista = [7, 3, 12, 5]
legnagyobb = lista[0]
for x in lista:
    if x > legnagyobb:
        legnagyobb = x
print(legnagyobb)
```

## Összefoglalás

- Algoritmus = véges, egyértelmű lépéssorozat egy feladatosztály megoldására.
- Leírható szövegesen, pszeudokóddal, folyamatábrával vagy programkóddal.
- Építőkövei: szekvencia, elágazás, ciklus.

## A lecke feladata

```quiz required
? Melyik NEM elvárt tulajdonsága egy algoritmusnak?
- véges
- egyértelmű
+ minél hosszabb
- elvégezhető
! A hossz nem követelmény, a végesség igen.

? Milyen alakzat jelöli a folyamatábrán a **döntést**?
- ovális
- téglalap
+ rombusz
- paralelogramma
! A rombuszból igen és nem ág indul.

? Melyik vezérlési szerkezet írja le az ismétlést?
= ciklus
! Szekvencia, elágazás, ciklus.

? Mit ad vissza a lecke `legnagyobb` algoritmusa a `[4, 9, 2, 9, 1]` listára?
= 9
! A 9 a legnagyobb elem.
```
