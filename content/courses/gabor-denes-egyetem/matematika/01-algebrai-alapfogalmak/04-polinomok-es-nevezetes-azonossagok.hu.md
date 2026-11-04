---
title: Polinomok és nevezetes azonosságok
summary: Algebrai kifejezések, polinomok, nevezetes szorzatok, szorzattá alakítás és polinomosztás.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi az **algebrai kifejezés** és a **polinom** (fokszám, együtthatók),
- a **nevezetes azonosságokat**,
- hogyan alakítunk **szorzattá** (kiemelés, csoportosítás, azonosságok),
- hogyan osztunk el egy polinomot $(x - a)$-val (**Horner-elrendezés**).

## Polinomok

Az **algebrai kifejezés** számokból és változókból áll az alapműveletekkel és hatványozással, pl. $3x^2 - \frac{2}{y} + \sqrt{x}$. A **polinom** (egyváltozós) ennek speciális esete:

$$
p(x) = a_n x^n + a_{n-1} x^{n-1} + \dots + a_1 x + a_0, \qquad a_n \neq 0.
$$

Az $a_i$ számok az **együtthatók**, $n$ a **fokszám**, $a_0$ a **konstans tag**. Például $p(x) = 4x^3 - x + 7$ harmadfokú, együtthatói $4, 0, -1, 7$.

**Műveletek:** összeadáskor az azonos fokú tagokat vonjuk össze; szorzáskor minden tagot minden taggal szorzunk:

$$
(x + 2)(x^2 - 3x + 1) = x^3 - 3x^2 + x + 2x^2 - 6x + 2 = x^3 - x^2 - 5x + 2.
$$

## Nevezetes azonosságok

$$
\begin{aligned}
(a + b)^2 &= a^2 + 2ab + b^2 \\
(a - b)^2 &= a^2 - 2ab + b^2 \\
(a + b)(a - b) &= a^2 - b^2 \\
(a + b)^3 &= a^3 + 3a^2 b + 3ab^2 + b^3 \\
a^3 - b^3 &= (a - b)(a^2 + ab + b^2) \\
a^3 + b^3 &= (a + b)(a^2 - ab + b^2)
\end{aligned}
$$

Fejszámolási trükk: $49 \cdot 51 = (50 - 1)(50 + 1) = 2500 - 1 = 2499$.

## Szorzattá alakítás

1. **Kiemelés:** $6x^3 - 9x^2 = 3x^2(2x - 3)$.
2. **Csoportosítás:** $x^3 + 2x^2 - 4x - 8 = x^2(x + 2) - 4(x + 2) = (x + 2)(x^2 - 4) = (x + 2)^2(x - 2)$.
3. **Azonosság visszafelé:** $x^2 - 10x + 25 = (x - 5)^2$, $\ 4x^2 - 9 = (2x - 3)(2x + 3)$.
4. **Gyöktényezős alak:** ha $x_1, x_2$ az $ax^2 + bx + c$ gyökei, akkor $ax^2 + bx + c = a(x - x_1)(x - x_2)$. Például $x^2 - 5x + 6 = (x - 2)(x - 3)$.

## Polinomosztás és Horner-elrendezés

Ha $p(a) = 0$, akkor $p(x)$ osztható $(x - a)$-val (**gyöktényező kiemelése**). Az osztást gyorsan elvégzi a **Horner-elrendezés**: az együtthatókat sorban leírjuk, az elsőt lehozzuk, majd mindig „szorzunk $a$-val és hozzáadjuk a következőhöz”.

Példa: $p(x) = x^3 - 6x^2 + 11x - 6$, és $p(1) = 0$, tehát osztunk $(x - 1)$-gyel:

| $a = 1$ | $1$ | $-6$ | $11$ | $-6$ |
| ------- | --- | ---- | ---- | ---- |
|         | $1$ | $-5$ | $6$  | $0$  |

A hányados $x^2 - 5x + 6 = (x-2)(x-3)$, a maradék $0$. Tehát $p(x) = (x - 1)(x - 2)(x - 3)$.

A Horner-módszer egyben a polinom **leggyorsabb kiértékelése** is (a maradék $= p(a)$): így számolnak a gépek is.

```python run
def horner(egyutthatok, a):
    """A polinom osztása (x - a)-val: a hányados együtthatói és a maradék (= p(a))."""
    sor = [egyutthatok[0]]
    for c in egyutthatok[1:]:
        sor.append(sor[-1] * a + c)
    return sor[:-1], sor[-1]

print(horner([1, -6, 11, -6], 1))   # ([1, -5, 6], 0)
print(horner([2, 0, -3, 5], 2))     # p(2) = 2·8 − 6 + 5 = 15
```

```plot
title: Egy harmadfokú polinom gyökei
x: -1, 5
y: -4, 4
param: d = 0, -3, 3, 0.1
f: (x - 1)(x - 2)(x - 3) + d # p(x) + d
```

$d = 0$-nál a görbe a $1$, $2$, $3$ pontban metszi az $x$ tengelyt; ha eltolod, a gyökök száma is változhat.

## Összefoglalás

- Polinom: $a_n x^n + \dots + a_0$; fokszám $n$, együtthatók $a_i$.
- Nevezetes azonosságok: $(a\pm b)^2$, $a^2 - b^2$, $(a+b)^3$, $a^3 \pm b^3$.
- Szorzattá alakítás: kiemelés, csoportosítás, azonosságok, gyöktényezős alak.
- Ha $p(a) = 0$, akkor $(x - a) \mid p(x)$; az osztás Horner-elrendezéssel gyors.

## A lecke feladata

```quiz required
? Hányadfokú a $p(x) = 5x^4 - 2x^7 + x - 3$ polinom?
= 7

? Bontsd fel a zárójelet: $(2x - 3)^2$ (a változó $x$).
fn: x -> 4x^2 - 12x + 9
! $(a - b)^2 = a^2 - 2ab + b^2$

? Mennyi $103 \cdot 97$ a nevezetes azonossággal?
= 9991
! $(100 + 3)(100 - 3) = 100^2 - 3^2$

? Melyik a $x^2 - 7x + 12$ szorzatalakja?
- $(x + 3)(x + 4)$
+ $(x - 3)(x - 4)$
- $(x - 2)(x - 6)$
- $(x - 1)(x - 12)$
! Két szám, amelyek szorzata $12$, összege $7$.

? A $p(x) = x^3 - 4x^2 + x + 6$ polinomnak $x = 2$ gyöke. Mi a $p(x) : (x - 2)$ hányados?
fn: x -> x^2 - 2x - 3
! Horner: $1,\ -4 + 2 = -2,\ 1 - 4 = -3,\ 6 - 6 = 0$.
```
