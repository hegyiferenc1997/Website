---
title: Python programok futtatása
summary: Telepítés, interaktív mód (REPL), szkriptek, parancssori argumentumok, VS Code, Jupyter és online környezetek.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- hogyan **telepítsd** a Pythont, és hogyan ellenőrizd a verzióját,
- mi a különbség az **interaktív mód** és a **szkript** futtatása között,
- mire jó az `if __name__ == "__main__":` és a **parancssori argumentum**,
- milyen **fejlesztőkörnyezetekben** dolgozhatsz.

## Telepítés és verzió

A Python a [python.org](https://www.python.org/downloads/) oldalról tölthető le (Windowson a telepítőben pipáld be az **„Add python.exe to PATH”** lehetőséget). Ellenőrzés a terminálban:

```bash
python --version      # Windows
python3 --version     # macOS / Linux
```

A futó programból is lekérdezhető, melyik Python és milyen rendszer futtatja:

```python run
import platform
import sys

print("Python verzió:", platform.python_version())
print("Fő verziószám:", sys.version_info.major)
print("Interpreter helye:", "megvan" if sys.executable else "ismeretlen")
print("Operációs rendszer:", platform.system() or "ismeretlen")
```

> Mindig **Python 3**-at használj. A Python 2 támogatása 2020-ban véget ért, a két verzió nem kompatibilis (pl. `print "szia"` csak Python 2-ben működött).

## Interaktív mód (REPL)

Ha a terminálba csak annyit írsz, hogy `python`, elindul az **interaktív értelmező** (REPL: _Read–Eval–Print Loop_ – beolvas, kiértékel, kiír, ismétel). A `>>>` jel után írt kifejezés eredményét azonnal kiírja:

```text
>>> 2 + 3
5
>>> nev = "Anna"
>>> nev.upper()
'ANNA'
>>> exit()
```

Kiváló gyors kipróbálásra, számológépnek, egy függvény viselkedésének ellenőrzésére. A beírt kód viszont kilépéskor elvész.

## Szkript futtatása

A tartós programot **`.py` kiterjesztésű fájlba** írjuk, és így futtatjuk:

```bash
python hello.py
```

Az interpreter a fájlt felülről lefelé hajtja végre. A szkriptben a kifejezések értéke **nem** íródik ki magától – ahhoz `print()` kell.

## `if __name__ == "__main__":`

Minden modulnak van egy `__name__` változója. Ha a fájlt **közvetlenül futtatod**, értéke `"__main__"`; ha egy másik fájl **importálja**, akkor a modul neve. Így elkülöníthető a „főprogram” a többször felhasználható függvényektől:

```python run
def udvozles(nev: str) -> str:
    """Más modulból is importálható függvény."""
    return f"Szia, {nev}!"

def main() -> None:
    # Ez csak közvetlen futtatáskor fut le, importáláskor nem.
    print(udvozles("világ"))

print("A modul neve most:", __name__)

if __name__ == "__main__":
    main()
```

## Parancssori argumentumok

A program a futtatáskor kaphat bemenetet a parancssorból: `python osszead.py 3 5`. Ezek a `sys.argv` listában vannak (a 0. elem a szkript neve). Nagyobb programokhoz az `argparse` modul kényelmesebb:

```python run
import argparse

parser = argparse.ArgumentParser(description="Két szám összeadása")
parser.add_argument("a", type=int, help="az első szám")
parser.add_argument("b", type=int, help="a második szám")
parser.add_argument("--reszletes", action="store_true", help="részletes kiírás")

# A parse_args() alapból a sys.argv-t olvassa; itt a példa kedvéért listát adunk át,
# mintha ezt írtuk volna: python osszead.py 3 5 --reszletes
args = parser.parse_args(["3", "5", "--reszletes"])

if args.reszletes:
    print(f"{args.a} + {args.b} = {args.a + args.b}")
else:
    print(args.a + args.b)
```

## Fejlesztőkörnyezetek

| Környezet                             | Mire jó                                                                                            |
| ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **IDLE**                              | a Pythonnal együtt települ, egyszerű szerkesztő + REPL – kezdésnek elég                            |
| **VS Code** + Python bővítmény        | ingyenes, népszerű; kódkiegészítés, hibakereső, terminál, Git egy helyen                           |
| **PyCharm**                           | kifejezetten Pythonra készült teljes IDE (a Community kiadás ingyenes)                             |
| **Jupyter Notebook / JupyterLab**     | cellákra bontott „jegyzetfüzet”: kód, eredmény, grafikon és szöveg együtt – adatelemzéshez ideális |
| **Online** (pl. Google Colab, Replit) | telepítés nélkül, böngészőben – bárhonnan elérhető                                                 |

A VS Code-ban a jobb felső sarok ▶ gombjával vagy a terminálban (`python fajl.py`) futtathatsz, az **F5**-tel pedig hibakeresővel indíthatod a programot.

## Összefoglalás

- **REPL** gyors kipróbálásra, **`.py` szkript** a tartós programokhoz.
- Az `if __name__ == "__main__":` választja el a főprogramot az importálható részektől.
- Parancssori argumentumok: `sys.argv`, kényelmesebben `argparse`.
- Kezdésnek a **VS Code** vagy az **IDLE**, adatelemzéshez a **Jupyter** ajánlott.

## A lecke feladata: Jegyátlag parancssorból

Írj `jegyatlag(argv)` függvényt, amely az `argparse` segítségével dolgozza fel a parancssori argumentumokat (az `argv` lista, pl. `["5", "4", "4", "--tizedes", "1"]`), és **szöveget ad vissza**:

- `jegyek`: egy vagy több egész szám, csak 1–5 között (`nargs="+"`, `choices=range(1, 6)`),
- `--tizedes N`: hány tizedesre kerekítsünk (egész, alapértéke `2`),
- `--reszletes`: kapcsoló (`store_true`); ha meg van adva, a jegyeket is felsorolja.

Az eredmény alakja `Átlag: 4.33`, részletes módban `Jegyek: 5, 4, 4 | Átlag: 4.33`. Érvénytelen bemenetnél (pl. `6`-os jegy) az `argparse` magától leállítja a programot (`SystemExit`) – ezt nem kell elkapnod.

```python starter required
import argparse


def jegyatlag(argv):
    parser = argparse.ArgumentParser(description="Jegyátlag számítása")
    parser.add_argument("jegyek", nargs="+")
    args = parser.parse_args(argv)
    return f"Átlag: {args.jegyek}"


print(jegyatlag(["5", "4", "4"]))
```

<details>
<summary>Megoldás</summary>

```python solution
import argparse


def jegyatlag(argv):
    parser = argparse.ArgumentParser(description="Jegyátlag számítása")
    parser.add_argument("jegyek", type=int, nargs="+", choices=range(1, 6))
    parser.add_argument("--tizedes", type=int, default=2)
    parser.add_argument("--reszletes", action="store_true")
    args = parser.parse_args(argv)
    atlag = round(sum(args.jegyek) / len(args.jegyek), args.tizedes)
    if args.reszletes:
        felsorolas = ", ".join(str(j) for j in args.jegyek)
        return f"Jegyek: {felsorolas} | Átlag: {atlag}"
    return f"Átlag: {atlag}"


print(jegyatlag(["5", "4", "4"]))
print(jegyatlag(["5", "4", "4", "--tizedes", "1", "--reszletes"]))
```

</details>

```python test
import contextlib, io
assert jegyatlag(["5", "4", "4"]) == "Átlag: 4.33", "Alapból 2 tizedesre kerekíts."
assert jegyatlag(["5", "4", "4", "--tizedes", "1"]) == "Átlag: 4.3", "A --tizedes kapcsoló állítja a kerekítést."
assert jegyatlag(["--reszletes", "3", "5"]) == "Jegyek: 3, 5 | Átlag: 4.0", "Részletes módban: Jegyek: 3, 5 | Átlag: 4.0"
assert jegyatlag(["2"]) == "Átlag: 2.0", "Egyetlen jegy is elég."
for rossz in (["6"], ["0", "5"], [], ["négy"]):
    try:
        with contextlib.redirect_stderr(io.StringIO()):
            jegyatlag(rossz)
        assert False, f"Érvénytelen bemenetnél ({rossz}) az argparse-nak le kell állítania a programot."
    except SystemExit:
        pass
```
