---
title: A Fourier-sor alapjai
summary: Periodikus függvények, a trigonometrikus rendszer ortogonalitása, a Fourier-együtthatók képlete és a konvergencia.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **periodikus függvény**, és miért éppen szinuszokkal közelítjük,
- mit jelent, hogy a trigonometrikus rendszer **ortogonális**,
- hogyan számoljuk ki a **Fourier-együtthatókat**,
- mire konvergál a Fourier-sor (a **Dirichlet-tétel**).

## Periodikus függvények

Az $f$ függvény **$T$ szerint periodikus**, ha minden $x$-re $f(x + T) = f(x)$. A $\sin x$ és a $\cos x$ periódusa $2\pi$, a $\sin(kx)$ és a $\cos(kx)$ periódusa $\frac{2\pi}{k}$, tehát ezek is mind $2\pi$ szerint periodikusak.

A Taylor-polinom egy pont **környezetében** közelít. A **Fourier-sor** ezzel szemben egy egész perióduson át, „átlagosan” közelít, ezért alkalmas jelek (hang, áram, rezgés) leírására. Az ötlet: minden (elég szép) $2\pi$ szerint periodikus függvény felírható **harmonikus rezgések** összegeként:

$$
f(x) \sim \frac{a_0}{2} + \sum_{k=1}^{\infty} \big(a_k \cos(kx) + b_k \sin(kx)\big).
$$

A $k$-adik tag a **$k$-adik felharmonikus**: $k$-szoros frekvenciájú rezgés.

```plot
title: Felharmonikusok keverése
x: -7, 7
y: -3, 3
param: a = 1, -2, 2, 0.1
param: b = 0.5, -2, 2, 0.1
param: c = 0, -2, 2, 0.1
f: a sin(x) + b sin(2x) + c sin(3x) # összeg
dash: a sin(x) # 1. harmonikus
dash: b sin(2x) # 2. harmonikus
dash: c sin(3x) # 3. harmonikus
```

A csúszkákkal az együtthatókat (vagyis az egyes harmonikusok **amplitúdóját**) állíthatod. Bármilyen beállításnál az összeg $2\pi$ szerint periodikus marad.

## Ortogonalitás

A kulcs a következő tulajdonság: a $[-\pi; \pi]$ szakaszon két **különböző** tag szorzatának integrálja nulla. Minden $m, k \geq 1$ egészre:

$$
\int_{-\pi}^{\pi} \sin(mx)\sin(kx)\,dx = \int_{-\pi}^{\pi} \cos(mx)\cos(kx)\,dx = \begin{cases} \pi, & m = k \\ 0, & m \neq k \end{cases}
\qquad
\int_{-\pi}^{\pi} \sin(mx)\cos(kx)\,dx = 0.
$$

Ezt úgy mondjuk, hogy a $1, \cos x, \sin x, \cos 2x, \sin 2x, \dots$ rendszer **ortogonális** (a vektorok merőlegességének mintájára, ahol a skaláris szorzat szerepét az integrál veszi át).

```plot
title: Ortogonalitás: a szorzat integrálja a [−π; π] szakaszon
x: -3.5, 3.5
y: -1.5, 1.5
param: m = 1, 1, 5, 1
param: k = 2, 1, 5, 1
f: sin(m x) sin(k x) # sin(mx)·sin(kx)
area: sin(m x) sin(k x) @ -pi, pi
```

Állítsd be $m = k$-t: az integrál $\pi \approx 3{,}1416$. Bármilyen $m \neq k$ esetén a pozitív és a negatív részek pontosan kiejtik egymást.

## A Fourier-együtthatók

Ha a sort végigszorozzuk $\cos(kx)$-szel vagy $\sin(kx)$-szel, és integrálunk $-\pi$-től $\pi$-ig, az ortogonalitás miatt egyetlen tag marad meg. Így kapjuk az **Euler–Fourier-képleteket**:

$$
a_k = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)\cos(kx)\,dx \quad (k \geq 0), \qquad
b_k = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)\sin(kx)\,dx \quad (k \geq 1).
$$

