---
title: Kombinációs és szekvenciális hálózatok, absztrakciós szintek
summary: A digitális áramkörök két nagy csoportja, a rendszerek felépítése a tranzisztortól a processzorig, és a tárgy térképe.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- a **kombinációs** és a **szekvenciális** hálózat közti különbséget,
- a digitális rendszerek **absztrakciós szintjeit**,
- hogyan épül egymásra a tárgy 13 témaköre.

## A két nagy csoport

A digitális áramkörök két fő csoportra oszthatók:

1. **Kombinációs hálózat** – a kimenet **csak a bemenetek pillanatnyi értékétől** függ. Nincs memóriája: ugyanarra a bemenetre mindig ugyanazt adja.
   *Példák:* összeadó, dekóder, multiplexer, kódátalakító, 7 szegmenses kijelző meghajtója.
2. **Szekvenciális (sorrendi) hálózat** – a kimenet a bemenetektől **és az előző állapottól** is függ. Van **memóriája** (állapota).
   *Példák:* tároló (flip-flop), regiszter, számláló, állapotgép, processzor.

```text
 kombinációs:   bemenetek ──► [ logika ] ──► kimenetek

 szekvenciális: bemenetek ──► [ logika ] ──► kimenetek
                                 ▲    │
                                 └─[memória]◄┘   (visszacsatolás)
```

> A szekvenciális logika = **kombinációs logika + memória**. A gyakorlatban minden digitális készülék a kettő keveréke.

**Hétköznapi példa:** a lift hívógombja kombinációs (megnyomod → világít), de maga a lift szekvenciális: hogy merre indul, az attól is függ, **hol áll most** és merre ment eddig.

## Absztrakciós szintek

Egy modern processzorban több milliárd tranzisztor van. Ezt csak úgy lehet megtervezni, ha szinteket építünk egymásra, és minden szinten elrejtjük az alatta lévő részleteket.

| Szint                        | Építőelem                       | Ahol tanulod            |
| ---------------------------- | ------------------------------- | ----------------------- |
| fizika, eszközök             | tranzisztor (MOSFET)            | 12. témakör (VLSI)       |
| kapuk                        | NEM, ÉS, VAGY, NAND …           | 3. témakör               |
| kombinációs modulok          | összeadó, MUX, dekóder          | 4. témakör               |
| tárolók, regiszterek         | flip-flop, számláló, memória     | 4–5. témakör             |
| vezérlés                     | állapotgép                      | 6. témakör               |
| mikroarchitektúra            | ALU, regiszterbank, vezérlőegység | 7. témakör             |
| rendszer                     | processzor, busz, perifériák     | 7., 10., 12. témakör     |

A tervezés **fentről lefelé** (specifikációból kapukig), a megértés gyakran **lentről felfelé** halad. Ma a kapuszint alatti munkát nagyrészt **szintézisprogramok** végzik: a mérnök hardverleíró nyelven (VHDL, Verilog – 9. témakör) írja le a viselkedést.

## A tárgy térképe

1. Digitális rendszerek alapjai *(ez a témakör)*
2. Számrendszerek és kódolás – hogyan ábrázoljuk a számokat bitekkel
3. Logikai kapuk és Boole-algebra – a logika építőkockái
4. Kombinációs és szekvenciális logika – tervezés igazságtáblától kapcsolásig
5. Regiszterek, számlálók, memóriák
6. Állapotgépek és tervezési módszerek
7. Mikroprocesszorok és mikrokontrollerek
8. A/D és D/A átalakítók – kapcsolat az analóg világgal
9. FPGA és hardverleíró nyelvek
10. Buszrendszerek és interfészek
11. Tervezés, szimuláció és hibakeresés
12. VLSI és SoC technológiák
13. A digitális technika alkalmazásai az informatikában

## Összefoglalás

- Kombinációs: kimenet = f(bemenetek). Szekvenciális: kimenet = f(bemenetek, állapot).
- A szekvenciális hálózat kombinációs logikából és memóriából áll.
- Az összetett rendszereket absztrakciós szintekre bontva tervezzük.

## A lecke feladata

```quiz required
? Melyik **kombinációs** hálózat?
- számláló
- flip-flop
+ összeadó
- állapotgép
! Kombinációs: nincs memóriája, a kimenet csak a pillanatnyi bemenetektől függ.

? Melyik **szekvenciális** hálózat?
- multiplexer
+ regiszter
- 7 szegmenses dekóder
- komparátor
! A regiszter biteket tárol, tehát van memóriája.

? Mi kell egy kombinációs logikán felül ahhoz, hogy szekvenciális hálózat legyen belőle?
+ memória (tároló elem), visszacsatolással
- több bemenet
- nagyobb tápfeszültség
- XOR kapu
! A szekvenciális logika = kombinációs logika + memória.

? Egy közlekedési lámpa vezérlője a pirosról mindig a piros-sárgára vált, a zöldről a sárgára. Milyen hálózat ez?
- kombinációs
+ szekvenciális
! Ugyanarra a „váltás” eseményre más-más kimenetet ad – attól függően, hol tart éppen.
```
