---
title: Mélyebben – Boole-algebra a gépen
summary: Azonosságok bizonyítása nyers erővel (igazságtábla-összevetés és ellenpélda keresése), kísérlet arról, hogy a 16 kétbemenetű kapu közül melyik univerzális egymagában, XOR négy NAND-ból szimulátorral, és miért olcsóbb tranzisztorban a NAND–NAND alak.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **bizonyít** egy program bármilyen Boole-azonosságot, és hogyan talál **ellenpéldát** egy hamis „azonosságra”,
- **kísérlettel** megnézni, hogy a 16 kétbemenetű kapu közül melyik univerzális egymagában (és miért nem az ÉS vagy a XOR),
- végigkövetni egy **csak NAND-ból** épített XOR jeleit, és megbecsülni a késleltetését,
- kiszámolni, miért kerül **kevesebb tranzisztorba** a NAND–NAND hálózat, mint az ÉS–VAGY.

## 1. Bizonyítás nyers erővel

Az algebrai átalakítás szép, de könnyű elrontani. Egy n változós azonosságnak csak **2<sup>n</sup>** bemeneti kombinációja van – ezt egy gép pillanatok alatt mind kipróbálja. Ha minden sorban egyezik a két oldal, az azonosság **bizonyítva** van (ez a _teljes kipróbálás_ módszere); ha egy sorban is eltér, megvan az **ellenpélda**.

```python run
# Azonosságok bizonyítása "nyers erővel": minden bemeneti kombinációt kipróbálunk
from itertools import product

def egyenerteku(f, g, n):
    for bemenet in product([0, 1], repeat=n):
        if f(*bemenet) != g(*bemenet):
            return bemenet                       # ellenpélda
    return None                                  # minden sorban egyezik

azonossagok = [
    ("disztributív: A + B·C = (A + B)·(A + C)",
     lambda a, b, c: a | (b & c), lambda a, b, c: (a | b) & (a | c)),
    ("elnyelés: A + A·B = A",
     lambda a, b, c: a | (a & b), lambda a, b, c: a),
    ("De Morgan: (A·B·C)' = A' + B' + C'",
     lambda a, b, c: 1 - (a & b & c), lambda a, b, c: (1 - a) | (1 - b) | (1 - c)),
    ("konszenzus: A·B + A'·C + B·C = A·B + A'·C",
     lambda a, b, c: (a & b) | ((1 - a) & c) | (b & c), lambda a, b, c: (a & b) | ((1 - a) & c)),
    ("HAMIS: A + B·C = (A + B)·C",
     lambda a, b, c: a | (b & c), lambda a, b, c: (a | b) & c),
]
for nev, f, g in azonossagok:
    ell = egyenerteku(f, g, 3)
    print(f"{nev:<44} → " + ("igaz (mind a 8 sorban)" if ell is None else f"HAMIS, ellenpélda A,B,C = {ell}"))
```

Két tanulság:

- A **konszenzustétel** (A·B + A̅·C + B·C = A·B + A̅·C) első ránézésre gyanús – a B·C tag „csak úgy” eltűnik. A gép mind a 8 sorban egyezést talál: ha B·C = 1, akkor A értékétől függően az A·B vagy az A̅·C tag már 1, tehát a B·C tag felesleges.
- A hamis „azonosságnál” az ellenpélda **A = 1, B = 0, C = 0**: a bal oldal 1, a jobb oldal (1 + 0)·0 = 0. Egyetlen ellenpélda elég a cáfolathoz.

Ez a módszer 3–4 változóig kézzel is működik (ez maga az igazságtábla), de 30 változónál már 2<sup>30</sup> ≈ 1 milliárd sor – ott a valódi tervezőprogramok okosabb módszerekkel (pl. BDD, SAT-megoldó) dolgoznak. Az elv ugyanaz: **két hálózat egyenértékű, ha minden bemenetre ugyanazt adják**.

## 2. Melyik kapu univerzális egymagában? – kísérlet

Két bemenetre **16** különböző logikai függvény létezik (a négy sor kimenete 2<sup>4</sup>-féle lehet). Melyikből építhető meg **egymagában** mind a 16? A program az A és B bemenetből indul, és addig köti a kaput a már megépített jelekre, amíg új függvény születik.

```python run
# Melyik kétbemenetű kapu univerzális egymagában? Kipróbáljuk mind a 16-ot.
# Egy függvény = 4 bites igazságtábla: az i. bit az (A, B) = (i >> 1, i & 1) sor kimenete.
A, B = 0b1100, 0b1010                            # a két bemenet "oszlopa"

def alkalmaz(kapu, x, y):
    # a kapu (4 bites tábla) alkalmazása két oszlopra, soronként
    z = 0
    for i in range(4):
        sor = ((x >> i) & 1) * 2 + ((y >> i) & 1)
        z |= ((kapu >> sor) & 1) << i
    return z

def elerheto(kapu):
    # mi építhető ebből az egy kapuból (tetszőleges sok példányban)?
    halmaz = {A, B}
    while True:
        uj = {alkalmaz(kapu, x, y) for x in halmaz for y in halmaz} | halmaz
        if uj == halmaz:
            return halmaz
        halmaz = uj

nevek = {0b1000: "ÉS", 0b1110: "VAGY", 0b0110: "XOR", 0b0111: "NAND",
         0b0001: "NOR", 0b1001: "XNOR", 0b1011: "IMPLIKÁCIÓ (A → B)"}
for kapu in range(16):
    db = len(elerheto(kapu))
    if kapu in nevek or db == 16:
        print(f"{nevek.get(kapu, '?'):<20} tábla {kapu:04b}: {db:>2} / 16 függvény építhető"
              + ("  ← UNIVERZÁLIS" if db == 16 else ""))
```

