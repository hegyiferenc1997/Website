---
title: Gyakorlás – adatszerkezetek
summary: Ellenőrző kérdések és feladatok tömbökre, listákra, láncolt listákra, halmazokra, szótárakra és veremre.
minutes: 40
kind: practice
---

## Ellenőrző kérdések

**1. Miért O(1) a tömb i-edik elemének elérése, és miért O(n) a láncolt listáé?**

<details>
<summary>Válasz</summary>

A tömb elemei egymás után, azonos méretben állnak, így a cím kiszámolható (`kezdőcím + i · méret`). A láncolt listában az elemek szétszórva vannak, ezért a fejtől kezdve végig kell lépkedni a mutatókon.

</details>

**2. Melyik adatszerkezetet használnád: a) szavak gyakoriságának számolása, b) böngésző „vissza” gombja, c) nyomtatási feladatok, d) egyedi látogatók?**

<details>
<summary>Válasz</summary>

a) szótár (vagy `Counter`), b) verem, c) sor, d) halmaz.

</details>

**3. Mit ír ki? `print({1, 2, 3} & {2, 3, 4}, {1, 2} | {5})`**

<details>
<summary>Válasz</summary>

`{2, 3} {1, 2, 5}`

</details>

**4. Miért nem lehet egy lista szótár kulcsa?**

<details>
<summary>Válasz</summary>

Mert a lista megváltoztatható, így nincs állandó hash értéke; a szótár hasítótáblája csak hash-elhető (megváltoztathatatlan) kulcsokkal működik. Tuple viszont lehet kulcs.

</details>

**5. Mi a hiba? `m = [[0] * 3] * 3; m[0][0] = 1`**

<details>
<summary>Válasz</summary>

Mindhárom sor ugyanaz a lista, így mindhárom sor első eleme 1 lesz. Helyesen: `[[0] * 3 for _ in range(3)]`.

</details>

## Feladatok

### 1. feladat: Mátrix transzponálása

Írj `transzponal(m)` függvényt, amely visszaadja a mátrix transzponáltját (sorokból oszlopok lesznek)!

```python starter
def transzponal(m):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def transzponal(m):
    return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]
```

</details>

```python test
assert transzponal([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]]
assert transzponal([[7]]) == [[7]]
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Ismétlődések törlése sorrendtartással

Írj `egyedi(lista)` függvényt, amely az ismétlődéseket kihagyja, de az első előfordulások **sorrendjét megtartja**! (Tipp: egy halmazban jegyezd, mit láttál már.)

```python starter
def egyedi(lista):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def egyedi(lista):
    latott = set()
    eredmeny = []
    for x in lista:
        if x not in latott:
            latott.add(x)
            eredmeny.append(x)
    return eredmeny
```

</details>

```python test
assert egyedi([3, 1, 3, 2, 1, 4]) == [3, 1, 2, 4]
assert egyedi([]) == []
assert egyedi(["b", "a", "b"]) == ["b", "a"]
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Szógyakoriság

Írj `gyakorisag(szoveg)` függvényt, amely szótárban adja vissza, melyik szó hányszor fordul elő! A kis- és nagybetűk ne számítsanak.

```python starter
def gyakorisag(szoveg):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def gyakorisag(szoveg):
    eredmeny = {}
    for szo in szoveg.lower().split():
        eredmeny[szo] = eredmeny.get(szo, 0) + 1
    return eredmeny
```

</details>

```python test
assert gyakorisag("A kutya és a macska") == {"a": 2, "kutya": 1, "és": 1, "macska": 1}
assert gyakorisag("") == {}
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Anagramma

Két szó **anagramma**, ha ugyanazokból a betűkből állnak (pl. „ital” és „lita”). Írj `anagramma_e(a, b)` függvényt! A kis- és nagybetűk ne számítsanak.

```python starter
def anagramma_e(a, b):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def anagramma_e(a, b):
    return sorted(a.lower()) == sorted(b.lower())
```

</details>

```python test
assert anagramma_e("ital", "Lita") is True
assert anagramma_e("listen", "silent") is True
assert anagramma_e("alma", "lama") is True
assert anagramma_e("alma", "almák") is False
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Láncolt lista hossza és összege

Az alábbi `Csomopont` osztállyal felépített láncolt listához írj `hossz(fej)` és `osszeg(fej)` függvényt, amelyek bejárják a listát!

```python starter
class Csomopont:
    def __init__(self, adat, kovetkezo=None):
        self.adat = adat
        self.kovetkezo = kovetkezo

def hossz(fej):
    pass

def osszeg(fej):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
class Csomopont:
    def __init__(self, adat, kovetkezo=None):
        self.adat = adat
        self.kovetkezo = kovetkezo

def hossz(fej):
    db = 0
    akt = fej
    while akt is not None:
        db += 1
        akt = akt.kovetkezo
    return db

def osszeg(fej):
    s = 0
    akt = fej
    while akt is not None:
        s += akt.adat
        akt = akt.kovetkezo
    return s
```

</details>

```python test
lista = Csomopont(3, Csomopont(5, Csomopont(10)))
assert hossz(lista) == 3
assert osszeg(lista) == 18
assert hossz(None) == 0 and osszeg(None) == 0
print("Minden ellenőrzés sikeres!")
```

### 6. feladat: Láncolt lista megfordítása

Írj `megfordit(fej)` függvényt, amely helyben megfordítja a láncolt listát (a mutatók átállításával), és visszaadja az új fejet!

```python starter
class Csomopont:
    def __init__(self, adat, kovetkezo=None):
        self.adat = adat
        self.kovetkezo = kovetkezo

def megfordit(fej):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
class Csomopont:
    def __init__(self, adat, kovetkezo=None):
        self.adat = adat
        self.kovetkezo = kovetkezo

def megfordit(fej):
    elozo = None
    akt = fej
    while akt is not None:
        kov = akt.kovetkezo      # megjegyezzük a következőt
        akt.kovetkezo = elozo    # visszafelé állítjuk a mutatót
        elozo = akt
        akt = kov
    return elozo
```

</details>

```python test
fej = megfordit(Csomopont(1, Csomopont(2, Csomopont(3))))
ertekek = []
while fej:
    ertekek.append(fej.adat)
    fej = fej.kovetkezo
assert ertekek == [3, 2, 1]
assert megfordit(None) is None
print("Minden ellenőrzés sikeres!")
```

### 7. feladat: Csoportosítás jegy szerint

Írj `jegy_szerint(eredmenyek)` függvényt, amely a `{név: jegy}` szótárból `{jegy: [nevek ábécérendben]}` szótárat készít!

```python starter
def jegy_szerint(eredmenyek):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def jegy_szerint(eredmenyek):
    csoport = {}
    for nev, jegy in eredmenyek.items():
        csoport.setdefault(jegy, []).append(nev)
    return {jegy: sorted(nevek) for jegy, nevek in csoport.items()}
```

</details>

```python test
eredmeny = jegy_szerint({"Béla": 4, "Anna": 5, "Ede": 4, "Dóra": 2})
assert eredmeny == {4: ["Béla", "Ede"], 5: ["Anna"], 2: ["Dóra"]}
print("Minden ellenőrzés sikeres!")
```
