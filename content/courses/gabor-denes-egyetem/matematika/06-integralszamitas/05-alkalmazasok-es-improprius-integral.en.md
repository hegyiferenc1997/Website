---
title: Applications and Improper Integrals
summary: Mean value, distance travelled, volume of a solid of revolution, and integrals over infinite intervals or at singularities.
minutes: 25
---

## What you will learn

- the **mean value** of a function on an interval,
- how to compute the **distance travelled** from velocity, and the **volume of a solid of revolution**,
- what an **improper integral** is and when it converges.

## Mean value

The **mean value** of $f$ on $[a; b]$:

$$
\overline{f} = \frac{1}{b - a} \int_a^b f(x)\,dx.
$$

It is the height of the rectangle whose area equals the area under the curve. Example: the mean of $\sin x$ on $[0; \pi]$ is $\frac{1}{\pi}\cdot 2 \approx 0.637$. (The **RMS value** of alternating current is a similar quantity, computed from the mean of the square.)

## Distance, work, total amount

If $v(t)$ is the velocity, the distance travelled during $[t_1; t_2]$ is $s = \int_{t_1}^{t_2} v(t)\,dt$. In general: if we know the **rate of change** of a quantity, its integral is the **total change**. For example, if a server receives $r(t)$ requests per second, in one hour it receives $\int_0^{3600} r(t)\,dt$ requests in total.

## Volume of a solid of revolution

If the graph of $f \geq 0$ on $[a; b]$ is rotated about the $x$ axis, the volume of the solid (split into thin discs, each $\pi f(x)^2\,dx$) is

$$
V = \pi \int_a^b f(x)^2\,dx.
$$

Example: a cone. $f(x) = \frac{r}{h}x$ on $[0; h]$: $V = \pi \frac{r^2}{h^2} \cdot \frac{h^3}{3} = \frac{1}{3}\pi r^2 h$ – the well-known formula.

## Improper integrals

**Infinite interval:**

$$
\int_a^{\infty} f(x)\,dx = \lim_{b \to \infty} \int_a^b f(x)\,dx,
$$

if the limit exists and is finite (**convergent**). Examples:

- $\displaystyle\int_1^\infty \frac{1}{x^2}\,dx = \lim_{b\to\infty} \left[-\frac{1}{x}\right]_1^b = \lim_{b\to\infty} \left(1 - \frac{1}{b}\right) = 1$ – infinitely long, yet a finite area!
- $\displaystyle\int_1^\infty \frac{1}{x}\,dx = \lim_{b\to\infty} \ln b = \infty$ – divergent (compare with the harmonic series).
- $\displaystyle\int_0^\infty e^{-x}\,dx = 1$.

**Unbounded function:** $\displaystyle\int_0^1 \frac{1}{\sqrt x}\,dx = \lim_{\varepsilon \to 0^+} \big[2\sqrt x\big]_\varepsilon^1 = 2$.

```plot
title: The area under 1/x² from 1 to b
x: 0, 12
y: -0.2, 1.5
param: b = 3, 1.5, 12, 0.5
area: 1/x^2 @ 1, b # 1/x²
dash: 1/x # 1/x
```

However far you drag $b$, the area under $\frac{1}{x^2}$ never reaches $1$; the area under $\frac{1}{x}$ grows beyond every bound.

## Summary

- Mean value: $\frac{1}{b - a}\int_a^b f$; total change = integral of the rate of change.
- Solid of revolution: $V = \pi\int_a^b f^2\,dx$.
- Improper integral: a limit; $\int_1^\infty \frac{1}{x^p}\,dx$ converges $\iff p > 1$.

## Lesson exercise

```quiz required
? What is the mean value of $f(x) = x^2$ on $[0; 3]$?
= 3
! $\frac{1}{3} \cdot 9$

? A body moves with velocity $v(t) = 3t^2$ m/s. How many metres does it travel during $[0; 2]$ s?
= 8

? What is the volume of the solid obtained by rotating the graph of $y = \sqrt x$ on $[0; 2]$ about the $x$ axis? (Rounded to two decimals.)
= 6.28
! $\pi \int_0^2 x\,dx = 2\pi$

? What is $\displaystyle\int_1^\infty \frac{1}{x^3}\,dx$? (As a fraction or decimal.)
= 1/2

? Which improper integral **diverges**?
- $\int_1^\infty \frac{1}{x^2}\,dx$
- $\int_0^\infty e^{-2x}\,dx$
+ $\int_1^\infty \frac{1}{\sqrt x}\,dx$
- $\int_0^1 \frac{1}{\sqrt x}\,dx$
! $p = \frac{1}{2} \leq 1$
```
