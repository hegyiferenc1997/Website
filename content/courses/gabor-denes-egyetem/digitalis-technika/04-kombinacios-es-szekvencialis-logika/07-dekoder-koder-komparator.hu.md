---
title: Dekóder, kóder és komparátor
summary: Bináris dekóder (2→4, 3→8), függvény-megvalósítás dekóderrel, kóder és prioritáskóder, egy- és több bites komparátor.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- mi a **dekóder**, és hogyan működik a **2→4** és a **3→8** dekóder,
- hogyan valósítasz meg függvényt **dekóderrel és VAGY kapuval**,
- mi a **kóder** (enkóder) és a **prioritáskóder**,
- hogyan épül fel az egy- és a több bites **komparátor** (nagyságkomparátor).

## A dekóder

A **bináris dekóder** egy n bites bemeneti kódhoz **2<sup>n</sup> kimenet közül pontosan egyet** aktivál – azt, amelyiknek a sorszáma a bemeneti szám. („n → 2<sup>n</sup>” dekóder.)

### 2→4 dekóder

| A1 A0 | Y0  | Y1  | Y2  | Y3  |
| ----- | --- | --- | --- | --- |
| 0 0   | 1   | 0   | 0   | 0   |
| 0 1   | 0   | 1   | 0   | 0   |
| 1 0   | 0   | 0   | 1   | 0   |
| 1 1   | 0   | 0   | 0   | 1   |

Y0 = A̅1·A̅0, **Y1 = A̅1·A0**, Y2 = A1·A̅0, Y3 = A1·A0 – minden kimenet **egy minterm**.

A gyakorlatban a kimenetek sokszor **aktív alacsonyak** (a kiválasztott kimenet 0, a többi 1), és van **engedélyező** bemenet. A klasszikus **74138** egy 3→8 dekóder három engedélyező bemenettel (G1, G̅2A, G̅2B) – ezekkel több dekóder kaszkádosítható (két 3→8 → egy 4→16).

**Felhasználás:** **címdekódolás** (a processzor címbuszából kiválasztja, melyik memória- vagy periféria-chip legyen aktív – „chip select”), kijelzők, billentyűzetmátrix sorainak meghajtása.

## Függvény dekóderrel

Mivel minden kimenet egy minterm, **a függvény mintermjeinek megfelelő kimeneteket VAGY kapuval összegyűjtve** bármely függvény megvalósítható. Egy 3→8 dekóder + két VAGY kapu = **teljes összeadó**:

- S = Σm(1, 2, 4, 7) → Y1 + Y2 + Y4 + Y7
- C<sub>out</sub> = Σm(3, 5, 6, 7) → Y3 + Y5 + Y6 + Y7

(Aktív alacsony kimeneteknél VAGY helyett **NAND** kapu kell – De Morgan.)

## A kóder (enkóder)

A **kóder** a dekóder fordítottja: 2<sup>n</sup> bemenet közül az aktív bemenet **sorszámát** adja ki n biten. A sima kóder feltételezi, hogy egyszerre csak egy bemenet aktív.

### Prioritáskóder

Ha egyszerre több bemenet aktív, a **prioritáskóder** a **legmagasabb prioritású** (itt: legnagyobb sorszámú) sorszámát adja ki. Egy **V** (valid) kimenet jelzi, hogy egyáltalán van-e aktív bemenet.

4→2 prioritáskóder (D3 a legerősebb):

| D3 D2 D1 D0 | Y1 Y0 | V   |
| ----------- | ----- | --- |
| 0 0 0 0     | X X   | 0   |
| 0 0 0 1     | 0 0   | 1   |
| 0 0 1 X     | 0 1   | 1   |
| 0 1 X X     | 1 0   | 1   |
| 1 X X X     | 1 1   | 1   |

**Y1 = D3 + D2**, **Y0 = D3 + D̅2·D1**, **V = D3 + D2 + D1 + D0**

**Felhasználás:** megszakításkezelő (melyik eszköz kér kiszolgálást a legsürgősebben), billentyűzet. Ismert IC: **74148** (8→3, aktív alacsony).

