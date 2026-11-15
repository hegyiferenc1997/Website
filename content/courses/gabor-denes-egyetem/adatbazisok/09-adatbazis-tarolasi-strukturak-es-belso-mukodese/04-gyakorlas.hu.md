---
title: Gyakorlás – tárolás és belső működés
summary: Ellenőrző kérdések a lapokról, indexekről, a naplóról és az MVCC-ről, egy kis „méretbecslős” esettanulmány a webshop adatbázisán, és egy számolós feladatlap.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért lapokban (blokkokban) olvas a DBMS, és nem soronként?</summary>

Mert a lemezhez nyúlás drága, a nagy része „odamenési” idő. Ha már ott vagyunk, olcsó egy egész lapot (PostgreSQL-ben 8 KB) beolvasni – és jó eséllyel a szomszédos sorokra is szükség lesz.

</details>

<details>
<summary>2. Miért elég 3–4 szint egy B+-fában akár százmillió sorhoz is?</summary>

Mert egy csomópont egy teljes lap, így több száz kulcs és mutató fér bele. Az elágazási tényező (pl. 200) hatványai nagyon gyorsan nőnek: 200⁴ = 1,6 milliárd.

</details>

<details>
<summary>3. Miért gyors a COMMIT, ha a módosított lapokat nem írjuk ki azonnal?</summary>

Mert a `COMMIT`-hoz csak a WAL-t kell lemezre írni, azt pedig a napló végére, sorban írjuk. A szétszórt lapok később, egyben kerülnek ki. Összeomlás esetén a naplóból minden helyreállítható.

</details>

<details>
<summary>4. Hogyan tud egy hosszú riport következetes adatot látni, miközben mások folyamatosan módosítanak?</summary>

Az MVCC miatt: a riport egy pillanatképet lát, azokat a sorverziókat, amelyek az indulásakor már véglegesek voltak. A módosítások új verziókat hoznak létre, a régiek addig megmaradnak, amíg valaki láthatja őket.

</details>

<details>
<summary>5. Mikor választanál oszlopalapú tárolást?</summary>

Elemző (OLAP) terhelésnél: sok millió sor, de lekérdezésenként csak néhány oszlop (összegek, átlagok). Ilyenkor csak a szükséges oszlopokat kell beolvasni, és ezek jól tömöríthetők.

</details>

## Esettanulmány: mekkora a webshop?

Nézzük meg, hány lapot foglalnak a webshop táblái! A `pg_relation_size` bájtban adja meg a méretet, ezt osztjuk a lapmérettel (8192).

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
SELECT 'rendelesek' AS tabla, COUNT(*) AS sorok,
       pg_relation_size('rendelesek') / 8192 AS lapok
FROM rendelesek
UNION ALL
SELECT 'tetelek', COUNT(*), pg_relation_size('tetelek') / 8192 FROM tetelek;
```

Látod: egy lapra **száznál is több** rendelés fér. Ha egyetlen rendelést keresünk index nélkül, mindegyik lapot végig kell olvasni; az elsődleges kulcs B-fa indexével viszont csak néhányat. Hasonlítsd össze a két tervet:

```sql run
EXPLAIN SELECT * FROM rendelesek WHERE rendeles_id = 777;
```

```sql run
EXPLAIN SELECT * FROM rendelesek WHERE datum = '2025-05-05';
```

Az első `Index Scan` (B-fa az elsődleges kulcson), a második `Seq Scan` – a `datum` oszlopon nincs index.

## A gyakorlás feladata

```quiz required
? Egy tábla 2 000 000 soros, és egy lapra átlagosan 100 sor fér. Hány lapból áll?
= 20000
= 20 000
! 2 000 000 / 100.

? Egy B+-fa elágazási tényezője 50. Hány szint kell legalább 100 000 kulcshoz?
= 3
! 50² = 2500 kevés, 50³ = 125 000 elég.

? Egy lekérdezés 400 lapot kér, ebből 380 találat a pufferben. Hány lapot kell a lemezről beolvasni?
= 20
! A hiányokat: 400 − 380.

? Melyik állítás igaz a WAL-ra?
- a WAL miatt minden módosított lapot azonnal ki kell írni
- a WAL csak a SELECT lekérdezéseket naplózza
+ a WAL-ból összeomlás után helyre lehet állítani a véglegesített tranzakciókat
- a WAL a replikációhoz nem használható
! A napló a tartósság (D) kulcsa.

? Egy tábla mérete hetek óta nő, pedig az élő sorok száma alig változott, és rengeteg UPDATE fut rajta. Mi a legvalószínűbb ok?
- a TOAST tömöríti az adatokat
+ a halott sorverziókat nem takarítja el a VACUUM
- a B+-fa túl alacsony
- a hash index összekeveri a sorrendet
! Ezt hívják felfúvódásnak (bloat).
```
