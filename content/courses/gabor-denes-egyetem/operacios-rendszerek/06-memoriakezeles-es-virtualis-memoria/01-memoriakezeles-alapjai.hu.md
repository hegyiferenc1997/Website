---
title: A memóriakezelés alapjai
summary: Logikai és fizikai cím, az MMU, báziscím és határregiszter, folytonos foglalás és töredezettség.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **logikai** (virtuális) és a **fizikai** cím között, és mit csinál az **MMU**,
- hogyan véd a **báziscím** és a **határregiszter**,
- hogyan működik a **folytonos foglalás** (first, best, worst fit), és mi a **töredezettség**.

## Logikai és fizikai cím

- A **logikai cím** az, amit a program „lát” és használ (pl. egy változó címe a C programban).
- A **fizikai cím** a valódi hely a RAM-chipekben.

A kettő közötti fordítást a processzorba épített **MMU** (_Memory Management Unit_) végzi **minden egyes** memória-hozzáférésnél, hardveresen, villámgyorsan. Így minden folyamat azt hiheti, hogy a memória a 0. címtől kezdődik, és csak az övé.

## Báziscím és határregiszter

A legegyszerűbb megoldás két regiszter:

- **bázisregiszter**: hol kezdődik a folyamat a fizikai memóriában,
- **határregiszter** (_limit_): mekkora a folyamat területe.

```text
logikai cím ──► [ cím < határ ? ] ── nem ──► hiba (trap az OS-nek)
                      │ igen
                      ▼
                 cím + bázis ──► fizikai cím
```

Példa: bázis = 30 000, határ = 12 000.

- A 500-as logikai cím → **30 500** fizikai cím.
- A 13 000-es logikai cím ≥ 12 000 → **védelmi hiba**: a folyamat nem nyúlhat ki a saját területéről.

## Folytonos foglalás

Ha minden folyamat **egy darabban** kap memóriát, a felszabadulások után **lyukak** (szabad szakaszok) keletkeznek. Új kérésnél választani kell egy lyukat:

| Stratégia     | Melyik lyukat választja?               |
| ------------- | -------------------------------------- |
| **first fit** | az **első**, amelyik elég nagy         |
| **best fit**  | a **legkisebb**, amelyik még elég nagy |
| **worst fit** | a **legnagyobbat**                     |

Példa: a szabad lyukak sorban **100, 500, 200, 300, 600 KB**, a kérés **212 KB**.

- first fit → **500 KB** (az első elég nagy; marad 288 KB),
- best fit → **300 KB** (a legkisebb elég nagy; marad 88 KB),
- worst fit → **600 KB** (marad 388 KB).

## Töredezettség

- **Külső töredezettség**: összesen van elég szabad memória, de **szétszórva** kis lyukakban, így egy nagyobb kérés nem fér el. (A fenti példában 100 + 88 + … KB-os maradékok.) Megoldás lehet a **tömörítés** (a folyamatok összetolása), de az lassú.
- **Belső töredezettség**: a folyamat **több** memóriát kapott, mint amennyit használ (pl. 4 KB-os egységekben foglalunk, de csak 1 KB kell) – a felesleg a kiosztott területen **belül** vész el.

A külső töredezettségre a valódi megoldás a **lapozás** (következő lecke): a memória nem kell egy darabban legyen.

## Nézd meg a gyakorlatban

```bash
free -h                     # teljes, használt, szabad és gyorsítótárként használt memória
cat /proc/$$/maps | head    # a shelled címterének részei (kód, kupac, verem, könyvtárak)
```

## Összefoglalás

- A program logikai címeket használ, az MMU minden hozzáférésnél fizikaira fordítja.
- Báziscím + határregiszter: fizikai = logikai + bázis, ha a logikai < határ, különben védelmi hiba.
- Folytonos foglalás: first, best, worst fit; ennek gondja a külső töredezettség.
- Belső töredezettség: a kiosztott egységen belül kihasználatlan hely.

## A lecke feladata

```quiz required
? Melyik hardveregység fordítja a logikai címeket fizikai címekre?
= MMU
! Memory Management Unit, a processzorban.

? Bázis = 4000, határ = 1000. Mi a 250-es logikai cím fizikai címe?
= 4250
! 250 < 1000, tehát 250 + 4000 = 4250.

? Bázis = 4000, határ = 1000. Mi történik az 1200-as logikai címnél?
- A fizikai cím 5200 lesz.
- A fizikai cím 1200 lesz.
+ Védelmi hiba (trap): a cím kívül esik a folyamat területén.
- Az OS automatikusan megnöveli a határt.
! 1200 ≥ 1000, ezért az MMU hibát jelez.

? Lyukak sorban: 100, 500, 200, 300, 600 KB. Melyiket választja a best fit egy 212 KB-os kérésre? (KB-ban)
= 300
! A legkisebb, amelyik még elég nagy.

? Hogy hívják, amikor összesen van elég szabad memória, de szétszórva kis darabokban?
+ külső töredezettség
- belső töredezettség
- vergődés
- laphiba
! A belső töredezettség a kiosztott területen belüli pazarlás.
```
