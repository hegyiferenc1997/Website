---
title: Futtatókörnyezetek áttekintése
summary: Operációs rendszer, JVM, .NET CLR, böngésző és Node.js, konténerek (Docker), felhő – hol és hogyan fut a kód.
minutes: 14
---

## Amit ebben a leckében megtanulsz

- mi a **futtatókörnyezet** (_runtime_), és mit ad a programnak,
- hogyan fut egy program **natívan**, **virtuális gépen**, **böngészőben**,
- mi a **konténer** (Docker) és a **felhő** szerepe,
- hogyan éri el a program a környezetét (**környezeti változók**, platform).

## Mi a futtatókörnyezet?

A futtatókörnyezet minden, ami a programod **futásához** kell a kódodon kívül: az operációs rendszer, az interpreter vagy virtuális gép, a könyvtárak, a memóriakezelés (pl. szemétgyűjtő), a fájl- és hálózatelérés.

```text
  ┌────────────────────────────┐
  │        a te programod      │
  ├────────────────────────────┤
  │  futtatókörnyezet (Python  │
  │  interpreter, JVM, .NET…)  │
  ├────────────────────────────┤
  │     operációs rendszer     │
  ├────────────────────────────┤
  │          hardver           │
  └────────────────────────────┘
```

## Natív futtatás (C, C++, Go, Rust)

A fordító **az adott processzorra és operációs rendszerre** készít gépi kódot (Windowson `.exe`). Ez nagyon gyors, de egy Windowsra fordított program Linuxon nem fut – minden platformra külön kell fordítani.

## Virtuális gépek (Java, C#, Python)

- **JVM (Java Virtual Machine):** a Java fordító platformfüggetlen **bájtkódot** (`.class`, `.jar`) készít, amit bármely gépen futtat a JVM. A gyakran használt részeket futás közben gépi kódra fordítja (**JIT**). Ugyanezen fut a Kotlin és a Scala is.
- **.NET CLR (Common Language Runtime):** a C# köztes kódra (IL) fordul, ezt a CLR futtatja JIT-tel – Windowson, Linuxon és macOS-en is.
- **CPython:** a „hivatalos” Python. A forráskódot bájtkódra (`.pyc`, a `__pycache__` mappában) fordítja, majd a saját virtuális gépén értelmezi. Más megvalósítások is léteznek: **PyPy** (JIT-tel gyorsabb), **MicroPython** (mikrovezérlőkre).

A virtuális gépek közös előnye a **hordozhatóság** és az automatikus **memóriakezelés** (szemétgyűjtő).

```python run
import dis

def duplaz(x):
    return x * 2

# A Python bájtkódja: ezt hajtja végre a CPython virtuális gépe.
dis.dis(duplaz)
```

## Böngésző és Node.js

- A **böngésző** JavaScript-motort tartalmaz (Chrome: V8, Firefox: SpiderMonkey), amely a weboldal kódját JIT-tel futtatja – biztonsági okból elzárt környezetben (_sandbox_): nem fér hozzá szabadon a gép fájljaihoz.
- A **WebAssembly** (Wasm) segítségével más nyelvek (C, C++, Rust, sőt a Python is – pl. _Pyodide_) is futhatnak a böngészőben. Később ezen az oldalon is így futnak majd a Python-feladatok.
- A **Node.js** a V8 motort a böngészőn kívül, szerveren futtatja.

## Konténerek (Docker)

„Az én gépemen működik!” – a klasszikus probléma: a fejlesztő gépén minden megy, a szerveren nem, mert más a Python-verzió vagy hiányzik egy könyvtár.

A **konténer** a programot **a teljes futtatókörnyezetével együtt** csomagolja (rendszerkönyvtárak, interpreter, függőségek). A **Docker** a legelterjedtebb eszköz erre. A konténer könnyebb, mint egy teljes virtuális gép, mert az operációs rendszer magját (_kernel_) megosztja a gazdagéppel.

```text
# Dockerfile – egy Python program konténerbe csomagolása
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

## Felhő

A **felhőszolgáltatók** (AWS, Microsoft Azure, Google Cloud) bérelhető számítási kapacitást adnak:

- **IaaS:** virtuális gépet bérelsz, mindent te telepítesz.
- **PaaS:** csak a kódot töltöd fel, a futtatókörnyezetet a szolgáltató adja.
- **Serverless (FaaS):** egy-egy függvényt futtatsz eseményre, és csak a futás idejéért fizetsz.

## A program és a környezete

A program a futtatókörnyezettől kap információt: melyik rendszeren fut, mi a munkakönyvtár, milyen **környezeti változók** vannak beállítva. A környezeti változókban tipikusan beállításokat és titkos kulcsokat adunk át – így ezek nem kerülnek bele a forráskódba.

```python run
import os
import platform
from pathlib import Path

