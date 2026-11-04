---
title: Elsőrendű lineáris egyenletek
summary: Az y' + p(x)·y = q(x) egyenlet: homogén és inhomogén eset, az állandó variálása, integráló tényező, és az RC-kör feltöltődése.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi az **elsőrendű lineáris** differenciálegyenlet,
- hogyan oldjuk meg az **állandó variálásával** (és integráló tényezővel),
- hogyan töltődik fel egy **kondenzátor** egy RC-körben.

## Az egyenlet szerkezete

Az **elsőrendű lineáris** egyenlet alakja

$$
y' + p(x)\,y = q(x).
$$

Ha $q \equiv 0$, **homogén**, különben **inhomogén**. A megoldás szerkezete (ez a linearitás következménye):

$$
y = y_h + y_p, \qquad \text{(a homogén egyenlet általános megoldása + az inhomogén egy partikuláris megoldása).}
$$

## A megoldás lépései

**1. Homogén egyenlet:** $y' = -p(x)\,y$ szétválasztható, a megoldás $y_h = C e^{-P(x)}$, ahol $P$ a $p$ egy primitív függvénye.

**2. Az állandó variálása:** az inhomogén egyenlet megoldását $y = C(x)\,e^{-P(x)}$ alakban keressük. Behelyettesítve a $C(x)$-es tagok kiesnek, és $C'(x) = q(x)\,e^{P(x)}$ marad, ebből integrálással $C(x)$.

(Ugyanezt adja az **integráló tényező**: $\mu = e^{P(x)}$-szel szorozva a bal oldal $(\mu y)'$ lesz, így $\mu y = \int \mu q\,dx$.)

**Példa.** $y' + y = 1$, $y(0) = 0$.

- Homogén: $y_h = Ce^{-x}$.
- Variálás: $y = C(x)e^{-x}$, $C'(x)e^{-x} = 1$, így $C'(x) = e^x$, $C(x) = e^x + K$.
- $y = 1 + Ke^{-x}$; a kezdeti feltételből $K = -1$, tehát $y = 1 - e^{-x}$.

**Gyors út állandó együtthatóknál:** ha $p$ és $q$ állandó, a partikuláris megoldás gyakran „ugyanolyan alakú, mint $q$”. Például $y' - 2y = e^x$-hez $y_p = Ae^x$-et próbálva $A - 2A = 1$, $A = -1$.

## RC-kör

Egy $R$ ellenállású, $C$ kapacitású körre $U$ feszültséget kapcsolva a kondenzátor $u(t)$ feszültségére

$$
RC\,u' + u = U, \qquad u(0) = 0 \quad \Rightarrow \quad u(t) = U\left(1 - e^{-t/\tau}\right), \quad \tau = RC.
$$

A $\tau$ az **időállandó**: $t = \tau$-nál a feszültség a végérték $1 - e^{-1} \approx 63\%$-a, $5\tau$ után már $99\%$ fölött van.

```plot
title: Kondenzátor feltöltődése (t ms-ban, u V-ban)
x: 0, 10
y: 0, 6
param: U = 5, 1, 5.5, 0.5
param: tau = 1.5, 0.2, 5, 0.1
f: U (1 - e^(-x/tau)) # u(t)
dash: U # végérték
tangent: U (1 - e^(-x/tau)) @ 0
point: tau, U (1 - e^(-1)) # t = τ: 63%
```

Az érintő a $0$ pontban pontosan $t = \tau$-nál éri el a végértéket: ez egy gyors grafikus módszer az időállandó leolvasására egy oszcilloszkópos mérésből.

## Összefoglalás

- $y' + p y = q$: $y = y_h + y_p$, ahol $y_h = Ce^{-P(x)}$.
- Állandó variálása: $y = C(x)e^{-P(x)}$, $C' = q\,e^{P}$.
- RC-kör: $u = U(1 - e^{-t/RC})$, időállandó $\tau = RC$.

## A lecke feladata

```quiz required
? Oldd meg: $y' + y = 1$, $y(0) = 0$.
fn: x -> 1 - e^(-x)

? Oldd meg: $y' = y + x$, $y(0) = 0$.
fn: x -> e^x - x - 1
domain: -2, 2
! Próbálj $y_p = Ax + B$ alakot: $A = Ax + B + x$.

? Oldd meg: $y' - 2y = e^x$, $y(0) = 0$.
fn: x -> e^(2x) - e^x
domain: -2, 1

? Oldd meg: $x y' + y = 2x$, $y(1) = 2$ ($x > 0$).
fn: x -> x + 1/x
domain: 0.5, 3
! A bal oldal épp $(xy)'$.

? Egy RC-körben $R = 2\ \mathrm{k\Omega}$, $C = 50\ \mathrm{\mu F}$. Mekkora az időállandó másodpercben? (Tizedes törtként.)
= 0.1
! $\tau = RC = 2000 \cdot 50 \cdot 10^{-6}$.

? Egy RC-körben a feltöltés kezdetétől számítva mennyi idő alatt éri el a feszültség a végérték kb. $63\%$-át?
+ $\tau$
- $\frac{\tau}{2}$
- $\tau \ln 2$
- $5\tau$
```
