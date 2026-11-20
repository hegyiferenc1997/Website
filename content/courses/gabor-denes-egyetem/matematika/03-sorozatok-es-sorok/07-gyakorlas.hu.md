---
title: Gyakorlás – sorozatok és sorok
summary: Ellenőrző kérdések és összefoglaló feladatlap a sorozatokhoz, határértékekhez és sorokhoz.
minutes: 55
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Lehet-e egy sorozat korlátos, de divergens? És monoton, de divergens?</summary>

Igen, mindkettő: a $(-1)^n$ korlátos, de divergens (oszcillál); az $a_n = n$ monoton, de divergens ($+\infty$-hez tart). Csak a **monoton és korlátos** sorozat biztosan konvergens.

</details>

<details>
<summary>2. Miért nem elég, hogy a sor tagjai 0-hoz tartanak?</summary>

Mert a tagok lehetnek elég „lassan” kicsik ahhoz, hogy az összeg mégis végtelen legyen: a harmonikus sor $\sum \frac{1}{n}$ tagjai $0$-hoz tartanak, de a csoportosítással minden blokk összege legalább $\frac{1}{2}$.

</details>

<details>
<summary>3. Mi a teendő ∞/∞ alakú racionális törtnél?</summary>

Osztunk $n$ legmagasabb, a nevezőben szereplő hatványával. Azonos fokszámnál a határérték a főegyütthatók hányadosa, nagyobb nevezőfoknál $0$, nagyobb számlálófoknál $\pm\infty$.

</details>

<details>
<summary>4. Hol jelenik meg a mértani sor az informatikában?</summary>

Például az algoritmusok költségében: ha egy dinamikus tömb mindig kétszeresére nő, a másolások összköltsége $n + \frac{n}{2} + \frac{n}{4} + \dots \leq 2n$, vagyis egy beszúrás átlagosan állandó idejű.

</details>

## Összefoglaló feladatlap

```quiz required
? Egy számtani sorozatban $a_3 = 11$ és $a_8 = 31$. Mennyi $a_1$?
= 3
! $5d = 20$, tehát $d = 4$.

? Egy mértani sorozat első tagja $3$, első három tagjának összege $39$, a hányados pozitív. Mennyi a hányados?
= 3
! $3(1 + q + q^2) = 39 \Rightarrow q^2 + q - 12 = 0$

? Mennyi $\lim\limits_{n\to\infty} \dfrac{(2n + 1)^2}{3n^2 - n}$? (Törtként vagy tizedes törtként.)
= 4/3
! A főegyütthatók: $4$ és $3$.

? Mennyi $\lim\limits_{n\to\infty} \left(\sqrt{n^2 + n} - \sqrt{n^2 - n}\right)$?
= 1
! Bővíts az összeggel: $\frac{2n}{\sqrt{n^2 + n} + \sqrt{n^2 - n}}$.

? Mennyi $\lim\limits_{n\to\infty} \left(1 + \dfrac{3}{n}\right)^n$? (Kerekítsd két tizedesre!)
= 20.09

? Mennyi a $\sum\limits_{n=1}^{\infty} \dfrac{1}{3^n}$ sor összege? (Törtként vagy tizedes törtként.)
= 1/2
! Az első tag $\frac{1}{3}$, a hányados $\frac{1}{3}$.

? Melyik sor divergens?
- $\sum \frac{1}{2^n}$
- $\sum \frac{(-1)^n}{n}$
- $\sum \frac{1}{n^2 + 1}$
+ $\sum \frac{2n}{n + 5}$
! A tagok nem tartanak $0$-hoz.

? Melyik sorozat **szigorúan monoton csökkenő**?
+ $a_n = \frac{n + 3}{n}$
- $a_n = \frac{n}{n + 3}$
- $a_n = (-1)^n$
- $a_n = n^2 - 4n$
! $a_n = 1 + \frac{3}{n}$
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Számtani sorozat összege.** Írd meg a `szamtani_osszeg(a1, d, n)` függvényt, amely az első `n` tag összegét adja vissza – ciklus nélkül, képlettel!

```python starter
def szamtani_osszeg(a1, d, n):
    return a1 * n
