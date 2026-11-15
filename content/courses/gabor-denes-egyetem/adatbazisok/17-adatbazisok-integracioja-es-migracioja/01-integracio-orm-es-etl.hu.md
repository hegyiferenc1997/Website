---
title: Integráció – illesztőprogram, ORM és ETL
summary: Hogyan éri el egy alkalmazás az adatbázist (illesztőprogram, kapcsolati adatok, titkok kezelése), mi az ORM és mik az előnyei és csapdái, miért jobb egy API-réteg, mint ha minden rendszer közvetlenül a táblákhoz nyúlna, valamint az ETL, az ELT és a változáskövetés (CDC).
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan **kapcsolódik** egy program az adatbázishoz,
- mi az **ORM**, mikor segít és mikor árt,
- miért érdemes egy **API-réteget** tenni az adatbázis elé,
- mi az **ETL**, az **ELT** és a **változáskövetés** (CDC).

## Illesztőprogram és kapcsolati adatok

Egy program nem „beszél” közvetlenül SQL-t a hálózaton – ehhez egy **illesztőprogram** (_driver_) kell, amely ismeri az adatbázis protokollját. Minden nyelvhez van ilyen: Pythonban a `psycopg`, Node.js-ben a `pg`, Javában a JDBC-meghajtó, .NET-ben az `Npgsql`.

A kapcsolódáshoz szükséges adatokat gyakran egyetlen **kapcsolati karakterláncba** (_connection string_) foglalják:

```text
postgresql://webshop_app:********@db.pelda.hu:5432/webshop?sslmode=verify-full
            └─ felhasználó ─┘ └jelszó┘ └── szerver ──┘ └port┘ └ adatbázis ┘ └ TLS kötelező ┘
```

A biztonsági szabályok (10. és 15. témakör) itt is érvényesek:

- a jelszó **soha ne legyen a forráskódban** vagy a git-tárolóban – környezeti változóból vagy titokkezelőből jöjjön,
- a kapcsolat legyen **TLS**-sel titkosítva,
- az alkalmazás egy **saját, korlátozott jogú** szerepkörrel kapcsolódjon, ne szuperfelhasználóként,
- használj **kapcsolatkészletet** (16. témakör).

## ORM – objektum-relációs leképezés

A programozási nyelvekben **objektumokkal** dolgozunk (egy `Hallgato` osztály példányai), az adatbázisban **táblákkal és sorokkal**. Az **ORM** (_Object-Relational Mapper_) ezt a kettőt köti össze: a táblákat osztályokként, a sorokat objektumokként kezelheted, és az ORM állítja elő az SQL-t.

Ismert ORM-ek: **SQLAlchemy** és **Django ORM** (Python), **Prisma**, **Drizzle**, **TypeORM** (JavaScript/TypeScript), **Hibernate** (Java), **Entity Framework** (.NET).

```text
# ORM-mel (Python, SQLAlchemy-stílus):
hallgatok = session.query(Hallgato).filter(Hallgato.felev == 3).order_by(Hallgato.nev).all()

# Amit az ORM valójában küld (paraméterezve!):
SELECT neptun, nev, szak, felev FROM hallgatok WHERE felev = $1 ORDER BY nev
```

| Előnyök                                                               | Csapdák                                                                |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| kevesebb ismétlődő kód, kényelmes használat                           | elrejti az SQL-t: könnyű észrevétlenül lassú lekérdezést írni          |
| a lekérdezések **paraméterezettek** (véd az SQL-befecskendezés ellen) | az **N+1 probléma** (16. témakör) a „lusta betöltés” miatt             |
| típusellenőrzés, automatikus kiegészítés a szerkesztőben              | bonyolult riportokhoz, ablakfüggvényekhez gyakran mégis nyers SQL kell |
| gyakran **migrációkezelés** is jár vele (2. lecke)                    | ha nem érted, mi történik alatta, nehéz a hibakeresés                  |

> Tanács: használj nyugodtan ORM-et, de **tudj SQL-ül** – és időnként nézd meg, milyen lekérdezéseket gyárt (a legtöbb ORM naplózni tudja őket).

## API-réteg: ne mindenki nyúljon a táblákhoz

Ha egy cégnél a webshop, a raktárprogram, a könyvelés és a mobilalkalmazás **mind közvetlenül** ugyanabba az adatbázisba ír és olvas, abból hamar káosz lesz: egy oszlop átnevezése négy rendszert tör el, és senki sem tudja, ki mit módosít.

