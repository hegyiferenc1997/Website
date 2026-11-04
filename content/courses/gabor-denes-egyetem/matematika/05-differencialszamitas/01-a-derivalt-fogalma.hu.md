---
title: A derivált fogalma
summary: A differenciahányadostól a differenciálhányadosig – az érintő meredeksége és a pillanatnyi sebesség.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **differenciahányados** (átlagos változási sebesség),
- hogyan lesz belőle határértékkel a **derivált** (pillanatnyi változási sebesség),
- mi a derivált **geometriai jelentése** (az érintő meredeksége), és mikor **nem** deriválható egy függvény.

## Átlagos változás: a differenciahányados

Egy autó $t$ másodperc alatt $s(t) = t^2$ métert tesz meg. A $[1; 3]$ időszakban az átlagsebessége:

$$
\frac{s(3) - s(1)}{3 - 1} = \frac{9 - 1}{2} = 4 \ \tfrac{\text{m}}{\text{s}}.
$$

Általában az $f$ függvény **differenciahányadosa** az $x_0$ és $x_0 + h$ pont között:

$$
\frac{f(x_0 + h) - f(x_0)}{h}.
$$

Geometriailag ez a két ponton átmenő **szelő** meredeksége.

## Pillanatnyi változás: a derivált

Ha a $h$ egyre kisebb, a szelő egyre jobban simul a görbéhez, és az **érintőhöz** tart. Az $f$ függvény **deriváltja** az $x_0$ pontban:

$$
f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h},
$$

ha ez a határérték létezik és véges. Ekkor azt mondjuk, hogy $f$ **differenciálható** $x_0$-ban.

**Példa.** $f(x) = x^2$, tetszőleges $x_0$-ban:

$$
\frac{(x_0 + h)^2 - x_0^2}{h} = \frac{2x_0 h + h^2}{h} = 2x_0 + h \ \xrightarrow{h \to 0}\ 2x_0.
$$

Tehát $(x^2)' = 2x$, és az autó pillanatnyi sebessége a $t = 1$ s pillanatban $2 \ \tfrac{\text{m}}{\text{s}}$.

## Próbáld ki: az érintő

Mozgasd a $t$ csúszkát! A sárga egyenes az $f(x) = x^2$ görbe érintője az $x = t$ pontban; alul látod a meredekségét, ami mindig $2t$.

```plot
title: Az x² érintője
x: -3, 3
y: -2, 9
param: t = 1, -2.5, 2.5, 0.1
tangent: x^2 @ t # f(x) = x²
value: 2t = 2t
```

## Az érintő egyenlete

Az $(x_0; f(x_0))$ ponton átmenő, $f'(x_0)$ meredekségű egyenes:

$$
y = f(x_0) + f'(x_0)\,(x - x_0).
$$

Például $f(x) = x^2$ érintője az $x_0 = 1$ pontban: $y = 1 + 2(x - 1) = 2x - 1$.

## Mikor nem deriválható?

- **Ugrás vagy szakadás** van: ha $f$ nem **folytonos** $x_0$-ban, ott nem is deriválható.
- **Törés („csúcs”)** van: $f(x) = \lvert x \rvert$ folytonos a $0$-ban, de balról a meredekség $-1$, jobbról $+1$, így a határérték nem létezik.
- **Függőleges érintő**: $f(x) = \sqrt[3]{x}$ a $0$-ban; a differenciahányados $+\infty$-hez tart.

Fontos: **a deriválhatóságból következik a folytonosság**, de fordítva nem (lásd $\lvert x \rvert$).

## Összefoglalás

- Differenciahányados = szelő meredeksége = átlagos változási sebesség.
- Derivált: $f'(x_0) = \lim_{h\to 0} \frac{f(x_0+h)-f(x_0)}{h}$ = érintő meredeksége = pillanatnyi változási sebesség.
- Érintő: $y = f(x_0) + f'(x_0)(x - x_0)$.
- Deriválható ⇒ folytonos, de a folytonos függvény is lehet nem deriválható (törés, függőleges érintő).

## A lecke feladata

```quiz required
? Mennyi az $f(x) = x^2$ differenciahányadosa a $2$ és a $4$ pont között?
= 6
! $\frac{16 - 4}{4 - 2}$

? Írd fel a definíció alapján kapott deriváltat: mi $(x^2)'$?
fn: x -> 2x
! A differenciahányados $2x_0 + h$, és $h \to 0$.

? Mennyi az $f(x) = x^2$ érintőjének meredeksége az $x_0 = -1{,}5$ pontban?
= -3
! $f'(x_0) = 2x_0$

? Az $f(x) = x^2$ érintője az $x_0 = 3$ pontban $y = mx + b$. Mennyi $b$?
= -9
! $y = 9 + 6(x - 3)$

? Melyik függvény folytonos, de **nem** deriválható a $0$ pontban?
- $f(x) = x^2$
+ $f(x) = \lvert x \rvert$
- $f(x) = 3x + 1$
- $f(x) = \sin x$
! Ahol a görbének „csúcsa” van, ott nincs egyértelmű érintő.
```
