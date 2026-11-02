---
title: 1. mini projekt – raktárkészlet-nyilvántartó
summary: Osztályok, szótár, saját kivételek, JSON-mentés és tesztek egyetlen kis alkalmazásban.
minutes: 40
kind: practice
---

## A projekt célja

Egy kis bolt raktárkészletét kell nyilvántartani. A projekt a félév szinte minden témakörét összekapcsolja: **osztályok** (2. témakör), **szótár** (10.), **kivételkezelés** (12.), **fájlkezelés JSON-nal** (13.), **tesztelés** (14.) és **dokumentálás** (15.).

## Követelmények

1. Egy termékről tároljuk: **cikkszám**, **név**, **egységár**, **mennyiség**; a termék tudja a saját készletértékét.
2. A raktárba új terméket lehet **felvenni** – ugyanaz a cikkszám nem szerepelhet kétszer, az ár és a mennyiség nem lehet negatív.
3. **Bevételezés** (készlet növelése) és **kiadás** (csökkentése) – többet nem lehet kiadni, mint amennyi van.
4. Minden hibás műveletnél egy saját **`KeszletHiba`** kivétel keletkezzen érthető üzenettel.
5. Lekérdezések: **összérték**, **fogyóban lévő** termékek (alapból 5 db alatt, név szerint rendezve).
6. **Mentés** JSON fájlba és **betöltés** onnan.
7. Szöveges **jelentés** táblázatos formában.

## Terv

| Elem     | Megvalósítás                                           | Miért így?                                |
| -------- | ------------------------------------------------------ | ----------------------------------------- |
| termék   | `@dataclass Termek`, `ertek` tulajdonság (`@property`) | kevés kód, automatikus `__init__` és `==` |
| raktár   | `Raktar` osztály, belül `dict[cikkszám, Termek]`       | cikkszám szerint gyors keresés            |
| hibák    | `class KeszletHiba(Exception)`                         | a hívó egyetlen kivételtípust kezel       |
| mentés   | `json` + `dataclasses.asdict`, `pathlib.Path`          | ember által is olvasható formátum         |
| betöltés | `@classmethod betolt(fajl)`                            | „alternatív konstruktor”                  |

## Lépésről lépésre

1. Írd meg a `Termek` adatosztályt és az `ertek` tulajdonságot. Próbáld ki!
2. Írd meg a `Raktar.felvesz` metódust az ellenőrzésekkel.
3. Írj egy `_keres` segédmetódust, amely ismeretlen cikkszámnál `KeszletHiba`-t dob – a `bevetelez` és a `kiad` ezt használja (DRY).
4. Jöhetnek a lekérdezések (`osszertek`, `fogyoban`), majd a mentés/betöltés és a jelentés.
5. Minden lépés után futtass egy rövid próbát!

```python starter
"""Raktárkészlet-nyilvántartó."""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


class KeszletHiba(Exception):
    """Saját kivétel a raktárműveletek hibáira."""


@dataclass
class Termek:
    cikkszam: str
    nev: str
    egysegar: int
    mennyiseg: int = 0
    # TODO: ertek tulajdonság


class Raktar:
    def __init__(self) -> None:
        self.termekek: dict[str, Termek] = {}

    def felvesz(self, termek: Termek) -> None: ...
    def bevetelez(self, cikkszam: str, db: int) -> None: ...
    def kiad(self, cikkszam: str, db: int) -> None: ...
    def osszertek(self) -> int: ...
    def fogyoban(self, hatar: int = 5) -> list[str]: ...
    def ment(self, fajl: Path) -> None: ...
    @classmethod
    def betolt(cls, fajl: Path) -> "Raktar": ...
    def jelentes(self) -> str: ...
```

<details>
<summary>Megoldás</summary>

