---
title: A határozott integrál és a Riemann-összeg
summary: A görbe alatti terület közelítése téglalapokkal, a határozott integrál definíciója és tulajdonságai.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan közelítjük a **görbe alatti területet** téglalapokkal (**Riemann-összeg**),
- mi a **határozott integrál** pontos jelentése,
- a határozott integrál **tulajdonságait** (előjeles terület, additivitás).

## A probléma: görbe alatti terület

Mekkora az $f(x) = x^2$ grafikonja, az $x$ tengely és az $x = 0$, $x = 2$ egyenesek közötti terület? Osszuk az $[a; b]$ intervallumot $n$ egyenlő részre ($\Delta x = \frac{b - a}{n}$), és minden részre állítsunk egy téglalapot, amelynek magassága a függvényérték a rész egy pontjában ($\xi_i$):

$$
S_n = \sum_{i=1}^{n} f(\xi_i)\, \Delta x.
$$

Ez a **Riemann-összeg** (közelítő összeg). Ha $n$ nő, a téglalapok egyre jobban kitöltik a területet.

```plot
title: Riemann-összeg felezőpontokkal
x: -0.5, 3
y: -0.5, 5
param: k = 4, 1, 40, 1
param: b = 2, 0.5, 2.5, 0.1
riemann: x^2 @ 0, b, k # f(x) = x²
```

Növeld a téglalapok $k$ számát: a közelítő összeg a pontos értékhez, $\frac{8}{3} \approx 2{,}6667$-hez tart (ha $b = 2$).

## A határozott integrál

Ha a Riemann-összegek határértéke ($n \to \infty$, a felosztás finomodik) létezik, és nem függ a $\xi_i$ pontok választásától, akkor $f$ **Riemann-integrálható** $[a; b]$-n, és

$$
\int_a^b f(x)\,dx = \lim_{n \to \infty} \sum_{i=1}^{n} f(\xi_i)\,\Delta x.
$$

Minden **folytonos** (sőt minden korlátos, véges sok szakadású) függvény integrálható. Az integrál jel egy megnyújtott S betű (_summa_), a $dx$ a $\Delta x$ „végtelenül kicsi” változata.

## Előjeles terület

Ahol $f < 0$, ott a téglalapok magassága negatív, ezért az integrál az $x$ tengely **alatti** területet **negatív** előjellel számolja. Például $\int_0^{2\pi} \sin x\,dx = 0$, mert a pozitív és a negatív rész kiejti egymást. A **valódi területhez** a negatív szakaszok abszolút értékét kell venni.

## Tulajdonságok

- **Linearitás:** $\int_a^b (c f + g)\,dx = c\int_a^b f\,dx + \int_a^b g\,dx$.
- **Additivitás:** $\int_a^b f\,dx + \int_b^c f\,dx = \int_a^c f\,dx$.
- $\int_a^a f\,dx = 0$, és $\int_b^a f\,dx = -\int_a^b f\,dx$.
- **Monotonitás:** ha $f \leq g$, akkor $\int_a^b f\,dx \leq \int_a^b g\,dx$.

```python run
# Riemann-összeg (felezőpontokkal) az x² függvényre a [0; 2] intervallumon.
def riemann(f, a, b, n):
    dx = (b - a) / n
    return sum(f(a + (i + 0.5) * dx) for i in range(n)) * dx

for n in [2, 10, 100, 1000]:
    print(f"n = {n:>4}: {riemann(lambda x: x * x, 0, 2, n):.6f}")
print("pontos: ", 8 / 3)
```

## Összefoglalás

- Riemann-összeg: $\sum f(\xi_i)\Delta x$, téglalapok területének összege.
- $\int_a^b f(x)\,dx$ = a Riemann-összegek határértéke; folytonos függvényre létezik.
- Előjeles terület: az $x$ tengely alatti rész negatív.
- Lineáris, additív; $\int_b^a = -\int_a^b$.

## A lecke feladata

```quiz required
? Mennyi a felezőpontos Riemann-összeg $f(x) = x^2$-re a $[0; 2]$-n, $n = 2$ részre osztva? (Tizedes törtként.)
= 2.5
! A felezőpontok $0{,}5$ és $1{,}5$, $\Delta x = 1$.

? Mennyi $\displaystyle\int_{-3}^{3} x^3\,dx$?
= 0
! Páratlan függvény, szimmetrikus intervallum.

? Ha $\displaystyle\int_0^2 f\,dx = 5$ és $\displaystyle\int_2^5 f\,dx = -1$, mennyi $\displaystyle\int_0^5 f\,dx$?
= 4

? Ha $\displaystyle\int_1^4 f\,dx = 6$, mennyi $\displaystyle\int_4^1 3f\,dx$?
= -18

? Mennyi $\displaystyle\int_0^{2\pi} \sin x\,dx$?
= 0
```
