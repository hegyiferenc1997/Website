---
title: Gyakorlás – differenciálszámítás
summary: Ellenőrző kérdések és összefoglaló feladatlap a deriválásról és a függvényvizsgálatról.
minutes: 35
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a derivált geometriai és fizikai jelentése?</summary>

Geometriailag az érintő meredeksége az adott pontban; fizikailag a pillanatnyi változási sebesség (pl. az út deriváltja a sebesség, a sebességé a gyorsulás).

</details>

<details>
<summary>2. Mikor kell a láncszabályt használni?</summary>

Ha a függvény összetett, vagyis egy függvény argumentumában nem simán $x$ áll, hanem egy másik kifejezés: $\sin(3x)$, $e^{x^2}$, $(2x + 1)^5$, $\ln(\cos x)$. Ilyenkor a külső deriváltját még meg kell szorozni a belső deriváltjával.

</details>

<details>
<summary>3. Miért nem elég, hogy f′(x₀) = 0, a szélsőértékhez?</summary>

Mert a derivált nem feltétlenül vált előjelet: az $x^3$ deriváltja a $0$-ban $0$, de előtte és utána is pozitív, így a függvény ott végig nő (ez inflexiós pont, nem szélsőérték).

</details>

<details>
<summary>4. Mikor nem működik jól a Newton-módszer?</summary>

Ha a kezdőérték messze van, ha valamelyik lépésben $f'(x_n) \approx 0$ (az érintő majdnem vízszintes, a következő pont nagyon messzire ugrik), vagy ha a közelítések körbe-körbe járnak. Ilyenkor biztonságosabb előbb felezéssel szűkíteni.

</details>

## Összefoglaló feladatlap

```quiz required
? Deriváld: $f(x) = x^3 \ln x$.
fn: x -> 3x^2 ln(x) + x^2
domain: 0.2, 4

? Deriváld: $f(x) = \dfrac{e^x}{x^2 + 1}$.
fn: x -> e^x (x - 1)^2/(x^2 + 1)^2
domain: -2, 2
! $\frac{e^x(x^2 + 1) - e^x \cdot 2x}{(x^2 + 1)^2}$

? Deriváld: $f(x) = \sqrt{1 + \sin^2 x}$.
fn: x -> sin(x) cos(x)/sqrt(1 + sin(x)^2)

? Írd fel az $f(x) = e^{2x}$ érintőjének egyenletét az $x_0 = 0$ pontban, $y = g(x)$ alakban!
fn: x -> 2x + 1

? Mennyi $\lim\limits_{x \to 0} \dfrac{x - \sin x}{x^3}$? (Törtként vagy tizedes törtként.)
= 1/6
! Háromszor alkalmazd a L'Hospital-szabályt.

? Az $f(x) = 2x^3 - 9x^2 + 12x$ függvénynek hol van helyi **minimuma**? (Az $x$ értéket add meg.)
= 2
! $f'(x) = 6(x - 1)(x - 2)$

? Mennyi az $f(x) = 2x^3 - 9x^2 + 12x$ inflexiós pontjának első koordinátája? (Tizedes törtként.)
= 1.5
= 3/2

? Egy $V = 1$ liter térfogatú, felül nyitott, négyzet alapú doboz anyagszükséglete $A(a) = a^2 + \frac{4}{a}$ (dm²), ahol $a$ az alapél (dm). Mekkora $a$-ra minimális?
= 1.26
! $A'(a) = 2a - \frac{4}{a^2} = 0 \Rightarrow a^3 = 2$, $a = \sqrt[3]{2}$ (két tizedesre).
```
