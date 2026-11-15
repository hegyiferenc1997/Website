---
title: Gráf-adatbázisok
summary: Mi az a tulajdonsággráf (csúcsok, élek, címkék, tulajdonságok), hogyan kérdezünk le gráfot a Cypher nyelvvel, miért gyorsabb a gráfbejárás sok JOIN-nál, és mire használják a gráf-adatbázisokat (közösségi háló, ajánlás, csalásfelderítés).
minutes: 22
---

## Amit ebben a leckében megtanulsz

- mi a **gráf**, és hogyan tárolja egy **gráf-adatbázis**,
- hogyan néz ki egy lekérdezés **Cypher** nyelven,
- mikor jobb a gráf a relációs tábláknál,
- milyen feladatokra használják a gyakorlatban.

## Mi az a gráf?

A matematikában a gráf **csúcsokból** (_node_, _vertex_) és őket összekötő **élekből** (_edge_, _relationship_) áll. A valóságban rengeteg dolog gráf:

- közösségi háló: emberek (csúcsok) és ismeretségek (élek),
- térkép: kereszteződések és utak,
- tanterv: tárgyak és előfeltételek,
- webshop: vásárlók, termékek és „megvette” kapcsolatok.

## A tulajdonsággráf modell

A legtöbb gráf-adatbázis (pl. **Neo4j**, **Amazon Neptune**, **Memgraph**) a **tulajdonsággráf** (_property graph_) modellt használja:

- a **csúcsoknak** van **címkéjük** (pl. `Hallgato`, `Targy`) és **tulajdonságaik** (pl. `nev: "Kiss Anna"`),
- az **éleknek** van **típusuk** és **irányuk** (pl. `FELVETTE`), és nekik is lehetnek tulajdonságaik (pl. `jegy: 5`).

```text
   (Hallgato {nev: "Kiss Anna"}) ──[:FELVETTE {jegy: 5}]──► (Targy {nev: "Adatbázisok"})
            │                                                        ▲
            │ [:ISMERI]                                              │ [:FELVETTE {jegy: 4}]
            ▼                                                        │
   (Hallgato {nev: "Nagy Béla"}) ────────────────────────────────────┘
```

A lényeg: a kapcsolat **első osztályú elem**. Relációs adatbázisban a kapcsolatot idegen kulcs és egy kapcsolótábla írja le, és lekérdezéskor JOIN-nal „számoljuk ki”. A gráf-adatbázisban az él **ténylegesen tárolva van**: minden csúcs „tudja”, hogy közvetlenül kikhez kapcsolódik.

## Lekérdezés Cypherrel

A **Cypher** a Neo4j lekérdezőnyelve (ebből lett a szabványos **GQL** is). A különlegessége, hogy a mintát szinte „lerajzolod” zárójelekkel és nyilakkal:

```text
// Kiket ismer Kiss Anna?
MATCH (a:Hallgato {nev: "Kiss Anna"})-[:ISMERI]->(b:Hallgato)
RETURN b.nev;

// Anna ismerőseinek ismerősei, akiket Anna még nem ismer (ismerősajánló)
MATCH (a:Hallgato {nev: "Kiss Anna"})-[:ISMERI]->()-[:ISMERI]->(c:Hallgato)
WHERE NOT (a)-[:ISMERI]->(c) AND c <> a
RETURN DISTINCT c.nev;

// A legrövidebb ismeretségi lánc két ember között
MATCH p = shortestPath((a:Hallgato {nev: "Kiss Anna"})-[:ISMERI*]-(z:Hallgato {nev: "Varga Emma"}))
RETURN p;
```

- `( )` = csúcs, `-[ ]->` = irányított él,
- `[:ISMERI*]` = tetszőleges hosszú ismeretségi lánc,
- `shortestPath` = legrövidebb út – ezt SQL-ben megírni elég fáradságos lenne!

## Miért gyorsabb a gráfbejárás?

Tegyük fel, hogy az „ismerősök ismerőseinek ismerőseit” keressük (3 lépés).

