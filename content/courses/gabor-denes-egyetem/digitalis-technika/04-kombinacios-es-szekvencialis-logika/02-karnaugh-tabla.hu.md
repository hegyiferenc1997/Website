---
title: Grafikus egyszerűsítés – a Karnaugh-tábla
summary: Két-, három- és négyváltozós Karnaugh-tábla, Gray-kódos sorrend, csoportosítási szabályok, közömbös bejegyzések és a POS alak kiolvasása.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan épül fel a **Karnaugh-tábla** (K-tábla) 2, 3 és 4 változóra,
- miért **Gray-kód** szerinti a sorok és oszlopok sorrendje,
- a **csoportosítás szabályait** (1, 2, 4, 8 … cella, szomszédság, körbefordulás),
- hogyan használod a **közömbös** (don't care, X) bejegyzéseket,
- hogyan olvasod ki a **POS** alakot a 0-kból.

## Miért kell?

Az algebrai egyszerűsítés (előző témakör) könnyen elakad: nem mindig látszik, melyik azonosságot érdemes alkalmazni. A **Karnaugh-tábla** az igazságtáblát úgy rendezi el, hogy a **szomszédos cellák pontosan egy változóban térnek el**. Így az A·B + A·B̅ = A típusú összevonások **ránézésre** látszanak.

## A tábla felépítése

A sorok és oszlopok fejlécei **Gray-kód** sorrendben követik egymást: **00, 01, 11, 10**. Emiatt két egymás melletti cella csak egy bitben tér el – és a tábla **szélei is szomszédosak** (a 10 után újra a 00 jön, mintha a tábla henger lenne).

**Háromváltozós tábla** (sor: A, oszlop: BC) – a cellákban a minterm sorszáma:

| A \ BC | 00 | 01 | 11 | 10 |
| ------ | -- | -- | -- | -- |
| 0      | 0  | 1  | 3  | 2  |
| 1      | 4  | 5  | 7  | 6  |

**Négyváltozós tábla** (sor: AB, oszlop: CD):

| AB \ CD | 00 | 01 | 11 | 10 |
| ------- | -- | -- | -- | -- |
| 00      | 0  | 1  | 3  | 2  |
| 01      | 4  | 5  | 7  | 6  |
| 11      | 12 | 13 | 15 | 14 |
| 10      | 8  | 9  | 11 | 10 |

Figyeld meg: a 3. és 4. oszlop (és sor) „fel van cserélve” a bináris sorrendhez képest – ez a Gray-kód.

## A csoportosítás szabályai

1. Csak **1-es** cellákat (SOP-hoz) csoportosítunk; a közömbös (X) cellák felhasználhatók, de nem kötelező lefedni őket.
2. Egy csoport mérete **2 hatványa**: 1, 2, 4, 8, 16 cella, és **téglalap** alakú.
3. A csoportok lehetnek **minél nagyobbak** – minél nagyobb a csoport, annál rövidebb a tag. 2<sup>k</sup> cella k változót ejt ki.
4. Minden 1-est le kell fedni legalább egy csoporttal; a csoportok **átfedhetik** egymást.
5. **Minél kevesebb** csoportot használj: ne vegyél fel olyat, amelynek minden cellája már le van fedve.
6. A szélek összeérnek: a bal és jobb oszlop, a felső és alsó sor szomszédos, és a **négy sarok** is egy csoportot alkothat.

**Egy csoport kiolvasása:** azok a változók maradnak meg, amelyek a csoport **minden cellájában ugyanazt** az értéket veszik fel (1 → ponált, 0 → negált alakban). Ami változik, az kiesik.

## 1. példa – sarkok és közép

F = Σm(0, 2, 5, 7, 8, 10, 13, 15)

| AB \ CD | 00 | 01 | 11 | 10 |
| ------- | -- | -- | -- | -- |
| 00      | 1  | 0  | 0  | 1  |
| 01      | 0  | 1  | 1  | 0  |
| 11      | 0  | 1  | 1  | 0  |
| 10      | 1  | 0  | 0  | 1  |

- A **négy sarok** (0, 2, 8, 10): mindegyikben B = 0 és D = 0 → **B̅·D̅**.
- A **középső négyes** (5, 7, 13, 15): B = 1 és D = 1 → **B·D**.

**F = B̅D̅ + BD** (ami B ⊙ D, azaz XNOR). A kanonikus alak 8 darab négyliterálos tagjából 2 darab kétliterálos tag lett.

## 2. példa – közömbös bejegyzések

Közömbös (don't care, **X** vagy **d**) az a sor, amelynek kimenete **nem számít** – például mert a bemeneti kombináció sosem fordul elő (BCD-ben az 1010…1111 kódok). Ezeket tetszés szerint 0-nak vagy 1-nek vehetjük, ahogy nagyobb csoportot kapunk.

F = Σm(1, 3, 7, 11, 15) + d(0, 2, 5)

| AB \ CD | 00 | 01 | 11 | 10 |
| ------- | -- | -- | -- | -- |
| 00      | X  | 1  | 1  | X  |
| 01      | 0  | X  | 1  | 0  |
| 11      | 0  | 0  | 1  | 0  |
| 10      | 0  | 0  | 1  | 0  |

- A **CD = 11 oszlop** (3, 7, 15, 11) → **C·D**.
- A maradék 1-es (1) lefedésére az X-ek segítenek: az 1, 3, 5, 7 négyes (az 5 közömbös) → **A̅·D**. (Ugyanilyen jó a 0, 1, 3, 2 négyes is → A̅·B̅.)

**F = CD + A̅D** – egyenlő hosszú megoldásból több is lehet!

## A POS alak kiolvasása

A **0-s** cellákat csoportosítjuk ugyanígy; így a **negált függvény** SOP alakját kapjuk, amelyből De Morgannal lesz POS. Az 1. példában a 0-k: F̅ = B̅D + BD̅, tehát

**F = (B + D̅)·(B̅ + D)**

Közvetlenül is olvasható: a 0-s csoportokból VAGY-tagokat írunk, és itt a 0 érték ponált, az 1 negált változót ad (mint a maxtermeknél).

## Kitekintés

- **5–6 változóig** még használható (két-négy egymás melletti 4×4-es tábla), afölött kezelhetetlen.
- A gépi módszer a **Quine–McCluskey**-eljárás (táblázatos összevonás), illetve az **Espresso** heurisztika – ezt használják a szintézis-programok.
- A **Veitch-diagram** a K-tábla rokona, a változók elhelyezése tér el.

```python run
# Egy négyváltozós függvény Karnaugh-táblájának kiírása Gray-sorrendben
gray = ["00", "01", "11", "10"]
egyesek = {0, 2, 5, 7, 8, 10, 13, 15}

print("AB\\CD " + "  ".join(gray))
for ab in gray:
    sor = []
    for cd in gray:
        i = int(ab + cd, 2)        # a cella mintermjének sorszáma
        sor.append(" 1" if i in egyesek else " 0")
    print(ab + "    " + "  ".join(sor))
```

## Összefoglalás

- A K-tábla Gray-sorrendű, így a szomszédos cellák egy bitben térnek el, a szélek is szomszédosak.
- Csoport: 2<sup>k</sup> cellás téglalap, minél nagyobb és minél kevesebb; k változó esik ki.
- A közömbös cellák szabadon 0-nak vagy 1-nek vehetők.
- 1-esek → SOP, 0-k → POS.

## A lecke feladata

```quiz required
? Milyen sorrendben követik egymást a K-tábla oszlopfejlécei két változónál?
- 00, 01, 10, 11
+ 00, 01, 11, 10
- 00, 10, 01, 11
- 11, 10, 01, 00
! A szomszédos fejlécek csak egy bitben térhetnek el (Gray-kód).

? Egy négyváltozós táblán egy 4 cellás csoport hány változót ejt ki?
= 2
! 2^k cella k változót ejt ki.

? Egyszerűsítsd K-táblával: F = Σm(0, 1, 2, 3, 6, 7) (A, B, C)!
expr: A, B, C -> A' + B
limit: 2
same: A'B'C' + A'B'C + A'BC' + A'BC + ABC' + ABC
! Az A = 0 sor teljes négyese, plusz a BC = 1x oszloppár.

? Egyszerűsítsd: F = Σm(0, 2, 5, 7, 8, 10, 13, 15) (A, B, C, D)!
expr: A, B, C, D -> B'D' + BD
limit: 4
same: A'B'C'D' + A'B'CD' + A'BC'D + A'BCD + AB'C'D' + AB'CD' + ABC'D + ABCD
! A négy sarok és a középső négyes.

? Egyszerűsítsd a közömbös bejegyzések felhasználásával: F = Σm(1, 3, 7, 11, 15) + d(0, 2, 5) (A, B, C, D)!
expr: A, B, C, D -> A'D + CD
limit: 4
dc: 0, 2, 5
! A CD = 11 oszlop egy négyes; a 1-es cellát egy X-eket is tartalmazó négyes fedi le.
```
