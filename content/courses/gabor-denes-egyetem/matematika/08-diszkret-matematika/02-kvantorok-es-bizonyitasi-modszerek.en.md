---
title: Quantifiers and Proof Techniques
summary: The "for all" and "there exists" quantifiers and their negation, direct and indirect proof, and mathematical induction.
minutes: 30
---

## What you will learn

- what the **"for all"** ($\forall$) and **"there exists"** ($\exists$) quantifiers mean, and how to negate them,
- **direct** and **indirect** proof, and the **counterexample**,
- **mathematical induction**, one of the basic tools for proving programs correct.

## Quantifiers

A **predicate** is a statement depending on a variable, e.g. $P(n)$: "$n$ is even". A quantifier turns it into a proposition:

- $\forall n\, P(n)$: true **for all** $n$,
- $\exists n\, P(n)$: **there exists** an $n$ for which it is true.

**Negation:** the quantifier flips, and the negation "moves inside":

$$
\neg \forall x\, P(x) \equiv \exists x\, \neg P(x), \qquad \neg \exists x\, P(x) \equiv \forall x\, \neg P(x).
$$

For example, the negation of "Every student passed the test." is not "Nobody passed", but: "**There is** a student who did **not** pass."

Order matters: $\forall x\, \exists y\, (y > x)$ is true over the reals (there is something bigger than anything), but $\exists y\, \forall x\, (y > x)$ is false (no number is bigger than everything).

## Proof techniques

- **Direct proof:** go step by step from the hypothesis to the claim. For example: if $n$ is odd, $n = 2k + 1$, then $n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1$ is odd too.
- **Contrapositive:** instead of $P \rightarrow Q$, prove $\neg Q \rightarrow \neg P$.
- **Indirect proof (by contradiction):** assume the claim is false and reach a contradiction. Classic example: $\sqrt 2$ is irrational. If $\sqrt 2 = \frac{p}{q}$ (a fully reduced fraction), then $p^2 = 2q^2$, so $p$ is even, $p = 2r$, hence $q^2 = 2r^2$, so $q$ is even too, contradicting that the fraction is reduced.
- **Counterexample:** **one** counterexample is enough to refute a "for all" claim. "Every number of the form $n^2 + n + 41$ is prime" is false, because for $n = 40$, $40^2 + 40 + 41 = 41^2$.

## Mathematical induction

To prove that $P(n)$ holds for every integer $n \geq 1$, it is enough to show two things:

1. **Base case:** $P(1)$ is true.
2. **Inductive step:** if $P(n)$ is true (induction hypothesis), then $P(n + 1)$ is true too.

It is like a row of dominoes: the first one falls, and each one knocks over the next.

**Example.** $1 + 2 + \dots + n = \frac{n(n + 1)}{2}$.

- $n = 1$: $1 = \frac{1 \cdot 2}{2}$. ✓
- If it holds for $n$, then $1 + \dots + n + (n + 1) = \frac{n(n + 1)}{2} + (n + 1) = \frac{(n + 1)(n + 2)}{2}$, which is exactly the claim for $n + 1$. ✓

```plot
title: The sums 1 + 2 + … + n and the parabola n(n + 1)/2
x: 0, 21
y: 0, 230
seq: sum(k, 1, n, k) @ 1, 20 # 1 + 2 + … + n
dash: x (x + 1)/2 # n(n + 1)/2
```

Induction appears in programming too: a loop **invariant** is a statement that holds before the loop (base case) and is preserved by every iteration (inductive step). The correctness of recursive functions is also proved by induction.

```python run
# Checking the formulas proved by induction for the first few n (this is of course not a proof!)
for n in range(1, 8):
    s1 = sum(range(1, n + 1))
    s2 = sum(2 * k - 1 for k in range(1, n + 1))
    s3 = sum(k * k for k in range(1, n + 1))
    print(n, s1 == n * (n + 1) // 2, s2 == n * n, s3 == n * (n + 1) * (2 * n + 1) // 6)
```

## Summary

- $\neg\forall \equiv \exists\neg$, $\neg\exists \equiv \forall\neg$; the order of quantifiers matters.
- Direct, contrapositive and indirect proof; one counterexample refutes a "for all" claim.
- Induction: base case + "$n$ implies $n + 1$".

## Lesson exercise

```quiz required
? What is the negation of "Every prime number is odd."?
- Every prime number is even.
- There is no odd prime number.
+ There is a prime number that is not odd.
- There is an odd number that is not prime.
! $\neg\forall x\, P(x) \equiv \exists x\, \neg P(x)$ (and indeed: $2$).

? Which statement is **true** over the integers?
+ $\forall x\, \exists y\, (x + y = 0)$
- $\exists y\, \forall x\, (x + y = 0)$
- $\forall x\, \forall y\, (x + y = 0)$
- $\exists x\, \forall y\, (x < y)$

? What is the smallest $n \geq 1$ for which $n^2 + n + 41$ is **not** prime?
= 40

? By induction: $1 + 3 + 5 + \dots + (2n - 1) = \;?$ Enter it as a function of $n$!
fn: n -> n^2
domain: 1, 10

? By induction: $1^2 + 2^2 + \dots + n^2 = \;?$ Enter it as a function of $n$!
fn: n -> n (n + 1) (2n + 1)/6
domain: 1, 10
! For $n = 1, 2, 3$ the sum is $1, 5, 14$.

? What are the two steps of a proof by induction?
- just try enough values of $n$
+ base case: $P(1)$; inductive step: $P(n) \Rightarrow P(n + 1)$
- assume it is false and reach a contradiction
- $P(n + 1) \Rightarrow P(n)$ for every $n$
```
