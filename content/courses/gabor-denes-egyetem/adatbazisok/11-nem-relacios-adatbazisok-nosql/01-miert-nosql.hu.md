---
title: Miért NoSQL?
summary: Mire nem elég mindig a relációs modell, mit jelent a vízszintes skálázás és a rugalmas séma, a NoSQL adatbázisok négy fő családja, a CAP-tétel, valamint az ACID és a BASE szemlélet összevetése.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- milyen problémákra születtek a **NoSQL** adatbázisok,
- mi a különbség a **függőleges** és a **vízszintes skálázás** között,
- melyik a NoSQL **négy fő családja**,
- mit mond a **CAP-tétel**, és mi a különbség az **ACID** és a **BASE** között.

## Honnan jött a NoSQL?

A 2000-es években a Google, az Amazon és a Facebook olyan méretekkel találkozott, amelyekre a hagyományos relációs adatbázisokat nem tervezték: **milliárd** felhasználó, másodpercenként **milliónyi** kérés, adatközpontok szerte a világon. Új rendszereket építettek, és ezekből lett a **NoSQL** mozgalom.

A név ma inkább így értendő: **„Not only SQL”** – nem az SQL ellen szól, hanem azt mondja, hogy a relációs modell mellett más eszközök is léteznek. Sok NoSQL rendszernek ma már van SQL-szerű lekérdezőnyelve is.

## Függőleges és vízszintes skálázás

Ha az adatbázis nem bírja a terhelést, két út van:

```text
 Függőleges skálázás (scale up):        Vízszintes skálázás (scale out):
 egy szerver, de erősebb                 sok átlagos szerver együtt

     ┌────────┐                          ┌────┐ ┌────┐ ┌────┐ ┌────┐
     │        │                          │ A–F│ │ G–L│ │ M–R│ │ S–Z│
     │ NAGY   │                          └────┘ └────┘ └────┘ └────┘
     │ GÉP    │                          az adat szétosztva (sharding)
     └────────┘
```

- **Függőleges** (_scale up_): nagyobb processzor, több memória. Egyszerű, de van **felső határa**, és nagyon drága lesz.
- **Vízszintes** (_scale out_): több gép, az adat **szétosztva** közöttük (_sharding_, _partitioning_). Elvileg korlátlanul bővíthető – de a gépek közti összehangolás nehéz.

A relációs adatbázisok hagyományosan függőlegesen skálázódnak (a JOIN-ok és a tranzakciók több gépen nehezek). A legtöbb NoSQL rendszert **eleve vízszintes skálázásra** tervezték.

## Rugalmas séma

Relációs adatbázisban előbb meg kell tervezni a táblákat (séma), és minden sornak ugyanazok az oszlopai. Egy webshopban viszont a monitornak képátló és felbontás, a pólónak méret és szín, a könyvnek szerző és oldalszám a tulajdonsága. Sok NoSQL rendszer **séma nélküli** vagy **rugalmas sémájú**: minden rekord (dokumentum) más-más mezőket tartalmazhat.

> Figyelem: a „séma nélküli” nem azt jelenti, hogy nincs szerkezet – hanem hogy a szerkezetért **az alkalmazás** felel, nem az adatbázis. Ez szabadság, de felelősség is.

## A NoSQL négy fő családja

| Család               | Hogyan tárol?                                     | Példák                    | Tipikus feladat                         |
| -------------------- | ------------------------------------------------- | ------------------------- | --------------------------------------- |
| **Kulcs-érték**      | kulcs → bármilyen érték, mint egy óriási szótár   | Redis, DynamoDB           | gyorsítótár, munkamenetek, kosár        |
| **Dokumentum**       | kulcs → JSON-szerű dokumentum, mezőkre kereshető  | MongoDB, Couchbase        | termékkatalógus, tartalomkezelés        |
| **Oszlopcsalád**     | sorok, rugalmas oszlopokkal, partíciókra osztva   | Cassandra, HBase          | óriási írásterhelés, idősoros adatok    |
| **Gráf**             | csúcsok és élek                                   | Neo4j, Amazon Neptune     | közösségi háló, ajánlórendszer          |

A következő leckékben az első hármat nézzük meg, a gráfadatbázisokat a 12. témakörben.

## A CAP-tétel

Egy **elosztott** rendszerben (több gép, hálózattal összekötve) három jó tulajdonságot szeretnénk:

