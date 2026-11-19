---
title: Mélyebben – algoritmusok gondolkodva
summary: Ugyanannak a feladatnak több algoritmusa is lehet – Euklidész két módszere a legnagyobb közös osztóra, lépésszámlálás és lépésszám-ábra, a feladat lebontása kisebb részekre, és egy feladat három paradigmában megírva, kis futtatható programokkal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogy ugyanarra a feladatra **több helyes algoritmus** is van, és ezek nagyon különböző gyorsak lehetnek,
- hogyan **számold meg** egy algoritmus lépéseit, és miért ez a jó mérce (nem a stopper),
- hogyan **bonts le** egy nagyobb feladatot kisebb, külön megírható részekre,
- hogyan néz ki ugyanaz a megoldás **imperatív**, **funkcionális** és **objektumorientált** stílusban.

## 1. Két algoritmus ugyanarra: a legnagyobb közös osztó

Az alapleckében láttuk, hogy az algoritmus egy pontos, véges lépéssorozat. A legnagyobb közös osztó (lnko) az egyik legrégebbi ismert algoritmus: Euklidész kb. 2300 éve írta le. Az eredeti változat **kivonással** dolgozik: amíg a két szám különbözik, a nagyobbikból kivonjuk a kisebbet. A modern változat **maradékos osztással** ugrik:

```python run
# Két algoritmus a legnagyobb közös osztóra, lépésszámlálással
def lnko_kivonassal(a, b):
    lepes = 0
    while a != b:
        lepes += 1
        if a > b:
            a -= b          # a nagyobbikból kivonjuk a kisebbet
        else:
            b -= a
    return a, lepes

def lnko_maradekkal(a, b):
    lepes = 0
    while b != 0:
        lepes += 1
        a, b = b, a % b     # a maradék lesz az új kisebbik szám
    return a, lepes

for a, b in [(48, 18), (1071, 462), (1000, 3), (100000, 7)]:
    print(f"lnko({a}, {b}): kivonással {lnko_kivonassal(a, b)}, maradékkal {lnko_maradekkal(a, b)}")
```

Mindkettő ugyanazt az eredményt adja, de a `(100000, 7)` párnál a kivonásos változat **több mint tizennégyezer** lépést tesz, a maradékos pedig csak négyet. A maradékos osztás ugyanis egyetlen lépésben elvégzi azt, amit a kivonás sokszor ismételve. A tanulság: egy algoritmus **helyessége** és **hatékonysága** két külön kérdés.

## 2. Lépésszám: miért nem stopperrel mérünk?

Egy program futási ideje függ a géptől, a többi futó programtól, sőt a hőmérséklettől is. Ezért az algoritmusokat a **lépésszámukkal** hasonlítjuk össze, a bemenet méretének ($n$) függvényében. Nézzük a keresést: egy rendezetlen listában átlagosan a lista felét végig kell nézni, egy **rendezett** listában viszont a bináris keresés minden lépésben felezi a maradékot.

```plot
title: Keresés lépésszáma n elemű listában
x: 1, 1000
y: 0, 500
f: x/2 # lineáris keresés: átlagosan n/2 lépés
f: log2(x) # bináris keresés (rendezett listában): kb. log₂ n lépés
```

```python run
# Lépésszámok összehasonlítása: lineáris és bináris keresés
from math import ceil, log2

for n in [10, 1000, 1_000_000, 1_000_000_000]:
    linearis = n // 2
    binaris = ceil(log2(n + 1))
    ft = lambda x: f"{x:,}".replace(",", " ")    # magyar ezres tagolás
    print(f"{ft(n):>13} elem: lineáris kb. {ft(linearis):>11} lépés, bináris legfeljebb {binaris:>2} lépés")
```

Egymilliárd elemnél a lineáris keresés félmilliárd lépés, a bináris legfeljebb 30. Ezt nem lehet gyorsabb processzorral behozni – **jobb algoritmussal** viszont igen. Az ár: a bináris kereséshez a listának **rendezettnek** kell lennie, ami szintén munka. Hogy megéri-e, az attól függ, hányszor keresünk ugyanabban a listában.

## 3. A feladat lebontása

Az alapleckében láttuk a **lépésenkénti finomítást**: a nagy feladatot kisebb részfeladatokra bontjuk, amíg mindegyik egyszerű nem lesz. Példa: „Készíts statisztikát egy csoport pontszámairól!” Ez három külön, önmagában is kipróbálható részre esik szét:

