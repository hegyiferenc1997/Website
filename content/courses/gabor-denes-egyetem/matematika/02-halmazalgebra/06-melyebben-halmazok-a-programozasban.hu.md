---
title: Mélyebben – halmazok a programozásban és a valószínűségben
summary: Halmazműveletek és a De Morgan-azonosságok Pythonban, a szitaformula ellenőrzése 1000 számon, minden részhalmaz felsorolása bitmaszkkal (miért 2^n darab), és az eseményalgebra kipróbálása százezer szimulált kockadobással.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan **számolsz halmazokkal** egy programban, és hogyan ellenőrizheted géppel a De Morgan-azonosságokat,
- a **szitaformulát** (logikai szita) három halmazra, és hogy miért ad pontos eredményt,
- miért van egy $n$ elemű halmaznak **$2^n$ részhalmaza**, és hogyan sorolja fel őket egy program **bitmaszkkal**,
- hogyan **ellenőrizheted szimulációval** az eseményalgebra képleteit.

## 1. Halmazműveletek kódban

A Python `set` típusa pontosan a matematikai halmaz: nincs benne ismétlődés, nincs sorrend, és a műveletek jele is hasonló: `&` metszet, `|` unió, `-` különbség, `^` szimmetrikus különbség.

```python run
# Halmazműveletek Pythonban és a De Morgan-azonosságok ellenőrzése
U = set(range(1, 21))                    # alaphalmaz: 1…20
A = {x for x in U if x % 2 == 0}         # páros számok
B = {x for x in U if x % 3 == 0}         # 3-mal oszthatók

print("A ∩ B =", sorted(A & B))
print("A ∪ B elemszáma:", len(A | B))
print("A \\ B =", sorted(A - B))
print("A Δ B (szimmetrikus különbség) =", sorted(A ^ B))

# De Morgan: (A ∪ B)' = A' ∩ B'  és  (A ∩ B)' = A' ∪ B'
komp = lambda X: U - X
print("(A ∪ B)' = A' ∩ B' ?", komp(A | B) == komp(A) & komp(B))
print("(A ∩ B)' = A' ∪ B' ?", komp(A & B) == komp(A) | komp(B))
```

Legyen az alaphalmaz $U = \{1, 2, \ldots, 20\}$, $A$ a páros, $B$ a 3-mal osztható számok halmaza. Ekkor $A \cap B$ a 6-tal oszthatók halmaza, és a gép mindkét De Morgan-azonosságra igazat ad:

$$
\overline{A \cup B} = \overline{A} \cap \overline{B}, \qquad \overline{A \cap B} = \overline{A} \cup \overline{B}.
$$

Fontos: ez **egy példa**, nem bizonyítás! Egy azonosságot az bizonyít, ha **minden** halmazra igaz – ezt a halmazok elemenkénti vizsgálatával (vagy Venn-diagrammal, a 8 lehetséges tartomány végiggondolásával) lehet megmutatni. A gép viszont kiválóan alkalmas **cáfolásra**: ha egy állítólagos azonosság egy példán is elbukik, akkor hamis.

## 2. A szitaformula

Hány szám osztható 1 és 1000 között 2-vel, 3-mal **vagy** 5-tel? Ha egyszerűen összeadnánk a három halmaz elemszámát, a több halmazba is tartozó számokat többször számolnánk. A **szitaformula** ezt javítja:

$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|.
$$

```python run
# Szitaformula: |A ∪ B ∪ C| = |A| + |B| + |C| − |A∩B| − |A∩C| − |B∩C| + |A∩B∩C|
U = range(1, 1001)
A = {x for x in U if x % 2 == 0}
B = {x for x in U if x % 3 == 0}
C = {x for x in U if x % 5 == 0}

szita = (len(A) + len(B) + len(C) - len(A & B) - len(A & C) - len(B & C) + len(A & B & C))
print("szitaformulával:", szita)
print("közvetlenül számolva:", len(A | B | C))
print("se 2-vel, se 3-mal, se 5-tel nem osztható 1…1000 között:", 1000 - szita)
```

Papíron: $|A| = 500$, $|B| = 333$, $|C| = 200$, a páronkénti metszetek $166$ (6-tal), $100$ (10-zel), $66$ (15-tel), a hármas metszet $33$ (30-cal). Így $500 + 333 + 200 - 166 - 100 - 66 + 33 = 734$ – egyezik a gép közvetlen számolásával.

Miért kell a végén **hozzáadni** a hármas metszetet? A 30 például benne van mindhárom halmazban: háromszor számoltuk hozzá, aztán háromszor vontuk le (mindhárom páros metszetben benne van), így nullaszor szerepelne – ezért kell még egyszer hozzáadni. Ugyanez az elv adja a valószínűségszámításban a $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ képletet.

## 3. Minden részhalmaz: a bitmaszk

