---
title: Gyakorlás – kivételkezelés
summary: Ellenőrző kérdések és feladatok kivételek kezelésére, dobására és saját kivételekre.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

**1. Milyen hibatípus: a) hiányzó kettőspont, b) `int("x")`, c) rossz képlet miatt hibás átlag?**

<details>
<summary>Válasz</summary>

a) szintaktikai hiba, b) futási hiba (`ValueError` kivétel), c) logikai hiba.

</details>

**2. Mi a kimenet?**

```python
try:
    print("A")
    x = 1 / 0
    print("B")
except ZeroDivisionError:
    print("C")
else:
    print("D")
finally:
    print("E")
```

<details>
<summary>Válasz</summary>

`A`, `C`, `E`. A `B` kimarad, mert előtte kivétel történt; az `else` csak kivétel nélkül futna; a `finally` mindig lefut.

</details>

**3. Miért rossz a csupasz `except:`?**

<details>
<summary>Válasz</summary>

Minden kivételt elkap, a programozási hibákat (pl. elgépelés miatti `NameError`) és a Ctrl+C-t is, így elrejti a valódi hibákat.

</details>

**4. Mi a különbség az EAFP és az LBYL között?**

<details>
<summary>Válasz</summary>

LBYL: előbb ellenőrzünk, aztán cselekszünk. EAFP: megpróbáljuk, és a kivételt kezeljük, ha nem sikerült. Pythonban az EAFP a megszokottabb.

</details>

**5. Mikor ne használj `assert`-et?**

<details>
<summary>Válasz</summary>

Felhasználói bemenet ellenőrzésére, mert `python -O` futtatásnál az `assert` sorok kimaradnak. Erre `if` + `raise` való.

</details>

## Feladatok

### 1. feladat: Biztonságos osztás

Írj `biztonsagos_osztas(a, b)` függvényt, amely visszaadja `a / b` értékét, nullával osztásnál pedig `None`-t! Kivételkezeléssel oldd meg.

```python starter
def biztonsagos_osztas(a, b):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def biztonsagos_osztas(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None
```

</details>

```python test
assert biztonsagos_osztas(10, 4) == 2.5
assert biztonsagos_osztas(1, 0) is None
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Számok kiszűrése

Írj `szamok(szovegek)` függvényt, amely a szövegek listájából csak azokat adja vissza (egészként), amelyek egész számmá alakíthatók! A többit hagyja ki.

```python starter
def szamok(szovegek):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def szamok(szovegek):
    eredmeny = []
    for s in szovegek:
        try:
            eredmeny.append(int(s))
        except ValueError:
            pass   # nem szám – szándékosan kihagyjuk
    return eredmeny
```

</details>

```python test
assert szamok(["3", "x", "-7", "4.5", " 12 "]) == [3, -7, 12]
assert szamok([]) == []
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Életkor ellenőrzése

Írj `eletkor_beallit(kor)` függvényt, amely `TypeError`-t dob, ha a kor nem `int`, `ValueError`-t, ha 0-nál kisebb vagy 150-nél nagyobb, különben visszaadja a kort.

```python starter
def eletkor_beallit(kor):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def eletkor_beallit(kor):
    if not isinstance(kor, int):
        raise TypeError("Az életkornak egész számnak kell lennie.")
    if kor < 0 or kor > 150:
        raise ValueError("Az életkor 0 és 150 között lehet.")
    return kor
```

</details>

```python test
assert eletkor_beallit(20) == 20
for rossz, kivetel in [("20", TypeError), (-1, ValueError), (151, ValueError)]:
    try:
        eletkor_beallit(rossz)
        assert False, f"{kivetel.__name__} kellett volna"
    except kivetel:
        pass
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Saját kivétel

Készíts `UresKosarHiba` kivételosztályt (az `Exception` leszármazottja), és egy `vegosszeg(kosar)` függvényt, amely a kosár (ár lista) összegét adja, üres kosárnál pedig `UresKosarHiba`-t dob!

```python starter
class UresKosarHiba(Exception):
    pass

def vegosszeg(kosar):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
class UresKosarHiba(Exception):
    pass

def vegosszeg(kosar):
    if not kosar:
        raise UresKosarHiba("A kosár üres.")
    return sum(kosar)
```

</details>

```python test
assert vegosszeg([100, 250]) == 350
try:
    vegosszeg([])
    assert False, "UresKosarHiba kellett volna"
except UresKosarHiba:
    pass
assert issubclass(UresKosarHiba, Exception)
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Szótárolvasás alapértékkel

Írj `beallitas(beallitasok, kulcs, alap)` függvényt, amely visszaadja a kulcshoz tartozó értéket **egész számként**. Ha a kulcs hiányzik **vagy** az érték nem alakítható egésszé, adja vissza az `alap` értéket. EAFP stílusban oldd meg!

```python starter
def beallitas(beallitasok, kulcs, alap):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def beallitas(beallitasok, kulcs, alap):
    try:
        return int(beallitasok[kulcs])
    except (KeyError, ValueError):
        return alap
```

</details>

```python test
b = {"port": "8080", "timeout": "sok"}
assert beallitas(b, "port", 80) == 8080
assert beallitas(b, "timeout", 30) == 30
assert beallitas(b, "retry", 3) == 3
print("Minden ellenőrzés sikeres!")
```
