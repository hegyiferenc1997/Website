---
title: A Newton–Leibniz-formula és a területszámítás
summary: A határozott integrál kiszámítása primitív függvénnyel, görbe alatti és két görbe közötti terület.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **Newton–Leibniz-formulát**, amely összeköti a határozott és a határozatlan integrált,
- hogyan számolunk **görbe alatti** területet (az előjelre figyelve),
- hogyan számoljuk **két görbe közötti** területet.

## A Newton–Leibniz-formula

Ha $f$ folytonos $[a; b]$-n és $F$ egy primitív függvénye, akkor

$$
\int_a^b f(x)\,dx = \big[F(x)\big]_a^b = F(b) - F(a).
$$

Ez az **analízis alaptétele**: a Riemann-összegek bonyolult határértéke helyett elég egy primitív függvényt találni. (A $+C$ kiesik a különbségben.)

**Példák:**

- $\displaystyle\int_0^2 x^2\,dx = \left[\frac{x^3}{3}\right]_0^2 = \frac{8}{3} - 0 = \frac{8}{3}$ – ugyanaz, mint a Riemann-összegek határértéke!
- $\displaystyle\int_0^{\pi} \sin x\,dx = \big[-\cos x\big]_0^{\pi} = 1 - (-1) = 2$.
- $\displaystyle\int_1^e \frac{1}{x}\,dx = \big[\ln x\big]_1^e = 1$.

## Görbe alatti terület

Ha $f \geq 0$ az $[a; b]$-n, a terület $\int_a^b f(x)\,dx$. Ha $f$ előjelet vált, **a zérushelyeknél szét kell bontani**, és a negatív részek abszolút értékét venni:

$f(x) = x^2 - 1$ a $[0; 2]$-n: zérushely $x = 1$.

$$
T = \left\lvert \int_0^1 (x^2 - 1)\,dx \right\rvert + \int_1^2 (x^2 - 1)\,dx = \left\lvert -\frac{2}{3} \right\rvert + \frac{4}{3} = 2.
$$

(Az előjeles integrál $\int_0^2 (x^2 - 1)\,dx = \frac{2}{3}$ lenne – ez nem a terület!)

```plot
title: Az integrál mint (előjeles) terület
x: -1, 3
y: -2, 4
param: a = 0, -1, 2.5, 0.1
param: b = 2, -0.5, 3, 0.1
area: x^2 - 1 @ a, b # f(x) = x² − 1
```

## Két görbe közötti terület

Ha $f(x) \geq g(x)$ az $[a; b]$-n, a köztük lévő terület

$$
T = \int_a^b \big(f(x) - g(x)\big)\,dx.
$$

A határokat gyakran a **metszéspontok** adják. Példa: az $y = x$ és $y = x^2$ közötti terület. Metszéspontok: $x^2 = x \Rightarrow x = 0, 1$. A $[0; 1]$-en $x \geq x^2$:

$$
T = \int_0^1 (x - x^2)\,dx = \left[\frac{x^2}{2} - \frac{x^3}{3}\right]_0^1 = \frac{1}{2} - \frac{1}{3} = \frac{1}{6}.
$$

```plot
title: Az y = x és az y = x² közötti terület
x: -0.5, 1.5
y: -0.5, 1.5
area: x - x^2 @ 0, 1 # x − x² (a különbség)
f: x # y = x
f: x^2 # y = x²
```

## Összefoglalás

- Newton–Leibniz: $\int_a^b f = F(b) - F(a)$.
- Terület: előjelváltásnál a zérushelyeken bontunk, a negatív részek abszolút értékét vesszük.
- Két görbe közötti terület: $\int_a^b (\text{felső} - \text{alsó})\,dx$, a határok a metszéspontok.

## A lecke feladata

```quiz required
? Mennyi $\displaystyle\int_1^3 (2x + 1)\,dx$?
= 10
! $\big[x^2 + x\big]_1^3 = 12 - 2$

? Mennyi $\displaystyle\int_0^{\pi/2} \cos x\,dx$?
= 1

? Mennyi $\displaystyle\int_0^1 e^x\,dx$? (Két tizedesre kerekítve.)
= 1.72
! $e - 1$

? Mekkora az $f(x) = 4 - x^2$ grafikonja és az $x$ tengely által közrezárt terület? (Törtként vagy két tizedesre.)
= 32/3
= 10.67
! A zérushelyek $\pm 2$.

? Mekkora az $y = x^2$ és az $y = 2x$ közötti terület? (Törtként vagy két tizedesre.)
= 4/3
= 1.33
! Metszéspontok: $0$ és $2$; $\int_0^2 (2x - x^2)\,dx$.
```
