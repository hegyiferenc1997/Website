---
title: Integration Techniques
summary: The f′/f and f′·fⁿ forms, integration by substitution and integration by parts.
minutes: 30
---

## What you will learn

- the common **"ready-made" forms**: $\int \frac{f'}{f}$ and $\int f' f^n$,
- integration by **substitution** (the reverse of the chain rule),
- integration **by parts** (the reverse of the product rule).

## Two useful forms

$$
\int \frac{f'(x)}{f(x)}\,dx = \ln \lvert f(x) \rvert + C, \qquad \int f'(x) f(x)^n\,dx = \frac{f(x)^{n+1}}{n + 1} + C \ (n \neq -1).
$$

Examples: $\displaystyle\int \frac{2x}{x^2 + 5}\,dx = \ln(x^2 + 5) + C$; $\ \displaystyle\int \tan x\,dx = -\int \frac{-\sin x}{\cos x}\,dx = -\ln\lvert\cos x\rvert + C$; $\ \displaystyle\int \sin x \cos^3 x\,dx = -\frac{\cos^4 x}{4} + C$.

## Substitution

If an expression **and its derivative** both appear in the integrand, introduce a new variable: $u = g(x)$, $du = g'(x)\,dx$.

$$
\int f\big(g(x)\big) g'(x)\,dx = \int f(u)\,du.
$$

**Example:** $\displaystyle\int x e^{x^2}\,dx$. Let $u = x^2$, $du = 2x\,dx$, i.e. $x\,dx = \frac{du}{2}$:

$$
\int x e^{x^2}\,dx = \frac{1}{2}\int e^u\,du = \frac{1}{2} e^u + C = \frac{1}{2} e^{x^2} + C.
$$

At the end always **substitute back**; you can check by differentiating.

## Integration by parts

Rearranging the product rule $(uv)' = u'v + uv'$:

$$
\int u'(x) v(x)\,dx = u(x) v(x) - \int u(x) v'(x)\,dx.
$$

It works when $v$ **gets simpler** by differentiation (e.g. a polynomial, $\ln x$) and $u'$ is easy to integrate (e.g. $e^x$, $\sin x$).

**Example:** $\displaystyle\int x e^x\,dx$. Let $v = x$ (derivative $1$), $u' = e^x$ ($u = e^x$):

$$
\int x e^x\,dx = x e^x - \int 1 \cdot e^x\,dx = x e^x - e^x + C = (x - 1)e^x + C.
$$

**Trick:** $\displaystyle\int \ln x\,dx = \int 1 \cdot \ln x\,dx = x \ln x - \int x \cdot \frac{1}{x}\,dx = x\ln x - x + C$.

## Which one to choose?

| If the integrand is…                                 | Method               |
| ---------------------------------------------------- | -------------------- |
| a basic integral or $f(ax + b)$                      | table                |
| of the form $\frac{f'}{f}$ or $f' f^n$               | ready-made formula   |
| an expression together with its derivative           | substitution         |
| polynomial · ($e^x$, $\sin x$, $\cos x$), or $\ln x$ | integration by parts |

## Summary

- $\int \frac{f'}{f} = \ln\lvert f \rvert + C$, $\int f' f^n = \frac{f^{n+1}}{n+1} + C$.
- Substitution: $u = g(x)$, $du = g'(x)dx$, then substitute back.
- By parts: $\int u'v = uv - \int uv'$; let $v$ be the factor that gets simpler when differentiated.

## Lesson exercise

```quiz required
? Compute: $\displaystyle\int \frac{3x^2}{x^3 + 1}\,dx$ ($x > -1$).
fn: x -> ln(x^3 + 1)
domain: 0, 3
+C

? Compute: $\displaystyle\int 2x (x^2 + 1)^4\,dx$.
fn: x -> (x^2 + 1)^5/5
domain: -1, 1
+C

? Compute by substitution: $\displaystyle\int \cos x \, e^{\sin x}\,dx$.
fn: x -> e^(sin(x))
+C

? Compute by parts: $\displaystyle\int x \cos x\,dx$.
fn: x -> x sin(x) + cos(x)
+C
! $v = x$, $u' = \cos x$.

? Compute: $\displaystyle\int x \ln x\,dx$ ($x > 0$).
fn: x -> x^2 ln(x)/2 - x^2/4
domain: 0.3, 4
+C
! $v = \ln x$, $u' = x$.
```
