---
title: Mélyebben – ugyanaz az adat három modellben
summary: Egy webshop rendelései relációs, dokumentum- és kulcs-érték modellben, hozzáférési minták alapján tervezve; beágyazás kontra hivatkozás számokkal; átalakítás relációsból JSON-ba és vissza (jsonb_build_object, jsonb_agg, jsonb_to_recordset); sémaellenőrzés JSON-ra; a gyorsítótár-minták és a végső konzisztencia idővonalon.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan néz ki **ugyanaz az adat** relációs, dokumentum- és kulcs-érték modellben,
- miért a **hozzáférési minták** („milyen kérdéseket teszünk fel?”) vezérlik a NoSQL-tervezést,
- mikor **ágyazz be** és mikor **hivatkozz** – számokkal alátámasztva,
- hogyan alakítasz **relációs adatot JSON-dokumentummá** és vissza SQL-lel,
- hogyan lehet egy rugalmas sémájú dokumentumot mégis **ellenőrizni**,
- hogyan működik a **gyorsítótár** és a **végső konzisztencia** a gyakorlatban.

## Az adat: egy rendelés

Kiss Anna 2025. március 1-jén rendelt egy egeret (1 db, 4990 Ft) és egy billentyűzetet (1 db, 24 990 Ft), budapesti szállítási címre.

### 1. Relációs modell – „tárolj mindent egyszer”

```text
vasarlok:  (1, 'Kiss Anna', 'anna@pelda.hu')
rendelesek: (1001, vasarlo_id=1, '2025-03-01', 'Budapest, Fő u. 1.')
tetelek:   (1001, termek_id=1, db=1, egysegar=4990)
           (1001, termek_id=2, db=1, egysegar=24990)
termekek:  (1, 'Egér', …), (2, 'Billentyűzet', …)
```

A rendelés négy táblában van szétszórva; a megjelenítéshez **JOIN** kell. Cserébe minden adat egyszer szerepel, és bármilyen kérdésre (pl. „melyik termék fogy a legjobban?”) könnyű válaszolni.

### 2. Dokumentummodell – „tárold úgy, ahogy olvasod”

```json
{
  "_id": 1001,
  "datum": "2025-03-01",
  "vasarlo": { "id": 1, "nev": "Kiss Anna" },
  "szallitasi_cim": "Budapest, Fő u. 1.",
  "tetelek": [
    { "termek": "Egér", "db": 1, "egysegar": 4990 },
    { "termek": "Billentyűzet", "db": 1, "egysegar": 24990 }
  ]
}
```

A rendelés oldal **egyetlen olvasással** megjeleníthető. Cserébe a vásárló neve minden rendelésében ott van (ha nevet vált, sok dokumentumot kell frissíteni – vagy elfogadjuk, hogy a régi rendelés a régi nevet mutatja, ami itt akár helyes is lehet).

### 3. Kulcs-érték modell – „egy kulcs, egy érték, villámgyorsan”

```text
rendeles:1001          → { …a teljes dokumentum… }
vasarlo:1:rendelesek   → [1001, 1017, 1042]
kosar:1                → { "egér": 1, "billentyűzet": 1 }      (lejár 24 óra múlva)
```

Csak **kulcs szerint** lehet keresni. A „mely rendelésekben szerepel egér?” kérdésre nincs válasz, hacsak nem tartunk fenn hozzá egy külön kulcsot. Cserébe a kiolvasás mikroszekundumos.

## A NoSQL-tervezés fordított gondolkodás

Relációs tervezésnél **az adatból** indulsz ki (milyen egyedek és kapcsolatok vannak?), és bízol benne, hogy SQL-lel bármit meg tudsz kérdezni. NoSQL-tervezésnél **a kérdésekből** (hozzáférési mintákból) indulsz ki:

1. Írd le a **leggyakoribb kérdéseket** (pl. „egy rendelés teljes adatai”, „egy vásárló utolsó 10 rendelése”).
2. Becsüld meg a **gyakoriságukat** és a **méretüket**.
3. Alakítsd úgy az adatot, hogy a leggyakoribb kérdés **egyetlen olvasás** legyen.

**Analógia:** a relációs adatbázis egy jól rendezett raktár, ahonnan bármit össze tudsz szedni. A dokumentum-adatbázis előre összekészített csomagok polca: ami a csomagban van, azt egy mozdulattal leveszed, de ha valami másra van szükséged, minden csomagot ki kell bontanod.

## Beágyazás vagy hivatkozás – számokkal

