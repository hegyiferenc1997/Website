---
title: Gyakorlás – Python alapjai
summary: Ellenőrző kérdések és egy összefoglaló programozási feladat: szavak statisztikája.
minutes: 25
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
