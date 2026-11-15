---
title: HDD, SSD és RAID
summary: Hogyan működik a merevlemez és az SSD, mit jelent az IOPS, az átviteli sebesség és a késleltetés, miért kedvelik az adatbázisok az SSD-t, valamint a RAID-szintek (0, 1, 5, 6, 10): hibatűrés, teljesítmény és a hasznos kapacitás kiszámítása.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **merevlemez** (HDD) és az **SSD**,
- mit jelent az **IOPS**, az **átviteli sebesség** és a **késleltetés**,
- mi a **RAID**, és mik a leggyakoribb szintjei,
- hogyan számold ki egy RAID-tömb **hasznos kapacitását**.

## A merevlemez (HDD)

A merevlemezben mágneses lemezek forognak (tipikusan 7200 fordulat/perc), és egy karon mozgó **író-olvasó fej** keresi meg az adatot. Egy véletlenszerű olvasáshoz:

1. a fejnek a megfelelő sávhoz kell mozdulnia (**keresési idő**, kb. 4–9 ms),
2. meg kell várni, hogy a keresett szektor alá forduljon (**forgási késleltetés**, átlagosan kb. 4 ms).

> Hasonlat: mint egy lemezjátszó, ahol a tűt minden dalhoz át kell tenni a megfelelő barázdára. Ha egy album dalait sorban hallgatod, gyors – ha össze-vissza ugrálsz, a tű mozgatása viszi el az időt.

Ezért a HDD **sorban olvasva gyors** (több száz MB/s), de **véletlenszerű hozzáférésnél lassú** (kb. 100–200 művelet másodpercenként).

## Az SSD

Az SSD-ben nincs mozgó alkatrész: az adat **flash memóriacellákban** van, és elektronikusan érhető el. A véletlenszerű hozzáférés ezért **nagyságrendekkel gyorsabb**. Az **NVMe** SSD-k közvetlenül a PCIe buszra csatlakoznak, és még gyorsabbak.

Korlátai: drágább (GB-onként), és a cellák csak véges számú írást bírnak (ezt a vezérlő egyenletes elosztással, _wear leveling_-gel kezeli). Ezért a nagy, ritkán olvasott archívumok gyakran még ma is HDD-n vagy szalagon vannak.

## A teljesítmény három mérőszáma

| Mérőszám                    | Jelentése                                       | HDD (kb.)        | NVMe SSD (kb.)      |
| --------------------------- | ----------------------------------------------- | ---------------- | ------------------- |
| **IOPS**                    | véletlenszerű műveletek másodpercenként         | 100–200          | 100 000 – 1 000 000 |
| **Átviteli sebesség**       | sorban olvasott/írt adat másodpercenként        | 150–250 MB/s     | 3000–7000 MB/s      |
| **Késleltetés** (_latency_) | egyetlen művelet ideje                          | 5–10 ms          | 0,02–0,1 ms         |

Egy OLTP adatbázis (sok kis, véletlenszerű olvasás és írás: index-keresések, egy-egy sor módosítása) számára az **IOPS** és a **késleltetés** a legfontosabb – ezért fut ma szinte minden éles adatbázis SSD-n. Egy adattárház, amely hatalmas táblákat olvas végig, inkább az **átviteli sebességet** igényli.

## RAID – több lemez együtt

A **RAID** (_Redundant Array of Independent Disks_) több fizikai lemezt egyetlen logikai lemezzé fog össze, hogy

- **gyorsabb** legyen (párhuzamosan több lemezről olvas),
- és/vagy **hibatűrő** legyen (ha egy lemez meghibásodik, nem vész el az adat).

### RAID 0 – csíkozás (_striping_)

Az adatot darabokra vágja, és felváltva írja a lemezekre.

```text
  lemez 1: [A1] [A3] [A5]
  lemez 2: [A2] [A4] [A6]
```

- Gyors (két lemez párhuzamosan dolgozik), a teljes kapacitás használható.
- **Nincs hibatűrés**: ha bármelyik lemez meghal, **minden** adat elveszik. Éles adatbázishoz nem való!

### RAID 1 – tükrözés (_mirroring_)

Minden adat mindkét lemezre felkerül.

```text
  lemez 1: [A1] [A2] [A3]
  lemez 2: [A1] [A2] [A3]
```

- Egy lemez kiesését túléli, olvasásban gyorsabb is lehet.
- A kapacitás **fele** használható.

