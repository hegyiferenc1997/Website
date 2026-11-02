---
title: Állapotkódolás, állapotminimalizálás és a tervezés menete
summary: Bináris, Gray és one-hot állapotkódolás, ekvivalens állapotok összevonása, a sorrendi hálózat tervezésének teljes lépéssora, állapotgép szimulációja programmal.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a három legelterjedtebb **állapotkódolást**: bináris, Gray, one-hot,
- mikor melyiket érdemes választani,
- hogyan **vonod össze az ekvivalens állapotokat** (állapotminimalizálás),
- a szinkron sorrendi hálózat **tervezésének teljes menetét**,
- hogyan **szimulálsz** egy állapotgépet programmal, mielőtt megépítenéd.

## Állapotkódolás

Az állapotokat (A, B, C …) a megvalósításhoz **bináris kódokkal** kell helyettesíteni. A választás befolyásolja a flip-flopok számát és a logika bonyolultságát.

| kódolás     | 4 állapot (S0…S3)      | flip-flopok N állapothoz | jellemző                                         |
| ----------- | ---------------------- | ------------------------ | ------------------------------------------------ |
| **bináris** | 00, 01, 10, 11         | ⌈log₂ N⌉                 | a legkevesebb flip-flop                          |
| **Gray**    | 00, 01, 11, 10         | ⌈log₂ N⌉                 | egymást követő állapotok közt **1 bit** változik |
| **one-hot** | 0001, 0010, 0100, 1000 | **N**                    | mindig **pontosan egy** flip-flop 1-es           |

- **Bináris:** kevés flip-flop – ahol a flip-flop drága (diszkrét IC-k, ASIC).
- **Gray:** ha az állapotgép jellemzően sorban lép (számlálószerű), kevesebb bit vált egyszerre → kisebb fogyasztás, kevesebb hazárd a dekódolt kimeneteken.
- **One-hot:** sok flip-flop, de a következőállapot- és kimeneti logika nagyon **egyszerű és gyors** (minden állapot egy bit, a kimenet sokszor maga a flip-flop). Az **FPGA-kon** ez az alapértelmezett, mert ott sok a flip-flop, és a kis logika gyorsabb.

## Állapotminimalizálás

Egy szöveges feladatból felírt állapotgráf gyakran **több állapotot** tartalmaz a szükségesnél. Két állapot **ekvivalens**, ha

1. a **kimenetük** minden bemenetre megegyezik, és
2. minden bemenetre **ekvivalens állapotokba** lépnek.

Az ekvivalens állapotok **összevonhatók** – a gép viselkedése kívülről nem változik, de kevesebb állapot, esetleg kevesebb flip-flop kell.

**Példa** (Moore-gép):

| állapot / kimenet | x = 0 | x = 1 |
| ----------------- | ----- | ----- |
| S0 / 0            | S1    | S2    |
| S1 / 0            | S0    | S3    |
| S2 / 0            | S0    | S3    |
| S3 / 1            | S3    | S0    |

S1 és S2 kimenete azonos (0), és ugyanoda lépnek (x = 0 → S0, x = 1 → S3) → **S1 ≡ S2**, összevonhatók. A gép 3 állapotú lesz: 4 helyett 3 állapot – a flip-flopok száma itt nem csökken (mindkettőhöz 2 kell), de a logika egyszerűsödik.

A szisztematikus módszer a **partícionálás** (a kimenetek szerint csoportokba osztjuk az állapotokat, majd addig bontjuk a csoportokat, amíg minden csoport tagjai ugyanazokba a csoportokba lépnek) vagy az **implikációs tábla**.

## A tervezés teljes menete

1. **Szöveges specifikáció** pontosítása: bemenetek, kimenetek, mi történjen minden esetben (reset, egyszerre érkező jelek!).
2. **Modell választása:** Moore vagy Mealy.
3. **Állapotgráf** felrajzolása – minden állapotból minden bemenetre legyen nyíl!
4. **Állapottábla**, majd **állapotminimalizálás**.
5. **Állapotkódolás** (bináris, Gray, one-hot).
6. **Flip-flop típus** választása (D, JK, T) és a **vezérlési tábla** szerinti gerjesztés.
7. **K-táblák**, egyszerűsítés: következőállapot-logika és kimeneti logika.
8. **Nem használt állapotok** ellenőrzése (önindulás, biztonságos visszatérés).
9. **Szimuláció** (program vagy HDL testbench) és **megvalósítás** (kapuk, FPGA).

A modern gyakorlatban a 6–7. lépést a **szintézisprogram** végzi: a tervező HDL-ben (VHDL, Verilog) írja le az állapotgépet, a program választ kódolást és egyszerűsít. A gondolkodásmód – állapotok, átmenetek, kimenetek – ugyanaz.

## Állapotgép szimulációja programmal

Egy állapottábla programban egy **szótár** (dictionary): (állapot, bemenet) → (következő állapot, kimenet). Így a tervet a megépítés előtt ki lehet próbálni.

```python run
# A "101" Moore-felismerő állapottáblája szótárként, és a futtatása
atmenet = {
    ("A", 0): "A", ("A", 1): "B",
    ("B", 0): "C", ("B", 1): "B",
    ("C", 0): "A", ("C", 1): "D",
    ("D", 0): "C", ("D", 1): "B",
}
kimenet = {"A": 0, "B": 0, "C": 0, "D": 1}   # Moore: a kimenet az állapothoz tartozik

allapot = "A"
for x in [1, 0, 1, 0, 1, 1, 0, 1]:
    allapot = atmenet[(allapot, x)]
    print(f"x={x} → {allapot}, y={kimenet[allapot]}")
```

## Összefoglalás

- Bináris: ⌈log₂ N⌉ flip-flop; Gray: 1 bit változik lépésenként; one-hot: N flip-flop, egyszerű logika (FPGA).
- Ekvivalens állapotok: azonos kimenet és ekvivalens következő állapotok → összevonhatók.
- A tervezés: specifikáció → gráf → tábla → minimalizálás → kódolás → gerjesztés → egyszerűsítés → ellenőrzés.

## A lecke feladata

```quiz required
? Hány flip-flop kell egy 6 állapotú géphez one-hot kódolással?
= 6

? És bináris kódolással?
= 3

? Egy 4 állapotú one-hot kódolású gépben S0 = 0001, S1 = 0010. Mi S2 kódja?
= 0100

? Miért kedvelt a one-hot kódolás az FPGA-kon?
- Mert ott kevés a flip-flop.
+ Mert sok a flip-flop, és a következőállapot-logika így egyszerű és gyors.
- Mert az FPGA csak egy bitet tud tárolni.
- Mert így nincs szükség órajelre.

? Mikor ekvivalens két állapot?
- Ha ugyanannyi nyíl indul ki belőlük.
- Ha a kódjuk csak egy bitben tér el.
+ Ha a kimenetük azonos, és minden bemenetre ekvivalens állapotokba lépnek.
- Ha mindkettő kezdőállapot.

? A leckebeli minimalizálási példában melyik két állapot vonható össze?
- S0 és S3
+ S1 és S2
- S0 és S1
- S2 és S3
```