## A komparátor

A **nagyságkomparátor** két számot hasonlít össze, és három kimenete van: **A > B**, **A = B**, **A < B**.

### Egybites komparátor

| A   | B   | G (A>B) | E (A=B) | L (A<B) |
| --- | --- | ------- | ------- | ------- |
| 0   | 0   | 0       | 1       | 0       |
| 0   | 1   | 0       | 0       | 1       |
| 1   | 0   | 1       | 0       | 0       |
| 1   | 1   | 0       | 1       | 0       |

**G = A·B̅**, **E = A ⊙ B** (XNOR), **L = A̅·B**

### Több bites komparátor

Bitenként E<sub>i</sub> = A<sub>i</sub> ⊙ B<sub>i</sub>. Négy bitre:

- **A = B**, ha minden bit egyezik: E = E3·E2·E1·E0
- **A > B**, ha a **legfelső eltérő** bitnél A-ban van az 1-es: G = G3 + E3·G2 + E3·E2·G1 + E3·E2·E1·G0
- **A < B**: ugyanígy L-ekkel (vagy L = (G + E)̅).

A **7485** egy 4 bites, kaszkádosítható komparátor IC (kaszkádbemenetekkel 8, 12 … bitre bővíthető).

```python run
# Prioritáskóder és 4 bites komparátor bitenként
def prioritas(d3, d2, d1, d0):
    y1 = d3 | d2
    y0 = d3 | ((1 - d2) & d1)
    v = d3 | d2 | d1 | d0
    return y1, y0, v

print("prioritás 0110 →", prioritas(0, 1, 1, 0))   # a D2 nyer

def komparator(a, b):
    for i in range(3, -1, -1):                      # a legfelső bittől lefelé
        ai, bi = (a >> i) & 1, (b >> i) & 1
        if ai != bi:
            return "A>B" if ai else "A<B"
    return "A=B"

print("1011 vs 1001 →", komparator(0b1011, 0b1001))
```

## Összefoglalás

- Dekóder: n bemenet → 2<sup>n</sup> kimenet, mindegyik egy minterm; dekóder + VAGY = tetszőleges függvény.
- Kóder: az aktív bemenet sorszáma; prioritáskóder: a legerősebb aktív bemenet sorszáma + V jel.
- Komparátor: G = AB̅, E = A ⊙ B, L = A̅B; több bitnél a legfelső eltérő bit dönt.

## A lecke feladata

```quiz required
? Add meg a 2→4 dekóder Y1 kimenetének függvényét!
expr: A1, A0 -> A1'·A0
! Y1 akkor aktív, ha a bemenet 01.

? Hány kimenete van egy 4 bites bemenetű bináris dekódernek?
= 16
! 2^4.

? Egy 3→8 dekóderrel és egy VAGY kapuval teljes összeadót építünk. Melyik kimeneteket kell összeVAGY-olni az összeg (S) előállításához? (Sorszámok vesszővel, növekvő sorrendben!)
= 1, 2, 4, 7
! S = 1, ha páratlan számú bemenet 1.

? Írd fel a 4→2 prioritáskóder Y0 kimenetét a lehető legegyszerűbben (D3 a legerősebb)!
expr: D3, D2, D1, D0 -> D3 + D2'D1
limit: 3
same: D3 + D3'D2'D1
! Y0 = 1, ha a győztes a 3-as vagy az 1-es bemenet.

? Töltsd ki az egybites komparátor igazságtábláját (G: A>B, E: A=B, L: A<B)!
table: A, B -> G = A·B'; E = A ⊙ B; L = A'·B

? Egy 74138 típusú dekóder kimenetei aktív alacsonyak. Mi a helyzet, ha az ABC = 101 bemenet érkezik (engedélyezve)?
- Az Y5 kimenet 1, a többi 0.
+ Az Y5 kimenet 0, a többi 1.
- Minden kimenet 0.
- Az Y2 kimenet 0, a többi 1.
! Aktív alacsony: a kiválasztott kimenet megy 0-ba.
```
