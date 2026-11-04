---
title: Az algoritmusok futási idejének növekedése
summary: A nagy O jelölés, a tipikus növekedési osztályok (log n, n, n log n, n², 2ⁿ), összehasonlítás határértékkel, és mit jelent ez a gyakorlatban.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mit jelent a **nagy O jelölés**,
- a tipikus **növekedési osztályokat**, és hogy melyik algoritmus melyikbe tartozik,
- hogyan hasonlíts össze két függvényt **határértékkel**,
- miért fontosabb a növekedési osztály, mint a gép sebessége.

## A nagy O jelölés

Egy algoritmus futási ideje a bemenet $n$ méretétől függ. Minket a **nagy $n$-ekre** jellemző viselkedés érdekel, az állandó szorzók nélkül. $f(n) = O(g(n))$, ha van olyan $c > 0$ és $n_0$, hogy

$$
f(n) \leq c \cdot g(n) \quad \text{minden } n \geq n_0 \text{ esetén.}
$$

Például $3n^2 + 5n + 7 = O(n^2)$, mert $n \geq 1$-re $3n^2 + 5n + 7 \leq 15n^2$. A gyakorlati szabály: a **leggyorsabban növő tagot** tartjuk meg, az együtthatója nélkül.

**Határértékkel:** ha $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$, akkor $f$ lassabban nő (és $f = O(g)$). Így igazolható a sorrend (a sorozatok témakörből): minden $a > 0$-ra $\frac{\log n}{n^a} \to 0$ és $\frac{n^k}{2^n} \to 0$.

## Tipikus osztályok

| Osztály       | Név             | Példa                                                   |
| ------------- | --------------- | ------------------------------------------------------- |
| $O(1)$        | konstans        | tömbelem elérése index alapján                          |
| $O(\log n)$   | logaritmikus    | bináris keresés rendezett tömbben                       |
| $O(n)$        | lineáris        | lineáris keresés, összegzés                             |
| $O(n \log n)$ | „linearitmikus” | jó rendezések (összefésüléses, gyorsrendezés átlagosan) |
| $O(n^2)$      | négyzetes       | két egymásba ágyazott ciklus, buborékrendezés           |
| $O(2^n)$      | exponenciális   | az összes részhalmaz végignézése                        |
| $O(n!)$       | faktoriális     | az összes sorrend végignézése (utazó ügynök naivan)     |

```plot
title: Növekedési osztályok
x: 0, 20
y: 0, 100
param: N = 10, 1, 20, 1
f: log2(x) # log₂ n
f: x # n
f: x log2(x) # n log₂ n
f: x^2 # n²
f: 2^x # 2ⁿ
value: log₂ N = log2(N)
value: N log₂ N = N log2(N)
value: N² = N^2
value: 2^N = 2^N
```

Már $N = 20$-nál $2^{20} \approx 10^6$, míg $N^2 = 400$. Ha egy gép másodpercenként $10^9$ lépést tesz, egy $2^n$-es algoritmus $n = 60$-nál már évtizedekig futna, egy $n \log n$-es viszont $n = 10^9$-re is másodpercek alatt kész. **A jobb algoritmus többet ér, mint a gyorsabb gép.**

```python run
import math
# Bináris keresés: hány lépés kell n elemnél? (≈ log₂ n)
def binaris_kereses(tomb, cel):
    lo, hi, lepes = 0, len(tomb) - 1, 0
    while lo <= hi:
        lepes += 1
        kozep = (lo + hi) // 2
        if tomb[kozep] == cel:
            return kozep, lepes
        if tomb[kozep] < cel:
            lo = kozep + 1
        else:
            hi = kozep - 1
    return -1, lepes

for n in [10, 1000, 1_000_000]:
    tomb = list(range(n))
    _, lepes = binaris_kereses(tomb, n - 1)
    print(f"n = {n:>9}: {lepes:>2} lépés, log2(n) ≈ {math.log2(n):.1f}")
```

## Összefoglalás

- $f = O(g)$: valahonnan kezdve $f \leq c\,g$; a domináns tag számít, az együttható nem.
- Sorrend: $1 < \log n < n < n\log n < n^2 < 2^n < n!$.
- Összehasonlítás: $\lim \frac{f}{g} = 0$ esetén $f$ lassabban nő.

## A lecke feladata

```quiz required
? Legfeljebb hány lépés kell egy $1\,000\,000$ elemű rendezett tömbben a bináris kereséshez?
= 20
! $2^{20} = 1\,048\,576 \geq 10^6$.

? Egy $O(n^2)$-es algoritmus $n = 1000$-re $1$ másodpercig fut. Kb. hány másodpercig fut $n = 3000$-re?
= 9

? Melyik igaz?
+ $3n^2 + 100n\log n + 7 = O(n^2)$
- $n^2 = O(n \log n)$
- $2^n = O(n^{10})$
- $n \log n = O(n)$

? Melyik a helyes sorrend, a leglassabban növőtől a leggyorsabban növőig?
- $n$, $\log n$, $n^2$, $n\log n$, $2^n$
+ $\log n$, $n$, $n\log n$, $n^2$, $2^n$
- $\log n$, $n\log n$, $n$, $2^n$, $n^2$
- $n$, $n\log n$, $\log n$, $n^2$, $2^n$

? Hányszor fut le a belső utasítás: `for i in range(n): for j in range(i): ...`? Írd be $n$ függvényeként!
fn: n -> n (n - 1)/2
domain: 1, 20
! $0 + 1 + \dots + (n - 1)$

? Egy $O(2^n)$-es algoritmusnál mi történik a futási idővel, ha $n$ eggyel nő?
- eggyel nő
+ (kb.) megduplázódik
- négyzetre emelődik
- nem változik
```
