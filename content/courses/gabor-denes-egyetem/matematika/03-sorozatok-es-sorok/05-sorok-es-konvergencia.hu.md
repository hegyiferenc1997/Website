---
title: Végtelen sorok és konvergenciájuk
summary: Részletösszeg, mértani sor, harmonikus sor, és a konvergencia eldöntése (szükséges feltétel, hányados-, gyök-, összehasonlító és Leibniz-kritérium).
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mit jelent egy **végtelen sor** összege (**részletösszegek** sorozata),
- a **mértani sor** összegképletét,
- miért **divergens** a harmonikus sor, és mi a **szükséges feltétel**,
- a legfontosabb **konvergenciakritériumokat**.

## Részletösszeg

A $\sum\limits_{n=1}^{\infty} a_n = a_1 + a_2 + a_3 + \dots$ **végtelen sor** jelentése: képezzük az $S_N = a_1 + \dots + a_N$ **részletösszegeket**. Ha az $(S_N)$ sorozat konvergens, a határértéke a sor **összege**; ha nem, a sor **divergens**.

## Mértani sor

$$
\sum_{n=0}^{\infty} q^n = 1 + q + q^2 + \dots = \frac{1}{1 - q}, \qquad \text{ha } \lvert q \rvert < 1,
$$

mert $S_N = \frac{1 - q^{N+1}}{1 - q}$, és $q^{N+1} \to 0$. Ha $\lvert q \rvert \geq 1$, divergens.

Példák: $\dfrac{1}{2} + \dfrac{1}{4} + \dfrac{1}{8} + \dots = 1$, és $0{,}\overline{3} = \dfrac{3}{10} + \dfrac{3}{100} + \dots = \dfrac{3/10}{1 - 1/10} = \dfrac{1}{3}$.

```plot
title: A mértani sor részletösszegei
x: 0, 20
y: 0, 5
param: q = 0.5, 0, 0.9, 0.05
seq: sum(k, 0, n, q^k) @ 0, 20 # Sₙ
dash: 1/(1 - q) # 1/(1 − q)
```

## A szükséges feltétel és a harmonikus sor

Ha $\sum a_n$ konvergens, akkor $a_n \to 0$. **Fordítva nem igaz!** A **harmonikus sor** tagjai $0$-hoz tartanak, mégis divergens:

$$
1 + \frac{1}{2} + \underbrace{\frac{1}{3} + \frac{1}{4}}_{> \frac{1}{2}} + \underbrace{\frac{1}{5} + \dots + \frac{1}{8}}_{> \frac{1}{2}} + \dots = \infty.
$$

Nagyon lassan nő: az első millió tag összege is csak kb. $14{,}4$. Ezzel szemben $\sum \frac{1}{n^2} = \frac{\pi^2}{6} \approx 1{,}645$ konvergens. Általában $\sum \frac{1}{n^p}$ akkor és csak akkor konvergens, ha $p > 1$.

Tehát: ha $a_n \not\to 0$, a sor biztosan divergens (pl. $\sum \frac{n}{n+1}$); ha $a_n \to 0$, még vizsgálni kell.

## Konvergenciakritériumok (pozitív tagú sorokra)

- **Összehasonlító:** ha $0 \leq a_n \leq b_n$ és $\sum b_n$ konvergens, akkor $\sum a_n$ is (majoráns). Ha $a_n \geq b_n \geq 0$ és $\sum b_n$ divergens, akkor $\sum a_n$ is (minoráns).
- **Hányadoskritérium:** ha $\dfrac{a_{n+1}}{a_n} \to L$, akkor $L < 1$ esetén konvergens, $L > 1$ esetén divergens ($L = 1$: nem dönt).
- **Gyökkritérium:** ha $\sqrt[n]{a_n} \to L$, ugyanígy.

Példa: $\sum \dfrac{n}{2^n}$: $\dfrac{a_{n+1}}{a_n} = \dfrac{n + 1}{2n} \to \dfrac{1}{2} < 1$, konvergens (az összege $2$).

**Váltakozó előjelű sor – Leibniz-kritérium:** ha $a_n$ monoton csökkenve $0$-hoz tart, akkor $\sum (-1)^{n+1} a_n$ konvergens. Például $1 - \frac{1}{2} + \frac{1}{3} - \frac{1}{4} + \dots = \ln 2$.

```python run
import math
# Részletösszegek: harmonikus (divergens), 1/n^2 (konvergens), váltakozó harmonikus (ln 2).
for N in [10, 1000, 100000]:
    h = sum(1 / n for n in range(1, N + 1))
    q = sum(1 / n**2 for n in range(1, N + 1))
    v = sum((-1) ** (n + 1) / n for n in range(1, N + 1))
    print(f"N = {N:>6}: harmonikus {h:7.3f} | 1/n² {q:.5f} | váltakozó {v:.5f}")
print("π²/6 =", round(math.pi**2 / 6, 5), " ln 2 =", round(math.log(2), 5))
```

## Összefoglalás

- Sor összege = a részletösszegek határértéke.
- Mértani sor: $\sum q^n = \frac{1}{1-q}$, ha $\lvert q \rvert < 1$.
- Szükséges feltétel: $a_n \to 0$, de nem elégséges (harmonikus sor divergens); $\sum \frac{1}{n^p}$ konvergens $\iff p > 1$.
- Kritériumok: összehasonlító, hányados, gyök ($L < 1$ konvergens), Leibniz váltakozó előjelre.

## A lecke feladata

```quiz required
? Mennyi a $\sum\limits_{n=0}^{\infty} \left(\dfrac{2}{3}\right)^n$ sor összege?
= 3
! $\frac{1}{1 - 2/3}$

? Mennyi a $4 + 2 + 1 + \dfrac{1}{2} + \dots$ sor összege?
= 8
! Első tag $4$, hányados $\frac{1}{2}$.

? Írd fel törtként a $0{,}\overline{45} = 0{,}4545\ldots$ számot (egyszerűsített alakban)!
= 5/11
= 45/99
! $\frac{45}{100} + \frac{45}{100^2} + \dots$

? Melyik sor **konvergens**?
- $\sum \frac{1}{n}$
- $\sum \frac{1}{\sqrt n}$
+ $\sum \frac{1}{n^3}$
- $\sum \frac{n}{n + 1}$
! $\sum \frac{1}{n^p}$ akkor konvergens, ha $p > 1$.

? A hányadoskritériummal: mennyi $L = \lim \dfrac{a_{n+1}}{a_n}$ a $\sum \dfrac{3^n}{n!}$ sornál?
= 0
! $\frac{a_{n+1}}{a_n} = \frac{3}{n + 1}$, tehát a sor konvergens.
```
