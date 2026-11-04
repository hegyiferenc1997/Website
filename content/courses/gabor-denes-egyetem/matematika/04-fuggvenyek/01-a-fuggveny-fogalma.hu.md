---
title: A függvény fogalma
summary: Hozzárendelés, értelmezési tartomány, értékkészlet, a függvény megadása és ábrázolása.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **függvény** (egyértelmű hozzárendelés),
- mi az **értelmezési tartomány** és az **értékkészlet**, és hogyan határozzuk meg őket,
- hogyan adható meg egy függvény (képlet, táblázat, grafikon, program), és mit jelent a **grafikon**.

## A definíció

Az $f : A \to B$ **függvény** az $A$ halmaz **minden** eleméhez a $B$ halmaz **pontosan egy** elemét rendeli. Ha $x \in A$, akkor az $x$-hez rendelt elem $f(x)$, az $x$ helyen felvett **függvényérték**.

- $D_f = A$ az **értelmezési tartomány** (a megengedett bemenetek),
- $R_f = \{ f(x) : x \in D_f \} \subseteq B$ az **értékkészlet** (a ténylegesen felvett értékek).

A programozásban is pontosan ez a függvény: minden megengedett bemenethez **egy** kimenet tartozik. (Egy véletlenszámot adó „függvény” matematikai értelemben nem függvény.)

## A természetes értelmezési tartomány

Ha csak a képletet adjuk meg, $D_f$ azon valós számok halmaza, ahol a képlet értelmes:

- nevező $\neq 0$,
- páros gyök alatt $\geq 0$,
- logaritmus argumentuma $> 0$.

Példa: $f(x) = \dfrac{\sqrt{x + 3}}{x - 1}$. Feltételek: $x + 3 \geq 0$ és $x \neq 1$, tehát $D_f = [-3; 1[ \ \cup\ ]1; \infty[$.

## Megadási módok

1. **Képlet:** $f(x) = x^2 - 2x$.
2. **Táblázat:** mérési adatoknál (pl. hőmérséklet óránként).
3. **Grafikon:** az $\{(x; f(x)) : x \in D_f\}$ ponthalmaz a síkon.
4. **Program / algoritmus:** pl. `def f(x): return x*x - 2*x`.
5. **Esetszétválasztás:** $\ f(x) = \begin{cases} -x, & x < 0 \\ x^2, & x \geq 0 \end{cases}$

**Függőleges egyenes próba:** egy görbe akkor függvény grafikonja, ha minden függőleges egyenes **legfeljebb egy** pontban metszi. A kör ($x^2 + y^2 = 1$) ezért nem függvény grafikonja.

## Értékkészlet meghatározása

$f(x) = x^2 - 2x = (x - 1)^2 - 1$ (teljes négyzetté alakítás). Mivel $(x - 1)^2 \geq 0$, $f(x) \geq -1$, és minden $y \geq -1$ értéket fel is vesz. Tehát $R_f = [-1; \infty[$.

```plot
title: Az f(x) = x² − 2x függvény
x: -3, 5
y: -2, 8
param: a = 3, -2.5, 4.5, 0.1
f: x^2 - 2x # f(x) = x² − 2x
point: a, a^2 - 2a # (a; f(a))
value: f(a) = a^2 - 2a
```

A csúszkával bárhová mozgathatod az $x$ helyet: láthatod, hogy a függvényérték sosem kisebb $-1$-nél.

## Összefoglalás

- Függvény: minden $x \in D_f$-hez **pontosan egy** $f(x)$.
- $D_f$: a megengedett bemenetek (nevező $\neq 0$, páros gyök alatt $\geq 0$, log argumentum $> 0$); $R_f$: a felvett értékek.
- Grafikon: az $(x; f(x))$ pontok; függőleges egyenes próba.

## A lecke feladata

```quiz required
? Mennyi $f(-2)$, ha $f(x) = x^2 - 2x$?
= 8

? Mi az $f(x) = x^2 - 2x$ értékkészletének legkisebb eleme?
= -1
! $(x - 1)^2 - 1$

? Melyik szám **nem** eleme az $f(x) = \dfrac{\sqrt{x + 3}}{x - 1}$ értelmezési tartományának?
- $-3$
- $0$
+ $1$
- $5$
! A nevező nem lehet $0$.

? Mi a legkisebb egész szám, amely **nincs** benne a $g(x) = \lg(5 - x)$ értelmezési tartományában?
= 5
! $5 - x > 0 \iff x < 5$

? Melyik **nem** függvény grafikonja?
- egy nem függőleges egyenes
- egy felfelé nyíló parabola
+ az origó középpontú, egységnyi sugarú kör
- az abszolútérték-függvény „V” alakja
! A kört egy függőleges egyenes két pontban is metszheti.
```
