---
title: A Taylor-polinom
summary: Függvény közelítése egy pont körül polinommal, amelynek deriváltjai megegyeznek a függvényéivel.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **Taylor-polinom**, és miért jó közelítés,
- hogyan számoljuk ki az együtthatóit a **deriváltakból**,
- hogyan javul a közelítés a **fokszám** növelésével (interaktív ábrán).

## Az ötlet

Az érintő (elsőfokú polinom) a pont közelében jól közelíti a függvényt: $f(x) \approx f(a) + f'(a)(x - a)$. Még jobb közelítést kapunk, ha a **második**, **harmadik**, … deriváltban is egyezést követelünk. Az $f$ függvény $a$ körüli **$n$-edfokú Taylor-polinomja**:

$$
T_n(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!} (x - a)^k = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \dots + \frac{f^{(n)}(a)}{n!}(x - a)^n.
$$

Ez az egyetlen olyan legfeljebb $n$-edfokú polinom, amelynek értéke és első $n$ deriváltja az $a$ pontban megegyezik $f$-ével. Ha $a = 0$, **Maclaurin-polinomnak** is hívják.

## Példa: $e^x$ a $0$ körül

Minden derivált $e^x$, így $f^{(k)}(0) = 1$:

$$
T_n(x) = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots + \frac{x^n}{n!}.
$$

Például $e^{0{,}5} \approx T_3(0{,}5) = 1 + 0{,}5 + 0{,}125 + 0{,}0208 = 1{,}6458$ (pontosan $1{,}6487\ldots$).

```plot
title: eˣ és a Taylor-polinomjai
x: -4, 4
y: -2, 12
param: N = 2, 0, 10, 1
f: e^x # eˣ
dash: sum(k, 0, N, x^k/k!) # Tₙ(x)
value: Tₙ(1) = sum(k, 0, N, 1/k!)
```

Növeld a fokszámot: a polinom egyre nagyobb tartományon simul a görbéhez, és $T_N(1)$ egyre jobban közelíti $e \approx 2{,}71828$-at.

## Példa: $\sin x$ a $0$ körül

A deriváltak: $\sin, \cos, -\sin, -\cos, \sin, \dots$, a $0$-ban: $0, 1, 0, -1, 0, 1, \dots$ Csak a páratlan fokú tagok maradnak:

$$
\sin x \approx x - \frac{x^3}{3!} + \frac{x^5}{5!} - \frac{x^7}{7!} + \dots
$$

```plot
title: sin x és a Taylor-polinomjai
x: -8, 8
y: -3, 3
param: N = 1, 0, 8, 1
f: sin(x) # sin x
dash: sum(k, 0, N, (-1)^k x^(2k + 1)/(2k + 1)!) # T₂ₙ₊₁(x)
```

## Hol használják?

- **Számológépek és könyvtárak** így (és ennek finomított változataival) számolják a $\sin$, $e^x$, $\ln$ értékét.
- **Fizika és mérnöki közelítések:** kis szögre $\sin x \approx x$, $\cos x \approx 1 - \frac{x^2}{2}$ (inga, optika).
- **Numerikus módszerek** (pl. a Newton-módszer és a differenciálegyenletek megoldói) hibaelemzése.

## Összefoglalás

- $T_n(x) = \sum_{k=0}^n \frac{f^{(k)}(a)}{k!}(x - a)^k$: az értéke és első $n$ deriváltja egyezik $f$-ével az $a$-ban.
- $e^x \approx \sum \frac{x^k}{k!}$; $\sin x \approx x - \frac{x^3}{6} + \frac{x^5}{120} - \dots$
- Magasabb fokszám → jobb közelítés, egyre nagyobb tartományon.

## A lecke feladata

```quiz required
? Add meg az $e^x$ másodfokú Taylor-polinomját a $0$ körül!
fn: x -> 1 + x + x^2/2

? Mennyi $T_2(0{,}2)$ az $e^x$-re? (Négy tizedesre.)
= 1.22
= 1.2200
! $1 + 0{,}2 + 0{,}02$

? Add meg a $\cos x$ negyedfokú Taylor-polinomját a $0$ körül!
fn: x -> 1 - x^2/2 + x^4/24
! A deriváltak a $0$-ban: $1, 0, -1, 0, 1$.

? Mi az $x^3$-ös tag együtthatója a $\sin x$ Taylor-polinomjában? (Törtként.)
= -1/6

? Add meg az $f(x) = \ln x$ elsőfokú Taylor-polinomját az $a = 1$ körül!
fn: x -> x - 1
domain: 0.5, 2
```
