---
title: Mélyebben – ütemezés és konkurencia szimulátorral
summary: Egy saját ütemezőszimulátor érkezési időkkel (FCFS, SJF, Round Robin) és Gantt-diagrammal, az elveszett frissítés összes lehetséges összefésülése, a bankár-algoritmus biztonsági ellenőrzése programmal, valamint a Linux ütemezőjének kipróbálása nice értékekkel a virtuális gépen.
minutes: 45
---

## Amit ebben a leckében megtanulsz

- hogyan számold ki az ütemezési algoritmusok eredményét akkor is, ha a folyamatok **különböző időpontokban érkeznek**,
- hogyan mutatja meg egy egyszerű program, **hányféleképpen** romolhat el egy versenyhelyzet,
- hogyan dönti el a **bankár-algoritmus**, hogy teljesíthető-e egy kérés,
- hogyan befolyásolhatod a Linux ütemezőjét a **nice** értékkel, és hogyan látod ennek hatását.

## 1. Ütemezés érkezési időkkel

Az alapleckében mindenki egyszerre (0-kor) érkezett. A valóságban a folyamatok **különböző időpontokban** jönnek, és az ütemező csak a már megérkezettek közül választhat. Ez a közös példánk:

| Folyamat | Érkezés (ms) | CPU-löket (ms) |
| -------- | ------------ | -------------- |
| P1       | 0            | 7              |
| P2       | 2            | 4              |
| P3       | 4            | 1              |
| P4       | 5            | 4              |

Emlékeztető a mérőszámokra:

- **körülfordulási idő** = befejezés − érkezés (mennyi idő telt el, míg a folyamat „végzett”),
- **várakozási idő** = körülfordulási idő − löket (mennyit állt a kész sorban).

### Kézzel: FCFS

Az FCFS érkezési sorrendben futtat: P1 0–7, P2 7–11, P3 11–12, P4 12–16.

| Folyamat | Befejezés | Körülfordulás | Várakozás  |
| -------- | --------- | ------------- | ---------- |
| P1       | 7         | 7 − 0 = 7     | 7 − 7 = 0  |
| P2       | 11        | 11 − 2 = 9    | 9 − 4 = 5  |
| P3       | 12        | 12 − 4 = 8    | 8 − 1 = 7  |
| P4       | 16        | 16 − 5 = 11   | 11 − 4 = 7 |

Átlagos várakozás: (0 + 5 + 7 + 7) / 4 = **4,75 ms**. A szegény P3-nak, amely csak 1 ms-ot akart, 7 ms-ot kellett várnia – ez a **konvojhatás**: a rövid folyamatok egy hosszú mögött ragadnak.

### Programmal: mindhárom algoritmus

A kézi számolás hibalehetőséggel jár, és unalmas. Íme egy kis szimulátor, amely Gantt-diagramot is rajzol. Futtasd, majd változtass a folyamatokon vagy a kvantumon!

