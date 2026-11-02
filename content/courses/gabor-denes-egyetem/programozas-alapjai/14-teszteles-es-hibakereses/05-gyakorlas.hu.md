---
title: Gyakorlás – tesztelés és hibakeresés
summary: Ellenőrző kérdések, tesztek írása és hibás kódok kijavítása.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

**1. Sorold fel a tesztelés szintjeit!**

<details>
<summary>Válasz</summary>

Egységteszt, integrációs teszt, rendszerteszt, elfogadási teszt.

</details>

**2. Milyen teszteseteket írnál egy `maximum(lista)` függvényhez?**

<details>
<summary>Válasz</summary>

Normál: `[3, 7, 2]` → 7. Határesetek: egyelemű lista, a maximum az első / utolsó helyen, negatív számok (`[-5, -2]` → −2), ismétlődő maximum. Hibás eset: üres lista → kivétel.

</details>

**3. Mi a különbség a Step Over és a Step Into között a debuggerben?**

<details>
<summary>Válasz</summary>

A Step Over végrehajtja az aktuális sort, és a függvényhívásba nem lép be; a Step Into belép a meghívott függvénybe.

</details>

**4. Mi a regressziós teszt?**

<details>
<summary>Válasz</summary>

Olyan teszt, amely azt ellenőrzi, hogy egy módosítás nem rontott-e el egy korábban működő funkciót – például minden kijavított hibára írt teszt.

</details>

**5. Mit jelent a TDD három lépése?**

<details>
<summary>Válasz</summary>

Piros: elbukó teszt írása. Zöld: a legegyszerűbb kód, amitől átmegy. Refaktorálás: a kód szépítése a tesztek védelmében.

</details>

## Feladatok

### 1. feladat: Keresd meg a hibát!

A függvény egy lista **második legnagyobb** különböző elemét adná vissza, de hibás. Teszteld határesetekkel, és javítsd ki!

```python starter
def masodik_legnagyobb(lista):
    rendezett = sorted(lista)
    return rendezett[-2]
```

<details>
<summary>Tipp</summary>

Mi történik a `[5, 5, 3]` listával? A második legnagyobb *különböző* elem a 3.

</details>

<details>
<summary>Megoldás</summary>

```python solution
def masodik_legnagyobb(lista):
    kulonbozo = sorted(set(lista))
    if len(kulonbozo) < 2:
        raise ValueError("Legalább két különböző elem kell.")
    return kulonbozo[-2]
```

</details>

```python test
assert masodik_legnagyobb([3, 9, 7]) == 7
assert masodik_legnagyobb([5, 5, 3]) == 3
assert masodik_legnagyobb([-1, -4]) == -4
try:
    masodik_legnagyobb([2, 2])
    assert False, "ValueError kellett volna"
except ValueError:
    pass
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Off-by-one

A függvény az 1-től n-ig terjedő számok összegét adná, de rossz eredményt ad. Javítsd ki!

```python starter
def osszeg_n_ig(n):
    s = 0
    for i in range(1, n):
        s += i
    return s
```

<details>
<summary>Megoldás</summary>

```python solution
def osszeg_n_ig(n):
    s = 0
    for i in range(1, n + 1):   # a range felső határa nincs benne!
        s += i
    return s
```

</details>

```python test
assert osszeg_n_ig(1) == 1
assert osszeg_n_ig(10) == 55
assert osszeg_n_ig(0) == 0
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Írj teszteket!

Írj egy `teszt_szamlalo()` függvényt, amely `assert` utasításokkal ellenőrzi az alábbi `maganhangzok(szo)` függvényt: legalább egy normál esetet, egy üres szöveget, egy csupa nagybetűs szót és egy ékezetes szót vizsgálj!

```python starter
def maganhangzok(szo):
    return sum(1 for c in szo.lower() if c in "aáeéiíoóöőuúüű")

def teszt_szamlalo():
    pass   # írd ide az assert sorokat!

teszt_szamlalo()
```

<details>
<summary>Megoldás</summary>

```python solution
def maganhangzok(szo):
    return sum(1 for c in szo.lower() if c in "aáeéiíoóöőuúüű")

def teszt_szamlalo():
    assert maganhangzok("alma") == 2
    assert maganhangzok("") == 0
    assert maganhangzok("PYTHON") == 1
    assert maganhangzok("tükörfúrógép") == 5
    assert maganhangzok("xyz") == 0

teszt_szamlalo()
```

</details>

```python test
teszt_szamlalo()
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: unittest

Írj `unittest` tesztosztályt (`PrimTeszt`) az alábbi `prim_e` függvényhez legalább három tesztmetódussal (kis prímek, nem prímek, határesetek: 0, 1, 2)!

```python starter
import unittest

def prim_e(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, int(n ** 0.5) + 1))

class PrimTeszt(unittest.TestCase):
    pass   # írd ide a test_ kezdetű metódusokat!
```

<details>
<summary>Megoldás</summary>

```python solution
import unittest

def prim_e(n):
    if n < 2:
        return False
    return all(n % d for d in range(2, int(n ** 0.5) + 1))

class PrimTeszt(unittest.TestCase):
    def test_kis_primek(self):
        for p in [2, 3, 5, 7, 11, 13]:
            self.assertTrue(prim_e(p))

    def test_nem_primek(self):
        for n in [4, 6, 9, 15, 25]:
            self.assertFalse(prim_e(n))

    def test_hatarok(self):
        self.assertFalse(prim_e(0))
        self.assertFalse(prim_e(1))
        self.assertTrue(prim_e(2))
```

</details>

```python test
import io
csomag = unittest.defaultTestLoader.loadTestsFromTestCase(PrimTeszt)
eredmeny = unittest.TextTestRunner(stream=io.StringIO()).run(csomag)
assert eredmeny.testsRun >= 3, "Legalább 3 tesztmetódus kell"
assert eredmeny.wasSuccessful()
print("Minden ellenőrzés sikeres!")
```
