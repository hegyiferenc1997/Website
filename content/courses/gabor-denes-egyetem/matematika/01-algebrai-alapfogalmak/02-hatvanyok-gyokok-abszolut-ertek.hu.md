---
title: Hatványozás, gyökvonás, abszolút érték
summary: A hatványozás azonosságai egész és tört kitevőre, a gyökök mint tört kitevős hatványok, és az abszolút érték.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **hatványozás azonosságait**, a negatív és a nulla kitevőt,
- hogy a **gyökvonás** tört kitevős hatványozás, és hogyan kell gyököket egyszerűsíteni,
- mi az **abszolút érték**, és mi köze a távolsághoz.

## Hatványozás

$a^n = \underbrace{a \cdot a \cdots a}_{n \text{ darab}}$, ahol $a$ az **alap**, $n$ a **kitevő**. A kitevőt kiterjesztjük:

$$
a^0 = 1 \ (a \neq 0), \qquad a^{-n} = \frac{1}{a^n}, \qquad a^{\frac{p}{q}} = \sqrt[q]{a^p} \ (a > 0).
$$

**Azonosságok** ($a, b > 0$, $n, m$ valós):

| Azonosság                          | Példa                                  |
| ---------------------------------- | -------------------------------------- |
| $a^n \cdot a^m = a^{n+m}$          | $2^3 \cdot 2^4 = 2^7 = 128$            |
| $\dfrac{a^n}{a^m} = a^{n-m}$       | $\dfrac{5^6}{5^4} = 5^2 = 25$          |
| $(a^n)^m = a^{nm}$                 | $(3^2)^3 = 3^6 = 729$                  |
| $(ab)^n = a^n b^n$                 | $(2x)^3 = 8x^3$                        |
| $\left(\dfrac{a}{b}\right)^n = \dfrac{a^n}{b^n}$ | $\left(\dfrac{2}{3}\right)^2 = \dfrac{4}{9}$ |

Gyakori hiba: $(a + b)^2 \neq a^2 + b^2$! A hatványozás a szorzásra széttagolható, az összeadásra **nem**.

Informatikában a kettő hatványai mindenütt ott vannak: $2^{10} = 1024$ (kibi), $2^{20} \approx 10^6$, $2^{32} \approx 4{,}3 \cdot 10^9$ (32 bites címtér).

## Gyökvonás

A $\sqrt[n]{a}$ az a szám, amelynek $n$-edik hatványa $a$. Páros $n$-nél csak $a \geq 0$-ra értelmezett, és az eredmény is nemnegatív: $\sqrt{9} = 3$ (nem $\pm 3$!). Páratlan $n$-nél negatív számból is vonható: $\sqrt[3]{-8} = -2$.

Mivel $\sqrt[n]{a} = a^{1/n}$, a gyökök azonosságai a hatványokéból következnek:

$$
\sqrt[n]{ab} = \sqrt[n]{a}\,\sqrt[n]{b}, \qquad \sqrt[n]{\sqrt[m]{a}} = \sqrt[nm]{a}, \qquad \sqrt[n]{a^m} = a^{m/n}.
$$

**Egyszerűsítés, kiemelés a gyökjel alól:** $\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}$.

**Nevező gyöktelenítése:** $\dfrac{1}{\sqrt{2}} = \dfrac{\sqrt{2}}{2}$, illetve $\dfrac{1}{\sqrt{3} - 1} = \dfrac{\sqrt 3 + 1}{(\sqrt 3 - 1)(\sqrt 3 + 1)} = \dfrac{\sqrt 3 + 1}{2}$.

Fontos: $\sqrt{x^2} = \lvert x \rvert$, nem $x$! Például $\sqrt{(-5)^2} = \sqrt{25} = 5$.

## Abszolút érték

$$
\lvert x \rvert = \begin{cases} x, & \text{ha } x \geq 0, \\ -x, & \text{ha } x < 0. \end{cases}
$$

Geometriailag $\lvert x \rvert$ az $x$ távolsága a $0$-tól a számegyenesen, és $\lvert a - b \rvert$ az $a$ és $b$ távolsága. Tulajdonságai: $\lvert ab \rvert = \lvert a \rvert \lvert b \rvert$, és a **háromszög-egyenlőtlenség**: $\lvert a + b \rvert \leq \lvert a \rvert + \lvert b \rvert$.

```plot
title: Az abszolútérték-függvény eltolva
x: -6, 6
y: -1, 7
param: c = 0, -4, 4, 0.5
f: abs(x - c) # |x − c|
dash: abs(x) # |x|
```

A csúszkával láthatod: a $\lvert x - c \rvert$ grafikonja a $\lvert x \rvert$ „V” alakja, $c$-vel jobbra tolva, mert $\lvert x - c\rvert$ az $x$ távolsága a $c$-től.

## Összefoglalás

- $a^0 = 1$, $a^{-n} = 1/a^n$, $a^{p/q} = \sqrt[q]{a^p}$; azonos alapú hatványok szorzásakor a kitevők összeadódnak.
- $\sqrt[n]{a} = a^{1/n}$; páros gyök csak nemnegatív számból, eredménye nemnegatív; $\sqrt{x^2} = \lvert x \rvert$.
- $\lvert a - b \rvert$ a két szám távolsága; $\lvert a + b \rvert \leq \lvert a \rvert + \lvert b \rvert$.

## A lecke feladata

```quiz required
? Mennyi $2^{-3}$? (Törtként vagy tizedes törtként is megadhatod.)
= 1/8
= 0.125
! $a^{-n} = \frac{1}{a^n}$

? Mennyi $8^{2/3}$?
= 4
! $8^{2/3} = \left(\sqrt[3]{8}\right)^2$

? Írd fel egyetlen hatványként: $\dfrac{x^5 \cdot x^{-2}}{x}$ (a változó $x$).
fn: x -> x^2
domain: 0.5, 3
! A kitevők: $5 + (-2) - 1$.

? Melyik egyenlő $\sqrt{50}$-nel?
- $25\sqrt{2}$
+ $5\sqrt{2}$
- $2\sqrt{5}$
- $10\sqrt{5}$
! $50 = 25 \cdot 2$

? Mennyi $\lvert 3 - 8 \rvert + \lvert -2 \rvert$?
= 7
```
