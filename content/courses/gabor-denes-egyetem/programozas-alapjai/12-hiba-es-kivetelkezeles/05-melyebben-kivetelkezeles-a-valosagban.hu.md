---
title: Mélyebben – kivételkezelés a valóságban
summary: Miért veszélyes a túl széles except, saját kivételosztályok hierarchiával és láncolással, a with és a finally mint garantált takarítás (saját környezetkezelővel), és az újrapróbálás exponenciális várakozással egy akadozó szolgáltatásnál – futtatható programokkal, ábrával és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- miért kell **pontosan** azt a kivételt elkapni, amire számítasz – és mit rejt el a túl széles `except`,
- hogyan írj **saját kivételosztályokat**, és hogyan add tovább az eredeti okot (**láncolás**),
- hogyan garantálja a `finally` és a `with`, hogy az erőforrás hiba esetén is felszabaduljon,
- hogyan kezeld az **átmeneti** hibákat újrapróbálással.

## 1. A túl széles except elrejti a hibát

Az alapleckében láttuk, hogy a `try–except` elkapja a hibát, és a program tovább tud futni. A kísértés nagy, hogy „mindent” elkapjunk – de ez a programozási hibákat is elnyeli:

```python run
# A túl széles except egy elírást is "kezel" – így a hiba rejtve marad
def atlag_rossz(szamok):
    try:
        return sum(szamok) / len(szamk)          # ELÍRÁS: szamk (NameError)
    except Exception:
        return 0                                 # "üres listánál 0" – de ez MINDENT elnyel

def atlag_jo(szamok):
    try:
        return sum(szamok) / len(szamok)
    except ZeroDivisionError:                    # csak arra számítunk, ami tényleg előfordulhat
        return 0

print("rossz változat [4, 5]:", atlag_rossz([4, 5]), " ← hibás eredmény, és senki nem tudja, miért")
print("jó változat [4, 5]:   ", atlag_jo([4, 5]))
print("jó változat []:       ", atlag_jo([]))

# a kivételek hierarchiája: az except az alosztályokat is elkapja
print("ZeroDivisionError ⊂ ArithmeticError ⊂ Exception:",
      issubclass(ZeroDivisionError, ArithmeticError), issubclass(ArithmeticError, Exception))
```

A rossz változat minden bemenetre 0-t ad – a `NameError`-t (az elírást) is „üres listának” tekinti. Az ilyen hibát napokig lehet keresni. A szabály: **csak azt kapd el, amire számítasz, és amit értelmesen kezelni tudsz**; minden más hadd szálljon el egy érthető hibaüzenettel. A legszélesebb `except:` (típus nélkül) még a Ctrl+C-t is elkapja – soha ne használd.

## 2. Saját kivételek: hierarchia és láncolás

Egy nagyobb programban érdemes saját kivételosztályokat létrehozni: a hívó így pontosan tudja, mi történt, és a hibához **adatot** is csatolhatunk. A `raise … from …` megőrzi az eredeti okot:

```python run
# Saját kivételhierarchia adatokkal, és kivételláncolás (raise ... from ...)
class RendelesHiba(Exception):
    """A rendeléskezelés összes hibájának őse."""

class NincsKeszleten(RendelesHiba):
    def __init__(self, termek, kert, van):
        super().__init__(f"{termek}: {kert} db kellene, csak {van} van")
        self.termek, self.hiany = termek, kert - van       # a hívó felhasználhatja

class ErvenytelenRendeles(RendelesHiba):
    pass

keszlet = {"toll": 10, "füzet": 2}

def rendel(sor):
    try:
        termek, db = sor.split(":")
        db = int(db)
    except ValueError as e:
        raise ErvenytelenRendeles(f"hibás formátum: {sor!r}") from e   # az eredeti ok megmarad
    if keszlet.get(termek, 0) < db:
        raise NincsKeszleten(termek, db, keszlet.get(termek, 0))
    keszlet[termek] -= db
    return f"OK: {db} {termek}"

for sor in ["toll:3", "füzet:5", "radír", "toll:sok"]:
    try:
        print(rendel(sor))
    except NincsKeszleten as e:
        print("Hiány:", e, f"→ rendeljünk utána {e.hiany} db-ot")
    except RendelesHiba as e:                    # az összes többi rendelési hiba
        print("Rendelési hiba:", e, "| eredeti ok:", repr(e.__cause__))
```

