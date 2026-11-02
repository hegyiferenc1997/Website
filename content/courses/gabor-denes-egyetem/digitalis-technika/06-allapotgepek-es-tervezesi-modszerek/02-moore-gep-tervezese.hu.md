---
title: Moore-gép tervezése – lámpavezérlés két nyomógombbal
summary: Egy teljes Moore-állapotgép megtervezése a szöveges feladattól az állapotgráfon, állapottáblán és Karnaugh-táblán át a D flip-floppal megvalósított kapcsolásig.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogyan jutsz el egy **szöveges feladattól** a kész kapcsolásig,
- hogyan rajzolsz **állapotgráfot** és írsz fel **állapottáblát**,
- hogyan kapod meg a **következőállapot-logikát** algebrailag és K-táblával,
- hogyan készül a **kimeneti logika** egy Moore-gépben.

## 1. A szöveges feladat

Van két nyomógomb – **Piros** (P) és **Zöld** (Z) –, és két lámpa – piros és zöld.

- Ha a **piros** lámpa világít, és megnyomjuk a **Zöld** gombot, akkor a **zöld** lámpa világítson.
- Ha a **zöld** lámpa világít, és megnyomjuk a **Piros** gombot, akkor a **piros** lámpa világítson.
- Ha **egyik** gombot sem nyomjuk, vagy **mindkettőt** megnyomjuk, a gép **ne váltson** állapotot.

Bemenetek: P, Z (1 = nyomva). Kimenetek: a két lámpa.

## 2. Állapotok és állapotgráf

Két állapot elég: **PIROS** (a piros lámpa ég) és **ZÖLD** (a zöld lámpa ég).

```text
            P·Z̅ (csak a Piros gomb)
   ┌──────────────────────────────┐
   │                              ▼
 (ZÖLD / zöld lámpa)        (PIROS / piros lámpa)
   ▲   ↺ egyébként                │  ↺ egyébként
   └──────────────────────────────┘
            Z·P̅ (csak a Zöld gomb)
```

Moore-gép: a kimenet (melyik lámpa ég) **csak az állapottól** függ, ezért az állapot körébe írjuk.

## 3. Állapotkódolás és kimenetek

Két állapothoz **egy** flip-flop (D) elég. Kódolás: **D = 1 → PIROS**, **D = 0 → ZÖLD**.

A kimeneti logika ezzel triviális: **piros lámpa = D**, **zöld lámpa = D̅** – a flip-flop két kimenete közvetlenül hajtja a lámpákat.

## 4. Állapottábla

A D flip-flopnál a bemenetre a **következő állapotot** kell adni: D<sup>+</sup> (a jelölés D(N+1) is szokásos).

| D | P | Z | D<sup>+</sup> | magyarázat                         |
| - | - | - | ------------- | ---------------------------------- |
| 0 | 0 | 0 | 0             | zöld, nincs gomb → marad           |
| 0 | 0 | 1 | 0             | zöld, Zöld gomb → marad            |
| 0 | 1 | 0 | 1             | zöld, **Piros gomb → piros**       |
| 0 | 1 | 1 | 0             | mindkét gomb → marad               |
| 1 | 0 | 0 | 1             | piros, nincs gomb → marad          |
| 1 | 0 | 1 | 0             | piros, **Zöld gomb → zöld**        |
| 1 | 1 | 0 | 1             | piros, Piros gomb → marad          |
| 1 | 1 | 1 | 1             | mindkét gomb → marad               |

## 5. A függvény felírása és egyszerűsítése

**Diszjunktív alak** (az 1-es sorok): D<sup>+</sup> = D̅PZ̅ + DP̅Z̅ + DPZ̅ + DPZ

**Grafikus egyszerűsítés** (sor: D, oszlop: PZ):

| D \ PZ | 00 | 01 | 11 | 10 |
| ------ | -- | -- | -- | -- |
| 0      | 0  | 0  | 0  | 1  |
| 1      | 1  | 0  | 1  | 1  |

- a PZ = 10 oszlop (2, 6) → **P·Z̅**
- a D = 1 sor 00 és 10 cellája (4, 6) → **D·Z̅**
- a D = 1 sor 11 és 10 cellája (7, 6) → **D·P**

**D<sup>+</sup> = P·Z̅ + D·Z̅ + D·P**

Érdekesség: ez a **többségi függvény** három jelre – D, P és Z̅ –: az állapot akkor lesz 1, ha a három közül legalább kettő 1.

**Algebrailag** is ugyanide jutunk: D<sup>+</sup> = D·(Z̅ + P) + D̅·P·Z̅ – kifejtés és a konszenzus-tétel után.

## 6. Áramköri megvalósítás

- egy **D flip-flop** (pl. a 7474 egyik fele),
- a D bemenetén a többségi logika: három kétbemenetű ÉS kapu és egy hárombemenetű VAGY kapu (vagy NAND–NAND alakban négy NAND kapu), plusz egy inverter Z̅-hoz,
- a Q kimenet a piros, a Q̅ kimenet a zöld lámpát hajtja (meghajtó tranzisztoron át).

A gombokat **prell-mentesíteni** és **szinkronizálni** kell (két flip-flopos lánc), mert aszinkron külső jelek.

```python run
# A lámpavezérlő Moore-gép szimulációja egy gombnyomás-sorozatra
def kovetkezo(d, p, z):
    return (p & (1 - z)) | (d & (1 - z)) | (d & p)   # D+ = P·Z̅ + D·Z̅ + D·P

d = 1                                                # indulás: piros lámpa
for p, z in [(0, 0), (0, 1), (0, 0), (1, 1), (1, 0), (0, 0)]:
    d = kovetkezo(d, p, z)
    print(f"P={p} Z={z} → {'piros' if d else 'zöld'} lámpa")
```

## Összefoglalás

- A tervezés lépései: szöveg → állapotgráf → kódolás → állapottábla → függvény → egyszerűsítés → kapcsolás.
- Két állapot → egy D flip-flop; Moore-kimenet: piros = D, zöld = D̅.
- D<sup>+</sup> = PZ̅ + DZ̅ + DP (többségi függvény).

## A lecke feladata

```quiz required
? Hány állapota van a lámpavezérlő gépnek?
= 2

? Töltsd ki a lámpavezérlő állapottábláját (D = 1: piros lámpa; DN a következő állapot)!
table: D, P, Z -> DN = P·Z' + D·Z' + D·P
! Váltás csak akkor van, ha pontosan a „másik” gombot nyomjuk.

? Írd fel a következő állapot (D+) egyszerűsített függvényét!
expr: D, P, Z -> P·Z' + D·Z' + D·P
limit: 6
same: D·(Z' + P) + D'·P·Z'
! K-tábla: a PZ = 10 oszlop, és a D = 1 sor két párja.

? Mi a piros lámpa kimeneti függvénye ebben a Moore-gépben?
+ D
- D̅
- D·P
- P·Z̅

? Miért stabil a Moore-gép kimenete két órajel között?
- Mert a Moore-gépnek nincs órajele.
+ Mert a kimenet csak az állapottól függ, az pedig csak órajel élen változik.
- Mert a bemeneteket kettős negálással szűrjük.
- Mert a kimeneti logika is flip-flopokból áll.
```
