---
title: Mélyebben – számoljunk lapokban: mennyibe kerül egy lekérdezés?
summary: Az I/O költségmodell lépésről lépésre – teljes táblaolvasás, indexes keresés, véletlen és soros olvasás, a „mikor veszít az index” határpont kiszámolása, a három összekapcsolási algoritmus (nested loop, hash join, merge join) költsége, külső rendezés, és a pufferhasználat megfigyelése EXPLAIN (ANALYZE, BUFFERS)-szel.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan **becsüld meg** egy lekérdezés költségét lapolvasásokban – ahogy az optimalizáló is teszi,
- miért számít, hogy **sorban** vagy **ugrálva** olvasunk,
- hogyan számold ki, **mikor lassabb** az index a teljes táblaolvasásnál,
- hogyan működik a három **összekapcsolási algoritmus**, és melyik mikor nyer,
- hogyan rendez a DBMS, ha az adat **nem fér el** a memóriában,
- hogyan nézheted meg a valódi **lapolvasásokat** PostgreSQL-ben.

Ez a lecke sok számolást tartalmaz – nem kell fejben tartanod a képleteket, a gondolatmenet a lényeg.

## Miért lapokban számolunk?

A DBMS nem sorokat, hanem **lapokat** (PostgreSQL-ben 8 KB-os blokkokat) olvas a lemezről. Egy lap beolvasása a memóriából (pufferből) nanoszekundumok, SSD-ről tized ezredmásodpercek, HDD-ről akár 5–10 ezredmásodperc. Ehhez képest a CPU-munka (egy sor feltételének kiértékelése) elhanyagolható. Ezért a költség első közelítése: **hány lapot kell beolvasni?**

**Analógia – könyvtári kölcsönzés:** nem az számít, hány mondatot olvasol el, hanem hány könyvet kell lehoznod a raktárból. Egy könyv lehozása a lassú rész.

### Alapadatok, amelyekkel számolunk

| Jelölés | Jelentés                                 | Példa             |
| ------- | ---------------------------------------- | ----------------- |
| N       | sorok száma                              | 1 000 000         |
| R       | sorok egy lapon                          | 50                |
| P = N/R | lapok száma                              | 20 000            |
| h       | a B+-fa magassága (szintek)              | 3                 |
| t_s     | egy lap **soros** olvasása (HDD)         | ≈ 0,1 ms          |
| t_r     | egy lap **véletlen** olvasása (HDD)      | ≈ 5 ms            |

A soros olvasás azért ennyivel gyorsabb, mert a HDD olvasófejének nem kell ugrálnia, és a DBMS egyszerre sok egymás utáni lapot kérhet. SSD-n a különbség kisebb (kb. 2–4-szeres), de ott is van.

## 1. Teljes táblaolvasás

Minden lapot sorban beolvasunk: **költség = P soros olvasás.**

Példa: 20 000 lap × 0,1 ms = **2 másodperc** (HDD-n). Független attól, hány sort keresünk – egyet vagy mindet.

## 2. Indexes keresés egy sorra

Lemegyünk a B+-fán a gyökértől a levélig (h lap), majd beolvassuk a sort tartalmazó lapot (1 lap): **költség = h + 1 véletlen olvasás.**

Példa: (3 + 1) × 5 ms = **20 ms**. Százszor gyorsabb a teljes olvasásnál. (Valójában még gyorsabb: a gyökér és a felső szint szinte mindig a pufferben van.)

## 3. Indexes keresés sok sorra – itt jön a csapda

Ha a feltétel **k** sort ad vissza, és ezek **különböző lapokon** vannak (a halomfájlban a sorok nincsenek az indexelt oszlop szerint rendezve), akkor: **költség ≈ h + k véletlen olvasás.**

| k (találat) | Indexes költség     | Teljes olvasás |
| ----------- | ------------------- | -------------- |
| 10          | 13 × 5 ms = 65 ms   | 2 s            |
| 100         | 103 × 5 ms ≈ 0,5 s  | 2 s            |
| 400         | 403 × 5 ms ≈ 2 s    | 2 s ← **határpont** |
| 5 000       | ≈ 25 s              | 2 s            |

