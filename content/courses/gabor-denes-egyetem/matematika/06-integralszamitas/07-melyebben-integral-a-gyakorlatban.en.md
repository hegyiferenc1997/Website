---
title: Deeper – The Integral in Practice
summary: The integral as summation (daily energy use from measured data), Monte Carlo integration with random points, the convergence of improper integrals in numbers, and the 68–95–99.7 rule of the normal distribution as an area under a curve.
minutes: 40
---

## What you will learn in this lesson

- that in practice the integral is **summation**: it can be computed from measured data, without a formula,
- how to estimate an area (and $\pi$) with **random points**,
- to see **in numbers** when an improper integral is finite and when it's infinite,
- why in statistics **probability** is an area under a curve.

## 1. The integral as summation: daily electricity use

The electricity meter measures not power (W) but **energy** (kWh), and energy is the integral of power over time: $E = \int P(t)\,dt$. A smart meter records a household's power draw every hour – we have no formula, only 24 measured values. The trapezoid rule works here too:

```python run
# The integral as summation: a household's hourly power draw (W) → daily energy (kWh)
power_w = [150, 120, 110, 110, 120, 300, 900, 1200, 400, 300, 350, 600,
           1500, 700, 400, 350, 450, 800, 2000, 1800, 1200, 900, 500, 250]

# trapezoid rule with a 1-hour step (after hour 24 comes hour 0's value again)
values = power_w + [power_w[0]]
energy_wh = sum((values[i] + values[i + 1]) / 2 * 1 for i in range(24))
print(f"daily energy ≈ {energy_wh / 1000:.2f} kWh")
print(f"average power = {energy_wh / 24:.0f} W  (the integral divided by the time)")
print(f"monthly cost over 30 days at 70 Ft/kWh ≈ {energy_wh / 1000 * 30 * 70:,.0f} Ft")
```

This idea comes back wherever we want an "amount" from a "rate": distance travelled from speed, stored water from flow rate, downloaded data from transfer rate. And the **average value** is the integral divided by the length of the interval: $\bar P = \frac{1}{T}\int_0^T P(t)\,dt$.

**Analogy:** the odometer (distance travelled) is the integral of the speedometer (instantaneous speed) – it keeps adding up the "speed × short time" pieces.

## 2. Monte Carlo integration: measuring area by throwing darts

Throw points at random into the unit square! The proportion that land in the quarter circle ($x^2 + y^2 \le 1$) approaches the area of the quarter circle, that is, $\frac{\pi}{4}$:

```python run
# Monte Carlo integration: the area of a quarter circle (π/4) with random points
import math, random

r = random.Random(1)
for n in [100, 10_000, 1_000_000]:
    inside = sum(1 for _ in range(n) if r.random() ** 2 + r.random() ** 2 <= 1)
    estimate = 4 * inside / n                    # area ratio · the square's area · 4
    print(f"N = {n:>9,}: π ≈ {estimate:.5f}, error {abs(estimate - math.pi):.5f}")
```

The accuracy improves slowly: **a hundred times** more points give only about **ten times** smaller error (the error is proportional to $\frac{1}{\sqrt N}$). In one dimension Simpson's rule is therefore much better. So why is it used at all? Because the accuracy of the Monte Carlo method **doesn't depend on the dimension**: for integrals in 10 or 100 variables (financial risk calculation, physics simulations, lighting in computer graphics) grid methods are useless, but random sampling works.

## 3. Improper integrals: a finite area on an infinite domain

Can an infinitely long region have a finite area? Let's compute $\int_1^b \frac{1}{x^2}\,dx$ and $\int_1^b \frac{1}{x}\,dx$ for larger and larger $b$:

```python run
# Improper integrals: ∫ 1/x² and ∫ 1/x from 1 to b, as b → ∞
import math

for b in [10, 1000, 1_000_000]:
    i2 = 1 - 1 / b                               # ∫₁ᵇ 1/x² dx = 1 − 1/b
    i1 = math.log(b)                             # ∫₁ᵇ 1/x dx = ln b
    print(f"b = {b:>9,}: ∫ 1/x² = {i2:.6f}   ∫ 1/x = {i1:7.3f}")
```

