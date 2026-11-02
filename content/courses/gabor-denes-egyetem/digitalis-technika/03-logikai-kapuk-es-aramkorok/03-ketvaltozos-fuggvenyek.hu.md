---
title: A 16 kétváltozós logikai függvény
summary: Mind a 16 lehetséges kétváltozós függvény: null- és egységfüggvény, konjunkció, diszjunkció, inhibíció, implikáció, antivalencia, ekvivalencia.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miért van pontosan **16** kétváltozós logikai függvény,
- mindegyik **nevét**, **kifejezését** és egy **hétköznapi példát**,
- az **implikáció** és az **inhibíció** szerepét.

## Hány függvény van?

Két bemenetnek 2<sup>2</sup> = 4 kombinációja van (00, 01, 10, 11). Mind a 4 sorba 0-t vagy 1-et írhatunk, így **2<sup>4</sup> = 16** különböző kimeneti oszlop – azaz 16 különböző függvény – létezik. Általában *n* változóra **2<sup>2<sup>n</sup></sup>** függvény van (3 változóra már 256).

## A teljes lista

A kimeneti oszlop az AB = 00, 01, 10, 11 sorok értékeit mutatja, ebben a sorrendben.

| Kimenet (00 01 10 11) | Kifejezés     | Név                                 | Példa                                                        |
| --------------------- | ------------- | ----------------------------------- | ------------------------------------------------------------ |
| 0 0 0 0               | 0             | **nullfüggvény**                    | mindig hamis, a bemenetektől függetlenül                     |
| 0 0 0 1               | A · B         | **konjunkció** (ÉS)                 | *kirándulni megyek, ha süt a nap és szabadnapos vagyok*      |
| 0 0 1 0               | A · B̅         | **inhibíció** (A, de nem B)         | *a gép indul, ha START = 1 és STOP = 0*                      |
| 0 0 1 1               | A             | A változó (átvitel)                 | a kimenet A-t követi                                          |
| 0 1 0 0               | A̅ · B         | **inhibíció** (B, de nem A)         | ugyanez fordított szerepekkel                                 |
| 0 1 0 1               | B             | B változó                           | a kimenet B-t követi                                          |
| 0 1 1 0               | A ⊕ B         | **antivalencia** (XOR)              | *vagy a piros lámpa ég, vagy a zöld, de nem mindkettő*       |
| 0 1 1 1               | A + B         | **diszjunkció** (VAGY)              | *esik az eső vagy fúj a szél*                                 |
| 1 0 0 0               | (A + B)̅       | **Pierce-függvény** (NOR)           | *akkor pihenek, ha se dolgozat, se ZH nincs*                 |
| 1 0 0 1               | A ⊙ B         | **ekvivalencia** (XNOR)             | *akkor és csak akkor kapsz ötöst, ha minden feladatot megoldasz* |
| 1 0 1 0               | B̅             | B negáltja                          | –                                                            |
| 1 0 1 1               | A + B̅         | **implikáció** B → A                | *ha B, akkor A*                                               |
| 1 1 0 0               | A̅             | A negáltja                          | *nem igaz, hogy hétfő van*                                    |
| 1 1 0 1               | A̅ + B         | **implikáció** A → B                | *ha tanulsz, akkor átmész a vizsgán*                          |
| 1 1 1 0               | (A · B)̅       | **Sheffer-függvény** (NAND)         | –                                                            |
| 1 1 1 1               | 1             | **egységfüggvény** (tautológia)     | mindig igaz                                                   |

## Az implikáció

Az **A → B** („ha A, akkor B”) **csak akkor hamis, ha A igaz és B hamis**: *ha tanulsz, de mégsem mész át*, akkor az ígéret megszegődött. Ha nem tanultál (A = 0), az állítás nem sérül, bármi is lett a vizsga – ezért ilyenkor igaz.

| A | B | A → B |
| - | - | ----- |
| 0 | 0 | 1     |
| 0 | 1 | 1     |
| 1 | 0 | **0** |
| 1 | 1 | 1     |

Kifejezése: **A → B = A̅ + B**.

A **kontraponált implikáció** ezzel egyenértékű: A → B = B̅ → A̅.
*Ha esik az eső, nedves az utca* ⇔ *ha az utca nem nedves, akkor nem esett az eső.*

## Az inhibíció (tiltás)

Az **A · B̅** függvény az A jelet csak akkor engedi át, ha a B (**gátló, tiltó**) jel nem aktív. Ipari vezérlésekben ez a **START–STOP** logika alapja: a STOP mindig „erősebb”.

## Melyek a valódi kétváltozós függvények?

A 16-ból 6 valójában nem függ mindkét változótól: a két konstans (0, 1), és A, B, A̅, B̅. A maradék **10** az igazi kétváltozós függvény.

## Összefoglalás

- *n* változóra 2<sup>2<sup>n</sup></sup> függvény van; két változóra 16.
- Implikáció: A → B = A̅ + B, csak 1 → 0 esetén hamis.
- Inhibíció: A · B̅, a B tiltja A-t.
- Antivalencia = XOR, ekvivalencia = XNOR.

## A lecke feladata

```quiz required
? Töltsd ki az A → B implikáció igazságtábláját!
table: A, B -> Y = A' + B
! Csak akkor hamis, ha A igaz és B hamis.

? *A szalag (Y) akkor fut, ha a START gombot (S) nyomják, és a vész-STOP (V) nincs megnyomva.* Írd fel Y kifejezését!
expr: S, V -> S·V'
! Inhibíció: a V tiltja az S-t.

? Hány különböző háromváltozós logikai függvény létezik?
= 256
! 2<sup>2<sup>n</sup></sup>, n = 3.

? Melyik függvény kimeneti oszlopa 1 0 0 1 (az AB = 00, 01, 10, 11 sorokra)?
- antivalencia
+ ekvivalencia
- Pierce-függvény
- implikáció
! Akkor 1, ha a két bemenet megegyezik.

? Melyik állítás egyenértékű ezzel: „Ha esik az eső, nedves az utca”?
- Ha nedves az utca, esett az eső.
- Ha nem esik az eső, nem nedves az utca.
+ Ha nem nedves az utca, nem esett az eső.
! A → B = B̅ → A̅ (kontrapozíció).

? Írd fel a B → A implikációt kifejezésként!
expr: A, B -> A + B'
! X → Y = X̅ + Y, itt X = B és Y = A.
```
