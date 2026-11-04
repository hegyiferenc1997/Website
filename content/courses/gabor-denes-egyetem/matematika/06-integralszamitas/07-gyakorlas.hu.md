---
title: Gyakorlás – integrálszámítás
summary: Ellenőrző kérdések és összefoglaló feladatlap a határozatlan és határozott integrálhoz.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért kell +C a határozatlan integrálnál, és miért nem kell a határozottnál?</summary>

Mert egy függvénynek végtelen sok primitív függvénye van, amelyek konstansban különböznek ($F + C$). A határozott integrálnál $F(b) - F(a)$-t számolunk, és ebben a $C$ kiesik.

</details>

<details>
<summary>2. Mi a különbség az integrál és a terület között?</summary>

Az integrál előjeles: az $x$ tengely alatti részeket negatívan számolja. A terület mindig nemnegatív, ezért előjelváltásnál a zérushelyeknél szét kell bontani, és a negatív részek abszolút értékét kell venni.

</details>

<details>
<summary>3. Honnan tudod, hogy helyettesítés vagy parciális integrálás kell?</summary>

Ha egy kifejezés és (konstans szorzótól eltekintve) a deriváltja is szerepel (pl. $x e^{x^2}$), helyettesítés. Ha két különböző típusú függvény szorzata (polinom · exponenciális/trigonometrikus, vagy $\ln x$), parciális integrálás, ahol a polinomot (vagy a $\ln x$-et) deriváljuk.

</details>

<details>
<summary>4. Hogyan lehet véges egy végtelen hosszú tartomány területe?</summary>

Ha a függvény elég gyorsan tart $0$-hoz: az $\int_1^b \frac{1}{x^2}\,dx = 1 - \frac{1}{b}$ minden $b$-re $1$ alatt marad, és $1$-hez tart. Ugyanez az ötlet, mint a mértani sornál: végtelen sok, egyre kisebb rész összege lehet véges.

</details>

## Összefoglaló feladatlap

```quiz required
? Számold ki: $\displaystyle\int \left(4x^3 - \frac{3}{x^2} + \frac{1}{\sqrt x}\right) dx$ ($x > 0$).
fn: x -> x^4 + 3/x + 2 sqrt(x)
domain: 0.3, 4
+C

? Számold ki: $\displaystyle\int \frac{x}{x^2 + 9}\,dx$.
fn: x -> ln(x^2 + 9)/2
+C

? Számold ki: $\displaystyle\int x^2 e^{x^3}\,dx$.
fn: x -> e^(x^3)/3
domain: -1, 1
+C

? Számold ki: $\displaystyle\int x e^{2x}\,dx$.
fn: x -> (x/2 - 1/4) e^(2x)
domain: -1, 1
+C

? Mennyi $\displaystyle\int_0^1 (x^3 + 2x)\,dx$? (Tizedes törtként vagy törtként.)
= 1.25
= 5/4

? Mennyi $\displaystyle\int_1^{e^2} \frac{1}{x}\,dx$?
= 2

? Mekkora az $y = x^2 - 4$ és az $x$ tengely közötti terület a $[0; 3]$ intervallumon? (Törtként vagy két tizedesre.)
= 23/3
= 7.67
! A zérushely $2$: $\frac{16}{3} + \frac{7}{3}$

? Mennyi $\displaystyle\int_0^\infty x e^{-x^2}\,dx$? (Törtként vagy tizedes törtként.)
= 1/2
! A primitív függvény $-\frac{1}{2} e^{-x^2}$.
```
