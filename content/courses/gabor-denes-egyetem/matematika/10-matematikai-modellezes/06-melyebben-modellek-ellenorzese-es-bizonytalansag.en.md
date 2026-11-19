---
title: Deeper – Validating Models and Uncertainty
summary: Overfitting (why the polynomial through every point is bad), comparing exponential and logistic forecasts with a slider, the growth of algorithms in counted steps, and a Monte Carlo simulation of a project's duration from uncertain estimates.
minutes: 40
---

## What you will learn in this lesson

- why the best model is not the one that **fits** the measured data **best**,
- why it's dangerous to forecast **far** ahead with an exponential model,
- that big O notation shows up in practice in steps you can **count**,
- how to compute with **uncertain** estimates (and why projects run late).

## 1. Overfitting: the model that's too good

We measure 8 points from a relationship that is really $y = 2x + 1$, but the measurement is noisy. We fit two models: a **line** (least squares), and a degree-seven **polynomial** that passes exactly through all 8 points.

```python run
# Overfitting: a line and a polynomial through every point, on the same noisy measurements
import random

r = random.Random(3)
x_train = list(range(8))                                     # 8 "training" measurements
y_train = [2 * x + 1 + r.gauss(0, 1) for x in x_train]         # really y = 2x + 1, with noise

# 1) least-squares line
n = len(x_train)
xa, ya = sum(x_train) / n, sum(y_train) / n
m = sum((x - xa) * (y - ya) for x, y in zip(x_train, y_train)) / sum((x - xa) ** 2 for x in x_train)
line = lambda x: ya + m * (x - xa)

# 2) Lagrange interpolation: a degree-7 polynomial that passes EXACTLY through all 8 points
def polynomial(x):
    s = 0.0
    for i, (xi, yi) in enumerate(zip(x_train, y_train)):
        l = 1.0
        for j, xj in enumerate(x_train):
            if j != i:
                l *= (x - xj) / (xi - xj)
        s += yi * l
    return s

def mean_error(model, xs):                                  # mean deviation from the true 2x + 1
    return sum(abs(model(x) - (2 * x + 1)) for x in xs) / len(xs)

print(f"line: y = {m:.2f}x + {ya - m * xa:.2f}")
print(f"error on training points: line {sum(abs(line(x) - y) for x, y in zip(x_train, y_train)) / n:.2f}, polynomial 0.00")
print(f"error between points:    line {mean_error(line, [0.5, 3.5, 6.5]):.2f}, polynomial {mean_error(polynomial, [0.5, 3.5, 6.5]):.2f}")
print(f"prediction for x = 10:   line {line(10):.1f}, polynomial {polynomial(10):.1f}  (true: 21)")
```

The polynomial is **flawless** on the measured points – yet it's worse: between the points it errs more, and at x = 10 it predicts 2005 instead of 21! The polynomial didn't learn the relationship, it learned the **noise** too. This is **overfitting**, one of the most important pitfalls of machine learning.

The lesson holds for every area of modelling:

