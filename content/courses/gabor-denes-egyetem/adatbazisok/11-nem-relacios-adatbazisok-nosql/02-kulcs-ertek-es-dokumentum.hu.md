---
title: Kulcs-érték és dokumentum-adatbázisok
summary: A kulcs-érték tárolók (Redis) működése és tipikus felhasználása, a dokumentum-adatbázisok (MongoDB) és a beágyazás vagy hivatkozás kérdése, valamint JSON-dokumentumok tárolása és lekérdezése PostgreSQL-ben (JSONB) – kipróbálva a böngészőben.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- hogyan működik egy **kulcs-érték** tároló, és mire jó,
- mi a **dokumentum-adatbázis**, és hogyan érdemes benne adatot szervezni,
- hogyan kérdezz le **JSON-dokumentumokat** SQL-ből (PostgreSQL JSONB).

## Kulcs-érték tárolók

A legegyszerűbb adatmodell: minden adat egy **kulcs** alatt tárolt **érték**, mint egy óriási szótár vagy egy ruhatár (sorszám → kabát). Az adatbázis nem „néz bele” az értékbe, csak a kulcs alapján ad vissza.

A legismertebb a **Redis**, amely az adatokat a **memóriában** tartja, ezért elképesztően gyors (egy kérés tipikusan kevesebb mint egy ezredmásodperc). Így néz ki használat közben:

```text
SET munkamenet:8f3a "{ felhasznalo: 42, kosar: [3, 8] }"   EX 1800
GET munkamenet:8f3a
INCR latogatok:2026-11-15
EXPIRE kosar:42 3600
```

- `SET kulcs érték` / `GET kulcs` – írás és olvasás,
- `EX 1800` / `EXPIRE` – az érték **lejár** 1800 másodperc (30 perc) múlva, és magától törlődik,
- `INCR` – egy számláló növelése egyetlen, oszthatatlan lépésben.

Tipikus felhasználás:

- **gyorsítótár** (_cache_): egy lassú lekérdezés eredményét pár percre eltesszük,
- **munkamenetek** (bejelentkezett felhasználók), **kosár**,
- **számlálók**, ranglisták, üzenetsorok.

Korlát: csak kulcs szerint tudsz keresni. „Add vissza az összes budapesti vásárlót” – ilyen kérdésre egy tiszta kulcs-érték tároló nem való.

## Dokumentum-adatbázisok

A dokumentum-adatbázis (pl. **MongoDB**) is kulcs szerint tárol, de az érték egy **strukturált dokumentum** (JSON vagy annak bináris változata), és a mezőire **kereshetsz** és **indexet** is tehetsz.

```json
{
  "_id": 1,
  "nev": "27 colos monitor",
  "ar": 69990,
  "kategoria": "monitor",
  "specifikacio": { "meret": 27, "felbontas": "2560x1440" },
  "cimkek": ["irodai", "gamer"]
}
```

A dokumentumokat **gyűjteményekbe** (_collection_) rendezzük – ez nagyjából a tábla megfelelője, de a dokumentumoknak nem kell azonos szerkezetűnek lenniük. A MongoDB-ben egy lekérdezés így néz ki:

```text
db.termekek.find({ cimkek: "gamer", ar: { $lt: 50000 } })
```

### Beágyazás vagy hivatkozás?

A dokumentum-adatbázisban a legfontosabb tervezési kérdés: egy rendelés tételeit **beágyazzuk** a rendelés dokumentumába, vagy külön gyűjteményben tároljuk és **hivatkozunk** rájuk?

| Beágyazás (_embedding_)                          | Hivatkozás (_referencing_)                                         |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| egy olvasással megvan minden (nincs JOIN)        | nincs ismétlődés, egy helyen módosítasz                            |
| jó, ha az adatot **mindig együtt** olvasod       | jó, ha az adatot **külön is** használod, vagy sokan hivatkoznak rá |
| pl. a rendelés tételei, egy blogbejegyzés címkéi | pl. a vásárló adatai, akinek sok rendelése van                     |

Az ökölszabály: **úgy tárold, ahogyan olvasni fogod.** Ez a relációs normalizálás (6. témakör) szöges ellentéte: ott az ismétlődés kerülése volt a cél, itt a gyors olvasás.

## JSON-dokumentumok PostgreSQL-ben

Nem kell feltétlenül külön rendszer a dokumentumokhoz: a PostgreSQL `JSONB` típusa egy oszlopban tárol tetszőleges JSON-dokumentumot, és kereshetővé, indexelhetővé teszi. Így egy rendszerben kapod a relációs biztonságot és a dokumentumok rugalmasságát.

