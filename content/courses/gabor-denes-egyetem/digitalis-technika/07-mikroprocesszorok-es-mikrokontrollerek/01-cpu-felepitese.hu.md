---
title: A processzor felépítése
summary: A számítógép fő egységei, Neumann- és Harvard-architektúra, a CPU részei (ALU, regiszterek, vezérlőegység), cím-, adat- és vezérlőbusz, állapotjelzők.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- a számítógép **fő egységeit** és a **Neumann-elveket**,
- a **Neumann-** és a **Harvard-architektúra** különbségét,
- a processzor (CPU) részeit: **ALU**, **regiszterek**, **vezérlőegység**,
- a **cím-, adat- és vezérlőbusz** szerepét,
- az ALU **állapotjelzőit** (flag-ek).

## Minden, amit eddig tanultál, itt találkozik

A processzor nem más, mint **kombinációs hálózatok** (összeadó, multiplexer, dekóder) és **sorrendi hálózatok** (regiszterek, számlálók, állapotgép) összessége, amelyek egy **órajel** ütemére dolgoznak. Az eddigi témakörök építőkövei mind megtalálhatók benne.

## A számítógép fő egységei

- **CPU** (központi feldolgozóegység): utasítások végrehajtása.
- **Memória**: a program és az adatok tárolása.
- **Be- és kimeneti egységek** (I/O, perifériák): kapcsolat a külvilággal.
- **Buszrendszer**: az egységeket összekötő vezetékcsoportok.

**Neumann-elvek** (1945): a gép bináris, elektronikus, soros utasítás-végrehajtású, és a **program is a memóriában tárolódik** az adatokkal együtt (tárolt program elve) – így a gép programozható, nem kell átkábelezni.

## Neumann- és Harvard-architektúra

|          | **Neumann**                                                        | **Harvard**                                           |
| -------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| memória  | **közös** a programnak és az adatnak                               | **külön** programmemória és adatmemória               |
| busz     | egy busz → egyszerre vagy utasítást, vagy adatot olvas             | külön buszok → egyszerre olvashat utasítást és adatot |
| jellemző | egyszerűbb, rugalmasabb; szűk keresztmetszet: „Neumann-palacknyak” | gyorsabb                                              |
| példa    | klasszikus PC-k memóriamodellje                                    | mikrokontrollerek (AVR, PIC), DSP-k                   |

A mai PC-processzorok **módosított Harvard**-architektúrájúak: kívül közös memória, de belül külön utasítás- és adat-gyorsítótár (L1I, L1D).

## A CPU részei

### Aritmetikai-logikai egység (ALU)

Kombinációs hálózat, amely két operanduson végez műveletet: **összeadás, kivonás** (összeadó-kivonó, lásd 4. témakör), **ÉS, VAGY, XOR, NEM**, **léptetés**, összehasonlítás. Hogy melyiket, azt a vezérlőegység egy **műveleti kóddal** választja ki – ez lényegében egy nagy multiplexer a különböző műveletek eredményei előtt.

### Regiszterek

| regiszter                                  | szerepe                                            |
| ------------------------------------------ | -------------------------------------------------- |
| **PC** (program counter, utasításszámláló) | a **következő végrehajtandó utasítás címe**        |
| **IR** (instruction register)              | az éppen végrehajtott utasítás                     |
| **akkumulátor** / általános regiszterek    | operandusok és részeredmények                      |
| **SP** (stack pointer, veremmutató)        | a verem tetejének címe                             |
| **állapotregiszter** (flags, PSW)          | az utolsó ALU-művelet jellemzői                    |
| **MAR / MDR**                              | memóriacím- és memóriaadat-regiszter (a busz felé) |

### Vezérlőegység (CU)

Egy **állapotgép**, amely az IR-ben lévő utasítás alapján órajelről órajelre kiadja a vezérlőjeleket: melyik regiszter töltsön, mit csináljon az ALU, olvasson vagy írjon-e a memória. Lehet **huzalozott** (kapukból, gyors) vagy **mikroprogramozott** (a vezérlőjeleket egy belső ROM tárolja, rugalmas).

