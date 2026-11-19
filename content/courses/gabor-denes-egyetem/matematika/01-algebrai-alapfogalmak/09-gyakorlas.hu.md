---
title: Gyakorlás – algebra és egyenletek
summary: Ellenőrző kérdések és összefoglaló feladatlap az algebrai alapfogalmakhoz és az egyenletekhez.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Miért nem igaz, hogy (a + b)² = a² + b²?</summary>

Mert $(a + b)^2 = (a + b)(a + b) = a^2 + 2ab + b^2$: a szorzásnál a „vegyes” tagok ($ab$ és $ba$) is megjelennek. Például $a = b = 1$-re a bal oldal $4$, a jobb $2$.

</details>

<details>
<summary>2. Mikor kell ellenőrizni egy egyenlet megoldását a végén?</summary>

Ha nem ekvivalens átalakítást végeztünk: négyzetre emeltünk, változót tartalmazó kifejezéssel szoroztunk, vagy a logaritmus/gyök kikötését nem vettük figyelembe menet közben. Ilyenkor hamis gyök jöhet be.

</details>

<details>
<summary>3. Mi a különbség a √9 és az x² = 9 egyenlet megoldásai között?</summary>

$\sqrt{9} = 3$ egyetlen (nemnegatív) szám. Az $x^2 = 9$ egyenletnek két megoldása van: $x = 3$ és $x = -3$, mert $x = \pm\sqrt 9$.

</details>

<details>
<summary>4. Hány bit kell egy 64 lapos kártyapakli egy lapjának kódolásához, és miért?</summary>

$\log_2 64 = 6$ bit, mert $2^6 = 64$: hat bittel pontosan 64 különböző kódot lehet előállítani.

</details>

<details>
<summary>5. Miért nem szorozhatjuk be a nevezővel az (x + 1)/(x − 2) ≥ 0 egyenlőtlenséget?</summary>

Mert a nevező előjele $x$-től függ: ha negatív, a reláció iránya megfordulna. Helyette előjeltáblázatot készítünk a számláló és a nevező zérushelyeivel ($-1$ és $2$).

</details>

## Kidolgozott mintafeladat

Oldd meg a valós számok halmazán: $\lg(x + 6) - \lg(x - 3) = 1$.

1. Kikötés: $x + 6 > 0$ és $x - 3 > 0$, tehát $x > 3$.
2. Azonosság: $\lg \dfrac{x + 6}{x - 3} = 1 \Rightarrow \dfrac{x + 6}{x - 3} = 10$.
3. $x + 6 = 10x - 30 \Rightarrow 9x = 36 \Rightarrow x = 4$.
4. Ellenőrzés: $4 > 3$ ✓, $\lg 10 - \lg 1 = 1$ ✓.

## Összefoglaló feladatlap

```quiz required
? Mennyi $\left(\dfrac{27}{8}\right)^{-2/3}$? (Törtként is megadhatod.)
= 4/9
! Előbb a köbgyök: $\frac{3}{2}$, aztán négyzetre emelés és reciprok.

? Egyszerűsítsd: $\dfrac{x^3 - 8}{x^2 - 4}$ ($x \neq \pm 2$).
fn: x -> (x^2 + 2x + 4)/(x + 2)
domain: -1, 1.5
! $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$

? A $x^2 + px + 12 = 0$ egyenlet egyik gyöke $3$. Mennyi $p$?
= -7
! Viète: a másik gyök $4$, összegük $-p$.

? Oldd meg: $2^{x+3} - 2^x = 56$. Mennyi $x$?
= 3
! $2^x (8 - 1) = 56$

? Oldd meg: $\lg(x + 6) - \lg(x - 3) = 1$. Mennyi $x$?
= 4

? Oldd meg: $\sqrt{x + 1} = x - 1$. Mennyi $x$?
= 3
! A négyzetre emelés után $x = 0$ is kijön, de az hamis gyök.

? Hány egész szám elégíti ki a $\lvert x + 2 \rvert \leq 3$ egyenlőtlenséget?
= 7
! $-5 \leq x \leq 1$

? Egy termék árát $20\%$-kal emelték, majd az új árat $20\%$-kal csökkentették. Hány százalékkal olcsóbb az eredetinél?
= 4
! $1{,}2 \cdot 0{,}8 = 0{,}96$
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Tört egyszerűsítése.** Írd meg az `egyszerusit(szamlalo, nevezo)` függvényt, amely a törtet a legegyszerűbb alakjában adja vissza `(számláló, nevező)` párként! A nevező mindig legyen pozitív. (Tipp: `math.gcd`.)

```python starter
def egyszerusit(szamlalo, nevezo):
    return (szamlalo, nevezo)