- A model must always also be checked on data that was **not** used for fitting (in machine learning: training and test datasets).
- The **simpler** model is often better (Occam's razor): use as many parameters as the data really supports.
- Forecasting **outside** the measured range (extrapolation) is always risky.

## 2. Exponential or logistic?

The number of users of a new app grows exponentially at first. If we fit an exponential model to this, we get absurd numbers for the future – in reality the market saturates, and the growth is logistic: $N(t) = \dfrac{K}{1 + A e^{-rt}}$, where $K$ is the carrying capacity (here $1000$).

```plot
title: Exponential and logistic growth (thousand users)
x: 0, 25
y: 0, 1200
param: r = 0.4, 0.1, 1, 0.05
f: 10*e^(r*x) # exponential
f: 1000/(1 + 99*e^(-r*x)) # logistic
dash: 1000 # K
```

At the start the two curves **almost coincide** – so from the first data you can't decide which model is right! They separate starting at the inflection point ($K/2$). That's why choosing a model means thinking about the **mechanism** too (is there a limit, saturation), not just the fit.

## 3. Big O in numbers

Bubble sort makes about $\frac{n^2}{2}$ comparisons, merge sort about $n \log_2 n$. Let's actually count them:

```python run
# Growth of algorithms, measured: number of comparisons in bubble sort and merge sort
import random

def bubble(lst):
    a, count = lst[:], 0
    for i in range(len(a)):
        for j in range(len(a) - 1 - i):
            count += 1                                     # one comparison
            if a[j] > a[j + 1]:
                a[j], a[j + 1] = a[j + 1], a[j]
    return count

def merge_sort(a):
    if len(a) <= 1:
        return a, 0
    left, c1 = merge_sort(a[: len(a) // 2])
    right, c2 = merge_sort(a[len(a) // 2 :])
    result, i, j, count = [], 0, 0, c1 + c2
    while i < len(left) and j < len(right):
        count += 1
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    return result + left[i:] + right[j:], count

r = random.Random(0)
for n in [100, 400, 1600]:
    data = [r.random() for _ in range(n)]
    print(f"n = {n:>4}: bubble {bubble(data):>9,} | merge {merge_sort(data)[1]:>6,} comparisons")
```

If $n$ grows fourfold, bubble sort's work grows about **16-fold** ($4^2$), merge sort's only about 5-fold. At $n = 1600$ the difference is already 85-fold; with a million elements it's the difference between seconds and days. Choosing an algorithm often matters more than a faster machine.

## 4. Uncertainty: why do projects run late?

A project consists of three consecutive tasks; for each we have three estimates: optimistic, most likely and pessimistic. If we simply add up the "most likely" values, we get 23 days. But the tasks have **skewed** distributions: they can overrun by much more than they can gain. Let's simulate it a hundred thousand times:

```python run
# Modelling uncertainty with Monte Carlo simulation: will the project be done within 30 days?
import random

# three consecutive tasks: (optimistic, most likely, pessimistic) in days
tasks = [(5, 8, 15), (6, 10, 20), (3, 5, 12)]
r = random.Random(42)

N = 100_000
times = sorted(sum(r.triangular(a, c, b) for a, b, c in tasks) for _ in range(N))
print(f"computing with the most likely value everywhere: {sum(b for a, b, c in tasks)} days")
print(f"average duration in the simulation:              {sum(times) / N:.1f} days")
print(f"chance of finishing within 30 days:              {sum(t <= 30 for t in times) / N:.0%}")
print(f"done with 90% certainty within:                  {times[int(0.9 * N)]:.1f} days")
```

The average duration is **28 days**, and if we want to commit to a deadline with 90% certainty, we have to say about **34 days** – the "most likely" 23 days is actually rarely met. That's the power of Monte Carlo simulation: if the inputs are uncertain, we get not one number but a **distribution** for the result, and we can read probabilities from it. The same is used in engineering tolerance analysis, financial risk analysis and weather forecasting (ensemble forecasts).

## Summary

- Overfitting: a model perfect on the measured points can be bad on new data; check on unused data, and don't extrapolate blindly.
- The exponential and logistic models coincide at first; choose the model based on the mechanism too.
- $n^2$ versus $n \log n$: the difference grows with $n$, and for large data it decides.
- For uncertain inputs Monte Carlo simulation gives a distribution; the sum of the "most likely" values is usually too optimistic.

## Lesson exercise

```quiz required
? How many comparisons does bubble sort make on $n = 10$ elements? ($\frac{n(n-1)}{2}$)
= 45
! $\frac{10 \cdot 9}{2} = 45$

? For an $O(n^2)$ algorithm, by what factor does the running time grow if the amount of data grows tenfold?
= 100
! $10^2 = 100$

? What does overfitting mean?
- the model is too simple, so it doesn't even fit the measured points
+ the model learns the noise too, so it's good on the measured points but bad on new data
- the model has too few parameters
- the model only works outside the measured range
! That's why the model must also be checked on data not used for fitting.

? A task's estimates: optimistic 2, most likely 4, pessimistic 9 days. What is the expected value of the triangular distribution, $\frac{a + m + b}{3}$ (days)?
= 5
! $\frac{2 + 4 + 9}{3} = 5$ – more than the most likely 4 days, because the "tail" is longer towards overrunning.

? What does the logistic function $N(t) = \dfrac{500}{1 + 9e^{-t}}$ tend to as $t \to \infty$?
= 500
! $e^{-t} \to 0$, so $N(t) \to 500$ – that's the carrying capacity.
```
