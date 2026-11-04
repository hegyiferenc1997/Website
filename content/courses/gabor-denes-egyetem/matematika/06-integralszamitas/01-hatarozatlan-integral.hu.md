---
title: Primitív függvény és határozatlan integrál
summary: A deriválás megfordítása, az alapintegrálok táblázata és a lineáris szabályok.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **primitív függvény**, és miért van belőle végtelen sok,
- mi a **határozatlan integrál**, és hogyan jelöljük,
- az **alapintegrálokat** és az integrálás **lineáris** szabályait,
- az $\int f(ax + b)\,dx$ típusú integrálokat.

## Primitív függvény

Az $F$ függvény az $f$ **primitív függvénye** (egy intervallumon), ha $F'(x) = f(x)$. Az integrálás tehát a deriválás **megfordítása**.

Példa: $f(x) = 2x$ egy primitív függvénye $F(x) = x^2$, de $x^2 + 5$ és $x^2 - 7$ is az, mert a konstans deriváltja $0$. Egy intervallumon **bármely két primitív függvény csak konstansban különbözik**.

## Határozatlan integrál

Az $f$ összes primitív függvényének halmaza a **határozatlan integrál**:

$$
\int f(x)\,dx = F(x) + C, \qquad C \in \mathbb{R}.
$$

Az $f(x)$ az **integrandus**, a $dx$ jelzi az integrálási változót, $C$ az **integrálási konstans**.

## Alapintegrálok

| $f(x)$                     | $\int f(x)\,dx$                  |
| -------------------------- | -------------------------------- |
| $x^n$ ($n \neq -1$)        | $\dfrac{x^{n+1}}{n + 1} + C$     |
| $\dfrac{1}{x}$             | $\ln \lvert x \rvert + C$        |
| $e^x$                      | $e^x + C$                        |
| $a^x$                      | $\dfrac{a^x}{\ln a} + C$         |
| $\sin x$                   | $-\cos x + C$                    |
| $\cos x$                   | $\sin x + C$                     |
| $\dfrac{1}{\cos^2 x}$      | $\tan x + C$                     |
| $\dfrac{1}{1 + x^2}$       | $\arctan x + C$                  |
| $\dfrac{1}{\sqrt{1 - x^2}}$ | $\arcsin x + C$                 |

Minden sort ellenőrizhetsz deriválással! Például $\left(\ln\lvert x \rvert\right)' = \frac{1}{x}$ mind $x > 0$-ra, mind $x < 0$-ra.

## Lineáris szabályok

$$
\int \big(a f(x) + b g(x)\big)\,dx = a \int f(x)\,dx + b \int g(x)\,dx.
$$

Példa: $\displaystyle\int \left(6x^2 - \frac{4}{x} + 3\cos x\right) dx = 2x^3 - 4\ln\lvert x \rvert + 3 \sin x + C$.

Gyökök és törtek hatványként: $\displaystyle\int \sqrt{x}\,dx = \int x^{1/2}\,dx = \frac{2}{3} x^{3/2} + C$, $\ \displaystyle\int \frac{1}{x^3}\,dx = \frac{x^{-2}}{-2} + C = -\frac{1}{2x^2} + C$.

## Lineáris belső függvény

Ha $\int f(x)\,dx = F(x) + C$, akkor

$$
\int f(ax + b)\,dx = \frac{1}{a} F(ax + b) + C \qquad (a \neq 0).
$$

Példák: $\int e^{3x}\,dx = \frac{1}{3} e^{3x} + C$, $\ \int \cos(2x + 1)\,dx = \frac{1}{2}\sin(2x + 1) + C$, $\ \int (5x - 2)^4\,dx = \frac{(5x - 2)^5}{25} + C$.

```plot
title: Ugyanannak a függvénynek a primitív függvényei: F(x) + C
x: -3, 3
y: -4, 6
param: C = 0, -3, 3, 0.5
f: x^2 + C # F(x) = x² + C
dash: 2x # f(x) = 2x
```

A $C$ csúszkával a primitív függvény függőlegesen tolódik, de a meredeksége (a deriváltja) minden pontban ugyanaz: $2x$.

## Összefoglalás

- $F$ primitív függvénye $f$-nek, ha $F' = f$; ezek csak konstansban különböznek.
- $\int f(x)\,dx = F(x) + C$.
- $\int x^n\,dx = \frac{x^{n+1}}{n+1} + C$ ($n \neq -1$), $\int \frac{1}{x}\,dx = \ln\lvert x\rvert + C$.
- $\int f(ax + b)\,dx = \frac{1}{a}F(ax + b) + C$.

## A lecke feladata

A $+C$-t nem kötelező beírni; az ellenőrzés elfogadja a konstansban eltérő válaszokat.

```quiz required
? Számold ki: $\displaystyle\int (3x^2 + 4x - 1)\,dx$.
fn: x -> x^3 + 2x^2 - x
+C

? Számold ki: $\displaystyle\int \left(\frac{2}{x} + e^x\right) dx$ ($x > 0$).
fn: x -> 2 ln(x) + e^x
domain: 0.2, 4
+C

? Számold ki: $\displaystyle\int \sqrt[3]{x}\,dx$ ($x > 0$).
fn: x -> 3/4 x^(4/3)
domain: 0.2, 4
+C
! $x^{1/3}$ integrálja $\frac{x^{4/3}}{4/3}$.

? Számold ki: $\displaystyle\int \sin(4x)\,dx$.
fn: x -> -cos(4x)/4
+C

? Melyik **nem** primitív függvénye a $2\cos(2x)$ függvénynek?
- $\sin(2x)$
- $\sin(2x) + 7$
+ $2\sin(2x)$
- $\sin(2x) - \pi$
! Deriválással ellenőrizd: $(2\sin 2x)' = 4\cos 2x$.
```