**A határpont:** k · t_r ≈ P · t_s → k ≈ 20 000 × 0,1 / 5 = **400 sor**, ami az 1 000 000 sornak csupán **0,04%-a**! Ennél több találatnál a teljes táblaolvasás gyorsabb HDD-n. (SSD-n a határpont magasabb, néhány százalék – ezért ott az optimalizáló bátrabban választ indexet.)

Ezért van a PostgreSQL-ben **Bitmap Index Scan** is: előbb az indexből összegyűjti az összes érintett lap sorszámát, **sorba rendezi** őket, és utána sorrendben olvassa be a lapokat – a véletlen olvasásból részben soros lesz.

## 4. Az összekapcsolás három algoritmusa

Kapcsoljuk össze a `vasarlok` (V lap) és a `rendelesek` (R lap) táblát. A DBMS háromféle algoritmus közül választ.

### a) Nested loop (beágyazott ciklus)

```text
minden v sorra a vasarlok-ban:
    minden r sorra a rendelesek-ben:      ← ha van index: csak a megfelelőkre
        ha v.id = r.vasarlo_id: kiírja
```

- **Index nélkül:** minden külső sorra végigolvassa a belső táblát – katasztrofális nagy tábláknál.
- **Indexszel a belső táblán:** minden külső sorra egy gyors indexes keresés. **Kevés** külső sornál ez a legjobb (pl. „a 42-es vásárló rendelései”).

### b) Hash join

1. A **kisebb** táblából a memóriában egy hash-táblát épít (kulcs → sorok).
2. Végigolvassa a nagyobb táblát, és minden sorhoz a hash-táblában keresi a párt.

**Költség ≈ V + R** (mindkét táblát egyszer olvassa). Ez a nyerő, ha **nagy, rendezetlen** táblákat kell egészben összekapcsolni, és a kisebb elfér a memóriában.

**Analógia:** egy osztálybulin mindenkinek van egy sorszáma. Ahelyett, hogy minden vendéget minden más vendéggel összevetnél (nested loop), felírod a sorszámokat egy névtáblára (hash-tábla), és mindenki egy pillantással megtalálja a párját.

### c) Merge join (összefésülés)

1. Mindkét táblát **rendezi** a kulcs szerint (vagy már rendezett, pl. index miatt).
2. Mint a cipzár: két mutatóval egyszerre halad végig a két rendezett listán.

**Költség ≈ V + R + (a rendezések költsége).** Akkor nyer, ha az adatok **már rendezettek**, vagy az eredményt úgyis rendezni kell.

| Algoritmus   | Mikor nyer?                                          |
| ------------ | ---------------------------------------------------- |
| Nested loop  | kevés külső sor + index a belső táblán               |
| Hash join    | nagy táblák, egyenlőséges feltétel, rendezetlen adat |
| Merge join   | már rendezett bemenet, vagy rendezett kimenet kell   |

## 5. Rendezés, ha nem fér el a memóriában

Ha egy 10 GB-os táblát kell rendezni 1 GB memóriával, a DBMS **külső összefésülő rendezést** végez:

1. **Futamok:** 1 GB-os darabokat beolvas, a memóriában rendezi, és kiírja a lemezre → 10 rendezett futam.
2. **Összefésülés:** a 10 futamot egyszerre olvassa, mindig a legkisebb elemet írja ki (mint a cipzár, csak 10 ággal).

Minden adat kétszer megy át a lemezen (be–ki, majd be–ki): kb. **4 × P** lapművelet. Ezért gyorsít sokat, ha az index már rendezett sorrendet ad (előző témakör: `ORDER BY … LIMIT`). PostgreSQL-ben a `work_mem` beállítás szabja meg, mennyi memória jut egy rendezésre; ha kevés, az `EXPLAIN ANALYZE` kimenetében `external merge` jelenik meg.

## 6. Nézd meg élőben: EXPLAIN (ANALYZE, BUFFERS)

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
-- Hány lapból áll a tábla, és hány sor van benne? (az optimalizáló statisztikái)
ANALYZE rendelesek;
SELECT relname, relpages AS lapok, reltuples::BIGINT AS sorok,
       ROUND(reltuples / NULLIF(relpages, 0)) AS sor_per_lap
