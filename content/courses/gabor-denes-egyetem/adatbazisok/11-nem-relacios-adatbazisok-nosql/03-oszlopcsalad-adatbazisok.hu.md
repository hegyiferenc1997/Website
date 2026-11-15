---
title: Oszlopcsalád-adatbázisok
summary: Hogyan tárolja az adatokat egy oszlopcsalád-adatbázis (Cassandra): partíciókulcs és rendezési kulcs, lekérdezés-vezérelt modellezés és tudatos denormalizálás, replikáció és hangolható konzisztencia (kvórum).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan szervezi az adatokat egy **oszlopcsalád-adatbázis** (pl. Cassandra),
- mi a **partíciókulcs** és a **rendezési kulcs**,
- miért **a lekérdezésekből** indul ki a tervezés,
- hogyan működik a **replikáció** és a **kvórum**.

## Mi az az oszlopcsalád-adatbázis?

Az oszlopcsalád-adatbázisok (_wide-column store_) – például az **Apache Cassandra**, a **ScyllaDB** vagy a **HBase** – első ránézésre táblákat használnak, sorokkal és oszlopokkal, de a működésük nagyon más:

- az adat **partíciókra** oszlik, és minden partíció a fürt (_cluster_) valamelyik gépére kerül,
- egy partíción belül a sorok egy **rendezési kulcs** szerint sorban tárolódnak,
- az írás LSM-fába kerül (9. témakör), ezért **rendkívül gyors**,
- nincs JOIN, és csak korlátozottan lehet szűrni.

Tipikus felhasználás: **óriási írásterhelés** és **előre ismert lekérdezések** – üzenetek, érzékelőadatok, eseménynaplók, előzmények. A Discord például üzenetek milliárdjait tárolta így.

## Partíciókulcs és rendezési kulcs

A Cassandra lekérdezőnyelve, a **CQL**, nagyon hasonlít az SQL-re:

```text
CREATE TABLE uzenetek_csatornankent (
  csatorna_id  int,
  kuldve       timestamp,
  uzenet_id    uuid,
  szerzo       text,
  szoveg       text,
  PRIMARY KEY ((csatorna_id), kuldve, uzenet_id)
) WITH CLUSTERING ORDER BY (kuldve DESC);
```

Az elsődleges kulcs két részből áll:

- **Partíciókulcs** – `(csatorna_id)`: ez dönti el, **melyik gépre** kerül az adat. Egy csatorna minden üzenete egy partícióba, egy helyre kerül.
- **Rendezési kulcs** (_clustering key_) – `kuldve, uzenet_id`: a partíción belül ebben a **sorrendben** tárolódnak a sorok (itt a legújabb elöl).

```text
 gép A                          gép B                         gép C
 ┌──────────────────────┐       ┌──────────────────────┐      ┌───────────────┐
 │ csatorna 7:          │       │ csatorna 12:         │      │ csatorna 3:   │
 │  15:42 „Sziasztok!”  │       │  09:10 „Ki jön?”     │      │  …            │
 │  15:40 „Ki jön még?” │       │  09:05 „Én!”         │      │               │
 │  15:31 „Kész a…”     │       │  …                   │      │               │
 └──────────────────────┘       └──────────────────────┘      └───────────────┘
```

Ezért villámgyors ez a lekérdezés: egyetlen gép, egyetlen partíció, és a sorok már rendezve vannak:

```text
SELECT szerzo, szoveg FROM uzenetek_csatornankent
WHERE csatorna_id = 7 LIMIT 50;
```

Ez viszont **nem megy** (vagy csak nagyon lassan, kifejezett engedéllyel), mert minden gép minden partícióját át kellene nézni:

```text
SELECT * FROM uzenetek_csatornankent WHERE szerzo = 'anna';
```

## Lekérdezés-vezérelt modellezés

A relációs tervezésnél az **adatokból** indulunk ki (egyedek, kapcsolatok, normalizálás), és utána bármilyen lekérdezést megírhatunk. Az oszlopcsalád-adatbázisnál fordítva: először összeírjuk a **lekérdezéseket**, és **mindegyikhez külön táblát** tervezünk, amely pontosan azt szolgálja ki.

