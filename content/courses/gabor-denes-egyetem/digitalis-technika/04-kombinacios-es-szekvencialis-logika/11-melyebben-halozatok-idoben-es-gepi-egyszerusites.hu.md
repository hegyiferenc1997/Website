---
title: Mélyebben – hálózatok időben és gépi egyszerűsítés
summary: A Quine–McCluskey módszer mint a Karnaugh-tábla gépi változata (prímimplikánsok, lényeges tagok), egy statikus hazárd szimulálása lépésről lépésre, a soros és az előrelátó átvitelű összeadó késleltetése bitszám szerint, valamint a metastabilitás és a kétfokozatú szinkronizáló számokkal.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan egyszerűsít egy **program** Karnaugh-tábla nélkül (Quine–McCluskey módszer), és mi a **lényeges prímimplikáns**,
- **időben** végigkövetni, hogyan születik meg egy hazárd okozta tüske, és hogyan tünteti el a redundáns tag,
- **kiszámolni**, miért lassú a soros átvitelű összeadó 64 biten, és mennyit nyer az előrelátó átvitel,
- **megbecsülni**, milyen gyakran okoz hibát a metastabilitás egy és két flip-floppal.

## 1. A Karnaugh-tábla gépi változata: Quine–McCluskey

A Karnaugh-tábla 4–5 változóig kényelmes, utána átláthatatlan. A gép ugyanazt az ötletet használja **szisztematikusan**: két minterm összevonható, ha pontosan egy bitben térnek el (pl. 0101 és 0111 → 01-1, ahol a `-` azt jelenti: „ez a változó kiesett”). Az összevonást addig ismétli, amíg lehet; amit már nem lehet tovább vonni, az a **prímimplikáns** – a Karnaugh-tábla legnagyobb, tovább nem bővíthető csoportja.

```python run
# Quine–McCluskey: a Karnaugh-tábla "gépi" változata – prímimplikánsok keresése
from itertools import combinations

def osszevon(x, y):
    # két tag összevonható, ha pontosan egy helyen térnek el (pl. 0101 és 0111 → 01-1)
    elter = [i for i in range(len(x)) if x[i] != y[i]]
    if len(elter) == 1 and "-" not in (x[elter[0]], y[elter[0]]):
        i = elter[0]
        return x[:i] + "-" + x[i + 1:]
    return None

def primimplikansok(mintermek, n):
    tagok = {format(m, f"0{n}b") for m in mintermek}
    primek = set()
    while tagok:
        uj, felhasznalt = set(), set()
        for x, y in combinations(sorted(tagok), 2):
            z = osszevon(x, y)
            if z:
                uj.add(z)
                felhasznalt |= {x, y}
        primek |= tagok - felhasznalt               # amit már nem lehet tovább vonni
        tagok = uj
    return primek

def kifejezes(tag, nevek="ABCD"):
    return "·".join(nevek[i] + ("'" if b == "0" else "") for i, b in enumerate(tag) if b != "-") or "1"

def lefedi(tag, m, n):
    return all(t in ("-", b) for t, b in zip(tag, format(m, f"0{n}b")))

def elemez(mintermek, n):
    primek = sorted(primimplikansok(mintermek, n))
    for p in primek:
        fed = [m for m in mintermek if lefedi(p, m, n)]
        # lényeges, ha van olyan minterm, amit csak ez a prím fed le
        lenyeges = any(sum(lefedi(q, m, n) for q in primek) == 1 for m in fed)
        print(f"  {p} = {kifejezes(p):<8} lefedi: {fed}" + ("  ← lényeges" if lenyeges else ""))

print("F1(A,B,C,D) = Σm(0, 2, 5, 7, 8, 10, 13, 15):")
elemez([0, 2, 5, 7, 8, 10, 13, 15], 4)
print("F2(A,B,C) = Σm(0, 1, 2, 5, 6, 7):")
elemez([0, 1, 2, 5, 6, 7], 3)
```

Mit látsz?

- **F1**-nél két prímimplikáns van, és mindkettő **lényeges**: van olyan minterm (pl. a 0 vagy az 5), amelyet csak ő fed le. Ezek mindenképp benne lesznek az egyszerűsített alakban: **F1 = B̅·D̅ + B·D**. A Karnaugh-táblán ez a négy sarok és a középső négyes csoport.
- **F2**-nél **hat** prímimplikáns van, de **egyik sem lényeges** – minden mintermet legalább két prím lefed. Ez a _ciklikus_ eset: választani kell, és **három** prím elég (pl. A̅·C̅ + B̅·C + A·B). A Karnaugh-táblán ez egy „körbeérő” csoportlánc, ahol több egyformán jó megoldás van.