```python run
# Ütemezőszimulátor érkezési időkkel: FCFS, SJF (nem preemptív) és Round Robin.
from collections import deque

FOLYAMATOK = [("P1", 0, 7), ("P2", 2, 4), ("P3", 4, 1), ("P4", 5, 4)]   # név, érkezés, löket

def fcfs(ps):
    ido, gantt = 0, []
    for nev, erk, loket in sorted(ps, key=lambda p: p[1]):
        ido = max(ido, erk)                  # ha senki sincs, a CPU tétlen vár
        gantt.append((ido, ido + loket, nev))
        ido += loket
    return gantt

def sjf(ps):
    ido, gantt, hatra = 0, [], list(ps)
    while hatra:
        erkezett = [p for p in hatra if p[1] <= ido]
        if not erkezett:                     # tétlen időszak: ugrás a következő érkezésig
            ido = min(p[1] for p in hatra)
            continue
        p = min(erkezett, key=lambda p: (p[2], p[1]))   # legrövidebb löket, holtversenyben a korábbi
        hatra.remove(p)
        gantt.append((ido, ido + p[2], p[0]))
        ido += p[2]
    return gantt

def round_robin(ps, kvantum):
    ido, gantt, sor = 0, [], deque()
    maradek = {n: l for n, _, l in ps}
    erkezes = sorted(ps, key=lambda p: p[1])
    i = 0
    def beerkezok():                         # akik eddig megérkeztek, beállnak a sorba
        nonlocal i
        while i < len(erkezes) and erkezes[i][1] <= ido:
            sor.append(erkezes[i][0])
            i += 1
    beerkezok()
    while sor or i < len(erkezes):
        if not sor:
            ido = erkezes[i][1]
            beerkezok()
        nev = sor.popleft()
        fut = min(kvantum, maradek[nev])
        gantt.append((ido, ido + fut, nev))
        ido += fut
        maradek[nev] -= fut
        beerkezok()                          # az újonnan érkezők a visszatérő elé állnak
        if maradek[nev] > 0:
            sor.append(nev)
    return gantt

def kiertekel(cim, gantt):
    print(cim)
    print("  " + " ".join(f"[{k}–{v} {n}]" for k, v, n in gantt))
    befejezes = {n: v for _, v, n in gantt}  # az utolsó szelet vége
    varakozas = [befejezes[n] - erk - loket for n, erk, loket in FOLYAMATOK]
    print(f"  átlagos várakozás: {sum(varakozas) / len(varakozas):.2f} ms\n")

kiertekel("FCFS", fcfs(FOLYAMATOK))
kiertekel("SJF", sjf(FOLYAMATOK))
kiertekel("Round Robin, kvantum = 2", round_robin(FOLYAMATOK, 2))
```

Az eredmények: FCFS **4,75**, SJF **4,00**, Round Robin (q = 2) **5,00** ms átlagos várakozás.

Mit tanulunk ebből?

- Az **SJF** a legjobb átlagos várakozást adja – de tudnia kellene előre a löketek hosszát, ami a valóságban csak becsülhető.
- A **Round Robin** átlaga itt a legrosszabb, mégis ezt (illetve ennek finomításait) használják az asztali rendszerek: a P2 már 2 ms-on belül **először** sorra kerül, vagyis a **válaszidő** kicsi. Egy interaktív programnál (szövegszerkesztő, böngésző) a felhasználó ezt érzi, nem az átlagos várakozást.
- **Nincs mindenben legjobb algoritmus**: amelyik egy mérőszámban nyer, az egy másikban veszít. Ez az ütemezés egyik legfontosabb tanulsága.

## 2. Hányféleképpen romolhat el? – az elveszett frissítés

Két szál egyszerre növeli ugyanazt a számlálót. A `szamlalo++` valójában **három lépés**: kiolvasás (a regiszterbe), növelés, visszaírás. Az ütemező bármelyik lépés után válthat a szálak között.

Ahelyett, hogy valódi szálakkal próbálkoznánk (ahol a hiba ritka és nehezen megismételhető), a program **az összes lehetséges összefésülést** végignézi, és megszámolja, melyik milyen végeredményt ad:

```python run
# Két szál, mindkettő: kiolvas → növel → visszaír. Az összes lehetséges összefésülés kipróbálása.
from itertools import combinations

LEPESEK = ["kiolvas", "növel", "visszaír"]

def futtat(sorrend):
    """A sorrend azt mondja meg, melyik szál lép a következő lépésben (A vagy B)."""
    kozos = 0                                # a közös memóriában lévő számláló
    reg = {"A": 0, "B": 0}                   # a szálak saját regiszterei
    hol = {"A": 0, "B": 0}                   # hányadik lépésnél tart a szál
    for szal in sorrend:
        lepes = LEPESEK[hol[szal]]
        if lepes == "kiolvas":
            reg[szal] = kozos
        elif lepes == "növel":
            reg[szal] += 1
        else:
            kozos = reg[szal]
        hol[szal] += 1
    return kozos

eredmenyek = {}
for a_helyei in combinations(range(6), 3):  # hol lép az A szál a 6 lépésből
    sorrend = ["A" if i in a_helyei else "B" for i in range(6)]
    v = futtat(sorrend)
    eredmenyek.setdefault(v, []).append("".join(sorrend))

for v, sorrendek in sorted(eredmenyek.items()):
    print(f"végeredmény {v}: {len(sorrendek):2} összefésülés, pl. {sorrendek[0]}")
```

