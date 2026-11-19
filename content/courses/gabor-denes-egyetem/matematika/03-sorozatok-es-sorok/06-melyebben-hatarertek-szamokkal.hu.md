---
title: Mélyebben – határérték és sorok számokkal
summary: A küszöbindex megkeresése géppel és egy csúszkás ε-sáv, az e két közelítésének versenye, a mértani, a harmonikus és a váltakozó előjelű harmonikus sor részletösszegei, valamint egy rekurzív sorozat (babiloni gyökvonás), amely lépésenként megduplázza a pontos jegyek számát.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- mit jelent **a gyakorlatban** a küszöbindex, és hogyan függ $\varepsilon$-tól,
- hogy két, ugyanahhoz a határértékhez tartó sorozat **nagyon különböző sebességgel** közelíthet,
- hogyan viselkednek a nevezetes sorok részletösszegei, és miért **csalóka** a harmonikus sor,
- hogyan számol a számológép négyzetgyököt egy **rekurzív sorozattal**.

## 1. A küszöbindex kézzelfoghatóan

Az $a_n = \dfrac{2n + 1}{n + 3}$ sorozat határértéke $2$. A definíció szerint ez azt jelenti: **bármilyen kicsi** $\varepsilon > 0$-hoz van olyan $N$ küszöbindex, hogy $n \geq N$ esetén $|a_n - 2| < \varepsilon$. Keressük meg ezt az $N$-et géppel!

```python run
# Küszöbindex keresése: a_n = (2n + 1) / (n + 3) → 2; mikortól lesz |a_n − 2| < ε?
def a(n):
    return (2 * n + 1) / (n + 3)

for eps in [0.1, 0.01, 0.001]:
    n = 1
    while abs(a(n) - 2) >= eps:          # az első index, ahonnan már az ε-sávban vagyunk
        n += 1
    print(f"ε = {eps:<6}: N = {n:>5}  (a_N = {a(n):.5f})")
```

Papíron: $|a_n - 2| = \left|\dfrac{2n + 1 - 2n - 6}{n + 3}\right| = \dfrac{5}{n + 3}$, és ez akkor kisebb $\varepsilon$-nál, ha $n > \dfrac{5}{\varepsilon} - 3$. Tehát $\varepsilon = 0{,}1$-hez $N = 48$, $\varepsilon = 0{,}01$-hez $N = 498$ – pontosan, amit a gép talált. Ha $\varepsilon$-t tizedére csökkented, a küszöbindex nagyjából tízszeresére nő.

```plot
title: A sorozat tagjai és az ε-sáv
x: 0, 60
y: 0, 2.6
param: h = 0.2, 0.02, 0.6, 0.01
seq: (2n + 1)/(n + 3) @ 1, 60
dash: 2 + h # 2 + ε
dash: 2 - h # 2 − ε
```

Húzd a csúszkát: a sáv szűkül, és egyre később kerülnek bele a tagok – de **valahonnan kezdve mindig** benne maradnak. Ez a konvergencia lényege.

## 2. Az e két közelítése: ki ér előbb célba?

Az $e \approx 2{,}71828$ számot kétféleképpen is megkaphatjuk határértékként:

$$
e = \lim_{n \to \infty} \left(1 + \frac{1}{n}\right)^n = \sum_{k=0}^{\infty} \frac{1}{k!}.
$$

Mindkettő konvergál, de nézd meg a hibákat:

```python run
# Az e két közelítése: (1 + 1/n)^n és 1 + 1/1! + 1/2! + … + 1/n!
import math

tort, fakt, osszeg = 1.0, 1, 1.0
print(f"{'n':>3} | {'(1 + 1/n)^n hibája':>20} | {'Σ 1/k! hibája':>15}")
for n in range(1, 13):
    fakt *= n
    osszeg += 1 / fakt
    if n in (1, 2, 5, 8, 12):
        tort = (1 + 1 / n) ** n
        print(f"{n:>3} | {math.e - tort:>20.2e} | {math.e - osszeg:>15.2e}")
```

$n = 12$-nél az első közelítés még csak az első tizedesjegyben pontos (hiba $\approx 0{,}1$), a második már **tíz** tizedesjegyre! A $(1 + \frac1n)^n$ hibája kb. $\frac{e}{2n}$, tehát lassan, $\frac1n$-nel csökken; a faktoriálisos sor hibája viszont a következő tag nagyságrendje, $\frac{1}{(n+1)!}$, ami villámgyorsan tűnik el. A gyakorlatban (számológépek, programkönyvtárak) ezért mindig a **gyorsan konvergáló** alakot használják.

## 3. Sorok: konvergál vagy nem?

```python run
# Sorok viselkedése: mértani, harmonikus, váltakozó előjelű harmonikus
import math

def reszletosszeg(tag, n):
    return sum(tag(k) for k in range(1, n + 1))

for n in [10, 100, 10_000]:
    m = reszletosszeg(lambda k: 1 / 2 ** k, n)
    h = reszletosszeg(lambda k: 1 / k, n)
    v = reszletosszeg(lambda k: (-1) ** (k + 1) / k, n)
    print(f"n = {n:>6}: Σ 1/2^k = {m:.6f} | Σ 1/k = {h:7.3f} | Σ (−1)^(k+1)/k = {v:.6f}")

# Hány tag kell, hogy a harmonikus sor átlépje a 10-et?
s, k = 0.0, 0
while s <= 10:
    k += 1
    s += 1 / k
print(f"\na harmonikus sor {k} tag után lépi át a 10-et; ln 2 = {math.log(2):.6f}")
```

