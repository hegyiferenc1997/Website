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

Ha a terminálba csak annyit írsz, hogy `python`, elindul az **interaktív értelmező** (REPL: *Read–Eval–Print Loop* – beolvas, kiértékel, kiír, ismétel). A `>>>` jel után írt kifejezés eredményét azonnal kiírja:

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

| Környezet | Mire jó |
| --- | --- |
| **IDLE** | a Pythonnal együtt települ, egyszerű szerkesztő + REPL – kezdésnek elég |
| **VS Code** + Python bővítmény | ingyenes, népszerű; kódkiegészítés, hibakereső, terminál, Git egy helyen |
| **PyCharm** | kifejezetten Pythonra készült teljes IDE (a Community kiadás ingyenes) |
| **Jupyter Notebook / JupyterLab** | cellákra bontott „jegyzetfüzet”: kód, eredmény, grafikon és szöveg együtt – adatelemzéshez ideális |
| **Online** (pl. Google Colab, Replit) | telepítés nélkül, böngészőben – bárhonnan elérhető |

A VS Code-ban a jobb felső sarok ▶ gombjával vagy a terminálban (`python fajl.py`) futtathatsz, az **F5**-tel pedig hibakeresővel indíthatod a programot.

## Összefoglalás

- **REPL** gyors kipróbálásra, **`.py` szkript** a tartós programokhoz.
- Az `if __name__ == "__main__":` választja el a főprogramot az importálható részektől.
- Parancssori argumentumok: `sys.argv`, kényelmesebben `argparse`.
- Kezdésnek a **VS Code** vagy az **IDLE**, adatelemzéshez a **Jupyter** ajánlott.