- $\int_1^\infty \frac{1}{x^2}\,dx = \lim\limits_{b \to \infty}\left(1 - \frac1b\right) = 1$ – **convergent**, the area is finite.
- $\int_1^\infty \frac{1}{x}\,dx = \lim\limits_{b \to \infty} \ln b = \infty$ – **divergent**, although it grows very slowly (even up to a million it's only $\approx 13.8$).

```plot
title: The area under 1/x² is finite, under 1/x infinite
x: 0.5, 10
y: 0, 2
f: 1/x^2 # 1/x²
f: 1/x # 1/x
```

The two curves tend to $0$ "almost the same way", yet the difference is huge. This is exactly the pair of the harmonic series ($\sum \frac1k$, divergent) and $\sum \frac{1}{k^2}$ (convergent) – the integral test connects them.

## 4. Probability as area: the normal distribution

Many measured quantities (height, measurement error, exam scores) follow the **normal** (Gaussian) distribution. The density function of the standard version is

$$
\varphi(x) = \frac{1}{\sqrt{2\pi}}\, e^{-x^2/2},
$$

and the probability that the value falls between $a$ and $b$ is the **area** under the curve: $P(a < X < b) = \int_a^b \varphi(x)\,dx$. This function has **no elementary antiderivative** – so it can only be computed numerically:

```python run
# The normal distribution: the area under the curve within ±1, ±2, ±3 standard deviations (Simpson's rule)
import math

def phi(x):
    return math.exp(-x * x / 2) / math.sqrt(2 * math.pi)   # standard normal density function

def simpson(f, a, b, n=1000):
    h = (b - a) / n
    s = f(a) + f(b) + sum((4 if i % 2 else 2) * f(a + i * h) for i in range(1, n))
    return s * h / 3

for k in [1, 2, 3]:
    print(f"P(−{k}σ < X < {k}σ) = {simpson(phi, -k, k):.4f}")
```

This is the famous **68–95–99.7 rule**: about $68\%$ of the values fall within one standard deviation of the mean, $95\%$ within two, and $99.7\%$ within three. "Six sigma" in quality assurance got its name from here too. The total area under the curve is exactly $1$ (that's an improper integral!).

```plot
title: The density function of the standard normal distribution
x: -4, 4
y: 0, 0.5
f: e^(-x^2/2)/sqrt(2*pi) # φ(x)
```

## Summary

- The integral is summation: it can be computed from measured data with the trapezoid rule (energy = integral of power); average = integral / interval length.
- Monte Carlo: estimates with random points; slow ($1/\sqrt N$), but independent of the dimension.
- $\int_1^\infty \frac{1}{x^2}\,dx = 1$ converges, $\int_1^\infty \frac1x\,dx$ diverges.
- Probability is the area under the density function; for the normal distribution 68–95–99.7%.

## Lesson exercise

```quiz required
? A device draws 1500 W for 2 hours. How many kWh of energy does it use?
= 3
! $E = P \cdot t = 1.5\ \text{kW} \cdot 2\ \text{h} = 3\ \text{kWh}$ – at constant power the integral is the area of a rectangle.

? In a Monte Carlo estimate, 7850 of 10,000 points fell in the quarter circle. What is the estimate of $\pi$?
= 3,14
= 3.14
! $4 \cdot \frac{7850}{10000} = 3.14$

? What is $\displaystyle\int_1^\infty \frac{1}{x^2}\,dx$?
= 1
! $\lim\limits_{b \to \infty}\left(1 - \frac1b\right) = 1$

? Which improper integral is divergent?
- $\int_1^\infty \frac{1}{x^2}\,dx$
+ $\int_1^\infty \frac{1}{x}\,dx$
- $\int_1^\infty \frac{1}{x^3}\,dx$
- $\int_1^\infty e^{-x}\,dx$
! $\int_1^b \frac1x\,dx = \ln b \to \infty$.

? For the normal distribution, roughly what percentage of the values fall within two standard deviations of the mean?
= 95
! The middle value of the 68–95–99.7 rule.
```
