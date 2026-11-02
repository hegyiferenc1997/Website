---
title: Modulok, csomagok és virtuális környezetek
summary: import, a standard könyvtár, pip, venv és requirements.txt – hogyan kezeld a program függőségeit.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **modul**, a **csomag** és a **könyvtár** között,
- hogyan telepíts külső csomagot a **pip**-pel,
- mire való a **virtuális környezet** (`venv`), és hogyan hozd létre,
- hogyan rögzítsd a függőségeket a **`requirements.txt`**-ben.

## Modulok és a standard könyvtár

- **Modul:** egy `.py` fájl, amelyet importálni lehet.
- **Csomag:** modulok mappája.
- **Standard könyvtár:** a Pythonnal együtt települő modulok – „elemekkel együtt szállítva” (_batteries included_).

```python run
import math                      # egész modul importálása
from random import randint, seed # csak bizonyos nevek
import datetime as dt            # rövidebb álnévvel
from collections import Counter

seed(1)                          # ismételhető véletlenszámok
print(math.sqrt(16), math.pi)
print(1 <= randint(1, 6) <= 6)
print(dt.date(2026, 9, 1).strftime("%Y.%m.%d."))
print(Counter("programozás").most_common(2))
```

Néhány hasznos standard modul: `math`, `random`, `datetime`, `os`, `pathlib`, `json`, `csv`, `collections`, `itertools`, `statistics`, `unittest`, `argparse`, `logging`.

## Hol keresi a Python a modulokat?

Az `import` a `sys.path` lista mappáiban keres: először a futó szkript mappájában, majd a standard könyvtárban, végül a telepített csomagok (`site-packages`) között.

```python run
import sys

# A keresési útvonal első néhány eleme.
print(len(sys.path) > 0)
print(any("site-packages" in p or "dist-packages" in p for p in sys.path) or "nincs site-packages")
```

> Ne nevezd el a saját fájlodat úgy, mint egy standard modult (pl. `random.py`, `math.py`) – a Python a te fájlodat importálná helyette!

## Külső csomagok: pip

