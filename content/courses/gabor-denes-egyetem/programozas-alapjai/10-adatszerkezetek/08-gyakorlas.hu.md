---
title: Gyakorlás – adatszerkezetek
summary: Ellenőrző kérdések és feladatok tömbökre, listákra, láncolt listákra, halmazokra, szótárakra és veremre.
minutes: 65
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

## Összefoglaló feladat: Könyvtári kölcsönzések elemzése

A témakör összefoglaló feladata: listák, tuple-ök, halmazok és szótárak együtt – mindegyik ott, ahol a legjobban illik.

A kölcsönzések `(olvasó, könyv)` párok listájaként adottak (egy olvasó ugyanazt a könyvet többször is kikölcsönözhette). Írj `kolcsonzes_jelentes(kolcsonzesek)` függvényt, amely egy `(olvasonkent, nepszeru)` párt ad vissza:

- `olvasonkent`: szótár – olvasó → az általa kölcsönzött **különböző** könyvek ábécérendű listája;
- `nepszeru`: azoknak a könyveknek az ábécérendű listája, amelyeket **legalább két különböző** olvasó kölcsönzött.

Tipp: gyűjts előbb halmazokba (olvasó → könyvek halmaza, könyv → olvasók halmaza), és csak a végén alakíts rendezett listává.

```python starter required
def kolcsonzes_jelentes(kolcsonzesek):
    konyvei = {}     # olvasó → könyvek halmaza
    olvasoi = {}     # könyv → olvasók halmaza
    for olvaso, konyv in kolcsonzesek:
        pass
    # rendezett listák készítése
    pass


adat = [("Anna", "Dűne"), ("Béla", "Dűne"), ("Anna", "Hobbit"), ("Anna", "Dűne")]
print(kolcsonzes_jelentes(adat))
```

<details>
<summary>Megoldás</summary>

```python solution
def kolcsonzes_jelentes(kolcsonzesek):
    konyvei = {}
    olvasoi = {}
    for olvaso, konyv in kolcsonzesek:
        konyvei.setdefault(olvaso, set()).add(konyv)
        olvasoi.setdefault(konyv, set()).add(olvaso)
    olvasonkent = {olvaso: sorted(konyvek) for olvaso, konyvek in konyvei.items()}
    nepszeru = sorted(konyv for konyv, olvasok in olvasoi.items() if len(olvasok) >= 2)
    return olvasonkent, nepszeru


adat = [("Anna", "Dűne"), ("Béla", "Dűne"), ("Anna", "Hobbit"), ("Anna", "Dűne")]
print(kolcsonzes_jelentes(adat))
```

</details>

```python test
adat = [("Anna", "Dűne"), ("Béla", "Dűne"), ("Anna", "Hobbit"), ("Anna", "Dűne"), ("Csilla", "Hobbit"), ("Béla", "Emma")]
olvasonkent, nepszeru = kolcsonzes_jelentes(adat)
assert olvasonkent == {"Anna": ["Dűne", "Hobbit"], "Béla": ["Dűne", "Emma"], "Csilla": ["Hobbit"]}, "Az olvasónkénti lista nem stimmel (ismétlés nélkül, ábécérendben)."
assert nepszeru == ["Dűne", "Hobbit"], "Népszerű: amit legalább két különböző olvasó vitt el."
assert kolcsonzes_jelentes([("Anna", "X"), ("Anna", "X")]) == ({"Anna": ["X"]}, []), "Ugyanaz az olvasó kétszer: nem népszerű."
assert kolcsonzes_jelentes([]) == ({}, []), "Üres listára üres eredmény."
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Közös elemek.** Írd meg a `kozos_elemek(a, b)` függvényt, amely a két lista közös elemeit adja vissza **rendezett**, ismétlődés nélküli listában! Használj halmazt (`set`)!

```python starter
def kozos_elemek(a, b):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def kozos_elemek(a, b):
    return sorted(set(a) & set(b))          # & = halmazok metszete
```

</details>

```python test
assert kozos_elemek([1, 2, 3, 2], [2, 3, 4]) == [2, 3]
assert kozos_elemek(["a", "b"], ["c"]) == []
assert kozos_elemek([5, 5, 1], [1, 5]) == [1, 5]
print("Minden ellenőrzés sikeres!")
```

**2.** **Fordítás veremmel.** Írd meg a `verem_fordit(szoveg)` függvényt, amely egy listát veremként használva (`append` és `pop`) fordítja meg a szöveget, a `[::-1]` és a `reversed` használata nélkül!

```python starter
def verem_fordit(szoveg):
    return szoveg
```

<details>
<summary>Megoldás</summary>

```python solution
def verem_fordit(szoveg):
    verem = []
    for karakter in szoveg:
        verem.append(karakter)              # rátesszük a verem tetejére
    eredmeny = ""
    while verem:
        eredmeny += verem.pop()             # mindig a legfelsőt vesszük le (LIFO)
    return eredmeny
```

</details>

```python test
assert verem_fordit("abc") == "cba"
assert verem_fordit("") == ""
assert verem_fordit("Görög") == "göröG"
print("Minden ellenőrzés sikeres!")
```

**3.** **Csoportosítás hossz szerint.** Írd meg a `szavak_hossz_szerint(szavak)` függvényt, amely szótárat ad vissza: kulcs a szóhossz, érték az adott hosszúságú szavak listája az eredeti sorrendben!

```python starter
def szavak_hossz_szerint(szavak):
    return {}
```

<details>
<summary>Megoldás</summary>

```python solution
def szavak_hossz_szerint(szavak):
    csoportok = {}
    for szo in szavak:
        csoportok.setdefault(len(szo), []).append(szo)   # ha még nincs kulcs, üres lista
    return csoportok
```

</details>

```python test
assert szavak_hossz_szerint(["fa", "alma", "ég", "kör"]) == {2: ["fa", "ég"], 4: ["alma"], 3: ["kör"]}
assert szavak_hossz_szerint([]) == {}
assert szavak_hossz_szerint(["a", "a"]) == {1: ["a", "a"]}
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Melyik adatszerkezet NEM módosítható (immutable)?
- list
- dict
+ tuple
- set
! A tuple létrehozás után nem változtatható.

? Mennyi `len({1, 2, 2, 3, 3, 3})` értéke?
= 3
! A halmaz csak egyszer tárolja az elemeket.

? Átlagosan milyen gyors egy szótárban a kulcs szerinti keresés?
+ közel állandó idejű, a mérettől függetlenül
- a mérettel arányos
- a méret négyzetével arányos
- csak rendezett szótárban gyors
! A szótár hasítótáblát használ.

? Mennyi `[1, 2, 3, 4, 5][1:4]` hossza?
= 3
! Az 1., 2. és 3. indexű elem: [2, 3, 4].
```
