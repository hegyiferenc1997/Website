---
title: Gyakorlás – adattípusok
summary: Ellenőrző kérdések és feladatok számokkal, szövegekkel és típuskonverzióval.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

**1. Mi lesz a típusa és az értéke: a) `7 / 7`, b) `7 // 2`, c) `2 ** 3.0`, d) `"3" * 2`?**

<details>
<summary>Válasz</summary>

a) `1.0` (float), b) `3` (int), c) `8.0` (float), d) `"33"` (str).

</details>

**2. Miért `False` a `0.1 + 0.2 == 0.3`? Hogyan hasonlítanál helyesen?**

<details>
<summary>Válasz</summary>

A 0.1 és 0.2 kettes számrendszerben csak közelítőleg tárolható, így az összegük 0.30000000000000004. Helyesen: `math.isclose(0.1 + 0.2, 0.3)` vagy kerekítés.

</details>

**3. Mi az `int(7.9)` és a `round(7.9)` értéke?**

<details>
<summary>Válasz</summary>

`int(7.9)` → `7` (levágja a törtrészt), `round(7.9)` → `8`.

</details>

**4. Melyik hamis: `"0"`, `0`, `[]`, `" "`, `None`?**

<details>
<summary>Válasz</summary>

A `0`, a `[]` és a `None`. A `"0"` és a `" "` nem üres szövegek, ezért igazak.

</details>

**5. Mi a `"informatika"[2:6]` értéke?**

<details>
<summary>Válasz</summary>

`"form"` – a 2., 3., 4. és 5. indexű karakter (a 6. már nincs benne).

</details>

## Feladatok

### 1. feladat: Számjegyek összege

Írj `szamjegy_osszeg(n)` függvényt, amely egy pozitív egész szám számjegyeinek összegét adja vissza a `%` és `//` operátorokkal (szöveggé alakítás nélkül)!

```python starter
def szamjegy_osszeg(n):
    osszeg = 0
    # Amíg n > 0: vedd az utolsó számjegyet (n % 10), add hozzá, majd vágd le (n // 10).
    return osszeg
```

<details>
<summary>Megoldás</summary>

```python solution
def szamjegy_osszeg(n):
    osszeg = 0
    while n > 0:
        osszeg += n % 10
        n //= 10
    return osszeg
```

</details>

```python test
assert szamjegy_osszeg(2026) == 10
assert szamjegy_osszeg(7) == 7
assert szamjegy_osszeg(99999) == 45
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Monogram

Írj `monogram(teljes_nev)` függvényt, amely a szavak kezdőbetűiből nagybetűs monogramot készít, pontokkal: `"kiss anna"` → `"K.A."`.

```python starter
def monogram(teljes_nev):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def monogram(teljes_nev):
    return "".join(szo[0].upper() + "." for szo in teljes_nev.split())
```

</details>

```python test
assert monogram("kiss anna") == "K.A."
assert monogram("Nagy Béla Gábor") == "N.B.G."
assert monogram("  szabó   éva ") == "S.É."
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Palindrom

Írj `palindrom_e(szoveg)` függvényt, amely eldönti, hogy a szöveg visszafelé olvasva ugyanaz-e! A kis- és nagybetűk, valamint a szóközök ne számítsanak.

```python starter
def palindrom_e(szoveg):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def palindrom_e(szoveg):
    tiszta = szoveg.replace(" ", "").lower()
    return tiszta == tiszta[::-1]
```

</details>

```python test
assert palindrom_e("Indul a görög aludni") is True
assert palindrom_e("kerek") is True
assert palindrom_e("Python") is False
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Időtartam formázása

Írj `formaz(masodperc)` függvényt, amely a másodperceket `"óó:pp:mm"` alakú szöveggé alakítja, kétjegyű mezőkkel: `3725` → `"01:02:05"`. Tipp: `f"{x:02d}"`.

```python starter
def formaz(masodperc):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def formaz(masodperc):
    ora = masodperc // 3600
    perc = masodperc % 3600 // 60
    mp = masodperc % 60
    return f"{ora:02d}:{perc:02d}:{mp:02d}"
```

</details>

```python test
assert formaz(3725) == "01:02:05"
assert formaz(59) == "00:00:59"
assert formaz(86399) == "23:59:59"
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Biztonságos átalakítás

Írj `szamma(szoveg)` függvényt, amely a szöveget egész számmá alakítja, ha csak számjegyekből áll (a szélein lehet szóköz), különben `None`-t ad vissza. Kivételkezelés nélkül oldd meg (`strip`, `isdigit`)!

```python starter
def szamma(szoveg):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def szamma(szoveg):
    tiszta = szoveg.strip()
    if tiszta.isdigit():
        return int(tiszta)
    return None
```

</details>

```python test
assert szamma(" 42 ") == 42
assert szamma("4.2") is None
assert szamma("abc") is None
assert szamma("") is None
print("Minden ellenőrzés sikeres!")
```
