---
title: Gyakorlás – futtatási környezetek
summary: Ellenőrző kérdések, parancssori számológép, beállítások környezeti változókból és requirements.txt feldolgozása.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

**1. Mi a különbség a REPL és egy szkript futtatása között?**

<details>
<summary>Válasz</summary>

A REPL (interaktív mód) soronként azonnal kiértékeli és kiírja a kifejezéseket, de a kód kilépéskor elvész. A szkript egy `.py` fájl, amelyet az interpreter elejétől a végéig lefuttat; az eredmény csak `print()`-tel jelenik meg, a kód viszont megmarad.

</details>

**2. Mi lesz a `__name__` értéke, ha a `szamitas.py` fájlt egy másik program importálja?**

<details>
<summary>Válasz</summary>

`"szamitas"` (a modul neve). Csak közvetlen futtatáskor `"__main__"`, ezért az `if __name__ == "__main__":` blokk importáláskor nem fut le.

</details>

**3. Miért érdemes minden projekthez külön virtuális környezetet létrehozni?**

<details>
<summary>Válasz</summary>

Mert így a projektek csomagjai és azok verziói nem akadnak össze: mindegyik projekt a saját függőségeit használja, és a `requirements.txt` alapján bárhol pontosan újra létrehozható.

</details>

**4. Mi a különbség a JVM-en futó Java és a natívra fordított C program hordozhatósága között?**

<details>
<summary>Válasz</summary>

A Java bájtkód bármely gépen fut, ahol van JVM („írd meg egyszer, futtasd bárhol”). A C programot minden platformra (processzor + operációs rendszer) külön le kell fordítani.

</details>

**5. Milyen problémát old meg a Docker-konténer?**

<details>
<summary>Válasz</summary>

Az „én gépemen működik” problémát: a konténer a programot a teljes futtatókörnyezetével (interpreter, könyvtárak, beállítások) együtt csomagolja, így bárhol ugyanúgy fut.

</details>

**6. Miért nem írjuk bele a jelszavakat és API-kulcsokat a forráskódba?**

<details>
<summary>Válasz</summary>

Mert a kód gyakran nyilvános helyre (pl. Gitre) kerül, és onnan bárki kiolvashatná. A titkokat környezeti változóban (vagy titokkezelőben) adjuk át, a program futás közben olvassa be őket.

</details>

## Feladatok

### 1. feladat: Parancssori számológép

Írj `szamologep(argv)` függvényt, amely az `argparse` segítségével feldolgoz egy `szam1 muvelet szam2` alakú argumentumlistát (pl. `["3", "+", "4.5"]`), és visszaadja az eredményt `float`-ként. Támogatott műveletek: `+`, `-`, `*`, `/`. Nullával osztáskor dobjon `ZeroDivisionError`-t.

```python starter
import argparse

def szamologep(argv):
    parser = argparse.ArgumentParser(description="Egyszerű számológép")
    # TODO: argumentumok felvétele és a művelet elvégzése
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
import argparse
import operator

# A műveleti jelekhez tartozó függvények.
MUVELETEK = {"+": operator.add, "-": operator.sub, "*": operator.mul, "/": operator.truediv}

def szamologep(argv):
    """Kiszámolja a parancssorban megadott kifejezést, pl. 3 + 4.5."""
    parser = argparse.ArgumentParser(description="Egyszerű számológép")
    parser.add_argument("szam1", type=float)
    parser.add_argument("muvelet", choices=MUVELETEK.keys())
    parser.add_argument("szam2", type=float)
    args = parser.parse_args(argv)
    return MUVELETEK[args.muvelet](args.szam1, args.szam2)

if __name__ == "__main__":
    print(szamologep(["3", "+", "4.5"]))
```

</details>

```python test
assert szamologep(["3", "+", "4.5"]) == 7.5
assert szamologep(["10", "-", "4"]) == 6.0
assert szamologep(["2", "*", "8"]) == 16.0
assert szamologep(["9", "/", "2"]) == 4.5
try:
    szamologep(["1", "/", "0"])
    assert False, "ZeroDivisionError-t vártunk"
except ZeroDivisionError:
    pass
print("Minden ellenőrzés sikeres!")
```

### 2. feladat: Beállítások környezeti változókból