A kísérlet eredménye: a 16 kapu közül **csak a NAND és a NOR** univerzális egymagában. Hogy a többi miért nem, az is kiolvasható:

- **ÉS, VAGY**: _monoton_ kapuk – ha egy bemenet 0-ról 1-re nő, a kimenet sosem csökken. Monoton kapukból negálás (A̅) sosem rakható össze.
- **XOR, XNOR**: _lineáris_ kapuk – belőlük csak paritás jellegű függvények jönnek ki (pl. A ⊕ B), ÉS sosem.
- **IMPLIKÁCIÓ**: majdnem jó – ha mellé kap egy **konstans 0**-t, már univerzális (A → 0 = A̅). Egymagában viszont a 0 nem állítható elő.

**Hasonlat:** a NAND olyan, mint a LEGO alapkocka: egyféle elemből bármit megépíthetsz. Az ÉS kapu olyan, mintha csak „felfelé” illeszthető kockáid lennének – lefelé sosem tudsz építeni.

## 3. XOR négy NAND-ból – a jelek nyomában

Az univerzális kapuk leckében láttad, hogy a XOR 4 NAND-ból épül. Kövessük végig a belső jeleket is, és nézzük meg, mennyi idő alatt ér át a jel!

```python run
# XOR csak NAND kapukból (4 db) – ellenőrzés és késleltetés
def nand(x, y):
    return 1 - (x & y)

T_NAND = 8                                       # ns, egy 74HC00 kapu késleltetése (kb.)

print(" A B | N1 N2 N3 |  Y  | A⊕B")
for a in (0, 1):
    for b in (0, 1):
        n1 = nand(a, b)                          # 1. szint
        n2, n3 = nand(a, n1), nand(b, n1)        # 2. szint
        y = nand(n2, n3)                         # 3. szint
        print(f" {a} {b} |  {n1}  {n2}  {n3} |  {y}  |  {a ^ b}")

print(f"\nA leghosszabb út 3 kapun megy át → késleltetés ≈ 3 · {T_NAND} = {3 * T_NAND} ns")
```

Az Y oszlop minden sorban egyezik az A ⊕ B oszloppal – a hálózat helyes. A trükk az N1 = (A·B)̅ jel közös felhasználása: N2 = (A·N1)̅ csak akkor 0, ha A = 1 és B = 0, N3 pedig csak akkor, ha B = 1 és A = 0. A kimeneti NAND „bármelyik 0 → 1” módon VAGY-ként összegzi őket.

A jel **3 kapuszinten** halad át, ezért egy 74HC00 chippel kb. 24 ns alatt áll be a kimenet. A gyártók ezért külön XOR kaput is gyártanak (74HC86): az belül tranzisztorszinten optimalizált, gyorsabb.

## 4. Tranzisztorszám: miért kedvelik a NAND-ot?

CMOS-ban egy kétbemenetű **NAND vagy NOR 4 tranzisztor**, az **ÉS és a VAGY 6** (mert valójában egy NAND/NOR + egy inverter). Számoljuk ki az F = A·B + C·D függvényre:

| Megvalósítás | Kapuk               | Tranzisztor    |
| ------------ | ------------------- | -------------- |
| ÉS–VAGY      | 2 × ÉS2 + 1 × VAGY2 | 3 × 6 = **18** |
| NAND–NAND    | 3 × NAND2           | 3 × 4 = **12** |

Ugyanaz a függvény (De Morgan miatt), de **harmadával kevesebb** tranzisztor, kisebb chipfelület, kisebb fogyasztás és rövidebb késleltetés (egy inverterrel kevesebb a jelúton). Egy milliárd tranzisztoros processzornál ez óriási különbség – ezért alakítják a szintézisprogramok a hálózatokat automatikusan NAND/NOR alapúvá.

## Összefoglalás

- Egy Boole-azonosság **teljes kipróbálással** bizonyítható (2<sup>n</sup> sor), és egyetlen **ellenpélda** cáfolja.
- A konszenzustétel: A·B + A̅·C + B·C = A·B + A̅·C – a B·C tag felesleges.
- A 16 kétbemenetű kapu közül **csak a NAND és a NOR** univerzális egymagában; az ÉS/VAGY monoton, a XOR/XNOR lineáris, ezért nem.
- XOR = 4 NAND, 3 kapuszint mély.
- CMOS-ban NAND2/NOR2 = 4 tranzisztor, ÉS2/VAGY2 = 6 – a NAND–NAND alak olcsóbb és gyorsabb.

## A lecke feladata

```quiz required
? Töltsd ki az igazságtáblát! (Ez egy NAND-ból épített hálózat – melyik ismert kapu ez?)
table: A, B -> Y = (A'·B')'
! De Morgan: (A̅·B̅)̅ = A + B, tehát VAGY.

? A 16 kétbemenetű kapu közül melyik univerzális egymagában?
- ÉS
- XOR
+ NOR
- IMPLIKÁCIÓ
! Csak a NAND és a NOR; az ÉS monoton, a XOR lineáris, az implikációhoz kell egy konstans 0 is.

? Egyszerűsítsd a konszenzustétellel: F = A·B + A'·C + B·C
expr: A, B, C -> A·B + A'·C
limit: 4
same: A·B + A'·C + B·C
! A B·C tag elhagyható.

? Hány NAND kapuból építhető meg a XOR (a legkevesebb)?
= 4
! N1 = (AB)̅, N2 = (A·N1)̅, N3 = (B·N1)̅, Y = (N2·N3)̅.

? Hány tranzisztor kell CMOS-ban az F = A·B + C·D függvényhez NAND–NAND alakban (3 db NAND2)?
= 12
! Egy CMOS NAND2 4 tranzisztor.
```
