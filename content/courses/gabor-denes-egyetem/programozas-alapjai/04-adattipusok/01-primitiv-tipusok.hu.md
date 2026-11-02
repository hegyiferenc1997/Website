---
title: Primitív adattípusok és literálok
summary: Egész, valós, logikai, szöveg és None – mit tárolnak, hogyan írjuk le őket, mennyi helyet foglalnak.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **adattípus**, és miért van rá szükség,
- melyek a Python **alaptípusai**, és hogyan felelnek meg más nyelvek primitív típusainak,
- mi a **literál**, és milyen formái vannak.

## Mi az adattípus?

A memóriában minden adat bitek sorozata. Az **adattípus** mondja meg, hogyan kell értelmezni ezeket a biteket, és milyen műveletek végezhetők az adattal. A `"5" + "5"` eredménye `"55"` (szövegek összefűzése), az `5 + 5` eredménye `10` (számok összeadása) – a típus határozza meg a jelentést.

Egy adattípus megadja:

- az **értékkészletet** (milyen értékeket vehet fel),
- a **műveleteket** (mit lehet vele csinálni),
- a **tárolás módját** (hány bájt, milyen kódolás).

## A Python alaptípusai

| Típus      | Jelentés                  | Literál példák                                 |
| ---------- | ------------------------- | ---------------------------------------------- |
| `int`      | egész szám                | `42`, `-7`, `0`, `1_000_000`, `0b1010`, `0xFF` |
| `float`    | valós (lebegőpontos) szám | `3.14`, `-0.5`, `2.0`, `1e6`, `2.5e-3`         |
| `bool`     | logikai érték             | `True`, `False`                                |
| `str`      | szöveg (karakterlánc)     | `"alma"`, `'körte'`, `"""több sor"""`          |
| `NoneType` | „nincs érték”             | `None`                                         |
| `complex`  | komplex szám              | `3 + 4j`                                       |

```python run
# A type() megmondja egy érték típusát.
print(type(42))        # <class 'int'>
print(type(3.14))      # <class 'float'>
print(type(True))      # <class 'bool'>
print(type("szia"))    # <class 'str'>
print(type(None))      # <class 'NoneType'>
print(type(3 + 4j))    # <class 'complex'>
```

## Literálok

A **literál** egy érték közvetlen leírása a forráskódban. A `42` egy egész literál, a `"alma"` egy szöveg literál.

```python run
# Egész literálok különböző számrendszerekben – mindegyik ugyanaz a szám.
print(255, 0b11111111, 0o377, 0xFF)

# Az aláhúzás csak az olvashatóságot segíti.
print(1_000_000)

# Normálalak (tudományos jelölés): 1.5 * 10^3 és 2 * 10^-4
print(1.5e3, 2e-4)

# Szöveg literálok: egyszeres, dupla és háromszoros idézőjel.
print('egy', "kettő")
print("""Ez egy
többsoros szöveg.""")
```

## Primitív típusok más nyelvekben

Statikusan típusos nyelvekben (C, Java, C#) a primitív típusoknak **fix méretük** van:

| Java / C# típus    | Méret              | Értéktartomány                   |
| ------------------ | ------------------ | -------------------------------- |
| `byte`             | 1 bájt             | −128 … 127 (Javában)             |
| `int`              | 4 bájt             | kb. −2,1 milliárd … 2,1 milliárd |
| `long`             | 8 bájt             | kb. ±9,2 · 10¹⁸                  |
| `float`            | 4 bájt             | kb. 7 értékes jegy               |
| `double`           | 8 bájt             | kb. 15–16 értékes jegy           |
| `char`             | 2 bájt             | egy Unicode karakter             |
| `boolean` / `bool` | 1 bájt (általában) | true, false                      |

Ha egy `int` értéke túllépi a tartományt, **túlcsordulás (overflow)** történik: a 2 147 483 647 + 1 hirtelen negatív lesz. Pythonban az `int` mérete **korlátlan** (csak a memória szab határt), ezért ott ez nem fordul elő:

```python run
print(2 ** 100)   # Pythonban gond nélkül kiszámolható
```

A Python `float` típusa a más nyelvekbeli `double`-nek felel meg (8 bájt, IEEE 754 szabvány).

> Pythonban valójában **minden érték objektum**, még a számok is. A „primitív típus” kifejezést itt az egyszerű, egyetlen értéket tároló típusokra (int, float, bool, str, None) használjuk.

## Összefoglalás

- Az adattípus meghatározza az értékkészletet, a műveleteket és a tárolás módját.
- Python alaptípusok: `int`, `float`, `bool`, `str`, `None`, `complex`.
- A **literál** az érték közvetlen leírása a kódban (`42`, `3.14`, `"alma"`, `True`).
- C/Java/C# primitív típusai fix méretűek és túlcsordulhatnak; a Python `int` korlátlan.

## A lecke feladata: Milyen típusú?

Írj `tipus_nev(ertek)` függvényt, amely magyarul megmondja egy érték típusát:

| Érték példa | Eredmény    |
| ----------- | ----------- |
| `42`        | `"egész"`   |
| `3.14`      | `"valós"`   |
| `True`      | `"logikai"` |
| `"alma"`    | `"szöveg"`  |
| `None`      | `"semmi"`   |
| bármi más   | `"egyéb"`   |

Vigyázz: Pythonban a `bool` az `int` „alesete”, ezért az `isinstance(True, int)` is igaz! Gondold át, milyen sorrendben vizsgálod a típusokat.

```python starter required
def tipus_nev(ertek):
    # isinstance(ertek, ...) vizsgálatok a megfelelő sorrendben
    pass


print(tipus_nev(42), tipus_nev(True))   # egész logikai
```

<details>
<summary>Megoldás</summary>

```python solution
def tipus_nev(ertek):
    if ertek is None:
        return "semmi"
    if isinstance(ertek, bool):      # a bool-t az int előtt kell vizsgálni!
        return "logikai"
    if isinstance(ertek, int):
        return "egész"
    if isinstance(ertek, float):
        return "valós"
    if isinstance(ertek, str):
        return "szöveg"
    return "egyéb"


print(tipus_nev(42), tipus_nev(True))   # egész logikai
```

</details>

```python test
assert tipus_nev(42) == "egész", "A 42 egész."
assert tipus_nev(-7) == "egész", "A -7 is egész."
assert tipus_nev(3.14) == "valós", "A 3.14 valós."
assert tipus_nev(True) == "logikai", "A True logikai – a bool-t az int előtt vizsgáld!"
assert tipus_nev(False) == "logikai", "A False is logikai."
assert tipus_nev("alma") == "szöveg", "Az \"alma\" szöveg."
assert tipus_nev(None) == "semmi", "A None: semmi."
assert tipus_nev([1, 2]) == "egyéb", "A lista: egyéb."
```
