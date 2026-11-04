---
title: Practice – Discrete Mathematics
summary: Review questions and a summary worksheet on logic, combinatorics, number theory and graphs.
minutes: 35
kind: practice
---

## Review questions

<details>
<summary>1. Why is an implication true when its premise is false?</summary>

An implication is a promise: "if $P$, then $Q$". It is broken only if $P$ holds but $Q$ does not. If $P$ does not hold, the promise has not been broken, so the implication is true. Formally: $P \rightarrow Q \equiv \neg P \lor Q$, which is true for false $P$.

</details>

<details>
<summary>2. How do you know whether you need a variation or a combination?</summary>

Ask: if two selections differ only in order, are they two different cases? If yes (podium, password, ordering), it is a variation; if not (team, lottery, cards in hand), it is a combination. Then: can an element repeat?

</details>

<details>
<summary>3. Why is the Euclidean algorithm fast?</summary>

Because in two steps the larger number drops to at most half (if $b \leq a/2$, then $a \bmod b < b \leq a/2$; if $b > a/2$, then $a \bmod b = a - b < a/2$). So the number of steps is proportional to the number of digits, which is fast even for the hundreds-of-digits numbers used in RSA.

</details>

<details>
<summary>4. Why does every tree on $n$ vertices have $n - 1$ edges?</summary>

By induction: a tree with $1$ vertex has $0$ edges. A tree with at least $2$ vertices always has a **leaf** (a vertex of degree one: the endpoint of a longest path). Removing it together with its edge leaves a tree on $n - 1$ vertices, which by the induction hypothesis has $n - 2$ edges, so the original has $n - 1$.

</details>

## Summary worksheet

```quiz required
? Fill in the truth table: $Y = \neg(P \land Q)$ (NAND) and $Z = \neg P \lor \neg Q$.
table: P, Q -> Y = (P·Q)'; Z = P' + Q'
! The two columns are identical: this is De Morgan's law.

? What is the negation of "There is a student who attended every class."?
- There is a student who attended no class.
+ Every student missed at least one class.
- Every student missed every class.
- No student attended any class.
! $\neg\exists h\,\forall o\, P(h, o) \equiv \forall h\,\exists o\,\neg P(h, o)$.

? By induction: $1 + 2 + 4 + \dots + 2^{n} = \;?$ Enter it as a function of $n$!
fn: n -> 2^(n + 1) - 1
domain: 0, 10

? In how many ways can we draw $4$ cards from a $32$-card deck (order does not matter)?
= 35960

? In how many ways can we choose $2$ boys and $2$ girls from $5$ boys and $4$ girls?
= 60

? What is the coefficient of $x^4$ in the expansion of $(3x + 2)^{10}$? (Enter only the final result.)
= 1088640
! $\binom{10}{4} \cdot 3^4 \cdot 2^6$

? What is $2^{50} \bmod 7$?
= 4
! $2^3 = 8 \equiv 1 \pmod 7$, and $50 = 3 \cdot 16 + 2$.

? In a graph on $10$ vertices every vertex has degree $3$. How many edges does it have?
= 15

? Which graph has a closed Euler trail (Euler circuit)?
- the complete graph $K_4$
+ the complete graph $K_5$
- a path on $5$ vertices ($P_5$)
- any tree
! In $K_n$ every degree is $n - 1$; for $n = 5$ this is even.
```