Ha az üzeneteket szerző szerint is le kell kérdezni, akkor kell egy második tábla is:

```text
CREATE TABLE uzenetek_szerzonkent (
  szerzo     text,
  kuldve     timestamp,
  uzenet_id  uuid,
  csatorna_id int,
  szoveg     text,
  PRIMARY KEY ((szerzo), kuldve, uzenet_id)
);
```

Ugyanaz az üzenet tehát **két táblában** is szerepel – ez **tudatos denormalizálás**. A tárhely olcsó, a gyors olvasás értékes. Az ár: íráskor mindkét táblába írni kell, és az alkalmazásnak kell figyelnie, hogy egyezzenek.

> Hasonlat: egy könyvtárban ugyanaz a könyvlista megvan szerző szerint és cím szerint rendezve is. Duplán van, de bármelyik kérdésre azonnal megtalálod a választ.

## Replikáció és kvórum

Minden partíció **több gépre** is felkerül; ez a **replikációs tényező** (pl. 3). Ha egy gép kiesik, a másik kettő kiszolgál.

A Cassandrában lekérdezésenként **hangolható**, hány másolat válaszát várjuk meg:

- `ONE`: egy gép válasza elég – leggyorsabb, de lehet, hogy régi adatot kapunk,
- `QUORUM`: a többség (3 másolatból **2**) – a középút,
- `ALL`: mindegyik – legbiztosabb, de ha egy gép kiesett, a kérés hibát ad.

Az aranyszabály: ha az **írásnál** és az **olvasásnál** megvárt gépek száma együtt **több, mint a másolatok száma** (W + R > N), az olvasás biztosan látja a legutóbbi írást, mert a két csoportnak van közös gépe. Például N = 3, írás `QUORUM` (2) és olvasás `QUORUM` (2): 2 + 2 = 4 > 3.

## Mikor válaszd, és mikor ne?

| Jó választás                             | Rossz választás                          |
| ---------------------------------------- | ---------------------------------------- |
| hatalmas, folyamatos írásterhelés        | kevés adat, egy szerver is bőven elég    |
| előre ismert, egyszerű lekérdezések      | sok ad hoc lekérdezés, JOIN-ok, riportok |
| több adatközpont, folyamatos elérhetőség | szigorú tranzakciók (pénzügy, készlet)   |

## Összefoglalás

- Oszlopcsalád (Cassandra): partíciókra osztott táblák, gyors írás, nincs JOIN.
- Partíciókulcs = melyik gépre; rendezési kulcs = milyen sorrendben a partíción belül.
- Lekérdezés-vezérelt tervezés: minden lekérdezéshez saját tábla, tudatos denormalizálás.
- Replikáció + hangolható konzisztencia: ha W + R > N, az olvasás látja a legutóbbi írást.

## A lecke feladata

```quiz required
? Mi dönti el egy Cassandra-táblában, hogy egy sor melyik gépre kerül?
+ a partíciókulcs
- a rendezési kulcs
- a sor beszúrásának ideje
- a tábla neve
! A partíciókulcsból számolja ki a helyét.

? Egy partíción belül milyen sorrendben tárolódnak a sorok?
- véletlenszerűen
- a beszúrás sorrendjében
+ a rendezési kulcs szerint
! Clustering key.

? Miért tárolják ugyanazt az üzenetet két táblában is (csatorna és szerző szerint)?
- hiba miatt, ezt kerülni kellene
+ mert minden lekérdezéshez saját tábla kell, ami pontosan azt szolgálja ki
- mert így kevesebb tárhely kell
- mert a Cassandra mindent automatikusan duplikál
! Tudatos denormalizálás a gyors olvasásért.

? A replikációs tényező 3. Hány gép válasza kell a QUORUM szinthez?
= 2
! A többség: 3-ból 2.

? Melyik feladatra a legkevésbé alkalmas egy oszlopcsalád-adatbázis?
- milliónyi érzékelő percenkénti mérési adatai
- egy csevegőalkalmazás üzenetei csatornánként
+ havi pénzügyi riportok sok tábla összekapcsolásával
- felhasználói tevékenységnapló
! JOIN-okra és ad hoc lekérdezésekre a relációs adatbázis való.
```
