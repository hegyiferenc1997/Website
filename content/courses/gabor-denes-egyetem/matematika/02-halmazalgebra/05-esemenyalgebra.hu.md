---
title: Eseményalgebra
summary: Kísérlet, eseménytér, események és műveleteik – a halmazalgebra a valószínűségszámításban.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **véletlen kísérlet**, az **elemi esemény** és az **eseménytér**,
- hogyan felelnek meg az **események műveletei** a halmazműveleteknek,
- mit jelent, hogy két esemény **kizárja egymást**, és mi a **teljes eseményrendszer**,
- a **klasszikus valószínűség** képletét.

## Alapfogalmak

Egy **véletlen kísérlet** (pl. kockadobás) lehetséges kimenetelei az **elemi események**; ezek halmaza az **eseménytér**, $\Omega$. Kockadobásnál $\Omega = \{1, 2, 3, 4, 5, 6\}$.

Az **esemény** az $\Omega$ egy részhalmaza: $A$ = „párosat dobunk” $= \{2, 4, 6\}$. Az esemény **bekövetkezik**, ha a kísérlet kimenetele eleme.

- **Biztos esemény:** $\Omega$ (mindig bekövetkezik).
- **Lehetetlen esemény:** $\emptyset$ (soha).

## Műveletek eseményekkel

| Esemény                        | Jelölés                   | Halmazművelet   |
| ------------------------------ | ------------------------- | --------------- |
| $A$ **vagy** $B$ (összeg)      | $A + B$ vagy $A \cup B$   | unió            |
| $A$ **és** $B$ (szorzat)       | $AB$ vagy $A \cap B$      | metszet         |
| $A$, de **nem** $B$            | $A - B$                   | különbség       |
| **nem** $A$ (ellentett)        | $\overline{A}$            | komplementer    |

Az $A$ és $B$ **kizárja egymást**, ha $AB = \emptyset$ (nem következhetnek be egyszerre). Az $A_1, \dots, A_n$ események **teljes eseményrendszert** alkotnak, ha páronként kizárják egymást, és összegük $\Omega$ – mindig pontosan egy következik be közülük.

A De Morgan-azonosságok itt is érvényesek: „nem igaz, hogy $A$ vagy $B$” = „nem $A$ és nem $B$”: $\overline{A + B} = \overline{A}\,\overline{B}$.

## Klasszikus valószínűség

Ha $\Omega$ véges, és minden elemi esemény **egyformán valószínű**, akkor

$$
P(A) = \frac{\lvert A \rvert}{\lvert \Omega \rvert} = \frac{\text{kedvező esetek}}{\text{összes eset}}.
$$

Következmények: $P(\overline{A}) = 1 - P(A)$, és a szitaformulából $P(A + B) = P(A) + P(B) - P(AB)$.

**Példa.** Két kockával dobunk. $\lvert\Omega\rvert = 36$. Annak a valószínűsége, hogy **legalább egy hatos** van: az ellentett esemény „egyik sem hatos”, ennek $5 \cdot 5 = 25$ kimenetele van, tehát $P = 1 - \frac{25}{36} = \frac{11}{36}$.

```python run
import random
from itertools import product

# Pontos érték: az összes kimenetel felsorolásával.
omega = list(product(range(1, 7), repeat=2))
kedvezo = [d for d in omega if 6 in d]
print(len(kedvezo), "/", len(omega), "=", len(kedvezo) / len(omega))

# Szimulációval: sok dobás után a relatív gyakoriság a valószínűség körül ingadozik.
random.seed(1)
n = 100_000
talalat = sum(1 for _ in range(n) if 6 in (random.randint(1, 6), random.randint(1, 6)))
print("szimuláció:", talalat / n)
```

## Összefoglalás

- Eseménytér $\Omega$ = az elemi események halmaza; esemény = $\Omega$ részhalmaza.
- „vagy” = unió, „és” = metszet, „nem” = komplementer; kizáró események: $AB = \emptyset$.
- Klasszikus valószínűség: kedvező / összes; $P(\overline{A}) = 1 - P(A)$.

## A lecke feladata

```quiz required
? Kockadobásnál $A$ = „párosat dobunk”, $B$ = „3-nál nagyobbat dobunk”. Hány elemi eseményből áll $AB$?
= 2
! $AB = \{4, 6\}$

? Ugyanitt hány elemi eseményből áll $A + B$?
= 4
! $\{2, 4, 5, 6\}$

? Ugyanitt mi az $\overline{A + B}$ esemény (sorold fel az elemeit vesszővel)?
= 1,3
= 1, 3
= 3,1
! De Morgan: nem páros **és** nem nagyobb 3-nál.

? Mennyi a valószínűsége, hogy két kockával dobott számok összege $7$? (Törtként vagy tizedes törtként.)
= 1/6
! A kedvező esetek: $(1,6), (2,5), \dots, (6,1)$.

? Melyik pár alkot **teljes eseményrendszert** kockadobásnál?
- „párosat dobunk” és „6-ost dobunk”
+ „párosat dobunk” és „páratlant dobunk”
- „3-nál kisebbet dobunk” és „3-nál nagyobbat dobunk”
- „1-est dobunk” és „2-est dobunk”
! Kizárják egymást, és együtt kiadják $\Omega$-t.
```
