---
title: Határértékek kiszámítása
summary: Műveleti szabályok, a legmagasabb fokú taggal osztás, a rendőr-elv, nevezetes határértékek és az e szám.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a határérték **műveleti szabályait**,
- a **racionális törtek** határértékét (osztás a legmagasabb hatvánnyal),
- a **gyökös különbségek** kezelését (bővítés),
- a **rendőr-elvet** és a **nevezetes határértékeket**, köztük az $e$ számot.

## Műveleti szabályok

Ha $a_n \to A$ és $b_n \to B$ (véges számok), akkor

$$
a_n \pm b_n \to A \pm B, \qquad a_n b_n \to AB, \qquad \frac{a_n}{b_n} \to \frac{A}{B} \ (B \neq 0), \qquad a_n^k \to A^k.
$$

**Határozatlan alakok**, amelyekre nincs általános szabály, csak átalakítással kezelhetők: $\dfrac{\infty}{\infty}$, $\dfrac{0}{0}$, $\infty - \infty$, $0 \cdot \infty$, $1^\infty$.

## Racionális törtek: osztás a legmagasabb hatvánnyal

$$
\lim_{n \to \infty} \frac{3n^2 - n + 5}{2n^2 + 7} = \lim_{n \to \infty} \frac{3 - \frac{1}{n} + \frac{5}{n^2}}{2 + \frac{7}{n^2}} = \frac{3}{2}.
$$

Általános szabály (a számláló foka $p$, a nevezőé $q$):

- $p < q$: a határérték $0$;
- $p = q$: a **főegyütthatók hányadosa**;
- $p > q$: $\pm\infty$ (divergens).

## Gyökös különbség: bővítés

$\sqrt{n^2 + 4n} - n$ alakja $\infty - \infty$. Bővítünk az „összeggel”:

$$
\sqrt{n^2 + 4n} - n = \frac{(n^2 + 4n) - n^2}{\sqrt{n^2 + 4n} + n} = \frac{4n}{\sqrt{n^2 + 4n} + n} = \frac{4}{\sqrt{1 + \frac{4}{n}} + 1} \to \frac{4}{2} = 2.
$$

## Rendőr-elv

Ha $a_n \leq b_n \leq c_n$, és $a_n \to A$, $c_n \to A$, akkor $b_n \to A$ is. Példa: $-\dfrac{1}{n} \leq \dfrac{\sin n}{n} \leq \dfrac{1}{n}$, tehát $\dfrac{\sin n}{n} \to 0$.

## Nevezetes határértékek

| Sorozat                              | Határérték                 |
| ------------------------------------ | -------------------------- |
| $q^n$                                | $0$, ha $\lvert q \rvert < 1$; $1$, ha $q = 1$; $+\infty$, ha $q > 1$ |
| $\sqrt[n]{a}$ ($a > 0$)              | $1$                        |
| $\sqrt[n]{n}$                        | $1$                        |
| $\dfrac{n^k}{a^n}$ ($a > 1$)         | $0$ (az exponenciális „győz”) |
| $\left(1 + \dfrac{1}{n}\right)^n$    | $e \approx 2{,}71828$      |
| $\left(1 + \dfrac{x}{n}\right)^n$    | $e^x$                      |

Az **$e$ szám** a kamatos kamatból is adódik: ha évi $100\%$ kamatot $n$ részletben írnak jóvá, $1$ Ft-ból egy év alatt $\left(1 + \frac{1}{n}\right)^n$ Ft lesz – és ez $n \to \infty$ esetén sem nő akármeddig, hanem $e$-hez tart.

```plot
title: (1 + c/n)ⁿ → eᶜ
x: 0, 50
y: 0, 8
param: c = 1, 0.5, 2, 0.1
seq: (1 + c/n)^n @ 1, 50 # (1 + c/n)ⁿ
dash: e^c # eᶜ
```

```python run
import math
# Az (1 + 1/n)^n lassan közelít az e-hez.
for n in [1, 10, 100, 1000, 10**6]:
    print(f"n = {n:>7}: {(1 + 1/n) ** n:.6f}")
print("e        =", round(math.e, 6))
```

## Összefoglalás

- Műveleti szabályok véges határértékekre; határozatlan alakoknál átalakítás kell.
- Racionális tört: osztás $n$ legmagasabb hatványával; azonos fokszámnál a főegyütthatók hányadosa.
- $\infty - \infty$ gyökökkel: bővítés a konjugálttal; rendőr-elv korlátos · nullsorozatra.
- $\left(1 + \frac{x}{n}\right)^n \to e^x$; $q^n \to 0$, ha $\lvert q \rvert < 1$.

## A lecke feladata

```quiz required
? Mennyi $\lim\limits_{n\to\infty} \dfrac{4n^3 - 2n}{2n^3 + n^2 + 1}$?
= 2

? Mennyi $\lim\limits_{n\to\infty} \dfrac{7n + 1}{n^2 - 3}$?
= 0
! A nevező foka nagyobb.

? Mennyi $\lim\limits_{n\to\infty} \left(\sqrt{n^2 + 6n} - n\right)$?
= 3
! Bővíts $\sqrt{n^2 + 6n} + n$-nel.

? Mennyi $\lim\limits_{n\to\infty} \left(1 + \dfrac{1}{n}\right)^{2n}$? (Kerekítsd két tizedesre!)
= 7.39
! $\left(\left(1 + \frac{1}{n}\right)^n\right)^2 \to e^2$

? Melyik sorozat határértéke $0$?
- $\left(\frac{3}{2}\right)^n$
- $\sqrt[n]{5}$
+ $\frac{n^{10}}{2^n}$
- $\left(1 + \frac{1}{n}\right)^n$
! Az exponenciális gyorsabban nő bármely hatványnál.
```