- **Relációs** adatbázisban ez háromszoros önösszekapcsolás az `ismeretsegek` táblán. Minden JOIN egy indexes keresés a **teljes** táblában, és a köztes eredmények mérete robbanásszerűen nő.
- **Gráf**-adatbázisban a bejárás csúcsról csúcsra **mutatókat követ**. Egy lépés költsége csak attól függ, hány szomszédja van az adott csúcsnak – nem attól, mekkora az egész adatbázis. Ezt hívják **index nélküli szomszédságnak** (_index-free adjacency_).

> Hasonlat: a relációs adatbázis olyan, mint ha minden ismerősödet a telefonkönyvben keresnéd ki. A gráf olyan, mintha mindenkinek a zsebében ott lenne a saját barátainak listája – csak oda kell menni és megkérdezni.

Ha viszont az a kérdés, hogy „mennyi volt a tavalyi összes bevétel?”, a gráfnak nincs előnye – ott a relációs (vagy oszlopalapú) tárolás a jobb.

## Mire használják?

| Terület                  | Példa kérdés                                                           |
| ------------------------ | ---------------------------------------------------------------------- |
| Közösségi háló           | Kiket ismerhet még Anna? Milyen közösségek alakultak ki?               |
| Ajánlórendszer           | Akik ezt megvették, mit vettek még?                                    |
| Csalásfelderítés         | Ugyanazt a telefonszámot és címet használja-e több „különböző” ügyfél? |
| Útvonaltervezés, hálózat | Mi a legrövidebb út? Ha ez a router kiesik, mi válik elérhetetlenné?   |
| Tudásgráf                | Hogyan kapcsolódnak a fogalmak, személyek, helyek egymáshoz?           |

## Összefoglalás

- Gráf = csúcsok + élek; tulajdonsággráf: címkék, típusok, tulajdonságok a csúcsokon és éleken is.
- A kapcsolat tárolt, első osztályú elem, nem JOIN-nal kiszámolt.
- Cypher: a mintát zárójelekkel és nyilakkal „rajzolod le”; változó hosszú utak, legrövidebb út.
- A gráf a sok lépéses kapcsolatkeresésben erős; összesítő riportokban nem.

## A lecke feladata

```quiz required
? Mi felel meg egy gráf-adatbázisban egy relációs kapcsolótábla egy sorának (pl. „Anna felvette az Adatbázisok tárgyat”)?
- egy csúcs
+ egy él
- egy címke
- egy index
! A kapcsolat maga az él, akár tulajdonságokkal (pl. jegy).

? Mit jelent a Cypher-mintában a `-[:ISMERI]->` rész?
- egy ISMERI címkéjű csúcsot
+ egy ISMERI típusú, irányított élt
- egy ISMERI nevű táblát
- egy tulajdonságot
! Nyíl = irányított él, a kettőspont után a típusa.

? Miért hatékony a gráfbejárás sok lépésnél?
+ mert egy lépés költsége csak az adott csúcs szomszédainak számától függ
- mert a gráf-adatbázis mindent a memóriában tart
- mert a gráf-adatbázisban nincsenek tulajdonságok
- mert a gráf-adatbázis minden lekérdezést előre kiszámol
! Index nélküli szomszédság: a csúcs mutatókkal éri el a szomszédait.

? Melyik kérdésre illik a legkevésbé egy gráf-adatbázis?
- Kik az ismerőseim ismerősei?
- Mi a legrövidebb út két város között?
+ Mennyi volt a tavalyi összes bevétel kategóriánként?
- Ugyanazt a bankkártyát használja-e több fiók?
! Ez tipikus összesítő riport, nincs benne kapcsolatbejárás.

? Egy közösségi hálóban Annának 3 ismerőse van, és mindegyik ismerősnek további 4 ismerőse (akik mind különbözők, és egyikük sem Anna vagy Anna ismerőse). Hány „ismerősök ismerőse” jelölt van?
= 12
! 3 × 4.
```
