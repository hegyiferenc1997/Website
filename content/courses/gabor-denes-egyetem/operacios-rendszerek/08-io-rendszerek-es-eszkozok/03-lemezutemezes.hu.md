---
title: Lemezütemezés
summary: Miért számít a kérések sorrendje egy merevlemeznél – FCFS, SSTF, SCAN és LOOK kiszámolt fejmozgással, és mi a helyzet SSD-n.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- miből áll egy **merevlemez-hozzáférés** ideje,
- hogyan működik az **FCFS**, az **SSTF**, a **SCAN** és a **LOOK** lemezütemezés,
- hogyan számolod ki a **fej összes elmozdulását**, és miért más a helyzet **SSD**-n.

## A hozzáférési idő

Egy HDD-n egy blokk beolvasása három részből áll:

1. **keresési idő** (_seek time_): a fej a megfelelő **sávra** (cilinderre) mozog – ez a legnagyobb, néhány ms;
2. **forgási késleltetés**: megvárjuk, míg a kért szektor a fej alá fordul (7200 fordulat/perc mellett átlagosan ~4,2 ms);
3. **átviteli idő**: az adat tényleges olvasása.

A keresési idő a fej **elmozdulásával** arányos, ezért érdemes a várakozó kéréseket **okos sorrendben** kiszolgálni.

## A példa

Cilinderek 0–199, a fej az **53.** cilinderen áll, a várakozó kérések érkezési sorrendben:

`98, 183, 37, 122, 14, 124, 65, 67`

### FCFS

Érkezési sorrendben: 53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67.

Elmozdulás: 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = **640 cilinder**. Igazságos, de sokat ugrál.

### SSTF – a legközelebbi előbb

_Shortest Seek Time First_: mindig a fejhez **legközelebbi** kérést szolgálja ki.

53 → 65 → 67 → 37 → 14 → 98 → 122 → 124 → 183

Elmozdulás: 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = **236 cilinder**.

Sokkal jobb, de a távoli kérések **kiéhezhetnek**, ha a fej közelébe folyamatosan új kérések érkeznek.

### SCAN – a lift

A fej az egyik irányba halad a **lemez széléig**, útközben mindent kiszolgál, majd megfordul (mint egy lift). Ha felfelé indul:

53 → 65 → 67 → 98 → 122 → 124 → 183 → **199** (szél) → 37 → 14

Elmozdulás: (199 − 53) + (199 − 14) = 146 + 185 = **331 cilinder**.

### LOOK

Mint a SCAN, de csak az **utolsó kérésig** megy, nem a lemez széléig:

53 → … → 183 → 37 → 14

Elmozdulás: (183 − 53) + (183 − 14) = 130 + 169 = **299 cilinder**.

A **C-SCAN** / **C-LOOK** változat csak egy irányban szolgál ki, a végén visszaugrik az elejére – így egyenletesebb a várakozási idő.

| Algoritmus | Elmozdulás a példában | Kiéheztetés? |
| ---------- | --------------------- | ------------ |
| FCFS       | 640                   | nincs        |
| SSTF       | 236                   | lehetséges   |
| SCAN (fel) | 331                   | nincs        |
| LOOK (fel) | 299                   | nincs        |

## SSD és a modern Linux

Az **SSD**-ben nincs mozgó fej, a hozzáférési idő **nem függ** a blokk helyétől – a fenti algoritmusoknak ott nincs értelme. A Linux többféle I/O-ütemezőt kínál: NVMe SSD-n gyakran `none`, SATA-n `mq-deadline`, asztali gépen `bfq` (igazságos sávszélesség-elosztás).

```bash
cat /sys/block/sda/queue/scheduler   # az aktív ütemező szögletes zárójelben, pl. [mq-deadline]
```

## Összefoglalás

- HDD-n a keresési idő a fej elmozdulásával arányos, ezért számít a kérések sorrendje.
- FCFS: igazságos, de sok mozgás; SSTF: kevés mozgás, de kiéheztethet; SCAN/LOOK: liftszerű, nincs kiéheztetés.
- SSD-n nincs fej, ott más szempontok (igazságosság, késleltetés) számítanak.

## A lecke feladata

Cilinderek 0–199, a fej az **50.** cilinderen áll. Kérések érkezési sorrendben: `82, 170, 43, 140, 24, 16, 190`.

```quiz required
? Mennyi a fej összes elmozdulása FCFS-sel (cilinder)?
= 642
! 32 + 88 + 127 + 97 + 116 + 8 + 174 = 642.

? Melyik kérést szolgálja ki elsőként az SSTF?
- 82
+ 43
- 24
- 16
! |50 − 43| = 7 a legkisebb távolság.

? Mennyi a fej összes elmozdulása SSTF-fel?
= 208
! 50 → 43 → 24 → 16 → 82 → 140 → 170 → 190: 7 + 19 + 8 + 66 + 58 + 30 + 20 = 208.

? Mennyi a fej összes elmozdulása LOOK-kal, ha a fej felfelé indul?
= 314
! (190 − 50) + (190 − 16) = 140 + 174 = 314.

? Miért nincs szükség ezekre az algoritmusokra SSD-n?
+ Mert nincs mozgó fej, a hozzáférési idő nem függ a blokk helyétől.
- Mert az SSD-n nincsenek blokkok.
- Mert az SSD csak egy kérést fogad egyszerre.
- Mert az SSD mindig FCFS-t használ hardveresen.
! A sorrend az SSD-n alig befolyásolja a sebességet.
```
