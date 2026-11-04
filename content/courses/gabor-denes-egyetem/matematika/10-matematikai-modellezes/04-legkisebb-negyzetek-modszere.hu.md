---
title: Adatokra illesztés – a legkisebb négyzetek módszere
summary: Regressziós egyenes illesztése mérési adatokra, a hibanégyzet-összeg minimalizálása, a normálegyenletek, és exponenciális modell illesztése logaritmussal.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mit jelent egy egyenest **illeszteni** mérési adatokra,
- miért a **hibanégyzetek összegét** minimalizáljuk,
- a regressziós egyenes **képletét**,
- hogyan illesztünk **exponenciális** modellt.

## A feladat

Mérési adataink vannak: $(x_1; y_1), \dots, (x_n; y_n)$. Keressük azt az $y = mx + b$ egyenest, amely a „legjobban” illeszkedik. Az egyes pontok **eltérése** (reziduuma) $y_i - (mx_i + b)$. A **legkisebb négyzetek módszere** (Gauss) azt az egyenest választja, amelyre a

$$
S(m, b) = \sum_{i=1}^{n} \big(y_i - (m x_i + b)\big)^2
$$

**hibanégyzet-összeg** a legkisebb. (A négyzetre emelés miatt a pozitív és negatív eltérések nem ejtik ki egymást, a nagy eltérések jobban számítanak, és a minimum deriválással kiszámolható.)

Próbáld meg kézzel megtalálni a legjobb egyenest! Az alábbi öt mérési pontra a minimum $S = 1{,}9$.

```plot
title: Egyenes illesztése öt mérési pontra
x: 0, 6
y: 0, 8
param: m = 0.5, -1, 2, 0.05
param: b = 2, -1, 4, 0.05
f: m x + b # y = mx + b
point: 1, 2
point: 2, 3
point: 3, 5
point: 4, 4
point: 5, 6
value: S (hibanégyzet-összeg) = (2 - m - b)^2 + (3 - 2m - b)^2 + (5 - 3m - b)^2 + (4 - 4m - b)^2 + (6 - 5m - b)^2
```

## A regressziós egyenes képlete

$S$ minimumánál mindkét parciális derivált nulla ($\frac{\partial S}{\partial m} = 0$, $\frac{\partial S}{\partial b} = 0$). Ebből a **normálegyenletek** megoldása:

$$
m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}, \qquad b = \bar y - m \bar x,
$$

ahol $\bar x$ és $\bar y$ az átlagok. Következmény: a regressziós egyenes mindig átmegy az **átlagponton**, $(\bar x; \bar y)$-on.

**Példa** a fenti adatokra: $\bar x = 3$, $\bar y = 4$. A szorzatok összege $(-2)(-2) + (-1)(-1) + 0 \cdot 1 + 1 \cdot 0 + 2 \cdot 2 = 9$, a négyzeteké $4 + 1 + 0 + 1 + 4 = 10$. Tehát $m = 0{,}9$ és $b = 4 - 0{,}9 \cdot 3 = 1{,}3$.

```python run
# Regressziós egyenes a képletekkel (a numpy.polyfit(x, y, 1) ugyanezt adná)
xs = [1, 2, 3, 4, 5]
ys = [2, 3, 5, 4, 6]
n = len(xs)
xa, ya = sum(xs) / n, sum(ys) / n
m = sum((x - xa) * (y - ya) for x, y in zip(xs, ys)) / sum((x - xa) ** 2 for x in xs)
b = ya - m * xa
S = sum((y - (m * x + b)) ** 2 for x, y in zip(xs, ys))
print(f"y = {m:.2f}x + {b:.2f},  S = {S:.2f}")
print("becslés x = 6-ra:", round(m * 6 + b, 2))
```

## Nemlineáris modellek linearizálása

Exponenciális kapcsolatnál, $y = Ae^{kx}$, vegyük mindkét oldal logaritmusát: $\ln y = \ln A + kx$. Ez az $(x; \ln y)$ pontokra **lineáris**, így egyenest illesztünk, és $k = m$, $A = e^{b}$. Hasonlóan hatványfüggvénynél ($y = Ax^p$) a $(\ln x; \ln y)$ pontokra illesztünk (log-log ábrázolás).

A legkisebb négyzetek módszere a gépi tanulás alapja is: a **lineáris regresszió** pontosan ez, a neurális hálók tanítása pedig egy (sokkal bonyolultabb) hibafüggvény minimalizálása.

## Összefoglalás

- Hibanégyzet-összeg: $S = \sum (y_i - mx_i - b)^2$, ezt minimalizáljuk.
- $m = \frac{\sum (x_i - \bar x)(y_i - \bar y)}{\sum (x_i - \bar x)^2}$, $b = \bar y - m\bar x$; az egyenes átmegy $(\bar x; \bar y)$-on.
- Exponenciális modell: egyenes illesztése $(x; \ln y)$-ra.

## A lecke feladata

```quiz required
? A $(0; 1)$, $(1; 3)$, $(2; 5)$ pontokra mi a regressziós egyenes meredeksége, $m$?
= 2
! A pontok egy egyenesen vannak.

? Ugyanerre mennyi $b$?
= 1

? Az $(1; 1)$, $(2; 2)$, $(3; 2)$ pontokra mennyi $m$? (Tizedes törtként vagy törtként.)
= 0.5
= 1/2
! $\bar x = 2$, $\bar y = \frac{5}{3}$; a szorzatok összege $1$, a négyzeteké $2$.

? Ugyanerre mennyi $b$? (Törtként.)
= 2/3
! $b = \bar y - m\bar x = \frac{5}{3} - 1$

? Melyik ponton megy át mindig a regressziós egyenes?
- az origón
- az első mérési ponton
+ az átlagponton, $(\bar x; \bar y)$-on
- a legnagyobb $y$-ú ponton

? Az adatok várhatóan $y = Ae^{kx}$ alakúak. Mire illesszünk egyenest?
- az $(x; y)$ pontokra
+ az $(x; \ln y)$ pontokra
- a $(\ln x; y)$ pontokra
- az $(x; y^2)$ pontokra
```
