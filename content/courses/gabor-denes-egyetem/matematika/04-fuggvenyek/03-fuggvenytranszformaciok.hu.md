---
title: Függvénytranszformációk
summary: Eltolás, tükrözés, nyújtás és zsugorítás – a·f(b(x − c)) + d, csúszkákkal kipróbálva.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan változik egy grafikon az $f(x) + d$, $f(x - c)$, $a \cdot f(x)$ és $f(bx)$ transzformációkkal,
- hogyan ábrázolunk egy bonyolultabb függvényt egy **alapfüggvényből** lépésenként,
- hogyan kapjuk meg a **tükrözéseket**.

## A négy alaplépés

Legyen $f$ az alapfüggvény (pl. $x^2$, $\sqrt x$, $\sin x$).

| Új függvény    | Hatás a grafikonra                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------- |
| $f(x) + d$     | eltolás **függőlegesen** $d$-vel (felfelé, ha $d > 0$)                                                      |
| $f(x - c)$     | eltolás **vízszintesen** $c$-vel (**jobbra**, ha $c > 0$!)                                                  |
| $a \cdot f(x)$ | **függőleges nyújtás** $a$-szorosra ($\lvert a \rvert < 1$: zsugorítás); $a < 0$: tükrözés az $x$ tengelyre |
| $f(b x)$       | **vízszintes zsugorítás** $b$-ed részére ($\lvert b \rvert > 1$); $b < 0$: tükrözés az $y$ tengelyre        |

A leggyakoribb hiba: $f(x - 3)$ **jobbra** tol, nem balra. Gondolj bele: az $f(x - 3)$ ugyanazt az értéket $3$-mal később (nagyobb $x$-nél) veszi fel.

## Próbáld ki!

```plot
title: a · f(b(x − c)) + d
x: -6, 6
y: -5, 7
param: a = 1, -3, 3, 0.1
param: b = 1, -3, 3, 0.1
param: c = 0, -4, 4, 0.5
param: d = 0, -4, 4, 0.5
f: a (b (x - c))^2 + d # a·(b(x − c))² + d
dash: x^2 # x²
```

```plot
title: Transzformált szinusz: A · sin(ω(x − φ))
x: -7, 7
y: -4, 4
param: A = 1, -3, 3, 0.1
param: w = 1, 0.2, 4, 0.1
param: p = 0, -3.2, 3.2, 0.1
f: A sin(w (x - p)) # A·sin(ω(x − φ))
dash: sin(x) # sin x
value: periódus 2π/ω = 2 pi/w
```

A második ábrán $A$ az **amplitúdó**, $\omega$ a **körfrekvencia** (a periódus $\frac{2\pi}{\omega}$), $\varphi$ a **fáziseltolás** – ezekkel írjuk le a jeleket a jelfeldolgozásban.

## Ábrázolás lépésenként

$g(x) = -2(x + 1)^2 + 3$ az $x^2$-ből: (1) $(x + 1)^2$: $1$-gyel **balra**; (2) $2(x+1)^2$: függőlegesen kétszeresére nyújtva; (3) $-2(x+1)^2$: tükrözve az $x$ tengelyre; (4) $+3$: $3$-mal fel. A csúcs a $(-1; 3)$ pont, a parabola lefelé nyílik.

**Sorrend:** a „belső” transzformációk ($x$-en: eltolás, zsugorítás) és a „külső” ($f$ értékén: nyújtás, eltolás) külön kezelhetők; a külsőknél előbb nyújtás/tükrözés, utána eltolás.

## Összefoglalás

- $f(x) + d$: fel/le; $f(x - c)$: jobbra/balra (ellentétes előjel!).
- $a f(x)$: függőleges nyújtás, $a < 0$ tükrözés az $x$ tengelyre; $f(bx)$: vízszintes zsugorítás, $b < 0$ tükrözés az $y$ tengelyre.
- $A \sin(\omega(x - \varphi))$: amplitúdó, periódus $\frac{2\pi}{\omega}$, fáziseltolás.

## A lecke feladata

```quiz required
? Hogyan kapjuk a $\sqrt{x - 4}$ grafikonját a $\sqrt{x}$-ből?
- $4$-gyel balra toljuk
+ $4$-gyel jobbra toljuk
- $4$-gyel felfelé toljuk
- $4$-gyel lefelé toljuk

? Mi a $g(x) = -2(x + 1)^2 + 3$ parabola csúcsának **első** koordinátája?
= -1

? Mi a $g(x) = -2(x + 1)^2 + 3$ értékkészletének legnagyobb eleme?
= 3

? Írd fel annak a függvénynek a képletét, amelyet az $x^2$ grafikonjából $2$-vel jobbra, majd $5$-tel lefelé tolással kapunk!
fn: x -> (x - 2)^2 - 5

? Mennyi a $3\sin(4x)$ függvény periódusa? (Kerekítsd két tizedesre!)
= 1.57
! $\frac{2\pi}{4} = \frac{\pi}{2}$
```
