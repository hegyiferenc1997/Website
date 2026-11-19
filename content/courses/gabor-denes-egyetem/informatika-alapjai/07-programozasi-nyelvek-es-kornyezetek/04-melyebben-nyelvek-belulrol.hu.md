---
title: Mélyebben – nyelvek és eszközök belülről
summary: Ugyanaz a feladat három paradigmában, egy apró értelmező, amely kifejezéseket számol ki, a háromféle hiba elkapása programmal, mikor éri meg a fordítás az értelmezéshez képest, és hogyan védi a git a történetet hash-láncolattal – kis programokkal és interaktív ábrával.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan néz ki **ugyanaz a feladat** imperatív, funkcionális és deklaratív stílusban,
- mit csinál belül egy **értelmező** – egy saját mini-értelmezőn keresztül,
- hogyan **kapod el** a szintaktikai, a futásidejű és a logikai hibát,
- miért nem lehet „észrevétlenül” átírni a **git** történetét.

## 1. Egy feladat, három paradigma

Az alapleckében megismerted a paradigmákat. A különbség akkor látszik igazán, ha **ugyanazt** a feladatot oldjuk meg többféleképpen. A feladat: egy jegylista alapján add meg a sikeres (legalább 2-es) jegyek átlagát.

```python run
# Ugyanaz a feladat három stílusban: a sikeres jegyek átlaga
jegyek = [5, 1, 4, 2, 1, 3, 5]

# 1) imperatív: lépésről lépésre, változók módosításával
osszeg, db = 0, 0
for j in jegyek:
    if j >= 2:
        osszeg += j
        db += 1
print("imperatív:  ", osszeg / db)

# 2) funkcionális: függvények egymásba ágyazva, módosítás nélkül
from functools import reduce
sikeres = list(filter(lambda j: j >= 2, jegyek))
print("funkcionális:", reduce(lambda a, b: a + b, sikeres) / len(sikeres))

# 3) deklaratív: azt mondjuk meg, MIT akarunk, nem azt, hogyan
from statistics import mean
print("deklaratív:  ", mean(j for j in jegyek if j >= 2))
```

Ugyanez SQL-ben (ami tisztán deklaratív nyelv) így nézne ki: `SELECT AVG(jegy) FROM jegyek WHERE jegy >= 2;` – itt az adatbázis dönti el, **hogyan** keresi meg és adja össze az értékeket. **Nézőpontok**: az imperatív stílus kezdőként a legkönnyebben követhető, a funkcionális kevesebb rejtett állapotváltozással jár (könnyebb tesztelni), a deklaratív a legrövidebb, de el kell fogadnod, hogy a „hogyan” rejtve marad.

## 2. Egy apró értelmező

Hogyan érti meg a Python a `2 + 3 * 4` sort? Egy értelmező (és egy fordító eleje is) két lépésben dolgozik:

1. **lexikai elemzés**: a szöveget **tokenekre** bontja (`2`, `+`, `3`, `*`, `4`),
2. **szintaktikai elemzés és kiértékelés**: a nyelvtan szerint felépíti a szerkezetet (a szorzás erősebb az összeadásnál), és kiszámolja.

Írjunk egy mini-értelmezőt a négy alapműveletre és a zárójelekre:

```python run
# Mini-értelmező: tokenekre bontás + rekurzív kiértékelés (műveleti sorrenddel)
import re

def tokenek(szoveg):
    return re.findall(r"\d+\.?\d*|[-+*/()]", szoveg)

def kiertekel(szoveg):
    t = tokenek(szoveg)
    poz = 0

    def kovetkezo():
        return t[poz] if poz < len(t) else None

    def tenyezo():                          # szám vagy zárójeles kifejezés
        nonlocal poz
        tok = kovetkezo()
        poz += 1
        if tok == "(":
            ertek = kifejezes()
            poz += 1                        # a ")" átlépése
            return ertek
        return float(tok)

    def tag():                              # szorzás, osztás: erősebb
        nonlocal poz
        ertek = tenyezo()
        while kovetkezo() in ("*", "/"):
            op = kovetkezo(); poz += 1
            ertek = ertek * tenyezo() if op == "*" else ertek / tenyezo()
        return ertek

    def kifejezes():                        # összeadás, kivonás: gyengébb
        nonlocal poz
        ertek = tag()
        while kovetkezo() in ("+", "-"):
            op = kovetkezo(); poz += 1
            ertek = ertek + tag() if op == "+" else ertek - tag()
        return ertek

    return kifejezes()

for k in ["2 + 3 * 4", "(2 + 3) * 4", "10 / 4 - 1", "2 * (3 + 4) * 5"]:
    print(f"{k:<16} tokenek: {tokenek(k)} → {kiertekel(k)}")
```

A valódi Python ugyanezt csinálja, csak sokkal több szabállyal – és egy köztes lépéssel: a szerkezetből **bájtkódot** készít, amelyet egy virtuális gép futtat. A `dis` modullal meg is nézheted: `import dis; dis.dis("2 + x * 4")`.

## 3. A háromféle hiba – programmal

Az alapleckében három hibafajtát különböztettünk meg. Mindhármat el tudjuk kapni – de máshol és másképp:

```python run
# Szintaktikai, futásidejű és logikai hiba – hol és hogyan derül ki?
# 1) szintaktikai: már futtatás ELŐTT kiderül (a fordítás/elemzés során)
try:
    compile("print('hiányzó zárójel'", "<kód>", "exec")
except SyntaxError as e:
    print("szintaktikai hiba:", e.msg)

# 2) futásidejű: csak akkor derül ki, amikor az adott sor lefut, adott adattal
def atlag(lista):
    return sum(lista) / len(lista)

try:
    atlag([])
except ZeroDivisionError as e:
    print("futásidejű hiba:", e)

# 3) logikai: a program lefut, de rossz eredményt ad – csak teszt fogja meg
def atlag_hibas(lista):
    return sum(lista) / (len(lista) + 1)      # elírás: +1

try:
    assert atlag_hibas([2, 4]) == 3, "az átlag 3 kellene legyen"
except AssertionError as e:
    print("logikai hiba (a teszt fogta meg):", e)
```

A tanulság: a szintaktikai hibát a **fordító/értelmező**, a futásidejűt egy **próbafuttatás** vagy hibakezelés (`try`), a logikait csak a **teszt** fogja meg. Ezért írnak a fejlesztők automatikus teszteket.

## 4. Fordítás vagy értelmezés – mikor melyik éri meg?

A fordított program (C, C++, Rust) futás előtt egyszer lefordul, utána gyorsan fut. Az értelmezett (Python) azonnal indul, de lassabban fut. Ha a fordítás $F$ másodperc, és a fordított program egy futása $c$, az értelmezetté $k \cdot c$ másodperc, akkor $n$ futás összes ideje:

```plot
title: Összes idő (s) a futtatások számának függvényében
x: 0, 50
y: 0, 120
param: k = 10, 2, 50, 1
f: 20 + 0.5*x # fordított: 20 s fordítás + 0,5 s futásonként
f: 0.5*k*x # értelmezett: k-szor lassabb futás, fordítás nélkül
```

Kevés futásnál (gyors kísérletezés, egyszer használt szkript) az értelmezett nyer, sok futásnál vagy nagy számítási igénynél a fordított. A csúszkával a sebességkülönbséget ($k$) állíthatod. A gyakorlat a két világot vegyíti: a Java és a C# köztes kódra fordul, és futás közben **JIT** (just-in-time) fordító gyorsítja; a Python népszerű könyvtárai (pl. NumPy) belül C-ben írt, lefordított kódot használnak.

## 5. Miért nem lehet „csendben” átírni a git történetét?

Az alapleckében láttuk, hogy a git commitokból áll. Minden commit azonosítója egy **hash**, amelyet a tartalomból **és az előző commit azonosítójából** számol ki. Ezért egy régi commit módosítása az összes utána következő azonosítóját megváltoztatja:

```python run
# Hash-láncolat, mint a gitben: minden commit az előző azonosítóját is tartalmazza
import hashlib

def commit_id(elozo, uzenet):
    return hashlib.sha1(f"{elozo}|{uzenet}".encode()).hexdigest()[:7]

def tortenet(uzenetek):
    ids, elozo = [], "gyoker"
    for u in uzenetek:
        elozo = commit_id(elozo, u)
        ids.append(elozo)
    return ids

eredeti = ["projekt indítása", "bejelentkezés", "jelszócsere", "README"]
hamisitott = ["projekt indítása", "bejelentkezés (módosítva)", "jelszócsere", "README"]
print("eredeti:   ", tortenet(eredeti))
print("hamisított:", tortenet(hamisitott))
```

A második commit módosítása után a harmadik és a negyedik azonosítója is más lesz – bárki, akinek megvan az eredeti történet, azonnal észreveszi. Ezért mondják, hogy **közös ágon ne írd át a történetet** (pl. `git push --force`): a társaid gépén lévő történet már nem fog egyezni a tiéddel.

## Összefoglalás

- Ugyanaz a feladat imperatívan (lépések, változók), funkcionálisan (függvények, módosítás nélkül) és deklaratívan (mit akarunk) is megoldható.
- Az értelmező tokenekre bontja, a nyelvtan szerint elemzi, majd kiértékeli (vagy bájtkódra fordítja) a programot.
- A szintaktikai hibát a fordító, a futásidejűt a futtatás, a logikait csak a teszt fogja meg.
- A fordítás sok futásnál térül meg; a git commitjai hash-láncot alkotnak, ezért a történet módosítása mindig kiderül.

## A lecke feladata

```quiz required
? Mennyi a `2 + 3 * 4 - 6 / 2` kifejezés értéke a szokásos műveleti sorrenddel?
= 11
! $2 + 12 - 3 = 11$.

? Melyik hibát csak egy teszt (vagy alapos ellenőrzés) fogja meg biztosan?
- szintaktikai hiba
- futásidejű hiba
+ logikai hiba
- egyik sem kerülhet a programba
! A program lefut, csak rossz eredményt ad.

? A fordítás 30 s, a lefordított program egy futása 1 s, az értelmezett változaté 4 s. Hány futástól gyorsabb összesen a fordított változat? (az első olyan egész szám, amelynél kevesebb az összes idő)
= 11
! $30 + n < 4n$, azaz $n > 10$: a 11. futástól.

? Melyik a deklaratív stílus példája?
- egy `for` ciklus, amely egy összeget növel
+ `SELECT AVG(jegy) FROM jegyek WHERE jegy >= 2;`
- egy `while` ciklus számlálóval
- egy változó értékének módosítása
! Azt írjuk le, mit akarunk, nem azt, hogyan.

? Miért változik meg a későbbi commitok azonosítója, ha egy régi commitot módosítasz?
- mert a git véletlenszerűen ad azonosítót
+ mert minden commit azonosítója az előző commit azonosítójából is számolódik
- mert a GitHub átnevezi őket
- nem változik meg
! A commitok hash-láncot alkotnak.
```
