---
title: 2. mini projekt – szövegelemző
summary: Szövegfeldolgozás függvényekkel, reguláris kifejezéssel, Counterrel, CSV-exporttal és hibakezeléssel.
minutes: 40
kind: practice
---

## A projekt célja

Készíts programot, amely egy szövegről (vagy szövegfájlról) statisztikát készít. Ez a projekt a **szövegkezelést** (4. témakör), a **függvényeket** (8.), az **adatszerkezeteket** (10.: lista, halmaz, szótár), a **funkcionális eszközöket** (`map`, `sorted` + `key`), a **fájlkezelést** (13.) és a **hibakezelést** (12.) gyakoroltatja. Az osztályokkal dolgozó első projekttel szemben itt **egyszerű függvényekből** építkezünk.

## Követelmények

1. `szavak(szoveg)`: a szöveg szavai **kisbetűvel**, írásjelek nélkül.
2. `mondatok_szama(szoveg)`: a `.`, `!`, `?` jellel lezárt, nem üres mondatok száma.
3. `leggyakoribb(szoveg, n=3)`: az _n_ leggyakoribb **tartalmas** szó (a töltelékszavak – _a, az, és, egy…_ – nélkül), `(szó, darab)` párokban, azonos gyakoriságnál ábécérendben.
4. `statisztika(szoveg)`: szótár a szavak számával, az egyedi szavak számával, a mondatok számával, az átlagos szóhosszal (üres szövegre 0.0) és a leggyakoribb szavakkal.
5. `export_csv(szoveg, fajl)`: a teljes szógyakoriság CSV-be (`szo;db` fejléccel, csökkenő sorrendben).
6. `elemez_fajl(utvonal)`: szövegfájl elemzése; hiányzó fájlnál érthető `FileNotFoundError`.

## Tippek

- A szavakra bontáshoz a legegyszerűbb a reguláris kifejezés: `re.findall(r"\w+", szoveg.lower())` – a `\w` a magyar ékezetes betűket is felismeri.
- A számoláshoz a `collections.Counter` a legkényelmesebb.
- Rendezés több szempont szerint: `sorted(parok, key=lambda p: (-p[1], p[0]))` – a mínusz jel miatt a darabszám csökkenő, a szó növekvő sorrendű.
- Az átlagnál figyelj az üres szövegre (nullával osztás!).

```python starter
"""Szövegelemző."""
import csv
import re
from collections import Counter
from pathlib import Path

TOLTELEKSZAVAK = {"a", "az", "és", "egy", "is", "hogy", "nem", "de", "meg", "van"}

def szavak(szoveg: str) -> list[str]: ...
def mondatok_szama(szoveg: str) -> int: ...
def leggyakoribb(szoveg: str, n: int = 3) -> list[tuple[str, int]]: ...
def statisztika(szoveg: str) -> dict: ...
def export_csv(szoveg: str, fajl: Path) -> None: ...
def elemez_fajl(utvonal: Path) -> dict: ...
```

<details>
<summary>Megoldás</summary>

