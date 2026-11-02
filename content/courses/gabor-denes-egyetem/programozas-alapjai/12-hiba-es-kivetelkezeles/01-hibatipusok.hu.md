---
title: Hibatípusok és a hibaüzenet olvasása
summary: Szintaktikai, futási és logikai hibák; a traceback értelmezése és a leggyakoribb Python kivételek.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a hibák három fő típusát: **szintaktikai**, **futási** és **logikai**,
- hogyan olvasd a **traceback**-et (hibaüzenetet),
- a leggyakoribb beépített **kivételtípusokat**.

## 1. Szintaktikai hiba

A kód nem felel meg a nyelv nyelvtanának. A Python **el sem indítja** a programot.

```python
if pont > 50
    print("átment")
# SyntaxError: expected ':'
```

Tipikus okok: hiányzó kettőspont, zárójel vagy idézőjel, elgépelt kulcsszó, rossz behúzás (`IndentationError`).

## 2. Futási hiba (kivétel)

A kód szintaktikailag helyes, de **futás közben** valami nem végrehajtható: nullával osztás, nem létező fájl, rossz típus. Ilyenkor a Python **kivételt** (exception) dob, és ha senki nem kezeli, a program leáll.

```python
szamok = [1, 2, 3]
print(szamok[5])
# IndexError: list index out of range
```

## 3. Logikai hiba

A program lefut, nincs hibaüzenet, de **rossz eredményt** ad. Ez a legalattomosabb, mert a gép nem jelzi – csak teszteléssel deríthető ki.

```python run
# Átlagot szeretnénk, de a zárójel lemaradt.
a, b = 4, 6
atlag = a + b / 2
print(atlag)   # 7.0 – hibás, az átlag 5.0
```

## A traceback olvasása

```python
def atlag(lista):
    return sum(lista) / len(lista)

def jelentes(adatok):
    print("Átlag:", atlag(adatok))

jelentes([])
```

```text
Traceback (most recent call last):
  File "program.py", line 7, in <module>
    jelentes([])
  File "program.py", line 5, in jelentes
    print("Átlag:", atlag(adatok))
  File "program.py", line 2, in atlag
    return sum(lista) / len(lista)
           ~~~~~~~~~~^~~~~~~~~~~~
ZeroDivisionError: division by zero
```

Olvasd **alulról felfelé**:

1. **Utolsó sor:** a kivétel típusa és oka – `ZeroDivisionError: division by zero`.
2. **Fölötte:** hol történt – a `program.py` 2. sorában, az `atlag` függvényben.
3. **Még feljebb:** a hívási lánc – a `jelentes` hívta az `atlag`-ot, a főprogram a `jelentes`-t. Így látod, honnan jött a rossz adat (üres lista).

## A leggyakoribb kivételek

| Kivétel             | Mikor keletkezik              | Példa                     |
| ------------------- | ----------------------------- | ------------------------- |
| `SyntaxError`       | nyelvtani hiba                | `if x > 1` (nincs `:`)    |
| `IndentationError`  | rossz behúzás                 | behúzatlan blokk          |
| `NameError`         | nem létező név                | elgépelt változónév       |
| `TypeError`         | rossz típusú művelet          | `"5" + 3`                 |
| `ValueError`        | jó típus, rossz érték         | `int("abc")`              |
| `ZeroDivisionError` | nullával osztás               | `10 / 0`                  |
| `IndexError`        | index a tartományon kívül     | `[1, 2][5]`               |
| `KeyError`          | nem létező szótárkulcs        | `{"a": 1}["b"]`           |
| `AttributeError`    | nem létező attribútum/metódus | `"szöveg".push("x")`      |
| `FileNotFoundError` | nem létező fájl               | `open("nincs.txt")`       |
| `RecursionError`    | túl mély rekurzió             | alapeset nélküli rekurzió |

```python run
# Kipróbálhatod: mindegyik kivételt elkapjuk és kiírjuk a típusát.
probak = [
    lambda: int("abc"),
    lambda: [1, 2][5],
    lambda: {"a": 1}["b"],
    lambda: "5" + 3,
    lambda: 10 / 0,
]
for proba in probak:
    try:
        proba()
    except Exception as hiba:
        print(type(hiba).__name__, "→", hiba)
```

## Kivételek hierarchiája

A kivételek osztályok, és **öröklődési hierarchiába** szerveződnek. Például a `ZeroDivisionError` az `ArithmeticError` leszármazottja, az pedig az `Exception`-é. Ez azért fontos, mert egy ős kivétel elkapása a leszármazottakat is elkapja.

```text
BaseException
 ├── KeyboardInterrupt       (Ctrl+C)
 └── Exception
      ├── ArithmeticError
      │    └── ZeroDivisionError
      ├── LookupError
      │    ├── IndexError
      │    └── KeyError
      ├── OSError
      │    └── FileNotFoundError
      ├── TypeError
      └── ValueError
```

## Összefoglalás

- **Szintaktikai** hiba: el sem indul; **futási** hiba: kivétel futás közben; **logikai** hiba: rossz eredmény hibaüzenet nélkül.
- A traceback-et **alulról** olvasd: típus → hely → hívási lánc.
- A kivételek osztályhierarchiát alkotnak; az ős elkapása a leszármazottakat is elkapja.

## A lecke feladata: Háromféle hiba egy programban

Az alábbi kódban mindhárom hibatípus előfordul. Futtasd le, olvasd el a traceback-et, és javítsd ki őket egyenként:

1. **szintaktikai hiba** – a program el sem indul;
2. **futási hiba** (kivétel) – szöveg és szám összefűzése;
3. **logikai hiba** – lefut, de rossz eredményt ad (az átlag nem stimmel).

A javított `atlag_szoveg(jegyek)` függvény ilyen szöveget adjon vissza: `"Az átlag: 4.0"` (üres listánál `"Nincs jegy"`).

```python starter required
def atlag_szoveg(jegyek)
    if len(jegyek) == 0:
        return "Nincs jegy"
    atlag = sum(jegyek) / (len(jegyek) - 1)
    return "Az átlag: " + atlag


print(atlag_szoveg([5, 4, 3]))   # Az átlag: 4.0
```

<details>
<summary>Megoldás</summary>

```python solution
def atlag_szoveg(jegyek):
    if len(jegyek) == 0:
        return "Nincs jegy"
    atlag = sum(jegyek) / len(jegyek)
    return "Az átlag: " + str(atlag)


print(atlag_szoveg([5, 4, 3]))   # Az átlag: 4.0
```

</details>

```python test
assert atlag_szoveg([5, 4, 3]) == "Az átlag: 4.0", "[5, 4, 3] → \"Az átlag: 4.0\" (logikai hiba: mennyivel osztasz?)"
assert atlag_szoveg([5]) == "Az átlag: 5.0", "Egyetlen jegynél is működjön (itt nullával osztana a hibás változat)."
assert atlag_szoveg([]) == "Nincs jegy", "Üres listára: Nincs jegy"
```