## Buszok

- **Címbusz** (address bus): a CPU adja ki, melyik memóriarekeszt vagy perifériát éri el – **egyirányú**. n címvezeték → 2<sup>n</sup> cím (16 bit → 64 KiB, 32 bit → 4 GiB).
- **Adatbusz** (data bus): az adat utazik rajta – **kétirányú** (olvasás és írás). Szélessége a processzor szóhosszával függ össze (8, 16, 32, 64 bit).
- **Vezérlőbusz** (control bus): olvasás/írás (RD̅, WR̅), órajel, reset, megszakításkérés, busz-engedélyezés stb.

A közös buszra csak **háromállapotú** (tri-state) kimenetek köthetők, hogy egyszerre csak egy eszköz hajtsa (10. témakör).

## Állapotjelzők (flag-ek)

| jelző | neve     | mikor 1                                                                 |
| ----- | -------- | ----------------------------------------------------------------------- |
| **Z** | zero     | az eredmény **nulla**                                                   |
| **C** | carry    | **átvitel** keletkezett a legfelső bitből (előjel nélküli túlcsordulás) |
| **N** | negative | az eredmény **legfelső bitje 1** (előjelesen negatív)                   |
| **V** | overflow | **előjeles túlcsordulás** (V = C<sub>n</sub> ⊕ C<sub>n−1</sub>)         |

A feltételes ugróutasítások (pl. „ugorj, ha nulla”) ezeket vizsgálják – így valósulnak meg az `if` és a ciklusok.

**Példa** – 8 bites ALU: 200 + 100 = 300, ami nem fér el 8 biten: az eredmény **300 − 256 = 44**, és **C = 1**.

```python run
# 8 bites ALU-összeadás állapotjelzőkkel
def alu_add(a, b):
    teljes = a + b
    eredmeny = teljes & 0xFF                       # csak az alsó 8 bit marad
    z = int(eredmeny == 0)
    c = int(teljes > 0xFF)
    n = eredmeny >> 7
    # előjeles túlcsordulás: két azonos előjelű operandus, eltérő előjelű eredmény
    v = int((a >> 7) == (b >> 7) and (a >> 7) != n)
    return eredmeny, dict(Z=z, C=c, N=n, V=v)

print("200 + 100 →", alu_add(200, 100))
print("100 +  50 →", alu_add(100, 50))
print("128 + 128 →", alu_add(128, 128))
```

## Összefoglalás

- A számítógép: CPU, memória, I/O, buszok; tárolt program elve.
- Neumann: közös program- és adatmemória; Harvard: külön (gyorsabb, mikrokontrollerek).
- CPU: ALU (kombinációs), regiszterek (PC, IR, SP, flags), vezérlőegység (állapotgép).
- Címbusz egyirányú, adatbusz kétirányú; flag-ek: Z, C, N, V.

## A lecke feladata

```quiz required
? Mit tárol az utasításszámláló (PC)?
- Az éppen végrehajtott utasítást.
+ A következő végrehajtandó utasítás címét.
- A verem tetejének címét.
- Az utolsó művelet eredményét.

? Mi jellemzi a Harvard-architektúrát?
- A program és az adat közös memóriában van.
+ Külön programmemória és adatmemória, külön buszokkal.
- Nincs benne ALU.
- Csak 8 bites lehet.

? Hány GiB memóriát címezhet egy 32 bites címbusz (bájtos címzésnél)?
= 4
! 2^32 bájt.

? Egy 8 bites ALU összeadja a 200-at és a 100-at. Mi lesz az eredményregiszter értéke (tízes számrendszerben)?
= 44
! 300 nem fér el 8 biten; a 256-os helyiérték a carry jelzőbe kerül.

? Mikor lesz 1 a Z (zero) jelzőbit?
- Ha átvitel keletkezett.
+ Ha a művelet eredménye nulla.
- Ha az eredmény negatív.
- Ha a processzor alvó állapotban van.

? Melyik busz kétirányú?
- a címbusz
+ az adatbusz
- egyik sem
- mindkettő mindig
```