```python run
# Lépésenkénti finomítás: a nagy feladat három kis függvényre bomlik
def beolvas(szoveg):
    """1. részfeladat: a szövegből számlista."""
    return [int(x) for x in szoveg.split(",")]

def statisztika(pontok):
    """2. részfeladat: a számítások."""
    return {"db": len(pontok), "átlag": sum(pontok) / len(pontok), "max": max(pontok), "min": min(pontok)}

def jelentes(stat):
    """3. részfeladat: a kiírás formázása."""
    return f"{stat['db']} fő, átlag {stat['átlag']:.1f}, legjobb {stat['max']}, leggyengébb {stat['min']}"

# a főprogram már csak összerakja a részeket
print(jelentes(statisztika(beolvas("78,92,65,88,71"))))
```

A lebontás előnyei: minden részt **külön lehet tesztelni**, a hibát könnyebb megtalálni, és egy részt (pl. a `beolvas`-t) később ki lehet cserélni úgy, hogy a többihez nem kell nyúlni – ha holnap fájlból jön az adat, csak az első függvény változik.

## 4. Ugyanaz három paradigmában

Feladat: add össze egy lista **páros** számainak a négyzetét. Ugyanez háromféle gondolkodásmóddal:

```python run
# Ugyanaz a feladat imperatív, funkcionális és objektumorientált stílusban
szamok = [3, 4, 7, 10, 12, 15]

# 1) imperatív: lépésről lépésre megmondjuk, MIT CSINÁLJON
osszeg = 0
for x in szamok:
    if x % 2 == 0:
        osszeg += x * x
print("imperatív:      ", osszeg)

# 2) funkcionális: leírjuk, MI az eredmény (szűrés, átalakítás, összegzés)
print("funkcionális:   ", sum(x * x for x in szamok if x % 2 == 0))

# 3) objektumorientált: az adat és a rajta végzett művelet egy objektumban
class Szamsor:
    def __init__(self, elemek):
        self.elemek = elemek

    def paros_negyzetosszeg(self):
        return sum(x * x for x in self.elemek if x % 2 == 0)

print("objektumorientált:", Szamsor(szamok).paros_negyzetosszeg())
```

Mindhárom 260-at ad. Melyik a jobb? Kis feladatnál a funkcionális egysoros a legolvashatóbb; ha az adathoz sok művelet tartozik, és több helyen használjuk, az objektum tartja rendben; ha egy kezdő olvassa, az imperatív a legkönnyebben követhető. A paradigma **eszköz**, nem vallás.

| Nézőpont        | Mit jelent neki a „jó algoritmus”?                                    |
| --------------- | --------------------------------------------------------------------- |
| **felhasználó** | gyorsan válaszol, és mindig helyes eredményt ad                       |
| **programozó**  | érthető, könnyen megírható és tesztelhető, kevés hibalehetőséggel     |
| **karbantartó** | fél év múlva is érthető, egy rész cserélhető a többi elrontása nélkül |
| **számítógép**  | kevés lépés és kevés memória – ez a futási idő és az energia          |

## Összefoglalás

- Egy feladatra több helyes algoritmus is lehet; a helyesség és a hatékonyság két külön kérdés.
- Az algoritmusokat lépésszámmal hasonlítjuk, a bemenet méretének függvényében; a jobb algoritmus többet ér, mint a gyorsabb gép.
- A lépésenkénti finomítás kis, külön tesztelhető részekre bontja a feladatot.
- Ugyanaz a megoldás többféle paradigmában is megírható; a helyzet dönti el, melyik a legjobb.

## A lecke feladata: Euklidész algoritmusa

Írd meg az `lnko(a, b)` függvényt, amely két pozitív egész szám legnagyobb közös osztóját adja vissza a **maradékos** Euklidész-algoritmussal! Amíg `b` nem nulla, az `(a, b)` párt cseréld le a `(b, a % b)` párra; a végén `a` az eredmény. (A `math.gcd` használata most nem ér.)

```python starter required
def lnko(a, b):
    # amíg b nem nulla: a, b = b, a % b
    return a


print(lnko(48, 18))
```

<details>
<summary>Megoldás</summary>

```python solution
def lnko(a, b):
    while b != 0:
        a, b = b, a % b
    return a


print(lnko(48, 18))
```

</details>

```python test
assert lnko(48, 18) == 6, "lnko(48, 18) = 6"
assert lnko(1071, 462) == 21, "lnko(1071, 462) = 21"
assert lnko(17, 5) == 1, "relatív prímeknél 1"
assert lnko(7, 7) == 7, "egyenlő számoknál maga a szám"
```
