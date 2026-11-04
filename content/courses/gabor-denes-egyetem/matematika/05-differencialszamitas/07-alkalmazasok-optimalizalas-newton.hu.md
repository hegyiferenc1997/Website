---
title: Alkalmazások – optimalizálás és Newton-módszer
summary: Szélsőérték-feladatok a gyakorlatból, lineáris közelítés, és a Newton-módszer egyenletek gépi megoldására.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan írunk fel és oldunk meg egy **optimalizálási** (szélsőérték-) feladatot,
- mi a **lineáris közelítés** (az érintő mint közelítés),
- hogyan működik a **Newton-módszer**, és miért olyan gyors.

## Optimalizálás

**Lépések:** (1) mit akarunk maximalizálni/minimalizálni? (2) írjuk fel **egyetlen** változó függvényeként (a feltételt behelyettesítve), (3) értelmezési tartomány, (4) deriválás, stacionárius pontok, (5) végpontok és ellenőrzés, (6) válasz.

**Példa – a legnagyobb doboz.** Egy $12 \times 12$ cm-es kartonlap sarkaiból $x$ cm oldalú négyzeteket vágunk ki, és felhajtjuk az oldalakat. Mekkora $x$-re lesz a doboz térfogata maximális?

$$
V(x) = x (12 - 2x)^2, \qquad 0 < x < 6.
$$

$V'(x) = (12 - 2x)^2 + x \cdot 2(12 - 2x)(-2) = (12 - 2x)(12 - 6x)$. Stacionárius pont a tartományban: $x = 2$. Itt $V(2) = 2 \cdot 8^2 = 128$ cm³, a végpontokban $V \to 0$, tehát ez a maximum.

```plot
title: A doboz térfogata a kivágás méretének függvényében
x: 0, 6
y: 0, 150
param: t = 1, 0.1, 5.9, 0.05
tangent: x (12 - 2x)^2 @ t # V(x) = x(12 − 2x)²
value: V(t) = t (12 - 2t)^2
```

Optimalizálás mindenhol van az informatikában: a **gépi tanulás** egy hibafüggvényt minimalizál a deriváltja (gradiense) segítségével (**gradiens módszer**).

## Lineáris közelítés

Az érintő a pont közelében jól közelíti a függvényt:

$$
f(x_0 + h) \approx f(x_0) + f'(x_0)\, h.
$$

Például $\sqrt{4{,}1}$: $f(x) = \sqrt x$, $x_0 = 4$, $f'(4) = \frac{1}{4}$, tehát $\sqrt{4{,}1} \approx 2 + \frac{0{,}1}{4} = 2{,}025$ (pontosan $2{,}02485\ldots$).

## Newton-módszer

Az $f(x) = 0$ egyenlet megoldását keressük. Egy $x_0$ kezdőértékből indulva az érintő zérushelyét vesszük következő közelítésnek:

$$
x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}.
$$

Jó kezdőértéknél **nagyon gyorsan** konvergál: a helyes tizedesjegyek száma lépésenként kb. **megduplázódik**. A számológépek és a programkönyvtárak így számolnak gyököt is: $\sqrt{a}$ az $x^2 - a = 0$ megoldása, a lépés $x_{n+1} = \frac{1}{2}\left(x_n + \frac{a}{x_n}\right)$ (Hérón-módszer).

```plot
title: Newton-módszer: az érintő zérushelye a következő közelítés
x: 0, 4
y: -3, 8
param: t = 3, 0.5, 3.8, 0.05
tangent: x^2 - 2 @ t # f(x) = x² − 2
value: következő közelítés = t - (t^2 - 2)/(2t)
```

```python run
def newton(f, df, x, lepesek=6):
    """Newton-módszer: x_{n+1} = x_n - f(x_n) / f'(x_n)."""
    for n in range(lepesek):
        x = x - f(x) / df(x)
        print(f"{n + 1}. lépés: {x:.15f}")
    return x

# √2 az x² − 2 = 0 egyenlet pozitív gyöke.
newton(lambda x: x * x - 2, lambda x: 2 * x, 3.0)
print("pontos:   ", 2 ** 0.5)
```

## Összefoglalás

- Optimalizálás: egyváltozós célfüggvény → derivált $= 0$ → végpontok → válasz.
- Lineáris közelítés: $f(x_0 + h) \approx f(x_0) + f'(x_0)h$.
- Newton: $x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$; nagyon gyors, de jó kezdőérték kell.

## A lecke feladata

```quiz required
? Egy téglalap kerülete $40$ m. Mekkora a területe, ha a terület maximális?
= 100
! $T(x) = x(20 - x)$, maximum az $x = 10$-ben.

? A fenti dobozfeladatban (a $12 \times 12$-es lap) mekkora $x$-re maximális a térfogat?
= 2

? Lineáris közelítéssel mennyi $\sqrt{9{,}3}$? ($x_0 = 9$, három tizedesre.)
= 3.05
= 3.050
! $3 + \frac{0{,}3}{6}$

? Newton-módszerrel oldjuk meg az $x^2 - 10 = 0$ egyenletet $x_0 = 3$-ból. Mennyi $x_1$? (Négy tizedesre kerekítve.)
= 3.1667
! $x_1 = 3 - \frac{9 - 10}{6}$

? Mi a Newton-módszer lépése az $f(x) = x^3 - a$ esetén (köbgyökvonás)? Add meg $x_{n+1}$-et $x$ (= $x_n$) és $a$ függvényében!
fn: x, a -> x - (x^3 - a)/(3x^2)
domain: 1, 4
```
