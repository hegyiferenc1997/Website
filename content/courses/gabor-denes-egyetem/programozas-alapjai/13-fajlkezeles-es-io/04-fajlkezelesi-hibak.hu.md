---
title: Fájlkezelési hibák és kezelésük
summary: FileNotFoundError, PermissionError, kódolási hibák, hibás tartalom – és az útvonalak biztonságos kezelése a pathlib modullal.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- milyen **hibák** fordulhatnak elő fájlkezeléskor,
- hogyan **kezeled** őket kivételekkel,
- hogyan kezeled az **útvonalakat** platformfüggetlenül (`pathlib`),
- hogyan írsz fájlt **biztonságosan**.

## Tipikus fájlhibák

| Kivétel                | Mikor                                                             |
| ---------------------- | ----------------------------------------------------------------- |
| `FileNotFoundError`    | olvasásra nyitott fájl nem létezik, vagy a mappa nem létezik      |
| `PermissionError`      | nincs jogosultság (írásvédett, rendszerfájl, más program zárolja) |
| `IsADirectoryError`    | fájl helyett mappát próbálunk megnyitni                           |
| `FileExistsError`      | `"x"` móddal már létező fájlt nyitunk                             |
| `UnicodeDecodeError`   | a fájl nem a megadott kódolásban van                              |
| `ValueError`           | a tartalom hibás (pl. szám helyett szöveg egy sorban)             |
| `json.JSONDecodeError` | hibás JSON (a `ValueError` leszármazottja)                        |

Mindegyik (a tartalmi hibák kivételével) az **`OSError`** leszármazottja.

## Hiányzó fájl kezelése

```python run
def beolvas(fajlnev):
    try:
        with open(fajlnev, encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        print(f"Nem található: {fajlnev}")
        return None
    except PermissionError:
        print(f"Nincs jogosultság: {fajlnev}")
        return None

print(beolvas("nem_letezik.txt"))
```

## Hibás tartalom kezelése

Egy fájl lehet létező és olvasható, de a **tartalma** hibás. Érdemes soronként kezelni, hogy egy rossz sor miatt ne vesszen el az egész.

```python run
with open("meresek.txt", "w", encoding="utf-8") as f:
    f.write("21.5\n22.0\nhiba\n\n23.4\n")

ertekek = []
with open("meresek.txt", encoding="utf-8") as f:
    for sorszam, sor in enumerate(f, start=1):
        sor = sor.strip()
        if not sor:
            continue                     # üres sor kihagyása
        try:
            ertekek.append(float(sor))
        except ValueError:
            print(f"{sorszam}. sor hibás, kihagyva: {sor!r}")

print("Átlag:", sum(ertekek) / len(ertekek))
```

## Kódolási hiba

```python run
# Latin-2 (ISO-8859-2) kódolással írunk, majd UTF-8-ként próbáljuk olvasni.
with open("regi.txt", "w", encoding="iso-8859-2") as f:
    f.write("Árvíztűrő")

try:
    with open("regi.txt", encoding="utf-8") as f:
        print(f.read())
except UnicodeDecodeError as hiba:
    print("Kódolási hiba:", hiba.reason)
    with open("regi.txt", encoding="iso-8859-2") as f:   # a helyes kódolással már működik
        print(f.read())
```

## Útvonalak: pathlib

A fájlútvonalakat ne szövegösszefűzéssel rakd össze (`"mappa" + "/" + "fajl.txt"`), mert Windowson `\`, Linuxon és macOS-en `/` az elválasztó. A `pathlib` modul ezt automatikusan kezeli.

```python run
from pathlib import Path

mappa = Path("adatok")
mappa.mkdir(exist_ok=True)                 # létrehozza, ha még nincs
fajl = mappa / "eredmeny.txt"              # a / operátor összefűzi az útvonalat

