---
title: Fourier-sor példák és alkalmazások
summary: A négyszögjel, a fűrészjel és az |x| Fourier-sora, a Gibbs-jelenség, nevezetes összegek, és a Fourier-analízis a jelfeldolgozásban.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- kiszámolni a **négyszögjel** és a **fűrészjel** Fourier-sorát,
- mi a **Gibbs-jelenség**,
- hogyan kapunk Fourier-sorból **nevezetes összegeket** (pl. $\sum \frac{1}{k^2}$),
- hol használja a mérnök a Fourier-analízist.

## A négyszögjel

Legyen $f(x) = -1$ a $(-\pi; 0)$ és $f(x) = 1$ a $(0; \pi)$ szakaszon, $2\pi$ szerint periodikusan folytatva. Ez **páratlan**, ezért $a_k = 0$, és

$$
b_k = \frac{2}{\pi}\int_0^\pi \sin(kx)\,dx = \frac{2}{\pi} \cdot \frac{1 - \cos(k\pi)}{k} = \begin{cases} \dfrac{4}{k\pi}, & k \text{ páratlan} \\ 0, & k \text{ páros.} \end{cases}
$$

Tehát csak a **páratlan felharmonikusok** szerepelnek:

$$
f(x) = \frac{4}{\pi}\left(\sin x + \frac{\sin 3x}{3} + \frac{\sin 5x}{5} + \dots\right) = \frac{4}{\pi}\sum_{k=1}^{\infty} \frac{\sin\big((2k - 1)x\big)}{2k - 1}.
$$

```plot
title: A négyszögjel N tagú Fourier-közelítése
x: -7, 7
y: -1.6, 1.6
param: N = 3, 1, 40, 1
dash: sgn(sin(x)) # négyszögjel
f: sum(k, 1, N, 4/pi * sin((2k - 1) x)/(2k - 1)) # S_N(x)
value: S_N(π/2) = sum(k, 1, N, 4/pi * sin((2k - 1) pi/2)/(2k - 1))
```

Húzd a csúszkát: a közelítés egyre jobban simul a négyszögjelre, de az ugrások mellett mindig marad egy kb. **9%-os túllövés**. Ez a **Gibbs-jelenség**: a „púp” egyre keskenyebb lesz, de a magassága nem csökken. Ugráshelyen a Fourier-sor nem egyenletesen konvergál.

Az $x = \frac{\pi}{2}$ helyet behelyettesítve a **Leibniz-sor** adódik: $1 = \frac{4}{\pi}\left(1 - \frac{1}{3} + \frac{1}{5} - \dots\right)$, vagyis $1 - \frac{1}{3} + \frac{1}{5} - \dots = \frac{\pi}{4}$.

## A fűrészjel

Legyen $f(x) = x$ a $(-\pi; \pi)$ szakaszon, periodikusan folytatva. Ez is páratlan, és parciális integrálással

$$
b_k = \frac{2}{\pi}\int_0^\pi x\sin(kx)\,dx = \frac{2(-1)^{k+1}}{k}, \qquad
f(x) = 2\left(\sin x - \frac{\sin 2x}{2} + \frac{\sin 3x}{3} - \dots\right).
$$

```plot
title: A fűrészjel Fourier-közelítése
x: -7, 7
y: -4, 4
param: N = 3, 1, 40, 1
dash: mod(x + pi, 2pi) - pi # fűrészjel
f: sum(k, 1, N, 2 (-1)^(k + 1) sin(k x)/k) # S_N(x)
```

Itt minden felharmonikus szerepel, és az együtthatók $\frac{1}{k}$-szerint csökkennek, ugyanolyan lassan, mint a négyszögjelnél. A lassú lecsengés oka az **ugrás**.

## Folytonos jel: |x|

Az $f(x) = \lvert x \rvert$ ($-\pi \leq x \leq \pi$) **páros** és **folytonos**, ezért csak koszinuszok kellenek: $\frac{a_0}{2} = \frac{\pi}{2}$, és $a_k = -\frac{4}{\pi k^2}$ páratlan $k$-ra, páros $k$-ra $0$:

$$
\lvert x \rvert = \frac{\pi}{2} - \frac{4}{\pi}\left(\cos x + \frac{\cos 3x}{9} + \frac{\cos 5x}{25} + \dots\right).
$$

Az együtthatók most $\frac{1}{k^2}$ szerint csökkennek, ezért már néhány tag is szinte tökéletes. **Szabály:** minél simább a függvény, annál gyorsabban csökkennek az együtthatók.

```plot
title: Az |x| Fourier-közelítése: már 2–3 tag is nagyon jó
x: -7, 7
y: -0.5, 4
param: N = 1, 1, 10, 1
dash: abs(mod(x + pi, 2pi) - pi) # |x| periodikusan
f: pi/2 - sum(k, 1, N, 4/pi * cos((2k - 1) x)/(2k - 1)^2) # S_N(x)
```