```python solution
"""Raktárkészlet-nyilvántartó: termékek felvétele, mozgatása, mentése és jelentés."""
import json
from dataclasses import asdict, dataclass
from pathlib import Path


class KeszletHiba(Exception):
    """Saját kivétel a raktárműveletek hibáira."""


@dataclass
class Termek:
    """Egy termék a raktárban."""
    cikkszam: str
    nev: str
    egysegar: int
    mennyiseg: int = 0

    @property
    def ertek(self) -> int:
        """A készlet értéke forintban."""
        return self.egysegar * self.mennyiseg


class Raktar:
    """Termékek nyilvántartása cikkszám szerint (szótárban)."""

    def __init__(self) -> None:
        self.termekek: dict[str, Termek] = {}

    def felvesz(self, termek: Termek) -> None:
        """Új termék felvétele; ugyanaz a cikkszám nem szerepelhet kétszer."""
        if termek.cikkszam in self.termekek:
            raise KeszletHiba(f"Már létezik: {termek.cikkszam}")
        if termek.egysegar < 0 or termek.mennyiseg < 0:
            raise KeszletHiba("Az ár és a mennyiség nem lehet negatív.")
        self.termekek[termek.cikkszam] = termek

    def _keres(self, cikkszam: str) -> Termek:
        """Termék lekérése; ismeretlen cikkszámnál KeszletHiba."""
        try:
            return self.termekek[cikkszam]
        except KeyError:
            raise KeszletHiba(f"Ismeretlen cikkszám: {cikkszam}") from None

    def bevetelez(self, cikkszam: str, db: int) -> None:
        """Készlet növelése."""
        if db <= 0:
            raise KeszletHiba("A mennyiségnek pozitívnak kell lennie.")
        self._keres(cikkszam).mennyiseg += db

    def kiad(self, cikkszam: str, db: int) -> None:
        """Készlet csökkentése; többet nem lehet kiadni, mint ami van."""
        termek = self._keres(cikkszam)
        if db <= 0:
            raise KeszletHiba("A mennyiségnek pozitívnak kell lennie.")
        if db > termek.mennyiseg:
            raise KeszletHiba(f"Nincs elég {termek.nev}: {termek.mennyiseg} db van, {db} kellene.")
        termek.mennyiseg -= db

    def osszertek(self) -> int:
        """A teljes készlet értéke."""
        return sum(t.ertek for t in self.termekek.values())

    def fogyoban(self, hatar: int = 5) -> list[str]:
        """Azoknak a termékeknek a neve, amelyekből `hatar`-nál kevesebb van."""
        return sorted(t.nev for t in self.termekek.values() if t.mennyiseg < hatar)

    def ment(self, fajl: Path) -> None:
        """A raktár mentése JSON fájlba."""
        adat = [asdict(t) for t in self.termekek.values()]
        fajl.write_text(json.dumps(adat, ensure_ascii=False, indent=2), encoding="utf-8")

    @classmethod
    def betolt(cls, fajl: Path) -> "Raktar":
        """Raktár betöltése JSON fájlból."""
        raktar = cls()
        for adat in json.loads(fajl.read_text(encoding="utf-8")):
            raktar.felvesz(Termek(**adat))
        return raktar

    def jelentes(self) -> str:
        """Táblázatos szöveges jelentés."""
        sorok = [f"{'Cikkszám':<8} {'Név':<12} {'Db':>4} {'Érték':>9}"]
        for t in sorted(self.termekek.values(), key=lambda t: t.cikkszam):
            sorok.append(f"{t.cikkszam:<8} {t.nev:<12} {t.mennyiseg:>4} {t.ertek:>9}")
        sorok.append(f"Összesen: {self.osszertek()} Ft")
        return "\n".join(sorok)


if __name__ == "__main__":
    raktar = Raktar()
    raktar.felvesz(Termek("A100", "egér", 4_000, 12))
    raktar.felvesz(Termek("A200", "billentyűzet", 9_000, 3))
    raktar.bevetelez("A200", 5)
    raktar.kiad("A100", 10)
    try:
        raktar.kiad("A100", 5)
    except KeszletHiba as hiba:
        print("Hiba:", hiba)
    print(raktar.jelentes())
    print("Fogyóban:", raktar.fogyoban())

    fajl = Path("raktar.json")
    raktar.ment(fajl)
    print("Visszatöltve:", Raktar.betolt(fajl).osszertek() == raktar.osszertek())
```

</details>

```python test
import tempfile

r = Raktar()
r.felvesz(Termek("X1", "kábel", 1_000, 10))
r.felvesz(Termek("X2", "monitor", 50_000, 1))
assert r.osszertek() == 60_000
r.bevetelez("X2", 2)
r.kiad("X1", 7)
assert r.termekek["X1"].mennyiseg == 3
assert r.fogyoban() == ["kábel", "monitor"]
for hibas in [lambda: r.kiad("X1", 4), lambda: r.kiad("NINCS", 1),
              lambda: r.felvesz(Termek("X1", "dupla", 1)), lambda: r.bevetelez("X1", 0)]:
    try:
        hibas()
        assert False, "KeszletHiba-t vártunk"
    except KeszletHiba:
        pass
with tempfile.TemporaryDirectory() as mappa:
    fajl = Path(mappa) / "teszt.json"
    r.ment(fajl)
    masik = Raktar.betolt(fajl)
    assert masik.termekek == r.termekek
print("Minden ellenőrzés sikeres!")
```

## Bővítési ötletek

- **Menü** a felhasználónak (`input()`-tal): felvétel, bevételezés, kiadás, jelentés, mentés, kilépés.
- **Napló** minden készletmozgásról (dátum, cikkszám, mennyiség) CSV fájlba.
- **Keresés** névrészletre, kis- és nagybetűtől függetlenül.
- Az egységtesztek átírása `unittest` osztályba, külön `test_raktar.py` fájlba.

## A lecke feladata: Rendelés: mindent vagy semmit

