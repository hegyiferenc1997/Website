---
title: Gyakorlás – Taylor-polinom, Fourier-sorok
summary: Ellenőrző kérdések és összefoglaló feladatlap a Taylor-polinomhoz és a Fourier-sorokhoz.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a Taylor-polinom és a Fourier-sor közelítése között?</summary>

A Taylor-polinom egy pont **környezetében** közelít (ott a függvényérték és a deriváltak egyeznek), távolabb a hiba gyorsan nőhet. A Fourier-sor egy **egész perióduson** át, átlagosan közelít, és ugrásos (nem deriválható) függvényekre is működik.

</details>

<details>
<summary>2. Miért elég $n = 9$ az $e$ értékéhez $10^{-6}$ pontossággal?</summary>

A Lagrange-maradéktag szerint a hiba legfeljebb $\frac{3}{(n + 1)!}$. Ez $n = 9$-re $\frac{3}{3\,628\,800} \approx 8{,}3 \cdot 10^{-7} < 10^{-6}$, $n = 8$-ra viszont $\frac{3}{362\,880} \approx 8{,}3 \cdot 10^{-6}$, ami még túl nagy.

</details>

<details>
<summary>3. Hogyan lehet gyorsan felírni $\sin(x^2)$ vagy $x e^x$ Taylor-polinomját?</summary>

Nem kell deriválni: az ismert sorba **helyettesítünk**, illetve **szorzunk**. $\sin(x^2) = x^2 - \frac{x^6}{6} + \dots$, és $x e^x = x + x^2 + \frac{x^3}{2} + \dots$

</details>

<details>
<summary>4. Miért csak szinuszok vannak a négyszögjel Fourier-sorában, és miért csak páratlan indexűek?</summary>

A négyszögjel páratlan függvény, ezért minden $a_k = 0$. A $b_k = \frac{2}{\pi}\cdot\frac{1 - \cos(k\pi)}{k}$ képletben páros $k$-ra $\cos(k\pi) = 1$, így $b_k = 0$. Szemléletesen: a jel „félhullám-szimmetrikus”, $f(x + \pi) = -f(x)$, és ezt a páros harmonikusok nem tudják.

</details>

## Összefoglaló feladatlap

```quiz required
? Add meg az $f(x) = e^x$ harmadfokú Taylor-polinomját az $a = 0$ pont körül!
fn: x -> 1 + x + x^2/2 + x^3/6
domain: -1, 1

? Add meg az $f(x) = \sqrt{1 + x}$ másodfokú Taylor-polinomját az $a = 0$ pont körül!
fn: x -> 1 + x/2 - x^2/8
domain: -0.5, 0.5
! $f'(0) = \frac{1}{2}$, $f''(0) = -\frac{1}{4}$, és $\frac{f''(0)}{2!} = -\frac{1}{8}$.

? Add meg az $f(x) = \ln x$ másodfokú Taylor-polinomját az $a = 1$ pont körül!
fn: x -> (x - 1) - (x - 1)^2/2
domain: 0.5, 1.5

? Az $x \mapsto \cos x$ Taylor-sorában mennyi az $x^4$-es tag együtthatója? (Törtként vagy tizedes törtként.)
= 1/24

? Melyik intervallumon konvergál a $1 + x + x^2 + \dots$ sor?
- minden valós $x$-re
- $0 \leq x < 1$
+ $-1 < x < 1$
- $-1 \leq x \leq 1$

? A $2\pi$ szerint periodikus $f(x) = x^2$ ($-\pi \leq x \leq \pi$) függvény páros. Mennyi a Fourier-sorában $b_5$?
= 0

? Az $f(x) = 5 - 3\cos(2x) + 4\sin(7x)$ függvény Fourier-sorában mennyi $a_0$?
= 10

? Ugyanebben a sorban mennyi $b_7$?
= 4

? Egy jel értéke $2$ a $(0; \pi)$ és $0$ a $(-\pi; 0)$ szakaszon. Mihez konvergál a Fourier-sora az $x = 0$ ugráshelyen?
= 1
! A két oldali határérték átlaga: $\frac{0 + 2}{2}$.

? Melyik jel Fourier-együtthatói csökkennek a leggyorsabban?
- a négyszögjel
- a fűrészjel
+ az $\lvert x \rvert$ periodikus folytatása (háromszögjel)
- mindháromé ugyanolyan gyorsan
! Ugrás nélküli, folytonos jel: $\frac{1}{k^2}$-es lecsengés.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **e^x Taylor-polinommal.** Írd meg az `exp_kozelites(x, n)` függvényt, amely az $e^x$ Taylor-sorának első `n` tagját ($k = 0, 1, \ldots, n - 1$) adja össze, és 6 tizedesre kerekít! Ne használj `math.factorial`-t: minden tagot az előzőből számolj.

```python starter
def exp_kozelites(x, n):
    return round(1 + x, 6)
