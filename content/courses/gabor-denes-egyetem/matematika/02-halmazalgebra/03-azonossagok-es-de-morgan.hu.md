---
title: Műveleti azonosságok és a De Morgan-szabályok
summary: A halmazműveletek törvényei, a De Morgan-azonosságok, és a kapcsolat a logikával (tartalmazási tábla).
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a halmazműveletek **azonosságait** (felcserélhetőség, csoportosíthatóság, disztributivitás),
- a **De Morgan-azonosságokat**,
- hogyan bizonyítunk halmazazonosságot **tartalmazási táblával** – és miért ugyanaz, mint egy logikai igazságtábla.

## Az azonosságok

Minden $A, B, C \subseteq U$ halmazra:

| Név                    | Unió                                           | Metszet                                         |
| ---------------------- | ---------------------------------------------- | ----------------------------------------------- |
| felcserélhetőség       | $A \cup B = B \cup A$                          | $A \cap B = B \cap A$                           |
| csoportosíthatóság     | $(A \cup B) \cup C = A \cup (B \cup C)$        | $(A \cap B) \cap C = A \cap (B \cap C)$         |
| disztributivitás       | $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ | $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| idempotencia           | $A \cup A = A$                                 | $A \cap A = A$                                  |
| elnyelés               | $A \cup (A \cap B) = A$                        | $A \cap (A \cup B) = A$                         |
| semleges / zéró elem   | $A \cup \emptyset = A$, $A \cup U = U$         | $A \cap U = A$, $A \cap \emptyset = \emptyset$  |
| komplementer           | $A \cup \overline{A} = U$                      | $A \cap \overline{A} = \emptyset$               |

Valamint $\overline{\overline{A}} = A$ és $A \setminus B = A \cap \overline{B}$.

## De Morgan-azonosságok

$$
\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}.
$$

Szóban: „nem eleme egyiknek sem” = „nem eleme $A$-nak **és** nem eleme $B$-nek”. A komplementer képzése az uniót metszetté, a metszetet unióvá „fordítja”.

## Bizonyítás tartalmazási táblával

Egy $x$ elemről minden halmaznál két eset van: benne van ($1$) vagy nincs ($0$). Ha egy azonosság két oldala **minden sorban** ugyanazt adja, az azonosság igaz. Az $\overline{A \cup B}$ és az $\overline{A} \cap \overline{B}$:

| $x \in A$ | $x \in B$ | $x \in A \cup B$ | $x \in \overline{A \cup B}$ | $x \in \overline{A} \cap \overline{B}$ |
| :-------: | :-------: | :--------------: | :-------------------------: | :------------------------------------: |
| 0         | 0         | 0                | 1                           | 1                                      |
| 0         | 1         | 1                | 0                           | 0                                      |
| 1         | 0         | 1                | 0                           | 0                                      |
| 1         | 1         | 1                | 0                           | 0                                      |

Ez pontosan a **logika** igazságtáblája: az unió a „vagy” ($\lor$), a metszet az „és” ($\land$), a komplementer a „nem” ($\neg$). A halmazalgebra és az ítéletlogika ugyanannak a szerkezetnek, a **Boole-algebrának** két arca – ezt használja a digitális technika is.

```python run
# A De Morgan-azonosság ellenőrzése egy példán.
U = set(range(1, 21))
A = {x for x in U if x % 2 == 0}
B = {x for x in U if x % 3 == 0}
bal = U - (A | B)
jobb = (U - A) & (U - B)
print(bal)
print(bal == jobb)   # True
```

## Összefoglalás

- Az unió és a metszet felcserélhető, csoportosítható, és **kölcsönösen** disztributív.
- De Morgan: $\overline{A \cup B} = \overline{A} \cap \overline{B}$, $\overline{A \cap B} = \overline{A} \cup \overline{B}$.
- Tartalmazási tábla = igazságtábla: $\cup \leftrightarrow \lor$, $\cap \leftrightarrow \land$, komplementer $\leftrightarrow \neg$.

## A lecke feladata

A tartalmazási táblában $A = 1$ azt jelenti, hogy $x \in A$. A jelölések: $A'$ a komplementer, $+$ az unió, $\cdot$ a metszet.

```quiz required
? Töltsd ki a tartalmazási táblát: $Y$ az $\overline{A \cap B}$, $Z$ az $\overline{A} \cup \overline{B}$ halmaz.
table: A, B -> Y = (A·B)'; Z = A' + B'

? Töltsd ki: $Y$ az $A \setminus B$ halmaz.
table: A, B -> Y = A·B'

? Egyszerűsítsd az elnyelési azonossággal: $A \cup (A \cap B)$. (Írd a halmazt betűvel.)
expr: A, B -> A
limit: 1
same: A + A·B

? Melyik egyenlő $A \cap (B \cup C)$-vel?
- $(A \cap B) \cup C$
+ $(A \cap B) \cup (A \cap C)$
- $(A \cup B) \cap (A \cup C)$
- $A \cup (B \cap C)$
! Disztributivitás: a metszet „szétosztódik” az unión.
```
