---
title: Gyakorlás – integrálszámítás
summary: Ellenőrző kérdések és összefoglaló feladatlap a határozatlan és határozott integrálhoz.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért kell +C a határozatlan integrálnál, és miért nem kell a határozottnál?</summary>

Mert egy függvénynek végtelen sok primitív függvénye van, amelyek konstansban különböznek ($F + C$). A határozott integrálnál $F(b) - F(a)$-t számolunk, és ebben a $C$ kiesik.

</details>

<details>
<summary>2. Mi a különbség az integrál és a terület között?</summary>

Az integrál előjeles: az $x$ tengely alatti részeket negatívan számolja. A terület mindig nemnegatív, ezért előjelváltásnál a zérushelyeknél szét kell bontani, és a negatív részek abszolút értékét kell venni.

</details>

<details>
<summary>3. Honnan tudod, hogy helyettesítés vagy parciális integrálás kell?</summary>

Ha egy kifejezés és (konstans szorzótól eltekintve) a deriváltja is szerepel (pl. $x e^{x^2}$), helyettesítés. Ha két különböző típusú függvény szorzata (polinom · exponenciális/trigonometrikus, vagy $\ln x$), parciális integrálás, ahol a polinomot (vagy a $\ln x$-et) deriváljuk.

</details>

<details>
<summary>4. Hogyan lehet véges egy végtelen hosszú tartomány területe?</summary>

Ha a függvény elég gyorsan tart $0$-hoz: az $\int_1^b \frac{1}{x^2}\,dx = 1 - \frac{1}{b}$ minden $b$-re $1$ alatt marad, és $1$-hez tart. Ugyanez az ötlet, mint a mértani sornál: végtelen sok, egyre kisebb rész összege lehet véges.

</details>

## Összefoglaló feladatlap

```quiz required
? Számold ki: $\displaystyle\int \left(4x^3 - \frac{3}{x^2} + \frac{1}{\sqrt x}\right) dx$ ($x > 0$).
fn: x -> x^4 + 3/x + 2 sqrt(x)
domain: 0.3, 4
+C

? Számold ki: $\displaystyle\int \frac{x}{x^2 + 9}\,dx$.
fn: x -> ln(x^2 + 9)/2
+C

? Számold ki: $\displaystyle\int x^2 e^{x^3}\,dx$.
fn: x -> e^(x^3)/3
domain: -1, 1
+C

? Számold ki: $\displaystyle\int x e^{2x}\,dx$.
fn: x -> (x/2 - 1/4) e^(2x)
domain: -1, 1
+C

? Mennyi $\displaystyle\int_0^1 (x^3 + 2x)\,dx$? (Tizedes törtként vagy törtként.)
= 1.25
= 5/4

? Mennyi $\displaystyle\int_1^{e^2} \frac{1}{x}\,dx$?
= 2

? Mekkora az $y = x^2 - 4$ és az $x$ tengely közötti terület a $[0; 3]$ intervallumon? (Törtként vagy két tizedesre.)
= 23/3
= 7.67
! A zérushely $2$: $\frac{16}{3} + \frac{7}{3}$

? Mennyi $\displaystyle\int_0^\infty x e^{-x^2}\,dx$? (Törtként vagy tizedes törtként.)
= 1/2
! A primitív függvény $-\frac{1}{2} e^{-x^2}$.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Trapézszabály.** Írd meg a `trapez(f, a, b, n)` függvényt, amely $n$ egyenlő részre osztva a trapézszabállyal közelíti $\int_a^b f(x)\,dx$-et, és 4 tizedesre kerekítve adja vissza!

```python starter
def trapez(f, a, b, n):
    h = (b - a) / n
    return round(sum(f(a + i * h) for i in range(n)) * h, 4)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód a bal oldali téglalapszabály: lineáris függvényre is hibázik, míg a trapézszabály arra pontos.

```python solution
def trapez(f, a, b, n):
    h = (b - a) / n
    belso = sum(f(a + i * h) for i in range(1, n))   # a belső pontok kétszeres súllyal
    return round(h * (f(a) / 2 + belso + f(b) / 2), 4)
```