Bővítsd a raktárat egy `rendeles(tetelek)` metódussal! A `tetelek` `(cikkszám, darab)` párok listája. A rendelés **atomi** művelet:

- ha **minden** tétel teljesíthető, mindegyiket kiadja a raktárból, és visszaadja a rendelés teljes árát (Σ darab · egységár),
- ha **bármelyik** tétel hibás (ismeretlen cikkszám, nem pozitív darabszám, vagy nincs elég készlet), `KeszletHiba`-t dob, és a raktár készlete **egyáltalán nem változik** – az előtte lévő tételek sem kerülnek kiadásra,
- ugyanaz a cikkszám többször is szerepelhet egy rendelésben: ilyenkor az összesített darabszámnak kell rendelkezésre állnia.

A kiinduló kód már tartalmaz egy egyszerűsített `Raktar` osztályt; a mostani `rendeles` tételenként ad ki, ezért hiba esetén „félig teljesített” rendelést hagy maga után. Tipp: előbb ellenőrizz mindent, és csak utána módosíts.

```python starter required
class KeszletHiba(Exception):
    """Hibás raktárművelet."""


class Raktar:
    def __init__(self):
        self.termekek = {}   # cikkszám -> [név, egységár, mennyiség]

    def felvesz(self, cikkszam, nev, ar, mennyiseg):
        self.termekek[cikkszam] = [nev, ar, mennyiseg]

    def keszlet(self, cikkszam):
        return self.termekek[cikkszam][2]

    def rendeles(self, tetelek):
        osszeg = 0
        for cikkszam, db in tetelek:
            if self.termekek[cikkszam][2] < db:
                raise KeszletHiba(f"Nincs elég: {cikkszam}")
            self.termekek[cikkszam][2] -= db
            osszeg += db * self.termekek[cikkszam][1]
        return osszeg


r = Raktar()
r.felvesz("A1", "Csavar", 20, 100)
r.felvesz("B2", "Anya", 15, 10)
print(r.rendeles([("A1", 30), ("B2", 5)]), r.keszlet("A1"), r.keszlet("B2"))
```

<details>
<summary>Megoldás</summary>

```python solution
from collections import Counter


class KeszletHiba(Exception):
    """Hibás raktárművelet."""


class Raktar:
    def __init__(self):
        self.termekek = {}   # cikkszám -> [név, egységár, mennyiség]

    def felvesz(self, cikkszam, nev, ar, mennyiseg):
        self.termekek[cikkszam] = [nev, ar, mennyiseg]

    def keszlet(self, cikkszam):
        return self.termekek[cikkszam][2]

    def rendeles(self, tetelek):
        # 1. Ellenőrzés – még semmit nem módosítunk
        igeny = Counter()
        for cikkszam, db in tetelek:
            if cikkszam not in self.termekek:
                raise KeszletHiba(f"Ismeretlen cikkszám: {cikkszam}")
            if db <= 0:
                raise KeszletHiba(f"Érvénytelen darabszám: {db}")
            igeny[cikkszam] += db
        for cikkszam, db in igeny.items():
            if self.termekek[cikkszam][2] < db:
                raise KeszletHiba(f"Nincs elég készlet: {cikkszam}")
        # 2. Végrehajtás – itt már nem lehet hiba
        osszeg = 0
        for cikkszam, db in igeny.items():
            self.termekek[cikkszam][2] -= db
            osszeg += db * self.termekek[cikkszam][1]
        return osszeg


r = Raktar()
r.felvesz("A1", "Csavar", 20, 100)
r.felvesz("B2", "Anya", 15, 10)
print(r.rendeles([("A1", 30), ("B2", 5)]), r.keszlet("A1"), r.keszlet("B2"))
```

</details>

```python test
def uj():
    r = Raktar()
    r.felvesz("A1", "Csavar", 20, 100)
    r.felvesz("B2", "Anya", 15, 10)
    return r

r = uj()
assert r.rendeles([("A1", 30), ("B2", 5)]) == 675, "30 · 20 + 5 · 15 = 675."
assert r.keszlet("A1") == 70 and r.keszlet("B2") == 5, "Sikeres rendelés után csökken a készlet."
for rossz in ([("A1", 10), ("B2", 50)], [("A1", 10), ("X9", 1)], [("A1", 10), ("B2", 0)], [("B2", 6), ("B2", 6)]):
    r = uj()
    try:
        r.rendeles(rossz)
        assert False, f"A(z) {rossz} rendelésre KeszletHiba kell."
    except KeszletHiba:
        pass
    assert r.keszlet("A1") == 100 and r.keszlet("B2") == 10, f"Hibás rendelés ({rossz}) után a készlet nem változhat."
r = uj()
assert r.rendeles([("B2", 4), ("B2", 6)]) == 150 and r.keszlet("B2") == 0, "Ugyanaz a cikkszám többször: az összesített darabszám számít."
assert r.rendeles([]) == 0, "Üres rendelés ára 0."
```
