---
title: Puffer, napló és helyreállítás
summary: A pufferkezelő (buffer pool) és a lapcsere (LRU), az előre írt napló (WAL) és az ellenőrzőpont, az összeomlás utáni helyreállítás, valamint a többverziós konkurenciakezelés (MVCC) és a VACUUM.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- mi a **pufferkezelő**, és hogyan dönti el, melyik lap maradjon a memóriában,
- hogyan garantálja a DBMS a **tartósságot**, ha váratlanul elmegy az áram (**WAL**, **ellenőrzőpont**),
- hogyan tud egyszerre olvasni és írni sok felhasználó egymás zavarása nélkül (**MVCC**),
- miért kell takarítani (**VACUUM**).

## A pufferkezelő (buffer pool)

Az előző leckékből tudod: a lemez lassú, ezért a DBMS a lapokat a memóriában tartja. Ez a memóriaterület a **puffer** (_buffer pool_, PostgreSQL-ben _shared buffers_).

```text
 lekérdezés: „kell a 42. lap”
        │
        ▼
 ┌──────────── puffer (memória) ────────────┐
 │ [lap 7] [lap 42] [lap 3] [lap 99] [ ... ] │ ── benne van? → azonnal kész (találat)
 └───────────────────────────────────────────┘
        │ nincs benne (hiány)
        ▼
 lemezről beolvassa, és ha kell, kidob egy régi lapot
```

- **Találat** (_hit_): a lap már a memóriában van – nagyon gyors.
- **Hiány** (_miss_): be kell olvasni a lemezről – lassú.

Egy jól beállított adatbázisnál a kérések **99%-a felett** találat. Ha a puffer megtelt, valamelyik lapot ki kell dobni. A klasszikus szabály az **LRU** (_Least Recently Used_): azt dobja ki, amelyiket **a legrégebben** használták – mint amikor a polcról azt a könyvet viszed le a pincébe, amelyikhez a legrégebben nyúltál.

A módosított, de lemezre még ki nem írt lapot **piszkos lapnak** (_dirty page_) hívják. Ezt kidobás előtt ki kell írni.

## A probléma: mi van, ha elmegy az áram?

A módosítások először csak a memóriában lévő lapokon történnek. Ha a `COMMIT` után, de a lap kiírása előtt elmegy az áram, a memória tartalma elveszik. Pedig az ACID **D**-je (tartósság) azt ígéri: ami `COMMIT`-ot kapott, az megmarad!

Minden lapot azonnal kiírni lassú lenne (szétszórt írások). A megoldás a napló.

## Az előre írt napló (WAL)

A **WAL** (_Write-Ahead Log_, előre írt napló) szabálya egyszerű:

> Mielőtt egy módosított lap a lemezre kerülne, **előbb a módosítás leírását** kell a naplóba írni – és a `COMMIT` csak akkor kész, ha a napló a lemezen van.

```text
 1. UPDATE ...           → a puffer lapja módosul (piszkos lesz)
 2. a módosítás leírása  → bekerül a WAL-ba
 3. COMMIT               → a WAL lemezre íródik (sorban, gyorsan!) → „kész”
 4. később, ráérősen     → a piszkos lap is kiíródik a helyére
```

Miért gyorsabb ez? A napló végére **sorban** írunk – ez a lemez legkedvesebb művelete –, a szétszórt lapokat pedig ráérünk később, egyben kiírni.

> Hasonlat: a pincér nem rohan minden rendeléssel azonnal a konyhába, hanem felírja a noteszébe. Ha elejti a tálcát, a noteszből tudja, mit kell újra elkészíteni.

## Ellenőrzőpont és helyreállítás

Ha a napló végtelenül nőne, összeomlás után az egészet végig kellene játszani. Ezért a DBMS időnként **ellenőrzőpontot** (_checkpoint_) készít: kiírja az összes piszkos lapot, és feljegyzi: „eddig minden a lemezen van”.

Összeomlás utáni **helyreállításkor** (_recovery_):

1. megkeresi az utolsó ellenőrzőpontot,
2. onnantól **újrajátssza** (_redo_) a naplóban lévő módosításokat,
3. a `COMMIT` nélkül maradt tranzakciók hatását **nem érvényesíti** (ezek mintha meg sem történtek volna).

```text
 ──────[ellenőrzőpont]──────T1 COMMIT──────T2 (nincs COMMIT)──── ⚡ áramszünet
        innen újrajátszik:   T1 megmarad    T2 elvész
```

