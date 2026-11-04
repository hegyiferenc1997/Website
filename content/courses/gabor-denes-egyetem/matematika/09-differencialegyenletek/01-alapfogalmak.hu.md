---
title: A differenciálegyenlet fogalma
summary: Mi a differenciálegyenlet, mi a rendje és a megoldása, általános és partikuláris megoldás, kezdetiérték-probléma.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **differenciálegyenlet**, és miért ezzel írjuk le a változó folyamatokat,
- mi a **rend**, és mikor **megoldás** egy függvény,
- mi az **általános** és a **partikuláris** megoldás,
- mi a **kezdetiérték-probléma**.

## Miért differenciálegyenlet?

Sok folyamatnál nem a mennyiséget, hanem a **változásának sebességét** ismerjük. Például egy baktériumtenyészet annál gyorsabban nő, minél több baktérium van: $y'(t) = k \cdot y(t)$. Egy ilyen egyenletet, amelyben az ismeretlen egy **függvény**, és szerepelnek a deriváltjai is, **differenciálegyenletnek** nevezünk.

- A **rend** a legmagasabb előforduló derivált rendje: $y' = ky$ elsőrendű, $y'' + y = 0$ másodrendű.
- Egy $y(x)$ függvény **megoldás**, ha behelyettesítve azonosságot kapunk.

**Példa.** Megoldása-e $y = e^{3x}$ az $y' = 3y$ egyenletnek? $y' = 3e^{3x} = 3y$. ✓ Ugyanígy $y = 5e^{3x}$ is, sőt minden $y = Ce^{3x}$.

## Általános és partikuláris megoldás

Az **általános megoldás** az összes megoldást tartalmazza; egy $n$-edrendű egyenletnél ebben (általában) $n$ tetszőleges állandó van. Az $y' = ky$ általános megoldása $y = Ce^{kx}$. Egy konkrét $C$-hez tartozó megoldás **partikuláris** megoldás.

A **kezdetiérték-probléma** (Cauchy-feladat) a kezdeti állapotot is megadja, pl. $y(0) = y_0$. Ebből az állandó meghatározható: $y(0) = C e^0 = C$, tehát $C = y_0$. (Elég szép egyenletnél a megoldás ekkor **egyértelmű**.)

```plot
title: Az y' = k·y megoldásai: y = C·e^(kx)
x: -3, 3
y: -6, 6
param: C = 1, -3, 3, 0.1
param: k = 0.5, -2, 2, 0.1
f: C e^(k x) # a kiválasztott megoldás
dash: e^(k x) # C = 1
dash: -e^(k x) # C = −1
point: 0, C # kezdeti érték: y(0) = C
tangent: C e^(k x) @ 0
```

A $C$ csúszkával a megoldásgörbék „családján” mozogsz; a kezdeti érték kiválasztja, melyikről van szó. Figyeld meg az érintőt: meredeksége az $x = 0$ pontban épp $k \cdot C$, ahogy az egyenlet előírja.

## Mire jó?

| Folyamat                  | Egyenlet            | Jelentés                                   |
| ------------------------- | ------------------- | ------------------------------------------ |
| szaporodás, kamatos kamat | $y' = ky$, $k > 0$  | a növekedés arányos a mennyiséggel         |
| radioaktív bomlás         | $y' = -\lambda y$   | a bomlás arányos a még meglévő anyaggal    |
| Newton-féle hűlés         | $T' = -k(T - T_k)$  | a hűlés arányos a hőmérséklet-különbséggel |
| rugó, rezgőkör            | $y'' = -\omega^2 y$ | a visszatérítő erő arányos a kitéréssel    |
| szabadesés                | $y'' = -g$          | állandó gyorsulás                          |

## Összefoglalás

- Differenciálegyenlet: az ismeretlen egy függvény, és a deriváltjai is szerepelnek; a rend a legmagasabb deriváltrend.
- Általános megoldás: $n$ szabad állandó; kezdeti feltétellel ezek meghatározhatók.
- $y' = ky$ megoldása $y = y_0 e^{kx}$.

## A lecke feladata

```quiz required
? Hányadrendű az $y''' - 2y' + y = \sin x$ differenciálegyenlet?
= 3

? Melyik függvény megoldása az $y'' + 9y = 0$ egyenletnek?
- $y = e^{3x}$
+ $y = \cos(3x)$
- $y = \sin(9x)$
- $y = x^3$
! $(\cos 3x)'' = -9\cos 3x$.

? Oldd meg a kezdetiérték-problémát: $y' = 3y$, $y(0) = 2$.
fn: x -> 2 e^(3x)
domain: -1, 1

? Oldd meg: $y' = -0.5\,y$, $y(0) = 10$.
fn: x -> 10 e^(-0.5x)

? Hány szabad állandó van egy másodrendű differenciálegyenlet általános megoldásában (általában)?
= 2

? Az $y' = ky$ egyenlet egy megoldásának értéke $y(0) = 4$, és ott az érintő meredeksége $2$. Mennyi $k$? (Tizedes törtként vagy törtként.)
= 0.5
= 1/2
! $y'(0) = k \cdot y(0)$.
```
