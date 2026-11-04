---
title: Nevezetes Taylor-sorok és a hibabecslés
summary: A Taylor-sor, a konvergenciatartomány, a Lagrange-maradéktag, és hány tag kell egy adott pontossághoz.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **Taylor-sor**, és mikor állítja elő a függvényt,
- a legfontosabb **nevezetes sorokat**,
- hogyan becsüljük a közelítés **hibáját** (Lagrange-maradéktag),
- hogyan döntjük el, **hány tag** kell egy kívánt pontossághoz.

## Taylor-sor

Ha a fokszámmal a végtelenig megyünk, a **Taylor-sort** kapjuk: $\sum_{k=0}^{\infty} \frac{f^{(k)}(a)}{k!}(x - a)^k$. Ez egy **hatványsor**, amely egy **konvergenciatartományon** belül egyenlő a függvénnyel.

| Függvény           | Taylor-sor a $0$ körül                                            | Érvényes          |
| ------------------ | ----------------------------------------------------------------- | ----------------- |
| $e^x$              | $1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \dots$                 | minden $x$-re     |
| $\sin x$           | $x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots$                     | minden $x$-re     |
| $\cos x$           | $1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots$                     | minden $x$-re     |
| $\frac{1}{1 - x}$  | $1 + x + x^2 + x^3 + \dots$ (mértani sor)                         | $\lvert x \rvert < 1$ |
| $\ln(1 + x)$       | $x - \frac{x^2}{2} + \frac{x^3}{3} - \dots$                       | $-1 < x \leq 1$   |

Szép következmény: $x = 1$-et írva az $\ln(1 + x)$ sorába $\ln 2 = 1 - \frac{1}{2} + \frac{1}{3} - \dots$ (a váltakozó harmonikus sor), és az $e^{ix}$ sorából az **Euler-formula**: $e^{ix} = \cos x + i \sin x$.

```plot
title: Az ln(1 + x) Taylor-polinomjai csak −1 < x ≤ 1-en közelítenek
x: -1.5, 3
y: -3, 3
param: N = 3, 1, 20, 1
f: ln(1 + x) # ln(1 + x)
dash: sum(k, 1, N, (-1)^(k + 1) x^k/k) # Tₙ(x)
```

A csúszkával láthatod: az $x > 1$ tartományban a polinomok egyre vadabbul kilengenek, hiába nő a fokszám – ott a sor divergens.

## A hiba: Lagrange-maradéktag

A közelítés hibája $R_n(x) = f(x) - T_n(x)$. A **Lagrange-alak** szerint van olyan $\xi$ az $a$ és $x$ között, hogy

$$
R_n(x) = \frac{f^{(n+1)}(\xi)}{(n + 1)!} (x - a)^{n+1}.
$$

Ha $\lvert f^{(n+1)} \rvert \leq M$ a szakaszon, akkor $\lvert R_n(x) \rvert \leq \dfrac{M}{(n + 1)!}\lvert x - a\rvert^{n+1}$.

**Példa.** Hány tag kell az $e$ értékéhez $10^{-6}$ pontossággal? $f(x) = e^x$, $a = 0$, $x = 1$, $\lvert f^{(n+1)}(\xi) \rvert \leq e < 3$. Kell: $\frac{3}{(n + 1)!} < 10^{-6}$, vagyis $(n + 1)! > 3 \cdot 10^6$. Mivel $10! = 3\,628\,800$, $n = 9$ elég.

```python run
import math
# Hány tag kell e^x, sin x közelítéséhez adott pontossággal?
def taylor_exp(x, n):
    return sum(x**k / math.factorial(k) for k in range(n + 1))

for n in range(4, 11):
    hiba = abs(math.e - taylor_exp(1, n))
    print(f"n = {n:>2}: T_n(1) = {taylor_exp(1, n):.10f}, hiba = {hiba:.2e}")
```

## Összefoglalás

- Taylor-sor: a Taylor-polinom „végtelen fokú” változata; csak a konvergenciatartományon egyenlő a függvénnyel.
- $e^x$, $\sin x$, $\cos x$ sora mindenhol konvergens; $\frac{1}{1-x}$ és $\ln(1+x)$ csak $\lvert x \rvert < 1$ körül.
- Lagrange-hiba: $\lvert R_n \rvert \leq \frac{M}{(n+1)!}\lvert x - a \rvert^{n+1}$.

## A lecke feladata

```quiz required
? Melyik függvény Taylor-sora $1 + x + x^2 + x^3 + \dots$?
- $e^x$
+ $\frac{1}{1 - x}$
- $\ln(1 + x)$
- $\cos x$
! Mértani sor, $q = x$.

? Mi az $x^2$-es tag együtthatója az $\ln(1 + x)$ Taylor-sorában? (Törtként vagy tizedes törtként.)
= -1/2

? Az $e^{x}$ sorából: mi a $e^{2x}$ sorában az $x^3$-ös tag együtthatója? (Törtként vagy tizedes törtként.)
= 4/3
! $\frac{(2x)^3}{3!} = \frac{8x^3}{6}$

? Legalább hányadfokú Taylor-polinom kell ahhoz, hogy az $e$ értékét $10^{-3}$-nál kisebb hibával kapjuk (a Lagrange-becsléssel, $M = 3$)?
= 6
! $\frac{3}{(n + 1)!} < 10^{-3} \iff (n + 1)! > 3000$, és $7! = 5040$.

? Add meg az $\dfrac{1}{1 + x^2}$ Taylor-polinomját a $0$ körül a negyedfokú tagig (a mértani sorból, $q = -x^2$)!
fn: x -> 1 - x^2 + x^4
domain: -0.5, 0.5
```
