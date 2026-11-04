---
title: Combinatorics
summary: Counting: the product and sum rules, permutations, variations and combinations, with and without repetition.
minutes: 30
---

## What you will learn

- the two basic rules of counting (**product** and **sum**),
- **permutations**, **variations** (ordered selections) and **combinations**, with and without repetition,
- how to decide: **does order matter**, and **is repetition allowed**.

## Basic rules

- **Product rule:** if a choice consists of two consecutive steps with $m$ options for the first and $n$ for the second, there are $m \cdot n$ options in total. For example, $3$ T-shirts and $4$ pairs of trousers: $12$ outfits.
- **Sum rule:** if the options split into two **disjoint** groups (of $m$ and $n$ elements), there are $m + n$ in total.

Which "branch" of combinatorics applies depends on two questions: **does order matter**, and **can an element repeat**.

|                        | Order matters                     | Order does not matter                                   |
| ---------------------- | --------------------------------- | ------------------------------------------------------- |
| **without repetition** | variation: $\dfrac{n!}{(n - k)!}$ | combination: $\dbinom{n}{k} = \dfrac{n!}{k!\,(n - k)!}$ |
| **with repetition**    | variation with repetition: $n^k$  | combination with repetition: $\dbinom{n + k - 1}{k}$    |

Here $n$ is the number of elements to choose from and $k$ the number chosen. $n! = 1 \cdot 2 \cdots n$ ("$n$ factorial"), and $0! = 1$.

## Permutations

All orderings of $n$ different elements: $P_n = n!$. For example, $5$ books on a shelf can be arranged in $5! = 120$ ways.

**Permutations with repetition:** if some elements are identical ($k_1, k_2, \dots$ of each), the count is $\dfrac{n!}{k_1!\,k_2!\cdots}$. For example, the letters of TATA form $\frac{4!}{2!\,2!} = 6$ different "words".

## Variations and combinations

- **Variation** (order matters): the top three of $10$ runners can finish in $10 \cdot 9 \cdot 8 = 720$ ways.
- **Variation with repetition:** a $4$-digit PIN has $10^4 = 10\,000$ possibilities. An $n$-bit word has $2^n$ values, which is why a byte has $2^8 = 256$ values.
- **Combination** (order does not matter): the Hungarian 5-out-of-90 lottery has $\binom{90}{5} = 43\,949\,268$ possible tickets.
- **Combination with repetition:** $3$ scoops from $4$ flavours can be ordered in $\binom{4 + 3 - 1}{3} = 20$ ways (order does not matter, a flavour can repeat).

Try it with the sliders! The dots show what share of the $2^N$ subsets of an $N$-element set has $k$ elements, for every $k$; the exact counts are below.

```plot
title: Combinatorics calculator
x: -1, 21
y: 0, 0.6
param: N = 10, 1, 20, 1
param: K = 3, 0, 20, 1
seq: binom(N, n)/2^N @ 0, 20 # share of k-element subsets: (N choose k)/2^N
value: N! = fact(N)
value: variation = binom(N, K) * fact(K)
value: combination = binom(N, K)
value: variation with repetition = N^K
value: combination with repetition = binom(N + K - 1, K)
```

Notice that the values $\binom{n}{k}$ are **symmetric** ($\binom{n}{k} = \binom{n}{n - k}$) and largest in the middle.

```python run
from itertools import permutations, combinations, product
from math import comb, perm
# itertools lists them, math computes them: the two agree
items = "ABCD"
print("permutations:", len(list(permutations(items))), "=", perm(4))
print("2-variations:", len(list(permutations(items, 2))), "=", perm(4, 2))
print("2-combinations:", [''.join(c) for c in combinations(items, 2)], "=", comb(4, 2))
print("2-variations with repetition:", len(list(product(items, repeat=2))), "=", 4**2)
```

## Summary

- Product rule: consecutive steps; sum rule: disjoint cases.
- Order matters: variation ($\frac{n!}{(n-k)!}$, with repetition $n^k$); it does not: combination ($\binom{n}{k}$, with repetition $\binom{n+k-1}{k}$).
- Permutations: $n!$; with identical elements $\frac{n!}{k_1!\,k_2!\cdots}$.

## Lesson exercise

```quiz required
? In how many orders can $6$ people sit on a bench?
= 720

? How many different "words" can be formed from all the letters of MATEMATIKA?
= 151200
! $10$ letters: M twice, A three times, T twice: $\frac{10!}{2!\,3!\,2!}$.

? In how many ways can we choose a $3$-person delegation from a group of $20$ (order does not matter)?
= 1140

? In how many ways can we choose a president, a secretary and a treasurer (different people) from a group of $20$?
= 6840

? How many different $8$-character passwords are there if every character is one of the $26$ lowercase letters? (You can also enter it as a power: 26^8.)
= 208827064576
= 26^8

? Which formula gives the number of ways to put $5$ identical balls into $3$ different boxes?
- $3^5$
- $\binom{5}{3}$
+ $\binom{7}{5}$
- $\frac{5!}{3!}$
! Combination with repetition: $n = 3$ boxes, $k = 5$ balls, $\binom{n + k - 1}{k}$.
```
