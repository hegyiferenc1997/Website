---
title: Gyakorlás – vezérlési szerkezetek
summary: Ellenőrző kérdések és feladatok elágazásokra, ciklusokra és a programozási tételekre.
minutes: 60
kind: practice
---

## Ellenőrző kérdések

**1. Hányszor fut le a ciklusmag? `for i in range(2, 11, 3):`**

<details>
<summary>Válasz</summary>

3-szor: i = 2, 5, 8 (a 11 már nincs benne).

</details>

**2. Mi a különbség az elöltesztelő és a hátultesztelő ciklus között?**

<details>
<summary>Válasz</summary>

Az elöltesztelő a kör előtt ellenőrzi a feltételt (lehet, hogy egyszer sem fut le), a hátultesztelő a kör végén (legalább egyszer lefut). Pythonban az utóbbit `while True` + `break` szerkezettel írjuk.

</details>

**3. Mit ír ki?**

```python
for i in range(5):
    if i == 3:
        break
    if i == 1:
        continue
    print(i)
```

<details>
<summary>Válasz</summary>

`0` és `2`. Az 1-nél a `continue` kihagyja a kiírást, a 3-nál a `break` befejezi a ciklust.

</details>

**4. Hányszor fut le a `print`, ha a külső ciklus 4-szer, a belső 5-ször fut?**

<details>
<summary>Válasz</summary>

4 · 5 = 20-szor.

</details>

**5. Melyik programozási tétel kell: „Van-e a listában negatív szám?”**

<details>
<summary>Válasz</summary>

Eldöntés (Pythonban: `any(x < 0 for x in lista)`).

</details>

## Feladatok

### 1. feladat: FizzBuzz

Írj `fizzbuzz(n)` függvényt, amely visszaad egy listát 1-től n-ig: a 3-mal osztható számok helyén `"Fizz"`, az 5-tel oszthatók helyén `"Buzz"`, a mindkettővel oszthatók helyén `"FizzBuzz"` álljon, a többi szám maradjon szám.

```python starter
def fizzbuzz(n):
    eredmeny = []
    # Írd ide a ciklust!
    return eredmeny
```

<details>
<summary>Megoldás</summary>

```python solution
def fizzbuzz(n):
    eredmeny = []
    for i in range(1, n + 1):
        if i % 15 == 0:          # előbb a szigorúbb feltétel!
            eredmeny.append("FizzBuzz")
        elif i % 3 == 0:
            eredmeny.append("Fizz")
        elif i % 5 == 0:
            eredmeny.append("Buzz")
        else:
            eredmeny.append(i)
    return eredmeny
```

</details>

```python test
assert fizzbuzz(5) == [1, 2, "Fizz", 4, "Buzz"]
assert fizzbuzz(15)[-1] == "FizzBuzz"
assert fizzbuzz(0) == []
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Prímszám

Írj `prim_e(n)` függvényt, amely eldönti, hogy `n` prímszám-e! (Prím: 1-nél nagyobb, és csak 1-gyel és önmagával osztható.) Elég a számokat a négyzetgyökéig vizsgálni.

```python starter
def prim_e(n):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def prim_e(n):
    if n < 2:
        return False
    oszto = 2
    while oszto * oszto <= n:
        if n % oszto == 0:
            return False
        oszto += 1
    return True
```

</details>

```python test
assert [x for x in range(20) if prim_e(x)] == [2, 3, 5, 7, 11, 13, 17, 19]
assert prim_e(97) is True
assert prim_e(1) is False
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Jegy a pontszámból

Írj `jegy(pont)` függvényt a következő skála szerint: 0–49 → 1, 50–62 → 2, 63–75 → 3, 76–88 → 4, 89–100 → 5. Érvénytelen pontszámra (0 alatt vagy 100 felett) adjon vissza `None`-t!

```python starter
def jegy(pont):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def jegy(pont):
    if pont < 0 or pont > 100:
        return None
    if pont >= 89:
        return 5
    elif pont >= 76:
        return 4
    elif pont >= 63:
        return 3
    elif pont >= 50:
        return 2
    return 1
```

</details>

```python test
assert [jegy(p) for p in [0, 49, 50, 62, 63, 75, 76, 88, 89, 100]] == [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
assert jegy(-1) is None and jegy(101) is None
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Leghosszabb szó

Írj `leghosszabb(szavak)` függvényt, amely a maximumkiválasztás tételével (a `max()` beépített függvény **nélkül**) visszaadja a leghosszabb szót. Egyenlő hosszúságnál az elsőt adja vissza.

```python starter
def leghosszabb(szavak):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def leghosszabb(szavak):
    legjobb = szavak[0]
    for szo in szavak[1:]:
        if len(szo) > len(legjobb):
            legjobb = szo
    return legjobb