<details>
<summary>A termékdokumentumok létrehozása (SQL)</summary>

```sql setup
-- Termékek JSON-dokumentumként: minden terméknek más-más tulajdonságai vannak.
CREATE TABLE termekek (
  id   INT PRIMARY KEY,
  adat JSONB NOT NULL
);
INSERT INTO termekek VALUES
  (1, '{"nev": "27 colos monitor", "ar": 69990, "kategoria": "monitor",
        "specifikacio": {"meret": 27, "felbontas": "2560x1440"}, "cimkek": ["irodai", "gamer"]}'),
  (2, '{"nev": "Vezeték nélküli egér", "ar": 4990, "kategoria": "periféria",
        "specifikacio": {"dpi": 1600}, "cimkek": ["irodai"]}'),
  (3, '{"nev": "Gamer egér", "ar": 14990, "kategoria": "periféria",
        "specifikacio": {"dpi": 16000}, "cimkek": ["gamer", "rgb"]}'),
  (4, '{"nev": "24 colos monitor", "ar": 44990, "kategoria": "monitor",
        "specifikacio": {"meret": 24, "felbontas": "1920x1080"}, "cimkek": ["irodai"]}'),
  (5, '{"nev": "Fejhallgató", "ar": 15990, "kategoria": "audió",
        "specifikacio": {"vezetek_nelkuli": true}, "cimkek": ["gamer"]}'),
  (6, '{"nev": "Mechanikus billentyűzet", "ar": 24990, "kategoria": "periféria",
        "specifikacio": {"kapcsolo": "barna"}, "cimkek": ["gamer", "rgb"]}');
```

</details>

```sql run
SELECT id, adat FROM termekek ORDER BY id;
```

A legfontosabb operátorok:

| Operátor | Jelentése                            | Példa                                |
| -------- | ------------------------------------ | ------------------------------------ |
| `->`     | mező kiolvasása **JSON-ként**        | `adat -> 'specifikacio'`             |
| `->>`    | mező kiolvasása **szövegként**       | `adat ->> 'nev'`                     |
| `#>>`    | mélyebb mező szövegként, útvonallal  | `adat #>> '{specifikacio,meret}'`    |
| `?`      | van-e ilyen kulcs (vagy tömbelem)    | `adat -> 'cimkek' ? 'rgb'`           |
| `@>`     | tartalmazza-e ezt a részdokumentumot | `adat @> '{"kategoria": "monitor"}'` |

```sql run
SELECT adat ->> 'nev' AS nev,
       (adat ->> 'ar')::INT AS ar,
       adat #>> '{specifikacio,meret}' AS meret
FROM termekek
WHERE adat @> '{"kategoria": "monitor"}'
ORDER BY ar;
```

Figyeld meg: a `->>` mindig **szöveget** ad, ezért az árat `::INT`-tel számmá alakítjuk – különben a rendezés szövegként történne („100” < „20”).

A tömböt sorokra is bonthatod, így például megszámolhatod, melyik címke hányszor fordul elő:

```sql run
SELECT cimke, COUNT(*) AS db
FROM termekek, jsonb_array_elements_text(adat -> 'cimkek') AS cimke
GROUP BY cimke
ORDER BY db DESC, cimke;
```

Sok dokumentumnál a keresést egy **GIN index** gyorsítja, amely a dokumentum minden kulcsát és értékét indexeli:

```sql
CREATE INDEX termekek_adat_gin ON termekek USING gin (adat);
```

## Összefoglalás

- Kulcs-érték (Redis): kulcs → érték, memóriában, nagyon gyors; gyorsítótár, munkamenet, számláló.
- Dokumentum (MongoDB): JSON-dokumentumok gyűjteményekben, mezőkre kereshető.
- Beágyazás vagy hivatkozás: úgy tárold, ahogyan olvasni fogod.
- PostgreSQL JSONB: `->`, `->>`, `@>`, `?`, `jsonb_array_elements_text`, GIN index.

## A lecke feladata

Kérdezd le a **`gamer` címkéjű** termékek **nevét** és **árát** (az árat **számként**), **ár szerint csökkenő** sorrendben.

Tipp: a címkére a `?` vagy a `@>` operátorral szűrhetsz.

```sql starter required
SELECT adat ->> 'nev' AS nev
FROM termekek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT adat ->> 'nev' AS nev,
       (adat ->> 'ar')::INT AS ar
FROM termekek
WHERE adat -> 'cimkek' ? 'gamer'
ORDER BY ar DESC;
```

</details>