A hívó dönthet: a `NincsKeszleten`-t külön kezeli (és felhasználja a `hiany` adatot), a többit az ős `RendelesHiba` alapján egyben. A láncolás miatt a naplóban az eredeti `ValueError` is látszik, ami a hibakeresést nagyon megkönnyíti.

## 3. Garantált takarítás: finally és with

Egy megnyitott fájlt, adatbázis-kapcsolatot vagy zárolást **mindig** fel kell szabadítani, akkor is, ha közben hiba történt. Erre való a `finally`, és még kényelmesebben a `with` utasítás, amely egy **környezetkezelőt** használ:

```python run
# Saját környezetkezelő: a "kilépés" hiba esetén is lefut
class Kapcsolat:
    def __init__(self, nev):
        self.nev = nev

    def __enter__(self):
        print(f"  [{self.nev}] kapcsolat megnyitva")
        return self

    def __exit__(self, tipus, hiba, nyomkovetes):
        print(f"  [{self.nev}] kapcsolat lezárva" + (f" (hiba volt: {tipus.__name__})" if tipus else ""))
        return False                             # False: a hibát nem nyeljük el, továbbmegy

print("sikeres művelet:")
with Kapcsolat("adatbázis") as k:
    print("  lekérdezés fut...")

print("hibás művelet:")
try:
    with Kapcsolat("adatbázis") as k:
        print("  lekérdezés fut...")
        raise TimeoutError("a szerver nem válaszol")
except TimeoutError as e:
    print("  a hívó elkapta:", e)
```

A második esetben a kapcsolat **a hiba ellenére** lezárult, mielőtt a hívó elkapta volna a kivételt. Ugyanezért írjuk a fájlkezelést `with open(...) as f:` alakban: a fájl akkor is bezárul, ha olvasás közben hiba történik. Ha ezt elmulasztjuk, egy hosszan futó szerver előbb-utóbb kifogy a megnyitható fájlokból vagy kapcsolatokból.

## 4. Átmeneti hibák: újrapróbálás exponenciális várakozással

Egy hálózati szolgáltatás néha egy pillanatra nem elérhető (túlterhelés, újraindulás). Az ilyen **átmeneti** hibánál érdemes újrapróbálni – de nem azonnal és nem végtelenszer, hanem egyre hosszabb szünetekkel, hogy ne terheljük tovább a bajban lévő szervert:

```plot
title: Várakozás (s) az n-edik újrapróbálás előtt
x: 0, 8
y: 0, 30
param: a = 0.1, 0.05, 1, 0.05
f: a*2^x # exponenciális várakozás: minden próbálkozás után duplázódik
```

```python run
# Újrapróbálás exponenciális várakozással egy akadozó (szimulált) szolgáltatásnál
import random

random.seed(4)

def akadozo_szolgaltatas():
    if random.random() < 0.6:                    # 60% eséllyel átmeneti hiba
        raise ConnectionError("szolgáltatás átmenetileg nem elérhető")
    return "adat megérkezett"

def ujraprobal(muvelet, max_probalkozas=5, alap=0.1):
    for probalkozas in range(max_probalkozas):
        try:
            return muvelet()
        except ConnectionError as e:
            varakozas = alap * 2 ** probalkozas  # 0,1 s, 0,2 s, 0,4 s, ...
            print(f"  {probalkozas + 1}. próbálkozás sikertelen ({e}), várakozás {varakozas:.1f} s")
            # valódi programban itt: time.sleep(varakozas)
    raise ConnectionError(f"{max_probalkozas} próbálkozás után is sikertelen")

for kor in range(3):
    print(f"{kor + 1}. kérés:")
    try:
        print("  eredmény:", ujraprobal(akadozo_szolgaltatas))
    except ConnectionError as e:
        print("  végleges hiba:", e)
```

