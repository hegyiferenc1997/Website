---
title: Kivételkezelési minták és jó gyakorlat
summary: Mit kapj el és mit ne, EAFP vagy LBYL, naplózás, erőforrások kezelése – és a leggyakoribb rossz minták.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a kivételkezelés **jó gyakorlatait**,
- a két alapvető szemléletet: **EAFP** és **LBYL**,
- hogyan **naplózz** hibákat,
- melyek a leggyakoribb **rossz minták**.

## 1. Csak azt kapd el, amit kezelni is tudsz

```python run
# ROSSZ: minden hibát elnyel – az elgépelést (NameError) is!
def rossz_atalakit(szoveg):
    try:
        return int(szovge)       # elgépelés: szovge
    except:
        return 0

print(rossz_atalakit("42"))     # 0 – és sosem derül ki, miért

# JÓ: csak a várt hibát kapjuk el.
def jo_atalakit(szoveg):
    try:
        return int(szoveg)
    except ValueError:
        return 0

print(jo_atalakit("42"), jo_atalakit("abc"))
```

> A csupasz `except:` és az `except Exception:` elrejti a programozási hibákat. Csak a program legfelső szintjén (pl. hogy egy szerver ne álljon le) indokolt – és ott is naplózni kell a hibát.

## 2. Legyen kicsi a try blokk

A `try` blokkba csak azt a sort tedd, ami a várt kivételt dobhatja. Így nem kapsz el véletlenül mást.

```python run
adatok = {"pont": "87"}

try:
    nyers = adatok["pont"]       # csak ez dobhat KeyError-t
except KeyError:
    nyers = "0"

pont = int(nyers)                # ez már kívül van
print(pont)
```

## 3. Ne nyeld el csendben a hibát

Egy üres `except: pass` órákig tartó hibakeresést okozhat. Ha tényleg figyelmen kívül hagyható a hiba, legalább írj megjegyzést, _miért_.

```python run
import contextlib
import os

# Ha a fájl nem létezik, az nekünk jó – szándékosan figyelmen kívül hagyjuk.
with contextlib.suppress(FileNotFoundError):
    os.remove("ideiglenes_nem_letezo.txt")
print("Kész.")
```

## 4. EAFP vagy LBYL?

- **LBYL** – _Look Before You Leap_ („nézz körül, mielőtt ugrasz”): előbb ellenőrzünk, aztán cselekszünk.
- **EAFP** – _Easier to Ask Forgiveness than Permission_ („könnyebb bocsánatot kérni, mint engedélyt”): megpróbáljuk, és ha nem sikerül, kezeljük a kivételt.

```python run
szotar = {"alma": 300}

# LBYL
if "körte" in szotar:
    print(szotar["körte"])
else:
    print("nincs körte")

# EAFP – Pythonban gyakoribb
try:
    print(szotar["körte"])
except KeyError:
    print("nincs körte")
```

Pythonban az EAFP a megszokott, mert sokszor rövidebb, és elkerüli a „ellenőrzés és használat közötti” versenyhelyzetet (pl. a fájlt valaki letörli az ellenőrzés után). Egyszerű esetekben az LBYL is teljesen rendben van (`dict.get`, `if x in …`).

## 5. Takaríts fel: with és finally

Az erőforrásokat (fájl, hálózati kapcsolat, zár) **mindig** szabadítsd fel, akkor is, ha hiba történt. Erre a `with` a legjobb:

```python run
import os
import tempfile

utvonal = os.path.join(tempfile.gettempdir(), "pelda_with.txt")
with open(utvonal, "w", encoding="utf-8") as f:
    f.write("szia")
# itt a fájl már biztosan be van zárva – hiba esetén is
print(open(utvonal, encoding="utf-8").read())
os.remove(utvonal)
```

## 6. Naplózz, ne csak printelj

Valódi programokban a hibákat a `logging` modullal naplózzuk: van időbélyeg, súlyossági szint, és fájlba is írható.

```python run
import logging
import sys

logging.basicConfig(stream=sys.stdout, level=logging.INFO, format="%(levelname)s: %(message)s")
naplo = logging.getLogger("pelda")

def feldolgoz(szoveg):
    try:
        return int(szoveg)
    except ValueError:
        naplo.warning("Hibás bemenet, kihagyva: %r", szoveg)
        return None

print([feldolgoz(s) for s in ["1", "x", "3"]])
```

## 7. Hibát időben, egyértelműen jelezz („fail fast”)

Ellenőrizd a bemenetet a függvény **elején**, és érvénytelen adat esetén azonnal dobj érthető üzenetű kivételt. Így a hiba ott derül ki, ahol keletkezett, nem tíz függvénnyel később.

```python run
def kedvezmenyes_ar(ar, kedvezmeny_szazalek):
    if ar < 0:
        raise ValueError("Az ár nem lehet negatív.")
    if not 0 <= kedvezmeny_szazalek <= 100:
        raise ValueError("A kedvezmény 0 és 100 között lehet.")
    return ar * (1 - kedvezmeny_szazalek / 100)

print(kedvezmenyes_ar(10_000, 15))
```

## Gyakori rossz minták

| Rossz minta                                            | Miért baj                    | Helyette                           |
| ------------------------------------------------------ | ---------------------------- | ---------------------------------- |
| `except: pass`                                         | minden hibát elnyel          | konkrét kivétel, naplózás          |
| óriási `try` blokk                                     | véletlenül mást is elkap     | csak a kockázatos sor legyen benne |
| kivétel helyett `-1` / `None` „hibakód”                | a hívó elfelejti ellenőrizni | `raise`                            |
| kivétel a normál vezérlésre (pl. ciklus megállítására) | lassú, nehezen olvasható     | `if`, `break`                      |
| hibaüzenet nélküli `raise ValueError()`                | nem derül ki, mi a gond      | beszédes üzenet                    |

## Összefoglalás

- Konkrét kivételt kapj el, kicsi `try` blokkal; ne nyeld el csendben a hibát.
- Pythonban az **EAFP** a megszokott, de az LBYL is rendben van egyszerű esetekben.
- Erőforrásokhoz `with` / `finally`; hibákhoz `logging`.
- Érvénytelen bemenetre azonnal, beszédes üzenettel dobj kivételt.
