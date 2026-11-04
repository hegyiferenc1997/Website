---
title: A láncszabály és az inverz függvény deriváltja
summary: Összetett függvények deriválása, az arkuszfüggvények deriváltjai és a logaritmikus deriválás.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- az összetett függvény deriválását (**láncszabály**),
- az **inverz függvény** deriváltját és az **arkuszfüggvények** deriváltjait,
- a **logaritmikus deriválást** ($x^x$ típusú függvényekre).

## A láncszabály

Ha $h(x) = f\big(g(x)\big)$, akkor

$$
h'(x) = f'\big(g(x)\big) \cdot g'(x),
$$

vagyis „a külső függvény deriváltja a belső helyen, szorozva a belső deriváltjával”.

**Példák:**

- $\left((3x + 1)^5\right)' = 5(3x + 1)^4 \cdot 3 = 15(3x + 1)^4$.
- $\left(e^{-x^2}\right)' = e^{-x^2} \cdot (-2x)$.
- $\left(\sin^2 x\right)' = 2 \sin x \cdot \cos x = \sin 2x$.
- $\left(\ln(x^2 + 1)\right)' = \dfrac{2x}{x^2 + 1}$.
- Többszörös összetétel: $\left(\sqrt{\cos 3x}\right)' = \dfrac{1}{2\sqrt{\cos 3x}} \cdot (-\sin 3x) \cdot 3$.

Fontos speciális eset: $\big(f(ax + b)\big)' = a\,f'(ax + b)$.

## Az inverz függvény deriváltja

Ha $f$ szigorúan monoton és deriválható, $f'(x) \neq 0$, akkor az inverze is deriválható:

$$
\left(f^{-1}\right)'(y) = \frac{1}{f'(x)}, \quad \text{ahol } y = f(x).
$$

Szemléletesen: tükrözéskor az érintő meredeksége a reciprokára változik. Így kapjuk:

| $f(x)$      | $f'(x)$                      |
| ----------- | ---------------------------- |
| $\arcsin x$ | $\dfrac{1}{\sqrt{1 - x^2}}$  |
| $\arccos x$ | $-\dfrac{1}{\sqrt{1 - x^2}}$ |
| $\arctan x$ | $\dfrac{1}{1 + x^2}$         |

Például $\ln x$ az $e^x$ inverze: $(\ln x)' = \dfrac{1}{e^{\ln x}} = \dfrac{1}{x}$.

## Logaritmikus deriválás

Az $f(x)^{g(x)}$ alakú függvényeket $e$ alapra írjuk át: $x^x = e^{x \ln x}$, így

$$
\left(x^x\right)' = e^{x \ln x} \cdot \left(\ln x + x \cdot \frac{1}{x}\right) = x^x (\ln x + 1).
$$

```plot
title: A láncszabály szemléletesen: sin(kx)
x: -4, 4
y: -4, 4
param: k = 2, 0.5, 3, 0.1
param: t = 0.5, -3.5, 3.5, 0.05
tangent: sin(k x) @ t # sin(kx)
value: k·cos(kt) = k cos(k t)
```

A belső függvény $kx$: ha $k$ nagyobb, a görbe „összenyomódik”, és az érintők $k$-szor meredekebbek – ezt a $k$ szorzó adja a láncszabályban.

## Összefoglalás

- Láncszabály: $\big(f(g(x))\big)' = f'(g(x)) \cdot g'(x)$; kívülről befelé haladunk.
- Inverz: $(f^{-1})' = 1 / f'$; $(\arctan x)' = \frac{1}{1 + x^2}$, $(\arcsin x)' = \frac{1}{\sqrt{1 - x^2}}$.
- $f^g$ alakban: $e^{g \ln f}$, és így deriválunk.

## A lecke feladata

```quiz required
? Deriváld: $f(x) = (2x - 5)^4$.
fn: x -> 8(2x - 5)^3

? Deriváld: $f(x) = e^{3x^2}$.
fn: x -> 6x e^(3x^2)
domain: -1, 1

? Deriváld: $f(x) = \ln(x^2 + 4)$.
fn: x -> 2x/(x^2 + 4)

? Deriváld: $f(x) = \cos(5x + 1)$.
fn: x -> -5 sin(5x + 1)

? Deriváld: $f(x) = \arctan(2x)$.
fn: x -> 2/(1 + 4x^2)

? Mennyi az $f(x) = x^x$ deriváltja az $x = 1$ helyen?
= 1
! $x^x (\ln x + 1)$ az $1$-ben.
```