```

</details>

```python test
assert leghosszabb(["alma", "barack", "kiwi"]) == "barack"
assert leghosszabb(["ab", "cd", "e"]) == "ab"
print("Minden ellenőrzés sikeres!")
```

### 5. feladat: Collatz-sorozat

Indulj egy pozitív egész `n`-ből: ha páros, felezd, ha páratlan, legyen `3n + 1`. Ismételd, amíg el nem éred az 1-et. Írj `collatz_lepesek(n)` függvényt, amely visszaadja, hány lépés kell az 1 eléréséhez!

```python starter
def collatz_lepesek(n):
    lepes = 0
    # while ciklus kell – nem tudjuk előre, hány lépés lesz!
    return lepes
```

<details>
<summary>Megoldás</summary>

```python solution
def collatz_lepesek(n):
    lepes = 0
    while n != 1:
        if n % 2 == 0:
            n //= 2
        else:
            n = 3 * n + 1
        lepes += 1
    return lepes
```

</details>

```python test
assert collatz_lepesek(1) == 0
assert collatz_lepesek(6) == 8
assert collatz_lepesek(27) == 111
print("Minden ellenőrzés sikeres!")
```

### 6. feladat: Kiválogatás és megszámlálás

Adott a hallgatók pontszáma egy szótárban. Írj `atmentek(pontok)` függvényt, amely a legalább 50 pontos hallgatók nevét adja vissza **ábécérendben**.

```python starter
def atmentek(pontok):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def atmentek(pontok):
    return sorted(nev for nev, pont in pontok.items() if pont >= 50)
```

</details>

```python test
assert atmentek({"Csilla": 92, "Anna": 50, "Béla": 49}) == ["Anna", "Csilla"]
assert atmentek({}) == []
print("Minden ellenőrzés sikeres!")
```

## Összefoglaló feladat: Zárthelyi-statisztika

A témakör összefoglaló feladata: elágazások, ciklusok és programozási tételek egyetlen programban.

Egy zárthelyi pontszámai (0–100) adottak. A jegyek: 0–49 → 1, 50–62 → 2, 63–75 → 3, 76–88 → 4, 89–100 → 5. Írj `zh_statisztika(pontok)` függvényt, amely egy szótárat ad vissza:

- `"eloszlas"`: ötelemű lista – hány darab 1-es, 2-es, …, 5-ös született,
- `"atlag"`: a jegyek átlaga két tizedesre kerekítve (üres listánál 0),
- `"legjobb"`: a legmagasabb pontszám (üres listánál `None`),
- `"bukott"`: a bukások (1-esek) száma,
- `"ervenytelen"`: a 0–100 tartományon kívüli pontszámok száma – ezek **nem** számítanak bele a többi értékbe.

Érdemes egy külön `jegy(pont)` segédfüggvényt írni.

```python starter required
def jegy(pont):
    pass


def zh_statisztika(pontok):
    eloszlas = [0, 0, 0, 0, 0]
    # ciklus a pontokon: érvénytelen? jegy → eloszlás, legjobb, jegyek összege
    pass


print(zh_statisztika([95, 40, 63, 77, 50, 101]))
```

<details>
<summary>Megoldás</summary>

```python solution
def jegy(pont):
    if pont >= 89:
        return 5
    if pont >= 76:
        return 4
    if pont >= 63:
        return 3
    if pont >= 50:
        return 2
    return 1


def zh_statisztika(pontok):
    eloszlas = [0, 0, 0, 0, 0]
    legjobb = None
    ervenytelen = 0
    for pont in pontok:
        if pont < 0 or pont > 100:
            ervenytelen += 1
            continue
        eloszlas[jegy(pont) - 1] += 1
        if legjobb is None or pont > legjobb:
            legjobb = pont
    darab = sum(eloszlas)
    jegyek_osszege = sum((i + 1) * db for i, db in enumerate(eloszlas))
    atlag = round(jegyek_osszege / darab, 2) if darab else 0
    return {
        "eloszlas": eloszlas,
        "atlag": atlag,
        "legjobb": legjobb,
        "bukott": eloszlas[0],
        "ervenytelen": ervenytelen,
    }