A külső csomagok a **PyPI** (Python Package Index, [pypi.org](https://pypi.org)) oldalon érhetők el, és a **pip** csomagkezelővel telepíthetők:

```bash
pip install requests          # telepítés
pip install requests==2.32.3  # adott verzió
pip list                      # telepített csomagok
pip show requests             # egy csomag adatai
pip uninstall requests        # eltávolítás
```

Népszerű csomagok: `requests` (HTTP), `numpy` (számítások), `pandas` (táblázatos adatok), `matplotlib` (grafikonok), `pytest` (tesztelés), `flask`/`django` (web).

## Virtuális környezetek (venv)

**Probléma:** az egyik projektnek a `numpy` 1.x, a másiknak a 2.x verziója kell. Ha minden a gép közös Pythonjába települ, a projektek összeakadnak.

**Megoldás:** minden projektnek saját **virtuális környezet** – egy mappa saját Python-értelmezővel és saját csomagokkal.

```bash
# 1. Létrehozás a projekt mappájában (a .venv mappa jön létre)
python -m venv .venv

# 2. Aktiválás
.venv\Scripts\activate        # Windows (PowerShell / cmd)
source .venv/bin/activate     # macOS / Linux

# 3. Innentől a pip a környezetbe telepít
pip install requests

# 4. Kilépés
deactivate
```

Aktív környezetben a prompt elején megjelenik a neve: `(.venv) C:\projekt>`. A VS Code a projekt `.venv` mappáját automatikusan felismeri.

A programból is ellenőrizhető, hogy virtuális környezetben fut-e:

```python run
import sys

# Virtuális környezetben a sys.prefix a környezet mappája, ami eltér az alap Pythonétól.
virtualis = sys.prefix != sys.base_prefix
print("Virtuális környezetben fut:", virtualis)
```

## requirements.txt

A függőségeket egy szövegfájlban rögzítjük, hogy más (vagy te egy másik gépen) pontosan ugyanazt a környezetet hozhassa létre:

```bash
pip freeze > requirements.txt     # a telepített csomagok kiírása
pip install -r requirements.txt   # telepítés a fájl alapján
```

```text
requests==2.32.3
numpy==2.1.0
```

> A `.venv` mappát **ne** töltsd fel a Gitre (írd be a `.gitignore`-ba) – a `requirements.txt` alapján bárki újra létrehozhatja.

## Összefoglalás

- **Modul** = `.py` fájl, **csomag** = modulok mappája; a standard könyvtár rengeteg kész modult ad.
- Külső csomagok a **PyPI**-ról, a **pip**-pel.
- Minden projektnek saját **virtuális környezet** (`python -m venv .venv`).
- A függőségek a **`requirements.txt`**-be kerülnek, a `.venv` mappa a `.gitignore`-ba.

## A lecke feladata: Telepített csomagok ellenőrzése

Egy projekt `requirements.txt`-je pontos verziókat rögzít. Írj `ellenoriz(kovetelmenyek, telepitett)` függvényt, amely összeveti ezt a környezetbe ténylegesen telepített csomagokkal:

- `kovetelmenyek`: a `requirements.txt` szövege; minden nem üres, nem komment sor `név==verzió` alakú (sor végi `#` komment is lehet),
- `telepitett`: `{név: verzió}` szótár,
- a csomagneveket **normalizálva** hasonlítsd össze: kisbetűsítve, és a `_` meg a `.` ugyanazt jelenti, mint a `-` (így `Flask_Login` = `flask-login`),
- eredmény: szótár két kulccsal: `"hianyzik"` – a hiányzó csomagok normalizált neve **ábécérendben**; `"elter"` – `(név, várt, telepített)` hármasok listája ábécérendben azokra, amelyeknél más a verzió.

```python starter required
def ellenoriz(kovetelmenyek, telepitett):
    hianyzik = []
    for sor in kovetelmenyek.splitlines():
        nev, verzio = sor.split("==")
        if nev not in telepitett:
            hianyzik.append(nev)
    return {"hianyzik": hianyzik, "elter": []}


req = "requests==2.32.3\nFlask_Login==0.6.3\n"
print(ellenoriz(req, {"requests": "2.31.0"}))
```

<details>
<summary>Megoldás</summary>

```python solution
def normalizal(nev):
    # A csomagnevekben a kis- és nagybetű, valamint a _ . - jelek egyenértékűek
    return nev.strip().lower().replace("_", "-").replace(".", "-")


def ellenoriz(kovetelmenyek, telepitett):
    meglevo = {normalizal(n): v for n, v in telepitett.items()}
    hianyzik, elter = [], []
    for sor in kovetelmenyek.splitlines():
        sor = sor.split("#", 1)[0].strip()   # komment levágása
        if not sor:
            continue
        nev, verzio = sor.split("==", 1)
        nev, verzio = normalizal(nev), verzio.strip()
        if nev not in meglevo:
            hianyzik.append(nev)
        elif meglevo[nev] != verzio:
            elter.append((nev, verzio, meglevo[nev]))
    return {"hianyzik": sorted(hianyzik), "elter": sorted(elter)}


req = "requests==2.32.3\nFlask_Login==0.6.3\n"
print(ellenoriz(req, {"requests": "2.31.0"}))
```

</details>

```python test
req = """
# Webes kérésekhez
requests==2.32.3
Flask_Login==0.6.3   # bejelentkezés
numpy==2.1.0

zope.interface==7.0
"""
telepitett = {"Requests": "2.31.0", "flask-login": "0.6.3", "Zope-Interface": "7.0"}
assert ellenoriz(req, telepitett) == {"hianyzik": ["numpy"], "elter": [("requests", "2.32.3", "2.31.0")]}, "Normalizált nevekkel hasonlíts, a kommenteket és üres sorokat hagyd ki."
assert ellenoriz("b==1\na==1\n", {}) == {"hianyzik": ["a", "b"], "elter": []}, "A hiányzó csomagok ábécérendben."
assert ellenoriz("z==2\ny==3\n", {"y": "1", "z": "1"})["elter"] == [("y", "3", "1"), ("z", "2", "1")], "Az eltérések ábécérendben."
assert ellenoriz("", {"x": "1"}) == {"hianyzik": [], "elter": []}, "Üres requirements.txt-nél nincs eltérés."
```
