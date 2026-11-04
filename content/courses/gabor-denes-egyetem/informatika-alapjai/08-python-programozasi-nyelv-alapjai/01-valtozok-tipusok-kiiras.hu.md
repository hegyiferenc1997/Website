---
title: Változók, típusok, kiírás
summary: Az első program, változók, alaptípusok (int, float, str, bool), műveletek, print és input.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- hogyan írsz ki valamit (`print`) és olvasol be (`input`),
- mi a **változó**, és melyek az **alaptípusok**,
- milyen **műveletek** vannak számokkal és szövegekkel.

## Miért Python?

A **Python** egyszerű, jól olvasható, értelmezett nyelv. Ma az egyik legnépszerűbb: adatelemzés, mesterséges intelligencia, webfejlesztés, automatizálás. Az oldalon a kódot **a böngészőben** futtathatod, telepítés nélkül. (Saját gépre a [python.org](https://www.python.org/)-ról vagy `winget install Python.Python.3.14` paranccsal telepítheted.)

## Az első program

```python run
print("Helló, világ!")
print("2 + 3 =", 2 + 3)
```

## Változók és típusok

A **változó** egy névvel ellátott érték. Az `=` **értékadás**: a jobb oldalt kiszámolja, és a bal oldali névhez köti.

```python run
nev = "Anna"          # str: szöveg
kor = 19              # int: egész szám
atlag = 4.25          # float: tört szám
hallgato = True       # bool: igaz/hamis
print(nev, kor, atlag, hallgato)
print(type(kor), type(atlag))
```

| Típus   | Jelentése     | Példa              |
| ------- | ------------- | ------------------ |
| `int`   | egész szám    | `42`, `-7`         |
| `float` | tört szám     | `3.14`, `0.5`      |
| `str`   | szöveg        | `"alma"`, `'Győr'` |
| `bool`  | logikai érték | `True`, `False`    |

## Műveletek

```python run
print(7 + 2, 7 - 2, 7 * 2)   # 9 5 14
print(7 / 2)                 # 3.5  (osztás, mindig float)
print(7 // 2, 7 % 2)         # 3 1  (egész osztás, maradék)
print(2 ** 10)               # 1024 (hatványozás)
print("ab" + "cd", "ha" * 3) # abcd hahaha
```

## Beolvasás

Az `input()` **mindig szöveget** ad vissza; számmá az `int()` vagy a `float()` alakítja.

```python run
szam = int(input("Adj meg egy számot: "))
print("A kétszerese:", szam * 2)
```

Az **f-string** kényelmesen illeszt értéket szövegbe:

```python run
nev, kor = "Béla", 20
print(f"{nev} {kor} éves, jövőre {kor + 1} lesz.")
```

## Összefoglalás

- `print` kiír, `input` beolvas (szöveget!), `int()`/`float()` számmá alakít.
- Alaptípusok: `int`, `float`, `str`, `bool`.
- Műveletek: `+ - * /`, `//` egész osztás, `%` maradék, `**` hatvány.

## A lecke feladata: másodpercek átváltása

Írd meg a `atvalt(mp)` függvényt, amely egy másodpercben megadott időt `"P perc M mp"` alakú szöveggé alakít. Például `atvalt(135)` eredménye `"2 perc 15 mp"`. Használd a `//` és a `%` műveletet!

```python starter required
def atvalt(mp):
    perc = 0      # egész osztás 60-nal
    marad = 0     # maradék 60-nal
    return f"{perc} perc {marad} mp"


print(atvalt(135))
```

<details>
<summary>Megoldás</summary>

```python solution
def atvalt(mp):
    perc = mp // 60
    marad = mp % 60
    return f"{perc} perc {marad} mp"


print(atvalt(135))
```

</details>

```python test
assert atvalt(135) == "2 perc 15 mp", "135 mp = 2 perc 15 mp"
assert atvalt(59) == "0 perc 59 mp", "59 mp = 0 perc 59 mp"
assert atvalt(3600) == "60 perc 0 mp", "3600 mp = 60 perc 0 mp"
```
