---
title: Growth Models
summary: Exponential and logistic growth, doubling time, carrying capacity, the inflection point, and where these models appear.
minutes: 30
---

## What you will learn

- the **exponential** growth model and the **doubling time**,
- why nothing can grow forever: the **logistic** model,
- where growth is fastest (the **inflection point**),
- where these models are used.

## Exponential growth

If the growth rate is proportional to the amount, $y' = r y$, the solution is $y(t) = y_0 e^{rt}$. The **doubling time**:

$$
y_0 e^{rT_2} = 2y_0 \;\Rightarrow\; T_2 = \frac{\ln 2}{r} \approx \frac{0.69}{r}.
$$

(This gives the "rule of 70" in finance: at $7\%$ annual growth, capital doubles in about $70 / 7 = 10$ years.)

Examples: a bacterial culture with unlimited nutrients, compound interest, the very beginning of an epidemic, or **Moore's law** (the transistor count of chips roughly doubled every two years).

## Logistic growth

In reality, resources are finite. The **logistic model** introduces a **carrying capacity** $K$ (an upper bound): growth slows down as $y$ approaches $K$:

$$
y' = r\,y\left(1 - \frac{y}{K}\right), \qquad y(t) = \frac{K}{1 + \left(\frac{K}{y_0} - 1\right)e^{-rt}}.
$$

- For small $y$, $1 - \frac{y}{K} \approx 1$, so at first it is almost exponential.
- $y \to K$ as $t \to \infty$.
- Growth is fastest at $y = \frac{K}{2}$ (the **inflection point**), with maximal rate $\frac{rK}{4}$.

```plot
title: Logistic and exponential growth
x: 0, 20
y: 0, 120
param: r = 0.6, 0.1, 1.5, 0.05
param: K = 100, 20, 110, 5
param: y0 = 2, 1, 20, 1
f: K/(1 + (K/y0 - 1) e^(-r x)) # logistic
dash: y0 e^(r x) # exponential
dash: K # carrying capacity
point: ln(K/y0 - 1)/r, K/2 # inflection point
value: doubling time (at the start) = ln(2)/r
value: max. growth rate = r K/4
```

The two curves run together at first, then the logistic one "gets tired". It is the typical **S-shaped** (sigmoid) curve. The same function (the logistic function) is fundamental in machine learning too: in **logistic regression** and as an activation function of neural networks.

Applications: populations, the adoption of a new product (e.g. smartphones), epidemics (the SIR model), a piece of news spreading on a social network.

```python run
import math
# Logistic model: Euler's method compared with the exact solution
r, K, y0, h = 0.6, 100.0, 2.0, 0.1
y = y0
for step in range(1, 201):
    y += h * r * y * (1 - y / K)
    t = step * h
    if step % 40 == 0:
        exact = K / (1 + (K / y0 - 1) * math.exp(-r * t))
        print(f"t = {t:>4.0f}: Euler ≈ {y:6.2f}, exact = {exact:6.2f}")
```

## Summary

- Exponential: $y = y_0e^{rt}$, doubling time $\frac{\ln 2}{r}$.
- Logistic: $y' = ry(1 - \frac{y}{K})$, S-shaped curve, limit $K$, inflection at $\frac{K}{2}$, maximal rate $\frac{rK}{4}$.

## Lesson exercise

```quiz required
? An investment grows continuously by $7\%$ per year ($r = 0.07$). Roughly how long does it take to double?
- $7$ years
+ about $10$ years
- $14$ years
- $70$ years
! $T_2 = \frac{\ln 2}{0.07}$

? A bacterial culture doubles every $3$ hours. Initially there are $1000$ bacteria. How many will there be after $12$ hours?
= 16000

? In the model $y' = 0.5\,y\left(1 - \frac{y}{200}\right)$, what does $y$ tend to if $y_0 > 0$?
= 200

? In the same model, at what $y$ is growth fastest?
= 100

? In the same model, what is the largest growth rate (the maximum of $y'$)?
= 25
! $\frac{rK}{4}$

? Give the solution of $y' = y\left(1 - \frac{y}{10}\right)$, $y(0) = 1$!
fn: x -> 10/(1 + 9 e^(-x))
domain: -2, 5
```
