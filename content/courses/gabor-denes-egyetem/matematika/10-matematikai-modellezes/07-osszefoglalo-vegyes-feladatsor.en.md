---
title: Summary – Mixed Problem Set
summary: A mixed set of problems from the whole course, with tips for revision.
minutes: 70
kind: practice
---

## Tips for revision

<details>
<summary>1. How should you revise?</summary>

Topic by topic: first review the **summaries** of the lessons, then redo the worksheets of the **practice lessons** **without help**. Where you get stuck, reread the lesson. With the interactive plots you remember the "why", not just the formula.

</details>

<details>
<summary>2. How should you check your solution?</summary>

Write down every step, and **check** at the end: an integral by differentiating, the solution of an equation or a differential equation by substituting, a calculation with an order-of-magnitude estimate.

</details>

<details>
<summary>3. What are the most common mistakes?</summary>

Forgetting the $+C$ in an indefinite integral; dropping the inner derivative in the chain rule; skipping the check of the domain and of extraneous roots in square-root and logarithmic equations; mixing up area and signed integral; "simplifying" "$\frac{\infty}{\infty}$" to $1$ in a limit.

</details>

## Mixed problem set

```quiz required
? What is $\log_2 32 + \lg 0.01$?
= 3

? Solve: $2^{x + 1} = 16$.
= 3

? $\lvert A \rvert = 12$, $\lvert B \rvert = 9$, $\lvert A \cap B \rvert = 4$. What is $\lvert A \cup B \rvert$?
= 17

? What is $\displaystyle\lim_{n \to \infty} \frac{3n^2 + 1}{n^2 - 5n}$?
= 3

? What is the sum of the series $\displaystyle\sum_{k=0}^{\infty} \left(\frac{1}{2}\right)^k$?
= 2

? Differentiate: $f(x) = x^2 \sin x$.
fn: x -> 2x sin(x) + x^2 cos(x)

? Where is the local minimum of $f(x) = x^3 - 3x$ (its $x$ coordinate)?
= 1

? What is $\displaystyle\int_0^\pi \sin x\,dx$?
= 2

? Compute: $\displaystyle\int x\cos x\,dx$.
fn: x -> x sin(x) + cos(x)
+C
! Integration by parts: $u = x$, $v' = \cos x$.

? Give the second-degree Taylor polynomial of $\cos x$ around $0$!
fn: x -> 1 - x^2/2
domain: -1, 1

? Which statement is true for the Fourier series of a $2\pi$-periodic **even** function?
- it contains only sine terms
+ it contains only cosine terms (and $\frac{a_0}{2}$)
- all of its coefficients are zero
- it contains only odd-indexed terms

? In how many ways can we choose $2$ people out of $6$ (order does not matter)?
= 15

? Solve: $y' = -3y$, $y(0) = 2$.
fn: x -> 2 e^(-3x)
domain: -1, 1
```

## More practice exercises (optional)

These exercises are optional, but the more you solve, the more confident you'll become. For the programming exercises, write the function, then run the check; each one has a solution – try it yourself first, and only then look!

### Calculation programming exercises

**1.** **Regression line.** Write the function `regression(xs, ys)`, which returns the pair `(m, b)` of the line $y = mx + b$ fitted by least squares, rounded to 3 decimals! ($m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}$, $b = \bar y - m \bar x$.)

```python starter
def regression(xs, ys):
    m = (ys[-1] - ys[0]) / (xs[-1] - xs[0])
    return (round(m, 3), round(ys[0] - m * xs[0], 3))
```

<details>
<summary>Solution</summary>

The starter code just draws a line through the first and last points – it ignores the measurements in between.

```python solution
def regression(xs, ys):
    n = len(xs)
    xa, ya = sum(xs) / n, sum(ys) / n     # means
    m = sum((x - xa) * (y - ya) for x, y in zip(xs, ys)) / sum((x - xa) ** 2 for x in xs)
    return (round(m, 3), round(ya - m * xa, 3))
```

</details>

