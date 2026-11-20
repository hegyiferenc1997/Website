---
title: Mélyebben – rekurzió más szemmel
summary: Hol a rekurzió határa (RecursionError), és hogyan alakíts át rekurziót saját veremmel ciklussá, az „oszd meg és uralkodj” elve az összefésülő rendezésen összehasonlítás-számlálással és ábrával, visszalépéses keresés a nyolckirálynő-feladaton, és egy mappafa méretének kiszámítása.
minutes: 55
---

## Amit ebben a leckében megtanulsz

- hol van a rekurzió **határa**, és hogyan írható át bármely rekurzió **saját veremmel** ciklussá,
- mi az **„oszd meg és uralkodj”** elv, és miért gyors az **összefésülő rendezés**,
- hogyan működik a **visszalépéses keresés** (backtracking),
- miért természetes a rekurzió **fa szerkezetű** adatoknál (mappák, menük, beágyazott listák).

## 1. A rekurzió határa és a saját verem

Az alapleckében láttuk, hogy minden függvényhívás egy **veremkeretet** foglal a hívási veremben. A Python ezt korlátozza (alapból kb. 1000 szint), hogy egy elszabadult rekurzió ne egye meg az összes memóriát:

```python run
# A rekurzió határa, és ugyanaz a feladat saját veremmel, ciklussal
import sys

def osszeg_rek(n):
    return 0 if n == 0 else n + osszeg_rek(n - 1)

print("a rekurziós korlát:", sys.getrecursionlimit())
print("osszeg_rek(300) =", osszeg_rek(300))
try:
    osszeg_rek(100_000)
except RecursionError as e:
    print("osszeg_rek(100 000) → RecursionError:", e)

# beágyazott lista kilapítása: rekurzió helyett saját veremmel
def kilapit(adat):
    eredmeny, verem = [], [adat]
    while verem:
        elem = verem.pop()
        if isinstance(elem, list):
            verem.extend(reversed(elem))     # fordítva tesszük be, hogy sorrendben jöjjenek ki
        else:
            eredmeny.append(elem)
    return eredmeny

print(kilapit([1, [2, [3, 4]], [[5]], 6]))

melyen = [0]
for i in range(1, 5000):
    melyen = [i, melyen]                     # 5000 szint mélyen beágyazott lista
print("5000 szint mélyen is működik:", len(kilapit(melyen)), "elem")
```

A tanulság: a rekurzió a gép **saját vermét** használja, ami korlátos; ha ehelyett mi kezelünk egy listát veremként, a mélységnek csak a memória szab határt. Bármely rekurzió átírható így ciklussá – a rekurzív változat általában **olvashatóbb**, a ciklusos **robusztusabb** nagyon mély adatnál.

## 2. Oszd meg és uralkodj: összefésülő rendezés

Az „oszd meg és uralkodj” elv: a feladatot **kettévágjuk**, a két felet **rekurzívan** megoldjuk, majd az eredményeket **összerakjuk**. Az összefésülő rendezésnél (merge sort) a két rendezett fél összefésülése egyetlen bejárás:

```plot
title: Összehasonlítások száma n elem rendezésénél
x: 2, 1000
y: 0, 50000
f: x*(x - 1)/2 # buborékrendezés (legrosszabb eset): kb. n²/2
f: x*log2(x) # összefésülő rendezés: kb. n·log₂ n
```

```python run
# Összefésülő rendezés összehasonlítás-számlálással, a buborékrendezéssel szemben
import random

def osszefesulo(lista, szamlalo):
    if len(lista) <= 1:
        return lista                              # alapeset: 0 vagy 1 elem már rendezett
    kozep = len(lista) // 2
    bal = osszefesulo(lista[:kozep], szamlalo)    # oszd meg...
    jobb = osszefesulo(lista[kozep:], szamlalo)
    eredmeny, i, j = [], 0, 0
    while i < len(bal) and j < len(jobb):         # ...és uralkodj: fésüld össze
        szamlalo[0] += 1
        if bal[i] <= jobb[j]:
            eredmeny.append(bal[i]); i += 1
        else:
            eredmeny.append(jobb[j]); j += 1
    return eredmeny + bal[i:] + jobb[j:]

def buborek_osszehasonlitas(n):
    return n * (n - 1) // 2                       # a buborékrendezés mindig ennyit hasonlít

random.seed(1)
for n in [10, 100, 1000, 10_000]:
    szamlalo = [0]
    adat = [random.randint(0, 10**6) for _ in range(n)]
    assert osszefesulo(adat, szamlalo) == sorted(adat)
    print(f"n = {n:>6}: összefésülő {szamlalo[0]:>8} összehasonlítás, buborék {buborek_osszehasonlitas(n):>10}")
```

10 000 elemnél az összefésülő rendezés kb. 120 ezer, a buborék közel 50 **millió** összehasonlítást végez. A Python beépített `sorted` függvénye (Timsort) is az összefésülésre épül. Ugyanez az elv dolgozik a bináris keresésben és sok gyors algoritmusban.

## 3. Visszalépéses keresés: a nyolckirálynő-feladat

Hogyan lehet 8 királynőt úgy elhelyezni egy sakktáblán, hogy egyik se üsse a másikat? A **visszalépéses keresés**: soronként lerakunk egy királynőt egy biztonságos mezőre, és továbblépünk; ha egy sorban nincs biztonságos mező, **visszalépünk**, és az előző királynőt rakjuk máshova:

