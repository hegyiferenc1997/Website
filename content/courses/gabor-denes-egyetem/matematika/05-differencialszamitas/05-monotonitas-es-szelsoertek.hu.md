---
title: Monotonitás és szélsőérték
summary: A derivált előjele és a monotonitás, a stacionárius pontok, a helyi szélsőérték feltételei és a zárt intervallumon vett abszolút szélsőérték.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan dönti el a **derivált előjele** a monotonitást,
- mi a **szélsőérték szükséges** és **elégséges** feltétele,
- hogyan keressük meg egy függvény **abszolút** szélsőértékét zárt intervallumon.

## Monotonitás

Ha egy intervallumon

- $f'(x) > 0$, akkor $f$ ott **szigorúan nő**,
- $f'(x) < 0$, akkor $f$ ott **szigorúan csökken**,
- $f'(x) = 0$ mindenütt, akkor $f$ **állandó**.

(Ez a **Lagrange-középértéktételből** következik: $f(b) - f(a) = f'(\xi)(b - a)$ valamely $\xi \in \left]a; b\right[$-re.)

## Helyi szélsőérték

**Szükséges feltétel:** ha $f$ deriválható, és $x_0$-ban helyi szélsőértéke van, akkor $f'(x_0) = 0$. Az ilyen pontok a **stacionárius pontok**. Fordítva nem igaz: $x^3$-nak a $0$-ban $f'(0) = 0$, de nincs szélsőértéke.

**Elégséges feltétel (1.):** ha $f'$ az $x_0$-ban **előjelet vált**:

- $+$-ból $-$-ba → **helyi maximum**,
- $-$-ból $+$-ba → **helyi minimum**.

**Elégséges feltétel (2.):** ha $f'(x_0) = 0$ és $f''(x_0) > 0$ → minimum; $f''(x_0) < 0$ → maximum.

## Kidolgozott példa

$f(x) = x^3 - 6x^2 + 9x + 1$.

1. $f'(x) = 3x^2 - 12x + 9 = 3(x - 1)(x - 3)$.
2. Stacionárius pontok: $x = 1$ és $x = 3$.
3. Előjeltáblázat:

| $x$     | $x < 1$ | $1$     | $1 < x < 3$ | $3$     | $x > 3$ |
| ------- | ------- | ------- | ----------- | ------- | ------- |
| $f'(x)$ | $+$     | $0$     | $-$         | $0$     | $+$     |
| $f(x)$  | nő      | max: $5$ | csökken    | min: $1$ | nő     |

```plot
title: f(x) = x³ − 6x² + 9x + 1 és az érintője
x: -1, 5
y: -3, 8
param: t = 0, -0.8, 4.8, 0.05
tangent: x^3 - 6x^2 + 9x + 1 @ t # f(x)
point: 1, 5 # max
point: 3, 1 # min
```

Mozgasd a $t$ csúszkát: a $1$ és a $3$ helyen az érintő vízszintes, és a meredekség előjele itt vált.

## Abszolút szélsőérték zárt intervallumon

A folytonos $f$ az $[a; b]$ intervallumon felveszi a legnagyobb és legkisebb értékét (**Weierstrass-tétel**). Megkeresése:

1. Kiszámoljuk $f$ értékét a **stacionárius pontokban** (amelyek $[a; b]$-be esnek),
2. a **végpontokban** ($f(a)$, $f(b)$),
3. és ahol $f$ nem deriválható;
4. ezek közül a legnagyobb a maximum, a legkisebb a minimum.

Példa: a fenti $f$ a $[0; 4]$-en: $f(0) = 1$, $f(1) = 5$, $f(3) = 1$, $f(4) = 5$. Maximum $5$ (az $x = 1$ és $x = 4$ helyen), minimum $1$ (az $x = 0$ és $x = 3$ helyen).

## Összefoglalás

- $f' > 0$ → nő, $f' < 0$ → csökken.
- Helyi szélsőérték: $f'(x_0) = 0$ szükséges; elégséges az előjelváltás vagy $f''(x_0) \neq 0$.
- Zárt intervallumon: stacionárius pontok + végpontok összevetése.

## A lecke feladata

```quiz required
? Hol van helyi minimuma az $f(x) = x^2 - 8x + 3$ függvénynek? (Az $x$ értéket add meg.)
= 4

? Az $f(x) = x^3 - 3x$ függvénynek hol van helyi **maximuma**? (Az $x$ értéket add meg.)
= -1
! $f'(x) = 3(x - 1)(x + 1)$, $f'$ a $-1$-ben vált $+$-ból $-$-ba.

? Mennyi az $f(x) = x^3 - 3x$ legnagyobb értéke a $[-2; 3]$ intervallumon?
= 18
! Végpontok: $f(-2) = -2$, $f(3) = 18$; stacionárius: $f(-1) = 2$, $f(1) = -2$.

? Melyik intervallumon **csökken** az $f(x) = x^3 - 6x^2 + 9x + 1$?
- $]-\infty; 1[$
+ $]1; 3[$
- $]3; \infty[$
- $]0; 4[$

? Igaz-e, hogy ha $f'(x_0) = 0$, akkor $x_0$-ban biztosan szélsőérték van?
- igaz
+ hamis, pl. $x^3$ a $0$-ban
! A derivált előjelének váltania kell.
```
