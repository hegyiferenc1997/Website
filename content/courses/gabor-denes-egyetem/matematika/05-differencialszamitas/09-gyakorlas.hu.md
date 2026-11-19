---
title: Gyakorlás – differenciálszámítás
summary: Ellenőrző kérdések és összefoglaló feladatlap a deriválásról és a függvényvizsgálatról.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a derivált geometriai és fizikai jelentése?</summary>

Geometriailag az érintő meredeksége az adott pontban; fizikailag a pillanatnyi változási sebesség (pl. az út deriváltja a sebesség, a sebességé a gyorsulás).

</details>

<details>
<summary>2. Mikor kell a láncszabályt használni?</summary>

Ha a függvény összetett, vagyis egy függvény argumentumában nem simán $x$ áll, hanem egy másik kifejezés: $\sin(3x)$, $e^{x^2}$, $(2x + 1)^5$, $\ln(\cos x)$. Ilyenkor a külső deriváltját még meg kell szorozni a belső deriváltjával.

</details>

<details>
<summary>3. Miért nem elég, hogy f′(x₀) = 0, a szélsőértékhez?</summary>

Mert a derivált nem feltétlenül vált előjelet: az $x^3$ deriváltja a $0$-ban $0$, de előtte és utána is pozitív, így a függvény ott végig nő (ez inflexiós pont, nem szélsőérték).

</details>

<details>
<summary>4. Mikor nem működik jól a Newton-módszer?</summary>

Ha a kezdőérték messze van, ha valamelyik lépésben $f'(x_n) \approx 0$ (az érintő majdnem vízszintes, a következő pont nagyon messzire ugrik), vagy ha a közelítések körbe-körbe járnak. Ilyenkor biztonságosabb előbb felezéssel szűkíteni.

</details>

## Összefoglaló feladatlap

```quiz required
? Deriváld: $f(x) = x^3 \ln x$.
fn: x -> 3x^2 ln(x) + x^2
domain: 0.2, 4

? Deriváld: $f(x) = \dfrac{e^x}{x^2 + 1}$.
fn: x -> e^x (x - 1)^2/(x^2 + 1)^2
domain: -2, 2
! $\frac{e^x(x^2 + 1) - e^x \cdot 2x}{(x^2 + 1)^2}$

? Deriváld: $f(x) = \sqrt{1 + \sin^2 x}$.
fn: x -> sin(x) cos(x)/sqrt(1 + sin(x)^2)

? Írd fel az $f(x) = e^{2x}$ érintőjének egyenletét az $x_0 = 0$ pontban, $y = g(x)$ alakban!
fn: x -> 2x + 1

? Mennyi $\lim\limits_{x \to 0} \dfrac{x - \sin x}{x^3}$? (Törtként vagy tizedes törtként.)
= 1/6
! Háromszor alkalmazd a L'Hospital-szabályt.

? Az $f(x) = 2x^3 - 9x^2 + 12x$ függvénynek hol van helyi **minimuma**? (Az $x$ értéket add meg.)
= 2
! $f'(x) = 6(x - 1)(x - 2)$

? Mennyi az $f(x) = 2x^3 - 9x^2 + 12x$ inflexiós pontjának első koordinátája? (Tizedes törtként.)
= 1.5
= 3/2

? Egy $V = 1$ liter térfogatú, felül nyitott, négyzet alapú doboz anyagszükséglete $A(a) = a^2 + \frac{4}{a}$ (dm²), ahol $a$ az alapél (dm). Mekkora $a$-ra minimális?
= 1.26
! $A'(a) = 2a - \frac{4}{a^2} = 0 \Rightarrow a^3 = 2$, $a = \sqrt[3]{2}$ (két tizedesre).
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Numerikus derivált.** Írd meg a `derivalt(f, x)` függvényt, amely a központi differenciával ($h = 10^{-5}$) közelíti $f'(x)$-et, és 4 tizedesre kerekítve adja vissza!

```python starter
def derivalt(f, x):
    h = 1e-5
    return round((f(x + h) - f(x)) / h, 4)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód előre differenciát használ: $x^3$-nál $x = 2$-ben ennek hibája kb. $6h = 6 \cdot 10^{-5}$, ami kerekítve már $12{,}0001$-et ad.