print(zh_statisztika([95, 40, 63, 77, 50, 101]))
```

</details>

```python test
e = zh_statisztika([95, 40, 63, 77, 50, 101])
assert e["eloszlas"] == [1, 1, 1, 1, 1], "Az eloszlás: egy-egy darab minden jegyből."
assert e["atlag"] == 3.0, "A jegyek átlaga 3.0 (a 101 nem számít)."
assert e["legjobb"] == 95, "A legjobb érvényes pontszám 95."
assert e["bukott"] == 1, "Egy bukás volt (40 pont)."
assert e["ervenytelen"] == 1, "Egy érvénytelen pontszám volt (101)."
e = zh_statisztika([88, 89, 49, -3])
assert e["eloszlas"] == [1, 0, 0, 1, 1] and e["atlag"] == 3.33, "88 → 4, 89 → 5, 49 → 1; átlag 3.33."
e = zh_statisztika([])
assert e == {"eloszlas": [0, 0, 0, 0, 0], "atlag": 0, "legjobb": None, "bukott": 0, "ervenytelen": 0}, "Üres listára az alapértékek."
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Számjegyek száma.** Írd meg a `szamjegyek_szama(n)` függvényt, amely egy egész szám számjegyeinek számát adja vissza `while` ciklussal, szöveggé alakítás nélkül! A negatív előjel nem számít, a `0` egyjegyű.

```python starter
def szamjegyek_szama(n):
    return 1
```

<details>
<summary>Megoldás</summary>

```python solution
def szamjegyek_szama(n):
    n = abs(n)
    db = 1
    while n >= 10:
        n //= 10                            # levágjuk az utolsó jegyet
        db += 1
    return db
```

</details>

```python test
assert szamjegyek_szama(0) == 1
assert szamjegyek_szama(7) == 1
assert szamjegyek_szama(12345) == 5
assert szamjegyek_szama(-900) == 3
assert szamjegyek_szama(10 ** 20) == 21
print("Minden ellenőrzés sikeres!")
```

**2.** **Érdemjegy szövegesen.** Írd meg a `jegy_szovegesen(jegy)` függvényt `match` utasítással: 1 → `"elégtelen"`, 2 → `"elégséges"`, 3 → `"közepes"`, 4 → `"jó"`, 5 → `"jeles"`, bármi más → `"ismeretlen"`!

```python starter
def jegy_szovegesen(jegy):
    return "ismeretlen"
```

<details>
<summary>Megoldás</summary>

```python solution
def jegy_szovegesen(jegy):
    match jegy:
        case 1:
            return "elégtelen"
        case 2:
            return "elégséges"
        case 3:
            return "közepes"
        case 4:
            return "jó"
        case 5:
            return "jeles"
        case _:                             # minden egyéb eset
            return "ismeretlen"
```

</details>

```python test
assert jegy_szovegesen(1) == "elégtelen"
assert jegy_szovegesen(3) == "közepes"
assert jegy_szovegesen(5) == "jeles"
assert jegy_szovegesen(0) == "ismeretlen"
assert jegy_szovegesen("5") == "ismeretlen"
print("Minden ellenőrzés sikeres!")
```

**3.** **Első negatív elem.** Írd meg az `elso_negativ_index(lista)` függvényt `for`–`else` szerkezettel: a ciklus `break`-kel álljon meg az első negatív elemnél, és adja vissza az indexét; ha nem volt negatív elem, az `else` ág adjon `-1`-et!

```python starter
def elso_negativ_index(lista):
    return -1
```

<details>
<summary>Megoldás</summary>

```python solution
def elso_negativ_index(lista):
    for i, elem in enumerate(lista):
        if elem < 0:
            break                           # megvan, kilépünk
    else:
        return -1                           # csak akkor fut, ha nem volt break
    return i
```

</details>

```python test
assert elso_negativ_index([3, 1, -2, -5]) == 2
assert elso_negativ_index([-1]) == 0
assert elso_negativ_index([1, 2, 3]) == -1
assert elso_negativ_index([]) == -1
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Hányszor fut le a `for i in range(2, 11, 3):` ciklus magja?
= 3
! Az értékek: 2, 5, 8 (a 11 már nem).

? Mikor fut le egy `for` ciklus `else` ága?
- mindig, a ciklus előtt
+ ha a ciklus `break` nélkül ért véget
- csak ha a ciklus egyszer sem futott
- ha kivétel történt
! Az `else` a „nem találtam” eset kezelésére jó.

? Mit csinál a `continue` utasítás?
- kilép a ciklusból
+ átugorja a ciklusmag hátralévő részét, és a következő körrel folytatja
- újraindítja a ciklust az elejéről
- leállítja a programot
! A `break` lép ki, a `continue` csak az aktuális kört fejezi be.

? Mennyi lesz `s` értéke? `s = 0` majd `for i in range(1, 5): s += i`
= 10
! 1 + 2 + 3 + 4 = 10.
```