```python solution
"""Szövegelemző: szó- és mondatstatisztika, leggyakoribb szavak, CSV-export."""
import csv
import re
from collections import Counter
from pathlib import Path

# Gyakori, keveset mondó szavak, amelyeket a gyakorisági listából kihagyunk.
TOLTELEKSZAVAK = {"a", "az", "és", "egy", "is", "hogy", "nem", "de", "meg", "van"}


def szavak(szoveg: str) -> list[str]:
    """A szöveg szavai kisbetűvel, írásjelek nélkül (a számokat is szónak vesszük)."""
    return re.findall(r"\w+", szoveg.lower())


def mondatok_szama(szoveg: str) -> int:
    """Mondatok száma: . ! ? jellel lezárt, nem üres részek."""
    return len([m for m in re.split(r"[.!?]+", szoveg) if m.strip()])


def leggyakoribb(szoveg: str, n: int = 3) -> list[tuple[str, int]]:
    """Az n leggyakoribb tartalmas szó; azonos gyakoriságnál ábécérendben."""
    szamlalo = Counter(sz for sz in szavak(szoveg) if sz not in TOLTELEKSZAVAK)
    return sorted(szamlalo.items(), key=lambda par: (-par[1], par[0]))[:n]


def statisztika(szoveg: str) -> dict:
    """Az összes mutató egy szótárban."""
    lista = szavak(szoveg)
    return {
        "szavak": len(lista),
        "egyedi": len(set(lista)),
        "mondatok": mondatok_szama(szoveg),
        "atlagos_hossz": round(sum(map(len, lista)) / len(lista), 2) if lista else 0.0,
        "leggyakoribb": leggyakoribb(szoveg),
    }


def export_csv(szoveg: str, fajl: Path) -> None:
    """A teljes szógyakoriság mentése CSV-be (szo;db), csökkenő sorrendben."""
    szamlalo = Counter(szavak(szoveg))
    with fajl.open("w", newline="", encoding="utf-8") as f:
        iro = csv.writer(f, delimiter=";")
        iro.writerow(["szo", "db"])
        for szo, db in sorted(szamlalo.items(), key=lambda par: (-par[1], par[0])):
            iro.writerow([szo, db])


def elemez_fajl(utvonal: Path) -> dict:
    """Szövegfájl elemzése; hiányzó fájlnál érthető hibaüzenet."""
    try:
        return statisztika(utvonal.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise FileNotFoundError(f"Nem található a fájl: {utvonal}") from None


if __name__ == "__main__":
    minta = ("A Python egy népszerű nyelv. A Python könnyen olvasható! "
             "Kezdőknek és profiknak is jó nyelv a Python? Igen.")
    for kulcs, ertek in statisztika(minta).items():
        print(f"{kulcs:>14}: {ertek}")

    Path("minta.txt").write_text(minta, encoding="utf-8")
    print("Fájlból:", elemez_fajl(Path("minta.txt"))["szavak"], "szó")
    export_csv(minta, Path("gyakorisag.csv"))
    print(Path("gyakorisag.csv").read_text(encoding="utf-8").splitlines()[:3])
```

</details>

```python test
import tempfile

assert szavak("Szia, Világ! Szia.") == ["szia", "világ", "szia"]
assert mondatok_szama("Egy. Kettő! Három? ") == 3
assert mondatok_szama("") == 0
assert leggyakoribb("alma körte alma szilva körte alma", 2) == [("alma", 3), ("körte", 2)]
assert leggyakoribb("a a a az és kutya", 1) == [("kutya", 1)]   # töltelékszavak nélkül
s = statisztika("Ez egy teszt. Ez is teszt!")
assert s["szavak"] == 6 and s["egyedi"] == 4 and s["mondatok"] == 2
assert statisztika("")["atlagos_hossz"] == 0.0
with tempfile.TemporaryDirectory() as mappa:
    fajl = Path(mappa) / "ki.csv"
    export_csv("b a b", fajl)
    assert fajl.read_text(encoding="utf-8").splitlines() == ["szo;db", "b;2", "a;1"]
    try:
        elemez_fajl(Path(mappa) / "nincs.txt")
        assert False, "FileNotFoundError-t vártunk"
    except FileNotFoundError as hiba:
        assert "nincs.txt" in str(hiba)
print("Minden ellenőrzés sikeres!")
```

## Bővítési ötletek

- **Parancssori használat** `argparse`-szal: `python elemzo.py szoveg.txt --top 10 --csv ki.csv`.
- **Leghosszabb szó**, **leghosszabb mondat**, a szavak **hosszeloszlása** (hány 1, 2, 3… betűs szó van).
- Egyszerű **szótövezés**: a gyakori magyar toldalékok (-ban, -ben, -nak, -nek) levágása, hogy a „nyelv” és a „nyelvben” egy szónak számítson.
- Két szöveg **összehasonlítása**: közös szavak halmazművelettel (`&`).

## A lecke feladata: Bővített szövegstatisztika

