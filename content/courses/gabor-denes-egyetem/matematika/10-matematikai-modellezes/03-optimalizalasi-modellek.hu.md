---
title: Optimalizálási modellek
summary: Szélsőérték-feladatok deriválással, a lineáris programozás felírása, a grafikus megoldás két változóval, és az optimum a csúcspontban.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- felírni egy **optimalizálási feladatot** (célfüggvény, korlátozó feltételek),
- megoldani egyváltozós feladatot **deriválással**,
- felírni és grafikusan megoldani egy **lineáris programozási** feladatot,
- miért a **csúcspontokban** kell keresni az optimumot.

## Az optimalizálási feladat részei

- **Döntési változók:** amit megválaszthatunk (pl. a gyártott mennyiségek).
- **Célfüggvény:** amit maximalizálni (nyereség) vagy minimalizálni (költség, idő, anyag) akarunk.
- **Feltételek:** a korlátok (erőforrások, kapacitás, nemnegativitás).

**Egy változó: deriválással.** Egy $100$ m kerítéssel bekerített téglalap területe $T(x) = x(50 - x)$. $T'(x) = 50 - 2x = 0$, ha $x = 25$: a legnagyobb terület a négyzeté, $625\ \mathrm{m}^2$. (Lásd a differenciálszámítás témakört.)

## Lineáris programozás

Ha a célfüggvény és minden feltétel **lineáris**, **lineáris programozási** (LP) feladatról beszélünk.

**Példa.** Egy üzem kétféle terméket gyárt. Egy darab A $2$, egy darab B $3$ ezer forint nyereséget hoz. A gépidő miatt $x + y \leq 4$, a munkaidő miatt $x + 3y \leq 6$ (órában), és $x, y \geq 0$. Maximalizáljuk $z = 2x + 3y$-t!

A feltételek a síkon egy sokszöget jelölnek ki: ez a **megengedett tartomány**. A célfüggvény **szintvonalai** ($2x + 3y = z$) párhuzamos egyenesek; addig toljuk, amíg még érintik a tartományt.

```plot
title: Lineáris programozás grafikusan
x: -0.5, 6.5
y: -0.5, 4.5
param: z = 6, 0, 14, 0.5
area: min(4 - x, (6 - x)/3) @ 0, 4 # megengedett tartomány
f: 4 - x # gépidő: x + y = 4
f: (6 - x)/3 # munkaidő: x + 3y = 6
dash: (z - 2x)/3 # szintvonal: 2x + 3y = z
point: 0, 2 # (0; 2): z = 6
point: 3, 1 # (3; 1): z = 9
point: 4, 0 # (4; 0): z = 8
```

(A satírozott rész a megengedett tartomány; a kiírt szám csak a területe.) Növeld $z$-t: a szintvonal $z = 9$-nél hagyja el utoljára a tartományt, a $(3; 1)$ csúcsban.

**Az LP alaptétele:** ha van optimum, akkor van a megengedett tartomány valamelyik **csúcspontjában** is. Ezért elég a csúcsokat végignézni:

| Csúcs    | $z = 2x + 3y$ |
| -------- | ------------- |
| $(0; 0)$ | $0$           |
| $(4; 0)$ | $8$           |
| $(3; 1)$ | $\mathbf{9}$  |
| $(0; 2)$ | $6$           |

Sok változónál (akár millió) a **szimplex-módszer** jár csúcsról csúcsra, mindig javító irányba. Az LP-t használják a gyártástervezésben, a szállítási és ütemezési feladatokban, sőt a hálózati forgalomirányításban is.

```python run
from itertools import combinations
# LP megoldása a csúcsok végignézésével: max 2x + 3y, x + y <= 4, x + 3y <= 6, x >= 0, y >= 0
# Minden feltétel a·x + b·y <= c alakban
feltetelek = [(1, 1, 4), (1, 3, 6), (-1, 0, 0), (0, -1, 0)]

def megengedett(x, y):
    return all(a * x + b * y <= c + 1e-9 for a, b, c in feltetelek)

legjobb = None
for (a1, b1, c1), (a2, b2, c2) in combinations(feltetelek, 2):
    det = a1 * b2 - a2 * b1
    if det == 0:
        continue
    x = (c1 * b2 - c2 * b1) / det   # Cramer-szabály: két egyenes metszéspontja
    y = (a1 * c2 - a2 * c1) / det
    if megengedett(x, y):
        z = 2 * x + 3 * y
        print(f"csúcs ({x:.1f}; {y:.1f}): z = {z:.1f}")
        if legjobb is None or z > legjobb[0]:
            legjobb = (z, x, y)
print("optimum:", legjobb)
```

## Összefoglalás

- Optimalizálás: döntési változók, célfüggvény, feltételek.
- Egy változó: $f'(x) = 0$ és a végpontok vizsgálata.
- LP: lineáris cél és feltételek; az optimum egy csúcsban van; két változónál grafikusan, sok változónál szimplex-módszerrel.

## A lecke feladata

```quiz required
? Mekkora a $z = 2x + 3y$ maximuma a lecke példájában ($x + y \leq 4$, $x + 3y \leq 6$, $x, y \geq 0$)?
= 9

? Melyik pontban veszi fel?
- $(4; 0)$
- $(0; 2)$
+ $(3; 1)$
- $(2; 2)$

? Ugyanezekkel a feltételekkel mekkora a $z = 3x + 2y$ maximuma?
= 12
! Nézd végig a csúcsokat: $(4; 0)$-ban $12$, $(3; 1)$-ben $11$.

? Hol van egy (korlátos megengedett tartományú) lineáris programozási feladat optimuma?
- mindig a tartomány közepén
+ (legalább) egy csúcspontban
- ahol a célfüggvény deriváltja nulla
- mindig az origóban

? Egy $100$ m kerítéssel bekerített téglalap alakú terület legfeljebb hány négyzetméter lehet?
= 625
```
