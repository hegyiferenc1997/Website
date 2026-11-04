---
title: Számhalmazok és a műveletek azonosságai
summary: A természetes, egész, racionális és valós számok, és az alapműveletek azonosságai.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- melyek a **számhalmazok** ($\mathbb{N}$, $\mathbb{Z}$, $\mathbb{Q}$, $\mathbb{R}$), és mi a különbség köztük,
- melyek az alapműveletek **azonosságai** (felcserélhetőség, csoportosíthatóság, széttagolhatóság).

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

| Azonosság            | Összeadás                   | Szorzás                                  |
| -------------------- | --------------------------- | ---------------------------------------- |
| felcserélhetőség     | $a + b = b + a$             | $ab = ba$                                |
| csoportosíthatóság   | $(a + b) + c = a + (b + c)$ | $(ab)c = a(bc)$                          |
| semleges elem        | $a + 0 = a$                 | $a \cdot 1 = a$                          |
| ellentett / reciprok | $a + (-a) = 0$              | $a \cdot \frac{1}{a} = 1$, ha $a \neq 0$ |

A kettőt a **széttagolhatóság** (disztributivitás) köti össze: $a(b + c) = ab + ac$. Erre épül a zárójelfelbontás és a kiemelés is.

**Műveleti sorrend:** zárójel → hatványozás → szorzás, osztás (balról jobbra) → összeadás, kivonás (balról jobbra). Például $2 + 3 \cdot 4^2 = 2 + 3 \cdot 16 = 50$.

## Összefoglalás

- $\mathbb{N} \subset \mathbb{Z} \subset \mathbb{Q} \subset \mathbb{R}$; az irracionális számok (pl. $\sqrt 2$, $\pi$) nem törtek.
- Az alapazonosságok: felcserélhetőség, csoportosíthatóság, széttagolhatóság; a műveleti sorrend: zárójel, hatvány, szorzás/osztás, összeadás/kivonás.

## A lecke feladata

```quiz required
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
