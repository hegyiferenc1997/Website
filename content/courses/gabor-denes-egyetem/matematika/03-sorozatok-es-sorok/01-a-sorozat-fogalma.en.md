---
title: Sequences; Arithmetic and Geometric Sequences
summary: Explicit and recursive definitions, terms and sum formulas of arithmetic and geometric sequences.
minutes: 20
---

## What you will learn

- what a **sequence** is and how it can be given by an **explicit** or a **recursive** formula,
- the $n$-th term and the **sum** of the first $n$ terms of **arithmetic** and **geometric** sequences,
- how to plot a sequence as points.

## Sequences

A (real) **sequence** is a function that assigns a real number $a_n$ to every positive integer $n$: $a_1, a_2, a_3, \dots$. $a_n$ is the **$n$-th term** of the sequence.

- **Explicit definition:** a formula in $n$, e.g. $a_n = \dfrac{1}{n}$: $1, \frac{1}{2}, \frac{1}{3}, \dots$
- **Recursive definition:** a term from the previous ones, e.g. the **Fibonacci sequence**: $F_1 = F_2 = 1$, $F_{n} = F_{n-1} + F_{n-2}$: $1, 1, 2, 3, 5, 8, 13, \dots$

The graph of a sequence is not a connected curve but the set of **points** $(n; a_n)$.

```plot
title: The sequences aₙ = 1/n and bₙ = (−1)ⁿ
x: 0, 20
y: -1.5, 1.5
seq: 1/n @ 1, 20 # aₙ = 1/n
seq: (-1)^n @ 1, 20 # bₙ = (−1)ⁿ
```

## Arithmetic sequences

Every term is larger than the previous one by the same amount, the **common difference** $d$: $a_{n+1} = a_n + d$.

$$
a_n = a_1 + (n - 1)d, \qquad S_n = a_1 + \dots + a_n = \frac{n\,(a_1 + a_n)}{2}.
$$

Young Gauss's trick: $1 + 2 + \dots + 100 = \dfrac{100 \cdot 101}{2} = 5050$.

## Geometric sequences

Every term is the same multiple of the previous one, the **common ratio** $q$: $a_{n+1} = a_n \cdot q$.

$$
a_n = a_1 \cdot q^{\,n-1}, \qquad S_n = a_1 \cdot \frac{q^n - 1}{q - 1} \quad (q \neq 1).
$$

Example: compound interest. $100\,000$ HUF at $5\%$ per year becomes $100\,000 \cdot 1.05^n$ HUF after $n$ years; about $162\,889$ HUF after $10$ years.

```plot
title: Geometric sequences with different ratios
x: 0, 15
y: -3, 6
param: q = 0.8, -1.5, 1.5, 0.05
seq: 3 q^(n - 1) @ 1, 15 # aₙ = 3·qⁿ⁻¹
```

Experiment: for $0 < q < 1$ the terms shrink towards $0$, for $q > 1$ they grow, and for negative $q$ the sign alternates.

```python run
# The Fibonacci sequence by recursion, and checking the arithmetic/geometric sum formulas.
fib = [1, 1]
while len(fib) < 15:
    fib.append(fib[-1] + fib[-2])
print("Fibonacci:", fib)

a1, d, n = 3, 4, 20
arithmetic = [a1 + (k - 1) * d for k in range(1, n + 1)]
print(sum(arithmetic), n * (arithmetic[0] + arithmetic[-1]) // 2)

a1, q, n = 2, 3, 10
geometric = [a1 * q ** (k - 1) for k in range(1, n + 1)]
print(sum(geometric), a1 * (q ** n - 1) // (q - 1))
```

## Summary

- Sequence: $n \mapsto a_n$; explicit (formula) or recursive (from previous terms) definition.
- Arithmetic: $a_n = a_1 + (n-1)d$, $S_n = \frac{n(a_1 + a_n)}{2}$.
- Geometric: $a_n = a_1 q^{n-1}$, $S_n = a_1 \frac{q^n - 1}{q - 1}$.

## Lesson exercise

```quiz required
? An arithmetic sequence has first term $5$ and common difference $3$. What is its $20$th term?
= 62
! $a_{20} = 5 + 19 \cdot 3$

? What is the sum $1 + 2 + 3 + \dots + 50$?
= 1275

? A geometric sequence has first term $2$ and ratio $3$. What is its $5$th term?
= 162
! $2 \cdot 3^4$

? What is the $10$th Fibonacci number ($F_1 = F_2 = 1$)?
= 55

? Give the $n$-th term of the sequence $1, 4, 9, 16, 25, \dots$ as a function of $n$.
fn: n -> n^2
domain: 1, 10
```
