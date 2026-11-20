---
title: Mélyebben – egy projekt elejétől a végéig
summary: Egy kis könyvtári kölcsönző rendszer felépítése lépésről lépésre – követelményekből adatmodell dataclassokkal, üzleti szabályok és ellenőrzés kivételekkel, dátumkezelés és késedelmi díj, mentés és visszatöltés JSON-ba, végül jelentés és automatikus ellenőrzés. A tárgy szinte minden témaköre egyetlen programban.
minutes: 60
---

## Amit ebben a leckében megtanulsz

- hogyan lesz a **követelményekből** adatmodell (osztályok, mezők),
- hogyan írd meg az **üzleti szabályokat** úgy, hogy hibás művelet ne ronthassa el az adatokat,
- hogyan számolj **dátumokkal** (határidő, késés),
- hogyan **mentsd** és töltsd vissza az állapotot, és hogyan **ellenőrizd** automatikusan, hogy minden működik.

## 1. Követelményektől az adatmodellig

Az alapleckékben láttuk a problémamegoldás lépéseit és két mini projektet. Most egy kicsit nagyobbat építünk, és közben a tárgy szinte minden témaköre előkerül. A megrendelő (egy egyetemi könyvtár) kérései:

1. A könyveket azonosító, cím és szerző alapján tartjuk nyilván.
2. Egy hallgató egyszerre legfeljebb 3 könyvet kölcsönözhet, 14 napra.
3. Késés esetén napi 100 Ft díj jár, legfeljebb 3000 Ft könyvenként.
4. Kell egy jelentés a kint lévő és a késésben lévő könyvekről.

A főneveiből lesznek az **osztályok** (könyv, kölcsönzés), a tulajdonságokból a **mezők**. A `dataclass` megírja helyettünk a konstruktort és a kiírást:

```python run
# Adatmodell dataclassokkal: a követelmények főnevei osztályok, a tulajdonságok mezők lesznek
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Optional

KOLCSONZESI_NAPOK = 14
MAX_KONYV = 3

@dataclass
class Konyv:
    azonosito: str
    cim: str
    szerzo: str

@dataclass
class Kolcsonzes:
    konyv_id: str
    hallgato: str
    kiadva: date
    visszahozva: Optional[date] = None          # None: még kint van

    @property
    def hatarido(self) -> date:
        return self.kiadva + timedelta(days=KOLCSONZESI_NAPOK)

k = Konyv("K1", "A Pál utcai fiúk", "Molnár Ferenc")
kv = Kolcsonzes("K1", "anna", date(2026, 9, 1))
print(k)
print(kv, "→ határidő:", kv.hatarido)
```

A konstansok (`KOLCSONZESI_NAPOK`, `MAX_KONYV`) egy helyen vannak: ha a könyvtár holnap 21 napra módosítja a kölcsönzést, egyetlen számot kell átírni. A `hatarido` egy **számított** tulajdonság: nem tároljuk, hanem mindig a kiadás dátumából számoljuk, így nem lehet ellentmondásban vele.

## 2. Üzleti szabályok és ellenőrzés

A rendszer „agya” egy osztály, amely a szabályokat őrzi. Minden művelet **először ellenőriz**, és csak akkor módosít, ha minden rendben van – így egy hibás kérés nem hagyja félkész állapotban az adatokat:

```python run
# A könyvtár osztálya: minden művelet előbb ellenőriz, csak utána módosít
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

KOLCSONZESI_NAPOK, MAX_KONYV, NAPI_DIJ, MAX_DIJ = 14, 3, 100, 3000

@dataclass
class Kolcsonzes:
    konyv_id: str
    hallgato: str
    kiadva: date
    visszahozva: Optional[date] = None

    @property
    def hatarido(self):
        return self.kiadva + timedelta(days=KOLCSONZESI_NAPOK)

class KonyvtarHiba(Exception):
    pass

class Konyvtar:
    def __init__(self, konyvek):
        self.konyvek = dict(konyvek)              # azonosító → cím
        self.kolcsonzesek = []

    def kint_van(self, konyv_id):
        return any(k.konyv_id == konyv_id and k.visszahozva is None for k in self.kolcsonzesek)

    def kolcsonoz(self, hallgato, konyv_id, nap):
        if konyv_id not in self.konyvek:
            raise KonyvtarHiba(f"nincs ilyen könyv: {konyv_id}")
        if self.kint_van(konyv_id):
            raise KonyvtarHiba(f"a(z) {konyv_id} már ki van kölcsönözve")
        nala = sum(1 for k in self.kolcsonzesek if k.hallgato == hallgato and k.visszahozva is None)
        if nala >= MAX_KONYV:
            raise KonyvtarHiba(f"{hallgato} nála már {MAX_KONYV} könyv van")
        self.kolcsonzesek.append(Kolcsonzes(konyv_id, hallgato, nap))   # csak az ellenőrzések után

    def visszahoz(self, konyv_id, nap):
        for k in self.kolcsonzesek:
            if k.konyv_id == konyv_id and k.visszahozva is None:
                k.visszahozva = nap
                keses = max(0, (nap - k.hatarido).days)
                return min(keses * NAPI_DIJ, MAX_DIJ)
        raise KonyvtarHiba(f"a(z) {konyv_id} nincs kikölcsönözve")

tar = Konyvtar({"K1": "A Pál utcai fiúk", "K2": "Egri csillagok", "K3": "Az ember tragédiája", "K4": "Abigél"})
szept = lambda nap: date(2026, 9, nap)

muveletek = [
    ("kolcsonoz", "anna", "K1", szept(1)), ("kolcsonoz", "béla", "K1", szept(2)),
    ("kolcsonoz", "anna", "K2", szept(2)), ("kolcsonoz", "anna", "K3", szept(3)),
    ("kolcsonoz", "anna", "K4", szept(3)), ("kolcsonoz", "anna", "K9", szept(4)),
]
for nev, hallgato, konyv, nap in muveletek:
    try:
        tar.kolcsonoz(hallgato, konyv, nap)
        print(f"OK:   {hallgato} kikölcsönözte: {konyv}")
    except KonyvtarHiba as e:
        print(f"HIBA: {e}")

print("K1 visszahozva időben, díj:", tar.visszahoz("K1", szept(10)), "Ft")
print("K2 visszahozva 5 nap késéssel, díj:", tar.visszahoz("K2", szept(21)), "Ft")
```

Figyeld meg a sorrendet a `kolcsonoz` metódusban: három ellenőrzés, és csak a legvégén az `append`. Ha bármelyik ellenőrzés elbukik, a kivétel miatt a módosítás el sem kezdődik. Ez az **„előbb ellenőrizz, aztán cselekedj”** elv – az adatbázisok tranzakciói ugyanezt garantálják nagyobb léptékben.

## 3. Mentés és visszatöltés

A program bezárásakor az állapot nem veszhet el. A JSON nem ismeri a `date` típust, ezért mentéskor szöveggé (ISO-formátum: `2026-09-01`), betöltéskor vissza dátummá alakítjuk:

```python run
# Állapot mentése JSON-ba és visszatöltése: a dátumokat ISO-szövegként tároljuk
import json
from dataclasses import dataclass, asdict
from datetime import date
from typing import Optional

@dataclass
class Kolcsonzes:
    konyv_id: str
    hallgato: str
    kiadva: date
    visszahozva: Optional[date] = None

def mentes(kolcsonzesek, fajlnev):
    adat = []
    for k in kolcsonzesek:
        sor = asdict(k)
        sor["kiadva"] = k.kiadva.isoformat()
        sor["visszahozva"] = k.visszahozva.isoformat() if k.visszahozva else None
        adat.append(sor)
    with open(fajlnev, "w", encoding="utf-8") as f:
        json.dump(adat, f, ensure_ascii=False, indent=2)

def betoltes(fajlnev):
    with open(fajlnev, encoding="utf-8") as f:
        adat = json.load(f)
    return [Kolcsonzes(s["konyv_id"], s["hallgato"], date.fromisoformat(s["kiadva"]),
                       date.fromisoformat(s["visszahozva"]) if s["visszahozva"] else None) for s in adat]

eredeti = [Kolcsonzes("K1", "anna", date(2026, 9, 1), date(2026, 9, 10)), Kolcsonzes("K3", "béla", date(2026, 9, 3))]
mentes(eredeti, "kolcsonzesek.json")
print(open("kolcsonzesek.json", encoding="utf-8").read())
print("visszatöltve ugyanaz?", betoltes("kolcsonzesek.json") == eredeti)
```

Az utolsó sor a legfontosabb: a **mentés–betöltés oda-vissza út** után ugyanazt kell kapnunk. A dataclassok `==` összehasonlítása mezőnként dolgozik, így ez egyetlen sorban ellenőrizhető. Ez egy tipikus **tulajdonság**, amit érdemes tesztben rögzíteni.

## 4. Jelentés és automatikus ellenőrzés

Végül a megrendelő kérte jelentés, és egy kis tesztcsomag, amely minden módosítás után megmutatja, hogy a szabályok még mindig érvényesek:

