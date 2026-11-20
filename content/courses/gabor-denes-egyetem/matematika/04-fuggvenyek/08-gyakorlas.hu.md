---
title: Gyakorlás – függvények
summary: Ellenőrző kérdések és összefoglaló feladatlap a függvényekhez, a határértékhez és a folytonossághoz.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért jobbra tol az f(x − 3), ha mínusz van benne?</summary>

Mert az $f(x - 3)$ az $x$ helyen azt az értéket veszi fel, amit az $f$ az $x - 3$ helyen: minden érték $3$-mal „később”, vagyis $3$-mal jobbra jelenik meg.

</details>

<details>
<summary>2. Mi a különbség a határérték és a függvényérték között egy pontban?</summary>

A határérték azt írja le, hova közelítenek a függvényértékek, ha $x \to x_0$; a függvényérték az $f(x_0)$. A kettő lehet különböző, és a határérték akkor is létezhet, ha $f(x_0)$ nincs értelmezve. Ha a kettő egyenlő, a függvény folytonos.

</details>

<details>
<summary>3. Hogyan döntöd el, hogy egy függvénynek van-e inverze?</summary>

Ha kölcsönösen egyértelmű: minden vízszintes egyenes legfeljebb egy pontban metszi a grafikonját (vízszintes egyenes próba). A szigorúan monoton függvények mindig ilyenek. Ha nem az, szűkítéssel (pl. $x^2$ az $x \geq 0$-ra) kaphatunk invertálható függvényt.

</details>

<details>
<summary>4. Miért hasznos a felezéses módszer a programozásban?</summary>

Mert csak folytonosság és előjelváltás kell hozzá, mindig konvergál, és minden lépés felezi a hibát: $40$ lépés után a pontosság $2^{-40}$-szerese az eredeti intervallumnak. Ugyanez az ötlet a bináris keresés.

</details>

## Összefoglaló feladatlap

```quiz required
? Mi az $f(x) = \sqrt{6 - 2x}$ értelmezési tartományának legnagyobb eleme?
= 3

? Add meg az $f(x) = x^2 + 2$ és a $g(x) = \sqrt{x}$ függvényből az $f(g(x))$ képletét ($x \geq 0$)!
fn: x -> x + 2
domain: 0.1, 5

? Add meg az $f(x) = \dfrac{2x - 1}{x + 3}$ függvény inverzét!
fn: x -> (3x + 1)/(2 - x)
domain: -1, 1.5
! $y(x + 3) = 2x - 1 \Rightarrow x(y - 2) = -3y - 1$

? Az $f(x) = x^2 - 2x - 3$ hány pontban metszi az $x$ tengelyt?
= 2

? Mennyi $\lim\limits_{x \to -1} \dfrac{x^2 + 3x + 2}{x + 1}$?
= 1
! $x^2 + 3x + 2 = (x + 1)(x + 2)$

? Mennyi $\lim\limits_{x \to \infty} \dfrac{4x - 7}{\sqrt{x^2 + 1}}$?
= 4

? Melyik függvény **páros**?
- $x^3 + x$
+ $x^2 \cos x$
- $e^x$
- $\sin x + 1$
! $(-x)^2 \cos(-x) = x^2 \cos x$

? A $-3\sin(2x) + 1$ függvény értékkészlete $[m; M]$. Mennyi $M$?
= 4
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Kompozíció.** Írd meg a `kompozicio(f, g)` függvényt, amely egy **új függvényt** ad vissza: azt, amelyik egy `x`-re $f(g(x))$-et számol!

```python starter
def kompozicio(f, g):
    return lambda x: g(f(x))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód a sorrendet cseréli fel – a kompozíció nem felcserélhető.

```python solution
def kompozicio(f, g):
    return lambda x: f(g(x))              # előbb g, aztán f
```

</details>

```python test
negyzet = lambda x: x ** 2
plusz3 = lambda x: x + 3
assert kompozicio(negyzet, plusz3)(2) == 25     # (2 + 3)²
assert kompozicio(plusz3, negyzet)(2) == 7      # 2² + 3
assert kompozicio(abs, plusz3)(-10) == 7
print("Minden ellenőrzés sikeres!")
```

**2.** **Lineáris függvény inverze.** Az $f(x) = ax + b$ ($a \ne 0$) inverze is lineáris: $f^{-1}(x) = cx + d$. Írd meg az `inverz(a, b)` függvényt, amely a `(c, d)` párt adja vissza 4 tizedesre kerekítve!

```python starter
def inverz(a, b):
    return (a, -b)
```

<details>
<summary>Megoldás</summary>

```python solution
def inverz(a, b):
    # y = ax + b  →  x = (y − b) / a = (1/a)·y − b/a
    return (round(1 / a, 4), round(-b / a, 4))
```

</details>

```python test
assert inverz(3, -6) == (0.3333, 2.0)
assert inverz(2, 4) == (0.5, -2.0)
assert inverz(1.8, 32) == (0.5556, -17.7778)   # Fahrenheit → Celsius
assert inverz(-1, 5) == (-1.0, 5.0)
print("Minden ellenőrzés sikeres!")
```

**3.** **Páros vagy páratlan?** Írd meg a `paritas(f)` függvényt, amely az $x = 0{,}5; 1; 1{,}7; 2{,}3; 3$ pontokban megvizsgálja $f(-x)$-et, és visszaadja: `"páros"`, ha mindenhol $f(-x) = f(x)$; `"páratlan"`, ha mindenhol $f(-x) = -f(x)$; egyébként `"egyik sem"`! (Kerekítési hibák miatt `math.isclose`-zal hasonlíts.)

```python starter
def paritas(f):
    return "páros"
```

<details>
<summary>Megoldás</summary>

Néhány pont vizsgálata csak **ellenőrzés**, nem bizonyítás – de ha egy pontban nem teljesül, az már biztos cáfolat.

```python solution
import math

def paritas(f):
    pontok = [0.5, 1, 1.7, 2.3, 3]
    if all(math.isclose(f(-x), f(x)) for x in pontok):
        return "páros"                    # tükrös az y tengelyre
    if all(math.isclose(f(-x), -f(x)) for x in pontok):
        return "páratlan"                 # tükrös az origóra
    return "egyik sem"
```

</details>

```python test
import math
assert paritas(lambda x: x ** 2) == "páros"
assert paritas(math.cos) == "páros"
assert paritas(lambda x: x ** 3 - x) == "páratlan"
assert paritas(math.sin) == "páratlan"
assert paritas(lambda x: x ** 2 + x) == "egyik sem"
assert paritas(math.exp) == "egyik sem"
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi az $f(x) = \sqrt{x - 4}$ értelmezési tartományának legkisebb eleme?
= 4
! A gyök alatt nem lehet negatív: $x \ge 4$.

? Add meg az $f(x) = 2x + 6$ függvény inverzét!
fn: x -> (x - 6)/2
! $x = \frac{y - 6}{2}$.

? $f(x) = 2x$, $g(x) = x - 1$. Mennyi $f(g(5))$?
= 8
! $g(5) = 4$, $f(4) = 8$.

? Melyik függvény páratlan?
- $x^2 + 1$
+ $x^3$
- $|x|$
- $\cos x$
! $(-x)^3 = -x^3$.

? Hol van az $f(x) = \dfrac{2x - 1}{x + 5}$ függvény függőleges aszimptotája? ($x = ?$)
= -5
! Ahol a nevező $0$.
```
