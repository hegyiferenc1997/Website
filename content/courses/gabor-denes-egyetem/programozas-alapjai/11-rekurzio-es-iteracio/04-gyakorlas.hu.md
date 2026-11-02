---
title: Gyakorlás – rekurzió és iteráció
summary: Ellenőrző kérdések és feladatok rekurzív és iteratív megoldásokra.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

**1. Mit tartalmaz egy veremkeret?**

<details>
<summary>Válasz</summary>

A hívás paramétereit, lokális változóit és a visszatérési címet.

</details>

**2. Miért lassú a naiv rekurzív Fibonacci, és hogyan gyorsítható?**

<details>
<summary>Válasz</summary>

Ugyanazokat a részeredményeket sokszor újraszámolja, így a hívások száma exponenciálisan nő. Gyorsítható memoizációval (`@functools.cache` vagy saját szótár) vagy iteratív megoldással.

</details>

**3. Hány lépés kell a Hanoi tornyaihoz 5 korongnál?**

<details>
<summary>Válasz</summary>

2⁵ − 1 = 31 lépés.

</details>

**4. Milyen feltétele van a bináris keresésnek, és mennyi a lépésszáma?**

<details>
<summary>Válasz</summary>

A listának rendezettnek kell lennie. A lépésszám O(log n), pl. 1 000 000 elemnél kb. 20.

</details>

**5. Mikor válassz inkább iterációt a rekurzió helyett Pythonban?**

<details>
<summary>Válasz</summary>

Lineáris feladatoknál (lista bejárása, számlálás, összegzés), nagyon mély rekurziónál (1000 szint fölött), és ha a rekurzió ugyanazokat a részfeladatokat számolná újra.

</details>

## Feladatok

### 1. feladat: Számjegyek összege rekurzívan

Írj `szamjegy_osszeg(n)` rekurzív függvényt nemnegatív egész számra!

```python starter
def szamjegy_osszeg(n):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def szamjegy_osszeg(n):
    if n < 10:
        return n
    return n % 10 + szamjegy_osszeg(n // 10)
```

</details>

```python test
assert szamjegy_osszeg(2026) == 10
assert szamjegy_osszeg(0) == 0
assert szamjegy_osszeg(99999) == 45
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Legnagyobb közös osztó

Az euklideszi algoritmus: `lnko(a, b) = a`, ha `b == 0`, különben `lnko(b, a % b)`. Írd meg **rekurzívan** (`lnko_r`) és **iteratívan** (`lnko_i`) is!

```python starter
def lnko_r(a, b):
    pass

def lnko_i(a, b):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def lnko_r(a, b):
    if b == 0:
        return a
    return lnko_r(b, a % b)

def lnko_i(a, b):
    while b != 0:
        a, b = b, a % b
    return a
```

</details>

```python test
for a, b, v in [(48, 18, 6), (17, 5, 1), (100, 75, 25), (7, 0, 7)]:
    assert lnko_r(a, b) == v and lnko_i(a, b) == v
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Fibonacci memoizációval

Írj `fib(n)` függvényt, amely **rekurzív**, de memoizáció miatt `n = 80`-ra is azonnal lefut!

```python starter
def fib(n):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

</details>

```python test
assert [fib(i) for i in range(8)] == [0, 1, 1, 2, 3, 5, 8, 13]
assert fib(80) == 23416728348467685
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Részhalmazok

Írj `reszhalmazok(lista)` rekurzív függvényt, amely visszaadja a lista összes részhalmazát (listák listájaként)! Tipp: az első elem vagy benne van egy részhalmazban, vagy nincs.

```python starter
def reszhalmazok(lista):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def reszhalmazok(lista):
    if not lista:
        return [[]]
    elso, maradek = lista[0], lista[1:]
    nelkule = reszhalmazok(maradek)
    vele = [[elso] + r for r in nelkule]
    return nelkule + vele
```

</details>

```python test
eredmeny = reszhalmazok([1, 2, 3])
assert len(eredmeny) == 8
assert sorted(sorted(r) for r in eredmeny) == [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]]
assert reszhalmazok([]) == [[]]
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Mélység mérése

Írj `melyseg(adat)` rekurzív függvényt, amely megadja egy egymásba ágyazott lista legnagyobb mélységét! Egy nem lista érték mélysége 0, az üres listáé 1.

```python starter
def melyseg(adat):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def melyseg(adat):
    if not isinstance(adat, list):
        return 0
    return 1 + max((melyseg(x) for x in adat), default=0)
```

</details>

```python test
assert melyseg(5) == 0
assert melyseg([]) == 1
assert melyseg([1, 2]) == 1
assert melyseg([1, [2, [3]], [4]]) == 3
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Permutációk rekurzívan

A témakör összefoglaló feladata. Írj **rekurzív** `permutaciok(szoveg)` függvényt, amely egy szöveg betűinek összes különböző sorrendjét (permutációját) adja vissza **ábécérendű listában**, ismétlődés nélkül. Az `itertools` modult ne használd!

Ötlet: minden betűt egyszer előre veszel, és a maradék betűk permutációit rekurzívan elé fűzöd. Az alapeset az üres (vagy egybetűs) szöveg. Ha a szövegben ismétlődő betű van (pl. `"aab"`), a duplikátumokat szűrd ki (halmazzal).

Például `permutaciok("abc")` → `["abc", "acb", "bac", "bca", "cab", "cba"]`.

```python starter required
def permutaciok(szoveg):
    if len(szoveg) <= 1:
        return [szoveg]
    eredmeny = set()
    for i, betu in enumerate(szoveg):
        maradek = szoveg[:i] + szoveg[i + 1:]
        # a maradék permutációi elé fűzd a betűt
    return sorted(eredmeny)


print(permutaciok("abc"))
```

<details>
<summary>Megoldás</summary>

```python solution
def permutaciok(szoveg):
    if len(szoveg) <= 1:
        return [szoveg]
    eredmeny = set()
    for i, betu in enumerate(szoveg):
        maradek = szoveg[:i] + szoveg[i + 1:]
        for vege in permutaciok(maradek):
            eredmeny.add(betu + vege)
    return sorted(eredmeny)


print(permutaciok("abc"))
```

</details>

```python test
assert permutaciok("abc") == ["abc", "acb", "bac", "bca", "cab", "cba"], "Az \"abc\" permutációi nem stimmelnek."
assert permutaciok("aab") == ["aab", "aba", "baa"], "Ismétlődő betűnél a duplikátumokat ki kell szűrni."
assert permutaciok("") == [""], "Az üres szöveg egyetlen permutációja az üres szöveg."
assert len(permutaciok("abcde")) == 120, "5 különböző betűnek 5! = 120 permutációja van."
```