Valósítsd meg a szövegelemző egyik bővítési ötletét! Írj `bovitett_statisztika(szoveg)` függvényt, amely szótárat ad vissza:

- `"leghosszabb_szo"`: a leghosszabb szó kisbetűvel (egyenlőségnél az első előforduló),
- `"hosszeloszlas"`: szótár, amely megadja, hány 1, 2, 3… betűs szó van; a kulcsok **növekvő** sorrendben,
- `"leghosszabb_mondat"`: a legtöbb szóból álló mondat szövege, a záró írásjel nélkül, a szélein szóköz nélkül (egyenlőségnél az első).

Szónak a betűkből álló részeket tekintjük (`re.findall(r"[^\W\d_]+", ...)`), a mondatokat a `.`, `!` és `?` jelek zárják (az utolsó mondat után lehet, hogy nincs írásjel). Üres szövegre: `{"leghosszabb_szo": "", "hosszeloszlas": {}, "leghosszabb_mondat": ""}`.

```python starter required
import re


def bovitett_statisztika(szoveg):
    szavak = szoveg.split()
    return {
        "leghosszabb_szo": max(szavak, key=len) if szavak else "",
        "hosszeloszlas": {},
        "leghosszabb_mondat": "",
    }


print(bovitett_statisztika("Szép napunk van. A Python nyelv igazán könnyen tanulható! Ugye?"))
```

<details>
<summary>Megoldás</summary>

```python solution
import re
from collections import Counter

SZO = re.compile(r"[^\W\d_]+")


def bovitett_statisztika(szoveg):
    szavak = SZO.findall(szoveg.lower())
    leghosszabb_szo = ""
    for szo in szavak:
        if len(szo) > len(leghosszabb_szo):
            leghosszabb_szo = szo
    eloszlas = Counter(len(szo) for szo in szavak)
    # Mondatok: írásjelek mentén darabolunk, az üreseket eldobjuk
    mondatok = [m.strip() for m in re.split(r"[.!?]+", szoveg) if m.strip()]
    leghosszabb_mondat = ""
    legtobb = 0
    for mondat in mondatok:
        db = len(SZO.findall(mondat))
        if db > legtobb:
            legtobb, leghosszabb_mondat = db, mondat
    return {
        "leghosszabb_szo": leghosszabb_szo,
        "hosszeloszlas": dict(sorted(eloszlas.items())),
        "leghosszabb_mondat": leghosszabb_mondat,
    }


print(bovitett_statisztika("Szép napunk van. A Python nyelv igazán könnyen tanulható! Ugye?"))
```

</details>

```python test
e = bovitett_statisztika("Szép napunk van. A Python nyelv igazán könnyen tanulható! Ugye?")
assert e["leghosszabb_szo"] == "tanulható", "A leghosszabb szó: tanulható."
assert e["hosszeloszlas"] == {1: 1, 3: 1, 4: 2, 5: 1, 6: 3, 7: 1, 9: 1}, "A szóhossz-eloszlás nem stimmel."
assert list(e["hosszeloszlas"]) == sorted(e["hosszeloszlas"]), "A hosszeloszlás kulcsai növekvő sorrendben legyenek."
assert e["leghosszabb_mondat"] == "A Python nyelv igazán könnyen tanulható", "A leghosszabb mondat írásjel és szélső szóközök nélkül."
e = bovitett_statisztika("Egy kettő három. Négy öt hat")
assert e["leghosszabb_mondat"] == "Egy kettő három", "Egyenlőségnél az első mondat; az utolsó mondat végén nem kötelező az írásjel."
assert e["leghosszabb_szo"] == "kettő", "Egyenlő hosszú szavaknál az első."
assert bovitett_statisztika("") == {"leghosszabb_szo": "", "hosszeloszlas": {}, "leghosszabb_mondat": ""}, "Üres szövegre üres eredmény."
assert bovitett_statisztika("Hm... 42!!! Jó?")["leghosszabb_mondat"] == "Hm", "Több írásjel egymás után egy mondatvéget jelent; a számok nem szavak."
```