</details>

```python test
import math
assert trapez(lambda x: x, 0, 2, 4) == 2.0
assert trapez(lambda x: x * x, 0, 1, 100) == 0.3334
assert trapez(math.sin, 0, math.pi, 1000) == 2.0
print("Minden ellenőrzés sikeres!")
```

**2.** **Függvény átlagértéke.** Írd meg az `atlag(f, a, b)` függvényt, amely az $f$ átlagértékét adja meg az $[a, b]$ intervallumon: $\frac{1}{b - a}\int_a^b f(x)\,dx$! Az integrált a középpont-szabállyal számold $n = 10\,000$ részre osztva, és 3 tizedesre kerekíts.

```python starter
def atlag(f, a, b):
    return round((f(a) + f(b)) / 2, 3)
```

<details>
<summary>Megoldás</summary>

A harmadik teszt egy váltakozó áramú teljesítmény átlaga: a $\sin^2$ átlaga egy perióduson $\frac12$ – innen jön az effektív érték $\frac{U_{\max}}{\sqrt2}$ képlete.

```python solution
def atlag(f, a, b):
    n = 10_000
    h = (b - a) / n
    integral = sum(f(a + (i + 0.5) * h) for i in range(n)) * h   # téglalapok a középpontban
    return round(integral / (b - a), 3)
```

</details>

```python test
import math
assert atlag(lambda x: x * x, 0, 3) == 3.0
assert atlag(math.sin, 0, math.pi) == 0.637
assert atlag(lambda x: 325 * math.sin(x) ** 2, 0, 2 * math.pi) == 162.5
print("Minden ellenőrzés sikeres!")
```

**3.** **Energia mért adatokból.** Egy napelem teljesítményét (W) egyenletes időközönként mérjük. Írd meg az `energia_kwh(meresek, lepes_ora)` függvényt, amely a trapézszabállyal kiszámolja a megtermelt energiát kWh-ban, 2 tizedesre kerekítve!

```python starter
def energia_kwh(meresek, lepes_ora):
    return round(sum(meresek) * lepes_ora / 1000, 2)
```

<details>
<summary>Megoldás</summary>

```python solution
def energia_kwh(meresek, lepes_ora):
    wh = sum((meresek[i] + meresek[i + 1]) / 2 * lepes_ora for i in range(len(meresek) - 1))
    return round(wh / 1000, 2)            # Wh → kWh
```

</details>

```python test
assert energia_kwh([0, 1000, 2000, 1000, 0], 1) == 4.0
assert energia_kwh([0, 500, 1500, 3000, 3200, 2800, 1500, 400, 0], 1.5) == 19.35
assert energia_kwh([1000, 1000], 0.25) == 0.25
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Add meg az $f(x) = 6x^2 - 2x$ egy primitív függvényét!
fn: x -> 2*x^3 - x^2
+C
domain: -2, 2
! $\int 6x^2\,dx = 2x^3$, $\int 2x\,dx = x^2$ (bármilyen konstans hozzáadható).

? Mennyi $\displaystyle\int_0^2 3x^2\,dx$?
= 8
! $\left[x^3\right]_0^2 = 8$.

? Mennyi $\displaystyle\int_0^{\pi} \sin x\,dx$?
= 2
! $\left[-\cos x\right]_0^{\pi} = 1 - (-1) = 2$.

? Mekkora a terület az $y = x$ és az $y = x^2$ görbék között a $[0, 1]$ intervallumon? (tört vagy tizedes tört)
= 1/6
= 0,1667
= 0.1667
! $\int_0^1 (x - x^2)\,dx = \frac12 - \frac13 = \frac16$.

? Melyik improprius integrál konvergens?
- $\int_1^\infty \frac{1}{\sqrt{x}}\,dx$
- $\int_1^\infty \frac{1}{x}\,dx$
+ $\int_1^\infty \frac{1}{x^3}\,dx$
- $\int_1^\infty 1\,dx$
! $\int_1^\infty x^{-p}\,dx$ akkor véges, ha $p > 1$.
```