```

<details>
<summary>Megoldás</summary>

Gauss trükkje: az első és az utolsó, a második és az utolsó előtti tag összege mindig ugyanannyi.

```python solution
def szamtani_osszeg(a1, d, n):
    an = a1 + (n - 1) * d                 # az n-edik tag
    return n * (a1 + an) / 2              # (első + utolsó) · n / 2
```

</details>

```python test
assert szamtani_osszeg(1, 1, 100) == 5050
assert szamtani_osszeg(3, 4, 10) == 210
assert szamtani_osszeg(10, -2, 6) == 30
print("Minden ellenőrzés sikeres!")
```

**2.** **Mértani sorozat összege.** Írd meg a `mertani_osszeg(a1, q, n)` függvényt, amely az első `n` tag összegét adja vissza 6 tizedesre kerekítve! Vigyázz a $q = 1$ esetre!

```python starter
def mertani_osszeg(a1, q, n):
    return round(a1 * (q ** n - 1) / (q - 1), 6)
```

<details>
<summary>Megoldás</summary>

A kiinduló kód $q = 1$-nél nullával osztana.

```python solution
def mertani_osszeg(a1, q, n):
    if q == 1:
        return round(a1 * n, 6)           # minden tag a1
    return round(a1 * (q ** n - 1) / (q - 1), 6)
```

</details>

```python test
assert mertani_osszeg(1, 2, 10) == 1023
assert mertani_osszeg(1, 0.5, 3) == 1.75
assert mertani_osszeg(5, 1, 4) == 20
assert mertani_osszeg(2, -1, 5) == 2
print("Minden ellenőrzés sikeres!")
```

**3.** **Küszöbindex.** Írd meg a `kuszobindex(eps)` függvényt, amely megadja a legkisebb `N`-et, amelyre $\frac{1}{N^2} < \varepsilon$ (az $a_n = \frac{1}{n^2}$ sorozat ettől kezdve az $\varepsilon$-sávban marad)!

```python starter
def kuszobindex(eps):
    return 1
```

<details>
<summary>Megoldás</summary>

Papíron: $N^2 > \frac{1}{\varepsilon}$, azaz $N > \frac{1}{\sqrt{\varepsilon}}$. $\varepsilon = 0{,}01$-nél $N > 10$, tehát $N = 11$ (a $10$ még pont nem jó, mert $\frac{1}{100}$ nem kisebb $0{,}01$-nél).

```python solution
def kuszobindex(eps):
    N = 1
    while 1 / N ** 2 >= eps:              # amíg nem vagyunk a sávban, lépünk tovább
        N += 1
    return N
```

</details>

```python test
assert kuszobindex(0.5) == 2
assert kuszobindex(0.01) == 11
assert kuszobindex(0.0001) == 101
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mennyi $\lim\limits_{n \to \infty} \dfrac{3n^2 + 1}{n^2 - 5}$?
= 3
! A főegyütthatók hányadosa: $\frac31$.

? Mennyi a $\displaystyle\sum_{k=0}^{\infty} \left(\frac{2}{3}\right)^k$ sor összege?
= 3
! $\frac{1}{1 - q} = \frac{1}{1/3} = 3$.

? Egy számtani sorozatban $a_1 = 7$, $d = 3$. Mennyi $a_{20}$?
= 64
! $a_{20} = 7 + 19 \cdot 3 = 64$.

? Melyik sor konvergens?
- $\sum \frac{1}{k}$
+ $\sum \frac{1}{k^2}$
- $\sum 1$
- $\sum \sqrt{k}$
! $\sum \frac{1}{k^2} = \frac{\pi^2}{6}$.

? Mennyi $\lim\limits_{n \to \infty} \left(1 + \frac{3}{n}\right)^n$? (két tizedesre)
= 20,09
= 20.09
! $e^3 \approx 20{,}09$.
```