```python test
assert regression([1, 2, 3], [2, 4, 6]) == (2.0, 0.0)
assert regression([0, 1, 2, 3], [1, 3, 2, 5]) == (1.1, 1.1)
assert regression([1, 2, 3, 4, 5], [2.1, 3.9, 6.2, 7.8, 10.1]) == (1.99, 0.05)
print("All checks passed!")
```

**2.** **Logistic growth.** Write the function `logistic(K, N0, r, t)`, which returns the value of $N(t) = \dfrac{K}{1 + \frac{K - N_0}{N_0} e^{-rt}}$ rounded to 1 decimal, and the function `time_to_reach(K, N0, r, ratio)`, which tells when the population reaches the given fraction of `K` (e.g. `0.5` → half, that's the inflection point), rounded to 2 decimals!

```python starter
import math

def logistic(K, N0, r, t):
    return round(N0 * math.exp(r * t), 1)

def time_to_reach(K, N0, r, ratio):
    return 0
```

<details>
<summary>Solution</summary>

The starter code computes exponentially: at $t = 40$ it would give $4.8$ billion instead of the limit of a thousand.

```python solution
import math

def logistic(K, N0, r, t):
    A = (K - N0) / N0
    return round(K / (1 + A * math.exp(-r * t)), 1)

def time_to_reach(K, N0, r, ratio):
    # ratio = 1 / (1 + A·e^(−rt))  →  e^(−rt) = (1/ratio − 1) / A
    A = (K - N0) / N0
    return round(-math.log((1 / ratio - 1) / A) / r, 2)
```

</details>

```python test
assert logistic(1000, 10, 0.5, 0) == 10.0
assert logistic(1000, 10, 0.5, 10) == 599.9
assert logistic(1000, 10, 0.5, 40) == 1000.0
assert time_to_reach(1000, 10, 0.5, 0.5) == 9.19
assert time_to_reach(1000, 10, 0.5, 0.9) == 13.58
print("All checks passed!")
```

**3.** **Linear programming with vertices.** The optimum of an LP problem is at one of the vertices of the feasible region. Write the function `best_vertex(vertices, c1, c2)`, which returns, from the list of `(x, y)` vertices, the one where the objective $c_1 x + c_2 y$ is **maximal**, together with the value of the objective: `((x, y), value)`!

```python starter
def best_vertex(vertices, c1, c2):
    return (vertices[0], c1 * vertices[0][0] + c2 * vertices[0][1])
```

<details>
<summary>Solution</summary>

If the coefficients of the objective change (e.g. a product gets more expensive), another vertex can become optimal – that's what sensitivity analysis examines.

```python solution
def best_vertex(vertices, c1, c2):
    best = max(vertices, key=lambda p: c1 * p[0] + c2 * p[1])   # evaluate every vertex
    return (best, c1 * best[0] + c2 * best[1])
```

</details>

```python test
vertices = [(0, 0), (40, 0), (30, 20), (0, 35)]
assert best_vertex(vertices, 3, 4) == ((30, 20), 170)
assert best_vertex(vertices, 5, 1) == ((40, 0), 200)
assert best_vertex(vertices, 1, 3) == ((0, 35), 105)
print("All checks passed!")
```

### Quick check questions

```quiz
? A bacterial culture grows by 20% per hour. In how many hours does it double? (rounded to a whole hour, $\frac{\ln 2}{\ln 1.2}$)
= 4
! $\frac{0.693}{0.182} \approx 3.8 \approx 4$ hours.

? In a logistic model $K = 5000$. At how many individuals is the growth fastest?
= 2500
! The inflection point is at $K/2$.

? Which grows fastest?
- $n^3$
- $n \log n$
+ $2^n$
- $n^{10}$
! The exponential function eventually overtakes every polynomial.

? The regression line is $y = 2x + 3$. What does it predict for $x = 10$?
= 23
! $2 \cdot 10 + 3 = 23$.

? About how many steps does an $O(\log_2 n)$ algorithm (e.g. binary search) take on $n = 1\,000\,000$ elements?
= 20
! $\log_2 10^6 \approx 19.9$.
```
