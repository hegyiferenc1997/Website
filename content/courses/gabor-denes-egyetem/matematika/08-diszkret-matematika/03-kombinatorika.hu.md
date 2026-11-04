---
title: Kombinatorika
summary: Összeszámlálás: a szorzás- és az összegszabály, permutáció, variáció és kombináció, ismétléssel és ismétlés nélkül.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- az összeszámlálás két alapszabályát (**szorzás** és **összeadás**),
- a **permutációt**, a **variációt** és a **kombinációt**, ismétléssel és anélkül,
- hogyan döntsd el: **számít-e a sorrend**, és **lehet-e ismétlés**.

## Alapszabályok

- **Szorzásszabály:** ha egy választás két egymás utáni lépésből áll, az elsőre $m$, a másodikra $n$ lehetőség van, akkor összesen $m \cdot n$ lehetőség van. Például $3$ póló és $4$ nadrág: $12$ öltözék.
- **Összegszabály:** ha a lehetőségek két **diszjunkt** csoportra bomlanak ($m$ és $n$ elemű), akkor összesen $m + n$ van.

A kombinatorika „ága” két kérdésen múlik: **számít-e a sorrend**, és **ismétlődhet-e** egy elem.

|                     | Sorrend számít                   | Sorrend nem számít                                     |
| ------------------- | -------------------------------- | ------------------------------------------------------ |
| **ismétlés nélkül** | variáció: $\dfrac{n!}{(n - k)!}$ | kombináció: $\dbinom{n}{k} = \dfrac{n!}{k!\,(n - k)!}$ |
| **ismétléssel**     | ismétléses variáció: $n^k$       | ismétléses kombináció: $\dbinom{n + k - 1}{k}$         |

Itt $n$ a választható elemek száma, $k$ a kiválasztottaké. Az $n! = 1 \cdot 2 \cdots n$ („$n$ faktoriális”), és $0! = 1$.

## Permutáció

$n$ különböző elem összes sorrendje: $P_n = n!$. Például $5$ könyv egy polcon $5! = 120$-féleképpen.

**Ismétléses permutáció:** ha az elemek között egyformák vannak ($k_1, k_2, \dots$ darab), akkor $\dfrac{n!}{k_1!\,k_2!\cdots}$. Például a TATA szó betűiből $\frac{4!}{2!\,2!} = 6$ különböző „szó” rakható ki.

## Variáció és kombináció

- **Variáció** (sorrend számít): $10$ futóból az első három helyezett $10 \cdot 9 \cdot 8 = 720$-féle lehet.
- **Ismétléses variáció:** egy $4$ jegyű PIN-kód $10^4 = 10\,000$-féle. Egy $n$ bites szó $2^n$-féle, ezért van egy bájtnak $2^8 = 256$ értéke.
- **Kombináció** (sorrend nem számít): az ötös lottón $\binom{90}{5} = 43\,949\,268$ szelvény lehetséges.
- **Ismétléses kombináció:** $4$ fajta gombócból $3$ gombócot $\binom{4 + 3 - 1}{3} = 20$-féleképpen kérhetünk (a sorrend nem számít, egy fajta többször is jöhet).

Próbáld ki a csúszkákkal! A pontok azt mutatják, hogy egy $N$ elemű halmaz $2^N$ részhalmaza közül mekkora hányad $k$ elemű, minden $k$-ra; alattuk a konkrét darabszámok.

```plot
title: Kombinatorikai kalkulátor
x: -1, 21
y: 0, 0.6
param: N = 10, 1, 20, 1
param: K = 3, 0, 20, 1
seq: binom(N, n)/2^N @ 0, 20 # a k elemű részhalmazok aránya: (N alatt a k)/2^N
value: N! = fact(N)
value: variáció = binom(N, K) * fact(K)
value: kombináció = binom(N, K)
value: ismétléses variáció = N^K
value: ismétléses kombináció = binom(N + K - 1, K)
```

Figyeld meg: a $\binom{n}{k}$ értékek **szimmetrikusak** ($\binom{n}{k} = \binom{n}{n - k}$), és középen a legnagyobbak.

```python run
from itertools import permutations, combinations, product
from math import comb, perm
# Az itertools felsorolja, a math kiszámolja: a kettő egyezik
elemek = "ABCD"
print("permutációk:", len(list(permutations(elemek))), "=", perm(4))
print("2-es variációk:", len(list(permutations(elemek, 2))), "=", perm(4, 2))
print("2-es kombinációk:", [''.join(c) for c in combinations(elemek, 2)], "=", comb(4, 2))
print("2-es ismétléses variációk:", len(list(product(elemek, repeat=2))), "=", 4**2)
```

## Összefoglalás

- Szorzásszabály: egymás utáni lépések; összegszabály: diszjunkt esetek.
- Sorrend számít: variáció ($\frac{n!}{(n-k)!}$, ismétléssel $n^k$); nem számít: kombináció ($\binom{n}{k}$, ismétléssel $\binom{n+k-1}{k}$).
- Permutáció: $n!$; egyforma elemekkel $\frac{n!}{k_1!\,k_2!\cdots}$.

## A lecke feladata

```quiz required
? Hányféle sorrendben ülhet le $6$ ember egy padra?
= 720

? Hány különböző „szó” rakható ki a MATEMATIKA szó összes betűjéből?
= 151200
! $10$ betű: M kétszer, A háromszor, T kétszer: $\frac{10!}{2!\,3!\,2!}$.

? Egy $20$ fős csoportból hányféleképpen választhatunk $3$ fős küldöttséget (a sorrend nem számít)?
= 1140

? Egy $20$ fős csoportból hányféleképpen választhatunk elnököt, titkárt és pénztárost (különböző emberek)?
= 6840

? Hány különböző $8$ karakteres jelszó van, ha minden karakter a $26$ kisbetű egyike lehet? (Hatványként is beírhatod: 26^8.)
= 208827064576
= 26^8

? Melyik képlet adja meg, hányféleképpen tehetünk $5$ egyforma golyót $3$ különböző dobozba?
- $3^5$
- $\binom{5}{3}$
+ $\binom{7}{5}$
- $\frac{5!}{3!}$
! Ismétléses kombináció: $n = 3$ doboz, $k = 5$ golyó, $\binom{n + k - 1}{k}$.
```
