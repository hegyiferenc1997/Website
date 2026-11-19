---
title: Mélyebben – paradigmák a gyakorlatban
summary: Rendezés imperatívan és deklaratívan, egy bankszámla-osztály egységbezárással, örökléssel és többalakúsággal, tiszta függvények és mellékhatások, a megosztott lista csapdája, valamint a map–filter–reduce hármas – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **„hogyan”** (imperatív) és a **„mit”** (deklaratív) leírás között egy valódi feladaton,
- hogyan véd egy **osztály** az adat elrontása ellen (egységbezárás), és mire jó az **öröklés**,
- mi a **tiszta függvény**, és miért okoz nehezen megtalálható hibát a **mellékhatás**,
- hogyan dolgozz a **map**, **filter** és **reduce** eszközökkel.

## 1. Rendezés: „hogyan” vagy „mit”?

Az alapleckében láttuk, hogy az imperatív program lépésről lépésre mondja meg, mit csináljon a gép, a deklaratív pedig azt írja le, milyen eredményt akarunk. Rendezzük a hallgatókat pontszám szerint csökkenő sorrendbe, egyenlőségnél név szerint!

```python run
# Ugyanaz a rendezés imperatívan (kézzel) és deklaratívan (sorted + kulcs)
hallgatok = [("Bence", 78), ("Anna", 92), ("Dóra", 78), ("Csaba", 65)]

# imperatív: beszúrásos rendezés, minden lépést mi írunk meg
eredmeny = []
for h in hallgatok:
    i = 0
    while i < len(eredmeny) and (eredmeny[i][1] > h[1] or (eredmeny[i][1] == h[1] and eredmeny[i][0] < h[0])):
        i += 1                     # megkeressük a helyét
    eredmeny.insert(i, h)
print("imperatív: ", eredmeny)

# deklaratív: csak azt mondjuk meg, MI szerint rendezzen
print("deklaratív:", sorted(hallgatok, key=lambda h: (-h[1], h[0])))
```

A deklaratív változat egy sor, és nehezebb elrontani: a rendezés „hogyanját” a Python bevált, gyors algoritmusa intézi. Az SQL (`ORDER BY pont DESC, nev`) és a HTML is deklaratív. Az imperatív változatnak akkor van értelme, ha a lépések felett teljes irányítás kell – vagy ha épp a rendezést tanuljuk.

## 2. Objektumorientált: egységbezárás, öröklés, többalakúság

Egy bankszámla egyenlegét nem szabad közvetlenül átírni: csak befizetéssel és kivétellel változhat, és nem mehet nulla alá. Az **osztály** az adatot és a szabályait egy helyen tartja:

```python run
# Bankszámla osztály: az egyenleg csak a metódusokon keresztül változhat
class Szamla:
    def __init__(self, tulajdonos):
        self.tulajdonos = tulajdonos
        self._egyenleg = 0                    # a _ jelzi: kívülről ne nyúlj hozzá

    def befizet(self, osszeg):
        if osszeg <= 0:
            raise ValueError("csak pozitív összeg fizethető be")
        self._egyenleg += osszeg

    def kivesz(self, osszeg):
        if osszeg > self._egyenleg:
            raise ValueError("nincs elég fedezet")
        self._egyenleg -= osszeg

    def havi_zaras(self):
        pass                                  # az alap számlánál nincs teendő

    def __str__(self):
        return f"{self.tulajdonos}: {self._egyenleg} Ft"

class Megtakaritas(Szamla):                   # öröklés: mindent tud, amit a Szamla
    def havi_zaras(self):
        self._egyenleg = round(self._egyenleg * 1.005)   # havi 0,5% kamat

szamlak = [Szamla("Anna"), Megtakaritas("Béla")]
for sz in szamlak:
    sz.befizet(100_000)
    sz.havi_zaras()                           # többalakúság: mindegyik a saját módján zár
    print(sz)

try:
    szamlak[0].kivesz(500_000)
except ValueError as e:
    print("Hiba:", e)
```

Három fogalom egy példában: az **egységbezárás** miatt az egyenleg csak szabályosan változik; az **öröklés** miatt a `Megtakaritas` osztályt nem kellett elölről megírni; a **többalakúság** miatt a ciklus nem kérdezi meg, milyen számláról van szó – mindegyik tudja, mit jelent nála a havi zárás.

## 3. Funkcionális: tiszta függvény és mellékhatás

Egy **tiszta függvény** eredménye csak a paramétereitől függ, és nem változtat meg semmit maga körül. A **mellékhatás** (globális változó módosítása, a kapott lista átírása, kiírás, fájlírás) nem tilos, de nehezebbé teszi a hibakeresést. Íme egy klasszikus csapda:

