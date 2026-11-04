---
title: Deriválási szabályok
summary: Az elemi függvények deriváltjai, valamint az összeg, a konstansszoros, a szorzat és a hányados deriválása.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- az **elemi függvények** deriváltjait (deriválási táblázat),
- a **konstansszoros**, az **összeg**, a **szorzat** és a **hányados** deriválási szabályát,
- hogyan deriválunk gyorsan polinomot és törtfüggvényt.

## A deriválási táblázat

| $f(x)$              | $f'(x)$                     |
| ------------------- | --------------------------- |
| $c$ (állandó)       | $0$                         |
| $x^n$ ($n$ valós)   | $n x^{n-1}$                 |
| $e^x$               | $e^x$                       |
| $a^x$               | $a^x \ln a$                 |
| $\ln x$             | $\dfrac{1}{x}$              |
| $\log_a x$          | $\dfrac{1}{x \ln a}$        |
| $\sin x$            | $\cos x$                    |
| $\cos x$            | $-\sin x$                   |
| $\tan x$            | $\dfrac{1}{\cos^2 x}$       |

A hatványszabály gyökökre és törtekre is működik: $(\sqrt x)' = \left(x^{1/2}\right)' = \dfrac{1}{2\sqrt x}$, $\left(\dfrac{1}{x^2}\right)' = (x^{-2})' = -\dfrac{2}{x^3}$.

## Műveleti szabályok

$$
(c f)' = c f', \qquad (f \pm g)' = f' \pm g',
$$

$$
(f g)' = f' g + f g', \qquad \left(\frac{f}{g}\right)' = \frac{f' g - f g'}{g^2}.
$$

Vigyázat: a szorzat deriváltja **nem** a deriváltak szorzata!

## Példák

**Polinom:** $\left(4x^3 - 5x^2 + 7x - 2\right)' = 12x^2 - 10x + 7$.

**Szorzat:** $\left(x^2 e^x\right)' = 2x e^x + x^2 e^x = e^x (x^2 + 2x)$.

**Hányados:**

$$
\left(\frac{x}{x^2 + 1}\right)' = \frac{1 \cdot (x^2 + 1) - x \cdot 2x}{(x^2 + 1)^2} = \frac{1 - x^2}{(x^2 + 1)^2}.
$$

## Nézd meg: a függvény és a deriváltja

```plot
title: f és f′: ahol f nő, ott f′ > 0
x: -4, 4
y: -6, 6
param: t = 0.5, -3.5, 3.5, 0.1
tangent: x^3 - 3x @ t # f(x) = x³ − 3x
dash: 3x^2 - 3 # f′(x) = 3x² − 3
point: t, 3t^2 - 3 # f′(t)
```

A szaggatott görbe a derivált. Az érintő meredeksége (alul kiírva) mindig egyenlő a szaggatott görbe értékével ugyanabban a pontban. Ahol $f'(x) = 0$ ($x = \pm 1$), ott vízszintes az érintő.

## Összefoglalás

- $(x^n)' = n x^{n-1}$, $(e^x)' = e^x$, $(\ln x)' = \frac{1}{x}$, $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$.
- Összeg tagonként, konstans kiemelhető.
- $(fg)' = f'g + fg'$; $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}$.

## A lecke feladata

A képleteket a mező alatti jelölésekkel írd be (pl. `3x^2 - 4`, `e^x*(x+1)`, `cos(x)`).

```quiz required
? Deriváld: $f(x) = 2x^5 - 3x^2 + 4x - 9$.
fn: x -> 10x^4 - 6x + 4

? Deriváld: $f(x) = \sqrt{x} + \dfrac{1}{x}$.
fn: x -> 1/(2 sqrt(x)) - 1/x^2
domain: 0.2, 4

? Deriváld: $f(x) = x \sin x$.
fn: x -> sin(x) + x cos(x)
! Szorzatszabály.

? Deriváld: $f(x) = \dfrac{x - 1}{x + 1}$.
fn: x -> 2/(x + 1)^2
domain: 0, 4
! Hányadosszabály: $\frac{(x + 1) - (x - 1)}{(x + 1)^2}$

? Mennyi az $f(x) = x^3 - 3x$ deriváltja az $x = 2$ helyen?
= 9
```
