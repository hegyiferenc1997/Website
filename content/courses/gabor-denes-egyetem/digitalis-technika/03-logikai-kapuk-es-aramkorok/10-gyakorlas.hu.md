---
title: Gyakorlás – logikai kapuk és Boole-algebra
summary: Ellenőrző kérdések és összefoglaló feladatlap: igazságtáblák, De Morgan, algebrai egyszerűsítés, univerzális kapuk, logikai családok.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért van két változóra pontosan 16 logikai függvény?</summary>

Mert a 4 bemeneti kombináció mindegyikéhez 0 vagy 1 tartozhat, így 2<sup>4</sup> = 16 különböző kimeneti oszlop létezik.

</details>

<details>
<summary>2. Mikor hamis az A → B implikáció, és mi a kifejezése?</summary>

Csak akkor, ha A = 1 és B = 0. Kifejezése: A̅ + B.

</details>

<details>
<summary>3. Mi a különbség egy kifejezés duálisa és negáltja között?</summary>

A duálisban a · és + jeleket és a 0, 1 konstansokat cseréljük, a változókhoz nem nyúlunk. A negáltban (De Morgan) ezen felül minden változót is negálunk. Pl. A + B duálisa A·B, negáltja A̅·B̅.

</details>

<details>
<summary>4. Miért felesleges a BC tag az AB + A̅C + BC kifejezésben?</summary>

Mert ha B = C = 1, akkor A = 1 esetén az AB, A = 0 esetén az A̅C tag már 1, így a BC tag soha nem változtat a kimeneten (konszenzus).

</details>

<details>
<summary>5. Hogyan lesz egy ÉS–VAGY hálózatból NAND–NAND hálózat?</summary>

Minden kaput NAND-ra cserélünk, a bekötés változatlan marad (kettős negálás + De Morgan). Egy közvetlenül a VAGY kapura menő változót negálva kell bekötni.

</details>

<details>
<summary>6. Miért nem szabad két totem-pole kimenetet összekötni?</summary>

Mert ha az egyik 1-et, a másik 0-t hajt, a két kimeneti tranzisztoron át rövidzár alakul ki a táp és a föld között, ami tönkreteheti az IC-ket.

</details>

## Összefoglaló feladatlap

```quiz required
? Töltsd ki: Y = (A ⊕ B)·C és Z = A·B + C
table: A, B, C -> Y = (A⊕B)·C; Z = A·B + C
! Számold ki soronként előbb A ⊕ B-t és A·B-t.

? Egyszerűsítsd: F = A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
expr: A, B, C -> C'
limit: 1
same: A'·B'·C' + A'·B·C' + A·B'·C' + A·B·C'
! Emeld ki C̅-t.

? Egyszerűsítsd: F = A'·B + A·B' + A·B
expr: A, B -> A + B
limit: 2
same: A'·B + A·B' + A·B
! Az A·B tagot kétszer is felhasználhatod.

? Egyszerűsítsd: F = A·B + B·C + B'·C
expr: A, B, C -> A·B + C
limit: 3
same: A·B + B·C + B'·C
! B·C + B̅·C = C.

? Egyszerűsítsd: F = X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
expr: X, Y, Z -> X·Y + X·Z + Y·Z
limit: 6
same: X·Y'·Z + X·Y·Z' + X·Y·Z + X'·Y·Z
! Az XYZ tagot mindhárom szomszédjával összevonhatod.

? Alakítsd át úgy, hogy negálás csak a változókon legyen: ((A + B)'·C)'
expr: A, B, C -> A + B + C'
same: ((A + B)'·C)'
! Törd meg a vonalat kétszer.

? Hány kétbemenetű NOR kapu kell egy NAND kapu megépítéséhez?
= 4
! ÉS = 3 NOR, utána még egy NOR-inverter.

? Melyik logikai család fogyaszt nyugalomban szinte semmit?
- TTL
+ CMOS
- mindkettő ugyanannyit
! A komplementer tranzisztorpár közül nyugalomban mindig az egyik zárva van.

? Az A ⊙ B (XNOR) melyik alakja helyes?
- A·B' + A'·B
+ A·B + A'·B'
- (A + B)·(A' + B')
- A' + B
! XNOR: akkor 1, ha a két bemenet egyezik.
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Igazságtábla programmal.** Írd meg az `igazsagtabla(f, n)` függvényt, amely egy n változós logikai függvény (Python-függvény, 0/1 bemenetekkel) kimeneteinek listáját adja vissza a 00…0 sortól az 11…1 sorig!

```python starter
def igazsagtabla(f, n):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
from itertools import product

