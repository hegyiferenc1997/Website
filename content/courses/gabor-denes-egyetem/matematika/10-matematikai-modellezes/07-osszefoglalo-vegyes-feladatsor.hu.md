---
title: Összefoglaló – vegyes feladatsor
summary: Vegyes feladatsor a teljes tananyagból, tanácsokkal az ismétléshez.
minutes: 70
kind: practice
---

## Tanácsok a felkészüléshez

<details>
<summary>1. Hogyan érdemes ismételni?</summary>

Témakörönként: először nézd át a leckék **összefoglalását**, aztán oldd meg újra a **gyakorló leckék** feladatlapjait **segítség nélkül**. Ahol elakadsz, ott olvasd újra a leckét. Az interaktív ábrákkal a „miért” is megmarad, nem csak a képlet.

</details>

<details>
<summary>2. Hogyan ellenőrizd a megoldásodat?</summary>

Minden lépést írj le, és a végén **ellenőrizz**: deriválással egy integrált, behelyettesítéssel egy egyenlet vagy differenciálegyenlet megoldását, nagyságrendi becsléssel egy számolást.

</details>

<details>
<summary>3. Melyek a leggyakoribb hibák?</summary>

A $+C$ lefelejtése a határozatlan integrálnál; a láncszabály belső deriváltjának elhagyása; a négyzetgyökös és logaritmusos egyenleteknél az értelmezési tartomány és a hamis gyökök ellenőrzésének kihagyása; a terület és az előjeles integrál összekeverése; a határértéknél a „$\frac{\infty}{\infty}$” „egyszerűsítése” $1$-re.

</details>

## Vegyes feladatsor

```quiz required
? Mennyi $\log_2 32 + \lg 0{,}01$?
= 3

? Oldd meg: $2^{x + 1} = 16$.
= 3

? $\lvert A \rvert = 12$, $\lvert B \rvert = 9$, $\lvert A \cap B \rvert = 4$. Mennyi $\lvert A \cup B \rvert$?
= 17

? Mennyi $\displaystyle\lim_{n \to \infty} \frac{3n^2 + 1}{n^2 - 5n}$?
= 3

? Mennyi a $\displaystyle\sum_{k=0}^{\infty} \left(\frac{1}{2}\right)^k$ sor összege?
= 2

? Deriváld: $f(x) = x^2 \sin x$.
fn: x -> 2x sin(x) + x^2 cos(x)

? Hol van az $f(x) = x^3 - 3x$ függvény helyi minimuma (az $x$ koordinátája)?
= 1

? Mennyi $\displaystyle\int_0^\pi \sin x\,dx$?
= 2

? Számold ki: $\displaystyle\int x\cos x\,dx$.
fn: x -> x sin(x) + cos(x)
+C
! Parciális integrálás: $u = x$, $v' = \cos x$.

? Add meg a $\cos x$ másodfokú Taylor-polinomját a $0$ körül!
fn: x -> 1 - x^2/2
domain: -1, 1

? Melyik igaz egy $2\pi$ szerint periodikus **páros** függvény Fourier-sorára?
- csak szinuszos tagok vannak benne
+ csak koszinuszos tagok (és az $\frac{a_0}{2}$) vannak benne
- minden együtthatója nulla
- csak páratlan indexű tagok vannak benne

? Hányféleképpen választhatunk ki $6$ ember közül $2$-t (a sorrend nem számít)?
= 15

? Oldd meg: $y' = -3y$, $y(0) = 2$.
fn: x -> 2 e^(-3x)
domain: -1, 1
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Regressziós egyenes.** Írd meg a `regresszio(xs, ys)` függvényt, amely a legkisebb négyzetek módszerével illesztett $y = mx + b$ egyenes `(m, b)` párját adja vissza 3 tizedesre kerekítve! ($m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}$, $b = \bar y - m \bar x$.)

```python starter
def regresszio(xs, ys):
    m = (ys[-1] - ys[0]) / (xs[-1] - xs[0])
    return (round(m, 3), round(ys[0] - m * xs[0], 3))
```

<details>
<summary>Megoldás</summary>

A kiinduló kód csak az első és az utolsó ponton húz át egyenest – a középső mérési adatokat figyelmen kívül hagyja.

```python solution
def regresszio(xs, ys):
    n = len(xs)
    xa, ya = sum(xs) / n, sum(ys) / n     # átlagok
    m = sum((x - xa) * (y - ya) for x, y in zip(xs, ys)) / sum((x - xa) ** 2 for x in xs)
    return (round(m, 3), round(ya - m * xa, 3))