A 20 lehetséges összefésülésből **csak 2** adja a helyes 2-t: amikor az egyik szál **teljesen** végez, mielőtt a másik kiolvasna. A többi 18 esetben **elvész egy frissítés**. Egy valódi gépen a váltás legtöbbször nem pont a rossz helyen történik, ezért a hiba csak ritkán jön elő – és éppen ettől veszélyes: a teszteken átmegy, élesben egyszer csak rossz lesz az eredmény.

A **mutex** pontosan azt éri el, hogy a három lépés **oszthatatlan** blokként fusson: így csak a két „soros” összefésülés marad.

## 3. A bankár-algoritmus programmal

Az alapleckében kézzel ellenőriztük, hogy egy állapot **biztonságos**-e (12 egység, P0 10/5, P1 4/2, P2 9/2). A program ugyanezt csinálja, és azt is megmondja, teljesíthető-e egy új kérés: ideiglenesen „odaadja”, és megnézi, biztonságos marad-e az állapot.

```python run
# Bankár-algoritmus egy erőforrástípussal: biztonságos-e az állapot, teljesíthető-e a kérés?
OSSZES = 12
MAXIMUM = {"P0": 10, "P1": 4, "P2": 9}
TARTJA = {"P0": 5, "P1": 2, "P2": 2}

def biztonsagos(tartja):
    szabad = OSSZES - sum(tartja.values())
    kesz, sorrend = set(), []
    while len(kesz) < len(tartja):
        for p in tartja:
            if p not in kesz and MAXIMUM[p] - tartja[p] <= szabad:
                szabad += tartja[p]          # p lefut, és visszaad mindent
                kesz.add(p)
                sorrend.append(p)
                break
        else:
            return None                      # senki sem tud továbblépni: nem biztonságos
    return sorrend

print("Jelenlegi állapot, biztonságos sorrend:", biztonsagos(TARTJA))

def keres(p, db):
    proba = dict(TARTJA)
    proba[p] += db
    sorrend = biztonsagos(proba)
    valasz = f"teljesíthető, sorrend: {sorrend}" if sorrend else "NEM teljesíthető (nem biztonságos)"
    print(f"{p} kér még {db} egységet → {valasz}")

keres("P1", 2)
keres("P2", 1)
keres("P0", 1)
```

Érdekes eredmény: ha a **P2 csak 1** egységet kér, azt a bankár **nem adja oda**, pedig van 3 szabad egység! Utána ugyanis 2 maradna szabadon: P1 még le tudna futni (szabad 4), de akkor sem P0-nak (5), sem P2-nek (6) nem lenne elég – ha mindketten a maximumukat kérnék, **holtpont** lehetne. A bankár tehát előrelátó: nem azt nézi, van-e most elég, hanem azt, hogy **a legrosszabb esetben** is mindenki befejezhető-e.

## 4. A Linux ütemezője a gyakorlatban: nice

A Linux az általános célú folyamatokat egy olyan ütemezővel kezeli (**EEVDF**, a korábbi CFS utódja), amely a processzoridőt „igazságosan” osztja el – a **nice** érték szerint súlyozva. A nice −20 (legfontosabb) és 19 (legkevésbé fontos) között lehet, alapértelmezésben 0. Egy lépés nagyjából **1,25-szörös** különbséget jelent a kapott időben.

