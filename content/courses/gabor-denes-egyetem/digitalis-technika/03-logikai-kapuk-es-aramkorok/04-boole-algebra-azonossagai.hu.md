---
title: A Boole-algebra azonosságai
summary: Az axiómák, az identitás-, dominancia-, idempotencia-, komplementer-, kettős negáció, kommutatív, asszociatív, disztributív és abszorpciós törvények – igazságtáblás bizonyítással.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **Boole-algebra** alapjait,
- a legfontosabb **azonosságokat** (törvényeket) és azok párjait,
- hogyan **bizonyítasz** egy azonosságot igazságtáblával vagy algebrailag.

## Mi a Boole-algebra?

**George Boole** angol matematikus 1854-ben írta le a logika algebráját; **Claude Shannon** 1937-ben mutatta meg, hogy ezzel a relés (kapcsoló) áramkörök tervezhetők. A Boole-algebra olyan rendszer, amelyben

- két érték van: **0** (hamis) és **1** (igaz),
- három alapművelet van: **ÉS** (·), **VAGY** (+), **NEM** (¯),
- teljesül a **kommutativitás**, az **asszociativitás**, a **disztributivitás**, létezik **egységelem** (0 a VAGY-ra, 1 az ÉS-re), és minden elemnek van **komplementere**.

Ezek biztosítják, hogy az algebrai átalakítások érvényesek legyenek – vagyis a logikai kifejezéseket ugyanúgy alakíthatjuk, mint a számokat, csak néhány új szabállyal.

## Az azonosságok

Az azonosságok **párban** állnak: a jobb oldali a bal oldali **duálisa** (+ ↔ ·, 0 ↔ 1 csere; lásd a következő leckét).

| #   | Törvény                              | VAGY alak                 | ÉS alak                   |
| --- | ------------------------------------ | ------------------------- | ------------------------- |
| 1   | identitás (egységelem)               | A + 0 = A                 | A · 1 = A                 |
| 2   | null / dominancia                    | A + 1 = 1                 | A · 0 = 0                 |
| 3   | idempotencia                         | A + A = A                 | A · A = A                 |
| 4   | komplementer                         | A + A̅ = 1                 | A · A̅ = 0                 |
| 5   | kettős negáció                       | A̿ = A                     |                           |
| 6   | kommutativitás (felcserélhetőség)    | A + B = B + A             | A · B = B · A             |
| 7   | asszociativitás (csoportosíthatóság) | A + (B + C) = (A + B) + C | A · (B · C) = (A · B) · C |
| 8   | disztributivitás (szétosztás)        | A + B·C = (A + B)·(A + C) | A · (B + C) = A·B + A·C   |
| 9   | abszorpció (elnyelés)                | A + A·B = A               | A · (A + B) = A           |
| 10  | elosztott abszorpció                 | A + A̅·B = A + B           | A · (A̅ + B) = A · B       |

> **Figyelem:** a 8. sor bal oldala (A + B·C = (A + B)·(A + C)) a közönséges algebrában **nem** igaz, a Boole-algebrában viszont igen! Ugyanígy A + A = A (és nem 2A).

## Bizonyítás igazságtáblával

Egy azonosság akkor igaz, ha a két oldal igazságtáblája **minden sorban** megegyezik.

**Abszorpció: A + A·B = A**

| A   | B   | A·B | A + A·B |
| --- | --- | --- | ------- |
| 0   | 0   | 0   | 0       |
| 0   | 1   | 0   | 0       |
| 1   | 0   | 0   | 1       |
| 1   | 1   | 1   | 1       |

Az utolsó oszlop pontosan A. ✓

**Elosztott abszorpció: A + A̅·B = A + B**

| A   | B   | A̅·B | A + A̅·B | A + B |
| --- | --- | --- | ------- | ----- |
| 0   | 0   | 0   | 0       | 0     |
| 0   | 1   | 1   | 1       | 1     |
| 1   | 0   | 0   | 1       | 1     |
| 1   | 1   | 0   | 1       | 1     |

## Bizonyítás algebrailag

**A + A·B = A:**
A + A·B = A·1 + A·B _(identitás)_ = A·(1 + B) _(kiemelés, disztributivitás)_ = A·1 _(dominancia: 1 + B = 1)_ = **A**

**A + A̅·B = A + B:**
A + A̅·B = (A + A̅)·(A + B) _(disztributivitás VAGY alakja)_ = 1·(A + B) _(komplementer)_ = **A + B**

**(A + B)·(A + B̅) = A:**
= A·A + A·B̅ + B·A + B·B̅ = A + A·B̅ + A·B + 0 = A·(1 + B̅ + B) = **A**

## Gépi bizonyítás

Két változóra 4, háromra 8 sort kell megnézni – ezt a gép villámgyorsan elvégzi:

```python run
# Azonosságok ellenőrzése minden bemeneti kombinációra
from itertools import product

def azonos(bal, jobb, valtozok):
    return all(bal(*v) == jobb(*v) for v in product((0, 1), repeat=valtozok))

NEM = lambda x: 1 - x
print("A + A·B = A:          ", azonos(lambda a, b: a | (a & b), lambda a, b: a, 2))
print("A + A'·B = A + B:     ", azonos(lambda a, b: a | (NEM(a) & b), lambda a, b: a | b, 2))
print("A + B·C = (A+B)(A+C): ", azonos(lambda a, b, c: a | (b & c),
                                       lambda a, b, c: (a | b) & (a | c), 3))
print("A·(A+B) = A·B ?       ", azonos(lambda a, b: a & (a | b), lambda a, b: a & b, 2))
```

Az utolsó sor `False`: A·(A + B) **nem** A·B, hanem A (abszorpció)!

## Összefoglalás

- Az azonosságok párban állnak (VAGY és ÉS alak).
- Különösen fontos: komplementer (A + A̅ = 1, A·A̅ = 0), abszorpció (A + AB = A), elosztott abszorpció (A + A̅B = A + B).
- A Boole-algebrában A + BC = (A + B)(A + C) is igaz.
- Bizonyítás: igazságtáblával vagy lépésenkénti átalakítással.

## A lecke feladata

```quiz required
? Egyszerűsítsd: A + A·B
expr: A, B -> A
limit: 1
same: A + A·B
! Abszorpció.

? Egyszerűsítsd: A + A'·B
expr: A, B -> A + B
limit: 2
same: A + A'·B
! Elosztott abszorpció: A + A̅B = A + B.

? Egyszerűsítsd: A·(A' + B)
expr: A, B -> A·B
limit: 2
same: A·(A' + B)
! Szorozd be: A·A̅ + A·B.

? Egyszerűsítsd: (A + B)·(A + C)
expr: A, B, C -> A + B·C
limit: 3
same: (A + B)·(A + C)
! A disztributivitás VAGY alakja visszafelé.

? Melyik azonosság **hamis** a Boole-algebrában?
- A + B·C = (A + B)·(A + C)
- A + A = A
+ A · (A + B) = A · B
- A · A̅ = 0
! Ellenőrizd A = 1, B = 0 esetén.

? Mennyi A·B·0 + C·1 + C·C̅? (Írd fel a legegyszerűbb alakban!)
expr: A, B, C -> C
limit: 1
same: A·B·0 + C·1 + C·C'
! Dominancia, identitás és komplementer törvény.
```
