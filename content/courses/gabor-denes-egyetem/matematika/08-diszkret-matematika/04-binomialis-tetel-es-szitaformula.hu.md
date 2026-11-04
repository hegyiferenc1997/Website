---
title: A binomiális tétel és a szitaformula
summary: A Pascal-háromszög, a binomiális tétel és következményei, valamint a logikai szita (tartalmazás–kizárás elve).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **Pascal-háromszöget** és a binomiális együtthatók tulajdonságait,
- a **binomiális tételt**, és hogyan számolunk vele együtthatót,
- a **szitaformulát** (tartalmazás–kizárás elvét) két és három halmazra.

## A Pascal-háromszög

A $\binom{n}{k}$ számokat háromszögbe rendezve minden szám a fölötte lévő kettő összege:

$$
\binom{n}{k} = \binom{n - 1}{k - 1} + \binom{n - 1}{k}.
$$

| $n$ | | | | | | | | | | | |
| --- | - | - | - | - | - | - | - | - | - | - | - |
| 0 | | | | | | 1 | | | | | |
| 1 | | | | | 1 | | 1 | | | | |
| 2 | | | | 1 | | 2 | | 1 | | | |
| 3 | | | 1 | | 3 | | 3 | | 1 | | |
| 4 | | 1 | | 4 | | 6 | | 4 | | 1 | |
| 5 | 1 | | 5 | | 10 | | 10 | | 5 | | 1 |

Tulajdonságok: $\binom{n}{0} = \binom{n}{n} = 1$, szimmetria: $\binom{n}{k} = \binom{n}{n - k}$, és egy sor összege $2^n$ (egy $n$ elemű halmaznak $2^n$ részhalmaza van).

## A binomiális tétel

$$
(a + b)^n = \sum_{k=0}^{n} \binom{n}{k} a^{n-k} b^k = a^n + \binom{n}{1}a^{n-1}b + \binom{n}{2}a^{n-2}b^2 + \dots + b^n.
$$

Miért? A $(a + b)(a + b)\cdots(a + b)$ szorzat kifejtésében az $a^{n-k}b^k$ tag annyiszor szerepel, ahányféleképpen az $n$ tényezőből kiválaszthatjuk azt a $k$-t, ahonnan $b$-t veszünk: $\binom{n}{k}$-szor.

**Példa.** $(2x - 1)^5$-ben az $x^2$ együtthatója: $k = 3$ (háromszor a $-1$-et választjuk), $\binom{5}{3}(2x)^2(-1)^3 = 10 \cdot 4 \cdot (-1)\,x^2 = -40x^2$.

**Következmények:** $a = b = 1$-gyel $\sum_k \binom{n}{k} = 2^n$; $a = 1$, $b = -1$-gyel $\sum_k (-1)^k\binom{n}{k} = 0$ (a páros és a páratlan elemszámú részhalmazok száma egyenlő).

```plot
title: (1 + x)^N és a kifejtés első M + 1 tagja
x: -1, 1
y: -1, 8
param: N = 6, 1, 12, 1
param: M = 1, 0, 12, 1
f: (1 + x)^N # (1 + x)^N
dash: sum(k, 0, M, binom(N, k) x^k) # az első M + 1 tag
```

$M = 1$-nél a $1 + Nx$ egyenest kapod, ami kis $x$-re jó közelítés (ez a kamatos kamat vagy a relatív hibák becslésének alapja). $M = N$-nél a két görbe pontosan egybeesik.

## A szitaformula

Két halmazra:

$$
\lvert A \cup B \rvert = \lvert A \rvert + \lvert B \rvert - \lvert A \cap B \rvert,
$$

mert a metszet elemeit kétszer számoltuk. Három halmazra:

$$
\lvert A \cup B \cup C \rvert = \lvert A \rvert + \lvert B \rvert + \lvert C \rvert - \lvert A \cap B \rvert - \lvert A \cap C \rvert - \lvert B \cap C \rvert + \lvert A \cap B \cap C \rvert.
$$

**Példa.** Az $1, \dots, 100$ számok közül hány osztható $2$-vel vagy $3$-mal? $50 + 33 - 16 = 67$ (a $6$-tal oszthatók a metszet).

```python run
# Szitaformula ellenőrzése: 1..1000 közül hány NEM osztható sem 2-vel, sem 3-mal, sem 5-tel?
N = 1000
kozvetlen = sum(1 for i in range(1, N + 1) if i % 2 and i % 3 and i % 5)
szita = N - (N // 2 + N // 3 + N // 5) + (N // 6 + N // 10 + N // 15) - N // 30
print(kozvetlen, szita)
```

## Összefoglalás

- Pascal-háromszög: $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$, sorösszeg $2^n$.
- Binomiális tétel: $(a + b)^n = \sum \binom{n}{k}a^{n-k}b^k$.
- Szitaformula: összeadjuk az egyeseket, kivonjuk a páronkénti metszeteket, hozzáadjuk a hármasokat…

## A lecke feladata

```quiz required
? Mi az $x^3$ együtthatója az $(1 + x)^7$ kifejtésében?
= 35

? Mi az $x^2$ együtthatója a $(2x - 1)^5$ kifejtésében?
= -40
! $\binom{5}{3}(2x)^2(-1)^3$

? Mennyi $\displaystyle\sum_{k=0}^{10} \binom{10}{k}$?
= 1024

? Melyik egyenlő $\binom{9}{4}$-gyel?
- $\binom{9}{3}$
+ $\binom{9}{5}$
- $\binom{8}{4}$
- $\binom{10}{4} - \binom{9}{4}$
! Szimmetria: $\binom{n}{k} = \binom{n}{n - k}$.

? Egy $30$ fős évfolyamon $18$-an tudnak Pythonban, $15$-en C-ben programozni, $8$-an mindkettőben. Hányan nem tudnak egyikben sem?
= 5

? Az $1, \dots, 1000$ számok közül hány **nem** osztható sem $2$-vel, sem $3$-mal, sem $5$-tel?
= 266
```
