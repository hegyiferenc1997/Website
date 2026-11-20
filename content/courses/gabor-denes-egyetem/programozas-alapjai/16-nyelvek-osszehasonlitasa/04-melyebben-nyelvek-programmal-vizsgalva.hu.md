---
title: Mélyebben – nyelvek programmal vizsgálva
summary: Nyelvválasztás súlyozott döntési mátrixszal, több nézőpontból, miért gyorsabbak a Python beépített függvényei a kézzel írt ciklusnál (mérve), hogyan oszt egészet a C és a Python negatív számokkal, és hogyan kezeli a memóriát a Python (referenciaszámlálás, szemétgyűjtés) – futtatható programokkal és programozós kötelező feladattal.
minutes: 50
---

## Amit ebben a leckében megtanulsz

- hogyan hozz **indokolt** nyelvválasztási döntést egy súlyozott döntési mátrixszal,
- miért fut gyorsabban ugyanaz a feladat a Python **beépített** függvényeivel, mint kézzel írt ciklussal,
- hogyan **térnek el** a nyelvek apró, de fontos szabályokban (pl. egész osztás negatív számokkal),
- hogyan kezeli a **memóriát** a Python, és miben más ez a C-hez vagy a Rusthoz képest.

## 1. Nyelvválasztás döntési mátrixszal

Az alapleckében láttuk a nyelvválasztás szempontjait. Egy valódi döntésnél a szempontok **nem egyformán fontosak**: egy mobilalkalmazásnál a platform számít, egy beágyazott rendszernél a sebesség és a memória. A súlyozott döntési mátrix ezt számszerűsíti:

```python run
# Súlyozott döntési mátrix: melyik nyelv illik egy adott projekthez?
pontok = {   # 1–5 pont szempontonként (szemléltető, nem abszolút igazság)
    "Python":     {"sebesség": 2, "tanulhatóság": 5, "könyvtárak": 5, "memória": 2, "csapat ismeri": 5},
    "C":          {"sebesség": 5, "tanulhatóság": 2, "könyvtárak": 3, "memória": 5, "csapat ismeri": 3},
    "Java":       {"sebesség": 4, "tanulhatóság": 3, "könyvtárak": 5, "memória": 3, "csapat ismeri": 4},
    "JavaScript": {"sebesség": 3, "tanulhatóság": 4, "könyvtárak": 5, "memória": 3, "csapat ismeri": 4},
}

projektek = {   # súlyok: mennyire fontos az adott szempont (összesen 1)
    "adatelemzés":        {"sebesség": 0.1, "tanulhatóság": 0.2, "könyvtárak": 0.4, "memória": 0.0, "csapat ismeri": 0.3},
    "mosógép vezérlője":  {"sebesség": 0.3, "tanulhatóság": 0.0, "könyvtárak": 0.1, "memória": 0.5, "csapat ismeri": 0.1},
    "banki háttérrendszer": {"sebesség": 0.3, "tanulhatóság": 0.1, "könyvtárak": 0.3, "memória": 0.1, "csapat ismeri": 0.2},
}

for projekt, sulyok in projektek.items():
    ertekek = {nyelv: sum(sulyok[sz] * p for sz, p in pt.items()) for nyelv, pt in pontok.items()}
    rangsor = sorted(ertekek.items(), key=lambda t: -t[1])
    print(f"{projekt:<21}", " > ".join(f"{n} ({e:.1f})" for n, e in rangsor))
```

Ugyanazokból a pontszámokból projektenként **más** nyelv nyer – nincs „legjobb nyelv”, csak a feladathoz legjobban illő. A módszer ereje, hogy a döntés **átlátható**: ha valaki vitatja, pontosan látszik, melyik súlyon vagy pontszámon van a nézeteltérés. A pontszámok persze vitathatók – épp ezért érdemes őket a csapattal közösen kitölteni.

## 2. Miért gyorsabb a beépített függvény?

A Python interpretált nyelv, ezért egy kézzel írt ciklus minden lépése sok munkát jelent az értelmezőnek. A beépített függvények (`sum`, `max`, `sorted`) viszont **C-ben** vannak megírva, és a ciklusuk gépi kódként fut:

```python run
# Ugyanaz az összegzés háromféleképpen – a beépített sum a leggyorsabb
import time

szamok = list(range(1_000_000))

def merj(nev, fuggveny):
    kezdes = time.perf_counter()
    eredmeny = fuggveny()
    print(f"{nev:<24} {eredmeny}  {(time.perf_counter() - kezdes) * 1000:7.1f} ms")

def kezi_ciklus():
    osszeg = 0
    for x in szamok:
        osszeg += x
    return osszeg

merj("kézi for ciklus:", kezi_ciklus)
merj("generátorkifejezés:", lambda: sum(x for x in szamok))
merj("beépített sum:", lambda: sum(szamok))
```

A pontos idők gépenként és böngészőnként mások, de a beépített `sum` szinte mindig messze a leggyorsabb, többszörösen veri a kézi ciklust. Ez a Python „titka”: a lassú értelmezett rész csak **ragasztó**, a nehéz munkát C-ben írt könyvtárak végzik (a NumPy, a pandas és a gépi tanulási könyvtárak is így működnek). Ezért lehet a Python a tudományos számítások egyik fő nyelve, pedig maga az értelmező lassú.

## 3. Apró szabályok, nagy különbségek

A nyelvek ugyanannak a műveletnek néha **más jelentést** adnak. Egy klasszikus példa az egész osztás negatív számokkal. A Python a `//` műveletnél lefelé (a mínusz végtelen felé) kerekít, a C, a Java, a C# és a JavaScript `Math.trunc` viszont a **nulla felé** vág:

