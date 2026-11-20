---
title: Mélyebben – a megfelelő adatszerkezet kiválasztása
summary: Miért gyorsabb a halmaz a listánál a „benne van-e?” kérdésnél (mérve és ábrán), útkeresés egy labirintusban sorral (deque), csoportosítás Counterrel és defaultdicttel, egy saját láncolt lista, és egy keresőmotor alapja, a fordított index – futtatható programokkal és programozós kötelező feladattal.
minutes: 55
---

## Amit ebben a leckében megtanulsz

- hogyan **válassz** adatszerkezetet a feladathoz – és mennyit számít a jó választás,
- hogyan találd meg a **legrövidebb utat** egy labirintusban egy **sor** segítségével,
- hogyan **csoportosíts** és **számolj** kényelmesen szótárakkal,
- hogyan épül fel egy **láncolt lista**, és mikor jobb a sima listánál.

## 1. Lista vagy halmaz: a „benne van-e?” kérdés

Az alapleckékben láttuk az összes alapvető adatszerkezetet. A legfontosabb kérdés mindig: **milyen műveletet** végzünk a legtöbbször? Ha sokszor kérdezzük, hogy egy elem benne van-e, a lista elejétől végéig keres, a halmaz viszont a hasítófüggvénnyel **egyből** a jó helyre ugrik:

```plot
title: Lépések száma egy „benne van-e?” kérdésnél, n elemnél
x: 0, 10000
y: 0, 5000
f: x/2 # lista: átlagosan a felét végig kell nézni
f: 1 # halmaz/szótár: átlagosan egyetlen lépés
```

```python run
# Lista és halmaz összehasonlítása mérve: 100 keresés 100 000 elem között
import time

elemek = list(range(100_000))
lista, halmaz = elemek, set(elemek)
keresettek = range(99_900, 100_000)            # a lista végéről – ez a lista legrosszabb esete

for nev, tarolo in [("lista", lista), ("halmaz", halmaz)]:
    kezdes = time.perf_counter()
    talalat = sum(1 for k in keresettek if k in tarolo)
    ido_ms = (time.perf_counter() - kezdes) * 1000
    print(f"{nev:>6}: {talalat} találat, {ido_ms:8.2f} ms")
```

A pontos idők gépenként mások, de a halmaz **nagyságrendekkel** gyorsabb. Az ár: a halmaz nem őrzi a sorrendet, nem lehet benne ismétlődés, és csak „hasítható” (nem módosítható) elem kerülhet bele. Tipikus felhasználás: már látott elemek, tiltólista, egyedi látogatók.

## 2. Sor: útkeresés egy labirintusban

A **sor** (FIFO) a „szélességi bejárás” (BFS) alapja: a kezdőpontból indulva előbb az 1 lépésre lévő mezőket nézzük meg, aztán a 2 lépésre lévőket, és így tovább – ezért az első alkalommal, amikor elérjük a célt, az biztosan a **legrövidebb** út. A navigáció, a játékok mesterséges intelligenciája és a hálózati útválasztás is ezen az ötleten alapul:

```python run
# Legrövidebb út egy labirintusban szélességi bejárással (sor = deque)
from collections import deque

labirintus = [
    "S.#.....",
    ".##.###.",
    "....#...",
    ".##...#C",
]

def legrovidebb(racs):
    sorok, oszlopok = len(racs), len(racs[0])
    start = next((r, c) for r in range(sorok) for c in range(oszlopok) if racs[r][c] == "S")
    sor = deque([(start, 0)])                   # (mező, eddigi lépések)
    latott = {start}
    while sor:
        (r, c), lepes = sor.popleft()           # a sor ELEJÉRŐL veszünk
        if racs[r][c] == "C":
            return lepes
        for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            ur, uc = r + dr, c + dc
            if 0 <= ur < sorok and 0 <= uc < oszlopok and racs[ur][uc] != "#" and (ur, uc) not in latott:
                latott.add((ur, uc))            # halmaz: gyors "jártunk már itt?"
                sor.append(((ur, uc), lepes + 1))
    return None

print("a legrövidebb út hossza:", legrovidebb(labirintus), "lépés")
```

Miért `deque` és nem lista? A `lista.pop(0)` minden elemet eggyel előrébb tol, ami nagy listánál lassú; a `deque.popleft()` egyetlen lépés. A példában két adatszerkezet dolgozik együtt: a **sor** a bejárás sorrendjét, a **halmaz** a már látott mezőket tartja nyilván. Ha veremmel (a végéről vennénk) csinálnánk ugyanezt, mélységi bejárást kapnánk, amely talál utat, de nem feltétlenül a legrövidebbet.

## 3. Szótárak: csoportosítás és számlálás

Nagyon gyakori feladat: elemeket **csoportokba** rendezni, vagy **megszámolni**, miből mennyi van. A `collections` modul két segédje rövidebbé és biztonságosabbá teszi:

```python run
# Csoportosítás defaultdicttel, számlálás Counterrel
from collections import Counter, defaultdict

eredmenyek = [("Anna", 5), ("Bence", 3), ("Csilla", 5), ("Dani", 4), ("Emese", 3), ("Feri", 5)]

# csoportosítás: jegy → nevek listája
csoportok = defaultdict(list)                   # nem létező kulcsnál automatikusan üres lista
for nev, jegy in eredmenyek:
    csoportok[jegy].append(nev)
for jegy in sorted(csoportok, reverse=True):
    print(f"{jegy}-es: {', '.join(csoportok[jegy])}")

# számlálás: melyik jegyből hány van, és mi a leggyakoribb
db = Counter(jegy for _, jegy in eredmenyek)
print("eloszlás:", dict(sorted(db.items())), "| leggyakoribb:", db.most_common(1))

# szövegben a leggyakoribb szavak
szoveg = "a kutya és a macska és a ló meg a kutya"
print("szavak:", Counter(szoveg.split()).most_common(3))
```

