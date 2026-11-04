---
title: Összefoglaló – vegyes feladatsor
summary: Vegyes feladatsor a teljes tananyagból, tanácsokkal az ismétléshez.
minutes: 45
kind: practice
---

## Tanácsok a felkészüléshez

<details>
<summary>1. Hogyan érdemes ismételni?</summary>

Témakörönként: először nézd át a leckék **összefoglalását**, aztán oldd meg újra a **gyakorló leckék** feladatlapjait **segítség nélkül**. Ahol elakadsz, ott olvasd újra a leckét. Az interaktív ábrákkal a „miért” is megmarad, nem csak a képlet.

</details>

<details>
<summary>2. Hogyan ellenőrizd a megoldásodat?</summary>

Minden lépést írj le, és a végén **ellenőrizz**: deriválással egy integrált, behelyettesítéssel egy egyenlet vagy differenciálegyenlet megoldását, nagyságrendi becsléssel egy számolást.

</details>

<details>
<summary>3. Melyek a leggyakoribb hibák?</summary>

A $+C$ lefelejtése a határozatlan integrálnál; a láncszabály belső deriváltjának elhagyása; a négyzetgyökös és logaritmusos egyenleteknél az értelmezési tartomány és a hamis gyökök ellenőrzésének kihagyása; a terület és az előjeles integrál összekeverése; a határértéknél a „$\frac{\infty}{\infty}$” „egyszerűsítése” $1$-re.

</details>

## Vegyes feladatsor

```quiz required
? Mennyi $\log_2 32 + \lg 0{,}01$?
= 3

? Oldd meg: $2^{x + 1} = 16$.
= 3

? $\lvert A \rvert = 12$, $\lvert B \rvert = 9$, $\lvert A \cap B \rvert = 4$. Mennyi $\lvert A \cup B \rvert$?
= 17

? Mennyi $\displaystyle\lim_{n \to \infty} \frac{3n^2 + 1}{n^2 - 5n}$?
= 3

? Mennyi a $\displaystyle\sum_{k=0}^{\infty} \left(\frac{1}{2}\right)^k$ sor összege?
= 2

? Deriváld: $f(x) = x^2 \sin x$.
fn: x -> 2x sin(x) + x^2 cos(x)

? Hol van az $f(x) = x^3 - 3x$ függvény helyi minimuma (az $x$ koordinátája)?
= 1

? Mennyi $\displaystyle\int_0^\pi \sin x\,dx$?
= 2

? Számold ki: $\displaystyle\int x\cos x\,dx$.
fn: x -> x sin(x) + cos(x)
+C
! Parciális integrálás: $u = x$, $v' = \cos x$.

? Add meg a $\cos x$ másodfokú Taylor-polinomját a $0$ körül!
fn: x -> 1 - x^2/2
domain: -1, 1

? Melyik igaz egy $2\pi$ szerint periodikus **páros** függvény Fourier-sorára?
- csak szinuszos tagok vannak benne
+ csak koszinuszos tagok (és az $\frac{a_0}{2}$) vannak benne
- minden együtthatója nulla
- csak páratlan indexű tagok vannak benne

? Hányféleképpen választhatunk ki $6$ ember közül $2$-t (a sorrend nem számít)?
= 15

? Oldd meg: $y' = -3y$, $y(0) = 2$.
fn: x -> 2 e^(-3x)
domain: -1, 1
```
