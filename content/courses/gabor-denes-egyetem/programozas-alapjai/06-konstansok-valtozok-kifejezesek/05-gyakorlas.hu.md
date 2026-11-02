---
title: Gyakorlás – változók és kifejezések
summary: Ellenőrző kérdések és feladatok változókkal, konstansokkal, operátorokkal és kiírással.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

**1. Melyik érvényes változónév: `_pont`, `2db`, `osszeg_1`, `for`, `atlag-ertek`?**

<details>
<summary>Válasz</summary>

Érvényes: `_pont`, `osszeg_1`. Érvénytelen: `2db` (számmal kezdődik), `for` (foglalt szó), `atlag-ertek` (kötőjel).

</details>

**2. Mit ír ki a program?**

```python
a = [1, 2]
b = a
b.append(3)
print(a)
```

<details>
<summary>Válasz</summary>

`[1, 2, 3]` – a `b = a` nem másol, mindkét név ugyanarra a listára mutat.

</details>

**3. Mi a `not 3 > 2 or 5 == 5 and 2 > 4` értéke?**

<details>
<summary>Válasz</summary>

`False`. Lépésenként: `3 > 2` → True, `not True` → False; `5 == 5 and 2 > 4` → True and False → False; végül `False or False` → False.

</details>

**4. Miért nem okoz hibát a `x = 0` után az `x != 0 and 10 / x > 1` kifejezés?**

<details>
<summary>Válasz</summary>

A rövidzár kiértékelés miatt: az `x != 0` hamis, így az `and` jobb oldala (az osztás) ki sem értékelődik.

</details>

**5. Mi a különbség a literál és a konstans között?**

<details>
<summary>Válasz</summary>

A literál egy érték közvetlen leírása a kódban (`100`), a konstans egy név, amelyhez egy nem változó érték tartozik (`MAX_PONT = 100`).

</details>

## Feladatok

### 1. feladat: Csere

Cseréld meg az `a` és `b` változó értékét egyetlen sorban!

```python starter
a = "első"
b = "második"
# Írd ide a cserét!
print(a, b)
```

<details>
<summary>Megoldás</summary>

```python solution
a = "első"
b = "második"
a, b = b, a
print(a, b)
```

</details>

```python test
assert (a, b) == ("második", "első")
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Szökőév

Írj `szokoev_e(ev)` függvényt **egyetlen logikai kifejezéssel**! Szökőév az, amely osztható 4-gyel, de nem osztható 100-zal – kivéve, ha 400-zal is osztható.

```python starter
def szokoev_e(ev):
    return False   # írd ide a kifejezést!
```

<details>
<summary>Megoldás</summary>

```python solution
def szokoev_e(ev):
    return (ev % 4 == 0 and ev % 100 != 0) or ev % 400 == 0
```

</details>

```python test
assert szokoev_e(2024) is True
assert szokoev_e(1900) is False
assert szokoev_e(2000) is True
assert szokoev_e(2026) is False
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Testtömegindex

Írj `bmi(tomeg_kg, magassag_cm)` függvényt, amely a testtömegindexet adja vissza **egy tizedesre kerekítve**! Képlet: tömeg / (magasság méterben)². Használj konstanst a centiméter–méter váltáshoz!

```python starter
CM_PER_M = 100

def bmi(tomeg_kg, magassag_cm):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
CM_PER_M = 100

def bmi(tomeg_kg, magassag_cm):
    magassag_m = magassag_cm / CM_PER_M
    return round(tomeg_kg / magassag_m ** 2, 1)
```

</details>

```python test
assert bmi(70, 175) == 22.9
assert bmi(50, 160) == 19.5
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Pénzváltó

Írj `cimletek(osszeg)` függvényt, amely megadja, hogy egy forintösszeg hány 10 000-es, 1 000-es és 100-as címletből, illetve mennyi maradékból áll. Egy négyelemű tuple-t adj vissza: `(tizezres, ezres, szazas, maradek)`. Használd a `//` és `%` operátorokat!