A valódi tervezőprogramok (pl. az FPGA-fejlesztők szintézise) ennek továbbfejlesztett, gyors változatait használják – a te dolgod a tervezés, az egyszerűsítést ma már a gép végzi. De érteni kell, mit csinál, különben nem tudod ellenőrizni.

## 2. Egy hazárd születése – lépésről lépésre

Az F = A·B + A̅·C függvény B = C = 1 mellett **mindig 1**, akármi is az A. Mégis, ha A 1-ről 0-ra vált, egy pillanatra 0 jelenik meg a kimeneten. Miért? Mert az A̅ jel egy inverteren át, **késve** érkezik. Szimuláljuk, minden kapunak 1 időegység késleltetést adva:

```python run
# Statikus hazárd időben: F = A·B + A'·C, B = C = 1, és A 1 → 0-ra vált
# Minden kapu 1 időegység késleltetésű; a jeleket lépésenként számoljuk.
def szimulal(redundans_tag):
    B = C = 1
    nA, t1, t2, F = 0, 1, 0, 1                       # a kezdeti stabil állapot A = 1-nél
    t3 = 1 if redundans_tag else 0
    sor = []
    for t in range(6):
        A = 1 if t < 1 else 0                        # t = 1-ben A leesik
        # minden kapu az ELŐZŐ lépés jeleiből számol (ettől késik)
        nA, t1, t2, t3, F = (1 - A, A & B, nA & C, B & C if redundans_tag else 0,
                             t1 | t2 | t3)
        sor.append(F)
    return sor

print("idő:            0 1 2 3 4 5")
print("F = AB + A'C:  ", " ".join(map(str, szimulal(False))), "  ← tüske (glitch)!")
print("F + BC taggal: ", " ".join(map(str, szimulal(True))))
```

Kövesd az időt:

- **t = 1**: A leesik. Az A·B kapu még a régi A = 1 alapján számol, az inverter is még a régi A̅ = 0-t adja.
- **t = 2**: az A·B tag már 0, de az A̅·C tag még 0, mert az inverter kimenete csak most lett 1 → **F = 0**: ez a tüske!
- **t = 3**: az A̅·C tag is 1 lett, F visszaáll 1-re.

A redundáns **B·C** tag (a konszenzustag) független A-tól, így az átmenet alatt is 1-ben tartja a kimenetet. A Karnaugh-táblán ez az a csoport, amely „áthidalja” a két szomszédos csoport határát.

**Hasonlat:** váltásnál az egyik őr már elment, a másik még nem érkezett meg – egy pillanatra senki sem őrzi a kaput. A redundáns tag egy harmadik őr, aki végig ott áll.

## 3. Miért nem elég a soros átvitel 64 biten?

A soros átvitelű (_ripple-carry_) összeadóban minden bit átvitele az előzőére vár: bitenként kb. **2 kapuszint**. Az előrelátó (_carry-lookahead_) összeadó 4 bites blokkokban előre kiszámolja az átviteleket, a blokkokat pedig fába szervezi, így a késleltetés a bitszám **logaritmusával** nő.

```python run
# Soros átvitelű (ripple-carry) és előrelátó (carry-lookahead) összeadó késleltetése
T = 1.0                                              # ns, egy kapuszint késleltetése

def ripple(n):
    return 2 * n * T                                 # bitenként 2 kapuszint az átvitel útján

def lookahead(n):
    # 4 bites CLA blokkok fába szervezve: kb. 2 kapuszint szintenként + 2 a végén
    szintek, blokk = 1, 4
    while blokk < n:                                 # hány szintű a 4-es fa
        szintek, blokk = szintek + 1, blokk * 4
    return (2 * szintek + 2) * T

print(f"{'bit':>4} | {'ripple-carry':>12} | {'carry-lookahead':>15}")
for n in [4, 8, 16, 32, 64]:
    print(f"{n:>4} | {ripple(n):>9.0f} ns | {lookahead(n):>12.0f} ns")
```

64 biten a soros változat **128 ns** (ez legfeljebb ~8 MHz órajelet engedne!), az előrelátó **8 ns** – tizenhatszor gyorsabb. Az ár: sokkal több kapu. Ez a digitális tervezés örök alkuja: **sebesség kontra terület (kapuszám)**. A modern processzorok ALU-jában ezért mindig valamilyen előrelátó (vagy még fejlettebb, pl. Kogge–Stone) összeadó van.

## 4. Metastabilitás számokkal