`defaultdict` nélkül minden hozzáadás előtt ellenőrizni kellene, létezik-e már a kulcs (`if jegy not in csoportok: csoportok[jegy] = []`). A `Counter` pedig egy szótár, amely számlálásra van kitalálva: a `most_common(k)` rögtön a k leggyakoribbat adja.

## 4. Láncolt lista: amikor a középre beszúrás a gyakori

A Python listája a memóriában **egybefüggő** tömb: a végére tenni gyors, de az elejére vagy középre beszúrni lassú, mert az összes utána lévő elemet arrébb kell tolni. A **láncolt lista** elemei szétszórva vannak, és mindegyik a következőre mutat – az elejére beszúrás itt egyetlen lépés:

```python run
# Saját egyszeresen láncolt lista: beszúrás az elejére, bejárás, keresés
class Csomopont:
    def __init__(self, ertek, kovetkezo=None):
        self.ertek = ertek
        self.kovetkezo = kovetkezo              # mutató a következő csomópontra

class LancoltLista:
    def __init__(self):
        self.fej = None

    def elejere(self, ertek):
        self.fej = Csomopont(ertek, self.fej)  # az új csomópont a régi fejre mutat

    def __iter__(self):
        akt = self.fej
        while akt is not None:
            yield akt.ertek
            akt = akt.kovetkezo

    def tartalmazza(self, ertek):
        return any(e == ertek for e in self)

bongeszo_elozmeny = LancoltLista()
for oldal in ["kezdolap", "hirek", "sport", "idojaras"]:
    bongeszo_elozmeny.elejere(oldal)          # a legutóbbi oldal kerül előre
print("előzmények (legutóbbi elöl):", list(bongeszo_elozmeny))
print("jártunk a sport oldalon?", bongeszo_elozmeny.tartalmazza("sport"))
```

A gyakorlatban Pythonban ritkán írunk saját láncolt listát (a `deque` belül hasonlóan működik), de érdemes érteni, mert sok más adatszerkezet (fák, gráfok) ugyanígy, **mutatókkal** épül fel.

| Feladat                                | Jó választás       | Miért?                                    |
| -------------------------------------- | ------------------ | ----------------------------------------- |
| sorrend számít, index szerint érünk el | lista              | `l[i]` egy lépés, a végére tenni gyors    |
| „benne van-e?”, ismétlődés kiszűrése   | halmaz             | hasítás: átlagosan egy lépés              |
| kulcs alapján keresünk (név → adat)    | szótár             | hasítás, és a kulcshoz érték tartozik     |
| érkezési sorrendben dolgozunk fel      | sor (`deque`)      | mindkét végén egy lépés                   |
| „visszavonás”, legutóbbi elöl          | verem (lista vége) | `append` és `pop` a végén egy lépés       |
| nem módosítható rekord, szótárkulcs    | tuple              | hasítható, és nem lehet véletlenül átírni |

## Összefoglalás

- A jó adatszerkezetet a leggyakoribb művelet dönti el; a „benne van-e?” kérdésre a halmaz nagyságrendekkel gyorsabb.
- A szélességi bejárás sorral a legrövidebb utat találja meg; a `deque.popleft()` gyors, a `list.pop(0)` lassú.
- A `defaultdict` csoportosításhoz, a `Counter` számláláshoz kényelmes.
- A láncolt lista elejére beszúrni egy lépés; a fák és gráfok is mutatókkal épülnek fel.

## A lecke feladata: fordított index

A keresőmotorok alapja a **fordított index**: minden szóhoz eltárolják, mely dokumentumokban fordul elő. Írd meg a `forditott_index(dokumentumok)` függvényt, amely egy szöveglistából szótárt készít: a kulcs a (kisbetűsített) szó, az érték azon dokumentumok sorszámainak **növekvő, ismétlés nélküli** listája, amelyekben a szó előfordul! A szavakat a `split()` választja el (írásjelekkel most nem kell foglalkozni).

```python starter required
def forditott_index(dokumentumok):
    index = {}
    # menj végig a dokumentumokon (enumerate) és a szavaikon
    return index


print(forditott_index(["a kutya ugat", "a macska nyávog", "kutya és macska"]))
```

<details>
<summary>Megoldás</summary>

```python solution
def forditott_index(dokumentumok):
    index = {}
    for i, dok in enumerate(dokumentumok):
        for szo in set(dok.lower().split()):
            index.setdefault(szo, []).append(i)
    return {szo: sorted(helyek) for szo, helyek in index.items()}


print(forditott_index(["a kutya ugat", "a macska nyávog", "kutya és macska"]))
```

</details>

```python test
idx = forditott_index(["a kutya ugat", "a macska nyávog", "kutya és macska"])
assert idx["kutya"] == [0, 2], "a 'kutya' a 0. és a 2. dokumentumban van"
assert idx["a"] == [0, 1], "az 'a' a 0. és az 1. dokumentumban van"
assert idx["nyávog"] == [1], "a 'nyávog' csak az 1.-ben"
assert forditott_index(["Alma alma ALMA"]) == {"alma": [0]}, "kisbetűsítve, ismétlés nélkül"
assert forditott_index([]) == {}, "üres listára üres szótár"
```