A jobb megoldás: az adatbázis elé egy **API-réteg** (pl. REST vagy GraphQL szolgáltatás) kerül, és a többi rendszer **csak ezen keresztül** éri el az adatokat.

```text
   [webshop]   [mobilapp]   [raktár]
        \           |          /
         ▼          ▼         ▼
       [ API-réteg: szabályok, jogosultság, naplózás ]
                    │
                    ▼
               [ adatbázis ]
```

- Az üzleti szabályok és a jogosultság-ellenőrzés **egy helyen** vannak.
- A belső séma változhat, amíg az API ugyanaz marad.
- A hozzáférés naplózható és korlátozható (pl. kérésszám-korlát).

## ETL, ELT és változáskövetés

Gyakran kell adatot mozgatni rendszerek között: például a működő (OLTP) adatbázisból egy elemző adattárházba (18. témakör).

- **ETL** (_Extract, Transform, Load_): **kinyerés** a forrásból → **átalakítás** egy köztes helyen (tisztítás, összevonás, típusok) → **betöltés** a célba.
- **ELT** (_Extract, Load, Transform_): a nyers adat előbb bekerül a célrendszerbe (pl. egy felhős adattárházba), és **ott** alakítják át SQL-lel – a mai, erős adattárházaknál ez gyakoribb.

Az ETL hagyományosan **kötegelt**: pl. minden éjjel átmásolja a napi adatokat. Ha frissebb adat kell, jön a **változáskövetés** (_CDC, Change Data Capture_): a forrásadatbázis naplójából (PostgreSQL-ben a WAL-ból, 9. témakör) folyamatosan kiolvassa a változásokat (beszúrás, módosítás, törlés), és szinte valós időben továbbítja őket – pl. a **Debezium** eszközzel egy **Kafka** üzenetsorba.

```text
  [ OLTP adatbázis ] ──WAL──► [ CDC: Debezium ] ──► [ Kafka ] ──► [ adattárház, kereső, gyorsítótár ]
```

## Összefoglalás

- Illesztőprogram + kapcsolati adatok; titok nem kerül a kódba, TLS, korlátozott szerepkör, kapcsolatkészlet.
- ORM: kényelmes és paraméterez, de figyelj az N+1-re, és tudj SQL-t.
- API-réteg: a többi rendszer nem nyúl közvetlenül a táblákhoz.
- ETL / ELT: adatmozgatás köteggel; CDC: változások folyamatos továbbítása a naplóból.

## A lecke feladata

```quiz required
? Hová kerüljön az adatbázis jelszava egy webalkalmazásban?
- a forráskódba, egy konstansba
- a git-tárolóba, egy README fájlba
+ környezeti változóba vagy titokkezelőbe
- a kapcsolati karakterláncba, a kód közepén
! A titok soha ne kerüljön a forráskódba vagy a verziókezelőbe.

? Mi az ORM egyik legnagyobb csapdája teljesítmény szempontjából?
+ a lusta betöltés miatt észrevétlenül N+1 lekérdezés keletkezhet
- nem tud paraméterezett lekérdezést küldeni
- csak SQLite-tal működik
- minden lekérdezést kétszer futtat le
! Egy lista minden eleméhez külön lekérdezés.

? Négy belső rendszer ír és olvas közvetlenül ugyanabba az adatbázisba. Mi a fő kockázata?
- túl gyors lesz az adatbázis
+ egy sémaváltozás több rendszert is eltörhet, és nehéz követni, ki mit módosít
- az adatbázis nem tud több kapcsolatot fogadni
- a mentések nem működnek
! Az API-réteg egy helyre gyűjti a szabályokat és a hozzáférést.

? Mi a különbség az ETL és az ELT között?
- az ETL csak NoSQL adatbázisokkal működik
+ az ETL a betöltés előtt alakítja át az adatot, az ELT a célrendszerben, a betöltés után
- az ELT nem tud adatot átalakítani
- nincs különbség, csak a név más
! Extract-Transform-Load vs. Extract-Load-Transform.

? Honnan olvassa ki egy PostgreSQL-alapú CDC-megoldás a változásokat?
- a táblák teljes, óránkénti végigolvasásával
+ az adatbázis naplójából (WAL)
- a felhasználók böngészőjéből
- a mentésekből
! A WAL minden változást sorrendben tartalmaz.
```