### RAID 5 – csíkozás paritással

Az adat csíkozva kerül a lemezekre, és minden csíkhoz egy **paritás** (ellenőrző összeg, XOR) is tartozik, amely lemezről lemezre vándorol. Ha egy lemez kiesik, a hiányzó adat a többiből és a paritásból **visszaszámolható**.

```text
  lemez 1: [A1] [B1] [Cp]
  lemez 2: [A2] [Bp] [C1]
  lemez 3: [Ap] [B2] [C2]      p = paritás
```

- Legalább 3 lemez kell; **egy** lemez kiesését bírja.
- Hasznos kapacitás: **(n − 1)** lemeznyi.
- Az írás lassabb (a paritást is frissíteni kell), és nagy lemezeknél az újraépítés órákig-napokig tart – közben egy második hiba végzetes.

### RAID 6 – dupla paritás

Mint a RAID 5, de **két** paritással: **két** lemez egyidejű kiesését is túléli. Hasznos kapacitás: **(n − 2)** lemeznyi, legalább 4 lemez kell.

### RAID 10 (1+0) – tükrözött párok csíkozva

A lemezeket párokba tükrözi (RAID 1), és a párok között csíkoz (RAID 0).

- Gyors írás és olvasás, jó hibatűrés (páronként egy lemez kieshet).
- A kapacitás **fele** használható, legalább 4 lemez kell.
- **Adatbázisokhoz** gyakran ez az ajánlott szint, mert nincs paritásszámítás az írásnál.

### Összefoglaló táblázat (n lemez, egyenként C kapacitással)

| Szint    | Min. lemez | Hasznos kapacitás | Hány lemez eshet ki? | Jellemző                      |
| -------- | ---------- | ----------------- | -------------------- | ----------------------------- |
| RAID 0   | 2          | n × C             | 0                    | gyors, de veszélyes           |
| RAID 1   | 2          | C (a fele)        | 1                    | egyszerű, biztonságos         |
| RAID 5   | 3          | (n − 1) × C       | 1                    | jó kapacitás, lassabb írás    |
| RAID 6   | 4          | (n − 2) × C       | 2                    | nagy tömbökhöz                |
| RAID 10  | 4          | n × C / 2         | páronként 1          | adatbázisok kedvence          |

> Fontos: **a RAID nem mentés!** Ha valaki véletlenül töröl egy táblát, vagy egy zsarolóvírus titkosítja az adatokat, a RAID ezt hűségesen „tükrözi” minden lemezre. A RAID a lemezhiba ellen véd, a mentés az adatvesztés ellen (3. lecke).

## Összefoglalás

- HDD: mozgó fej, sorban gyors, véletlenszerűen lassú; SSD: nincs mozgó alkatrész, nagyon magas IOPS.
- OLTP-nél az IOPS és a késleltetés számít, adattárháznál az átviteli sebesség.
- RAID 0 gyors, de nincs hibatűrés; RAID 1 tükör; RAID 5/6 paritás; RAID 10 tükrözött párok csíkozva.
- A RAID nem helyettesíti a mentést.

## A lecke feladata

```quiz required
? Miért lassú a merevlemez véletlenszerű hozzáférésnél?
- mert a flash cellák elhasználódnak
+ mert az író-olvasó fejnek minden művelethez mozognia kell, és meg kell várni a lemez fordulását
- mert a merevlemez csak sorban tud írni
- mert a merevlemeznek nincs vezérlője
! Keresési idő + forgási késleltetés.

? Négy 2 TB-os lemezből RAID 5 tömböt építünk. Hány TB a hasznos kapacitás?
= 6
! (n − 1) × C = 3 × 2 TB.

? Ugyanabból a négy 2 TB-os lemezből RAID 10 tömböt építünk. Hány TB a hasznos kapacitás?
= 4
! A kapacitás fele: 8 / 2.

? Melyik RAID-szint nem nyújt semmilyen hibatűrést?
+ RAID 0
- RAID 1
- RAID 5
- RAID 10
! Egy lemez kiesése = minden adat elveszik.

? Egy kolléga véletlenül kitörli a rendelések tábláját egy RAID 1 tömbön. Mi történik?
- a RAID automatikusan visszaállítja a tükörlemezről
+ a törlés mindkét lemezen megtörténik, ezért mentésből kell visszaállítani
- csak az egyik lemezről törlődik
! A RAID nem mentés: a hibás műveletet is hűségesen tükrözi.
```
