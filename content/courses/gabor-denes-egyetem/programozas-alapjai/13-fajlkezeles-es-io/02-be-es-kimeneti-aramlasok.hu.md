---
title: Be- és kimeneti áramlások
summary: Az adatfolyam (stream) fogalma, stdin, stdout, stderr, átirányítás, pufferelés és parancssori argumentumok.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **adatfolyam** (stream),
- mi a három szabványos áramlás: **stdin**, **stdout**, **stderr**,
- hogyan **irányítod át** a be- és kimenetet,
- mi a **pufferelés**, és hogyan kapsz **parancssori argumentumokat**.

## Mi az adatfolyam?

Az **adatfolyam (stream)** adatok sorozata, amelyet sorban olvasunk vagy írunk – nem kell tudnunk, honnan jön vagy hová megy. Egy megnyitott fájl, a billentyűzet, a képernyő vagy egy hálózati kapcsolat ugyanúgy kezelhető: van `read()` és `write()` művelete.

## A három szabványos áramlás

Minden program három áramlást kap az operációs rendszertől:

| Áramlás                | Python       | Alapból      | Mire való                      |
| ---------------------- | ------------ | ------------ | ------------------------------ |
| szabványos bemenet     | `sys.stdin`  | billentyűzet | adatok beolvasása (`input()`)  |
| szabványos kimenet     | `sys.stdout` | képernyő     | eredmények (`print()`)         |
| szabványos hibakimenet | `sys.stderr` | képernyő     | hibaüzenetek, figyelmeztetések |

```python run
import sys

sys.stdout.write("Ez a szabványos kimenetre megy.\n")
print("A print is ide ír.", file=sys.stdout)
```

```python
import sys
print("Hiba: hiányzó fájl!", file=sys.stderr)   # hibaüzenet külön csatornán
```

Miért jó külön hibakimenet? Ha a program eredményét fájlba irányítjuk, a hibaüzenetek akkor is a képernyőn jelennek meg, és nem keverednek az adatok közé.

## Átirányítás a terminálban

```bash
python program.py > eredmeny.txt        # a stdout fájlba megy
python program.py >> eredmeny.txt       # hozzáfűzés
python program.py < bemenet.txt         # a stdin fájlból jön
python program.py 2> hibak.txt          # a stderr fájlba megy
python general.py | python szamol.py    # „cső”: az egyik kimenete a másik bemenete
```

Ez a **csővezeték (pipe)** a Unix-filozófia alapja: kis programok, amelyek egymás kimenetét dolgozzák fel.

## Olvasás a szabványos bemenetről

Az `input()` egy sort olvas. Sok adatnál (pl. versenyfeladatoknál) a `sys.stdin` közvetlenül is bejárható:

```python
import sys

osszeg = 0
for sor in sys.stdin:          # addig olvas, amíg tart a bemenet (fájl vége / Ctrl+D, Windowson Ctrl+Z)
    osszeg += int(sor)
print(osszeg)
```

## Szöveges áramlás a memóriában

Az `io.StringIO` egy memóriában lévő „fájl”: ugyanúgy írható és olvasható, mint egy valódi fájl. Teszteléshez nagyon hasznos.

```python run
import io

puffer = io.StringIO()
print("első sor", file=puffer)
print("második sor", file=puffer)
print(repr(puffer.getvalue()))

bemenet = io.StringIO("3\n4\n5\n")
print(sum(int(sor) for sor in bemenet))   # 12
```

## Pufferelés

Az írás nem kerül azonnal a lemezre vagy a képernyőre: a rendszer egy **pufferben** gyűjti, és nagyobb darabokban írja ki, mert az sokkal gyorsabb. A puffer kiürül, amikor betelik, amikor a fájlt bezárjuk, vagy amikor kérjük:

```python run
import time

for i in range(3):
    print(i, end=" ", flush=True)   # flush=True: azonnal jelenjen meg
    time.sleep(0.1)
print()
```

Ezért fontos a fájl bezárása (vagy a `with`): enélkül a puffer tartalma elveszhet.

## Parancssori argumentumok

A program indításakor megadott szavak a `sys.argv` listába kerülnek. A 0. elem a program neve.

```python
# fajlstat.py – használat: python fajlstat.py adatok.txt
import sys

if len(sys.argv) < 2:
    print("Használat: python fajlstat.py FÁJLNÉV", file=sys.stderr)
    sys.exit(1)                     # nem nulla kilépési kód = hiba

with open(sys.argv[1], encoding="utf-8") as f:
    print("Sorok száma:", sum(1 for _ in f))
```

Összetettebb paraméterezéshez az `argparse` modul való (kapcsolók, súgó, alapértékek).

## Összefoglalás

- Az adatfolyam sorban olvasható/írható adatsorozat; fájl, billentyűzet, képernyő egyformán kezelhető.
- `stdin` – bemenet, `stdout` – eredmény, `stderr` – hibaüzenetek; terminálban átirányíthatók (`>`, `<`, `2>`, `|`).
- Az írás pufferelt: zárás vagy `flush` kell.
- Parancssori argumentumok: `sys.argv`; kilépési kód: `sys.exit(kód)`.

## A lecke feladata: Számok összegzése egy adatfolyamból

Írj `osszegez(folyam)` függvényt, amely egy **szöveges adatfolyamot** kap (bármit, amin soronként végig lehet menni: megnyitott fájlt, `sys.stdin`-t vagy `io.StringIO`-t), és visszaadja a benne lévő számok összegét.

- Soronként egy szám van; az üres sorokat és a `#`-tel kezdődő megjegyzéssorokat hagyd ki.
- A sor elején és végén lévő szóközöket vágd le.

Így ugyanaz a függvény működik fájllal és a billentyűzetről érkező adatokkal is – ez az adatfolyam-fogalom lényege.

```python starter required
import io


def osszegez(folyam):
    osszeg = 0
    for sor in folyam:
        pass
    return osszeg


print(osszegez(io.StringIO("10\n# megjegyzés\n\n2.5\n")))   # 12.5
```

<details>
<summary>Megoldás</summary>

```python solution
import io


def osszegez(folyam):
    osszeg = 0
    for sor in folyam:
        sor = sor.strip()
        if not sor or sor.startswith("#"):
            continue
        osszeg += float(sor)
    return osszeg


print(osszegez(io.StringIO("10\n# megjegyzés\n\n2.5\n")))   # 12.5
```

</details>

```python test
import io
assert osszegez(io.StringIO("10\n# megjegyzés\n\n2.5\n")) == 12.5, "10 + 2.5 = 12.5 (a megjegyzés és az üres sor kimarad)"
assert osszegez(io.StringIO("")) == 0, "Üres adatfolyamra 0."
assert osszegez(io.StringIO("  -1 \n  3\n")) == 2, "A szóközöket le kell vágni."
with open("szamok.txt", "w", encoding="utf-8") as f:
    f.write("1\n2\n3\n")
with open("szamok.txt", encoding="utf-8") as f:
    assert osszegez(f) == 6, "Megnyitott fájllal is működjön."
```
