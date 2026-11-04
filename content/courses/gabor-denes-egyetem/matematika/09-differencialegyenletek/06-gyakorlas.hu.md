---
title: Gyakorlás – differenciálegyenletek
summary: Ellenőrző kérdések és összefoglaló feladatlap a differenciálegyenletekhez.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Hogyan döntöd el, melyik módszer kell egy elsőrendű egyenlethez?</summary>

Először nézd meg, **szétválasztható-e** ($y' = f(x)g(y)$ alakra hozható-e). Ha nem, nézd meg, **lineáris-e** ($y' + p(x)y = q(x)$, vagyis $y$ és $y'$ csak első fokon, szorzat nélkül szerepel). Ha egyik sem, általában numerikus módszer kell.

</details>

<details>
<summary>2. Miért elég a megoldást ellenőrizni behelyettesítéssel?</summary>

Mert a megoldás definíció szerint olyan függvény, amely behelyettesítve azonosságot ad, és teljesíti a kezdeti feltételeket. A kezdetiérték-probléma megoldása (elég szép $f$ esetén) egyértelmű, ezért ha egy jelölt átmegy az ellenőrzésen, akkor **az** a megoldás, bárhonnan is jött.

</details>

<details>
<summary>3. Mi a fizikai jelentése a karakterisztikus egyenlet komplex gyökeinek?</summary>

A $\lambda = \alpha \pm \beta i$ gyökpárhoz $e^{\alpha x}(C_1\cos\beta x + C_2\sin\beta x)$ tartozik: $\beta$ a rezgés **körfrekvenciája**, $\alpha$ pedig a **csillapítás** ($\alpha < 0$: lecseng, $\alpha = 0$: állandó amplitúdó, $\alpha > 0$: felerősödik).

</details>

<details>
<summary>4. Miért nem mindig jó ötlet nagyon kicsi lépésközt választani az Euler-módszerben?</summary>

Mert a lépések száma (és így a futási idő) $\frac{1}{h}$-val arányos, és rengeteg lépésnél a kerekítési hibák is összeadódnak. Jobb egy magasabb rendű módszer (Runge–Kutta), amely nagyobb lépésközzel is pontos.

</details>

## Összefoglaló feladatlap

```quiz required
? Oldd meg: $y' = 4y$, $y(0) = 0{,}5$.
fn: x -> 0.5 e^(4x)
domain: -1, 0.5

? Oldd meg: $y' = 1 + y^2$, $y(0) = 0$ (a $-\frac{\pi}{2} < x < \frac{\pi}{2}$ tartományon).
fn: x -> tan(x)
domain: -1, 1
! $\int \frac{dy}{1 + y^2} = \operatorname{arctg} y$.

? Oldd meg: $y' + 2y = 4$, $y(0) = 0$.
fn: x -> 2 - 2 e^(-2x)

? Oldd meg: $y'' + 9y = 0$, $y(0) = 0$, $y'(0) = 3$.
fn: x -> sin(3x)

? Oldd meg: $y'' - y = 0$, $y(0) = 1$, $y'(0) = 1$.
fn: x -> e^x
domain: -2, 2

? Mi az $y'' + 6y' + 9y = 0$ általános megoldása?
- $C_1 e^{3x} + C_2 e^{-3x}$
+ $(C_1 + C_2 x)e^{-3x}$
- $C_1 \cos(3x) + C_2 \sin(3x)$
- $C_1 e^{-3x}$
! $\lambda^2 + 6\lambda + 9 = (\lambda + 3)^2$: kettős gyök.

? Egy izotóp felezési ideje $8$ nap. Hány nap alatt csökken a mennyisége a negyedére?
= 16

? Az $y' = 2x$, $y(0) = 0$ feladatra két Euler-lépést teszünk $h = 0{,}5$-tel. Mennyi $y_2$? (Tizedes törtként.)
= 0.5
! A pontos érték $y(1) = 1$; az Euler-módszer itt alulbecsül.
```
