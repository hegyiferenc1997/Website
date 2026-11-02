---
title: Gyakorlás – típusrendszerek
summary: Ellenőrző kérdések a típusrendszerekről, és feladatok típusjelölésekkel.
minutes: 15
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
