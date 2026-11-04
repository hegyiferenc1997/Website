---
title: Convexity and Full Analysis of a Function
summary: The second derivative, convex and concave parts, inflection points, and the steps of analysing a function on an example.
minutes: 30
---

## What you will learn

- what the **second derivative** says about curvature,
- what **convex** and **concave** parts and **inflection points** are,
- the steps of a **full analysis of a function** on a worked example.

## Second derivative and curvature

The second derivative $f'' = (f')'$ is the rate of change of the slope.

- $f''(x) > 0$ on an interval → $f$ is **convex** there ("curves upwards", like $x^2$; chords lie above the curve),
- $f''(x) < 0$ → **concave** ("curves downwards", like $-x^2$).
- **Inflection point:** where convexity changes; necessary condition $f''(x_0) = 0$, sufficient if $f''$ changes sign there.

Example: $x^3$: $f''(x) = 6x$; concave for $x < 0$, convex for $x > 0$, and $0$ is an inflection point.

In physics: if $s(t)$ is the distance, $s'(t)$ is the velocity and $s''(t)$ the **acceleration**.

## Steps of a full analysis

1. Domain, parity, periodicity.
2. Zeros, $y$ intercept.
3. Limits at the edges of $D_f$, asymptotes.
4. $f'$: monotonicity, extrema (sign chart).
5. $f''$: convexity, inflection points.
6. Range, sketch of the graph.

## Worked example: $f(x) = x e^{-x}$

1. $D_f = \mathbb{R}$; neither even nor odd.
2. Zero: $x = 0$ (because $e^{-x} > 0$); $f(0) = 0$.
3. $\lim\limits_{x \to \infty} \dfrac{x}{e^x} = 0$ (L'Hôpital), so $y = 0$ is a horizontal asymptote on the right; $\lim\limits_{x \to -\infty} x e^{-x} = -\infty$.
4. $f'(x) = e^{-x} - x e^{-x} = (1 - x)e^{-x}$: positive for $x < 1$, negative for $x > 1$ → **maximum** at $x = 1$: $f(1) = \frac{1}{e} \approx 0.368$.
5. $f''(x) = -e^{-x} - (1 - x)e^{-x} = (x - 2)e^{-x}$: concave for $x < 2$, convex for $x > 2$ → **inflection point** at $x = 2$, $f(2) = \frac{2}{e^2} \approx 0.271$.
6. $R_f = \left]-\infty; \frac{1}{e}\right]$.

```plot
title: f(x) = x·e⁻ˣ, f′ and f″
x: -1, 7
y: -1.2, 1.2
f: x e^(-x) # f
dash: (1 - x) e^(-x) # f′
dash: (x - 2) e^(-x) # f″
point: 1, 1/e # max
point: 2, 2/e^2 # inflection
```

The graph shows it: where $f'$ (dashed) crosses the $x$ axis, there is the maximum; where $f''$ does, the inflection.

## Summary

- $f'' > 0$: convex, $f'' < 0$: concave; inflection point: $f''$ changes sign.
- Analysis: $D_f$ → zeros → limits → $f'$ (monotonicity, extrema) → $f''$ (convexity) → $R_f$, graph.

## Lesson exercise

```quiz required
? Give the second derivative of $f(x) = x^4 - 6x^2$!
fn: x -> 12x^2 - 12

? How many inflection points does $f(x) = x^4 - 6x^2$ have?
= 2
! $12x^2 - 12 = 0 \iff x = \pm 1$, and it changes sign there.

? The maximum value of $f(x) = x e^{-x}$ is $\frac{1}{e}$. What is it rounded to two decimals?
= 0.37

? On which interval is $f(x) = x^3 - 3x^2$ **convex**?
- $]-\infty; 1[$
+ $]1; \infty[$
- $]0; 2[$
- $]-\infty; 0[$
! $f''(x) = 6x - 6$

? Where does $f(x) = \ln(x^2 + 1)$ have a minimum? (Give the $x$ value.)
= 0
! $f'(x) = \frac{2x}{x^2 + 1}$
```