```python run
# Jelentés a kint lévő és késésben lévő könyvekről, plusz automatikus ellenőrzések
from datetime import date, timedelta

KOLCSONZESI_NAPOK, NAPI_DIJ, MAX_DIJ = 14, 100, 3000
kolcsonzesek = [   # (könyv, hallgató, kiadva, visszahozva)
    ("K1", "anna", date(2026, 9, 1), date(2026, 9, 10)),
    ("K2", "anna", date(2026, 9, 2), None),
    ("K3", "béla", date(2026, 9, 20), None),
    ("K4", "csilla", date(2026, 8, 1), None),
]
ma = date(2026, 10, 1)

def dij(kiadva, nap):
    keses = max(0, (nap - (kiadva + timedelta(days=KOLCSONZESI_NAPOK))).days)
    return min(keses * NAPI_DIJ, MAX_DIJ)

print(f"Jelentés – {ma}")
print(f"{'könyv':<6}{'hallgató':<9}{'határidő':<12}{'állapot':<22}{'díj':>6}")
for konyv, hallgato, kiadva, vissza in kolcsonzesek:
    if vissza is not None:
        continue                                            # csak a kint lévők
    hatarido = kiadva + timedelta(days=KOLCSONZESI_NAPOK)
    keses = (ma - hatarido).days
    allapot = f"KÉSÉSBEN ({keses} nap)" if keses > 0 else "rendben"
    print(f"{konyv:<6}{hallgato:<9}{hatarido.isoformat():<12}{allapot:<22}{dij(kiadva, ma):>5} Ft")

# automatikus ellenőrzések a szabályokra
assert dij(date(2026, 9, 1), date(2026, 9, 15)) == 0, "a határidő napján még nincs díj"
assert dij(date(2026, 9, 1), date(2026, 9, 16)) == 100, "egy nap késés 100 Ft"
assert dij(date(2026, 1, 1), date(2026, 12, 31)) == MAX_DIJ, "a díj nem lehet több a maximumnál"
print("minden ellenőrzés sikeres ✓")
```

A jelentés két könyvet mutat késésben – a K4-nél a díj elérte a 3000 Ft-os plafont. Az ellenőrzések pontosan a követelmények **határeseteit** rögzítik (határidő napja, egy nap késés, plafon): ha valaki később elrontja a díjszámítást, azonnal kiderül.

| Nézőpont        | Mit vár ettől a rendszertől?                                                              |
| --------------- | ----------------------------------------------------------------------------------------- |
| **hallgató**    | lássa, mi van nála és mikor jár le; a díj legyen kiszámítható és igazságos                |
| **könyvtáros**  | a szabályokat a program érvényesítse, ne neki kelljen fejben tartani                      |
| **fejlesztő**   | konstansok egy helyen, kis metódusok, tesztek – a szabályok könnyen módosíthatók          |
| **adatvédelem** | a hallgatók kölcsönzési adatai személyes adatok: csak a szükséges ideig, védetten tárolva |

## Összefoglalás

- A követelmények főneveiből osztályok, tulajdonságaiból mezők lesznek; a konstansok egy helyen legyenek.
- Minden művelet előbb ellenőriz, és csak utána módosít; a hibát saját kivétel jelzi.
- A dátumokkal a `datetime` modul számol; JSON-ba ISO-szövegként mentjük őket.
- A mentés–betöltés oda-vissza út és a szabályok határesetei automatikus ellenőrzésbe valók.

## A lecke feladata: késedelmi díj

Írd meg a `kesedelmi_dij(kiadva, visszahozva)` függvényt, amely két `date` objektumból kiszámolja a késedelmi díjat a lecke szabályai szerint: a határidő a kiadás után 14 nappal van; ha a könyv a határidő napján vagy előtte jön vissza, a díj 0; utána minden késésben lévő nap 100 Ft, de legfeljebb 3000 Ft. (Két dátum különbsége egy `timedelta`, amelynek `.days` mezője a napok száma.)

```python starter required
from datetime import date, timedelta


def kesedelmi_dij(kiadva, visszahozva):
    hatarido = kiadva + timedelta(days=14)
    return 0


print(kesedelmi_dij(date(2026, 9, 1), date(2026, 9, 21)))
```

<details>
<summary>Megoldás</summary>

```python solution
from datetime import date, timedelta


def kesedelmi_dij(kiadva, visszahozva):
    hatarido = kiadva + timedelta(days=14)
    keses = max(0, (visszahozva - hatarido).days)
    return min(keses * 100, 3000)


print(kesedelmi_dij(date(2026, 9, 1), date(2026, 9, 21)))
```

</details>

```python test
from datetime import date
assert kesedelmi_dij(date(2026, 9, 1), date(2026, 9, 10)) == 0, "határidő előtt nincs díj"
assert kesedelmi_dij(date(2026, 9, 1), date(2026, 9, 15)) == 0, "a határidő napján sincs díj"
assert kesedelmi_dij(date(2026, 9, 1), date(2026, 9, 21)) == 600, "6 nap késés 600 Ft"
assert kesedelmi_dij(date(2026, 1, 1), date(2026, 6, 1)) == 3000, "legfeljebb 3000 Ft"
assert kesedelmi_dij(date(2026, 12, 25), date(2027, 1, 10)) == 200, "évváltáson át is jól számol"
```
