---
title: Deeper – Limits and Series in Numbers
summary: Finding the threshold index by machine and an ε-band with a slider, a race between two approximations of e, the partial sums of the geometric, harmonic and alternating harmonic series, and a recursive sequence (Babylonian square root) that doubles the number of correct digits at every step.
minutes: 40
---

## What you will learn in this lesson

- what the threshold index means **in practice**, and how it depends on $\varepsilon$,
- that two sequences tending to the same limit can approach it at **very different speeds**,
- how the partial sums of the well-known series behave, and why the harmonic series is **deceptive**,
- how a calculator computes a square root with a **recursive sequence**.

## 1. The threshold index made tangible

The limit of the sequence $a_n = \dfrac{2n + 1}{n + 3}$ is $2$. By definition this means: for **any small** $\varepsilon > 0$ there is a threshold index $N$ such that $|a_n - 2| < \varepsilon$ for $n \geq N$. Let's find this $N$ by machine!

```python run
# Finding the threshold index: a_n = (2n + 1) / (n + 3) → 2; from when is |a_n − 2| < ε?
def a(n):
    return (2 * n + 1) / (n + 3)

for eps in [0.1, 0.01, 0.001]:
    n = 1
    while abs(a(n) - 2) >= eps:          # the first index from which we're inside the ε-band
        n += 1
    print(f"ε = {eps:<6}: N = {n:>5}  (a_N = {a(n):.5f})")
```

On paper: $|a_n - 2| = \left|\dfrac{2n + 1 - 2n - 6}{n + 3}\right| = \dfrac{5}{n + 3}$, and this is smaller than $\varepsilon$ if $n > \dfrac{5}{\varepsilon} - 3$. So for $\varepsilon = 0.1$, $N = 48$, and for $\varepsilon = 0.01$, $N = 498$ – exactly what the machine found. If you reduce $\varepsilon$ to a tenth, the threshold index grows roughly tenfold.

```plot
title: The terms of the sequence and the ε-band
x: 0, 60
y: 0, 2.6
param: h = 0.2, 0.02, 0.6, 0.01
seq: (2n + 1)/(n + 3) @ 1, 60
dash: 2 + h # 2 + ε
dash: 2 - h # 2 − ε
```

Move the slider: the band narrows, and the terms enter it later and later – but **from some point on they always** stay inside. That's the essence of convergence.

## 2. Two approximations of e: which finishes first?

The number $e \approx 2.71828$ can be obtained as a limit in two ways:

$$
e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = \sum_{k=0}^{\infty} \frac{1}{k!}.
$$

Both converge, but look at the errors:

```python run
# Two approximations of e: (1 + 1/n)^n and 1 + 1/1! + 1/2! + … + 1/n!
import math

power, fact, total = 1.0, 1, 1.0
print(f"{'n':>3} | {'error of (1 + 1/n)^n':>20} | {'error of Σ 1/k!':>15}")
for n in range(1, 13):
    fact *= n
    total += 1 / fact
    if n in (1, 2, 5, 8, 12):
        power = (1 + 1 / n) ** n
        print(f"{n:>3} | {math.e - power:>20.2e} | {math.e - total:>15.2e}")
```

At $n = 12$ the first approximation is accurate only to the first decimal (error $\approx 0.1$), the second to **ten** decimals already! The error of $(1 + \frac1n)^n$ is about $\frac{e}{2n}$, so it decreases slowly, like $\frac1n$; the error of the factorial series, however, is of the order of the next term, $\frac{1}{(n+1)!}$, which vanishes lightning-fast. In practice (calculators, program libraries) the **fast-converging** form is therefore always used.

## 3. Series: do they converge?

```python run
# The behaviour of series: geometric, harmonic, alternating harmonic
import math

def partial_sum(term, n):
    return sum(term(k) for k in range(1, n + 1))

for n in [10, 100, 10_000]:
    g = partial_sum(lambda k: 1 / 2 ** k, n)
    h = partial_sum(lambda k: 1 / k, n)
    alt = partial_sum(lambda k: (-1) ** (k + 1) / k, n)
    print(f"n = {n:>6}: Σ 1/2^k = {g:.6f} | Σ 1/k = {h:7.3f} | Σ (−1)^(k+1)/k = {alt:.6f}")

# How many terms does the harmonic series need to exceed 10?
s, k = 0.0, 0
while s <= 10:
    k += 1
    s += 1 / k
print(f"\nthe harmonic series exceeds 10 after {k} terms; ln 2 = {math.log(2):.6f}")
```

