---
title: Practice – Sequences and Series
summary: Review questions and a summary worksheet on sequences, limits and series.
minutes: 30
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