```python run
# Egész osztás negatív számokkal: a Python lefelé kerekít
import math

print(f"{'a':>3} {'b':>3} | {'Python //':>9} {'Python %':>8} | {'nulla felé vágva':>16}")
for a, b in [(7, 2), (-7, 2), (7, -2), (-7, -2)]:
    vagott = math.trunc(a / b)                     # ahogy a C egész osztása kerekít
    print(f"{a:>3} {b:>3} | {a // b:>9} {a % b:>8} | {vagott:>16}")
```

A `-7 // 2` Pythonban `-4`, C-ben `-3`. Ha egy algoritmust egyik nyelvről a másikra „fordítasz le”, az ilyen különbségek csendben rossz eredményt adnak – a program lefut, csak nem azt számolja. Hasonló csapda a JavaScript `==` operátora (`"0" == 0` igaz), vagy hogy a Java `==` operátora szövegeknél a hivatkozást hasonlítja össze, nem a tartalmat.

## 4. Memóriakezelés: ki takarít?

A C-ben a programozó **maga** foglal (`malloc`) és szabadít fel (`free`) memóriát – ha elfelejti, a program egyre több memóriát eszik (memóriaszivárgás); ha kétszer szabadít fel, összeomolhat. A Python **automatikusan** takarít: minden objektumnál számolja, hány név hivatkozik rá, és ha a szám nullára csökken, felszabadítja. A körkörös hivatkozásokat pedig egy szemétgyűjtő keresi meg:

```python run
# Referenciaszámlálás és szemétgyűjtés a Pythonban
import gc
import sys

adat = [1, 2, 3]
print("hivatkozások száma:", sys.getrefcount(adat) - 1)   # -1: a getrefcount saját paramétere
masik = adat
print("egy újabb névvel:  ", sys.getrefcount(adat) - 1)
del masik
print("a név törlése után:", sys.getrefcount(adat) - 1)

class Csomopont:
    def __init__(self, nev):
        self.nev, self.szomszed = nev, None

a, b = Csomopont("a"), Csomopont("b")
a.szomszed, b.szomszed = b, a          # körkörös hivatkozás: egymásra mutatnak
del a, b                               # a nevek eltűntek, de a két objektum még egymásra mutat
print("a szemétgyűjtő által felszabadított objektumok:", gc.collect() >= 2)
```

A kényelemnek ára van: a referenciaszámlálás minden értékadásnál munkát jelent, és a szemétgyűjtő időnként „megállíthatja” a programot egy pillanatra. A **Rust** harmadik utat választott: a fordító a **tulajdonjog** szabályaival már fordításkor ellenőrzi, hogy minden memória pontosan egyszer szabaduljon fel – így se szemétgyűjtő, se kézi `free` nem kell. Ezért terjed a rendszerprogramozásban.

| Nézőpont       | Mit mérlegel a nyelvválasztásnál?                                           |
| -------------- | --------------------------------------------------------------------------- |
| **fejlesztő**  | gyorsan lehet-e haladni benne, jók-e az eszközök és a hibaüzenetek          |
| **üzemeltető** | memória- és CPU-igény, telepíthetőség, hosszú távú támogatás                |
| **cégvezetés** | van-e a piacon elég fejlesztő, mennyibe kerül a betanulás                   |
| **biztonság**  | a kézi memóriakezelés (C, C++) a biztonsági hibák jelentős részének forrása |

## Összefoglalás

- A súlyozott döntési mátrix átláthatóvá teszi a nyelvválasztást; projektenként más nyelv nyerhet.
- A Python beépített függvényei C-ben futnak, ezért sokkal gyorsabbak a kézi ciklusnál.
- A nyelvek apró szabályokban eltérnek (pl. egész osztás negatív számokkal) – fordításkor ez csendes hibát okozhat.
- A Python referenciaszámlálással és szemétgyűjtéssel takarít; a C kézzel, a Rust fordítási idejű szabályokkal.

## A lecke feladata: osztás C-módra

Írd meg a `c_osztas(a, b)` függvényt, amely két egész szám hányadosát és maradékát úgy adja vissza `(hanyados, maradek)` párként, ahogy a C nyelv számolja: a hányados a **nulla felé** kerekít, a maradék pedig olyan, hogy `hanyados * b + maradek == a` teljesüljön (így a maradék előjele az osztandóé, `a`-é). Lebegőpontos osztást ne használj: számold ki az abszolút értékekkel, és utána állítsd be az előjeleket.

```python starter required
def c_osztas(a, b):
    return (a // b, a % b)


print(c_osztas(-7, 2))
```

<details>
<summary>Megoldás</summary>

```python solution
def c_osztas(a, b):
    hanyados = abs(a) // abs(b)
    if (a < 0) != (b < 0):
        hanyados = -hanyados
    maradek = a - hanyados * b
    return (hanyados, maradek)


print(c_osztas(-7, 2))
```

</details>

```python test
assert c_osztas(7, 2) == (3, 1), "7 / 2 → (3, 1)"
assert c_osztas(-7, 2) == (-3, -1), "-7 / 2 → (-3, -1) a nulla felé kerekítve"
assert c_osztas(7, -2) == (-3, 1), "7 / -2 → (-3, 1)"
assert c_osztas(-7, -2) == (3, -1), "-7 / -2 → (3, -1)"
assert c_osztas(10**20 + 1, -3) == (-((10**20 + 1) // 3), 2), "nagy számokra is pontos (ezért nem jó a float)"
```
