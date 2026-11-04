---
title: Integrálási módszerek
summary: Az f′/f és f′·fⁿ típus, a helyettesítéses integrálás és a parciális integrálás.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a gyakori **„kész” alakokat**: $\int \frac{f'}{f}$ és $\int f' f^n$,
- a **helyettesítéses** integrálást (a láncszabály megfordítása),
- a **parciális** integrálást (a szorzatszabály megfordítása).

## Két hasznos alak

$$
\int \frac{f'(x)}{f(x)}\,dx = \ln \lvert f(x) \rvert + C, \qquad \int f'(x) f(x)^n\,dx = \frac{f(x)^{n+1}}{n + 1} + C \ (n \neq -1).
$$

Példák: $\displaystyle\int \frac{2x}{x^2 + 5}\,dx = \ln(x^2 + 5) + C$; $\ \displaystyle\int \tan x\,dx = -\int \frac{-\sin x}{\cos x}\,dx = -\ln\lvert\cos x\rvert + C$; $\ \displaystyle\int \sin x \cos^3 x\,dx = -\frac{\cos^4 x}{4} + C$.

## Helyettesítés

Ha az integrandusban egy kifejezés **és a deriváltja** is szerepel, vezessünk be új változót: $u = g(x)$, $du = g'(x)\,dx$.

$$
\int f\big(g(x)\big) g'(x)\,dx = \int f(u)\,du.
$$

**Példa:** $\displaystyle\int x e^{x^2}\,dx$. Legyen $u = x^2$, $du = 2x\,dx$, vagyis $x\,dx = \frac{du}{2}$:

$$
\int x e^{x^2}\,dx = \frac{1}{2}\int e^u\,du = \frac{1}{2} e^u + C = \frac{1}{2} e^{x^2} + C.
$$

A végén mindig **visszahelyettesítünk**, és ellenőrizni lehet deriválással.

## Parciális integrálás

A szorzatszabályból $(uv)' = u'v + uv'$ átrendezve:

$$
\int u'(x) v(x)\,dx = u(x) v(x) - \int u(x) v'(x)\,dx.
$$

Akkor jó, ha a $v$ deriválással **egyszerűsödik** (pl. polinom, $\ln x$), az $u'$ pedig könnyen integrálható (pl. $e^x$, $\sin x$).

**Példa:** $\displaystyle\int x e^x\,dx$. Legyen $v = x$ (deriváltja $1$), $u' = e^x$ ($u = e^x$):

$$
\int x e^x\,dx = x e^x - \int 1 \cdot e^x\,dx = x e^x - e^x + C = (x - 1)e^x + C.
$$

**Trükk:** $\displaystyle\int \ln x\,dx = \int 1 \cdot \ln x\,dx = x \ln x - \int x \cdot \frac{1}{x}\,dx = x\ln x - x + C$.

## Melyiket válasszam?

| Ha az integrandus…                              | Módszer                         |
| ----------------------------------------------- | ------------------------------- |
| alapintegrál vagy $f(ax + b)$                    | táblázat                        |
| $\frac{f'}{f}$ vagy $f' f^n$ alakú              | kész képlet                     |
| kifejezés és a deriváltja is benne van          | helyettesítés                   |
| polinom · ($e^x$, $\sin x$, $\cos x$), vagy $\ln x$ | parciális integrálás        |

## Összefoglalás

- $\int \frac{f'}{f} = \ln\lvert f \rvert + C$, $\int f' f^n = \frac{f^{n+1}}{n+1} + C$.
- Helyettesítés: $u = g(x)$, $du = g'(x)dx$, a végén visszahelyettesítés.
- Parciális: $\int u'v = uv - \int uv'$; a deriválással egyszerűsödő tényező legyen $v$.

## A lecke feladata

```quiz required
? Számold ki: $\displaystyle\int \frac{3x^2}{x^3 + 1}\,dx$ ($x > -1$).
fn: x -> ln(x^3 + 1)
domain: 0, 3
+C

? Számold ki: $\displaystyle\int 2x (x^2 + 1)^4\,dx$.
fn: x -> (x^2 + 1)^5/5
domain: -1, 1
+C

? Számold ki helyettesítéssel: $\displaystyle\int \cos x \, e^{\sin x}\,dx$.
fn: x -> e^(sin(x))
+C

? Számold ki parciális integrálással: $\displaystyle\int x \cos x\,dx$.
fn: x -> x sin(x) + cos(x)
+C
! $v = x$, $u' = \cos x$.

? Számold ki: $\displaystyle\int x \ln x\,dx$ ($x > 0$).
fn: x -> x^2 ln(x)/2 - x^2/4
domain: 0.3, 4
+C
! $v = \ln x$, $u' = x$.
```