fajl.write_text("42\n", encoding="utf-8")  # rövid írás
print(fajl.read_text(encoding="utf-8"))    # rövid olvasás
print(fajl.exists(), fajl.name, fajl.suffix, fajl.stem)
print([p.name for p in mappa.glob("*.txt")])   # fájlok listázása mintával
```

| Művelet               | `pathlib`                                 |
| --------------------- | ----------------------------------------- |
| létezik-e             | `p.exists()`, `p.is_file()`, `p.is_dir()` |
| mappa létrehozása     | `p.mkdir(parents=True, exist_ok=True)`    |
| fájlnév, kiterjesztés | `p.name`, `p.suffix`, `p.stem`            |
| szülőmappa            | `p.parent`                                |
| törlés                | `p.unlink(missing_ok=True)`               |
| listázás              | `p.iterdir()`, `p.glob("*.csv")`          |

## Biztonságos írás

Ha írás közben hiba történik (áramszünet, tele a lemez), a félig megírt fájl tönkreteheti a korábbi adatot. Bevált minta: írj egy **ideiglenes fájlba**, és ha sikerült, **cseréld le** vele az eredetit.

```python run
from pathlib import Path

def biztonsagos_mentes(utvonal, tartalom):
    utvonal = Path(utvonal)
    ideiglenes = utvonal.with_suffix(utvonal.suffix + ".tmp")
    ideiglenes.write_text(tartalom, encoding="utf-8")
    ideiglenes.replace(utvonal)          # egy lépésben cseréli le az eredetit

biztonsagos_mentes("allapot.json", '{"szint": 3}')
print(Path("allapot.json").read_text(encoding="utf-8"))
```

## Összefoglalás

- Gyakori hibák: `FileNotFoundError`, `PermissionError`, `UnicodeDecodeError`, hibás tartalom (`ValueError`).
- Kapd el a konkrét kivételt, és soronként kezeld a hibás tartalmat.
- Útvonalakhoz `pathlib`: `Path("mappa") / "fajl.txt"`.
- Fontos adatot ideiglenes fájlon keresztül ments.

## A lecke feladata: Számok beolvasása hibatűrően

Írj `szamok_beolvasasa(fajlnev)` függvényt, amely egy soronként egy egész számot tartalmazó fájlt olvas be, és egy `(szamok, hibas_sorok)` párt ad vissza:

- `szamok`: a helyes sorokból kapott egészek listája,
- `hibas_sorok`: azoknak a soroknak a sorszáma (1-től), amelyekben nem egész szám áll (az üres sorok nem hibásak, egyszerűen kimaradnak).

Ha a fájl nem létezik (`FileNotFoundError`), a függvény ne álljon le hibával, hanem `([], [])`-t adjon vissza. A fájlt a `pathlib` modul `Path` osztályával kezeld (`Path(fajlnev).read_text(encoding="utf-8")`).

```python starter required
from pathlib import Path


def szamok_beolvasasa(fajlnev):
    szamok, hibas_sorok = [], []
    # try: Path(...).read_text(...)  except FileNotFoundError: ...
    return szamok, hibas_sorok


Path("adat.txt").write_text("4\nhét\n\n10\n", encoding="utf-8")
print(szamok_beolvasasa("adat.txt"))   # ([4, 10], [2])
```

<details>
<summary>Megoldás</summary>

```python solution
from pathlib import Path


def szamok_beolvasasa(fajlnev):
    szamok, hibas_sorok = [], []
    try:
        szoveg = Path(fajlnev).read_text(encoding="utf-8")
    except FileNotFoundError:
        return [], []
    for sorszam, sor in enumerate(szoveg.splitlines(), start=1):
        sor = sor.strip()
        if not sor:
            continue
        try:
            szamok.append(int(sor))
        except ValueError:
            hibas_sorok.append(sorszam)
    return szamok, hibas_sorok


Path("adat.txt").write_text("4\nhét\n\n10\n", encoding="utf-8")
print(szamok_beolvasasa("adat.txt"))   # ([4, 10], [2])
```

</details>

```python test
from pathlib import Path
Path("e1.txt").write_text("4\nhét\n\n10\n2.5\n-3\n", encoding="utf-8")
assert szamok_beolvasasa("e1.txt") == ([4, 10, -3], [2, 5]), "Számok: [4, 10, -3]; hibás sorok: 2 (szöveg) és 5 (nem egész)."
assert szamok_beolvasasa("nincs_ilyen_fajl.txt") == ([], []), "Hiányzó fájlnál ([], [])."
Path("e2.txt").write_text("", encoding="utf-8")
assert szamok_beolvasasa("e2.txt") == ([], []), "Üres fájlnál ([], [])."
```