| Kérdés                          | Beágyazás felé billen                    | Hivatkozás felé billen                                |
| ------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| Hány „gyerek” elem lehet?       | kevés, korlátos (rendelés tételei: 1–50) | sok, korlátlan (egy termék értékelései: akár 100 000) |
| Együtt olvasod őket?            | szinte mindig                            | ritkán                                                |
| Változik-e a gyerek önállóan?   | nem (a tétel a rendeléssel együtt él)    | igen (a termék ára, leírása)                          |
| Megosztott más dokumentumokkal? | nem                                      | igen (ugyanaz a termék sok rendelésben)               |

**Számpélda:** a MongoDB-ben egy dokumentum legfeljebb **16 MB** lehet. Ha egy népszerű termék értékeléseit beágyaznánk, és egy értékelés átlagosan 500 bájt, akkor 16 MB / 500 B ≈ **32 000 értékelés** után a dokumentum nem bővíthető tovább. Ráadásul a termékoldal minden megnyitásakor az összes értékelést beolvasnánk. Ezért az értékelés **hivatkozott** külön gyűjtemény, a rendelés tételei viszont **beágyazottak**.

## Relációsból JSON és vissza – PostgreSQL-ben

A PostgreSQL mindkét világot érti: relációs táblákból JSON-dokumentumot építhetsz (pl. egy webes API válaszához), és JSON-ból táblát (pl. egy beérkező fájl feldolgozásához).

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

### Relációs → dokumentum

```sql run
-- Minden tárgy egy dokumentum, benne a jelentkezők listájával
SELECT jsonb_build_object(
         'kod', t.kod,
         'nev', t.nev,
         'jelentkezok', COALESCE(jsonb_agg(
             jsonb_build_object('neptun', j.neptun, 'jegy', j.jegy) ORDER BY j.neptun
           ) FILTER (WHERE j.neptun IS NOT NULL), '[]'::jsonb)
       ) AS dokumentum
FROM targyak t
LEFT JOIN jelentkezesek j ON j.kod = t.kod
GROUP BY t.kod, t.nev
ORDER BY t.kod;
```

- `jsonb_build_object(kulcs, érték, …)` – egy JSON-objektumot épít;
- `jsonb_agg(…)` – összesítő függvény: a csoport elemeiből JSON-tömböt készít (mint a `COUNT`, csak tömböt ad);
- a `FILTER` és a `COALESCE` gondoskodik róla, hogy a jelentkező nélküli tárgy üres tömböt kapjon, ne `[null]`-t.

### Dokumentum → relációs

```sql run
-- Egy beérkező JSON-rendelés tételeit sorokká bontjuk
SELECT t.*
FROM jsonb_to_recordset('[
  {"termek": "Egér", "db": 1, "egysegar": 4990},
  {"termek": "Billentyűzet", "db": 1, "egysegar": 24990},
  {"termek": "Egérpad", "db": 2, "egysegar": 2990}
]'::jsonb) AS t(termek TEXT, db INT, egysegar NUMERIC);
```

A `jsonb_to_recordset` megadott oszlopnevek és típusok szerint táblává alakítja a tömböt – utána már bármilyen SQL-t futtathatsz rajta (szűrés, összesítés, beszúrás egy valódi táblába).

## Rugalmas séma ≠ nincs séma

A „sémamentes” adatbázisban is van séma – csak nem az adatbázis, hanem **az alkalmazás** tartja számon. Ha egy dokumentumból hiányzik egy mező, vagy rossz típusú, az a program futásakor derül ki. Ezért a modern dokumentum-adatbázisok (és a PostgreSQL is) lehetővé teszik a **sémaellenőrzést**:

```sql run
CREATE TABLE rendeles_dok (
  id  INT PRIMARY KEY,
  dok JSONB NOT NULL,
  -- A dokumentumnak kötelező a "vasarlo" és a "tetelek" mező, és a tételek tömb legyen
  CHECK (dok ? 'vasarlo' AND jsonb_typeof(dok -> 'tetelek') = 'array')
);

INSERT INTO rendeles_dok VALUES
  (1, '{"vasarlo": "Kiss Anna", "tetelek": [{"termek": "Egér", "db": 1}]}');

SELECT id, dok ->> 'vasarlo' AS vasarlo, jsonb_array_length(dok -> 'tetelek') AS tetelszam
FROM rendeles_dok;
```

Próbáld ki: a Szerkesztés gombbal szúrj be egy dokumentumot `"tetelek"` nélkül – a `CHECK` visszautasítja. Így a rugalmasság megmarad (bármilyen további mező jöhet), de a **lényeges szerkezet** garantált.

## Kulcs-érték tárolók a gyakorlatban: gyorsítótár-minták

