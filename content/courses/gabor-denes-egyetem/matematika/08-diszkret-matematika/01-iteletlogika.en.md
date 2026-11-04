---
title: Propositional Logic
summary: Propositions, logical connectives, truth tables, implication and equivalence, tautologies and logical identities.
minutes: 25
---

## What you will learn

- what a **proposition** is, and what **logical connectives** exist,
- how to build a **truth table**,
- how **implication** ("if…, then…") works, and what the converse is,
- what a **tautology** is, and the most important **identities**.

## Propositions and connectives

A **proposition** is a statement that is either true (**T**, $1$) or false (**F**, $0$). For example, "$7$ is a prime number." is true, "$2 + 2 = 5$" is false, while "What time is it?" is not a proposition.

Connectives build new propositions from old ones:

| Connective  | Symbol                | Reading                | When is it true?                             |
| ----------- | --------------------- | ---------------------- | -------------------------------------------- |
| negation    | $\neg P$              | not $P$                | if $P$ is false                              |
| conjunction | $P \land Q$           | $P$ and $Q$            | if both are true                             |
| disjunction | $P \lor Q$            | $P$ or $Q$             | if at least one is true                      |
| implication | $P \rightarrow Q$     | if $P$, then $Q$       | **except** when $P$ is true and $Q$ is false |
| equivalence | $P \leftrightarrow Q$ | $P$ if and only if $Q$ | if their values are equal                    |

A truth table lists every possible input. With $n$ variables there are $2^n$ rows.

| $P$ | $Q$ | $\neg P$ | $P \land Q$ | $P \lor Q$ | $P \rightarrow Q$ | $P \leftrightarrow Q$ |
| --- | --- | -------- | ----------- | ---------- | ----------------- | --------------------- |
| 0   | 0   | 1        | 0           | 0          | 1                 | 1                     |
| 0   | 1   | 1        | 0           | 1          | 1                 | 0                     |
| 1   | 0   | 0        | 0           | 1          | 0                 | 0                     |
| 1   | 1   | 0        | 1           | 1          | 1                 | 1                     |

## Implication

$P \rightarrow Q$ is false only when the premise is true and the conclusion is false. **Anything follows from a false premise**: "If it snows in Budapest in July, I will eat my hat" is true as long as it does not snow.

An important rewrite: $P \rightarrow Q \equiv \neg P \lor Q$.

An implication and its relatives:

- **converse**: $Q \rightarrow P$, which is **not** equivalent to the original,
- **contrapositive**: $\neg Q \rightarrow \neg P$, which **is equivalent** to the original (the basis of indirect proof).

For example: "If a number is divisible by $4$, it is even." is true, its converse ("if it is even, it is divisible by $4$") is false ($6$), and its contrapositive ("if it is not even, it is not divisible by $4$") is true.

## Tautologies and identities

A formula is a **tautology** if it is true under every assignment (e.g. $P \lor \neg P$), and **unsatisfiable** (a contradiction) if it is always false (e.g. $P \land \neg P$). Two formulas are **equivalent** ($\equiv$) if their truth tables are the same.

The most important identities are the same as in set algebra ($\land \leftrightarrow \cap$, $\lor \leftrightarrow \cup$, $\neg \leftrightarrow$ complement):

- commutativity, associativity, distributivity: $P \land (Q \lor R) \equiv (P \land Q) \lor (P \land R)$,
- **De Morgan:** $\neg(P \land Q) \equiv \neg P \lor \neg Q$, $\neg(P \lor Q) \equiv \neg P \land \neg Q$,
- absorption: $P \lor (P \land Q) \equiv P$,
- double negation: $\neg\neg P \equiv P$.

These are also the foundations of digital circuit design: AND, OR and NOT gates implement exactly these operations.

```python run
from itertools import product
# Truth table and tautology check: (P → Q) ∧ P → Q (modus ponens)
def impl(a, b):
    return (not a) or b

print(" P  Q | result")
all_true = True
for P, Q in product([False, True], repeat=2):
    value = impl(impl(P, Q) and P, Q)
    all_true = all_true and value
    print(f" {int(P)}  {int(Q)} |   {int(value)}")
print("Tautology?", all_true)
```

## Summary

- Connectives and truth tables: $n$ variables, $2^n$ rows.
- $P \rightarrow Q$ is false only for "true → false"; $P \rightarrow Q \equiv \neg P \lor Q \equiv \neg Q \rightarrow \neg P$.
- Tautology: always true; equivalent formulas: identical truth tables.
- De Morgan: negation "flips" AND into OR and vice versa.

## Lesson exercise

When typing answers, $P'$ is negation, $P \cdot Q$ (or $PQ$) is AND, and $P + Q$ is OR.

```quiz required
? Fill in the truth table of implication ($Y = P \rightarrow Q$) and equivalence ($Z = P \leftrightarrow Q$)!
table: P, Q -> Y = P' + Q; Z = P'·Q' + P·Q

? Which one is equivalent to the implication $P \rightarrow Q$?
- $Q \rightarrow P$
- $\neg P \rightarrow \neg Q$
+ $\neg Q \rightarrow \neg P$
- $P \land \neg Q$
! The contrapositive.

? Which one is a tautology?
- $P \land \neg P$
- $P \rightarrow \neg P$
+ $(P \land Q) \rightarrow P$
- $P \lor Q$

? How many rows does the truth table of a $4$-variable formula have?
= 16

? Simplify with De Morgan's law, with negation only on the variables: $\neg(P \lor \neg Q)$.
expr: P, Q -> P'·Q
limit: 2
same: (P + Q')'

? Fill in: $Y = (P \rightarrow Q) \land (Q \rightarrow R)$, and $Z = P \rightarrow R$.
table: P, Q, R -> Y = (P' + Q)·(Q' + R); Z = P' + R
! Wherever $Y = 1$, $Z$ is $1$ too: this is the chain rule (transitivity).
```