```python starter
def cimletek(osszeg):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def cimletek(osszeg):
    tizezres = osszeg // 10_000
    osszeg %= 10_000
    ezres = osszeg // 1_000
    osszeg %= 1_000
    szazas = osszeg // 100
    maradek = osszeg % 100
    return (tizezres, ezres, szazas, maradek)
```

</details>

```python test
assert cimletek(23_750) == (2, 3, 7, 50)
assert cimletek(99) == (0, 0, 0, 99)
assert cimletek(10_000) == (1, 0, 0, 0)
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Beolvasás és formázás

Írj programot, amely beolvas egy termékárat és egy darabszámot, majd kiírja a végösszeget **két tizedesre** formázva: `Végösszeg: 1234.50 Ft`.

```python starter
ar = float(input("Ár: "))
darab = int(input("Darab: "))
# Írd ide a kiírást!
```

<details>
<summary>Megoldás</summary>

```python solution
ar = float(input("Ár: "))
darab = int(input("Darab: "))
print(f"Végösszeg: {ar * darab:.2f} Ft")
```

</details>

## Összefoglaló feladat: BMI-kalkulátor

A témakör összefoglaló feladata: konstansok, kifejezések, feltételes kifejezés és formázott kiírás együtt.

Írj `bmi_jelentes(nev, suly_kg, magassag_cm)` függvényt, amely szöveget ad vissza, pl. `"Anna: BMI 22.9 (normál)"`.

- BMI = testtömeg (kg) / magasság (m)², egy tizedesjegyre kerekítve a kiírásban (`:.1f`).
- Kategóriák: 18.5 alatt `sovány`, 25 alatt `normál`, különben `túlsúlyos`. A határokat tedd **konstansokba** (`SOVANY_HATAR`, `TULSULY_HATAR`), és a kategóriát egy **feltételes kifejezéssel** (`x if felt else y`) válaszd ki, `if` utasítás nélkül.
- Nem pozitív súlynál vagy magasságnál `ValueError` legyen (ehhez kivételesen használhatsz `if`-et).

```python starter required
SOVANY_HATAR = 18.5
TULSULY_HATAR = 25


def bmi_jelentes(nev, suly_kg, magassag_cm):
    pass


print(bmi_jelentes("Anna", 62, 164.5))   # Anna: BMI 22.9 (normál)
```

<details>
<summary>Megoldás</summary>

```python solution
SOVANY_HATAR = 18.5
TULSULY_HATAR = 25


def bmi_jelentes(nev, suly_kg, magassag_cm):
    if suly_kg <= 0 or magassag_cm <= 0:
        raise ValueError("A súlynak és a magasságnak pozitívnak kell lennie.")
    bmi = suly_kg / (magassag_cm / 100) ** 2
    kategoria = "sovány" if bmi < SOVANY_HATAR else "normál" if bmi < TULSULY_HATAR else "túlsúlyos"
    return f"{nev}: BMI {bmi:.1f} ({kategoria})"


print(bmi_jelentes("Anna", 62, 164.5))   # Anna: BMI 22.9 (normál)
```

</details>

```python test
assert bmi_jelentes("Anna", 62, 164.5) == "Anna: BMI 22.9 (normál)", "A példa eredménye nem stimmel."
assert bmi_jelentes("Béla", 50, 180) == "Béla: BMI 15.4 (sovány)", "50 kg, 180 cm → 15.4, sovány"
assert bmi_jelentes("Csaba", 95, 175) == "Csaba: BMI 31.0 (túlsúlyos)", "95 kg, 175 cm → 31.0, túlsúlyos"
assert bmi_jelentes("Dóra", 75, 173.2) == "Dóra: BMI 25.0 (túlsúlyos)", "A 25 már túlsúlyos (25.0023…)."
try:
    bmi_jelentes("X", 70, 0)
    assert False, "0 magasságnál ValueError kell."
except ValueError:
    pass
```