Fontos különbség: a `ConnectionError` **átmeneti** – érdemes újrapróbálni; egy `ValueError` (hibás adat) vagy egy „nincs jogosultság” hiba viszont **végleges**: az újrapróbálás csak az időt húzza, a hibát azonnal jelezni kell. A valódi rendszerek a várakozáshoz egy kis véletlent is adnak (jitter), hogy ezer egyszerre elakadt kliens ne pontosan egyszerre próbálkozzon újra.

| Nézőpont        | Mit vár a hibakezeléstől?                                                     |
| --------------- | ----------------------------------------------------------------------------- |
| **felhasználó** | érthető üzenet („Nincs elég készlet, 3 db hiányzik”), nem nyomkövetés         |
| **fejlesztő**   | a pontos hiba és az eredeti ok a naplóban – semmi ne vesszen el csendben      |
| **üzemeltető**  | az erőforrások mindig felszabadulnak; az átmeneti hibákat a rendszer kiheveri |
| **biztonság**   | a hibaüzenet ne áruljon el belső részleteket (jelszót, elérési utat, SQL-t)   |

## Összefoglalás

- Csak azt a kivételt kapd el, amire számítasz; a túl széles `except` elrejti a programozási hibákat.
- Saját kivételosztályokkal a hívó pontosan tudja, mi történt; a `raise … from …` megőrzi az okot.
- A `finally` és a `with` garantálja, hogy az erőforrás hiba esetén is felszabaduljon.
- Átmeneti hibánál újrapróbálunk egyre hosszabb várakozással; végleges hibánál azonnal jelzünk.

## A lecke feladata: ellenőrzött beolvasás saját kivétellel

A kiinduló kódban adott egy saját kivételosztály: `TartomanyHiba`, amely a `ValueError` alosztálya. Írd meg a `szam_beolvas(szoveg, also, felso)` függvényt, amely a szövegből egész számot készít! Ha a szöveg nem egész szám, a `int()` által dobott `ValueError` menjen tovább (ne kapd el). Ha a szám kívül esik az `[also, felso]` tartományon, dobj `TartomanyHiba`-t. Egyébként add vissza a számot. A szöveg elején és végén lévő szóközök ne zavarjanak.

```python starter required
class TartomanyHiba(ValueError):
    pass


def szam_beolvas(szoveg, also, felso):
    return int(szoveg)


print(szam_beolvas(" 42 ", 1, 100))
```

<details>
<summary>Megoldás</summary>

```python solution
class TartomanyHiba(ValueError):
    pass


def szam_beolvas(szoveg, also, felso):
    szam = int(szoveg.strip())
    if not also <= szam <= felso:
        raise TartomanyHiba(f"{szam} nincs {also} és {felso} között")
    return szam


print(szam_beolvas(" 42 ", 1, 100))
```

</details>

```python test
assert szam_beolvas(" 42 ", 1, 100) == 42, "a szóközök nem zavarnak"
assert szam_beolvas("1", 1, 100) == 1 and szam_beolvas("100", 1, 100) == 100, "a határok még jók"
try:
    szam_beolvas("150", 1, 100)
    assert False, "150 esetén TartomanyHiba kell"
except TartomanyHiba:
    pass
try:
    szam_beolvas("negyven", 1, 100)
    assert False, "nem szám esetén ValueError kell"
except TartomanyHiba:
    assert False, "nem számra sima ValueError kell, nem TartomanyHiba"
except ValueError:
    pass
```
