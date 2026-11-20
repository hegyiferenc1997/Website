---
title: Practice – Sequences and Series
summary: Review questions and a summary worksheet on sequences, limits and series.
minutes: 55
kind: practice
---

## Review questions

<details>
<summary>1. Can a sequence be bounded but divergent? Monotonic but divergent?</summary>

Yes, both: $(-1)^n$ is bounded but divergent (it oscillates); $a_n = n$ is monotonic but divergent (tends to $+\infty$). Only a **monotonic and bounded** sequence is guaranteed to converge.

</details>

<details>
<summary>2. Why isn't it enough that the terms of a series tend to 0?</summary>

Because the terms may shrink "slowly" enough for the sum to be infinite anyway: the terms of the harmonic series $\sum \frac{1}{n}$ tend to $0$, but after grouping every block adds up to at least $\frac{1}{2}$.

</details>

<details>
<summary>3. What do you do with a rational expression of the form ∞/∞?</summary>

Divide by the highest power of $n$ in the denominator. With equal degrees the limit is the ratio of the leading coefficients, with a higher denominator degree it is $0$, with a higher numerator degree $\pm\infty$.

</details>

<details>
<summary>4. Where does the geometric series appear in computing?</summary>

For example in the cost of algorithms: if a dynamic array always doubles, the total cost of copying is $n + \frac{n}{2} + \frac{n}{4} + \dots \leq 2n$, i.e. one insertion takes constant time on average.

</details>

## Summary worksheet

```quiz required
? In an arithmetic sequence $a_3 = 11$ and $a_8 = 31$. What is $a_1$?
= 3
! $5d = 20$, so $d = 4$.

? A geometric sequence has first term $3$, the sum of its first three terms is $39$, and the ratio is positive. What is the ratio?
= 3
! $3(1 + q + q^2) = 39 \Rightarrow q^2 + q - 12 = 0$

? What is $\lim\limits_{n\to\infty} \dfrac{(2n + 1)^2}{3n^2 - n}$? (As a fraction or decimal.)
= 4/3
! The leading coefficients: $4$ and $3$.

? What is $\lim\limits_{n\to\infty} \left(\sqrt{n^2 + n} - \sqrt{n^2 - n}\right)$?
= 1
! Multiply by the sum: $\frac{2n}{\sqrt{n^2 + n} + \sqrt{n^2 - n}}$.

? What is $\lim\limits_{n\to\infty} \left(1 + \dfrac{3}{n}\right)^n$? (Round to two decimals!)
= 20.09

? What is the sum of $\sum\limits_{n=1}^{\infty} \dfrac{1}{3^n}$? (As a fraction or decimal.)
= 1/2
! The first term is $\frac{1}{3}$, the ratio is $\frac{1}{3}$.

? Which series diverges?
- $\sum \frac{1}{2^n}$
- $\sum \frac{(-1)^n}{n}$
- $\sum \frac{1}{n^2 + 1}$
+ $\sum \frac{2n}{n + 5}$
! The terms don't tend to $0$.

? Which sequence is **strictly decreasing**?
+ $a_n = \frac{n + 3}{n}$
- $a_n = \frac{n}{n + 3}$
- $a_n = (-1)^n$
- $a_n = n^2 - 4n$
! $a_n = 1 + \frac{3}{n}$
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Sum of an arithmetic sequence.** Write the function `arithmetic_sum(a1, d, n)`, which returns the sum of the first `n` terms – without a loop, with the formula!

```python starter
def arithmetic_sum(a1, d, n):
    return a1 * n
```

<details>
<summary>Solution</summary>

Gauss's trick: the first and the last, the second and the second-to-last term always add up to the same.

```python solution
def arithmetic_sum(a1, d, n):
    an = a1 + (n - 1) * d                 # the n-th term
    return n * (a1 + an) / 2              # (first + last) · n / 2
```

</details>

```python test
assert arithmetic_sum(1, 1, 100) == 5050
assert arithmetic_sum(3, 4, 10) == 210
assert arithmetic_sum(10, -2, 6) == 30
print("All checks passed!")
```

**2.** **Sum of a geometric sequence.** Write the function `geometric_sum(a1, q, n)`, which returns the sum of the first `n` terms rounded to 6 decimals! Watch out for the case $q = 1$!

```python starter
def geometric_sum(a1, q, n):
    return round(a1 * (q ** n - 1) / (q - 1), 6)
```

<details>
<summary>Solution</summary>

The starter code would divide by zero when $q = 1$.

```python solution
def geometric_sum(a1, q, n):
    if q == 1:
        return round(a1 * n, 6)           # every term is a1
    return round(a1 * (q ** n - 1) / (q - 1), 6)
```

</details>

```python test
assert geometric_sum(1, 2, 10) == 1023
assert geometric_sum(1, 0.5, 3) == 1.75
assert geometric_sum(5, 1, 4) == 20
assert geometric_sum(2, -1, 5) == 2
print("All checks passed!")
```

**3.** **Threshold index.** Write the function `threshold(eps)`, which returns the smallest `N` for which $\frac{1}{N^2} < \varepsilon$ (from there on the sequence $a_n = \frac{1}{n^2}$ stays inside the $\varepsilon$-band)!

```python starter
def threshold(eps):
    return 1
```

<details>
<summary>Solution</summary>

On paper: $N^2 > \frac{1}{\varepsilon}$, that is, $N > \frac{1}{\sqrt{\varepsilon}}$. For $\varepsilon = 0.01$, $N > 10$, so $N = 11$ ($10$ is just not good enough, because $\frac{1}{100}$ is not less than $0.01$).

```python solution
def threshold(eps):
    N = 1
    while 1 / N ** 2 >= eps:              # while we're not inside the band, step on
        N += 1
    return N
```

</details>

```python test
assert threshold(0.5) == 2
assert threshold(0.01) == 11
assert threshold(0.0001) == 101
print("All checks passed!")
```

### Quick check questions

```quiz
? What is $\lim\limits_{n \to \infty} \dfrac{3n^2 + 1}{n^2 - 5}$?
= 3
! The ratio of the leading coefficients: $\frac31$.

? What is the sum of the series $\displaystyle\sum_{k=0}^{\infty} \left(\frac{2}{3}\right)^k$?
= 3
! $\frac{1}{1 - q} = \frac{1}{1/3} = 3$.

? In an arithmetic sequence $a_1 = 7$, $d = 3$. What is $a_{20}$?
= 64
! $a_{20} = 7 + 19 \cdot 3 = 64$.

? Which series converges?
- $\sum \frac{1}{k}$
+ $\sum \frac{1}{k^2}$
- $\sum 1$
- $\sum \sqrt{k}$
! $\sum \frac{1}{k^2} = \frac{\pi^2}{6}$.

? What is $\lim\limits_{n \to \infty} \left(1 + \frac{3}{n}\right)^n$? (to two decimals)
= 20,09
= 20.09
! $e^3 \approx 20.09$.
```
