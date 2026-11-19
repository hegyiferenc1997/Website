---
title: Mélyebben – függvények a gyakorlatban
summary: A kompozíció sorrendje és az inverz függvény számokkal (Celsius ↔ Fahrenheit), aszimptoták közelítő értékekből és grafikonon, a sin x / x nevezetes határérték és a kis szög közelítés, valamint egy szakaszonként megadott díjszabás mint függvény.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- **számokkal** látni, hogy a kompozíciónál számít a sorrend, és hogy az inverz „visszacsinálja” a függvényt,
- **táblázatból** felismerni a vízszintes és a függőleges aszimptotát,
- miért tart a $\frac{\sin x}{x}$ az $1$-hez, és mire jó ez a mérnöki gyakorlatban,
- egy hétköznapi helyzetet (díjszabás) **szakaszonként megadott függvényként** felírni.

## 1. Kompozíció és inverz számokkal

Legyen $f(x) = x^2$ és $g(x) = x + 3$. Az $f(g(x))$ azt jelenti: **előbb** $g$, aztán $f$; a $g(f(x))$ fordítva.

```python run
# Kompozíció: számít a sorrend! f(x) = x², g(x) = x + 3
f = lambda x: x ** 2
g = lambda x: x + 3

print(" x | f(g(x)) = (x + 3)² | g(f(x)) = x² + 3")
for x in [-2, 0, 1, 4]:
    print(f"{x:>2} | {f(g(x)):>17} | {g(f(x)):>16}")

# Inverz: Celsius → Fahrenheit és vissza; a kettő kompozíciója az identitás
c_bol_f = lambda c: 9 / 5 * c + 32
f_bol_c = lambda fh: 5 / 9 * (fh - 32)
for c in [-40, 0, 37, 100]:
    print(f"{c:>4} °C → {c_bol_f(c):>6.1f} °F → vissza: {f_bol_c(c_bol_f(c)):>6.1f} °C")
```

$f(g(x)) = (x + 3)^2$ és $g(f(x)) = x^2 + 3$ egészen más függvény – a kompozíció **nem felcserélhető**. (Mint a hétköznapokban: előbb felveszed a zoknit, aztán a cipőt – fordítva nem ugyanaz.)

Az **inverz** függvény visszacsinálja az eredetit: $f^{-1}(f(x)) = x$. A Celsius → Fahrenheit átváltás $F = \frac95 C + 32$; az inverzét úgy kapod, hogy kifejezed $C$-t: $C = \frac59 (F - 32)$. A táblázat mutatja, hogy oda-vissza alakítva mindig a kiinduló érték jön vissza. Érdekesség: $-40$ fok Celsiusban és Fahrenheitben ugyanannyi – ez a két függvény grafikonjának metszéspontja.

## 2. Aszimptoták táblázatból

Az $f(x) = \dfrac{2x^2 + 1}{x^2 - 1}$ függvény viselkedését két helyen érdemes megnézni: nagyon nagy $x$-re, és ahol a nevező $0$ ($x = \pm 1$).

```python run
# Aszimptoták számokkal: f(x) = (2x² + 1) / (x² − 1)
f = lambda x: (2 * x ** 2 + 1) / (x ** 2 - 1)

print("x → ∞:      ", "  ".join(f"f({x:g}) = {f(x):.6f}" for x in [10, 100, 1000]))
print("x → 1 jobbról:", "  ".join(f"f({x:g}) = {f(x):.1f}" for x in [1.1, 1.01, 1.001]))
print("x → 1 balról: ", "  ".join(f"f({x:g}) = {f(x):.1f}" for x in [0.9, 0.99, 0.999]))
```

- $x \to \infty$: az értékek $2$-höz közelítenek → **vízszintes aszimptota** $y = 2$. Papíron: osszunk $x^2$-tel: $\dfrac{2 + \frac{1}{x^2}}{1 - \frac{1}{x^2}} \to \dfrac{2}{1} = 2$.
- $x \to 1$: jobbról $+\infty$-be, balról $-\infty$-be „szalad el” → **függőleges aszimptota** $x = 1$ (ugyanígy $x = -1$-nél).

```plot
title: Egy racionális törtfüggvény aszimptotái
x: -4, 4
y: -8, 10
f: (2x^2 + 1)/(x^2 - 1) # f(x)
dash: 2 # y = 2
```

A számtáblázat jó **ellenőrzés**, de nem bizonyítás: a határértéket az algebrai átalakítással kell igazolni. Fordítva viszont sokat segít: ha papíron $3$ jön ki, a táblázat pedig $2$-höz tart, valahol hibáztál.

## 3. A sin x / x és a kis szög közelítés