- **C – konzisztencia** (_Consistency_): minden olvasás a legfrissebb írást látja, bármelyik gépről olvasol.
- **A – rendelkezésre állás** (_Availability_): minden kérés választ kap.
- **P – partíciótűrés** (_Partition tolerance_): a rendszer akkor is működik, ha a hálózat kettészakad, és a gépek egy része nem éri el a többit.

A **CAP-tétel** szerint a hálózati szakadás (partíció) idején a **C és az A közül csak az egyik** tartható meg. Mivel hálózati hibák a valóságban mindig előfordulnak, a P-ről nem mondhatunk le, így a kérdés: **szakadáskor mit választunk?**

```text
          hálózati szakadás
  [gép 1] ───────/ /─────── [gép 2]
   x = 5                     x = 5
   írás: x = 7 ──► nem jut át

  Olvasás a gép 2-ről:
   CP: „Most nem tudok biztos választ adni” → hibát ad (konzisztens, de nem elérhető)
   AP: „x = 5” → válaszol, de lehet, hogy régi adattal (elérhető, de nem konzisztens)
```

- **CP** rendszer (pl. egy bankszámla): inkább ne válaszoljon, mint hogy rosszat mondjon.
- **AP** rendszer (pl. egy közösségi oldal lájkszámlálója): inkább válaszoljon egy kicsit régi adattal, mint hogy leálljon.

## ACID és BASE

A relációs adatbázisok **ACID** tranzakciókat ígérnek (8. témakör). Sok NoSQL rendszer – a teljesítmény és a rendelkezésre állás kedvéért – lazább elvet követ, a **BASE**-t:

- **B**asically **A**vailable – alapvetően elérhető,
- **S**oft state – az állapot átmenetileg változhat, amíg a gépek szinkronizálnak,
- **E**ventual consistency – **végül konzisztens**: ha nem jön új írás, rövid időn belül minden gép ugyanazt fogja mutatni.

> Hasonlat: egy hír terjedése a baráti társaságban. Nem tudja meg mindenki ugyanabban a pillanatban, de egy idő után mindenki ugyanazt tudja.

| Szempont     | ACID (relációs)                       | BASE (sok NoSQL)                          |
| ------------ | ------------------------------------- | ----------------------------------------- |
| Konzisztencia | azonnali, szigorú                     | végső (rövid késéssel)                    |
| Elsődleges cél | helyesség                            | elérhetőség és skálázhatóság              |
| Jó választás | pénzügy, készlet, foglalás            | hírfolyam, lájkok, naplók, ajánlások      |

Ma a határ elmosódik: a MongoDB is tud több dokumentumra kiterjedő ACID tranzakciót, a PostgreSQL pedig kiválóan kezel JSON-dokumentumokat (2. lecke).

## Összefoglalás

- NoSQL = „Not only SQL”: óriási méretekre, vízszintes skálázásra, rugalmas sémára született.
- Négy fő család: kulcs-érték, dokumentum, oszlopcsalád, gráf.
- CAP: hálózati szakadáskor a konzisztencia és a rendelkezésre állás közül csak az egyik tartható.
- ACID = szigorú, azonnali helyesség; BASE = elérhetőség és végső konzisztencia.

## A lecke feladata

```quiz required
? Egy webshop adatbázisa már nem bírja a terhelést, ezért a csapat három további szervert vesz, és szétosztja közöttük az adatokat. Milyen skálázás ez?
- függőleges
+ vízszintes
! Scale out: több gép, szétosztott adat.

? Melyik NoSQL családba tartozik a Redis?
+ kulcs-érték
- dokumentum
- oszlopcsalád
- gráf
! Kulcs → érték, mint egy óriási szótár.

? A CAP-tétel szerint hálózati szakadáskor melyik két tulajdonság közül kell választani?
- partíciótűrés és rendelkezésre állás
+ konzisztencia és rendelkezésre állás
- konzisztencia és partíciótűrés
- tartósság és atomosság
! A partíciótűrésről a valóságban nem mondhatunk le.

? Mit jelent a „végső konzisztencia” (eventual consistency)?
- az adatok sosem lesznek egyformák a gépeken
- minden írás azonnal minden gépen látszik
+ ha nem jön új írás, rövid időn belül minden gép ugyanazt mutatja
- az adat csak a rendszer leállításakor kerül lemezre
! A BASE „E” betűje.

? Melyik alkalmazáshoz illik leginkább egy AP (elérhetőséget előnyben részesítő) rendszer?
- banki átutalások
- repülőjegy-foglalás az utolsó helyre
+ egy közösségi oldal lájkszámlálója
- egyetemi jegybeírás
! Itt nem baj, ha egy-két másodpercig régi szám látszik.
```