Ha egy flip-flop bemenete pont az órajel-él körüli kritikus ablakban (setup + hold) változik, a kimenete **metastabil** állapotba kerülhet: egy ideig se nem 0, se nem 1, és csak véletlenszerű idő múlva „dől el”. Egy külső, aszinkron jelnél (gomb, szenzor, másik órajeltartomány) ez elkerülhetetlenül előfordul. A kérdés csak az, **milyen gyakran** okoz hibát. A szokásos becslés:

**MTBF = e<sup>t<sub>feloldás</sub> / τ</sup> / (T<sub>0</sub> · f<sub>órajel</sub> · f<sub>adat</sub>)**

ahol t<sub>feloldás</sub> az az idő, ameddig a flip-flop „gondolkodhat”, mielőtt a kimenetét valaki felhasználja.

```python run
# Metastabilitás: átlagos idő két hiba között (MTBF) egy és két flip-floppal
import math

TAU = 0.2e-9           # s, a flip-flop "feloldódási" időállandója (gyártói adat, példa)
T0 = 100e-12           # s, a veszélyes időablak (példa)
F_CLK = 100e6          # Hz, órajel
F_ADAT = 1e6           # Hz, ennyiszer vált a külső (aszinkron) jel másodpercenként

def mtbf_s(t_feloldas):
    return math.exp(t_feloldas / TAU) / (T0 * F_CLK * F_ADAT)

T_CLK = 1 / F_CLK
egy = mtbf_s(0.2 * T_CLK)        # 1 FF: csak a periódus egy kis része marad a feloldódásra
ketto = mtbf_s(1.0 * T_CLK)      # 2 FF: egy teljes órajel-periódus jut rá

ev = 365 * 24 * 3600
print(f"1 flip-flop:  MTBF ≈ {egy:.3g} s")
print(f"2 flip-flop:  MTBF ≈ {ketto:.3g} s ≈ {ketto / ev:.3g} év")
```

Egyetlen flip-floppal **pár másodpercenként** hibázhat a rendszer! Ha egy második flip-flopot teszünk mögé (**kétfokozatú szinkronizáló**), az elsőnek egy teljes órajel-periódusa van eldőlni – és mivel t<sub>feloldás</sub> az **exponensben** van, az MTBF több mint **tízmilliárd évre** nő (ez több, mint az Univerzum kora). Ezért van minden aszinkron bemenet mögött két flip-flop: ez a digitális tervezés egyik legfontosabb „mindig így csináld” szabálya.

## Összefoglalás

- A Quine–McCluskey módszer a Karnaugh-tábla gépi változata: összevonással **prímimplikánsokat** keres; a **lényegeseket** mindenképp fel kell venni, ciklikus esetben választani kell.
- Statikus hazárd: a késve érkező negált jel miatt egy pillanatra kiesik a kimenet; a **konszenzustag** megszünteti.
- Ripple-carry: késleltetés ∝ n; carry-lookahead: ∝ log n – több kapu árán.
- Metastabilitás: az MTBF az időtartalékkal **exponenciálisan** nő; aszinkron jelhez **két flip-flopos szinkronizáló** kell.

## A lecke feladata

```quiz required
? Egyszerűsítsd: F = A'·B'·C' + A'·B·C' + A·B'·C + A·B·C
expr: A, B, C -> A'·C' + A·C
limit: 4
same: A'·B'·C' + A'·B·C' + A·B'·C + A·B·C
! Két kettes csoport: A̅·C̅ (0. és 2. minterm) és A·C (5. és 7. minterm).

? Melyik tag szünteti meg a statikus hazárdot az F = A·B + A'·C függvényben?
- A·C
+ B·C
- A'·B
- nincs ilyen tag, a hazárd nem szüntethető meg
! A konszenzustag független A-tól, ezért váltáskor is 1-ben tartja a kimenetet.

? Töltsd ki a teljes összeadó kimenő átvitelének (K) igazságtábláját! (C a bejövő átvitel.)
table: A, B, C -> K = A·B + C·(A ⊕ B)
! K = 1, ha legalább két bemenet 1.

? Egy soros átvitelű összeadóban bitenként 2 kapuszint van az átvitel útján, egy kapuszint 1 ns. Mennyi a 32 bites összeadó késleltetése (ns)?
= 64
! 2 · 32 · 1 ns.

? Miért nő olyan drámaian az MTBF, ha egy második flip-flopot teszünk a szinkronizálóba?
- mert a második flip-flop gyorsabb
- mert a második flip-flop kiszűri a zajt
+ mert a feloldódásra jutó idő az exponensben van, és egy teljes periódussal nő
- mert két flip-flop között nem lehet metastabilitás
! MTBF ∝ e^(t/τ): kis időnövekedés is óriási szorzót ad.
```