```

<details>
<summary>Megoldás</summary>

```python solution
import math

def egyszerusit(szamlalo, nevezo):
    d = math.gcd(szamlalo, nevezo)        # a legnagyobb közös osztóval osztunk
    if nevezo < 0:
        d = -d                            # az előjelet a számlálóba visszük
    return (szamlalo // d, nevezo // d)
```

</details>

```python test
assert egyszerusit(12, 18) == (2, 3)
assert egyszerusit(-6, 8) == (-3, 4)
assert egyszerusit(5, -10) == (-1, 2)
assert egyszerusit(7, 7) == (1, 1)
print("Minden ellenőrzés sikeres!")
```

**2.** **Másodfokú egyenlet.** Írd meg a `masodfoku(a, b, c)` függvényt, amely az $ax^2 + bx + c = 0$ egyenlet valós gyökeit növekvő sorrendben, 3 tizedesre kerekítve, listában adja vissza! Ha nincs valós gyök, üres listát, ha egy van (kettős gyök), egyelemű listát adjon.

```python starter
def masodfoku(a, b, c):
    return []
```

<details>
<summary>Megoldás</summary>

Negatív $a$ esetén a képlet a gyököket fordított sorrendben adja, ezért rendezünk a végén.

```python solution
import math

def masodfoku(a, b, c):
    D = b * b - 4 * a * c                 # diszkrimináns
    if D < 0:
        return []
    if D == 0:
        return [round(-b / (2 * a), 3)]
    x1 = (-b - math.sqrt(D)) / (2 * a)
    x2 = (-b + math.sqrt(D)) / (2 * a)
    return sorted([round(x1, 3), round(x2, 3)])
```

</details>

```python test
assert masodfoku(1, -5, 6) == [2.0, 3.0]
assert masodfoku(1, 2, 1) == [-1.0]
assert masodfoku(1, 0, 1) == []
assert masodfoku(2, 1, -1) == [-1.0, 0.5]
assert masodfoku(-1, 0, 2) == [-1.414, 1.414]
print("Minden ellenőrzés sikeres!")
```

**3.** **Kamatos kamat.** Írd meg a `kamatos(toke, kamatlab, ev)` függvényt, amely megadja, mennyi pénzünk lesz `ev` év múlva, ha évi `kamatlab` százalékos kamat tőkésedik! Az eredményt kerekítsd egész forintra.

```python starter
def kamatos(toke, kamatlab, ev):
    return toke + toke * kamatlab / 100 * ev
```

<details>
<summary>Megoldás</summary>

A kiinduló kód egyszerű kamattal számol (minden évben csak az eredeti tőke után jár kamat) – 10 év alatt ez már 12 889 Ft különbség.

```python solution
def kamatos(toke, kamatlab, ev):
    return round(toke * (1 + kamatlab / 100) ** ev)   # minden évben (1 + p/100)-zal szorzunk
```

</details>

```python test
assert kamatos(100000, 5, 1) == 105000
assert kamatos(100000, 5, 10) == 162889
assert kamatos(1000000, 3, 20) == 1806111
assert kamatos(50000, 0, 7) == 50000
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Bontsd ki: $(a - 3)^2 = a^2 - 6a + ?$
= 9
! $(a - b)^2 = a^2 - 2ab + b^2$.

? Mennyi $\log_2 64$?
= 6
! $2^6 = 64$.

? Mennyi $8^{2/3}$?
= 4
! $\sqrt[3]{8}^{\,2} = 2^2 = 4$.

? Melyik $x$-ekre igaz $|x - 2| < 3$?
- $x < 5$
+ $-1 < x < 5$
- $x > -1$
- $-5 < x < 1$
! $-3 < x - 2 < 3$, azaz $-1 < x < 5$.

? Add meg egyszerűsítve: $\dfrac{x^2 - 9}{x - 3}$ (ahol $x \ne 3$)
fn: x -> x + 3
domain: -5, 2
! $x^2 - 9 = (x - 3)(x + 3)$.
```
