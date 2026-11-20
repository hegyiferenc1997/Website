---
title: Gyakorlás – típusrendszerek
summary: Ellenőrző kérdések a típusrendszerekről, és feladatok típusjelölésekkel.
minutes: 40
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség a statikus és a dinamikus típusosság között?**

<details>
<summary>Válasz</summary>

Statikus típusosságnál a változók típusa fordításkor ismert és ellenőrzött; dinamikusnál a típus az értékhez tartozik, és futáskor ellenőrződik.

</details>

**2. Mit ír ki JavaScriptben a `"5" + 3`, és mit csinál Pythonban? Mit mutat ez meg?**

<details>
<summary>Válasz</summary>

JavaScriptben `"53"`, Pythonban `TypeError`. Ez az erős (Python) és gyenge (JavaScript) típusosság különbsége.

</details>

**3. Helyezd el a táblázatban: Java, Python, JavaScript, C!**

<details>
<summary>Válasz</summary>

Java: statikus + erős; Python: dinamikus + erős; JavaScript: dinamikus + gyenge; C: statikus + (viszonylag) gyenge.

</details>

**4. Ellenőrzi-e a Python futáskor a típusjelöléseket?**

<details>
<summary>Válasz</summary>

Nem. A jelöléseket külső eszközök (mypy, Pylance) használják futtatás nélküli ellenőrzésre.

</details>

## Feladatok

### 1. feladat: Típusjelölések

Lásd el típusjelölésekkel a függvényt: egészek listáját kapja, és a páros elemek listáját adja vissza.

```python starter
def parosak(szamok):
    return [x for x in szamok if x % 2 == 0]
```

<details>
<summary>Megoldás</summary>

```python solution
def parosak(szamok: list[int]) -> list[int]:
    return [x for x in szamok if x % 2 == 0]
```

</details>

```python test
assert parosak([1, 2, 3, 4]) == [2, 4]
assert parosak.__annotations__ == {"szamok": list[int], "return": list[int]}
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Saját típusellenőrzés

Mivel a Python nem ellenőrzi a jelöléseket, írj `biztos_osszeg(a, b)` függvényt, amely `TypeError`-t dob, ha bármelyik paraméter nem `int` vagy `float`, különben visszaadja az összegüket! (`isinstance`, `raise TypeError("...")`)

```python starter
def biztos_osszeg(a, b):
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def biztos_osszeg(a, b):
    for x in (a, b):
        if not isinstance(x, (int, float)):
            raise TypeError(f"Szám kell, nem {type(x).__name__}")
    return a + b
```

</details>

```python test
assert biztos_osszeg(2, 3.5) == 5.5
try:
    biztos_osszeg("2", 3)
    assert False, "TypeError-t kellett volna dobni"
except TypeError:
    pass
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: Mi lesz a típus?

Futtatás nélkül gondold végig, milyen típusú lesz `x` az egyes sorok után, majd ellenőrizd a kód futtatásával!

```python run
x = 10
print(type(x).__name__)
x = x / 2
print(type(x).__name__)
x = str(x) + "!"
print(type(x).__name__)
x = len(x) > 3
print(type(x).__name__)
```

<details>
<summary>Válasz</summary>

`int`, `float` (az osztás mindig float), `str`, `bool`.

</details>

## Összefoglaló feladat: Futásidejű típusellenőrző

A témakör összefoglaló feladata. A Python futás közben **nem** ellenőrzi a típusjelöléseket – most te teszed meg!

Írj `ellenorzott_hivas(fuggveny, *ertekek)` függvényt, amely:

1. a `fuggveny.__annotations__` alapján sorban végignézi a paraméterek jelölt típusát (a `"return"` kulcsot hagyd ki),
2. ha egy érték nem a jelölt típusú (`isinstance`), `TypeError`-t dob, amelynek üzenetében benne van a paraméter neve,
3. ha minden rendben, meghívja a függvényt az értékekkel, és visszaadja az eredményét – de előtte azt is ellenőrzi, hogy a visszatérési érték a `"return"` jelölés szerinti típusú-e (ha van ilyen jelölés).

Elég az egyszerű típusokat (`int`, `str`, `float`, `bool`, `list`) kezelni.

```python starter required
def ellenorzott_hivas(fuggveny, *ertekek):
    jelolesek = dict(fuggveny.__annotations__)
    vissza_tipus = jelolesek.pop("return", None)
    # zip(jelolesek.items(), ertekek) → (név, típus), érték párok
    pass


def duplaz(x: int) -> int:
    return 2 * x


print(ellenorzott_hivas(duplaz, 21))   # 42
```

<details>
<summary>Megoldás</summary>

```python solution
def ellenorzott_hivas(fuggveny, *ertekek):
    jelolesek = dict(fuggveny.__annotations__)
    vissza_tipus = jelolesek.pop("return", None)
    for (nev, tipus), ertek in zip(jelolesek.items(), ertekek):
        if not isinstance(ertek, tipus):
            raise TypeError(f"A(z) {nev} paraméter típusa {tipus.__name__} kellene legyen, nem {type(ertek).__name__}.")
    eredmeny = fuggveny(*ertekek)
    if vissza_tipus is not None and not isinstance(eredmeny, vissza_tipus):
        raise TypeError(f"A visszatérési érték típusa {vissza_tipus.__name__} kellene legyen.")
    return eredmeny


def duplaz(x: int) -> int:
    return 2 * x


print(ellenorzott_hivas(duplaz, 21))   # 42
```

