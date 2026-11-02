---
title: De Morgan, dualitás és további azonosságok
summary: De Morgan-azonosságok két és több változóra, a dualitás elve, konszenzus, XOR-azonosságok, Shannon-kifejtés és a többségi függvény.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **De Morgan-azonosságokat** és a „törd meg a vonalat, cseréld a jelet” szabályt,
- a **dualitás elvét**,
- a **konszenzus** (redundancia) törvényt,
- az **XOR** azonosságait, a **Shannon-kifejtést** és a **többségi függvényt**.

## De Morgan-azonosságok

**Augustus De Morgan** (1806–1871) két kulcsfontosságú átalakítási szabálya:

- **(A + B)̅ = A̅ · B̅** – „nem igaz, hogy A vagy B” = „se A, se B”
- **(A · B)̅ = A̅ + B̅** – „nem igaz, hogy A és B” = „A vagy B közül legalább az egyik hamis”

**Igazolás igazságtáblával:**

| A   | B   | (A + B)̅ | A̅ · B̅ | (A · B)̅ | A̅ + B̅ |
| --- | --- | ------- | ----- | ------- | ----- |
| 0   | 0   | 1       | 1     | 1       | 1     |
| 0   | 1   | 0       | 0     | 1       | 1     |
| 1   | 0   | 0       | 0     | 1       | 1     |
| 1   | 1   | 0       | 0     | 0       | 0     |

**Általános alak, _n_ változóra:**
(A<sub>1</sub> + A<sub>2</sub> + … + A<sub>n</sub>)̅ = A̅<sub>1</sub> · A̅<sub>2</sub> · … · A̅<sub>n</sub>, és (A<sub>1</sub> · A<sub>2</sub> · … · A<sub>n</sub>)̅ = A̅<sub>1</sub> + A̅<sub>2</sub> + … + A̅<sub>n</sub>

**Gyakorlati szabály:** _„Törd meg a vonalat, és cseréld meg a műveleti jelet!”_ A hosszú felülvonást a műveleti jelnél kettévágjuk, a · helyére + kerül (és fordítva).

**Kapukkal:** a NOR kapu = negált bemenetű ÉS kapu, a NAND kapu = negált bemenetű VAGY kapu. Ez az alapja a **NAND- és NOR-homogenizálásnak** (két lecke múlva).

**Bővített példa:** (A · B̅ + C)̅ = (A · B̅)̅ · C̅ = (A̅ + B) · C̅

## A dualitás elve

A Boole-algebra minden érvényes azonosságából **automatikusan egy másik érvényes azonosságot** kapunk, ha

- a **· és + műveleteket felcseréljük**, és
- a **0 és 1 konstansokat felcseréljük** (a változókat és a negálásokat nem bántjuk).

| Azonosság                | Duálisa               |
| ------------------------ | --------------------- |
| A + 0 = A                | A · 1 = A             |
| A · A = A                | A + A = A             |
| A · (A + B) = A          | A + A · B = A         |
| A + B·C = (A + B)(A + C) | A · (B + C) = AB + AC |

Így elég minden azonosság egyik felét megjegyezni.

> **Vigyázat:** a duális kifejezés **nem** ugyanaz, mint a negált! A + B duálisa A · B, a negáltja viszont A̅ · B̅.

## Konszenzus (redundancia) törvény

**A·B + A̅·C + B·C = A·B + A̅·C**

A B·C tag **felesleges**: ha B és C is igaz, akkor A értékétől függően vagy az A·B, vagy az A̅·C tag úgyis igaz. A konszenzus tagot úgy ismered fel, hogy két tag egy változót ponáltan, illetve negáltan tartalmaz (A és A̅), a harmadik tag pedig a két tag **maradékainak szorzata** (B·C).

Duális párja: (A + B)·(A̅ + C)·(B + C) = (A + B)·(A̅ + C)

> A konszenzus tag elhagyható – de a **hazárdmentesítésnél** (4. témakör) épp ezt a tagot tesszük vissza szándékosan!

Rokon azonosság: (A + B)·(A̅ + C) = A·C + A̅·B

## XOR és XNOR azonosságok

- definíció: A ⊕ B = A·B̅ + A̅·B, A ⊙ B = A·B + A̅·B̅ = (A ⊕ B)̅
- kommutatív és asszociatív: A ⊕ B = B ⊕ A, (A ⊕ B) ⊕ C = A ⊕ (B ⊕ C)
- konstansokkal: A ⊕ 0 = A, A ⊕ 1 = A̅, A ⊕ A = 0, A ⊕ A̅ = 1
- az ÉS disztributív az XOR-ra: A·(B ⊕ C) = A·B ⊕ A·C
- a VAGY kifejezhető XOR-ral: A + B = A ⊕ B ⊕ A·B

## Shannon-féle kifejtési tétel

Bármely Boole-függvény kifejthető egy választott változója szerint:

**f(A, B, C, …) = A · f(1, B, C, …) + A̅ · f(0, B, C, …)**

Vagyis a függvényt két „félre” bontjuk: mi a kimenet, ha A = 1, és mi, ha A = 0. Ez az alapja a **multiplexeres** megvalósításnak (4. témakör), a bináris döntési diagramoknak (BDD) és az FPGA-k LUT-jainak.

**Példa:** f = A·B + A̅·C → f(1, B, C) = B, f(0, B, C) = C → f = A·B + A̅·C – ez pont egy 2:1 multiplexer, ahol A a választójel!

## Többségi (majority) függvény

Három bemenetnél akkor 1, ha **legalább kettő** bemenet 1:

**M = A·B + A·C + B·C = (A + B)·(A + C)·(B + C)**

Ilyen függvény adja a teljes összeadó **átvitelét** (4. témakör), és ezt használják a hibatűrő rendszerek „háromból kettő” szavazó áramkörei is (pl. repülőgépek, űreszközök).

## Összefoglalás

- De Morgan: (A + B)̅ = A̅·B̅, (A·B)̅ = A̅ + B̅ – „törd meg a vonalat, cseréld a jelet”.
- Dualitás: + ↔ ·, 0 ↔ 1 csere egy újabb érvényes azonosságot ad.
- Konszenzus: AB + A̅C + BC = AB + A̅C.
- Shannon: f = A·f(1, …) + A̅·f(0, …).

## A lecke feladata

```quiz required
? Alakítsd át De Morgan szerint (negálás csak a változókon legyen): (A + B + C)'
expr: A, B, C -> A'·B'·C'
same: (A + B + C)'
! Törd meg a vonalat, és cseréld a jelet: + → ·.

? Alakítsd át De Morgan szerint (negálás csak a változókon legyen): (A·B')'
expr: A, B -> A' + B
same: (A·B')'
! (A·B̅)̅ = A̅ + B̿ = A̅ + B.

? Egyszerűsítsd a konszenzus törvénnyel: A·B + A'·C + B·C
expr: A, B, C -> A·B + A'·C
limit: 4
same: A·B + A'·C + B·C
! A B·C tag a konszenzus tag.

? Mi az A + B·0 kifejezés **duálisa**?
- A' · B' + 1
+ A · (B + 1)
- A + B · 1
- (A + B·0)'
! Cseréld a · és + jeleket, valamint a 0-t 1-re.

? Mennyi A ⊕ A'? (legegyszerűbb alak)
expr: A -> 1
same: A ⊕ A'
! Két különböző érték XOR-ja mindig 1.

? Töltsd ki a háromváltozós többségi függvény igazságtábláját!
table: A, B, C -> M = A·B + A·C + B·C
! Akkor 1, ha legalább két bemenet 1.
```
