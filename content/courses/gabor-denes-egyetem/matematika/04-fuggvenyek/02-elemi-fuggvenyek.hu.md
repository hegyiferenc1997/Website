---
title: Elemi függvények
summary: Lineáris, hatvány-, exponenciális, logaritmus- és trigonometrikus függvények grafikonja és tulajdonságai.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a **lineáris** és a **hatványfüggvények** alakját,
- az **exponenciális** és a **logaritmusfüggvény** viselkedését,
- a **trigonometrikus függvényeket** (szinusz, koszinusz, tangens) radiánban.

## Lineáris függvény

$f(x) = mx + b$: egyenes, $m$ a **meredekség** (egy egységnyi jobbra lépésre ennyit emelkedik), $b$ a **tengelymetszet** ($f(0) = b$). Két ponton átmenő egyenes meredeksége $m = \dfrac{y_2 - y_1}{x_2 - x_1}$.

```plot
title: Egyenes: meredekség és tengelymetszet
x: -5, 5
y: -5, 5
param: m = 1, -3, 3, 0.1
param: b = 0, -4, 4, 0.5
f: m x + b # mx + b
```

## Hatványfüggvények

- $x^2$, $x^4$, …: páros kitevő, „U” alakú, **páros** függvény.
- $x^3$, $x^5$, …: páratlan kitevő, „S” alakú, **páratlan** függvény.
- $x^{-1} = \frac{1}{x}$: hiperbola, a $0$-ban nincs értelmezve.
- $\sqrt{x} = x^{1/2}$: csak $x \geq 0$-ra, lassan nő.

```plot
title: Hatványfüggvények
x: -3, 3
y: -3, 4
param: k = 2, -2, 5, 1
f: x^k # xᵏ
dash: x # x
```

## Exponenciális és logaritmusfüggvény

$f(x) = a^x$ ($a > 0$, $a \neq 1$): mindig pozitív, $f(0) = 1$; $a > 1$-nél szigorúan nő, $0 < a < 1$-nél csökken. A legfontosabb alap az $e$: $e^x$ (exponenciális növekedés, bomlás, kamatos kamat).

$g(x) = \log_a x$ az exponenciális **inverze**: $D_g = ]0; \infty[$, $R_g = \mathbb{R}$, $g(1) = 0$. Nagyon lassan nő: $\log_2 10^6 \approx 20$.

## Trigonometrikus függvények

A szögeket **radiánban** mérjük: $180^\circ = \pi$, $\ 90^\circ = \frac{\pi}{2}$. Az egységkör $\alpha$ szögű pontja $(\cos\alpha; \sin\alpha)$.

| Függvény    | $D_f$                                 | $R_f$         | Periódus | Paritás  |
| ----------- | ------------------------------------- | ------------- | -------- | -------- |
| $\sin x$    | $\mathbb{R}$                          | $[-1; 1]$     | $2\pi$   | páratlan |
| $\cos x$    | $\mathbb{R}$                          | $[-1; 1]$     | $2\pi$   | páros    |
| $\tan x$    | $x \neq \frac{\pi}{2} + k\pi$         | $\mathbb{R}$  | $\pi$    | páratlan |

Nevezetes értékek: $\sin 0 = 0$, $\sin\frac{\pi}{6} = \frac{1}{2}$, $\sin\frac{\pi}{2} = 1$, $\cos 0 = 1$, $\cos\frac{\pi}{3} = \frac{1}{2}$, $\cos\pi = -1$. Alapazonosság: $\sin^2 x + \cos^2 x = 1$.

```plot
title: Szinusz, koszinusz, tangens
x: -7, 7
y: -3, 3
f: sin(x) # sin x
f: cos(x) # cos x
dash: tan(x) # tan x
```

A trigonometrikus függvények írják le a **periodikus** jelenségeket: rezgés, hang, váltóáram, és ezekből épül a Fourier-sor (7. témakör).

## Összefoglalás

- Lineáris: $mx + b$; meredekség = emelkedés / lépés.
- Hatványfüggvény: páros kitevő → páros, páratlan → páratlan függvény.
- $a^x > 0$, $a^0 = 1$; $\log_a$ az inverze, csak pozitív számokra.
- $\sin, \cos$: periódus $2\pi$, értékkészlet $[-1; 1]$; $\tan$: periódus $\pi$.

## A lecke feladata

```quiz required
? Mennyi a $(1; 2)$ és a $(4; 11)$ ponton átmenő egyenes meredeksége?
= 3

? Add meg ennek az egyenesnek az egyenletét $y = f(x)$ alakban!
fn: x -> 3x - 1
! $2 = 3 \cdot 1 + b$

? Mennyi $\sin\dfrac{\pi}{6} + \cos\dfrac{\pi}{3}$?
= 1
! Mindkettő $\frac{1}{2}$.

? Hány radián $270^\circ$? (Kerekítsd két tizedesre!)
= 4.71
! $\frac{3\pi}{2}$

? Melyik függvény értékkészlete $]0; \infty[$?
- $\ln x$
+ $2^x$
- $x^3$
- $\sin x$
```
