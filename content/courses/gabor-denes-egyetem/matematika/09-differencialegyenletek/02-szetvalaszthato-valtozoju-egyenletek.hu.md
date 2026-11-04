---
title: Szétválasztható változójú egyenletek
summary: Az y' = f(x)·g(y) alakú egyenletek megoldása, radioaktív bomlás és felezési idő, Newton-féle hűlés.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- felismerni és megoldani a **szétválasztható változójú** egyenleteket,
- kiszámolni a **felezési időt**,
- leírni egy test **hűlését** (Newton-törvény).

## A módszer

Ha az egyenlet $y' = f(x)\,g(y)$ alakú, akkor $y' = \frac{dy}{dx}$ írással a változók **szétválaszthatók**:

$$
\frac{dy}{g(y)} = f(x)\,dx \quad \Rightarrow \quad \int \frac{dy}{g(y)} = \int f(x)\,dx + C.
$$

Mindkét oldalt integráljuk, majd (ha lehet) kifejezzük $y$-t. Vigyázat: ahol $g(y) = 0$, ott $y \equiv$ állandó is megoldás (ezt az osztáskor elveszíthetjük).

**Példa.** $y' = 2xy$, $y(0) = 1$.

$$
\int \frac{dy}{y} = \int 2x\,dx \;\Rightarrow\; \ln\lvert y \rvert = x^2 + c \;\Rightarrow\; y = C e^{x^2}.
$$

A kezdeti feltételből $C = 1$, tehát $y = e^{x^2}$.

**Példa.** $y' = \frac{x}{y}$, $y(0) = 2$. $\int y\,dy = \int x\,dx$, $\frac{y^2}{2} = \frac{x^2}{2} + c$, így $y^2 = x^2 + C$. A kezdeti feltételből $C = 4$, és mivel $y(0) > 0$: $y = \sqrt{x^2 + 4}$.

## Radioaktív bomlás és felezési idő

$N' = -\lambda N$ megoldása $N(t) = N_0 e^{-\lambda t}$. A **felezési idő** az az idő, amely alatt a mennyiség a felére csökken:

$$
N_0 e^{-\lambda T_{1/2}} = \frac{N_0}{2} \;\Rightarrow\; T_{1/2} = \frac{\ln 2}{\lambda}.
$$

$n$ felezési idő után a mennyiség $\left(\frac{1}{2}\right)^n$ része marad. Erre épül a radiokarbonos kormeghatározás (a $^{14}\mathrm{C}$ felezési ideje kb. $5730$ év).

## Newton-féle hűlés

Egy test hőmérséklete annál gyorsabban változik, minél nagyobb a különbség a környezet $T_k$ hőmérsékletéhez képest: $T' = -k(T - T_k)$. Szétválasztva ($u = T - T_k$, $u' = -ku$):

$$
T(t) = T_k + (T_0 - T_k)\,e^{-kt}.
$$

```plot
title: Egy bögre kávé hűlése (t percben, T °C-ban)
x: 0, 60
y: 0, 100
param: T0 = 90, 40, 100, 1
param: Tk = 20, 0, 30, 1
param: k = 0.07, 0.01, 0.3, 0.01
f: Tk + (T0 - Tk) e^(-k x) # T(t)
dash: Tk # környezet
tangent: Tk + (T0 - Tk) e^(-k x) @ 0
value: T(10 perc) = Tk + (T0 - Tk) e^(-10k)
value: felezési idő (perc) = ln(2)/k
```

A hőmérséklet-**különbség** felezési ideje $\frac{\ln 2}{k}$: ennyi idő alatt feleződik a kávé és a szoba közti különbség. A kezdeti érintő meredeksége $-k(T_0 - T_k)$: elején hűl a leggyorsabban.

```python run
import math
# A szétválasztható egyenlet megoldásának ellenőrzése numerikus deriválással: y = e^(x²), y' = 2xy?
def y(x):
    return math.exp(x * x)

for x in [-1.0, -0.5, 0.0, 0.5, 1.0]:
    h = 1e-6
    derivalt = (y(x + h) - y(x - h)) / (2 * h)
    print(f"x = {x:+.1f}: y' ≈ {derivalt:.5f}, 2xy = {2 * x * y(x):.5f}")
```

## Összefoglalás

- $y' = f(x)g(y)$: $\int \frac{dy}{g(y)} = \int f(x)\,dx$, utána a kezdeti feltételből jön az állandó.
- Bomlás: $N = N_0 e^{-\lambda t}$, $T_{1/2} = \frac{\ln 2}{\lambda}$.
- Hűlés: $T = T_k + (T_0 - T_k)e^{-kt}$.

## A lecke feladata

```quiz required
? Oldd meg: $y' = 2xy$, $y(0) = 3$.
fn: x -> 3 e^(x^2)
domain: -1, 1

? Oldd meg: $y' = \dfrac{x}{y}$, $y(0) = 2$ (ahol $y > 0$).
fn: x -> sqrt(x^2 + 4)

? Oldd meg: $y' = y^2$, $y(0) = 1$ (az $x < 1$ tartományon).
fn: x -> 1/(1 - x)
domain: -2, 0.5
! $\int y^{-2}\,dy = -\frac{1}{y}$, így $-\frac{1}{y} = x + c$.

? Egy anyag felezési ideje $5730$ év. Az eredeti mennyiség hányad része marad meg $11\,460$ év után? (Tizedes törtként vagy törtként.)
= 0.25
= 1/4

? Egy $90$ °C-os kávé $20$ °C-os szobában $10$ perc alatt $55$ °C-ra hűl. Hány °C lesz $20$ perc után? (Tizedes törtként.)
= 37.5
! A különbség $70$-ről $35$-re feleződött $10$ perc alatt; újabb $10$ perc múlva $17{,}5$.

? Melyik szétválasztható változójú?
+ $y' = x^2 \cos y$
- $y' = x + y$
- $y' = \sin(xy) + 1$
- $y'' = y$
! $f(x) \cdot g(y)$ alakú-e a jobb oldal?
```