```python run
# A megosztott lista csapdája: a függvény "csendben" átírja a kapott listát
def kedvezmenyes_nem_tiszta(arak):
    for i in range(len(arak)):
        arak[i] = round(arak[i] * 0.9)   # MELLÉKHATÁS: az eredeti listát módosítja
    return arak

def kedvezmenyes_tiszta(arak):
    return [round(a * 0.9) for a in arak]   # új listát ad, az eredeti érintetlen

arak = [1000, 2500, 400]
akcios = kedvezmenyes_tiszta(arak)
print("tiszta után:     eredeti", arak, "akciós", akcios)

akcios = kedvezmenyes_nem_tiszta(arak)
print("nem tiszta után: eredeti", arak, "akciós", akcios, "← az eredeti árak elvesztek!")
```

A nem tiszta változat után az „eredeti” árak is akciósak lettek, mert a Python a listát **hivatkozással** adja át (erről a Paraméterátadás témakörben bővebben lesz szó). A tiszta függvényt könnyű tesztelni (ugyanarra a bemenetre mindig ugyanaz a kimenet), és párhuzamosan is biztonságosan futtatható.

## 4. Map, filter, reduce

A funkcionális stílus három alapeszköze: a **map** minden elemet átalakít, a **filter** megszűr, a **reduce** egyetlen értékké sűrít:

```python run
# A map–filter–reduce hármas egy kosár végösszegén
from functools import reduce

kosar = [("kenyér", 650, 2), ("tej", 420, 3), ("csoki", 890, 1), ("alma", 0, 4)]

tetelek = map(lambda t: (t[0], t[1] * t[2]), kosar)          # tételár = egységár × darab
fizetendo = filter(lambda t: t[1] > 0, tetelek)               # az ingyenes tételt kihagyjuk
vegosszeg = reduce(lambda acc, t: acc + t[1], fizetendo, 0)   # összeadjuk
print("végösszeg:", vegosszeg, "Ft")

# ugyanez Pythonosan, generátorkifejezéssel – a legtöbbször ez az olvashatóbb
print("végösszeg:", sum(ar * db for _, ar, db in kosar if ar > 0), "Ft")
```

Pythonban a listaértelmezés és a `sum` gyakran olvashatóbb, mint a `map`/`filter`/`reduce` – de a gondolkodásmód ugyanaz, és más nyelvekben (JavaScript, Java stream, SQL) pont ezekkel a nevekkel találkozol.

| Nézőpont             | Imperatív                   | Objektumorientált                     | Funkcionális                                  |
| -------------------- | --------------------------- | ------------------------------------- | --------------------------------------------- |
| **kezdő programozó** | a legkönnyebb követni       | több fogalom, de jól modellez         | tömör, eleinte szokatlan                      |
| **nagy csapat**      | könnyen szétesik            | a felelősségek jól elválnak           | kevés rejtett állapot, kevés meglepetés       |
| **tesztelő**         | sok állapotot kell figyelni | az objektum állapotát kell beállítani | a tiszta függvény a legkönnyebben tesztelhető |

## Összefoglalás

- Az imperatív kód a lépéseket, a deklaratív az eredményt írja le; a deklaratív rövidebb, és nehezebb elrontani.
- Az osztály egységbe zárja az adatot és a szabályait; az öröklés újrahasznosít, a többalakúság egységesen kezel különböző objektumokat.
- A tiszta függvény csak a paramétereiből számol; a mellékhatás (pl. a kapott lista átírása) rejtett hibákat okozhat.
- A map átalakít, a filter szűr, a reduce összesít; Pythonban gyakran a listaértelmezés a legolvashatóbb.

## A lecke feladata: saját számla osztály

Írd meg a `Szamla` osztályt! Az `egyenleg` kezdetben 0. A `befizet(osszeg)` növelje az egyenleget, a `kivesz(osszeg)` csökkentse – de ha nincs elég fedezet, dobjon `ValueError`-t, és az egyenleg ne változzon!

```python starter required
class Szamla:
    def __init__(self):
        self.egyenleg = 0

    def befizet(self, osszeg):
        pass

    def kivesz(self, osszeg):
        pass


sz = Szamla()
sz.befizet(5000)
print(sz.egyenleg)
```

<details>
<summary>Megoldás</summary>

```python solution
class Szamla:
    def __init__(self):
        self.egyenleg = 0

    def befizet(self, osszeg):
        self.egyenleg += osszeg

    def kivesz(self, osszeg):
        if osszeg > self.egyenleg:
            raise ValueError("nincs elég fedezet")
        self.egyenleg -= osszeg


sz = Szamla()
sz.befizet(5000)
print(sz.egyenleg)
```

</details>

```python test
s = Szamla()
assert s.egyenleg == 0, "kezdetben 0 az egyenleg"
s.befizet(5000)
s.kivesz(1500)
assert s.egyenleg == 3500, "5000 befizetés és 1500 kivét után 3500"
try:
    s.kivesz(10000)
    assert False, "fedezet nélküli kivétnél ValueError kell"
except ValueError:
    pass
assert s.egyenleg == 3500, "a sikertelen kivét nem változtathatja az egyenleget"
```
