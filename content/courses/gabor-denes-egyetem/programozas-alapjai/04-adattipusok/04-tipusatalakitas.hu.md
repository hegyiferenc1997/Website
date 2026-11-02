---
title: Típusok közötti átalakítások
summary: Automatikus (implicit) és kézi (explicit) típuskonverzió, igazságérték, és a beolvasott szöveg számmá alakítása.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **implicit** és az **explicit** típuskonverzió,
- hogyan használod az `int()`, `float()`, `str()`, `bool()` függvényeket,
- milyen értékek számítanak **igaznak** és **hamisnak**,
- hogyan ellenőrzöd egy érték típusát.

## Implicit (automatikus) konverzió

Bizonyos esetekben a Python magától átalakítja a típust, ha ezzel nem vész el információ:

```python run
print(3 + 2.5)      # 5.5   – az int automatikusan float lesz
print(True + 1)     # 2     – a True 1-nek, a False 0-nak számít
print(7 / 2)        # 3.5   – az osztás eredménye float
```

Szöveget és számot viszont **nem** alakít át magától – ez szándékos, mert nem egyértelmű, mit szeretnél:

```python
print("Életkor: " + 20)   # TypeError: can only concatenate str (not "int") to str
```

## Explicit (kézi) konverzió

| Függvény   | Mivé alakít   | Példák                                                       |
| ---------- | ------------- | ------------------------------------------------------------ |
| `int(x)`   | egész szám    | `int("42")` → `42`, `int(3.99)` → `3` (levágja a törtrészt!) |
| `float(x)` | valós szám    | `float("3.5")` → `3.5`, `float(2)` → `2.0`                   |
| `str(x)`   | szöveg        | `str(20)` → `"20"`, `str(3.5)` → `"3.5"`                     |
| `bool(x)`  | logikai érték | `bool(0)` → `False`, `bool("a")` → `True`                    |

```python run
eletkor = 20
print("Életkor: " + str(eletkor))   # helyesen: szöveggé alakítva
print(f"Életkor: {eletkor}")        # még egyszerűbb: f-string

print(int("42") + 8)    # 50
print(int(3.99))        # 3 – nem kerekít, hanem levág!
print(round(3.99))      # 4 – ha kerekíteni szeretnél
print(int("ff", 16))    # 255 – szöveg átalakítása 16-os számrendszerből
```

## Beolvasás: mindig szöveg!

Az `input()` függvény **mindig stringet** ad vissza, akkor is, ha a felhasználó számot írt be. Számoláshoz át kell alakítani.

```python run
szoveg = input("Adj meg egy számot: ")   # pl. "5"
print(type(szoveg))                      # <class 'str'>
szam = int(szoveg)
print(szam * 2)                          # 10 (és nem "55")
```

Ha a szöveg nem alakítható számmá, `ValueError` keletkezik:

```python
int("öt")     # ValueError: invalid literal for int() with base 10: 'öt'
int("3.5")    # ValueError – egész helyett valós számot írt be
```

Ennek kezelését a **Hiba- és kivételkezelés** témakörben tanuljuk.

## Igazságérték (truthiness)

Minden érték logikai értékké alakítható. **Hamisnak** számít:

- `False`, `None`,
- a nulla: `0`, `0.0`,
- az üres gyűjtemények: `""`, `[]`, `{}`, `()`, `set()`.

Minden más **igaz**.

```python run
for ertek in [0, 1, -3, "", "0", [], [0], None]:
    print(repr(ertek), "→", bool(ertek))
```

Ezért írhatjuk ezt:

```python run
nev = ""
if not nev:
    print("Nem adtál meg nevet.")
```

## Típus ellenőrzése

```python run
x = 3.5
print(type(x))                  # <class 'float'>
print(type(x) == float)         # True
print(isinstance(x, float))     # True – ez az ajánlott módszer
print(isinstance(x, (int, float)))   # True – több típus közül bármelyik
```

## Összefoglalás

- **Implicit** konverzió csak „biztonságos” esetben történik (int → float); szöveg és szám között nem.
- **Explicit** konverzió: `int()`, `float()`, `str()`, `bool()`. Az `int()` levág, nem kerekít!
- Az `input()` mindig szöveget ad.
- Hamis érték: `False`, `None`, `0`, üres szöveg/gyűjtemény; minden más igaz.

## A lecke feladata: Számok egy szöveges sorból

Egy fájlból vagy a billentyűzetről beolvasott adat mindig **szöveg**. Írj `osszeg_szovegbol(sor)` függvényt, amely egy vesszővel elválasztott számsort (pl. `"3, 4.5, 10"`) összead, és **valós számként** adja vissza az összeget (`17.5`).

- A számok körül lehetnek szóközök.
- Az üres elemeket (pl. `"1,,2"` vagy üres sor) hagyd ki.
- Ha egy elem nem szám, dobjon `ValueError`-t (ezt a `float()` magától megteszi).

```python starter required
def osszeg_szovegbol(sor):
    osszeg = 0.0
    for darab in sor.split(","):
        # darab.strip(), üres kihagyása, float() átalakítás
        pass
    return osszeg


print(osszeg_szovegbol("3, 4.5, 10"))   # 17.5
```

<details>
<summary>Megoldás</summary>

```python solution
def osszeg_szovegbol(sor):
    osszeg = 0.0
    for darab in sor.split(","):
        darab = darab.strip()
        if darab:
            osszeg += float(darab)
    return osszeg


print(osszeg_szovegbol("3, 4.5, 10"))   # 17.5
```

</details>

```python test
assert osszeg_szovegbol("3, 4.5, 10") == 17.5, "3 + 4.5 + 10 = 17.5"
assert osszeg_szovegbol("1,,2") == 3.0, "Az üres elemet ki kell hagyni."
assert osszeg_szovegbol("") == 0.0, "Üres sorra 0.0 az eredmény."
assert isinstance(osszeg_szovegbol("2"), float), "Valós számot (float) adj vissza."
assert osszeg_szovegbol(" -1.5 , 1 ") == -0.5, "Negatív számok és szóközök is lehetnek."
try:
    osszeg_szovegbol("1, kettő")
    assert False, "Nem szám elemnél ValueError kell."
except ValueError:
    pass
```
