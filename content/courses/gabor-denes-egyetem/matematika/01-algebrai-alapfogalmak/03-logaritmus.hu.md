---
title: A logaritmus
summary: A logaritmus mint a hatványozás „fordítottja”, az azonosságai és az áttérés más alapra.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mit jelent a **logaritmus**, és mikor értelmezett,
- a logaritmus **azonosságait**,
- hogyan térünk át **más alapra**, és miért szerepel a $\log_2$ annyit az informatikában.

## A definíció

Ha $a > 0$, $a \neq 1$ és $b > 0$, akkor $\log_a b$ az a kitevő, amelyre $a$-t emelve $b$-t kapunk:

$$
\log_a b = c \iff a^c = b.
$$

Példák: $\log_2 8 = 3$, mert $2^3 = 8$; $\log_{10} 0{,}01 = -2$; $\log_5 1 = 0$; $\log_3 3 = 1$.

Nevezetes jelölések: $\lg x = \log_{10} x$ (tízes alapú), $\ln x = \log_e x$ (természetes alapú, $e \approx 2{,}718$), az informatikában pedig gyakran $\log x = \log_2 x$.

A **feltételek** fontosak: negatív számnak és a $0$-nak **nincs** logaritmusa, és az alap sem lehet $1$ vagy nempozitív.

## Azonosságok

$a > 0$, $a \neq 1$, $x, y > 0$ esetén:

$$
\log_a(xy) = \log_a x + \log_a y, \qquad \log_a \frac{x}{y} = \log_a x - \log_a y, \qquad \log_a x^k = k \log_a x.
$$

Ezek a hatványozás azonosságaiból következnek: szorzásból összeadás lesz. (Régen ezért használtak logarlécet szorzásra.)

**Áttérés más alapra:**

$$
\log_a x = \frac{\log_b x}{\log_b a}, \qquad \text{pl.}\quad \log_2 10 = \frac{\ln 10}{\ln 2} \approx 3{,}32.
$$

## Miért fontos az informatikában?

- **Hány bit kell** $N$ különböző érték tárolásához? $\lceil \log_2 N \rceil$. Például $1000$ értékhez $\lceil 9{,}97 \rceil = 10$ bit.
- **Bináris keresés:** egy rendezett, $N$ elemű tömbben legfeljebb kb. $\log_2 N$ lépésben megtaláljuk az elemet: egymillió elemnél kb. $20$ lépés.
- A logaritmus **lassan nő**: ez az $O(\log n)$ algoritmusok titka.

```python run
import math
# Hány bit kell N különböző értékhez, és hány lépés a bináris keresés?
for n in [2, 10, 1000, 1_000_000, 4_000_000_000]:
    print(f"N = {n:>13,}: {math.ceil(math.log2(n)):>2} bit, kb. {math.log2(n):5.1f} lépés")
```

```plot
title: Az exponenciális és a logaritmus függvény
x: -3, 8
y: -3, 8
param: a = 2, 1.2, 5, 0.1
f: a^x # aˣ
f: log(a, x) # logₐ x
dash: x # y = x
```

A két grafikon egymás tükörképe az $y = x$ egyenesre: a logaritmus az exponenciális függvény **inverze** (erről a függvényeknél még lesz szó).

## Összefoglalás

- $\log_a b = c \iff a^c = b$; csak $b > 0$ és $a > 0$, $a \neq 1$ esetén értelmezett.
- $\log(xy) = \log x + \log y$, $\log(x/y) = \log x - \log y$, $\log x^k = k\log x$.
- Áttérés: $\log_a x = \ln x / \ln a$; $N$ értékhez $\lceil \log_2 N \rceil$ bit kell.

## A lecke feladata

```quiz required
? Mennyi $\log_2 32$?
= 5

? Mennyi $\log_{10} 0{,}001$?
= -3

? Mennyi $\log_6 4 + \log_6 9$?
= 2
! $\log_6 4 + \log_6 9 = \log_6 36$

? Hány bit kell legalább $300$ különböző érték tárolásához?
= 9
! $2^8 = 256 < 300 \leq 512 = 2^9$

? Melyik kifejezés **nem** értelmezett a valós számok körében?
- $\log_3 1$
- $\ln e$
+ $\log_2 (-4)$
- $\lg 0{,}5$
! A logaritmus csak pozitív számra értelmezett.
```