- A **mértani sor** $\sum \frac{1}{2^k}$ nagyon gyorsan közelít $1$-hez ($\frac{q}{1 - q}$ képlet, $q = \frac12$).
- A **harmonikus sor** $\sum \frac1k$ tagjai ugyan $0$-hoz tartanak, de az összeg **végtelenhez tart** (divergens)! Csak nagyon lassan: $10\,000$ tag után is csak kb. $9{,}8$, és a $10$-et $12\,367$ tag után lépi át. Egy számítógépes „kísérlet” könnyen azt mutatná, hogy konvergál – ezért kell a matematikai bizonyítás (pl. a tagok csoportosítása: $\frac13 + \frac14 > \frac12$, $\frac15 + \ldots + \frac18 > \frac12$, …).
- A **váltakozó előjelű harmonikus sor** $\sum \frac{(-1)^{k+1}}{k}$ viszont konvergál (Leibniz-kritérium), méghozzá $\ln 2 \approx 0{,}693147$-hez – de lassan: $10\,000$ tag után is csak 4 jegy pontos.

Tanulság: a $\lim a_k = 0$ feltétel **szükséges**, de **nem elégséges** a konvergenciához.

## 4. Rekurzív sorozat a számológépben

Hogyan számol a gép $\sqrt{2}$-t? Az egyik legrégebbi módszer (a babiloniak már ismerték) egy **rekurzív sorozat**:

$$
a_0 = 1, \qquad a_{n+1} = \frac{1}{2}\left(a_n + \frac{2}{a_n}\right).
$$

Ötlet: ha $a_n$ túl nagy, akkor $\frac{2}{a_n}$ túl kicsi – a kettő átlaga jobb közelítés.

```python run
# Rekurzív sorozat: a babiloni módszer √2-re, a_(n+1) = (a_n + 2/a_n) / 2
import math

a = 1.0
for n in range(6):
    hiba = abs(a - math.sqrt(2))
    print(f"a_{n} = {a:.15f}   hiba: {hiba:.1e}")
    a = (a + 2 / a) / 2                    # a következő tag az előzőből
```

A hiba lépésenként **négyzetre emelődik**: $10^{-3}$ → $10^{-6}$ → $10^{-12}$, vagyis a pontos jegyek száma lépésenként **megduplázódik**. Öt lépés után a gép teljes pontosságát elérjük. (Ez a módszer a Newton-módszer speciális esete, amellyel a differenciálszámításnál találkozol.) Ha a sorozat konvergál, a határértéke kielégíti az $A = \frac12\left(A + \frac2A\right)$ egyenletet, amiből $A^2 = 2$ – így bizonyítható, hogy valóban $\sqrt2$-höz tart.

## Összefoglalás

- Küszöbindex: $|a_n - A| < \varepsilon$ minden $n \geq N$-re; kisebb $\varepsilon$-hoz nagyobb $N$ kell.
- Ugyanahhoz a határértékhez tartó sorozatok sebessége nagyon eltérhet: $(1 + \frac1n)^n$ lassú, $\sum \frac{1}{k!}$ gyors.
- A harmonikus sor divergens, bár nagyon lassan nő; a váltakozó előjelű harmonikus sor $\ln 2$-höz tart.
- A babiloni módszer rekurzív sorozata lépésenként duplázza a pontos jegyeket.

## A lecke feladata

```quiz required
? Az $a_n = \dfrac{1}{n}$ sorozatnál mi a legkisebb $N$, amelyre $n \geq N$ esetén $|a_n - 0| < 0{,}01$?
= 101
! $\frac1n < 0{,}01 \iff n > 100$.

? Mennyi a $\displaystyle\sum_{k=1}^{\infty} \frac{1}{3^k}$ sor összege?
= 0.5
= 0,5
= 1/2
! Mértani sor: $\frac{q}{1 - q} = \frac{1/3}{2/3} = \frac12$.

? Melyik állítás igaz a harmonikus sorra ($\sum \frac1k$)?
- konvergens, mert a tagjai $0$-hoz tartanak
+ divergens, bár a tagjai $0$-hoz tartanak
- az összege $\ln 2$
- az összege $2$
! A $\lim a_k = 0$ szükséges, de nem elégséges feltétel.

? A babiloni módszerrel számolj $\sqrt{9}$-et $a_0 = 1$-ből: $a_{n+1} = \frac12\left(a_n + \frac{9}{a_n}\right)$. Mennyi $a_1$?
= 5
! $\frac12(1 + 9) = 5$

? Mennyi a $\lim\limits_{n \to \infty} \left(1 + \frac{1}{n}\right)^{2n}$ határérték? (Írd be közelítőleg, két tizedesre.)
= 7.39
= 7,39
! $\left(\left(1 + \frac1n\right)^n\right)^2 \to e^2 \approx 7{,}39$.
```