Írj `beallitas(nev, alapertek)` függvényt, amely a `nev` környezeti változó értékét adja vissza **az alapérték típusára alakítva** (`int`, `float`, `bool` vagy `str`). Ha a változó nincs beállítva, az alapértéket adja vissza. `bool` esetén az `"1"`, `"true"`, `"igen"` (kis- és nagybetűtől függetlenül) jelent igazat.

```python starter
import os

def beallitas(nev, alapertek):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
import os

IGAZ_ERTEKEK = {"1", "true", "igen"}

def beallitas(nev, alapertek):
    """Környezeti változó beolvasása az alapérték típusára alakítva."""
    ertek = os.environ.get(nev)
    if ertek is None:
        return alapertek
    # A bool-t az int előtt kell vizsgálni, mert a bool az int altípusa.
    if isinstance(alapertek, bool):
        return ertek.strip().lower() in IGAZ_ERTEKEK
    if isinstance(alapertek, int):
        return int(ertek)
    if isinstance(alapertek, float):
        return float(ertek)
    return ertek
```

</details>

```python test
os.environ["EM_PORT"] = "8080"
os.environ["EM_ARANY"] = "0.25"
os.environ["EM_DEBUG"] = "Igen"
os.environ["EM_NEV"] = "teszt"
assert beallitas("EM_PORT", 3000) == 8080
assert beallitas("EM_ARANY", 1.0) == 0.25
assert beallitas("EM_DEBUG", False) is True
assert beallitas("EM_NEV", "alap") == "teszt"
assert beallitas("EM_NINCS_ILYEN", 42) == 42
os.environ["EM_DEBUG"] = "nem"
assert beallitas("EM_DEBUG", True) is False
print("Minden ellenőrzés sikeres!")
```

### 3. feladat: requirements.txt feldolgozása

Írj `fuggosegek(szoveg)` függvényt, amely egy `requirements.txt` tartalmából szótárt készít: kulcs a csomag neve **kisbetűvel**, érték a rögzített verzió (`==` után), vagy `None`, ha nincs megadva. Az üres sorokat és a `#`-tal kezdődő kommenteket (a sor végi kommenteket is) hagyja figyelmen kívül.

```python starter
def fuggosegek(szoveg):
    # TODO
    pass
```

<details>
<summary>Megoldás</summary>

```python solution
def fuggosegek(szoveg):
    """requirements.txt tartalma → {csomagnév: verzió vagy None}."""
    eredmeny = {}
    for sor in szoveg.splitlines():
        sor = sor.split("#", 1)[0].strip()  # komment levágása
        if not sor:
            continue
        if "==" in sor:
            nev, verzio = sor.split("==", 1)
            eredmeny[nev.strip().lower()] = verzio.strip()
        else:
            eredmeny[sor.lower()] = None
    return eredmeny
```

</details>

```python test
szoveg = """
# Webes kérésekhez
requests==2.32.3
NumPy==2.1.0   # számításokhoz

pytest
"""
assert fuggosegek(szoveg) == {"requests": "2.32.3", "numpy": "2.1.0", "pytest": None}
assert fuggosegek("") == {}
print("Minden ellenőrzés sikeres!")
```

### 4. feladat: Saját projekt beállítása (gépen)

Ezt a feladatot a saját gépeden végezd el:

1. Hozz létre egy `elso_projekt` mappát, és nyisd meg VS Code-ban.
2. Hozz létre benne virtuális környezetet (`python -m venv .venv`), és aktiváld.
3. Telepítsd a `requests` csomagot, majd írd ki a függőségeket: `pip freeze > requirements.txt`.
4. Írj egy `main.py`-t `if __name__ == "__main__":` blokkal, amely kiírja a Python verzióját és azt, hogy virtuális környezetben fut-e.
5. Készíts `.gitignore` fájlt, amelybe beírod: `.venv/`.

<details>
<summary>Egy lehetséges main.py</summary>

```python run
import platform
import sys

def main() -> None:
    """Kiírja a futtatókörnyezet adatait."""
    print("Python:", platform.python_version())
    print("Virtuális környezet:", sys.prefix != sys.base_prefix)

if __name__ == "__main__":
    main()
```

</details>