```

</details>

```python test
assert regresszio([1, 2, 3], [2, 4, 6]) == (2.0, 0.0)
assert regresszio([0, 1, 2, 3], [1, 3, 2, 5]) == (1.1, 1.1)
assert regresszio([1, 2, 3, 4, 5], [2.1, 3.9, 6.2, 7.8, 10.1]) == (1.99, 0.05)
print("Minden ellenőrzés sikeres!")
```

**2.** **Logisztikus növekedés.** Írd meg a `logisztikus(K, N0, r, t)` függvényt, amely az $N(t) = \dfrac{K}{1 + \frac{K - N_0}{N_0} e^{-rt}}$ értékét adja vissza 1 tizedesre kerekítve, és a `mikor_eri_el(K, N0, r, arany)` függvényt, amely megadja, mikor éri el a népesség a `K` adott arányát (pl. `0.5` → a fele, ez az inflexiós pont), 2 tizedesre kerekítve!

```python starter
import math

def logisztikus(K, N0, r, t):
    return round(N0 * math.exp(r * t), 1)

def mikor_eri_el(K, N0, r, arany):
    return 0
```

<details>
<summary>Megoldás</summary>

A kiinduló kód exponenciálisan számol: $t = 40$-nél $4{,}8$ milliárdot adna az ezres korlát helyett.

```python solution
import math

def logisztikus(K, N0, r, t):
    A = (K - N0) / N0
    return round(K / (1 + A * math.exp(-r * t)), 1)

def mikor_eri_el(K, N0, r, arany):
    # arany = 1 / (1 + A·e^(−rt))  →  e^(−rt) = (1/arany − 1) / A
    A = (K - N0) / N0
    return round(-math.log((1 / arany - 1) / A) / r, 2)
```

</details>

```python test
assert logisztikus(1000, 10, 0.5, 0) == 10.0
assert logisztikus(1000, 10, 0.5, 10) == 599.9
assert logisztikus(1000, 10, 0.5, 40) == 1000.0
assert mikor_eri_el(1000, 10, 0.5, 0.5) == 9.19
assert mikor_eri_el(1000, 10, 0.5, 0.9) == 13.58
print("Minden ellenőrzés sikeres!")
```

**3.** **Lineáris programozás csúcspontokkal.** Egy LP-feladat optimuma a megengedett tartomány egyik csúcspontjában van. Írd meg a `legjobb_csucs(csucsok, c1, c2)` függvényt, amely a csúcsok `(x, y)` listájából azt adja vissza, ahol a $c_1 x + c_2 y$ célfüggvény **maximális**, a célfüggvény értékével együtt: `((x, y), érték)`!

```python starter
def legjobb_csucs(csucsok, c1, c2):
    return (csucsok[0], c1 * csucsok[0][0] + c2 * csucsok[0][1])
```

<details>
<summary>Megoldás</summary>

Ha a célfüggvény együtthatói változnak (pl. egy termék drágul), egy másik csúcs válhat optimálissá – ezt vizsgálja az érzékenységvizsgálat.

```python solution
def legjobb_csucs(csucsok, c1, c2):
    legjobb = max(csucsok, key=lambda p: c1 * p[0] + c2 * p[1])   # minden csúcsot kiértékelünk
    return (legjobb, c1 * legjobb[0] + c2 * legjobb[1])
```

</details>

```python test
csucsok = [(0, 0), (40, 0), (30, 20), (0, 35)]
assert legjobb_csucs(csucsok, 3, 4) == ((30, 20), 170)
assert legjobb_csucs(csucsok, 5, 1) == ((40, 0), 200)
assert legjobb_csucs(csucsok, 1, 3) == ((0, 35), 105)
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Egy baktériumtenyészet óránként 20%-kal nő. Hány óra alatt duplázódik meg? (egész órára kerekítve, $\frac{\ln 2}{\ln 1{,}2}$)
= 4
! $\frac{0{,}693}{0{,}182} \approx 3{,}8 \approx 4$ óra.

? Egy logisztikus modellben $K = 5000$. Hány egyednél a leggyorsabb a növekedés?
= 2500
! Az inflexiós pont $K/2$-nél van.

? Melyik a leggyorsabban növő?
- $n^3$
- $n \log n$
+ $2^n$
- $n^{10}$
! Az exponenciális függvény végül minden polinomot lehagy.

? A regressziós egyenes $y = 2x + 3$. Mennyit jósol $x = 10$-re?
= 23
! $2 \cdot 10 + 3 = 23$.

? Egy $O(\log_2 n)$ algoritmus (pl. bináris keresés) hány lépést tesz kb. $n = 1\,000\,000$ elemen?
= 20
! $\log_2 10^6 \approx 19{,}9$.
```