Az $\frac{a_0}{2}$ tag a függvény **átlaga** egy perióduson.

**Szimmetria spórol munkát:**

| Ha $f$…                        | akkor                                                       | a sor                           |
| ------------------------------ | ----------------------------------------------------------- | ------------------------------- |
| **páros** ($f(-x) = f(x)$)     | $b_k = 0$, $a_k = \frac{2}{\pi}\int_0^\pi f(x)\cos(kx)\,dx$ | csak koszinuszos (koszinuszsor) |
| **páratlan** ($f(-x) = -f(x)$) | $a_k = 0$, $b_k = \frac{2}{\pi}\int_0^\pi f(x)\sin(kx)\,dx$ | csak szinuszos (szinuszsor)     |

**Példa.** Ha $f(x) = 3 + 2\sin x - \cos(4x)$, akkor ez már maga a Fourier-sor: $\frac{a_0}{2} = 3$, tehát $a_0 = 6$; $b_1 = 2$; $a_4 = -1$, és minden más együttható $0$.

**Általános periódus.** Ha a periódus $T = 2L$, a $kx$ helyére $\frac{k\pi x}{L}$ kerül, az $\frac{1}{\pi}\int_{-\pi}^{\pi}$ helyére pedig $\frac{1}{L}\int_{-L}^{L}$. Az **alapfrekvencia** $\frac{1}{T}$, a $k$-adik harmonikus frekvenciája $\frac{k}{T}$.

## Mire konvergál a sor?

**Dirichlet-tétel.** Ha $f$ $2\pi$ szerint periodikus, egy perióduson szakaszonként folytonosan differenciálható (véges sok ugrással), akkor a Fourier-sora minden pontban konvergál, mégpedig

- $f(x)$-hez, ahol $f$ folytonos,
- az ugrás két oldali határértékének **átlagához**, $\frac{f(x^-) + f(x^+)}{2}$-höz, ahol $f$ ugrik.

Például egy $-1$ és $1$ között ugró négyszögjel sora az ugrás helyén $0$-hoz tart.

## Összefoglalás

- Fourier-sor: $\frac{a_0}{2} + \sum \big(a_k\cos(kx) + b_k\sin(kx)\big)$, a $k$-adik harmonikus $k$-szoros frekvenciájú.
- Az együtthatók az ortogonalitásból: $a_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f\cos(kx)$, $b_k = \frac{1}{\pi}\int_{-\pi}^{\pi} f\sin(kx)$.
- Páros függvény: csak koszinuszok; páratlan: csak szinuszok.
- Ugráshelyen a sor a két oldali határérték átlagához tart.

## A lecke feladata

```quiz required
? Mi a $\sin(3x)$ függvény (legkisebb pozitív) periódusa?
- $3\pi$
- $\frac{\pi}{3}$
+ $\frac{2\pi}{3}$
- $6\pi$
! $\sin(k x)$ periódusa $\frac{2\pi}{k}$.

? Mennyi $\displaystyle\int_{-\pi}^{\pi} \sin(2x)\cos(3x)\,dx$?
= 0
! Ortogonalitás.

? Az $f(x) = 3 + 2\sin x - \cos(4x)$ Fourier-sorában mennyi $a_0$? (Figyelj: a sor első tagja $\frac{a_0}{2}$.)
= 6

? Ugyanebben a sorban mennyi $a_4$?
= -1

? Melyik együtthatók nullák egy **páratlan** függvény Fourier-sorában?
+ minden $a_k$ (a koszinuszos tagok és az $a_0$)
- minden $b_k$ (a szinuszos tagok)
- csak az $a_0$
- egyik sem
! Páratlan · páros = páratlan, és a páratlan függvény integrálja $[-\pi; \pi]$-n $0$.

? Egy négyszögjel értéke $-1$ a $(-\pi; 0)$ és $1$ a $(0; \pi)$ szakaszon. Mihez konvergál a Fourier-sora az $x = 0$ pontban?
= 0
! A Dirichlet-tétel: az ugrás két oldali határértékének átlaga.
```
