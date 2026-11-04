---
title: A sorozat fogalma; számtani és mértani sorozat
summary: Explicit és rekurzív megadás, a számtani és a mértani sorozat tagjai és összegképlete.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **sorozat**, és hogyan adható meg **explicit** és **rekurzív** képlettel,
- a **számtani** és a **mértani** sorozat $n$-edik tagját és az első $n$ tag **összegét**,
- hogyan ábrázolunk egy sorozatot pontokkal.

## A sorozat

A (valós) **számsorozat** olyan függvény, amely minden pozitív egész $n$-hez egy $a_n$ valós számot rendel: $a_1, a_2, a_3, \dots$. Az $a_n$ a sorozat **$n$-edik tagja**.

- **Explicit megadás:** képlet $n$-re, pl. $a_n = \dfrac{1}{n}$: $1, \frac{1}{2}, \frac{1}{3}, \dots$
- **Rekurzív megadás:** a tag az előzőkből, pl. a **Fibonacci-sorozat**: $F_1 = F_2 = 1$, $F_{n} = F_{n-1} + F_{n-2}$: $1, 1, 2, 3, 5, 8, 13, \dots$

A sorozat grafikonja nem összefüggő görbe, hanem az $(n; a_n)$ **pontok** halmaza.

```plot
title: Az aₙ = 1/n és a bₙ = (−1)ⁿ sorozat
x: 0, 20
y: -1.5, 1.5
seq: 1/n @ 1, 20 # aₙ = 1/n
seq: (-1)^n @ 1, 20 # bₙ = (−1)ⁿ
```

## Számtani sorozat

Minden tag az előzőnél ugyanannyival, a **különbséggel** ($d$) nagyobb: $a_{n+1} = a_n + d$.

$$
a_n = a_1 + (n - 1)d, \qquad S_n = a_1 + \dots + a_n = \frac{n\,(a_1 + a_n)}{2}.
$$

A kis Gauss trükkje: $1 + 2 + \dots + 100 = \dfrac{100 \cdot 101}{2} = 5050$.

## Mértani sorozat

Minden tag az előző ugyanannyiszorosa, a **hányados** ($q$): $a_{n+1} = a_n \cdot q$.

$$
a_n = a_1 \cdot q^{\,n-1}, \qquad S_n = a_1 \cdot \frac{q^n - 1}{q - 1} \quad (q \neq 1).
$$

Példa: kamatos kamat. $100\,000$ Ft évi $5\%$-os kamattal $n$ év múlva $100\,000 \cdot 1{,}05^n$ Ft; $10$ év után kb. $162\,889$ Ft.

```plot
title: Mértani sorozat különböző hányadosokkal
x: 0, 15
y: -3, 6
param: q = 0.8, -1.5, 1.5, 0.05
seq: 3 q^(n - 1) @ 1, 15 # aₙ = 3·qⁿ⁻¹
```

Kísérletezz: $0 < q < 1$-nél a tagok csökkennek a $0$ felé, $q > 1$-nél nőnek, negatív $q$-nál váltakozik az előjel.

```python run
# A Fibonacci-sorozat rekurzív megadással, és a számtani/mértani összegképlet ellenőrzése.
fib = [1, 1]
while len(fib) < 15:
    fib.append(fib[-1] + fib[-2])
print("Fibonacci:", fib)

a1, d, n = 3, 4, 20
szamtani = [a1 + (k - 1) * d for k in range(1, n + 1)]
print(sum(szamtani), n * (szamtani[0] + szamtani[-1]) // 2)

a1, q, n = 2, 3, 10
mertani = [a1 * q ** (k - 1) for k in range(1, n + 1)]
print(sum(mertani), a1 * (q ** n - 1) // (q - 1))
```

## Összefoglalás

- Sorozat: $n \mapsto a_n$; explicit (képlet) vagy rekurzív (előző tagokból) megadás.
- Számtani: $a_n = a_1 + (n-1)d$, $S_n = \frac{n(a_1 + a_n)}{2}$.
- Mértani: $a_n = a_1 q^{n-1}$, $S_n = a_1 \frac{q^n - 1}{q - 1}$.

## A lecke feladata

```quiz required
? Egy számtani sorozat első tagja $5$, különbsége $3$. Mennyi a $20$. tagja?
= 62
! $a_{20} = 5 + 19 \cdot 3$

? Mennyi az $1 + 2 + 3 + \dots + 50$ összeg?
= 1275

? Egy mértani sorozat első tagja $2$, hányadosa $3$. Mennyi az $5$. tagja?
= 162
! $2 \cdot 3^4$

? Mennyi a Fibonacci-sorozat $10$. tagja ($F_1 = F_2 = 1$)?
= 55

? Add meg az $1, 4, 9, 16, 25, \dots$ sorozat $n$-edik tagját $n$ függvényében.
fn: n -> n^2
domain: 1, 10
```