Próbáld ki az Ubuntu VM-ben! Két, a processzort teljesen lefoglaló programot indítunk **ugyanarra a magra** kényszerítve (`taskset -c 0`), az egyiket „kedvesen” (nice 10):

```bash
taskset -c 0 yes > /dev/null &              # 1. program, nice 0
taskset -c 0 nice -n 10 yes > /dev/null &   # 2. program, nice 10
top                                         # nézd a %CPU oszlopot (kilépés: q)
```

A `top` kimenetében az első `yes` kb. **90%**, a második kb. **10%** processzort kap (10 lépés ≈ 1,25¹⁰ ≈ 9-szeres arány). Változtass menet közben:

```bash
renice -n 0 -p $(pgrep -n yes)    # a második is legyen nice 0 → kb. 50–50%
killall yes                       # takarítás a végén!
```

Normál felhasználó csak **növelni** tudja a nice értéket (kedvesebbé tenni a programját); csökkenteni (előnyt szerezni) csak a rendszergazda tud (`sudo renice -n -5 …`) – különben mindenki a saját programját tenné a legfontosabbá.

Windowson a Feladatkezelő **Részletek** lapján jobb gomb → **Prioritás beállítása** (Alacsony … Valós idejű) felel meg ennek, PowerShellben: `(Get-Process notepad).PriorityClass = 'BelowNormal'`.

## Összefoglalás

- Érkezési időkkel az ütemező csak a már megérkezettek közül választhat; **várakozás = befejezés − érkezés − löket**.
- A példán: FCFS 4,75, SJF 4,00, RR (q = 2) 5,00 ms átlagos várakozás – de az RR válaszideje a legjobb. Nincs mindenben győztes algoritmus.
- Két szál `szamlalo++` műveletének 20 összefésüléséből csak 2 helyes: ezért kell a kölcsönös kizárás.
- A **bankár** csak akkor ad, ha utána is létezik olyan sorrend, amelyben mindenki befejezhető – akkor is nemet mondhat, ha éppen van szabad erőforrás.
- Linuxon a **nice** érték súlyozza a processzoridőt; a `taskset`, `top` és `renice` segítségével látványosan kipróbálható.

## A lecke feladata

```quiz required
? FCFS ütemezés, P1 érkezik 0-kor (löket 7), P2 érkezik 2-kor (löket 4). Mennyi P2 várakozási ideje (ms)?
= 5
! P2 7-kor indul, 11-kor végez: 11 − 2 − 4 = 5.

? A lecke közös példáján melyik algoritmus adta a legkisebb átlagos várakozási időt?
- FCFS
+ SJF
- Round Robin (q = 2)
! 4,00 ms – de ehhez előre kellene tudni a löketek hosszát.

? Miért használják mégis a Round Robin-féle ütemezést az asztali rendszerek?
- mert mindig a legkisebb az átlagos várakozása
+ mert kicsi a válaszideje: minden folyamat hamar sorra kerül
- mert nem kell hozzá időzítő-megszakítás
! Az interaktív programoknál a válaszidő számít.

? Két szál egyszerre hajtja végre a háromlépéses (kiolvas, növel, visszaír) szamlalo++ műveletet. A 20 lehetséges összefésülésből hány adja a helyes eredményt?
= 2
! Csak a két „soros” összefésülés, amikor az egyik szál teljesen végez a másik kiolvasása előtt.

? 12 egység van, P0 tart 5-öt (max. 10), P1 2-t (max. 4), P2 2-t (max. 9). P2 kér még 1 egységet. Mit dönt a bankár?
- teljesíti, mert van 3 szabad egység
+ elutasítja, mert utána az állapot nem lenne biztonságos
! Utána csak P1 tudna biztosan befejeződni, P0 és P2 nem.

? Linuxon melyik érték jelenti a legkevésbé fontos (legkedvesebb) folyamatot?
- nice −20
- nice 0
+ nice 19
! Minél nagyobb a nice, annál kevesebb processzoridőt kap a folyamat.
```
