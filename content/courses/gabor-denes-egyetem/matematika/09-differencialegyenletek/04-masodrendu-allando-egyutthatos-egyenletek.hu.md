---
title: Másodrendű, állandó együtthatós egyenletek
summary: A karakterisztikus egyenlet, a három megoldástípus, a csillapított rezgés, és röviden az inhomogén eset és a rezonancia.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- megoldani az $y'' + a y' + b y = 0$ egyenletet a **karakterisztikus egyenlettel**,
- a **három esetet** (két valós gyök, kettős gyök, komplex gyökpár),
- leírni egy **csillapított rezgést**,
- mit jelent a **rezonancia**.

## A karakterisztikus egyenlet

Az $y'' + a y' + b y = 0$ ($a, b$ állandók) megoldását $y = e^{\lambda x}$ alakban keressük. Behelyettesítve $e^{\lambda x}(\lambda^2 + a\lambda + b) = 0$, és mivel $e^{\lambda x} \neq 0$:

$$
\lambda^2 + a\lambda + b = 0 \qquad \text{(karakterisztikus egyenlet).}
$$

A gyököktől függően az általános megoldás:

| Gyökök                                          | Általános megoldás                                          | Viselkedés                |
| ----------------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| két különböző valós: $\lambda_1 \neq \lambda_2$ | $C_1 e^{\lambda_1 x} + C_2 e^{\lambda_2 x}$                 | exponenciális             |
| kettős valós: $\lambda$                         | $(C_1 + C_2 x)\,e^{\lambda x}$                              | exponenciális (határeset) |
| komplex: $\alpha \pm \beta i$                   | $e^{\alpha x}\big(C_1\cos(\beta x) + C_2\sin(\beta x)\big)$ | rezgés                    |

A két állandót két kezdeti feltétel ($y(0)$ és $y'(0)$) határozza meg.

**Példa.** $y'' - 3y' + 2y = 0$, $y(0) = 0$, $y'(0) = 1$. A karakterisztikus egyenlet $\lambda^2 - 3\lambda + 2 = 0$, gyökei $1$ és $2$, így $y = C_1 e^x + C_2 e^{2x}$. A feltételekből $C_1 + C_2 = 0$, $C_1 + 2C_2 = 1$, tehát $C_2 = 1$, $C_1 = -1$: $y = e^{2x} - e^x$.

**Példa.** $y'' + 4y = 0$: $\lambda^2 + 4 = 0$, $\lambda = \pm 2i$ ($\alpha = 0$, $\beta = 2$), így $y = C_1\cos(2x) + C_2\sin(2x)$: csillapítatlan rezgés.

## Csillapított rezgés

Egy rugóra akasztott, súrlódással fékezett test kitérésére $m y'' + c y' + k y = 0$. Átírva:

$$
y'' + 2\delta\,y' + \omega_0^2\,y = 0, \qquad \delta = \frac{c}{2m}, \quad \omega_0 = \sqrt{\frac{k}{m}}.
$$

Ha $\delta < \omega_0$ (**gyenge csillapítás**), a gyökök $-\delta \pm \omega i$, ahol $\omega = \sqrt{\omega_0^2 - \delta^2}$. Az $y(0) = 1$, $y'(0) = 0$ kezdeti feltételekkel:

$$
y(t) = e^{-\delta t}\left(\cos(\omega t) + \frac{\delta}{\omega}\sin(\omega t)\right).
$$

```plot
title: Csillapított rezgés: y(0) = 1, y'(0) = 0
x: 0, 15
y: -1.2, 1.2
param: w0 = 2, 1, 4, 0.1
param: d = 0.2, 0, 0.9, 0.05
f: e^(-d x) (cos(sqrt(w0^2 - d^2) x) + d/sqrt(w0^2 - d^2) sin(sqrt(w0^2 - d^2) x)) # y(t)
dash: e^(-d x) # burkoló
dash: -e^(-d x) # burkoló
value: ω = sqrt(w0^2 - d^2)
value: periódusidő = 2pi/sqrt(w0^2 - d^2)
```

($w0$ a csúszkán $\omega_0$, $d$ a $\delta$.) A rezgés amplitúdója az $e^{-\delta t}$ burkoló szerint csökken; $\delta = 0$-nál csillapítatlan. Ha $\delta = \omega_0$ (**kritikus csillapítás**), a test rezgés nélkül, a lehető leggyorsabban áll vissza: ezt használják az autók lengéscsillapítóinál és a mérőműszereknél. $\delta > \omega_0$ esetén (**túlcsillapítás**) lassabban, szintén rezgés nélkül.

Ugyanez az egyenlet írja le az elektromos **RLC-kört** is ($L q'' + R q' + \frac{1}{C} q = 0$).

## Inhomogén eset és rezonancia

Az $y'' + a y' + b y = f(x)$ megoldása $y = y_h + y_p$, ahol $y_p$-t gyakran a jobb oldalhoz hasonló **próbafüggvénnyel** keressük (pl. $f = $ polinom → polinom, $f = e^{cx}$ → $Ae^{cx}$, $f = \sin(\Omega x)$ → $A\cos(\Omega x) + B\sin(\Omega x)$).

Ha egy csillapítatlan rezgő rendszert a saját frekvenciájával gerjesztünk ($y'' + \omega_0^2 y = \sin(\omega_0 t)$), a kitérés korlátlanul nő: ez a **rezonancia** (a hidak és épületek tervezésénél kerülendő, a rádióknál pedig épp ezzel hangolunk).

## Összefoglalás

- $y'' + ay' + by = 0$: karakterisztikus egyenlet $\lambda^2 + a\lambda + b = 0$.
- Valós gyökök: exponenciálisok; kettős gyök: $(C_1 + C_2x)e^{\lambda x}$; komplex gyökök: $e^{\alpha x}(\dots\cos\beta x + \dots\sin\beta x)$.
- Csillapított rezgés: amplitúdó $e^{-\delta t}$ szerint, körfrekvencia $\sqrt{\omega_0^2 - \delta^2}$.

## A lecke feladata

```quiz required
? Mi az $y'' - 5y' + 6y = 0$ általános megoldása?
- $C_1 e^{-2x} + C_2 e^{-3x}$
+ $C_1 e^{2x} + C_2 e^{3x}$
- $C_1 \cos(2x) + C_2 \sin(3x)$
- $(C_1 + C_2 x)e^{5x}$
! $\lambda^2 - 5\lambda + 6 = (\lambda - 2)(\lambda - 3)$.

? Oldd meg: $y'' + 4y = 0$, $y(0) = 1$, $y'(0) = 0$.
fn: x -> cos(2x)

? Oldd meg: $y'' - 3y' + 2y = 0$, $y(0) = 0$, $y'(0) = 1$.
fn: x -> e^(2x) - e^x
domain: -2, 1

? Oldd meg: $y'' + 2y' + y = 0$, $y(0) = 1$, $y'(0) = 0$.
fn: x -> (1 + x) e^(-x)
! Kettős gyök: $\lambda = -1$, így $y = (C_1 + C_2 x)e^{-x}$.

? Az $y'' + 2y' + 5y = 0$ megoldásai csillapított rezgések. Mekkora a körfrekvenciájuk ($\beta$)?
= 2
! $\lambda = -1 \pm 2i$.

? Egy rugós rendszerre $\delta = 3$ és $\omega_0 = 3$. Milyen a mozgás?
- gyengén csillapított rezgés
+ kritikusan csillapított: rezgés nélkül, a leggyorsabban áll vissza
- túlcsillapított
- csillapítatlan rezgés
```