A $\lim\limits_{x \to 0} \dfrac{\sin x}{x} = 1$ határértékben a $0$-nál a függvény nincs értelmezve (0/0), mégis van határértéke:

```python run
# Nevezetes határérték: sin x / x → 1, ha x → 0 (radiánban!)
import math

for x in [1, 0.1, 0.01, 0.001]:
    print(f"x = {x:<6}: sin x / x = {math.sin(x) / x:.8f}")

fok = math.radians(1)                       # 1 fok radiánban
print(f"\n1° = {fok:.6f} rad, sin(1°) = {math.sin(fok):.6f} – szinte ugyanannyi (kis szög közelítés)")
```

Ez azt jelenti, hogy kis szögekre **$\sin x \approx x$** (radiánban!). A mérnöki gyakorlatban ezt rengeteg helyen használják: az inga mozgásegyenletének egyszerűsítésénél, optikában, a lejtők és dőlésszögek becslésénél. 1° esetén a hiba kisebb, mint két milliomod. Vigyázz: fokban mérve ez **nem** igaz – ezért számol minden programozási nyelv `sin` függvénye radiánban.

## 4. Szakaszonként megadott függvény: egy díjszabás

A hétköznapi „szabályok” gyakran **szakaszonként megadott függvények**. Egy mobilnet-csomag: $3000$ Ft alapdíj $5$ GB-ig, utána $400$ Ft/GB, de legfeljebb $9000$ Ft.

$$
d(x) = \begin{cases} 3000, & 0 \le x \le 5 \\ 3000 + 400\,(x - 5), & 5 < x \le 20 \\ 9000, & x > 20 \end{cases}
$$

```python run
# Szakaszonként megadott függvény: egy mobilnet-díjcsomag havi díja a forgalom (GB) függvényében
def havi_dij(gb):
    if gb <= 5:
        return 3000                         # alapdíj, benne 5 GB
    elif gb <= 20:
        return 3000 + (gb - 5) * 400        # 5 GB fölött 400 Ft/GB
    else:
        return 9000                         # 20 GB fölött díjplafon

for gb in [0, 5, 10, 20, 30]:
    print(f"{gb:>2} GB → {havi_dij(gb):>5} Ft")
```

Érdemes végiggondolni a függvény tulajdonságait: **folytonos** (a szakaszhatárokon nincs ugrás: $d(20) = 3000 + 400 \cdot 15 = 9000$), **monoton növekvő** (de nem szigorúan), **korlátos** ($3000 \le d(x) \le 9000$). Ha a plafon például $8000$ Ft lenne, de a középső képlet változatlan maradna, a díj $20$ GB-nál $9000$-ről hirtelen $8000$-re **ugrana** – a függvény ott nem lenne folytonos, és a több forgalom olcsóbb lenne. A programban egy `if–elif–else` szerkezet pontosan egy szakaszonként megadott függvény.

## Összefoglalás

- A kompozíció nem felcserélhető: $f(g(x)) \ne g(f(x))$ általában; az inverz: $f^{-1}(f(x)) = x$.
- Vízszintes aszimptota: $x \to \pm\infty$ határérték; függőleges: ahol a nevező $0$ és a függvény végtelenhez tart.
- $\lim\limits_{x \to 0} \frac{\sin x}{x} = 1$, ezért kis szögre $\sin x \approx x$ (radiánban).
- A szakaszonként megadott függvény a programbeli `if–elif–else` matematikai megfelelője.

## A lecke feladata

```quiz required
? Add meg az $f(x) = 3x - 6$ függvény inverzét!
fn: x -> x/3 + 2
! Fejezd ki $x$-et: $y = 3x - 6 \Rightarrow x = \frac{y + 6}{3}$.

? $f(x) = x^2$, $g(x) = x + 3$. Mennyi $g(f(-2))$?
= 7
! $f(-2) = 4$, $g(4) = 7$.

? Mi az $f(x) = \dfrac{6x^2 - x}{2x^2 + 5}$ függvény vízszintes aszimptotája? ($y = ?$)
= 3
! A legmagasabb fokú tagok hányadosa: $\frac{6}{2} = 3$.

? Hol van függőleges aszimptotája az $f(x) = \dfrac{x + 1}{x - 4}$ függvénynek? ($x = ?$)
= 4
! Ott, ahol a nevező $0$ (és a számláló nem).

? A díjszabás szerint ($3000$ Ft $5$ GB-ig, utána $400$ Ft/GB, legfeljebb $9000$ Ft) mennyi a díj $12$ GB-nál (Ft)?
= 5800
! $3000 + 400 \cdot 7 = 5800$
```
