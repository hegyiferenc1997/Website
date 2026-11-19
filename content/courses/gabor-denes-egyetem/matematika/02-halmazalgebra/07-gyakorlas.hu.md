---
title: Gyakorlás – halmazalgebra
summary: Ellenőrző kérdések és összefoglaló feladatlap a halmazokhoz, a szitaformulához és az eseményalgebrához.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség az ∈ és a ⊆ jel között?</summary>

Az $\in$ elem és halmaz kapcsolata ($2 \in \{1, 2\}$), a $\subseteq$ két halmazé ($\{2\} \subseteq \{1, 2\}$). A $2 \subseteq \{1,2\}$ és az $\{2\} \in \{1, 2\}$ is értelmetlen, illetve hamis.

</details>

<details>
<summary>2. Hogyan bizonyítjuk, hogy két halmaz egyenlő?</summary>

Kétirányú tartalmazással ($A \subseteq B$ és $B \subseteq A$), vagy tartalmazási táblával: ha minden lehetséges esetben (az elem benne van / nincs benne az egyes halmazokban) a két oldal ugyanazt adja.

</details>

<details>
<summary>3. Miért kell kivonni a metszetet a szitaformulában?</summary>

Mert $\lvert A \rvert + \lvert B \rvert$-ben a mindkét halmazban lévő elemek kétszer szerepelnek; egyszer le kell vonni őket.

</details>

<details>
<summary>4. Mit jelent az ellentett esemény, és mire jó?</summary>

$\overline{A}$ akkor következik be, ha $A$ nem. Mivel $P(\overline{A}) = 1 - P(A)$, a „legalább egy” típusú kérdéseknél sokszor egyszerűbb az ellentett eseményt („egy sem”) kiszámolni.

</details>

## Összefoglaló feladatlap

```quiz required
? $U = \{1, \dots, 12\}$, $A$ = a páros számok, $B$ = a $3$ többszörösei. Hány eleme van $\overline{A \cup B}$-nek?
= 4
! $\{1, 5, 7, 11\}$

? Ugyanitt hány eleme van $A \triangle B$-nek?
= 6
! $\lvert A \rvert = 6$, $\lvert B \rvert = 4$, $\lvert A \cap B \rvert = 2$.

? Töltsd ki a tartalmazási táblát: $Y = \overline{A} \cap (B \cup C)$.
table: A, B, C -> Y = A'·(B + C)

? Hány részhalmaza van $\{a, b, c, d\}$-nek, amely tartalmazza az $a$ elemet?
= 8
! A többi három elemről szabadon döntünk: $2^3$.

? 1-től 100-ig hány szám **nem** osztható sem $2$-vel, sem $5$-tel?
= 40
! $100 - (50 + 20 - 10)$

? Három pénzérmét feldobunk. Mennyi a valószínűsége, hogy legalább egy fej lesz? (Törtként vagy tizedes törtként.)
= 7/8
! Az ellentett: mindhárom írás, $\frac{1}{8}$.

? Melyik reláció **nem** tranzitív?
- „kisebb, mint” a valós számokon
- „osztója” a pozitív egészeken
+ „merőleges” a sík egyenesein
- „részhalmaza” a halmazokon
! Ha $a \perp b$ és $b \perp c$, akkor $a \parallel c$.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Szimmetrikus differencia.** Írd meg a `szim_diff(A, B)` függvényt, amely visszaadja azokat az elemeket, amelyek pontosan az egyik halmazban vannak benne! Ne használd a `^` operátort – építsd fel unióból, metszetből és különbségből.

```python starter
def szim_diff(A, B):
    return A | B
```

<details>
<summary>Megoldás</summary>

Ugyanez másképp: $(A \setminus B) \cup (B \setminus A)$.

```python solution
def szim_diff(A, B):
    return (A | B) - (A & B)              # az unióból kivesszük a közös részt
```

</details>

```python test
assert szim_diff({1, 2, 3}, {2, 3, 4}) == {1, 4}
assert szim_diff({1, 2}, {3}) == {1, 2, 3}
assert szim_diff({5}, {5}) == set()
assert szim_diff(set(), {7}) == {7}
print("Minden ellenőrzés sikeres!")
```

**2.** **Logikai szita.** Írd meg az `oszthato_db(n, a, b)` függvényt, amely megadja, hány szám osztható 1 és `n` között `a`-val **vagy** `b`-vel – ciklus nélkül, a szitaformulával! (Tipp: `math.lcm`, és `n // a` a többszörösök száma.)

```python starter
def oszthato_db(n, a, b):
    return n // a + n // b
```

<details>
<summary>Megoldás</summary>

A $4$ és a $6$ közös többszörösei a $12$ többszörösei (nem a $24$-é!) – ezért kell az lkkt.

```python solution
import math

def oszthato_db(n, a, b):
    # |A ∪ B| = |A| + |B| − |A ∩ B|; a közös többszörösök az lkkt többszörösei
    return n // a + n // b - n // math.lcm(a, b)
```

</details>

```python test
assert oszthato_db(100, 2, 3) == 67
assert oszthato_db(1000, 3, 5) == 467
assert oszthato_db(100, 4, 6) == 33
assert oszthato_db(10, 2, 2) == 5
print("Minden ellenőrzés sikeres!")
```

**3.** **Descartes-szorzat.** Írd meg a `descartes(A, B)` függvényt, amely visszaadja az összes `(a, b)` párt, ahol `a` az `A`-ból, `b` a `B`-ből való, halmazként!

```python starter
def descartes(A, B):
    return set()
```

<details>
<summary>Megoldás</summary>

$|A \times B| = |A| \cdot |B|$ – ezért 20 pár van a második tesztben.

```python solution
def descartes(A, B):
    return {(a, b) for a in A for b in B}  # minden a-t minden b-vel párosítunk
```

</details>

```python test
assert descartes({1, 2}, {"x", "y"}) == {(1, "x"), (1, "y"), (2, "x"), (2, "y")}
assert len(descartes(set(range(4)), set(range(5)))) == 20
assert descartes({1}, set()) == set()
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? $|A| = 12$, $|B| = 9$, $|A \cap B| = 4$. Mennyi $|A \cup B|$?
= 17
! $12 + 9 - 4 = 17$.

? Hány részhalmaza van egy 5 elemű halmaznak?
= 32
! $2^5 = 32$.

? Melyik egyenlő $\overline{A \cup B}$-vel (De Morgan)?
- $\overline{A} \cup \overline{B}$
+ $\overline{A} \cap \overline{B}$
- $A \cap B$
- $\overline{A \cap B}$
! Ami nincs benne az unióban, az egyikben sincs benne.

? $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5\}$. Hány elemű $A \setminus B$?
= 2
! $A \setminus B = \{1, 2\}$.

? Egy 30 fős csoportban 18-an tanulnak angolt, 12-en németet, 5-en mindkettőt. Hányan nem tanulnak egyiket sem?
= 5
! $30 - (18 + 12 - 5) = 5$.
```
