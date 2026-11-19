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

## Összefoglaló feladat: Pénzváltó parancssori program

Készíts egy teljes parancssori programot `main(argv, env)` belépési ponttal, amely forintot vált át más pénznemre. A `main` **kilépési kódot** ad vissza (`0` = siker), az eredményt pedig kiírja.

- Argumentumok (`argparse`): `osszeg` (float, forintban), `--penznem` (`EUR` vagy `USD`), `--tizedes` (egész, alapértéke `2`).
- Ha nincs `--penznem`, a `PENZNEM` környezeti változó dönt; ha az sincs, `EUR`.
- Árfolyamok: `ARFOLYAMOK = {"EUR": 400.0, "USD": 370.0}` (1 egység hány forint). A `ARFOLYAM_EUR` / `ARFOLYAM_USD` környezeti változó felülírhatja.
- Siker: kiírja például `10000 HUF = 25.00 EUR` (az összeg a megadott alakban, az eredmény `--tizedes` tizedesre formázva), és `0`-t ad vissza.
- Érvénytelen árfolyam a környezetben (nem szám vagy nem pozitív), vagy érvénytelen `PENZNEM`: kiírja `Hiba: ...`, és `1`-et ad vissza – nem szabad összeomlania.
- Hibás argumentumoknál az `argparse` `SystemExit`-et dob: kapd el, és add vissza a kódját (`2`).

Az `env` egy szótár (a valódi programban `os.environ`); így a program környezettől függetlenül tesztelhető.

```python starter required
import argparse

ARFOLYAMOK = {"EUR": 400.0, "USD": 370.0}


def main(argv, env):
    parser = argparse.ArgumentParser(description="Pénzváltó")
    parser.add_argument("osszeg", type=float)
    args = parser.parse_args(argv)
    print(args.osszeg / 400)


main(["10000"], {})
```

<details>
<summary>Megoldás</summary>

```python solution
import argparse

ARFOLYAMOK = {"EUR": 400.0, "USD": 370.0}


def main(argv, env):
    parser = argparse.ArgumentParser(description="Pénzváltó")
    parser.add_argument("osszeg", type=float)
    parser.add_argument("--penznem", choices=sorted(ARFOLYAMOK))
    parser.add_argument("--tizedes", type=int, default=2)
    try:
        args = parser.parse_args(argv)
    except SystemExit as hiba:
        return hiba.code   # az argparse hibakódja (2)

    # A pénznem: argumentum > környezeti változó > alapérték
    penznem = args.penznem or env.get("PENZNEM", "EUR")
    if penznem not in ARFOLYAMOK:
        print(f"Hiba: ismeretlen pénznem: {penznem}")
        return 1

    arfolyam = ARFOLYAMOK[penznem]
    if f"ARFOLYAM_{penznem}" in env:
        try:
            arfolyam = float(env[f"ARFOLYAM_{penznem}"])
        except ValueError:
            print(f"Hiba: az ARFOLYAM_{penznem} nem szám.")
            return 1
        if arfolyam <= 0:
            print(f"Hiba: az ARFOLYAM_{penznem} nem pozitív.")
            return 1

    eredmeny = args.osszeg / arfolyam
    osszeg = int(args.osszeg) if args.osszeg.is_integer() else args.osszeg
    print(f"{osszeg} HUF = {eredmeny:.{args.tizedes}f} {penznem}")
    return 0


if __name__ == "__main__":
    kod = main(["10000"], {})
    print("Kilépési kód:", kod)
```

</details>

```python test
import contextlib, io

def futas(argv, env):
    ki = io.StringIO()
    with contextlib.redirect_stdout(ki), contextlib.redirect_stderr(io.StringIO()):
        kod = main(argv, env)
    return kod, ki.getvalue().strip()

assert futas(["10000"], {}) == (0, "10000 HUF = 25.00 EUR"), "Alapból EUR, 2 tizedes: 10000 HUF = 25.00 EUR"
assert futas(["3700", "--penznem", "USD", "--tizedes", "1"], {}) == (0, "3700 HUF = 10.0 USD"), "A --penznem és a --tizedes kapcsoló nem működik."
assert futas(["1000"], {"PENZNEM": "USD", "ARFOLYAM_USD": "400"}) == (0, "1000 HUF = 2.50 USD"), "A PENZNEM és az ARFOLYAM_USD környezeti változót is vedd figyelembe."
assert futas(["800", "--penznem", "EUR"], {"PENZNEM": "USD"}) == (0, "800 HUF = 2.00 EUR"), "Az argumentum erősebb a környezeti változónál."
assert futas(["1234.6"], {"ARFOLYAM_EUR": "100"}) == (0, "1234.6 HUF = 12.35 EUR"), "Tört összeg is megengedett."
kod, ki = futas(["1000"], {"ARFOLYAM_EUR": "sok"})
assert kod == 1 and ki.startswith("Hiba:"), "Nem szám árfolyamnál 'Hiba: ...' és 1-es kód."
kod, ki = futas(["1000"], {"ARFOLYAM_EUR": "0"})
assert kod == 1 and ki.startswith("Hiba:"), "Nem pozitív árfolyamnál 'Hiba: ...' és 1-es kód."
kod, ki = futas(["1000"], {"PENZNEM": "GBP"})
assert kod == 1 and ki.startswith("Hiba:"), "Ismeretlen PENZNEM-nél 'Hiba: ...' és 1-es kód."
assert futas(["sok"], {})[0] == 2 and futas([], {})[0] == 2, "Hibás argumentumoknál az argparse kódját (2) add vissza."
```
