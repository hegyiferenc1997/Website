---
title: Gyakorlás – Python alapjai
summary: Ellenőrző kérdések és egy összefoglaló programozási feladat: szavak statisztikája.
minutes: 50
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért hibás a `kor = input("Kor: ")` után a `kor + 1` kifejezés?</summary>

Mert az `input` szöveget ad vissza, és szöveghez nem lehet számot adni (`TypeError`). Helyesen: `kor = int(input("Kor: "))`.

</details>

<details>
<summary>2. Mit ír ki: `print(17 // 5, 17 % 5, 17 / 5)`?</summary>

`3 2 3.4`: egész osztás, maradék és valós osztás.

</details>

<details>
<summary>3. Mi a különbség a `print` és a `return` között egy függvényben?</summary>

A `print` a képernyőre ír, de a függvény eredménye `None` marad; a `return` visszaadja az értéket a hívónak, aki tovább számolhat vele.

</details>

<details>
<summary>4. Mi az értéke a `[3, 1, 2][-1]` kifejezésnek?</summary>

`2`: a `-1` index az utolsó elemet jelenti.

</details>

```python run
# Kis összefoglaló: lista, ciklus, elágazás, függvény
def ruhazat(homerseklet):
    if homerseklet >= 25:
        return "póló"
    if homerseklet >= 15:
        return "pulóver"
    if homerseklet >= 5:
        return "kabát"
    return "téli kabát és sapka"

for t in [28, 18, 7, -3]:
    print(t, "°C →", ruhazat(t))
```

## Összefoglaló feladat: szavak statisztikája

Írd meg a `statisztika(szoveg)` függvényt, amely egy szöveget kap, és egy **három elemű listát** ad vissza: `[szavak száma, a leghosszabb szó, a szavak átlagos hossza két tizedesre kerekítve]`. A szavakat szóközök választják el (használd a `szoveg.split()` metódust). Ha több egyformán leghosszabb szó van, az elsőt add vissza. Például `statisztika("a kutya ugat")` eredménye `[3, "kutya", 3.33]`.

Tipp: `round(x, 2)` két tizedesre kerekít.

```python starter required
def statisztika(szoveg):
    szavak = szoveg.split()
    db = 0
    leghosszabb = ""
    atlag = 0
    return [db, leghosszabb, atlag]


print(statisztika("a kutya ugat"))
```

<details>
<summary>Megoldás</summary>

```python solution
def statisztika(szoveg):
    szavak = szoveg.split()
    db = len(szavak)
    leghosszabb = ""
    osszes = 0
    for szo in szavak:
        osszes += len(szo)
        if len(szo) > len(leghosszabb):
            leghosszabb = szo
    atlag = round(osszes / db, 2)
    return [db, leghosszabb, atlag]


print(statisztika("a kutya ugat"))
```

</details>

```python test
assert statisztika("a kutya ugat") == [3, "kutya", 3.33], "3 szó, a leghosszabb a kutya, átlag 3.33"
assert statisztika("Python") == [1, "Python", 6.0], "egyetlen szó"
assert statisztika("ez egy jo nap ma") == [5, "egy", 2.4], "egyforma hosszúaknál az első"
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Számolós programozási feladatok

**1.** **Szógyakoriság.** Írd meg a `leggyakoribb(szoveg)` függvényt, amely visszaadja a szövegben leggyakrabban előforduló szót (kisbetűsítve, a `.,!?` írásjeleket a szavak végéről levágva)! Egyenlőségnél az előbb előforduló szó nyerjen.

```python starter
def leggyakoribb(szoveg):
    return szoveg.split()[0]
```

<details>
<summary>Megoldás</summary>

```python solution
def leggyakoribb(szoveg):
    db = {}
    for szo in szoveg.split():
        szo = szo.strip(".,!?").lower()
        db[szo] = db.get(szo, 0) + 1        # a szótár megőrzi a beszúrás sorrendjét
    return max(db, key=db.get)
```

</details>

```python test
assert leggyakoribb("A kutya és a macska, meg a ló.") == "a"
assert leggyakoribb("Python! python? Java.") == "python"
assert leggyakoribb("egy kettő") == "egy"
print("Minden ellenőrzés sikeres!")
```

**2.** **Biztonságos átváltás.** Írd meg az `ervenyes_jegyek(szovegek)` függvényt, amely egy szöveglista elemei közül visszaadja azokat egész számként, amelyek érvényes jegyek (1 és 5 közötti egészek)! A hibás elemeket (nem szám, tartományon kívüli) hagyd ki, a program ne álljon le.

```python starter
def ervenyes_jegyek(szovegek):
    return [int(s) for s in szovegek]
```

<details>
<summary>Megoldás</summary>

```python solution
def ervenyes_jegyek(szovegek):
    jo = []
    for s in szovegek:
        try:
            j = int(s.strip())
        except ValueError:
            continue                          # nem egész szám: kihagyjuk
        if 1 <= j <= 5:
            jo.append(j)
    return jo
```

</details>

```python test
assert ervenyes_jegyek(["5", "öt", "3", "", "7", " 2 ", "-1"]) == [5, 3, 2]
assert ervenyes_jegyek([]) == []
assert ervenyes_jegyek(["4.5", "1"]) == [1]
print("Minden ellenőrzés sikeres!")
```

**3.** **Csoportátlagok.** Írd meg a `csoport_atlagok(jegyek)` függvényt, amely egy `{név: [jegyek]}` szótárból `{név: átlag}` szótárat készít (2 tizedesre kerekítve)! Ha valakinek nincs jegye, az átlaga legyen 0.

```python starter
def csoport_atlagok(jegyek):
    return {nev: sum(j) / len(j) for nev, j in jegyek.items()}
```

<details>
<summary>Megoldás</summary>

```python solution
def csoport_atlagok(jegyek):
    return {nev: round(sum(j) / len(j), 2) if j else 0 for nev, j in jegyek.items()}   # üres listánál 0
```

</details>

```python test
assert csoport_atlagok({"Anna": [5, 4, 5], "Bence": [2, 3]}) == {"Anna": 4.67, "Bence": 2.5}
assert csoport_atlagok({"Dani": []}) == {"Dani": 0}
assert csoport_atlagok({}) == {}
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit ír ki a `print(len("Hello"))` utasítás?
= 5
! A szöveg 5 karakterből áll.

? Mi a `[x * 2 for x in range(4)]` eredménye?
+ `[0, 2, 4, 6]`
- `[2, 4, 6, 8]`
- `[0, 1, 2, 3]`
- `[0, 2, 4, 6, 8]`
! A `range(4)` a 0, 1, 2, 3 számokat adja.

? Mi történik, ha egy szótárban nem létező kulcsot kérsz le `szotar[kulcs]` alakban?
- `None`-t kapsz
+ `KeyError` hibát kapsz
- a program a kulcsot automatikusan létrehozza
- üres szöveget kapsz
! A `get(kulcs, alapérték)` nem dob hibát.

? Mennyi a `17 // 5` és a `17 % 5` értéke?
- 3,4 és 2
+ 3 és 2
- 3 és 3
- 2 és 3
! Egész osztás és maradék.
```
