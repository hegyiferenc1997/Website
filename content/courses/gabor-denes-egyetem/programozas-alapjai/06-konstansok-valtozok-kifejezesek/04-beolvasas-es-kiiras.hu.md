---
title: Beolvasás és kiírás
summary: Az input() és a print() részletesen – számok beolvasása, több érték egy sorban, formázott kiírás.
minutes: 12
---

## Amit ebben a leckében megtanulsz

- hogyan olvasol be adatot a felhasználótól az `input()` függvénnyel,
- hogyan alakítod számmá a beolvasott szöveget,
- hogyan olvasol be **több értéket egy sorból**,
- hogyan írsz ki szépen formázott eredményt.

## Beolvasás

Az `input()` kiírja a megadott szöveget (a **promptot**), megvárja, hogy a felhasználó beírjon valamit és Entert nyomjon, majd a beírt szöveget **stringként** adja vissza.

```python run
nev = input("Hogy hívnak? ")
print("Szia,", nev)
```

## Számok beolvasása

Mivel az `input()` mindig szöveget ad, számoláshoz át kell alakítani:

```python run
a = int(input("Első szám: "))
b = int(input("Második szám: "))
print("Összegük:", a + b)

ar = float(input("Ár (Ft): "))
print("ÁFA-val:", ar * 1.27)
```

## Több érték egy sorban

Ha a felhasználó szóközzel elválasztva ír be több számot (pl. `3 7 12`):

```python run
sor = "3 7 12"            # (itt input() helyett rögzített szöveg, hogy kipróbálható legyen)
darabok = sor.split()      # ['3', '7', '12']
szamok = [int(d) for d in darabok]
print(szamok, sum(szamok))

# Rövidebben, ha pontosan tudjuk, hány érték jön:
x, y = map(int, "4 9".split())
print(x * y)
```

## Kiírás részletesen

```python run
print("a", "b", "c")                 # a b c
print("a", "b", "c", sep="")         # abc
print("a", "b", "c", sep=", ")       # a, b, c
for i in range(3):
    print(i, end=" ")                # egy sorba, szóközzel
print()                              # üres print = sortörés
```

## Formázott kiírás – táblázat

```python run
termekek = [("kenyér", 650, 2), ("tej", 420, 3), ("alma (kg)", 599.9, 1.5)]
print(f"{'Termék':<12}{'Ár':>8}{'Db':>6}{'Összesen':>12}")
print("-" * 38)
osszesen = 0
for nev, ar, db in termekek:
    sor_ar = ar * db
    osszesen += sor_ar
    print(f"{nev:<12}{ar:>8.1f}{db:>6}{sor_ar:>12.1f}")
print("-" * 38)
print(f"{'Fizetendő:':<26}{osszesen:>12.1f}")
```

A formátum leíró felépítése: `{érték:[igazítás][szélesség][.pontosság][típus]}`

| Leíró               | Jelentés                               |
| ------------------- | -------------------------------------- |
| `<10`, `>10`, `^10` | balra / jobbra / középre 10 karakteren |
| `.2f`               | valós szám 2 tizedesre                 |
| `05d`               | egész szám 5 jegyen, vezető nullákkal  |
| `,`                 | ezres elválasztó                       |
| `.1%`               | százalék 1 tizedesre                   |

## Összefoglalás

- Az `input(prompt)` szöveget ad vissza; számoláshoz `int()` vagy `float()` kell.
- Több érték egy sorból: `split()`, majd átalakítás (`map(int, …)`).
- A `print` `sep` és `end` paraméterekkel hangolható; a formázás f-stringgel a legegyszerűbb.

## A lecke feladata: Beolvasás és formázott kiírás

Írj `program()` függvényt, amely:

1. beolvassa a felhasználó **nevét** (`input("Neved: ")`),
2. beolvassa az **életkorát** egész számként (`int(input("Korod: "))`),
3. kiírja: `Szia, Anna! Jövőre 21 éves leszel.` (a beolvasott adatokkal).

A függvényt az ellenőrzés hívja meg „gépelt” válaszokkal. Ha te magad szeretnéd kipróbálni, írd a kód aljára, hogy `program()`, a **Bemenet** mezőbe pedig két sorba a nevet és a kort – az ellenőrzés előtt viszont ezt a sort töröld ki.

```python starter required
def program():
    # nev = input(...)
    # kor = int(input(...))
    # print(f"...")
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def program():
    nev = input("Neved: ")
    kor = int(input("Korod: "))
    print(f"Szia, {nev}! Jövőre {kor + 1} éves leszel.")
```

</details>

```python test
import builtins, contextlib, io
valaszok = iter(["Anna", "20"])
builtins.input = lambda kerdes="": next(valaszok)
kiiras = io.StringIO()
with contextlib.redirect_stdout(kiiras):
    program()
assert kiiras.getvalue().strip().endswith("Szia, Anna! Jövőre 21 éves leszel."), "Anna, 20 esetén: Szia, Anna! Jövőre 21 éves leszel."
```
