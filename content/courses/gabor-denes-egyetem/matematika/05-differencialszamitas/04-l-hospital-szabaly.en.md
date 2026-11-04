---
title: L'Hôpital's Rule
summary: Limits of indeterminate forms (0/0, ∞/∞, 0·∞, ∞ − ∞, 1^∞) by differentiation, and the order of growth of functions.
minutes: 20
---

## What you will learn

- **L'Hôpital's rule** for the forms $\frac{0}{0}$ and $\frac{\infty}{\infty}$,
- how to transform $0 \cdot \infty$, $\infty - \infty$ and $1^\infty$ into these forms,
- the **order of growth** of functions ($\ln x \ll x^k \ll e^x$).

## The rule

If $\lim\limits_{x \to a} f(x) = \lim\limits_{x \to a} g(x) = 0$ (or both are $\pm\infty$), and the limit $\lim\limits_{x \to a} \dfrac{f'(x)}{g'(x)}$ exists, then

$$
\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}.
$$

$a$ may also be $\pm\infty$. Note: we differentiate the numerator and the denominator **separately**, not the quotient!

**Examples:**

- $\lim\limits_{x \to 0} \dfrac{\sin x}{x} \overset{\frac{0}{0}}{=} \lim\limits_{x \to 0} \dfrac{\cos x}{1} = 1$.
- $\lim\limits_{x \to 0} \dfrac{e^x - 1 - x}{x^2} \overset{\frac{0}{0}}{=} \lim\limits_{x \to 0} \dfrac{e^x - 1}{2x} \overset{\frac{0}{0}}{=} \lim\limits_{x \to 0} \dfrac{e^x}{2} = \dfrac{1}{2}$ (applied twice).
- $\lim\limits_{x \to \infty} \dfrac{\ln x}{x} \overset{\frac{\infty}{\infty}}{=} \lim\limits_{x \to \infty} \dfrac{1/x}{1} = 0$.

Before applying it, **check the form**: $\lim\limits_{x \to 0} \frac{x + 1}{x + 2} = \frac{1}{2}$ – there is no indeterminate form here, and the rule would give a wrong result ($1$).

## Other indeterminate forms

- **$0 \cdot \infty$** → fraction: $\lim\limits_{x \to 0^+} x \ln x = \lim\limits_{x \to 0^+} \dfrac{\ln x}{1/x} = \lim\limits_{x \to 0^+} \dfrac{1/x}{-1/x^2} = \lim\limits_{x \to 0^+} (-x) = 0$.
- **$\infty - \infty$** → common denominator: $\dfrac{1}{x} - \dfrac{1}{\sin x} = \dfrac{\sin x - x}{x \sin x}$.
- **$1^\infty$, $0^0$, $\infty^0$** → base $e$: $f^g = e^{g \ln f}$, and compute the limit of the exponent. For example $\lim\limits_{x \to 0^+} x^x = e^{\lim x \ln x} = e^0 = 1$.

## Order of growth

As $x \to \infty$, for any $k > 0$ and $a > 1$

$$
\ln x \ \ll\ x^k \ \ll\ a^x \ \ll\ x!\ ,
$$

i.e. their ratio tends to $0$ (e.g. $\frac{x^{100}}{e^x} \to 0$ after applying L'Hôpital $100$ times). In computing this is the ranking of **algorithm complexity**: $O(\log n) \ll O(n) \ll O(n^2) \ll O(2^n)$.

```plot
title: Growth of ln x, √x, x and eˣ⁄10
x: 0, 12
y: 0, 12
f: ln(x) # ln x
f: sqrt(x) # √x
f: x # x
f: e^x/10 # eˣ/10
```

## Summary

- $\frac{0}{0}$ or $\frac{\infty}{\infty}$: $\lim \frac{f}{g} = \lim \frac{f'}{g'}$ (differentiated separately); it can be applied repeatedly.
- Always check first that the form really is indeterminate.
- $0 \cdot \infty$ → fraction; $\infty - \infty$ → common denominator; $1^\infty$ → $e^{g \ln f}$.
- $\ln x \ll x^k \ll a^x$.

## Lesson exercise

```quiz required
? What is $\lim\limits_{x \to 0} \dfrac{e^{2x} - 1}{x}$?
= 2

? What is $\lim\limits_{x \to 0} \dfrac{1 - \cos x}{x^2}$? (As a fraction or decimal.)
= 1/2
! The rule must be applied twice.

? What is $\lim\limits_{x \to \infty} \dfrac{x^2}{e^x}$?
= 0

? What is $\lim\limits_{x \to 1} \dfrac{\ln x}{x - 1}$?
= 1

? What is $\lim\limits_{x \to \infty} \left(1 + \dfrac{2}{x}\right)^x$? (Round to two decimals!)
= 7.39
! $e^{\lim x \ln(1 + 2/x)} = e^2$

? In which case can L'Hôpital's rule **not** be applied?
- $\lim\limits_{x \to 0} \frac{\sin 3x}{x}$
- $\lim\limits_{x \to \infty} \frac{\ln x}{\sqrt x}$
+ $\lim\limits_{x \to 0} \frac{\cos x}{x + 1}$
- $\lim\limits_{x \to 0} \frac{e^x - 1}{\sin x}$
! This has the form $\frac{1}{1}$, not indeterminate.
```
