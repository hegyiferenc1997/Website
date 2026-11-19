---
title: Mélyebben – Taylor és Fourier a gépben
summary: Hogyan számolja a számológép az e^x-et és a sin x-et Taylor-sorral, miért kell tartománycsökkentés, a Taylor-polinomok közelítése grafikonon, a négyszögjel Fourier-részletösszegei és a Gibbs-jelenség számokkal, valamint egy saját diszkrét Fourier-transzformáció, amely kihallja a frekvenciákat egy jelből.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan számol a gép $e^x$-et és $\sin x$-et **csak összeadással és szorzással**,
- miért kell egy nagy szöget először **visszahozni** a $[-\pi, \pi]$ intervallumba,
- hogyan néz ki **számokban** a Gibbs-jelenség,
- hogyan „hallja ki” egy program a **frekvenciákat** egy mért jelből (ez a hangszerhangoló, a Shazam és az MP3 alapja).

## 1. Az e^x a gépben: Taylor-sor, amíg számít a tag

A processzor csak az alapműveleteket tudja. Az $e^x$ Taylor-sora

$$
e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \ldots = \sum_{k=0}^{\infty} \frac{x^k}{k!},
$$

és egy ügyes trükk: minden tag az előzőből egyetlen szorzással jön ($\frac{x^k}{k!} = \frac{x^{k-1}}{(k-1)!} \cdot \frac{x}{k}$), így faktoriálist sem kell külön számolni.

```python run
# Hogyan számolja a gép e^x-et? Taylor-sor: 1 + x + x²/2! + x³/3! + …, addig, amíg a tag számít
import math

def exp_taylor(x):
    osszeg, tag, k = 1.0, 1.0, 0
    while abs(tag) > 1e-16 * abs(osszeg):   # a következő tag már nem változtat az eredményen
        k += 1
        tag *= x / k                         # x^k / k! az előzőből: szorzás x/k-val
        osszeg += tag
    return osszeg, k

for x in [0.5, 1, 5, 20]:
    ertek, tagok = exp_taylor(x)
    print(f"e^{x:<4}: {tagok:>2} tag, relatív hiba {abs(ertek - math.exp(x)) / math.exp(x):.1e}")
```

Kis $x$-re kevés tag elég, nagyra egyre több kell. A valódi könyvtárak ezért trükköznek: $e^{20} = \left(e^{20/32}\right)^{32}$ – a kis kitevőre gyorsan konvergál a sor, utána ötször négyzetre emelünk.

## 2. A sin x és a tartománycsökkentés

A $\sin x = x - \frac{x^3}{3!} + \frac{x^5}{5!} - \ldots$ sor **minden** $x$-re konvergál – elméletben. A gyakorlatban nézd meg, mi történik $x = 100$-nál:

```python run
# Tartománycsökkentés: sin(100) közvetlenül sok tag kell, de sin periodikus – előbb 2π-t levonunk
import math

def sin_taylor(x, n_tag):
    osszeg, tag = 0.0, x
    for k in range(n_tag):
        osszeg += tag
        tag *= -x * x / ((2 * k + 2) * (2 * k + 3))   # a következő páratlan fokú tag
    return osszeg

x = 100.0
redukalt = math.remainder(x, 2 * math.pi)            # x − k·2π, a [−π, π] intervallumba
print(f"100 → {redukalt:.6f} (ugyanaz a szinusz)")
for n in [5, 20, 150]:
    print(f"{n:>3} tag: közvetlenül {sin_taylor(x, n):>14.4g} | redukálva {sin_taylor(redukalt, n):.10f}")
print(f"pontos: math.sin(100) = {math.sin(100):.10f}")
```

Közvetlenül számolva **használhatatlan** eredmény jön ki, még 150 taggal is! A tagok közben óriásira nőnek (a legnagyobb kb. $\frac{100^{100}}{100!} \approx 10^{42}$), és ezek kivonásánál a kerekítési hiba mindent elnyel – ugyanaz a jelenség, mint a numerikus deriválásnál. A megoldás: a $\sin$ $2\pi$ szerint periodikus, ezért előbb levonjuk $2\pi$ megfelelő többszörösét, és a sort már csak $|x| \le \pi$-re használjuk, ahol 10 tag is bőven elég.

```plot
title: A sin x és Taylor-polinomjai 0 körül
x: -6, 6
y: -3, 3
f: sin(x) # sin x
f: x # T₁
f: x - x^3/6 # T₃
f: x - x^3/6 + x^5/120 # T₅
f: x - x^3/6 + x^5/120 - x^7/5040 # T₇
```

Látszik a lényeg: a Taylor-polinom a középpont **közelében** kiváló, távolodva viszont elszakad a függvénytől. Minél magasabb a fok, annál szélesebb a jó tartomány.

## 3. A négyszögjel és a Gibbs-jelenség számokkal

A $\pm 1$ közt ugráló négyszögjel Fourier-sora $\frac{4}{\pi}\left(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \ldots\right)$. Nézzük a részletösszegeket:

```python run
# A négyszögjel Fourier-részletösszegei: 4/π · (sin x + sin 3x / 3 + sin 5x / 5 + …)
import math

def reszletosszeg(x, n):
    return 4 / math.pi * sum(math.sin(k * x) / k for k in range(1, 2 * n, 2))

for n in [1, 3, 10, 100]:
    # a túllövés: a csúcs közvetlenül az ugrás után (keresés egy finom rácson)
    csucs = max(reszletosszeg(i / (50 * n), n) for i in range(1, 200))
    print(f"{n:>3} tag: f(π/2) = {reszletosszeg(math.pi / 2, n):.4f}, legnagyobb érték = {csucs:.4f}")
```