```

<details>
<summary>Megoldás</summary>

```python solution
def exp_kozelites(x, n):
    osszeg, tag = 0.0, 1.0
    for k in range(n):
        osszeg += tag
        tag *= x / (k + 1)                # x^(k+1)/(k+1)! az előzőből
    return round(osszeg, 6)
```

</details>

```python test
assert exp_kozelites(1, 1) == 1.0
assert exp_kozelites(1, 2) == 2.0
assert exp_kozelites(1, 10) == 2.718282
assert exp_kozelites(2, 5) == 7.0
assert exp_kozelites(-1, 15) == 0.367879
print("Minden ellenőrzés sikeres!")
```

**2.** **Hány tag kell?** Írd meg a `tagok_szama(x, eps)` függvényt, amely megadja, legalább hány tagot kell összeadni a $\sin x$ Taylor-sorából ($x - \frac{x^3}{3!} + \frac{x^5}{5!} - \ldots$), hogy az eltérés `math.sin(x)`-től kisebb legyen `eps`-nél!

```python starter
def tagok_szama(x, eps):
    return 1
```

<details>
<summary>Megoldás</summary>

Minél messzebb van $x$ a $0$-tól, annál több tag kell – ezért érdemes a nagy szögeket előbb a $[-\pi, \pi]$ intervallumba hozni.

```python solution
import math

def tagok_szama(x, eps):
    osszeg, tag, db = 0.0, x, 0
    while abs(osszeg - math.sin(x)) >= eps:
        osszeg += tag
        db += 1
        tag *= -x * x / ((2 * db) * (2 * db + 1))   # a következő páratlan fokú tag
    return db
```

</details>

```python test
assert tagok_szama(0.1, 1e-6) == 2
assert tagok_szama(1, 1e-6) == 5
assert tagok_szama(3, 1e-6) == 8
assert tagok_szama(3, 1e-2) == 5
print("Minden ellenőrzés sikeres!")
```

**3.** **Fűrészjel Fourier-sora.** A fűrészjel ($f(x) = x$ a $(-\pi, \pi)$ intervallumon, periodikusan) Fourier-sora $2\left(\sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \ldots\right) = \sum_{k=1}^{\infty} \frac{2(-1)^{k+1}}{k}\sin kx$. Írd meg a `furesz(x, n)` függvényt, amely az első `n` tag összegét adja vissza 4 tizedesre kerekítve!

```python starter
def furesz(x, n):
    import math
    return round(sum(2 / k * math.sin(k * x) for k in range(1, n + 1)), 4)
```

<details>
<summary>Megoldás</summary>

A kiinduló kódból hiányzik a váltakozó előjel. Sok taggal a részletösszeg $x$-hez tart ($1000$ tagnál $x = 1$-ben $0{,}9989$).

```python solution
import math

def furesz(x, n):
    return round(sum(2 * (-1) ** (k + 1) / k * math.sin(k * x) for k in range(1, n + 1)), 4)
```

</details>

```python test
import math
assert furesz(math.pi / 2, 1) == 2.0
assert furesz(math.pi / 2, 3) == 1.3333
assert furesz(1, 1000) == 0.9989
assert furesz(0, 50) == 0.0
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mi a $\cos x$ másodfokú Taylor-polinomja a $0$ körül?
fn: x -> 1 - x^2/2
domain: -1, 1
! $\cos x = 1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \ldots$

? Mennyi az $f(x) = e^{2x}$ függvény harmadik deriváltja a $0$-ban?
= 8
! $f'''(x) = 8e^{2x}$.

? Mi az $\ln(1 + x)$ Taylor-sorában az $x^3$ együtthatója? (tört vagy tizedes tört)
= 1/3
= 0,3333
= 0.3333
! $\ln(1 + x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \ldots$

? Egy páratlan függvény Fourier-sorában milyen tagok szerepelnek?
- csak koszinuszos tagok
+ csak szinuszos tagok
- csak a konstans tag
- szinuszos és koszinuszos tagok is
! A koszinusz páros függvény, ezért páratlan függvénynél $a_k = 0$.

? Egy $2\pi$ szerint periodikus függvény Fourier-sorában mennyi a $\sin 5x$ tag frekvenciája, ha az alapfrekvencia 50 Hz? (Hz)
= 250
! A $k$-adik felharmonikus frekvenciája $k \cdot f_0 = 5 \cdot 50 = 250$ Hz.
```
