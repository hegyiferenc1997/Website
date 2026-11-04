---
title: The Growth of Algorithms' Running Time
summary: Big O notation, the typical growth classes (log n, n, n log n, n², 2ⁿ), comparison with limits, and what this means in practice.
minutes: 25
---

## What you will learn

- what **big O notation** means,
- the typical **growth classes**, and which algorithm belongs to which,
- how to compare two functions with **limits**,
- why the growth class matters more than the speed of the machine.

## Big O notation

The running time of an algorithm depends on the input size $n$. We care about the behaviour for **large $n$**, without constant factors. $f(n) = O(g(n))$ if there are $c > 0$ and $n_0$ such that

$$
f(n) \leq c \cdot g(n) \quad \text{for every } n \geq n_0.
$$

For example, $3n^2 + 5n + 7 = O(n^2)$, because for $n \geq 1$, $3n^2 + 5n + 7 \leq 15n^2$. The practical rule: keep the **fastest-growing term**, without its coefficient.

**With limits:** if $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$, then $f$ grows more slowly (and $f = O(g)$). This proves the ordering (from the topic on sequences): for every $a > 0$, $\frac{\log n}{n^a} \to 0$ and $\frac{n^k}{2^n} \to 0$.

## Typical classes

| Class         | Name           | Example                                                    |
| ------------- | -------------- | ---------------------------------------------------------- |
| $O(1)$        | constant       | accessing an array element by index                        |
| $O(\log n)$   | logarithmic    | binary search in a sorted array                            |
| $O(n)$        | linear         | linear search, summing                                     |
| $O(n \log n)$ | "linearithmic" | good sorting algorithms (merge sort, quicksort on average) |
| $O(n^2)$      | quadratic      | two nested loops, bubble sort                              |
| $O(2^n)$      | exponential    | checking every subset                                      |
| $O(n!)$       | factorial      | checking every ordering (naive travelling salesman)        |

```plot
title: Growth classes
x: 0, 20
y: 0, 100
param: N = 10, 1, 20, 1
f: log2(x) # log₂ n
f: x # n
f: x log2(x) # n log₂ n
f: x^2 # n²
f: 2^x # 2ⁿ
value: log₂ N = log2(N)
value: N log₂ N = N log2(N)
value: N² = N^2
value: 2^N = 2^N
```

Already at $N = 20$, $2^{20} \approx 10^6$, while $N^2 = 400$. If a machine does $10^9$ steps per second, a $2^n$ algorithm would run for decades at $n = 60$, while an $n \log n$ one finishes in seconds even for $n = 10^9$. **A better algorithm is worth more than a faster machine.**

```python run
import math
# Binary search: how many steps for n elements? (≈ log₂ n)
def binary_search(arr, target):
    lo, hi, steps = 0, len(arr) - 1, 0
    while lo <= hi:
        steps += 1
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid, steps
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1, steps

for n in [10, 1000, 1_000_000]:
    arr = list(range(n))
    _, steps = binary_search(arr, n - 1)
    print(f"n = {n:>9}: {steps:>2} steps, log2(n) ≈ {math.log2(n):.1f}")
```

## Summary

- $f = O(g)$: from some point on, $f \leq c\,g$; the dominant term matters, the coefficient does not.
- Order: $1 < \log n < n < n\log n < n^2 < 2^n < n!$.
- Comparison: if $\lim \frac{f}{g} = 0$, $f$ grows more slowly.

## Lesson exercise

```quiz required
? At most how many steps does binary search need in a sorted array of $1\,000\,000$ elements?
= 20
! $2^{20} = 1\,048\,576 \geq 10^6$.

? An $O(n^2)$ algorithm runs for $1$ second with $n = 1000$. Roughly how many seconds does it run with $n = 3000$?
= 9

? Which one is true?
+ $3n^2 + 100n\log n + 7 = O(n^2)$
- $n^2 = O(n \log n)$
- $2^n = O(n^{10})$
- $n \log n = O(n)$

? Which is the correct order, from slowest-growing to fastest-growing?
- $n$, $\log n$, $n^2$, $n\log n$, $2^n$
+ $\log n$, $n$, $n\log n$, $n^2$, $2^n$
- $\log n$, $n\log n$, $n$, $2^n$, $n^2$
- $n$, $n\log n$, $\log n$, $n^2$, $2^n$

? How many times does the inner statement run: `for i in range(n): for j in range(i): ...`? Enter it as a function of $n$!
fn: n -> n (n - 1)/2
domain: 1, 20
! $0 + 1 + \dots + (n - 1)$

? For an $O(2^n)$ algorithm, what happens to the running time when $n$ grows by one?
- it grows by one
+ it (roughly) doubles
- it gets squared
- it does not change
```
