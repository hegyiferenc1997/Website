---
title: Mélyebben – a futtatókörnyezet belülről
summary: Hol fut valójában a programod – a sys és a platform modul elárulja (a böngészőben WebAssemblyben), honnan tölti be a Python a modulokat, verziófeltételek ellenőrzése egy requirements fájlban, beállítások környezeti változókból titkok nélkül, és parancssori paraméterek argparse-szal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogyan **kérdezd meg** a programból, milyen környezetben fut,
- honnan **tölti be** a Python a modulokat, és miért kell virtuális környezet,
- hogyan ellenőrizhető, hogy a telepített csomagok megfelelnek-e a **verziófeltételeknek**,
- hogyan kapjon egy program **beállításokat** kívülről: környezeti változókból és parancssori paraméterekből.

## 1. Hol fut a programod?

Az alapleckében láttuk, hogy ugyanaz a Python-kód futhat a saját gépen, szerveren, konténerben – vagy ezen az oldalon, a böngészőben. A `sys` és a `platform` modul elárulja, épp hol vagyunk:

```python run
# A futtatókörnyezet lekérdezése a programból
import platform
import sys

print("Python-verzió:   ", sys.version.split()[0])
print("megvalósítás:    ", platform.python_implementation())
print("operációs rendszer:", sys.platform)
print("gép:             ", platform.machine() or "(ismeretlen)")
print("bájtsorrend:     ", sys.byteorder)
print("legnagyobb index:", sys.maxsize)

if sys.platform == "emscripten":
    print("→ a böngészőben futsz, WebAssemblyre fordított Pythonnal (Pyodide)")
else:
    print("→ hagyományos operációs rendszeren futsz")
```

Ha ezt itt, az oldalon futtatod, az operációs rendszer `emscripten` lesz: a CPython értelmezőt **WebAssemblyre** fordították, és a böngésződ futtatja – szerver nélkül. Saját gépen ugyanez a kód `win32`-t, `linux`-ot vagy `darwin`-t (macOS) ír ki. A programok néha ez alapján döntenek: pl. más a fájlelérési út formája Windowson és Linuxon.

## 2. Honnan jönnek a modulok?

Az `import` utasítás a `sys.path` listában felsorolt mappákban keresi a modult, **sorban** – az első találat nyer. Ezért okozhat meglepetést, ha a saját fájlodat `random.py`-nak nevezed: a Python azt tölti be a beépített helyett:

```python run
# A modulok keresési útvonala és egy modul helye
import sys
import json

print("a keresési útvonal első néhány eleme:")
for mappa in sys.path[:4]:
    print("  ", mappa or "(az aktuális mappa)")
print("a json modul innen jött:", json.__file__)
print("betöltött modulok száma:", len(sys.modules))
print("beépített modulok (néhány):", sorted(sys.builtin_module_names)[:6], "...")
```

Egy **virtuális környezet** (`python -m venv .venv`) azt csinálja, hogy saját mappát ad a telepített csomagoknak, és azt teszi a `sys.path`-ba. Így az egyik projekt csomagjai nem keverednek a másikéval: az egyik használhat egy könyvtárat 1.x verzióban, a másik 2.x-ben, ugyanazon a gépen.

## 3. Verziófeltételek ellenőrzése

A projekt függőségeit egy `requirements.txt` (vagy `pyproject.toml`) fájl sorolja fel, **verziófeltételekkel**. Írjunk egy kis ellenőrzőt, amely megmondja, hogy a telepített verziók megfelelnek-e:

```python run
# requirements-szerű verziófeltételek ellenőrzése
import re

requirements = """
requests>=2.31
numpy==2.1.0
pandas>=2.0,<3
flask
"""
telepitett = {"requests": "2.32.3", "numpy": "2.0.1", "pandas": "2.2.2", "flask": "3.0.3"}

def verzio(v):
    return tuple(int(x) for x in v.split("."))      # "2.10.1" → (2, 10, 1): számként hasonlít

MUVELETEK = {">=": lambda a, b: a >= b, "<=": lambda a, b: a <= b, "==": lambda a, b: a == b,
             ">": lambda a, b: a > b, "<": lambda a, b: a < b}

for sor in requirements.strip().splitlines():
    nev = re.match(r"[A-Za-z0-9_-]+", sor).group()
    feltetelek = re.findall(r"(>=|<=|==|>|<)([\d.]+)", sor)
    van = verzio(telepitett[nev])
    rossz = [f"{op}{v}" for op, v in feltetelek if not MUVELETEK[op](van, verzio(v))]
    allapot = "rendben" if not rossz else "NEM felel meg: " + ", ".join(rossz)
    print(f"{nev:<9} {telepitett[nev]:<7} {sor[len(nev):] or '(bármely)':<12} {allapot}")
```

A `numpy==2.1.0` feltétel pontos verziót kér, de 2.0.1 van telepítve – ez az a helyzet, amikor egy program „nálam működik, nálad nem”. Ezért rögzítik a csapatok a **pontos** verziókat egy zárolófájlban (lockfile): így mindenki, és a szerver is, bájtra ugyanazokat a csomagokat telepíti.

## 4. Beállítások kívülről: környezeti változók és parancssor