```python run
# Nyolckirálynő-feladat visszalépéses kereséssel
def kiralynok(n):
    megoldasok = []
    def lerak(sor, oszlopok, atlo1, atlo2, allas):
        if sor == n:
            megoldasok.append(allas)              # minden sorba került királynő
            return
        for o in range(n):
            if o in oszlopok or sor - o in atlo1 or sor + o in atlo2:
                continue                          # ütésben van: ezt a mezőt kihagyjuk
            lerak(sor + 1, oszlopok | {o}, atlo1 | {sor - o}, atlo2 | {sor + o}, allas + [o])
            # ha a rekurzió visszatért, a ciklus a következő oszloppal próbálkozik: ez a visszalépés
    lerak(0, set(), set(), set(), [])
    return megoldasok

for n in range(4, 9):
    print(f"{n}×{n}-es tábla: {len(kiralynok(n))} megoldás")

elso = kiralynok(8)[0]
for o in elso:
    print(" ".join("♛" if i == o else "·" for i in range(8)))
```

A 8×8-as táblán 92 megoldás van, és a program a 4,4 milliárd lehetséges elrendezésnek csak a töredékét nézi meg, mert az ütésben lévő ágakat **azonnal levágja**. Ugyanígy működik a sudoku-megoldó, az órarend-készítő és sok rejtvényfejtő program.

## 4. Fa szerkezetű adatok

A mappák mappákat tartalmaznak, azok újabb mappákat – az ilyen **önhasonló** szerkezetnél a rekurzió a legtermészetesebb eszköz: „egy mappa mérete = a benne lévő fájlok mérete + az almappák mérete”:

```python run
# Mappafa mérete rekurzívan: a mappa szótár, a fájl egy szám (méret kB-ban)
mappak = {
    "dokumentumok": {"cv.pdf": 120, "egyetem": {"jegyzet.docx": 340, "feladatsor.pdf": 80}},
    "kepek": {"nyar": {"1.jpg": 2400, "2.jpg": 2600}, "profil.png": 300},
    "todo.txt": 2,
}

def meret(elem):
    if isinstance(elem, dict):
        return sum(meret(gyerek) for gyerek in elem.values())   # rekurzív eset
    return elem                                                 # alapeset: fájl

def kiir(nev, elem, behuzas=0):
    print("  " * behuzas + f"{nev} ({meret(elem)} kB)")
    if isinstance(elem, dict):
        for gyerek_nev, gyerek in elem.items():
            kiir(gyerek_nev, gyerek, behuzas + 1)

kiir("/", mappak)
```

A `meret` függvény két sor, mégis tetszőleges mélységű mappafára működik. A `kiir` függvény a fát behúzással jeleníti meg – így készül a fájlkezelők fanézete, egy weboldal menüje vagy egy JSON-dokumentum megjelenítése is.

| Nézőpont         | Rekurzió                                               | Iteráció (ciklus)                        |
| ---------------- | ------------------------------------------------------ | ---------------------------------------- |
| **olvashatóság** | fa szerkezetnél és oszd meg és uralkodjnál természetes | lineáris feladatnál egyszerűbb           |
| **memória**      | minden szint egy veremkeret, korlátos mélység          | csak a saját változók (vagy saját verem) |
| **sebesség**     | a függvényhívásnak ára van                             | Pythonban általában gyorsabb             |
| **hibakeresés**  | a hívási verem mutatja, hol tartunk                    | a ciklusváltozók kiírása elég            |

## Összefoglalás

- A rekurzió mélysége korlátos (RecursionError); saját veremmel bármely rekurzió ciklussá írható.
- Az oszd meg és uralkodj kettévág, rekurzívan megold, összerak; az összefésülő rendezés kb. n·log₂ n összehasonlítást végez.
- A visszalépéses keresés levágja a reménytelen ágakat, így hatalmas keresési teret is bejár.
- Fa szerkezetű adatoknál (mappák, menük, beágyazott listák) a rekurzió a legtermészetesebb eszköz.

## A lecke feladata: beágyazott lista mélysége

Írd meg a `melyseg(adat)` függvényt, amely megadja egy beágyazott lista **mélységét**! Ami nem lista (pl. szám), annak mélysége 0. Egy lista mélysége 1 + az elemei közül a legnagyobb mélység (üres listánál 1). Például `melyseg([1, [2, [3]]])` értéke 3.

```python starter required
def melyseg(adat):
    if not isinstance(adat, list):
        return 0
    return 1


print(melyseg([1, [2, [3]]]))
```

<details>
<summary>Megoldás</summary>

```python solution
def melyseg(adat):
    if not isinstance(adat, list):
        return 0
    return 1 + max((melyseg(elem) for elem in adat), default=0)


print(melyseg([1, [2, [3]]]))
```

</details>

```python test
assert melyseg(5) == 0, "egy szám mélysége 0"
assert melyseg([]) == 1, "az üres lista mélysége 1"
assert melyseg([1, 2, 3]) == 1, "lapos lista mélysége 1"
assert melyseg([1, [2, [3]]]) == 3, "[1, [2, [3]]] mélysége 3"
assert melyseg([[], [[]], 7]) == 3, "[[], [[]], 7] mélysége 3"
```