- Az ugrástól távol ($x = \frac{\pi}{2}$) a részletösszeg egyre közelebb kerül az $1$-hez.
- Közvetlenül az ugrás után viszont mindig ott marad egy **túllövés** kb. $1{,}179$-ig – akárhány tagot veszünk! Ez az ugrás nagyságának ($2$) kb. $9\%$-a. A csúcs egyre keskenyebb lesz és közelebb kerül az ugráshoz, de nem lesz alacsonyabb: ez a **Gibbs-jelenség**.

```plot
title: A négyszögjel Fourier-részletösszege (3 és 5 tag)
x: -6.3, 6.3
y: -1.6, 1.6
f: 4/pi*(sin(x) + sin(3*x)/3 + sin(5*x)/5) # 3 tag
f: 4/pi*(sin(x) + sin(3*x)/3 + sin(5*x)/5 + sin(7*x)/7 + sin(9*x)/9) # 5 tag
dash: 1 # +1
dash: -1 # −1
```

A gyakorlatban ezt látod a túltömörített JPEG képeken az éles szélek mellett „szellemcsíkként”, és ezért csengenek a digitális szűrők éles jelváltásnál.

## 4. Saját diszkrét Fourier-transzformáció

Egy mikrofon másodpercenként 1000 mintát vesz egy jelből, amely egy 50 Hz-es zúgás és egy halkabb, 120 Hz-es hang keveréke. Ránézésre a mintákból semmit sem látunk. A **diszkrét Fourier-transzformáció (DFT)** minden $k$ frekvenciára kiszámolja, mennyire „hasonlít” a jel az adott frekvenciájú koszinuszhoz és szinuszhoz – pontosan úgy, ahogy a Fourier-együtthatók képlete integrállal teszi, csak az integrál helyett összeg áll:

```python run
# Diszkrét Fourier-transzformáció: milyen frekvenciák vannak egy mért jelben?
import math

N, fs = 200, 1000                    # 200 minta, 1000 minta/s (0,2 s felvétel)
jel = [1.0 * math.sin(2 * math.pi * 50 * n / fs)       # 50 Hz-es zúgás
       + 0.5 * math.sin(2 * math.pi * 120 * n / fs)    # 120 Hz-es hang, fele amplitúdóval
       for n in range(N)]

for k in range(N // 2):              # k. frekvencia = k · fs / N Hz
    re = sum(jel[n] * math.cos(2 * math.pi * k * n / N) for n in range(N))
    im = sum(jel[n] * math.sin(2 * math.pi * k * n / N) for n in range(N))
    amplitudo = 2 * math.hypot(re, im) / N
    if amplitudo > 0.1:              # csak a jelentős összetevőket írjuk ki
        print(f"{k * fs / N:>5.0f} Hz: amplitúdó {amplitudo:.2f}")
```

A program pontosan visszaadja a két összetevőt és az amplitúdójukat. Ez a módszer $N$ mintára $N^2$ műveletet igényel; a valóságban az **FFT** (gyors Fourier-transzformáció) algoritmus ugyanezt $N \log N$ lépésben végzi el – ezért tud a telefonod valós időben hangot elemezni, zajt szűrni vagy zenét felismerni.

## Összefoglalás

- A gép Taylor-sorral számol: minden tag az előzőből egy szorzással jön; addig ad hozzá, amíg a tag számít.
- Nagy $x$-nél a sor elméletben konvergál, de a kerekítés elrontja – ezért tartománycsökkentés kell ($\sin$: $2\pi$-vel, $e^x$: felezés és négyzetre emelés).
- A Taylor-polinom a középpont közelében pontos; magasabb fok → szélesebb jó tartomány.
- Ugrásnál a Fourier-részletösszeg kb. $9\%$-kal túllő, akárhány tagnál (Gibbs-jelenség).
- A DFT összegekkel számolja ki a frekvencia-összetevőket; az FFT ennek gyors változata.

## A lecke feladata

```quiz required
? Az $e^x$ Taylor-sorában a $k$-adik tag $\frac{x^k}{k!}$. Mennyivel kell megszorozni az előző tagot, hogy a következőt kapjuk, ha $x = 6$ és $k = 3$?
= 2
! $\frac{x}{k} = \frac{6}{3} = 2$.

? Add meg a $\sin x$ harmadfokú Taylor-polinomját a $0$ körül!
fn: x -> x - x^3/6
domain: -2, 2
! $\sin x \approx x - \frac{x^3}{3!}$

? Miért kell tartománycsökkentés a $\sin 100$ kiszámolásához?
- mert a Taylor-sor $x = 100$-nál divergens
+ mert a hatalmas tagok kivonásánál a kerekítési hiba elnyeli az eredményt
- mert a szinusz nem periodikus
- mert $100$ radián nem értelmezett
! A sor elméletben konvergál, de a $\approx 10^{42}$ nagyságú tagokból a lebegőpontos számolás nem tud pontos $-0{,}5$-öt kivonni.

? A Gibbs-jelenség miatt a négyszögjel Fourier-részletösszege az ugrás után kb. hány százalékkal lő túl (az ugrás nagyságához képest)?
= 9
! A csúcs kb. $1{,}179$, az ugrás $2$: $\frac{0{,}179}{2} \approx 9\%$.

? Egy 1000 minta/s-os felvételből 200 mintán DFT-t számolunk. Hány Hz a $k = 25$-ös frekvencia?
= 125
! $k \cdot \frac{f_s}{N} = 25 \cdot \frac{1000}{200} = 125$ Hz.
```