- The **geometric series** $\sum \frac{1}{2^k}$ approaches $1$ very quickly (the formula $\frac{q}{1 - q}$, with $q = \frac12$).
- The terms of the **harmonic series** $\sum \frac1k$ do tend to $0$, but the sum **tends to infinity** (it diverges)! Only very slowly: even after $10{,}000$ terms it's only about $9.8$, and it exceeds $10$ after $12{,}367$ terms. A computer "experiment" could easily suggest that it converges – that's why a mathematical proof is needed (e.g. grouping the terms: $\frac13 + \frac14 > \frac12$, $\frac15 + \ldots + \frac18 > \frac12$, …).
- The **alternating harmonic series** $\sum \frac{(-1)^{k+1}}{k}$, on the other hand, converges (Leibniz criterion), to $\ln 2 \approx 0.693147$ – but slowly: even after $10{,}000$ terms only 4 digits are correct.

Lesson: the condition $\lim a_k = 0$ is **necessary** but **not sufficient** for convergence.

## 4. A recursive sequence inside the calculator

How does the machine compute $\sqrt{2}$? One of the oldest methods (already known to the Babylonians) is a **recursive sequence**:

$$
a_0 = 1, \qquad a_{n+1} = \frac{1}{2}\left(a_n + \frac{2}{a_n}\right).
$$

The idea: if $a_n$ is too large, then $\frac{2}{a_n}$ is too small – the average of the two is a better approximation.

```python run
# Recursive sequence: the Babylonian method for √2, a_(n+1) = (a_n + 2/a_n) / 2
import math

a = 1.0
for n in range(6):
    error = abs(a - math.sqrt(2))
    print(f"a_{n} = {a:.15f}   error: {error:.1e}")
    a = (a + 2 / a) / 2                    # the next term from the previous one
```

The error is **squared** at every step: $10^{-3}$ → $10^{-6}$ → $10^{-12}$, that is, the number of correct digits **doubles** at every step. After five steps the machine's full precision is reached. (This method is a special case of Newton's method, which you'll meet in differential calculus.) If the sequence converges, its limit satisfies the equation $A = \frac12\left(A + \frac2A\right)$, from which $A^2 = 2$ – this proves it really tends to $\sqrt2$.

## Summary

- Threshold index: $|a_n - A| < \varepsilon$ for every $n \geq N$; a smaller $\varepsilon$ needs a larger $N$.
- Sequences tending to the same limit can have very different speeds: $(1 + \frac1n)^n$ is slow, $\sum \frac{1}{k!}$ fast.
- The harmonic series diverges, although it grows very slowly; the alternating harmonic series tends to $\ln 2$.
- The recursive sequence of the Babylonian method doubles the correct digits at every step.

## Lesson exercise

```quiz required
? For the sequence $a_n = \dfrac{1}{n}$, what is the smallest $N$ such that $|a_n - 0| < 0.01$ for $n \geq N$?
= 101
! $\frac1n < 0.01 \iff n > 100$.

? What is the sum of the series $\displaystyle\sum_{k=1}^{\infty} \frac{1}{3^k}$?
= 0.5
= 0,5
= 1/2
! Geometric series: $\frac{q}{1 - q} = \frac{1/3}{2/3} = \frac12$.

? Which statement is true for the harmonic series ($\sum \frac1k$)?
- it converges, because its terms tend to $0$
+ it diverges, although its terms tend to $0$
- its sum is $\ln 2$
- its sum is $2$
! $\lim a_k = 0$ is a necessary but not sufficient condition.

? Compute $\sqrt{9}$ with the Babylonian method from $a_0 = 1$: $a_{n+1} = \frac12\left(a_n + \frac{9}{a_n}\right)$. What is $a_1$?
= 5
! $\frac12(1 + 9) = 5$

? What is the limit $\lim\limits_{n \to \infty} \left(1 + \frac{1}{n}\right)^{2n}$? (Type it approximately, to two decimals.)
= 7.39
= 7,39
! $\left(\left(1 + \frac1n\right)^n\right)^2 \to e^2 \approx 7.39$.
```
