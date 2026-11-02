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
