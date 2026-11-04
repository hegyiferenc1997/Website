---
title: A tárgyról és a számhalmazok
summary: Hogyan épül fel a félév, mi kell az aláíráshoz és a jegyhez – és a számhalmazok, amelyekkel dolgozunk.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel a **Matematika** tárgy, és hogyan kapsz **jegyet**,
- melyek a **számhalmazok** ($\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$), és mi a különbség köztük,
- melyek az alapműveletek **azonosságai** (felcserélhetőség, csoportosíthatóság, széttagolhatóság).

## A tárgy követelményei röviden

A Matematika (B-MATEMA) **évközi jeggyel** zárul, heti 2 óra előadás, 1 óra gyakorlat és 2 óra labor. A célja, hogy megkapd azokat a matematikai alapokat, amelyekre a programozás, az adatbázisok, az algoritmusok, a mesterséges intelligencia és a kriptográfia épül.

| Mi?                     | Részletek                                                                    |
| ----------------------- | ---------------------------------------------------------------------------- |
| 0. heti órák            | felzárkóztató anyag (algebra, függvények, halmazok, logika), max. **15 pluszpont** |
| ZH-k (nappali)          | **3 zárthelyi**, mindegyik az előző óta vett anyagból, összesen **100 pont**     |
| ZH-k (távoktatás)       | 2 zárthelyi, összesen 100 pont                                               |
| Aláírás                 | a 0. héten legalább **5 pont** és a ZH-kon összesen legalább **25 pont**     |
| Javítás                 | a szorgalmi időszak után 1–2 héttel javító ZH a teljes anyagból             |

A jegy a ZH-pontok és a pluszpontok összegéből:

| Pont    | Jegy             |
| ------- | ---------------- |
| 0–49    | elégtelen (1)    |
| 50–62   | elégséges (2)    |
| 63–75   | közepes (3)      |
| 76–88   | jó (4)           |
| 89–100  | jeles (5)        |

Ez a tananyag a tantárgyleírás 10 témakörét követi. Az első két témakör (és a függvények eleje) a **0. heti felzárkóztató** anyag: érdemes alaposan átvenni, mert minden későbbi témakör erre épül.

## A számhalmazok

- **Természetes számok:** $\mathbb{N} = \{0, 1, 2, 3, \dots\}$ (a magyar szokás szerint a $0$ is benne van).
- **Egész számok:** $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$.
- **Racionális számok:** a törtek, $\mathbb{Q} = \left\{ \frac{p}{q} : p, q \in \mathbb{Z},\ q \neq 0 \right\}$. Tizedes alakjuk véges vagy **szakaszos** (pl. $\frac{1}{3} = 0{,}333\ldots$).
- **Irracionális számok:** nem írhatók fel két egész hányadosaként, tizedes alakjuk végtelen és nem szakaszos, pl. $\sqrt{2}$, $\pi$, $e$.
- **Valós számok:** $\mathbb{R}$ = racionális és irracionális számok együtt, a számegyenes összes pontja.

$$
\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}
$$

Miért fontos ez informatikusként? A programozási nyelvek `int` típusa az egész számok egy **véges** részét tárolja, a `float` pedig a valós számokat csak **közelíti**: a `0.1 + 0.2` a gépen nem pontosan `0.3`.

```python run
# A lebegőpontos számok csak közelítik a valós számokat.
print(0.1 + 0.2)          # nem pontosan 0.3
print(0.1 + 0.2 == 0.3)   # False
# A törtek pontosan számolhatók a fractions modullal (racionális számok).
from fractions import Fraction
print(Fraction(1, 10) + Fraction(2, 10))   # 3/10
```

## A műveletek azonosságai

Minden $a, b, c$ valós számra:

| Azonosság              | Összeadás                       | Szorzás                               |
| ---------------------- | ------------------------------- | ------------------------------------- |
| felcserélhetőség       | $a + b = b + a$                 | $ab = ba$                             |
| csoportosíthatóság     | $(a + b) + c = a + (b + c)$     | $(ab)c = a(bc)$                       |
| semleges elem          | $a + 0 = a$                     | $a \cdot 1 = a$                       |
| ellentett / reciprok   | $a + (-a) = 0$                  | $a \cdot \frac{1}{a} = 1$, ha $a \neq 0$ |

A kettőt a **széttagolhatóság** (disztributivitás) köti össze: $a(b + c) = ab + ac$. Erre épül a zárójelfelbontás és a kiemelés is.

**Műveleti sorrend:** zárójel → hatványozás → szorzás, osztás (balról jobbra) → összeadás, kivonás (balról jobbra). Például $2 + 3 \cdot 4^2 = 2 + 3 \cdot 16 = 50$.

## Összefoglalás

- Jegy: 3 ZH (100 pont) + a 0. heti pluszpontok; az aláíráshoz 5 + 25 pont kell; 50 ponttól elégséges.
- $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$; az irracionális számok (pl. $\sqrt 2$, $\pi$) nem törtek.
- Az alapazonosságok: felcserélhetőség, csoportosíthatóság, széttagolhatóság; a műveleti sorrend: zárójel, hatvány, szorzás/osztás, összeadás/kivonás.

## A lecke feladata

```quiz required
? Hány pont kell legalább a ZH-kon összesen az aláíráshoz?
= 25
! Az aláírás két feltétele: a 0. héten 5 pont és a ZH-kon összesen 25 pont.

? Milyen jegyet kapsz 77 pontra?
- elégséges
- közepes
+ jó
- jeles
! 76–88 pont: jó.

? Melyik szám **irracionális**?
- $0{,}25$
- $\frac{22}{7}$
+ $\sqrt{3}$
- $-4$
! Az irracionális szám nem írható fel két egész szám hányadosaként.

? Mennyi $2 + 3 \cdot 4^2$?
= 50
! Előbb a hatvány, aztán a szorzás, végül az összeadás.

? Melyik azonosság a széttagolhatóság (disztributivitás)?
- $a + b = b + a$
+ $a(b + c) = ab + ac$
- $(ab)c = a(bc)$
- $a + 0 = a$
```