</details>

```python test
def duplaz(x: int) -> int:
    return 2 * x

def udvozol(nev: str, szor: int) -> str:
    return ("Szia " + nev + "! ") * szor

def hibas(x: int) -> str:
    return x

assert ellenorzott_hivas(duplaz, 21) == 42, "Jó típusnál a függvény eredményét kell visszaadni."
assert ellenorzott_hivas(udvozol, "Anna", 2) == "Szia Anna! Szia Anna! ", "Több paraméterrel is működjön."
try:
    ellenorzott_hivas(udvozol, "Anna", "2")
    assert False, "Rossz típusú paraméternél TypeError kell."
except TypeError as h:
    assert "szor" in str(h), "A hibaüzenetben legyen benne a paraméter neve (szor)."
try:
    ellenorzott_hivas(hibas, 5)
    assert False, "Rossz típusú visszatérési értéknél TypeError kell."
except TypeError:
    pass
```

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. A programozós feladatoknál írd meg a függvényt, majd futtasd az ellenőrzést; mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

### Programozási feladatok

**1.** **Típusnevek.** Írd meg a `tipus_nevek(lista)` függvényt, amely egy lista minden eleméhez a típusa nevét adja vissza (pl. `"int"`, `"str"`)! Használd a `type(x).__name__` kifejezést.

```python starter
def tipus_nevek(lista):
    return ["int" for _ in lista]
```

<details>
<summary>Megoldás</summary>

```python solution
def tipus_nevek(lista):
    return [type(elem).__name__ for elem in lista]   # a típus neve szövegként
```

</details>

```python test
assert tipus_nevek([1, "a", 2.5, True, None]) == ["int", "str", "float", "bool", "NoneType"]
assert tipus_nevek([]) == []
assert tipus_nevek([[1], (1,), {1: 2}]) == ["list", "tuple", "dict"]
print("Minden ellenőrzés sikeres!")
```

**2.** **Biztonságos átalakítás.** Írd meg a `biztos_int(ertek, alap=0)` függvényt, amely megpróbálja egész számmá alakítani az értéket (`int(ertek)`), és ha ez nem sikerül (`ValueError` vagy `TypeError`), az `alap` értéket adja vissza!

```python starter
def biztos_int(ertek, alap=0):
    return int(ertek)
```

<details>
<summary>Megoldás</summary>

```python solution
def biztos_int(ertek, alap=0):
    try:
        return int(ertek)
    except (ValueError, TypeError):         # rossz szöveg vagy nem átalakítható típus
        return alap
```

</details>

```python test
assert biztos_int("42") == 42
assert biztos_int(" -7 ") == -7
assert biztos_int("hat") == 0
assert biztos_int(None, -1) == -1
assert biztos_int("3.5", 99) == 99
assert biztos_int(3.9) == 3
print("Minden ellenőrzés sikeres!")
```

**3.** **Séma-ellenőrzés.** Írd meg az `ellenoriz_tipusokat(adat, sema)` függvényt! A `sema` egy szótár, amely mezőnévhez típust rendel (pl. `{"nev": str, "kor": int}`). Add vissza azon mezők nevét ábécérendben, amelyek hiányoznak az `adat` szótárból vagy rossz típusúak! A `bool` ne számítson `int`-nek.

```python starter
def ellenoriz_tipusokat(adat, sema):
    return []
```

<details>
<summary>Megoldás</summary>

```python solution
def ellenoriz_tipusokat(adat, sema):
    hibas = []
    for mezo, tipus in sema.items():
        ertek = adat.get(mezo)
        rossz_bool = isinstance(ertek, bool) and tipus is not bool   # a bool az int alosztálya
        if mezo not in adat or not isinstance(ertek, tipus) or rossz_bool:
            hibas.append(mezo)
    return sorted(hibas)
```

</details>

```python test
sema = {"nev": str, "kor": int, "aktiv": bool}
assert ellenoriz_tipusokat({"nev": "Anna", "kor": 20, "aktiv": True}, sema) == []
assert ellenoriz_tipusokat({"nev": "Anna", "kor": "20", "aktiv": True}, sema) == ["kor"]
assert ellenoriz_tipusokat({"kor": True, "aktiv": 1}, sema) == ["aktiv", "kor", "nev"]
print("Minden ellenőrzés sikeres!")
```

### Gyors ellenőrző kérdések

```quiz
? Mit ad vissza a `type(3 / 1).__name__` kifejezés?
- int
+ float
- str
- number
! A `/` mindig lebegőpontos osztás, így 3.0 lesz.

? Mennyi `int("101", 2)` értéke?
= 5
! A második paraméter a számrendszer alapja: 101 kettesben 5.

? Mit ad az `isinstance(True, int)`?
+ True
- False
- hibát dob
- None
! Pythonban a `bool` az `int` alosztálya, ezért külön kell kezelni, ha meg akarjuk különböztetni.

? Mennyi `len(str(12345))` értéke?
= 5
! A szám szöveggé alakítva 5 karakter.
```