Az $x = 0$ helyen: $0 = \frac{\pi}{2} - \frac{4}{\pi}\sum \frac{1}{(2k - 1)^2}$, ebből $1 + \frac{1}{9} + \frac{1}{25} + \dots = \frac{\pi^2}{8}$. Hasonlóan az $x^2$ sorából jön a híres **Basel-probléma** megoldása: $\sum_{k=1}^\infty \frac{1}{k^2} = \frac{\pi^2}{6}$.

## Számoljuk ki gépen!

Az együtthatók integrálok, ezért numerikusan is kiszámolhatók. Ez a **diszkrét Fourier-transzformáció** (DFT, gyors változata az FFT) alapötlete.

```python run
import math
# A négyszögjel b_k együtthatói numerikus integrálással (felezőpontos szabály)
def f(x):
    return 1.0 if math.sin(x) > 0 else -1.0

def b(k, n=20000):
    h = 2 * math.pi / n
    return sum(f(-math.pi + (i + 0.5) * h) * math.sin(k * (-math.pi + (i + 0.5) * h)) for i in range(n)) * h / math.pi

for k in range(1, 7):
    pontos = 4 / (k * math.pi) if k % 2 else 0.0
    print(f"b_{k} ≈ {b(k):+.5f}   (pontos: {pontos:+.5f})")
```

## Alkalmazások

- **Hang és zene:** egy hangszer hangszíne a felharmonikusok arányától függ. A spektrumanalizátor a jel Fourier-együtthatóit mutatja.
- **Tömörítés:** az MP3 és a JPEG (ez utóbbi a rokon koszinusztranszformációval) a kis együtthatókat elhagyja, mert azok alig hallhatók vagy láthatók.
- **Szűrés:** egy aluláteresztő szűrő a magas felharmonikusokat csillapítja. Egy négyszögjelből így „lekerekített” jel lesz (pont mint a kevés tagú közelítés).
- **Villamosmérnöki feladatok:** egy nemszinuszos áramot harmonikusokra bontva minden harmonikusra külön számolhatunk (szuperpozíció).

## Összefoglalás

- Négyszögjel: $\frac{4}{\pi}\sum \frac{\sin((2k-1)x)}{2k-1}$, csak páratlan harmonikusok.
- Fűrészjel: $2\sum (-1)^{k+1}\frac{\sin(kx)}{k}$.
- Ugrásnál $\frac{1}{k}$-s lecsengés és Gibbs-túllövés; folytonos jelnél (pl. $\lvert x \rvert$) $\frac{1}{k^2}$-es, gyors konvergencia.
- Behelyettesítéssel nevezetes összegek: $\frac{\pi}{4}$, $\frac{\pi^2}{8}$, $\frac{\pi^2}{6}$.

## A lecke feladata

```quiz required
? Mennyi a négyszögjel Fourier-sorában $b_3$?
- $\frac{4}{\pi}$
+ $\frac{4}{3\pi}$
- $\frac{1}{3}$
- $0$
! $b_k = \frac{4}{k\pi}$ páratlan $k$-ra.

? Mennyi a négyszögjel Fourier-sorában $b_4$?
= 0
! Páros $k$-ra $1 - \cos(k\pi) = 0$.

? Mi történik a Gibbs-túllövéssel, ha a tagok számát növeljük?
- nullához tart
+ egyre keskenyebb lesz, de a magassága (kb. 9%) megmarad
- egyre magasabb lesz
- már 10 tagnál eltűnik

? Add meg a fűrészjel ($f(x) = x$, $-\pi < x < \pi$) Fourier-sorának első három tagját!
fn: x -> 2 sin(x) - sin(2x) + (2/3) sin(3x)
domain: -3, 3
! $b_k = \frac{2(-1)^{k+1}}{k}$, $k = 1, 2, 3$.

? Az $\lvert x \rvert$ Fourier-sorából melyik összeg jön ki az $x = 0$ helyen?
- $\sum \frac{1}{k^2} = \frac{\pi^2}{6}$
+ $\sum \frac{1}{(2k - 1)^2} = \frac{\pi^2}{8}$
- $\sum \frac{(-1)^{k+1}}{2k - 1} = \frac{\pi}{4}$
- $\sum \frac{1}{2k - 1} = \infty$

? Egy $50$ Hz-es négyszögjelnek mekkora (Hz-ben) a harmadik nem nulla felharmonikusa? (Az elsőt, az $50$ Hz-et is beleszámolva.)
= 250
! Csak a páratlan harmonikusok vannak: $50, 150, 250, \dots$ Hz.
```