```python solution
def derivalt(f, x):
    h = 1e-5
    return round((f(x + h) - f(x - h)) / (2 * h), 4)   # szimmetrikus különbség
```

</details>

```python test
import math
assert derivalt(lambda x: x ** 3, 2) == 12.0
assert derivalt(math.sin, 0) == 1.0
assert derivalt(math.exp, 1) == 2.7183
assert derivalt(lambda x: 1 / x, 2) == -0.25
print("Minden ellenőrzés sikeres!")
```

**2.** **Newton-módszer.** Az $f(x) = 0$ egyenlet gyökét a $x_{k+1} = x_k - \dfrac{f(x_k)}{f'(x_k)}$ iterációval közelíthetjük (az érintő metszi az $x$ tengelyt). Írd meg a `newton(f, df, x0, lepesek)` függvényt, amely `lepesek` lépés után 6 tizedesre kerekítve adja vissza a közelítést!

```python starter
def newton(f, df, x0, lepesek):
    return round(x0, 6)
```

<details>
<summary>Megoldás</summary>

Az első teszt pontosan a babiloni gyökvonás: $x - \frac{x^2 - 2}{2x} = \frac12\left(x + \frac2x\right)$.

```python solution
def newton(f, df, x0, lepesek):
    x = x0
    for _ in range(lepesek):
        x = x - f(x) / df(x)              # az érintő zérushelyére lépünk
    return round(x, 6)
```

</details>

```python test
import math
assert newton(lambda x: x * x - 2, lambda x: 2 * x, 1, 6) == 1.414214    # √2
assert newton(lambda x: x ** 3 - 10, lambda x: 3 * x * x, 2, 8) == 2.154435
assert newton(lambda x: math.cos(x) - x, lambda x: -math.sin(x) - 1, 1, 6) == 0.739085
print("Minden ellenőrzés sikeres!")
```

**3.** **Érintő egyenlete.** Írd meg az `erinto(f, df, x0)` függvényt, amely az $f$ grafikonjának $x_0$-beli érintőjét `(m, b)` párként adja vissza ($y = mx + b$), 4 tizedesre kerekítve!

```python starter
def erinto(f, df, x0):
    return (round(df(x0), 4), round(f(x0), 4))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód csak akkor helyes, ha $x_0 = 0$ – ezért megy át rajta a második és a harmadik teszt, de az első nem.

```python solution
def erinto(f, df, x0):
    m = df(x0)                            # meredekség = a derivált értéke
    b = f(x0) - m * x0                    # y − f(x0) = m(x − x0)
    return (round(m, 4), round(b, 4))
```

</details>

```python test
import math
assert erinto(lambda x: x * x, lambda x: 2 * x, 3) == (6, -9)
assert erinto(math.exp, math.exp, 0) == (1.0, 1.0)
assert erinto(math.sin, math.cos, 0) == (1.0, 0.0)
assert erinto(lambda x: x ** 3, lambda x: 3 * x * x, 1) == (3, -2)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Deriváld: $f(x) = x^3 - 4x^2 + 7$
fn: x -> 3*x^2 - 8*x
domain: -3, 3

? Deriváld: $f(x) = x \cdot e^x$
fn: x -> e^x + x*e^x
domain: -2, 2
! Szorzatszabály: $(uv)' = u'v + uv'$.

? Deriváld: $f(x) = \sin(3x)$
fn: x -> 3*cos(3*x)
domain: -2, 2
! Láncszabály: a belső függvény deriváltjával szorzunk.

? Hol van az $f(x) = x^2 - 6x + 5$ függvény minimuma? ($x = ?$)
= 3
! $f'(x) = 2x - 6 = 0 \Rightarrow x = 3$.

? Mennyi $\lim\limits_{x \to 0} \dfrac{e^x - 1}{x}$? (L'Hospital)
= 1
! $\frac{e^x}{1} \to 1$.
```
