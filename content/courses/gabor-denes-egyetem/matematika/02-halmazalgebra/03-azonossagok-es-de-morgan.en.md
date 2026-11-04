---
title: Laws of Set Algebra and De Morgan's Laws
summary: The laws of set operations, De Morgan's laws, and the link with logic (membership tables).
minutes: 20
---

## What you will learn

- the **laws** of set operations (commutativity, associativity, distributivity),
- **De Morgan's laws**,
- how to prove a set identity with a **membership table** – and why it is the same as a truth table in logic.

## The laws

For all $A, B, C \subseteq U$:

| Name                  | Union                                            | Intersection                                     |
| --------------------- | ------------------------------------------------ | ------------------------------------------------ |
| commutativity         | $A \cup B = B \cup A$                            | $A \cap B = B \cap A$                            |
| associativity         | $(A \cup B) \cup C = A \cup (B \cup C)$          | $(A \cap B) \cap C = A \cap (B \cap C)$          |
| distributivity        | $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$ | $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| idempotence           | $A \cup A = A$                                   | $A \cap A = A$                                   |
| absorption            | $A \cup (A \cap B) = A$                          | $A \cap (A \cup B) = A$                          |
| identity / domination | $A \cup \emptyset = A$, $A \cup U = U$           | $A \cap U = A$, $A \cap \emptyset = \emptyset$   |
| complement            | $A \cup \overline{A} = U$                        | $A \cap \overline{A} = \emptyset$                |

Also $\overline{\overline{A}} = A$ and $A \setminus B = A \cap \overline{B}$.

## De Morgan's laws

$$
\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}.
$$

In words: "in neither of them" = "not in $A$ **and** not in $B$". Taking the complement "turns" union into intersection and intersection into union.

## Proof with a membership table

For an element $x$ there are two cases for each set: it is in it ($1$) or not ($0$). If the two sides of an identity give the same value **in every row**, the identity holds. For $\overline{A \cup B}$ and $\overline{A} \cap \overline{B}$:

| $x \in A$ | $x \in B$ | $x \in A \cup B$ | $x \in \overline{A \cup B}$ | $x \in \overline{A} \cap \overline{B}$ |
| :-------: | :-------: | :--------------: | :-------------------------: | :------------------------------------: |
|     0     |     0     |        0         |              1              |                   1                    |
|     0     |     1     |        1         |              0              |                   0                    |
|     1     |     0     |        1         |              0              |                   0                    |
|     1     |     1     |        1         |              0              |                   0                    |

This is exactly a truth table in **logic**: union is "or" ($\lor$), intersection is "and" ($\land$), complement is "not" ($\neg$). Set algebra and propositional logic are two faces of the same structure, **Boolean algebra** – which is also what digital electronics uses.

```python run
# Checking De Morgan's law on an example.
U = set(range(1, 21))
A = {x for x in U if x % 2 == 0}
B = {x for x in U if x % 3 == 0}
left = U - (A | B)
right = (U - A) & (U - B)
print(left)
print(left == right)   # True
```

## Summary

- Union and intersection are commutative, associative and distribute **over each other**.
- De Morgan: $\overline{A \cup B} = \overline{A} \cap \overline{B}$, $\overline{A \cap B} = \overline{A} \cup \overline{B}$.
- Membership table = truth table: $\cup \leftrightarrow \lor$, $\cap \leftrightarrow \land$, complement $\leftrightarrow \neg$.

## Lesson exercise

In the membership table $A = 1$ means $x \in A$. Notation: $A'$ is the complement, $+$ the union, $\cdot$ the intersection.

```quiz required
? Fill in the membership table: $Y$ is the set $\overline{A \cap B}$, $Z$ is $\overline{A} \cup \overline{B}$.
table: A, B -> Y = (A·B)'; Z = A' + B'

? Fill in: $Y$ is the set $A \setminus B$.
table: A, B -> Y = A·B'

? Simplify with the absorption law: $A \cup (A \cap B)$. (Write the set as a letter.)
expr: A, B -> A
limit: 1
same: A + A·B

? Which one equals $A \cap (B \cup C)$?
- $(A \cap B) \cup C$
+ $(A \cap B) \cup (A \cap C)$
- $(A \cup B) \cap (A \cup C)$
- $A \cup (B \cap C)$
! Distributivity: intersection "distributes" over union.
```