FROM pg_class
WHERE relname IN ('rendelesek', 'tetelek', 'vasarlok');
```

A `BUFFERS` opció megmutatja, hány lapot olvasott a lekérdezés: `shared hit` = a pufferből (memóriából), `read` = a „lemezről”.

```sql run
-- Teljes táblaolvasás: a rendelesek összes lapját érinti
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF)
SELECT COUNT(*) FROM rendelesek WHERE statusz = 'törölt';
```

```sql run
-- Indexes keresés: csak néhány lapot érint
EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, TIMING OFF)
SELECT * FROM rendelesek WHERE rendeles_id = 12345;
```

Hasonlítsd össze a két `Buffers:` sort! Az első a tábla összes lapját beolvassa, a második csak az index néhány lapját és egyetlen adatlapot.

```sql run
-- Összekapcsolás: melyik algoritmust választja az optimalizáló?
ANALYZE;
EXPLAIN (COSTS OFF)
SELECT v.varos, COUNT(*)
FROM rendelesek r JOIN vasarlok v ON v.vasarlo_id = r.vasarlo_id
GROUP BY v.varos;
```

Valószínűleg `Hash Join`-t látsz: két teljes táblát kell összekapcsolni, és a kisebbik (`vasarlok`) kényelmesen elfér a memóriában.

```sql run
-- Egyetlen vásárló rendelései: itt már a nested loop is szóba jöhet
ANALYZE;
EXPLAIN (COSTS OFF)
SELECT r.* FROM vasarlok v JOIN rendelesek r ON r.vasarlo_id = v.vasarlo_id
WHERE v.vasarlo_id = 42;
```

## Összefoglalás

- A költség első közelítése a **beolvasott lapok száma**; a véletlen olvasás sokkal drágább a sorosnál.
- **Teljes olvasás** = P soros olvasás; **indexes keresés** = h + k véletlen olvasás.
- A **határpont**, ahol az index veszít, meglepően alacsony lehet (HDD-n a sorok töredék százaléka) – ezért nem használja mindig az optimalizáló az indexet.
- **Nested loop** kevés külső sorra indexszel, **hash join** nagy rendezetlen táblákra, **merge join** rendezett bemenetre.
- A memóriába nem férő rendezés **külső összefésüléssel** megy, kb. 4 × P lapművelettel.
- `EXPLAIN (ANALYZE, BUFFERS)` megmutatja a valódi lapolvasásokat.

## A lecke feladata

Számolj! Egy táblában **2 000 000 sor** van, egy lapon **50 sor** fér el, a lapméret 8 KB.

```quiz required
? Hány lapból áll a tábla?
= 40000
= 40 000
! Lapok száma = sorok száma / sorok egy lapon = 2 000 000 / 50.

? A HDD soros olvasási sebessége 100 MB/s (most 1 MB = 1000 KB-tal számolj). Hány **másodperc** a teljes táblaolvasás?
= 3.2
= 3,2
! 40 000 lap × 8 KB = 320 000 KB = 320 MB; 320 MB / (100 MB/s) = ?

? Az elsődleges kulcs B+-fájának egy csomópontjából 400 felé lehet ágazni. Legalább hány szintes a fa, hogy 2 000 000 kulcs elférjen benne?
= 3
! 400² = 160 000 még kevés, 400³ = 64 000 000 már elég.

? Hány lapot kell beolvasni egyetlen sor megkereséséhez az elsődleges kulcs alapján (a fa szintjei + az adatlap)?
= 4
! A fa minden szintjén 1 lap (3), plusz a sort tartalmazó adatlap (1).

? Egy feltétel 1000 sort ad vissza, mindegyik más lapon. Egy véletlen lapolvasás 5 ms. Melyik a gyorsabb HDD-n?
- az indexes keresés (kb. 1000 × 5 ms)
+ a teljes táblaolvasás (kb. 3,2 s)
- pontosan ugyanannyi
! 1000 × 5 ms = 5 s, ami több, mint a 3,2 s-os teljes olvasás.

? Két nagy, rendezetlen táblát kell egészben összekapcsolni egyenlőséges feltétellel, a kisebbik elfér a memóriában. Melyik algoritmus a legvalószínűbb?
- nested loop index nélkül
+ hash join
- merge join előzetes rendezés nélkül
! A hash join mindkét táblát egyszer olvassa: a kisebből hash-táblát épít, a nagyobbat végigolvassa.
```
