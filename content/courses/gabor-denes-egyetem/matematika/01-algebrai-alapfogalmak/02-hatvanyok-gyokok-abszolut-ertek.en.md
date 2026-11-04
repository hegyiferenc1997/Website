---
title: Powers, Roots, Absolute Value
summary: The laws of exponents for integer and fractional exponents, roots as fractional powers, and the absolute value.
minutes: 20
---

## What you will learn

- the **laws of exponents**, negative and zero exponents,
- that taking a **root** is raising to a fractional power, and how to simplify roots,
- what the **absolute value** is and how it relates to distance.

## Powers

$a^n = \underbrace{a \cdot a \cdots a}_{n \text{ times}}$, where $a$ is the **base** and $n$ the **exponent**. We extend the exponent:

$$
a^0 = 1 \ (a \neq 0), \qquad a^{-n} = \frac{1}{a^n}, \qquad a^{\frac{p}{q}} = \sqrt[q]{a^p} \ (a > 0).
$$

**Laws** ($a, b > 0$, $n, m$ real):

| Law                                | Example                                |
| ---------------------------------- | -------------------------------------- |
| $a^n \cdot a^m = a^{n+m}$          | $2^3 \cdot 2^4 = 2^7 = 128$            |
| $\dfrac{a^n}{a^m} = a^{n-m}$       | $\dfrac{5^6}{5^4} = 5^2 = 25$          |
| $(a^n)^m = a^{nm}$                 | $(3^2)^3 = 3^6 = 729$                  |
| $(ab)^n = a^n b^n$                 | $(2x)^3 = 8x^3$                        |
| $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$ | $\left(\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$ |

A common mistake: $(a + b)^2 \neq a^2 + b^2$! Powers distribute over multiplication, but **not** over addition.

In computing, powers of two are everywhere: $2^{10} = 1024$ (kibi), $2^{20} \approx 10^6$, $2^{32} \approx 4.3 \cdot 10^9$ (32-bit address space).

## Roots

$\sqrt[n]{a}$ is the number whose $n$-th power is $a$. For even $n$ it is only defined for $a \geq 0$, and the result is non-negative too: $\sqrt{9} = 3$ (not $\pm 3$!). For odd $n$ negative numbers have roots too: $\sqrt[3]{-8} = -2$.

Since $\sqrt[n]{a} = a^{1/n}$, the laws of roots follow from the laws of exponents:

$$
\sqrt[n]{ab} = \sqrt[n]{a}\,\sqrt[n]{b}, \qquad \sqrt[n]{\sqrt[m]{a}} = \sqrt[nm]{a}, \qquad \sqrt[n]{a^m} = a^{m/n}.
$$

**Simplifying, taking factors out of the root:** $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$.

**Rationalising the denominator:** $\dfrac{1}{\sqrt{2}} = \dfrac{\sqrt{2}}{2}$, and $\dfrac{1}{\sqrt{3} - 1} = \dfrac{\sqrt 3 + 1}{(\sqrt 3 - 1)(\sqrt 3 + 1)} = \dfrac{\sqrt 3 + 1}{2}$.

Important: $\sqrt{x^2} = \lvert x \rvert$, not $x$! For example $\sqrt{(-5)^2} = \sqrt{25} = 5$.

## Absolute value

$$
\lvert x \rvert = \begin{cases} x, & \text{if } x \geq 0, \\ -x, & \text{if } x < 0. \end{cases}
$$

Geometrically $\lvert x \rvert$ is the distance of $x$ from $0$ on the number line, and $\lvert a - b \rvert$ is the distance between $a$ and $b$. Properties: $\lvert ab \rvert = \lvert a \rvert \lvert b \rvert$, and the **triangle inequality**: $\lvert a + b \rvert \leq \lvert a \rvert + \lvert b \rvert$.

```plot
title: The absolute value function, shifted
x: -6, 6
y: -1, 7
param: c = 0, -4, 4, 0.5
f: abs(x - c) # |x − c|
dash: abs(x) # |x|
```

The slider shows that the graph of $\lvert x - c \rvert$ is the "V" of $\lvert x \rvert$ shifted right by $c$, because $\lvert x - c\rvert$ is the distance of $x$ from $c$.

## Summary

- $a^0 = 1$, $a^{-n} = 1/a^n$, $a^{p/q} = \sqrt[q]{a^p}$; when multiplying powers of the same base the exponents add up.
- $\sqrt[n]{a} = a^{1/n}$; even roots only of non-negative numbers, with a non-negative result; $\sqrt{x^2} = \lvert x \rvert$.
- $\lvert a - b \rvert$ is the distance of the two numbers; $\lvert a + b \rvert \leq \lvert a \rvert + \lvert b \rvert$.

## Lesson exercise

```quiz required
? What is $2^{-3}$? (You may give it as a fraction or a decimal.)
= 1/8
= 0.125
! $a^{-n} = \frac{1}{a^n}$

? What is $8^{2/3}$?
= 4
! $8^{2/3} = \left(\sqrt[3]{8}\right)^2$

? Write as a single power: $\dfrac{x^5 \cdot x^{-2}}{x}$ (the variable is $x$).
fn: x -> x^2
domain: 0.5, 3
! The exponents: $5 + (-2) - 1$.

? Which one equals $\sqrt{50}$?
- $25\sqrt{2}$
+ $5\sqrt{2}$
- $2\sqrt{5}$
- $10\sqrt{5}$
! $50 = 25 \cdot 2$

? What is $\lvert 3 - 8 \rvert + \lvert -2 \rvert$?
= 7
```
