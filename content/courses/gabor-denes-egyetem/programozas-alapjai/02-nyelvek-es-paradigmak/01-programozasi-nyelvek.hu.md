---
title: Mi a programozási nyelv?
summary: Gépi kód, assembly és magas szintű nyelvek; szintaxis és szemantika.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- milyen **szintjei** vannak a programozási nyelveknek,
- mi a különbség a **szintaxis** és a **szemantika** között,
- miért írunk ma szinte mindent magas szintű nyelven.

## A nyelvek szintjei

A processzor csak **gépi kódot** ért: kettes számrendszerbeli utasításkódokat. Ezt embernek szinte lehetetlen olvasni, ezért egyre „magasabb” szintű nyelvek születtek.

| Szint                       | Példa               | Jellemző                                                            |
| --------------------------- | ------------------- | ------------------------------------------------------------------- |
| gépi kód                    | `10110000 01100001` | a processzor közvetlenül végrehajtja, processzorfüggő               |
| assembly                    | `MOV AL, 61h`       | a gépi utasítások olvasható rövidítései, még mindig processzorfüggő |
| alacsony szintű magas nyelv | C                   | hordozható, de közel van a hardverhez (memóriakezelés kézzel)       |
| magas szintű nyelv          | Python, Java, C#    | ember számára könnyen olvasható, a gép részleteit elrejti           |

Minél magasabb szintű a nyelv, annál kevesebb kóddal fejezhetünk ki egy gondolatot, és annál könnyebb hordozni más gépre. Cserébe a futás általában valamivel lassabb, és kevesebb közvetlen ráhatásunk van a hardverre.

## Ugyanaz különböző szinteken

Feladat: adjunk össze két számot.

```c
/* C nyelven: a típusokat meg kell adni, a programot le kell fordítani. */
#include <stdio.h>
int main(void) {
    int a = 2, b = 3;
    printf("%d\n", a + b);
    return 0;
}
```

```python run
# Pythonban: nincs típusmegadás, nincs main függvény, azonnal futtatható.
a, b = 2, 3
print(a + b)
```

## Szintaxis és szemantika

- A **szintaxis** a nyelv _nyelvtana_: milyen formában kell leírni az utasításokat (hova kell kettőspont, zárójel, behúzás). A szintaktikai hibát a gép a futtatás előtt jelzi (`SyntaxError`).
- A **szemantika** a _jelentés_: mit csinál egy szintaktikailag helyes utasítás. Egy szemantikai hiba esetén a program lefut, csak nem azt csinálja, amit szerettél volna.

```python run
# Szintaktikailag helyes, de szemantikailag hibás: átlag helyett rossz képlet.
a, b = 4, 6
atlag = a + b / 2      # a műveleti sorrend miatt ez 4 + 3 = 7.0
print(atlag)
atlag = (a + b) / 2    # helyesen: 5.0
print(atlag)
```

## Általános és szakterületi nyelvek

- **Általános célú nyelvek (GPL):** bármire használhatók – Python, Java, C, C#.
- **Szakterületi nyelvek (DSL):** egy feladatkörre készültek – SQL (adatbázis-lekérdezés), HTML (weboldal szerkezete), CSS (megjelenés), regex (szövegminták).

## Összefoglalás

- A nyelvek a gépi kódtól a magas szintű nyelvekig terjednek; minél magasabb a szint, annál olvashatóbb és hordozhatóbb a kód.
- **Szintaxis** = forma, **szemantika** = jelentés.
- Vannak általános célú és szakterületi nyelvek.
