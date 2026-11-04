---
title: Függvényműveletek, összetett és inverz függvény
summary: Összeg, szorzat, hányados, kompozíció, a kölcsönösen egyértelmű függvény és az inverz.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- a függvények **összegét**, **szorzatát**, **hányadosát** és azok értelmezési tartományát,
- az **összetett függvényt** (kompozíciót), és hogy a sorrend számít,
- mikor van egy függvénynek **inverze**, és hogyan számoljuk ki.

## Alapműveletek

$(f + g)(x) = f(x) + g(x)$, $\ (f g)(x) = f(x) g(x)$, $\ \left(\dfrac{f}{g}\right)(x) = \dfrac{f(x)}{g(x)}$. Az értelmezési tartomány $D_f \cap D_g$, a hányadosnál ebből még ki kell venni $g$ zérushelyeit.

Példa: $f(x) = \sqrt{x}$, $g(x) = x - 2$. Ekkor $\dfrac{f}{g}(x) = \dfrac{\sqrt x}{x - 2}$, értelmezési tartománya $[0; 2[ \ \cup\ ]2; \infty[$.

## Összetett függvény

Az $f \circ g$ (olvasd: „$f$ kör $g$”) **összetett függvény**: $(f \circ g)(x) = f\big(g(x)\big)$. Előbb a **belső** függvény ($g$) számol, az eredményt a **külső** ($f$) kapja.

$f(x) = x^2$, $g(x) = x + 3$:

$$
(f \circ g)(x) = (x + 3)^2, \qquad (g \circ f)(x) = x^2 + 3.
$$

A sorrend tehát **számít**: $f \circ g \neq g \circ f$ általában. A programozásban ez a függvények egymásba ágyazása: `f(g(x))`, illetve a parancssori „csővezeték” (`g | f`).

Összetett függvény felbontása: $h(x) = \sin^2(3x + 1)$ = külső $u^2$, középső $\sin u$, belső $3x + 1$. Ezt a láncszabálynál (deriválás) fogjuk használni.

## Inverz függvény

Az $f$ **kölcsönösen egyértelmű** (injektív), ha különböző helyeken különböző értéket vesz fel: $x_1 \neq x_2 \Rightarrow f(x_1) \neq f(x_2)$. A szigorúan monoton függvények ilyenek. Ekkor létezik az **inverz** $f^{-1}$, amely „visszafelé” rendel:

$$
f^{-1}(y) = x \iff f(x) = y, \qquad D_{f^{-1}} = R_f, \quad R_{f^{-1}} = D_f.
$$

**Kiszámítás:** $y = f(x)$-ből kifejezzük $x$-et, majd a változókat felcseréljük.

Példa: $f(x) = 2x + 6$. $\ y = 2x + 6 \Rightarrow x = \dfrac{y - 6}{2}$, tehát $f^{-1}(x) = \dfrac{x - 6}{2} = \dfrac{x}{2} - 3$.

Az inverz grafikonja az eredeti **tükörképe az $y = x$ egyenesre**. Nevezetes párok: $e^x$ és $\ln x$, $x^2$ ($x \geq 0$-ra szűkítve) és $\sqrt x$, $\sin x$ ($[-\frac{\pi}{2}; \frac{\pi}{2}]$-re szűkítve) és $\arcsin x$.

```plot
title: Függvény és inverze: tükrözés az y = x egyenesre
x: -4, 6
y: -4, 6
param: m = 2, 0.3, 3, 0.1
param: b = -1, -3, 3, 0.5
f: m x + b # f(x) = mx + b
f: (x - b)/m # f⁻¹(x) = (x − b)/m
dash: x # y = x
```

## Összefoglalás

- $f \pm g$, $fg$, $f/g$: értelmezési tartomány $D_f \cap D_g$ (hányadosnál $g \neq 0$).
- $(f \circ g)(x) = f(g(x))$: előbb a belső; a sorrend számít.
- Inverz csak kölcsönösen egyértelmű függvénynek van; $y = f(x)$-ből kifejezzük $x$-et; a grafikon tükörképe az $y = x$-re.

## A lecke feladata

```quiz required
? $f(x) = x^2$, $g(x) = x + 3$. Mennyi $(f \circ g)(2)$?
= 25

? Ugyanezekkel mennyi $(g \circ f)(2)$?
= 7

? $f(x) = 3x - 1$, $g(x) = x^2$. Add meg az $f(g(x))$ képletét!
fn: x -> 3x^2 - 1

? Add meg az $f(x) = \dfrac{x + 4}{3}$ függvény inverzét!
fn: x -> 3x - 4
! $y = \frac{x + 4}{3} \Rightarrow x = 3y - 4$

? Melyik függvénynek **nincs** inverze a teljes $\mathbb{R}$-en?
- $x^3$
- $e^x$
+ $x^2$
- $2x + 1$
! $(-2)^2 = 2^2$: nem kölcsönösen egyértelmű.
```