Egy program beállításait (port, adatbázis címe, hibakereső mód) **ne** írd a kódba: kapja a környezettől. Így ugyanaz a kód futhat a fejlesztő gépén és élesben is, és a **jelszó** sosem kerül a verziókezelőbe:

```python run
# Beállítások környezeti változókból (alapértékekkel) és parancssori paraméterekből
import argparse
import os

os.environ.setdefault("ALKALMAZAS_PORT", "8080")        # itt csak a példa kedvéért állítjuk be

port = int(os.environ.get("ALKALMAZAS_PORT", "8000"))
hibakereses = os.environ.get("ALKALMAZAS_DEBUG", "0").lower() in ("1", "true", "igen")
print(f"port: {port}, hibakereső mód: {hibakereses}")
print("jelszó a kódban? NEM – élesben a környezet adja:", "ADATBAZIS_JELSZO" in os.environ)

# parancssori paraméterek: a valóságban parse_args() üresen a sys.argv-t olvassa
elemzo = argparse.ArgumentParser(prog="jegyek", description="Jegyek összesítése CSV-ből")
elemzo.add_argument("fajl", help="a beolvasandó CSV-fájl")
elemzo.add_argument("--min", type=int, default=2, help="a figyelembe vett legkisebb jegy")
elemzo.add_argument("--reszletes", action="store_true", help="részletes kimenet")

args = elemzo.parse_args(["jegyek.csv", "--min", "3", "--reszletes"])
print("beolvasott paraméterek:", args)
print("fájl:", args.fajl, "| min:", args.min, "| részletes:", args.reszletes)
elemzo.print_help()
```

Az `argparse` ingyen ad **súgót** (`--help`), típusellenőrzést (`--min abc` hibát ad) és alapértékeket. A környezeti változók mindig **szövegek** – a számot és a logikai értéket nekünk kell átalakítani, és erre figyelni kell: az `"0"` szöveg logikai értéke igaz lenne (`bool("0")` → `True`)!

| Nézőpont        | Mit vár a futtatókörnyezettől?                                                    |
| --------------- | --------------------------------------------------------------------------------- |
| **fejlesztő**   | „nálam működik” = mindenhol működik: virtuális környezet, rögzített verziók       |
| **üzemeltető**  | beállítás környezeti változókkal, újrafordítás nélkül; ugyanaz a csomag mindenhol |
| **biztonság**   | jelszó és API-kulcs soha nem a kódban; a függőségek sebezhetőségeit figyelni kell |
| **felhasználó** | telepítés nélkül fusson (böngésző, webes alkalmazás), vagy egyetlen kattintással  |

## Összefoglalás

- A `sys` és a `platform` modul megmutatja a futtatókörnyezetet; a böngészőben a Python WebAssemblyben fut.
- Az `import` a `sys.path` mappáiban keres; a virtuális környezet projektenként külön csomagmappát ad.
- A verziófeltételek és a zárolófájl teszik reprodukálhatóvá a telepítést.
- A beállítások környezeti változókból és parancssori paraméterekből jöjjenek; titok soha ne legyen a kódban.

## A lecke feladata: beállítások beolvasása

Írd meg a `konfig(kornyezet)` függvényt, amely egy környezeti változókat tartalmazó szótárból (mint az `os.environ`) egy beállítás-szótárt készít három kulccsal!

- `"port"`: a `PORT` értéke egész számként; ha nincs megadva, `8000`.
- `"debug"`: `True`, ha a `DEBUG` értéke (kis- és nagybetűtől függetlenül) `"1"`, `"true"` vagy `"yes"`; minden más esetben (és ha hiányzik) `False`.
- `"db_url"`: a `DB_URL` értéke; ez kötelező – ha hiányzik, dobj `KeyError`-t.

```python starter required
def konfig(kornyezet):
    return {
        "port": 8000,
        "debug": False,
        "db_url": "",
    }


print(konfig({"DB_URL": "postgres://localhost/app", "DEBUG": "True"}))
```

<details>
<summary>Megoldás</summary>

```python solution
def konfig(kornyezet):
    return {
        "port": int(kornyezet.get("PORT", "8000")),
        "debug": kornyezet.get("DEBUG", "").lower() in ("1", "true", "yes"),
        "db_url": kornyezet["DB_URL"],
    }


print(konfig({"DB_URL": "postgres://localhost/app", "DEBUG": "True"}))
```

</details>

```python test
k = konfig({"DB_URL": "postgres://localhost/app", "DEBUG": "True"})
assert k == {"port": 8000, "debug": True, "db_url": "postgres://localhost/app"}, "alapértelmezett port, DEBUG=True igaz"
assert konfig({"DB_URL": "x", "PORT": "5000"})["port"] == 5000, "a PORT egész számmá alakul"
assert konfig({"DB_URL": "x", "DEBUG": "0"})["debug"] is False, "a '0' hamis (nem bool('0')!)"
assert konfig({"DB_URL": "x", "DEBUG": "YES"})["debug"] is True, "kis- és nagybetűtől független"
try:
    konfig({"PORT": "5000"})
    assert False, "hiányzó DB_URL esetén KeyError kell"
except KeyError:
    pass
```
