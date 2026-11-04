---
title: Numerikus megoldás – az Euler-módszer
summary: Amikor nincs képlet: az Euler-módszer, a lépésköz és a hiba kapcsolata, a stabilitás, és egy kis program a megoldáshoz.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- miért kell **numerikus módszer** a legtöbb differenciálegyenlethez,
- hogyan működik az **Euler-módszer**,
- hogyan függ a **hiba** a lépésköztől, és mi a **stabilitás**,
- hogyan írj rá egy **programot**.

## Az ötlet

A legtöbb gyakorlati differenciálegyenletnek (pl. $y' = \sin(xy)$) nincs zárt alakú megoldása. Ilyenkor **lépésenként** közelítünk: ha tudjuk, hol vagyunk, és az egyenlet megmondja a **meredekséget**, akkor egy kis $h$ lépéssel az érintő mentén megyünk tovább.

Az $y' = f(x, y)$, $y(x_0) = y_0$ feladatra az **Euler-módszer**:

$$
x_{n+1} = x_n + h, \qquad y_{n+1} = y_n + h \cdot f(x_n, y_n).
$$

**Példa.** $y' = x + y$, $y(0) = 1$, $h = 0{,}5$.

- $y_1 = 1 + 0{,}5 \cdot (0 + 1) = 1{,}5$ (az $x_1 = 0{,}5$ pontban),
- $y_2 = 1{,}5 + 0{,}5 \cdot (0{,}5 + 1{,}5) = 2{,}5$ (az $x_2 = 1$ pontban).

A pontos megoldás $y = 2e^x - x - 1$, így $y(1) = 2e - 2 \approx 3{,}44$: a durva lépésköz miatt a hiba nagy.

## A lépésköz és a hiba

Az $y' = y$, $y(0) = 1$ feladatra (pontos megoldás $e^x$) az Euler-lépés $y_{n+1} = (1 + h)\,y_n$, így $y_n = (1 + h)^n$. A szaggatott vonal az Euler-módszer töréspontos közelítése.

```plot
title: Euler-módszer az y' = y, y(0) = 1 feladatra
x: 0, 3
y: 0, 21
param: h = 0.5, 0.05, 1, 0.05
f: e^x # pontos megoldás: eˣ
dash: (1 + h)^floor(x/h) (1 + x - h floor(x/h)) # Euler-közelítés
value: hiba x = 2-nél = e^2 - (1 + h)^floor(2/h) (1 + 2 - h floor(2/h))
```

Figyeld meg: ha $h$-t felezed, a hiba is **nagyjából feleződik**. Az Euler-módszer **elsőrendű**: a hiba $h$-val arányos. Ezért a gyakorlatban pontosabb módszereket használnak (pl. a **negyedrendű Runge–Kutta**-módszert, ahol $h$ felezésekor a hiba a tizenhatodára csökken), de mindegyik ugyanerre az ötletre épül.

## Stabilitás

Túl nagy lépésköznél a módszer **instabil** lehet. Az $y' = -2y$, $y(0) = 1$ feladat megoldása $e^{-2x}$, ami szépen lecseng. Euler-módszerrel $y_{n+1} = (1 - 2h)\,y_n$: $h = 1$-nél $y_n = (-1)^n$, a közelítés oszcillál, $h > 1$-nél pedig felrobban. Stabilitáshoz itt $\lvert 1 - 2h \rvert < 1$, vagyis $h < 1$ kell.

## Programmal

```python run
import math
# Euler-módszer: y' = f(x, y), y(x0) = y0, n lépés h lépésközzel
def euler(f, x0, y0, h, n):
    x, y = x0, y0
    for _ in range(n):
        y = y + h * f(x, y)
        x = x + h
    return y

f = lambda x, y: x + y              # y' = x + y, y(0) = 1, pontos: 2e^x - x - 1
pontos = 2 * math.e - 2
for h in [0.5, 0.1, 0.01, 0.001]:
    kozelites = euler(f, 0.0, 1.0, h, round(1 / h))
    print(f"h = {h:<6} y(1) ≈ {kozelites:.6f}   hiba = {abs(pontos - kozelites):.2e}")
```

## Összefoglalás

- Euler-módszer: $y_{n+1} = y_n + h\,f(x_n, y_n)$, az érintő mentén lépünk.
- Elsőrendű: a hiba $\sim h$; feleakkora lépésköz, kb. feleakkora hiba (de kétszer annyi lépés).
- Túl nagy $h$ instabilitást okozhat; a gyakorlatban Runge–Kutta-módszereket használunk.

## A lecke feladata

```quiz required
? Az $y' = y$, $y(0) = 1$ feladatra két Euler-lépést teszünk $h = 0{,}1$ lépésközzel. Mennyi $y_2$? (Tizedes törtként.)
= 1.21

? Az $y' = x + y$, $y(0) = 1$ feladatra $h = 0{,}5$-tel két lépést teszünk. Mennyi lesz $y_2 \approx y(1)$? (Tizedes törtként.)
= 2.5

? Mi történik az Euler-módszer hibájával, ha a lépésközt a felére csökkentjük?
- nem változik
+ nagyjából a felére csökken
- a negyedére csökken
- a tizenhatodára csökken

? Az $y' = -2y$, $y(0) = 1$ feladatra $h = 1$-gyel mennyi $y_1$?
= -1
! $y_1 = 1 + 1 \cdot (-2 \cdot 1)$.

? Hány Euler-lépés kell, ha $x = 0$-tól $x = 2$-ig $h = 0{,}01$ lépésközzel haladunk?
= 200

? Az $y' = y$ feladatnál $n$ lépés után $y_n = (1 + h)^n$. Mihez tart $(1 + h)^{1/h}$, ha $h \to 0$ (ez a közelítés $x = 1$-nél)?
+ $e$
- $1$
- $\infty$
- $2$
! Ez az $e$ definíciója (lásd a sorozatok témakört).
```