A Redis-szerű tárolók leggyakoribb szerepe a **gyorsítótár** (cache) egy relációs adatbázis előtt.

**Cache-aside (félretett gyorsítótár) minta:**

```text
1. Az alkalmazás megnézi a gyorsítótárat: GET termek:42
2a. Ha ott van (találat): kész, nem kell az adatbázis.
2b. Ha nincs (hiány): lekérdezi az adatbázist,
    és elmenti a gyorsítótárba lejárati idővel: SET termek:42 … EX 300
3. Ha a termék változik: az adatbázisban módosítja, és törli a kulcsot: DEL termek:42
```

**Számpélda:** egy termékoldalt percenként 6000-en nyitnak meg, a termék adata 5 percenként változik. Gyorsítótár nélkül ez 6000 adatbázis-lekérdezés percenként; 5 perces lejárattal ötpercenként **egy** – a többi 29 999 a memóriából jön.

További tipikus minták: **számláló** (`INCR oldal:42:megtekintes`), **munkamenet** lejárattal, **ranglista** rendezett halmazzal, **sebességkorlát** (hány kérés jött egy IP-ről az utolsó percben).

## Végső konzisztencia egy idővonalon

Elosztott NoSQL-rendszerekben az adat több **replikán** van. Írás után a replikák nem azonnal, hanem **rövid késéssel** frissülnek (végső konzisztencia):

```text
idő   replika A (ide írunk)     replika B               olvasó felhasználó
 0    név := "Kiss Anna"        név = "Kiss Anna"
 1    név := "Nagy Anna"        név = "Kiss Anna"        olvas B-ről → "Kiss Anna" (elavult!)
 2                              ← szinkronizálás
 3    név = "Nagy Anna"         név = "Nagy Anna"        olvas B-ről → "Nagy Anna" ✔
```

Ez egy közösségi oldal „kedvelés” számlálójánál elfogadható (senkit nem zavar, ha egy másodpercig 99-et mutat 100 helyett), egy **bankszámla** egyenlegénél nem. Sok rendszer ezért **hangolható** konzisztenciát kínál: kritikus olvasásnál megvárja a többségi (kvórum) választ, máskor az első replikáét fogadja el.

A „saját írásod olvasása” (read-your-writes) garancia azt jelenti: **te** mindig látod a saját módosításodat (pl. mert az írás utáni olvasásod ugyanarra a replikára megy), még ha mások egy pillanatig a régit látják is.

## Összefoglalás

- **Relációs:** mindent egyszer tárolunk, JOIN-nal rakjuk össze; bármilyen kérdés megválaszolható.
- **Dokumentum:** úgy tároljuk, ahogy olvassuk; egy olvasás, de ismétlődés és kevésbé rugalmas lekérdezés.
- **Kulcs-érték:** csak kulcs szerint, cserébe villámgyors; tipikusan gyorsítótár, számláló, munkamenet.
- NoSQL-ben a **hozzáférési minták** vezérlik a tervezést; beágyazás kevés, együtt olvasott, saját életet nem élő elemekre.
- PostgreSQL: `jsonb_build_object`, `jsonb_agg` (relációs → JSON), `jsonb_to_recordset` (JSON → relációs), `CHECK` a JSON szerkezetére.
- **Végső konzisztencia:** a replikák késve frissülnek; kritikus adatnál erős konzisztencia kell.

## A lecke feladata

Készíts minden olyan hallgatóról, akinek van jelentkezése, egy **JSON-dokumentumot**: az eredményben legyen a `neptun` oszlop, és egy `dokumentum` oszlop, amely egy objektum a hallgató nevével (`"nev"`) és a felvett tárgyak kódjainak **ábécérendbe rendezett** tömbjével (`"targyak"`). Rendezd Neptun-kód szerint!

Például Kiss Annánál: `{"nev": "Kiss Anna", "targyak": ["ADB", "DIG", "PROG"]}`

Tipp: `jsonb_build_object` és `jsonb_agg(… ORDER BY …)`, a `GROUP BY`-ban a Neptun-kód és a név.

```sql starter required
SELECT h.neptun,
       jsonb_build_object('nev', h.nev) AS dokumentum
FROM hallgatok h
ORDER BY h.neptun;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT h.neptun,
       jsonb_build_object('nev', h.nev, 'targyak', jsonb_agg(j.kod ORDER BY j.kod)) AS dokumentum
FROM hallgatok h
JOIN jelentkezesek j ON j.neptun = h.neptun
GROUP BY h.neptun, h.nev
ORDER BY h.neptun;
```

</details>