Egy $n$ elemű halmaz részhalmazainál minden elemről eldöntjük: **benne van, vagy nincs**. Ez $n$ darab igen/nem döntés, vagyis $n$ bit – és $n$ bitből $2^n$ különböző szám rakható ki. Ezért a hatványhalmaz elemszáma $|\mathcal{P}(H)| = 2^n$.

```python run
# Részhalmazok bitmaszkkal: egy n elemű halmaz minden részhalmaza egy n bites szám
elemek = ["alma", "körte", "szilva"]
n = len(elemek)
for maszk in range(2 ** n):                       # 0 … 2^n − 1
    resz = [elemek[i] for i in range(n) if maszk >> i & 1]   # az i. bit: benne van-e az i. elem
    print(f"{maszk:0{n}b} → {resz}")
print(f"összesen {2 ** n} részhalmaz")
```

A `101` maszk például azt jelenti: a 0. elem (alma) benne van, az 1. (körte) nincs, a 2. (szilva) benne van. A programozásban ez nagyon gyakori technika: jogosultságok (olvasás/írás/végrehajtás = 3 bit), beállítások, vagy „próbáljuk ki az összes kombinációt” típusú keresések. De vigyázz: $2^n$ nagyon gyorsan nő – 30 elemnél már **több mint egymilliárd** részhalmaz van.

## 4. Eseményalgebra szimulációval

A valószínűségszámításban az **események** halmazok: két kockadobásnál az alaphalmaz a 36 lehetséges $(d_1, d_2)$ pár. Legyen $A$ = „az első dobás 6-os”, $B$ = „az összeg legalább 10”. Dobjunk százezerszer, és számoljuk meg, milyen gyakran teljesülnek!

```python run
# Eseményalgebra szimulációval: két kockadobás, A = "az első 6-os", B = "az összeg legalább 10"
import random

r = random.Random(42)
N = 100_000
a_db = b_db = ab_db = aub_db = 0
for _ in range(N):
    d1, d2 = r.randint(1, 6), r.randint(1, 6)
    a, b = d1 == 6, d1 + d2 >= 10
    a_db += a
    b_db += b
    ab_db += a and b
    aub_db += a or b

print(f"P(A) ≈ {a_db / N:.3f}   (pontosan 6/36 = {6 / 36:.3f})")
print(f"P(B) ≈ {b_db / N:.3f}   (pontosan 6/36 = {6 / 36:.3f})")
print(f"P(A ∩ B) ≈ {ab_db / N:.3f}   (pontosan 3/36 = {3 / 36:.3f})")
print(f"P(A ∪ B) ≈ {aub_db / N:.3f}   (képlettel: P(A) + P(B) − P(A∩B) = {9 / 36:.3f})")
```

A szimulált relatív gyakoriságok nagyon közel vannak a pontos értékekhez, és a $P(A \cup B) = P(A) + P(B) - P(A \cap B)$ képlet is „kijön”: $\frac{6}{36} + \frac{6}{36} - \frac{3}{36} = \frac{9}{36} = 0{,}25$. Ez a szimuláció a valószínűségszámítás egyik legfontosabb gyakorlati eszköze (Monte-Carlo-módszer): ha egy feladat képlettel nehéz, sokszor el lehet „játszani” géppel.

## Összefoglalás

- Python `set`: `&` metszet, `|` unió, `-` különbség, `^` szimmetrikus különbség; egy példa nem bizonyít azonosságot, de cáfolni tud.
- Szitaformula: összeadjuk az egyes halmazokat, levonjuk a páros metszeteket, hozzáadjuk a hármas metszetet.
- $n$ elemű halmaznak $2^n$ részhalmaza van; egy részhalmaz egy $n$ bites maszk.
- Események = halmazok; $P(A \cup B) = P(A) + P(B) - P(A \cap B)$, szimulációval is ellenőrizhető.

## A lecke feladata

```quiz required
? Egy 40 fős évfolyamon 25-en tanulnak angolt, 18-an németet, és 8-an mindkettőt. Hányan nem tanulnak egyiket sem?
= 5
! $|A \cup N| = 25 + 18 - 8 = 35$, tehát $40 - 35 = 5$.

? Hány részhalmaza van egy 6 elemű halmaznak?
= 64
! $2^6 = 64$

? Az $\{a, b, c, d\}$ halmaz részhalmazait 4 bites maszkkal írjuk le (a 0. bit az $a$, …, a 3. bit a $d$). Melyik részhalmazt jelöli az $1010$ maszk (balról a 3. bit)?
- $\{a, c\}$
+ $\{b, d\}$
- $\{a, b\}$
- $\{c, d\}$
! A 3. és az 1. bit 1: a $d$ és a $b$ elem.

? Hány szám osztható 1 és 100 között 2-vel vagy 5-tel?
= 60
! $50 + 20 - 10 = 60$

? $P(A) = 0{,}5$, $P(B) = 0{,}4$, $P(A \cap B) = 0{,}2$. Mennyi $P(A \cup B)$?
= 0.7
= 0,7
! $0{,}5 + 0{,}4 - 0{,}2 = 0{,}7$
```
