---
title: B+-fa, hash index és LSM-fa
summary: Hogyan épül fel belül egy index: a B+-fa szintjei és miért elég 3–4 lépés milliónyi sorhoz, a hash index (csak egyenlőségre), valamint az írásra optimalizált LSM-fa, amelyet sok NoSQL rendszer használ.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan néz ki belülről a **B+-fa**, és miért olyan gyors,
- hogyan számold ki egy B+-fa **magasságát**,
- mire jó a **hash index**, és mire nem,
- mi az **LSM-fa**, és miért szeretik az írásigényes rendszerek.

## Ismétlés: mit csinál az index?

A 7. témakörben láttad: az index olyan, mint a könyv végén a tárgymutató – a kulcs mellett ott a „lapszám” (a sor fizikai címe, a `ctid`). Most azt nézzük meg, **hogyan van elrendezve** ez a tárgymutató, hogy a keresés pár lépés legyen.

## A B+-fa

A **B+-fa** egy kiegyensúlyozott, „széles és alacsony” fa. Minden csomópontja **egy lap** (8 KB), így egy csomópontba **sok száz kulcs** fér el.

```text
                       ┌───────────────┐
 gyökér                │   30  |  60   │
                       └──┬─────┬────┬─┘
             ┌────────────┘     │    └─────────────┐
       ┌─────┴─────┐      ┌─────┴─────┐      ┌─────┴─────┐
 belső │ 10  |  20 │      │ 40  |  50 │      │ 70  |  80 │
       └┬────┬────┬┘      └┬────┬────┬┘      └┬────┬────┬┘
        ▼    ▼    ▼        ▼    ▼    ▼        ▼    ▼    ▼
 levelek: [1..9]⇄[10..19]⇄[20..29]⇄[30..39]⇄ … ⇄[80..99]
          (kulcs → sor címe)       a levelek láncban, sorban
```

A legfontosabb tulajdonságai:

- **Kiegyensúlyozott**: a gyökértől minden levél ugyanolyan messze van, így minden keresés ugyanannyi lépés.
- **Az adatok csak a levelekben vannak** (kulcs → sor címe); a belső csomópontok csak „útjelző táblák”.
- **A levelek össze vannak láncolva**, sorrendben. Ezért gyors a **tartományos keresés** (`BETWEEN`, `>`, `<`) és a rendezés: megkeresed a kezdőpontot, aztán csak lépkedsz a láncon.
- Beszúráskor, ha egy csomópont megtelik, **kettéválik**, és a középső kulcs feljebb kerül. A fa így mindig kiegyensúlyozott marad, és **felfelé** nő.

> Hasonlat: egy nagy raktár. A bejáratnál (gyökér) tábla mutatja: „A–H: bal folyosó”. A folyosó végén újabb tábla: „A–C: 1. polc”. A polcon (levél) már ott a doboz. Pár tábla elolvasása után bármit megtalálsz.

## Milyen magas egy B+-fa?

Ha egy csomópontból **f** irányba lehet továbblépni (ez az **elágazási tényező**, _fan-out_), akkor:

| Szintek száma | Elérhető kulcsok (f = 200)  |
| ------------- | --------------------------- |
| 1             | 200                         |
| 2             | 200² = 40 000               |
| 3             | 200³ = 8 000 000            |
| 4             | 200⁴ = 1 600 000 000        |

Tehát **100 millió** sorhoz is elég **4 szint**, azaz 4 lapolvasás – és a felső szintek szinte mindig a memóriában vannak, így a valóságban gyakran csak 1–2 lemezolvasás kell. Index nélkül ez akár több százezer lap végigolvasása lenne!

Képlettel: a szintek száma ≈ a legkisebb olyan **h**, amelyre **fʰ ≥ N** (N a kulcsok száma).

## A hash index

A **hash index** egy hasítófüggvénnyel (_hash_) a kulcsból közvetlenül kiszámolja, melyik „vödörbe” (_bucket_) kell nézni – mint a ruhatár, ahol a sorszám alapján azonnal tudod, melyik fogason a kabát.

- **Előny**: egyenlőségre (`WHERE email = '…'`) átlagosan **egy lépés**.
- **Hátrány**: a hasítás összekeveri a sorrendet, ezért **tartományra és rendezésre nem használható** (`>`, `BETWEEN`, `ORDER BY`).

A gyakorlatban a B+-fa szinte mindig elég jó egyenlőségre is, ezért a PostgreSQL alapértelmezett indexe a B-fa (`CREATE INDEX` = B-fa). Hash indexet így kérhetsz:

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

