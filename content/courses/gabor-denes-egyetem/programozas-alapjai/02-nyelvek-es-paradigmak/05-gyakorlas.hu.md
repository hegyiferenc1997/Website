---
title: Gyakorlás – nyelvek és paradigmák
summary: Ellenőrző kérdések és feladatok: imperatív, deklaratív, objektumorientált és funkcionális megoldások.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség a szintaxis és a szemantika között?**

<details>
<summary>Válasz</summary>

A szintaxis a nyelv formai szabályrendszere (hogyan kell leírni), a szemantika az utasítások jelentése (mit csinálnak).

</details>

**2. Imperatív vagy deklaratív az SQL `SELECT` utasítás? Miért?**

<details>
<summary>Válasz</summary>

Deklaratív: azt írjuk le, milyen adatot szeretnénk, a lekérdezés végrehajtásának módját az adatbázis-kezelő dönti el.

</details>

**3. Sorold fel az OOP négy alappillérét!**

<details>
<summary>Válasz</summary>

Egységbezárás, öröklődés, polimorfizmus, absztrakció.

</details>

**4. Mitől „tiszta” egy függvény?**

<details>
<summary>Válasz</summary>

Ugyanarra a bemenetre mindig ugyanazt az eredményt adja, és nincs mellékhatása (nem módosít külső állapotot, nem ír ki, nem ír fájlba).

</details>

## Feladatok

### 1. feladat: Imperatívból deklaratív

Az alábbi kód a 3-mal osztható számokat gyűjti ki. Írd át egyetlen listaértelmezéssé, az eredmény a `harmassal` változóba kerüljön!

```python starter
szamok = [3, 7, 9, 12, 14, 18, 20]
harmassal = []
for x in szamok:
    if x % 3 == 0:
        harmassal.append(x)
print(harmassal)
```

<details>
<summary>Megoldás</summary>

```python solution
szamok = [3, 7, 9, 12, 14, 18, 20]
harmassal = [x for x in szamok if x % 3 == 0]
print(harmassal)
```

</details>

```python test
assert harmassal == [3, 9, 12, 18]
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Termék osztály

Készíts `Termek` osztályt `nev`, `ar` és `darab` attribútumokkal, valamint egy `osszertek()` metódussal, amely az ár és a darabszám szorzatát adja vissza.

```python starter
class Termek:
    def __init__(self, nev, ar, darab):
        pass   # tárold el az adatokat!

    def osszertek(self):
        pass   # add vissza az összértéket!
```

<details>
<summary>Megoldás</summary>

```python solution
class Termek:
    def __init__(self, nev, ar, darab):
        self.nev = nev
        self.ar = ar
        self.darab = darab

    def osszertek(self):
        return self.ar * self.darab
```

</details>

```python test
t = Termek("toll", 250, 4)
assert t.nev == "toll"
assert t.osszertek() == 1000
assert Termek("füzet", 600, 0).osszertek() == 0
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Polimorfizmus

Készíts `Allat` alaposztályt egy `hang()` metódussal, amely `"..."`-ot ad vissza, és két leszármazottat: `Kutya` (`"Vau"`) és `Macska` (`"Miau"`).

```python starter
class Allat:
    def hang(self):
        return "..."

# Írd ide a Kutya és Macska osztályt!
```

<details>
<summary>Megoldás</summary>

```python solution
class Allat:
    def hang(self):
        return "..."

class Kutya(Allat):
    def hang(self):
        return "Vau"

class Macska(Allat):
    def hang(self):
        return "Miau"
```

</details>

```python test
assert [a.hang() for a in [Kutya(), Macska(), Allat()]] == ["Vau", "Miau", "..."]
assert isinstance(Kutya(), Allat)
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Rendezés kulccsal

Rendezd a hallgatókat **átlag szerint csökkenő** sorrendbe a `sorted` és egy `lambda` segítségével! Az eredmény a `rangsor` változóba kerüljön.

```python starter
hallgatok = [("Anna", 4.2), ("Béla", 3.8), ("Csilla", 4.9)]
rangsor = hallgatok   # javítsd ki!
print(rangsor)
```

<details>
<summary>Megoldás</summary>

```python solution
hallgatok = [("Anna", 4.2), ("Béla", 3.8), ("Csilla", 4.9)]
rangsor = sorted(hallgatok, key=lambda h: h[1], reverse=True)
print(rangsor)
```

</details>

```python test
assert [nev for nev, _ in rangsor] == ["Csilla", "Anna", "Béla"]
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Hallgatói rangsor – OOP és funkcionális eszközök együtt

A témakör összefoglaló feladata: objektumorientált és funkcionális eszközök együtt.

1. Készíts `Hallgato` osztályt: a konstruktor a `nev`-et és a `pontok` listáját kapja; az `atlag()` metódus a pontok átlagát adja vissza (üres listánál 0).
2. Írj `legjobbak(hallgatok, n)` függvényt, amely a hallgatók listájából az átlag szerint **legjobb `n` hallgató nevét** adja vissza csökkenő sorrendben. Egyenlő átlagnál a név szerinti ábécérend döntsön. Használd a `sorted()` függvényt `key=lambda ...` kulccsal!

```python starter required
class Hallgato:
    def __init__(self, nev, pontok):
        pass

    def atlag(self):
        pass


def legjobbak(hallgatok, n):
    # sorted(..., key=lambda h: (-h.atlag(), h.nev)) – a mínusz jel fordítja meg az átlag sorrendjét
    pass


csoport = [Hallgato("Béla", [60, 70]), Hallgato("Anna", [90, 80]), Hallgato("Csilla", [85, 85])]
print(legjobbak(csoport, 2))   # ['Anna', 'Csilla']
```

<details>
<summary>Megoldás</summary>

```python solution
class Hallgato:
    def __init__(self, nev, pontok):
        self.nev = nev
        self.pontok = pontok

    def atlag(self):
        if not self.pontok:
            return 0
        return sum(self.pontok) / len(self.pontok)


def legjobbak(hallgatok, n):
    rendezett = sorted(hallgatok, key=lambda h: (-h.atlag(), h.nev))
    return [h.nev for h in rendezett[:n]]


csoport = [Hallgato("Béla", [60, 70]), Hallgato("Anna", [90, 80]), Hallgato("Csilla", [85, 85])]
print(legjobbak(csoport, 2))   # ['Anna', 'Csilla']
```

</details>

```python test
assert Hallgato("X", [50, 100]).atlag() == 75, "Az 50 és 100 átlaga 75."
assert Hallgato("Y", []).atlag() == 0, "Pontok nélkül 0 az átlag."
cs = [Hallgato("Béla", [60, 70]), Hallgato("Anna", [90, 80]), Hallgato("Csilla", [85, 85])]
assert legjobbak(cs, 2) == ["Anna", "Csilla"], "A két legjobb: Anna (85), Csilla (85) – egyenlőségnél ábécérend."
assert legjobbak(cs, 5) == ["Anna", "Csilla", "Béla"], "Ha n nagyobb, mindenki benne van."
assert legjobbak([], 3) == [], "Üres csoportra üres lista."
```