print("Rendszer:", platform.system() or "ismeretlen")
print("Munkakönyvtár létezik:", Path.cwd().exists())

# Környezeti változó olvasása alapértelmezett értékkel (ha nincs beállítva).
mod = os.environ.get("ALKALMAZAS_MOD", "fejlesztes")
print("Mód:", mod)

# Beállítás csak erre a futásra (a gyerekfolyamatok is látják).
os.environ["ALKALMAZAS_MOD"] = "teszt"
print("Új mód:", os.environ["ALKALMAZAS_MOD"])
```

## Összefoglalás

| Környezet           | Példa                   | Hordozható?                   | Sebesség        |
| ------------------- | ----------------------- | ----------------------------- | --------------- |
| natív gépi kód      | C, C++, Go, Rust        | platformonként fordítani kell | leggyorsabb     |
| virtuális gép (JIT) | Java/JVM, C#/.NET       | igen                          | gyors           |
| interpreter         | CPython, Ruby           | igen                          | lassabb         |
| böngésző            | JavaScript, WebAssembly | igen (minden böngészőben)     | gyors (JIT)     |
| konténer            | Docker                  | igen, a környezettel együtt   | natívhoz közeli |

- A futtatókörnyezet adja mindazt, ami a kódon kívül kell a futáshoz.
- A **konténer** megoldja az „én gépemen működik” problémát.
- Beállításokat és titkokat **környezeti változóban** adj át, ne a kódban.

## A lecke feladata: Dockerfile generálása

Írj `dockerfile(verzio, belepesi_pont="main.py", fuggosegek=True)` függvényt, amely a lecke mintája alapján elkészíti egy Python program Dockerfile-ját, és **szövegként** adja vissza (a sorokat `"\n"` köti össze, a végén nincs sortörés):

```text
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

- a `FROM` sorba a `verzio` kerül; csak `3.x` alakú verzió fogadható el (pl. `"3.9"`, `"3.12"`), különben `ValueError`,
- a `CMD` sorba a `belepesi_pont` kerül; ha nem `.py`-ra végződik, `ValueError`,
- ha `fuggosegek` hamis, a `COPY requirements.txt .` és a `RUN pip …` sor kimarad.

```python starter required
def dockerfile(verzio, belepesi_pont="main.py", fuggosegek=True):
    return "FROM python:3.12-slim\nCMD python main.py"


print(dockerfile("3.12"))
```

<details>
<summary>Megoldás</summary>

```python solution
import re


def dockerfile(verzio, belepesi_pont="main.py", fuggosegek=True):
    # Csak 3.x alakú Python-verziót fogadunk el
    if not re.fullmatch(r"3\.\d{1,2}", verzio):
        raise ValueError(f"Érvénytelen Python-verzió: {verzio}")
    if not belepesi_pont.endswith(".py"):
        raise ValueError("A belépési pont egy .py fájl legyen.")
    sorok = [f"FROM python:{verzio}-slim", "WORKDIR /app"]
    if fuggosegek:
        sorok += ["COPY requirements.txt .", "RUN pip install --no-cache-dir -r requirements.txt"]
    sorok += ["COPY . .", f'CMD ["python", "{belepesi_pont}"]']
    return "\n".join(sorok)


print(dockerfile("3.12"))
```

</details>

```python test
vart = "\n".join([
    "FROM python:3.12-slim",
    "WORKDIR /app",
    "COPY requirements.txt .",
    "RUN pip install --no-cache-dir -r requirements.txt",
    "COPY . .",
    'CMD ["python", "main.py"]',
])
assert dockerfile("3.12") == vart, "Az alapértelmezett Dockerfile nem egyezik a mintával."
d = dockerfile("3.9", "app.py", fuggosegek=False)
assert d == 'FROM python:3.9-slim\nWORKDIR /app\nCOPY . .\nCMD ["python", "app.py"]', "Függőségek nélkül a COPY requirements és a RUN sor marad ki."
for rossz in ("2.7", "3", "python3.12", "3.12.1", "3.x"):
    try:
        dockerfile(rossz)
        assert False, f"A(z) {rossz!r} verzióra ValueError kell."
    except ValueError:
        pass
try:
    dockerfile("3.12", "main.js")
    assert False, "Nem .py belépési pontra ValueError kell."
except ValueError:
    pass
```
