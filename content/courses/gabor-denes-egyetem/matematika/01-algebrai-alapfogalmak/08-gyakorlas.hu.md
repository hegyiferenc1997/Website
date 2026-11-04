---
title: Gyakorlás – algebra és egyenletek
summary: Ellenőrző kérdések és összefoglaló feladatlap a 0. heti algebrai anyaghoz.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

Előbb próbálj meg fejben válaszolni, csak utána nyisd le a választ!

<details>
<summary>1. Miért nem igaz, hogy (a + b)² = a² + b²?</summary>

Mert $(a + b)^2 = (a + b)(a + b) = a^2 + 2ab + b^2$: a szorzásnál a „vegyes” tagok ($ab$ és $ba$) is megjelennek. Például $a = b = 1$-re a bal oldal $4$, a jobb $2$.

</details>

<details>
<summary>2. Mikor kell ellenőrizni egy egyenlet megoldását a végén?</summary>

Ha nem ekvivalens átalakítást végeztünk: négyzetre emeltünk, változót tartalmazó kifejezéssel szoroztunk, vagy a logaritmus/gyök kikötését nem vettük figyelembe menet közben. Ilyenkor hamis gyök jöhet be.

</details>

<details>
<summary>3. Mi a különbség a √9 és az x² = 9 egyenlet megoldásai között?</summary>

$\sqrt{9} = 3$ egyetlen (nemnegatív) szám. Az $x^2 = 9$ egyenletnek két megoldása van: $x = 3$ és $x = -3$, mert $x = \pm\sqrt 9$.

</details>

<details>
<summary>4. Hány bit kell egy 64 lapos kártyapakli egy lapjának kódolásához, és miért?</summary>

$\log_2 64 = 6$ bit, mert $2^6 = 64$: hat bittel pontosan 64 különböző kódot lehet előállítani.

</details>

<details>
<summary>5. Miért nem szorozhatjuk be a nevezővel az (x + 1)/(x − 2) ≥ 0 egyenlőtlenséget?</summary>

Mert a nevező előjele $x$-től függ: ha negatív, a reláció iránya megfordulna. Helyette előjeltáblázatot készítünk a számláló és a nevező zérushelyeivel ($-1$ és $2$).

</details>

## Kidolgozott mintafeladat

Oldd meg a valós számok halmazán: $\lg(x + 6) - \lg(x - 3) = 1$.

1. Kikötés: $x + 6 > 0$ és $x - 3 > 0$, tehát $x > 3$.
2. Azonosság: $\lg \dfrac{x + 6}{x - 3} = 1 \Rightarrow \dfrac{x + 6}{x - 3} = 10$.
3. $x + 6 = 10x - 30 \Rightarrow 9x = 36 \Rightarrow x = 4$.
4. Ellenőrzés: $4 > 3$ ✓, $\lg 10 - \lg 1 = 1$ ✓.

## Összefoglaló feladatlap

```quiz required
? Mennyi $\left(\dfrac{27}{8}\right)^{-2/3}$? (Törtként is megadhatod.)
= 4/9
! Előbb a köbgyök: $\frac{3}{2}$, aztán négyzetre emelés és reciprok.

? Egyszerűsítsd: $\dfrac{x^3 - 8}{x^2 - 4}$ ($x \neq \pm 2$).
fn: x -> (x^2 + 2x + 4)/(x + 2)
domain: -1, 1.5
! $x^3 - 8 = (x - 2)(x^2 + 2x + 4)$

? A $x^2 + px + 12 = 0$ egyenlet egyik gyöke $3$. Mennyi $p$?
= -7
! Viète: a másik gyök $4$, összegük $-p$.

? Oldd meg: $2^{x+3} - 2^x = 56$. Mennyi $x$?
= 3
! $2^x (8 - 1) = 56$

? Oldd meg: $\lg(x + 6) - \lg(x - 3) = 1$. Mennyi $x$?
= 4

? Oldd meg: $\sqrt{x + 1} = x - 1$. Mennyi $x$?
= 3
! A négyzetre emelés után $x = 0$ is kijön, de az hamis gyök.

? Hány egész szám elégíti ki a $\lvert x + 2 \rvert \leq 3$ egyenlőtlenséget?
= 7
! $-5 \leq x \leq 1$

? Egy termék árát $20\%$-kal emelték, majd az új árat $20\%$-kal csökkentették. Hány százalékkal olcsóbb az eredetinél?
= 4
! $1{,}2 \cdot 0{,}8 = 0{,}96$
```
