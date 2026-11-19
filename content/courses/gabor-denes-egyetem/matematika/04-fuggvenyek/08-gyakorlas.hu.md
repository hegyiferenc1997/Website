---
title: Gyakorlás – függvények
summary: Ellenőrző kérdések és összefoglaló feladatlap a függvényekhez, a határértékhez és a folytonossághoz.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért jobbra tol az f(x − 3), ha mínusz van benne?</summary>

Mert az $f(x - 3)$ az $x$ helyen azt az értéket veszi fel, amit az $f$ az $x - 3$ helyen: minden érték $3$-mal „később”, vagyis $3$-mal jobbra jelenik meg.

</details>

<details>
<summary>2. Mi a különbség a határérték és a függvényérték között egy pontban?</summary>

A határérték azt írja le, hova közelítenek a függvényértékek, ha $x \to x_0$; a függvényérték az $f(x_0)$. A kettő lehet különböző, és a határérték akkor is létezhet, ha $f(x_0)$ nincs értelmezve. Ha a kettő egyenlő, a függvény folytonos.

</details>

<details>
<summary>3. Hogyan döntöd el, hogy egy függvénynek van-e inverze?</summary>

Ha kölcsönösen egyértelmű: minden vízszintes egyenes legfeljebb egy pontban metszi a grafikonját (vízszintes egyenes próba). A szigorúan monoton függvények mindig ilyenek. Ha nem az, szűkítéssel (pl. $x^2$ az $x \geq 0$-ra) kaphatunk invertálható függvényt.

</details>

<details>
<summary>4. Miért hasznos a felezéses módszer a programozásban?</summary>

Mert csak folytonosság és előjelváltás kell hozzá, mindig konvergál, és minden lépés felezi a hibát: $40$ lépés után a pontosság $2^{-40}$-szerese az eredeti intervallumnak. Ugyanez az ötlet a bináris keresés.

</details>

## Összefoglaló feladatlap

```quiz required
? Mi az $f(x) = \sqrt{6 - 2x}$ értelmezési tartományának legnagyobb eleme?
= 3

? Add meg az $f(x) = x^2 + 2$ és a $g(x) = \sqrt{x}$ függvényből az $f(g(x))$ képletét ($x \geq 0$)!
fn: x -> x + 2
domain: 0.1, 5

? Add meg az $f(x) = \dfrac{2x - 1}{x + 3}$ függvény inverzét!
fn: x -> (3x + 1)/(2 - x)
domain: -1, 1.5
! $y(x + 3) = 2x - 1 \Rightarrow x(y - 2) = -3y - 1$

? Az $f(x) = x^2 - 2x - 3$ hány pontban metszi az $x$ tengelyt?
= 2

? Mennyi $\lim\limits_{x \to -1} \dfrac{x^2 + 3x + 2}{x + 1}$?
= 1
! $x^2 + 3x + 2 = (x + 1)(x + 2)$

? Mennyi $\lim\limits_{x \to \infty} \dfrac{4x - 7}{\sqrt{x^2 + 1}}$?
= 4

? Melyik függvény **páros**?
- $x^3 + x$
+ $x^2 \cos x$
- $e^x$
- $\sin x + 1$
! $(-x)^2 \cos(-x) = x^2 \cos x$

? A $-3\sin(2x) + 1$ függvény értékkészlete $[m; M]$. Mennyi $M$?
= 4
```
