---
title: Halmazműveletek
summary: Unió, metszet, különbség, komplementer és szimmetrikus differencia – Venn-diagrammal és Pythonnal.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- az **unió**, a **metszet**, a **különbség**, a **komplementer** és a **szimmetrikus differencia** fogalmát,
- hogyan ábrázoljuk ezeket **Venn-diagramon**,
- mit jelent, hogy két halmaz **diszjunkt**.

## A műveletek

Legyen $U$ az **alaphalmaz** (univerzum), $A, B \subseteq U$.

| Művelet                  | Jelölés         | Definíció                                | Python   |
| ------------------------ | --------------- | ---------------------------------------- | -------- |
| unió (egyesítés)         | $A \cup B$      | $\{x : x \in A \text{ vagy } x \in B\}$  | `A \| B` |
| metszet (közös rész)     | $A \cap B$      | $\{x : x \in A \text{ és } x \in B\}$    | `A & B`  |
| különbség                | $A \setminus B$ | $\{x : x \in A \text{ és } x \notin B\}$ | `A - B`  |
| komplementer             | $\overline{A}$  | $\{x \in U : x \notin A\}$               | `U - A`  |
| szimmetrikus differencia | $A \triangle B$ | $(A \setminus B) \cup (B \setminus A)$   | `A ^ B`  |

A „vagy” itt **megengedő** vagy: a mindkettőben lévő elemek is az unióban vannak. Ha $A \cap B = \emptyset$, a két halmaz **diszjunkt** (nincs közös elemük).

## Venn-diagram

```text
        U
  ┌───────────────────────────┐
  │     A ┌─────┐             │
  │   ┌───┼──┐  │ B           │
  │   │ 1 │ 2│ 3│             │      1 = A \ B
  │   │   │  │  │             │      2 = A ∩ B
  │   └───┼──┘  │             │      3 = B \ A
  │       └─────┘          4  │      4 = a komplementere A ∪ B-nek
  └───────────────────────────┘
```

A négy tartomány minden elemet pontosan egyszer tartalmaz: ez a **szitaformula** és a valószínűségszámítás alapja.

## Példa

$U = \{1, 2, \dots, 10\}$, $A = \{1, 2, 3, 4, 5, 6\}$ (a 6-nál nem nagyobbak), $B = \{2, 4, 6, 8, 10\}$ (a párosak).

- $A \cup B = \{1, 2, 3, 4, 5, 6, 8, 10\}$, $\ A \cap B = \{2, 4, 6\}$,
- $A \setminus B = \{1, 3, 5\}$, $\ B \setminus A = \{8, 10\}$,
- $\overline{A} = \{7, 8, 9, 10\}$, $\ A \triangle B = \{1, 3, 5, 8, 10\}$.

```python run
U = set(range(1, 11))
A = {x for x in U if x <= 6}
B = {x for x in U if x % 2 == 0}
print("unió:      ", A | B)
print("metszet:   ", A & B)
print("A \\ B:     ", A - B)
print("komplementer A:", U - A)
print("szimm. diff.:", A ^ B)
print("diszjunktak?", A.isdisjoint({7, 9}))
```

Adatbázisokban ugyanezek a műveletek: az SQL `UNION`, `INTERSECT` és `EXCEPT` két lekérdezés eredményhalmazán dolgozik.

## Összefoglalás

- $A \cup B$: legalább az egyikben; $A \cap B$: mindkettőben; $A \setminus B$: $A$-ban, de $B$-ben nem; $\overline{A}$: $U$-ban, de $A$-ban nem.
- $A \triangle B$: pontosan az egyikben. Diszjunkt: $A \cap B = \emptyset$.
- Pythonban: `|`, `&`, `-`, `^`; SQL-ben: `UNION`, `INTERSECT`, `EXCEPT`.

## A lecke feladata

```quiz required
? $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$. Hány eleme van $A \cup B$-nek?
= 5

? Ugyanezekkel: hány eleme van $A \cap B$-nek?
= 2

? Ugyanezekkel: mi az $A \setminus B$ halmaz legnagyobb eleme?
= 2
! $A \setminus B = \{1, 2\}$

? $U = \{1, \dots, 10\}$, $C$ a prímszámok halmaza $U$-ban. Hány eleme van $\overline{C}$-nek?
= 6
! A prímek: $2, 3, 5, 7$.

? Melyik halmaz egyenlő $A \triangle B$-vel?
- $A \cup B$
- $A \cap B$
+ $(A \cup B) \setminus (A \cap B)$
- $\overline{A} \cap \overline{B}$
! A szimmetrikus differencia a pontosan az egyikben lévő elemek halmaza.
```