```sql run
CREATE INDEX vasarlok_email_hash ON vasarlok USING hash (email);
EXPLAIN SELECT * FROM vasarlok WHERE email = 'vasarlo42@pelda.hu';
```

A tervben megjelenik a `vasarlok_email_hash` index. Most próbáld ki tartománnyal – a hash index itt nem segít:

```sql run
CREATE INDEX vasarlok_email_hash ON vasarlok USING hash (email);
EXPLAIN SELECT * FROM vasarlok WHERE email > 'vasarlo42@pelda.hu';
```

## Az LSM-fa – ha nagyon sok az írás

A B+-fa minden beszúrásnál a „helyére” írja a kulcsot, ami a lemezen sok **szétszórt** írással jár. Egy olyan rendszerben, ahová másodpercenként százezer esemény érkezik (naplók, érzékelők, üzenetek), ez szűk keresztmetszet.

Az **LSM-fa** (_Log-Structured Merge tree_) másképp gondolkodik:

```text
 írás ──► [ memória: rendezett tábla (memtable) ]
                     │ ha megtelt: egyben kiírja
                     ▼
 lemez:  [ kis fájl ] [ kis fájl ] [ kis fájl ]   ← 0. szint
                     │ háttérben összefésüli (compaction)
                     ▼
         [      nagyobb rendezett fájl      ]      ← 1. szint
         [            még nagyobb fájl            ]  ← 2. szint
```

1. Az írás először a **memóriába** kerül (és biztonság kedvéért egy naplóba).
2. Ha a memóriatábla megtelt, **egyben, sorban** kiíródik egy rendezett fájlba – a sorban írás a lemez kedvenc művelete.
3. A háttérben a rendszer a kis fájlokat nagyobbakká **fésüli össze** (_compaction_), a régi verziókat eldobja.

- **Előny**: nagyon gyors írás.
- **Hátrány**: az olvasásnál több fájlban is keresni kell (ezt Bloom-szűrők gyorsítják), és az összefésülés a háttérben erőforrást visz.

LSM-fát használ például a **Cassandra**, a **RocksDB**, a **LevelDB** és a **ScyllaDB** – erről bővebben a NoSQL témakörben (11.).

## B+-fa, hash vagy LSM?

| Szempont          | B+-fa                  | Hash index             | LSM-fa                    |
| ----------------- | ---------------------- | ---------------------- | ------------------------- |
| Egyenlőség        | gyors (pár lépés)      | nagyon gyors (~1 lépés) | jó                        |
| Tartomány, rendezés | gyors (láncolt levelek) | nem támogatja          | jó                        |
| Írás              | közepes                | közepes                | nagyon gyors              |
| Tipikus helye     | relációs DBMS-ek       | memóriabeli táblák     | írásigényes NoSQL rendszerek |

## Összefoglalás

- A B+-fa kiegyensúlyozott, széles és alacsony; adatok csak a levelekben, a levelek láncolva → tartományra is jó.
- Magasság: a legkisebb h, amelyre fʰ ≥ N; néhány szint százmilliós táblához is elég.
- A hash index csak egyenlőségre jó.
- Az LSM-fa memóriában gyűjt, sorban ír, a háttérben összefésül → írásra optimalizált.

## A lecke feladata

```quiz required
? Egy B+-fa elágazási tényezője 100. Hány szint kell legalább 1 000 000 kulcshoz?
= 3
! 100³ = 1 000 000.

? Ugyanebben a fában (f = 100) legfeljebb hány kulcs érhető el 2 szinttel?
= 10000
= 10 000
! 100².

? Miért gyors a B+-fában a `BETWEEN` típusú tartományos keresés?
- mert a fa minden csomópontja a memóriában van
+ mert a levelek sorrendben össze vannak láncolva
- mert a hash függvény sorba rendezi a kulcsokat
- mert a tartományt a gyökér tárolja
! Megkeresed a kezdőpontot, aztán végigsétálsz a láncon.

? Melyik lekérdezést NEM tudja kiszolgálni egy hash index?
- WHERE email = 'a@b.hu'
+ WHERE ar BETWEEN 1000 AND 5000
! A hasítás összekeveri a sorrendet.

? Melyik adatszerkezet illik leginkább egy másodpercenként százezer eseményt fogadó naplózó rendszerhez?
- hash index
- B+-fa
+ LSM-fa
! Memóriában gyűjt, és sorban, egyben ír a lemezre.
```