A WAL másra is jó: ebből készül a **replikáció** (a másodlagos szerver a naplót kapja meg és játssza le), és ebből lehet egy adott **időpontra visszaállni** (_point-in-time recovery_, 13. témakör).

## MVCC – többverziós konkurenciakezelés

Az 1. leckében láttad: módosításkor a sor **új helyre** került. Ennek oka az **MVCC** (_Multi-Version Concurrency Control_). A PostgreSQL módosításkor nem írja felül a sort, hanem **új verziót** készít, a régit pedig „lejártnak” jelöli. Minden sorverzió két rejtett mezőt kap:

- **xmin**: melyik tranzakció hozta létre,
- **xmax**: melyik tranzakció törölte vagy írta felül (0, ha még él).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

```sql run
SELECT xmin, xmax, ctid, neptun, nev, felev FROM hallgatok WHERE neptun = 'ABC123';
```

Most módosítsd a sort egy tranzakcióban, és nézd meg, melyik tranzakció azonosítója került az új verzióba:

```sql run
BEGIN;
SELECT txid_current() AS az_en_tranzakciom;
UPDATE hallgatok SET felev = 4 WHERE neptun = 'ABC123';
SELECT xmin, xmax, ctid, neptun, nev, felev FROM hallgatok WHERE neptun = 'ABC123';
COMMIT;
```

Az új verzió `xmin`-je a te tranzakciód azonosítója, és a `ctid` is megváltozott: ez egy új sorverzió.

Miért jó ez? Mert minden tranzakció egy **pillanatképet** (_snapshot_) lát: azokat a verziókat, amelyek az ő kezdetekor már véglegesek voltak. Így:

- **az olvasók nem várnak az írókra**, és az írók sem az olvasókra,
- egy hosszú riport végig ugyanazt a következetes állapotot látja, miközben mások írnak.

> Hasonlat: egy közös dokumentum verzióelőzményei. Amíg te a tegnapi változatot olvasod, más nyugodtan szerkesztheti a mait.

## VACUUM – takarítás

Az MVCC ára: a régi, „halott” sorverziók (_dead tuples_) helyet foglalnak. Ha senki sem láthatja már őket, a **VACUUM** felszabadítja a helyüket, hogy az új sorok oda kerülhessenek. A PostgreSQL-ben ezt automatikusan az **autovacuum** végzi a háttérben, és közben frissíti a statisztikákat is (`ANALYZE`), amelyekre az optimalizálónak szüksége van.

Ha a takarítás elmarad (pl. egy napokig nyitva hagyott tranzakció miatt), a tábla „felfúvódik” (_bloat_): egyre nagyobb és lassabb lesz, pedig nem lett benne több élő adat.

## Összefoglalás

- Puffer: a lapok memóriában tartása; találat gyors, hiány lassú; lapcsere pl. LRU szerint.
- WAL: előbb a napló kerül lemezre, utána a lap; a `COMMIT` a napló kiírásakor kész.
- Ellenőrzőpont: eddig minden a lemezen van; helyreállításkor innen játssza újra a naplót.
- MVCC: módosításkor új sorverzió (xmin, xmax); az olvasók és írók nem akadályozzák egymást.
- VACUUM: a halott sorverziók helyének felszabadítása.

## A lecke feladata

```quiz required
? Mit jelent a WAL szabálya?
- a lapokat azonnal, minden módosítás után ki kell írni
+ a módosítás leírását előbb a naplóba kell írni, és csak utána kerülhet a lap a lemezre
- a naplót csak hetente egyszer kell menteni
- a COMMIT után a naplót törölni kell
! Write-Ahead: a napló jár elöl.

? Egy pufferbe 1000 lapkérés érkezett, ebből 990 már a memóriában volt. Hány százalék a találati arány?
= 99
! 990 / 1000 = 0,99.

? Melyik lapot dobja ki az LRU stratégia, ha a puffer megtelt?
- amelyiket a leggyakrabban használták
+ amelyiket a legrégebben használták
- amelyik a legnagyobb
- véletlenszerűen egyet
! Least Recently Used.

? Összeomlás után mi történik azzal a tranzakcióval, amely nem jutott el a COMMIT-ig?
+ a hatása nem marad meg
- a helyreállítás automatikusan befejezi
- félig megmarad
! Az atomosság: vagy minden, vagy semmi.

? PostgreSQL-ben mi történik a régi sorverzióval egy UPDATE után?
- azonnal felülíródik
+ halott sorverzió lesz, amelyet később a VACUUM takarít el
- átkerül a naplóba, és onnan törlődik
! Amíg egy régebbi pillanatkép láthatja, meg kell maradnia.
```