def igazsagtabla(f, n):
    # a product a bemeneteket pont az igazságtábla sorrendjében adja
    return [f(*sor) for sor in product([0, 1], repeat=n)]
```

</details>

```python test
assert igazsagtabla(lambda a, b: a & b, 2) == [0, 0, 0, 1]
assert igazsagtabla(lambda a, b: 1 - (a & b), 2) == [1, 1, 1, 0]
assert igazsagtabla(lambda a, b, c: a ^ b ^ c, 3) == [0, 1, 1, 0, 1, 0, 0, 1]
print("Minden ellenőrzés sikeres!")
```

**2.** **Mintermek.** Írd meg a `mintermek(f, n)` függvényt, amely visszaadja azoknak a soroknak a sorszámát (0-tól), ahol a függvény értéke 1! (Ez a függvény Σm alakja.)

```python starter
def mintermek(f, n):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
from itertools import product

def mintermek(f, n):
    return [i for i, sor in enumerate(product([0, 1], repeat=n)) if f(*sor)]
```

</details>

```python test
assert mintermek(lambda a, b: a | b, 2) == [1, 2, 3]
assert mintermek(lambda a, b, c: (a & b) | c, 3) == [1, 3, 5, 6, 7]
assert mintermek(lambda a, b: 0, 2) == []
print("Minden ellenőrzés sikeres!")
```

**3.** **De Morgan ellenőrzése.** Írd meg az `egyenerteku(f, g, n)` függvényt, amely igazat ad, ha a két n változós függvény minden bemenetre ugyanazt adja!

```python starter
def egyenerteku(f, g, n):
    return True
```

<details>
<summary>Megoldás</summary>

Az utolsó sor a leggyakoribb tévedés: az ÉS negáltja nem a negáltak ÉS-e, hanem a negáltak VAGY-a.

```python solution
from itertools import product

def egyenerteku(f, g, n):
    return all(f(*sor) == g(*sor) for sor in product([0, 1], repeat=n))
```

</details>

```python test
NEM = lambda x: 1 - x
assert egyenerteku(lambda a, b: NEM(a & b), lambda a, b: NEM(a) | NEM(b), 2)      # De Morgan
assert egyenerteku(lambda a, b: a | (a & b), lambda a, b: a, 2)                  # elnyelés
assert not egyenerteku(lambda a, b: NEM(a & b), lambda a, b: NEM(a) & NEM(b), 2) # gyakori hiba!
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mivel egyenlő A + A̅·B?
- A
+ A + B
- A̅ + B
- B
! Disztributív szabály: A + A̅B = (A + A̅)(A + B) = A + B.

? Hány különböző kétváltozós logikai függvény létezik?
= 16
! A 4 sor kimenete 2^4 = 16-féle lehet.

? Hány CMOS tranzisztorból áll egy kétbemenetű NAND kapu?
= 4
! 2 párhuzamos p és 2 soros n csatornás tranzisztor.

? Mi a VAGY kapu duálisa?
+ az ÉS kapu
- a NOR kapu
- a XOR kapu
! A dualitás felcseréli a + és · műveletet, valamint a 0 és 1 konstanst.

? Egy 74HC00 NAND kapu késleltetése 8 ns. Mekkora egy 4 NAND-ból épített XOR legrosszabb késleltetése (ns)?
= 24
! A leghosszabb út 3 kapuszinten megy át.
```
