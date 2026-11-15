---
title: Adatmigráció
summary: Adatok átköltöztetése egyik rendszerből a másikba: leltár és leképezés, átalakítás és tisztítás (típusok, szóközök, kis- és nagybetűk, hiányzó értékek), ellenőrzés darabszámmal és ellenőrzőösszeggel, valamint az átállási stratégiák (egyszerre, fokozatosan, párhuzamos írással) – egy régi szövegfájl SQL-es betöltésén kipróbálva.
minutes: 30
---

## Amit ebben a leckében megtanulsz

- milyen **lépései** vannak egy adatmigrációnak,
- hogyan **alakítsd át** és **tisztítsd** a régi adatot SQL-lel,
- hogyan **ellenőrizd**, hogy semmi sem veszett el,
- milyen **átállási stratégiák** vannak.

## Mikor kell adatot migrálni?

- Egy régi rendszert (Excel-táblák, egy elavult program, egy régi adatbázis) újra cserélnek.
- Másik DBMS-re költözik a cég (pl. Oracle → PostgreSQL, 14. témakör).
- Két cég összeolvad, és egyesíteni kell az ügyféladatbázisukat.
- Felhőbe költözik az adatbázis.

Az adatmigráció **projektnek** számít, nem egy délutáni másolásnak: a régi adat szinte mindig **koszosabb**, mint gondolnád.

## A lépések

```text
 1. LELTÁR        Milyen adat van, hol, mekkora, ki használja?
 2. LEKÉPEZÉS     Melyik régi mező melyik új oszlopba kerül, milyen típussal?
 3. ÁTALAKÍTÁS    Formátumok, típusok, szétbontás, összevonás.
 4. TISZTÍTÁS     Szóközök, kis/nagybetű, duplikátumok, hiányzó és hibás értékek.
 5. BETÖLTÉS      Lehetőleg kötegekben, megismételhetően (szkripttel).
 6. ELLENŐRZÉS    Darabszámok, összegek, ellenőrzőösszegek, szúrópróbák.
 7. ÁTÁLLÁS       A felhasználók átkerülnek az új rendszerre.
```

Fontos: a migrációt egy **szkript** végezze, ne kézi másolgatás. Így a tesztkörnyezetben akárhányszor kipróbálhatod, és élesben pontosan ugyanaz fut le.

## Kipróbáljuk: egy régi exportfájl betöltése

Egy régi tanulmányi program pontosvesszővel elválasztott szövegsorokban adta ki a hallgatókat. Az adat tipikusan „koszos”: felesleges szóközök, kisbetűs Neptun-kód, hiányzó születési dátum, magyar dátumformátum.

<details>
<summary>A régi export és az új tábla létrehozása (SQL)</summary>

```sql setup
-- A régi rendszer exportja: egy sor = egy hallgató, pontosvesszővel elválasztva.
CREATE TABLE regi_export (sor TEXT);
INSERT INTO regi_export VALUES
  ('ABC123;Kiss Anna;2005.03.14;mérnökinformatikus'),
  (' bcd234 ;Nagy Béla;2006.07.02;mérnökinformatikus'),
  ('CDE345;  Tóth Cili ;2004.11.23;gazdaságinformatikus'),
  ('DEF456;Szabó Dani;;mérnökinformatikus'),
  ('efg567;Varga Emma;2006.01.30; gazdaságinformatikus');
-- Az új rendszer táblája, rendes típusokkal és megszorításokkal.
CREATE TABLE uj_hallgatok (
  neptun    CHAR(6) PRIMARY KEY,
  nev       VARCHAR(40) NOT NULL,
  szuletett DATE,
  szak      VARCHAR(30) NOT NULL
);
```

</details>

Nézzük meg a nyers adatot, és bontsuk mezőkre a `split_part(szöveg, elválasztó, hányadik)` függvénnyel:

```sql run
SELECT sor,
       split_part(sor, ';', 1) AS mezo1,
       split_part(sor, ';', 2) AS mezo2,
       split_part(sor, ';', 3) AS mezo3,
       split_part(sor, ';', 4) AS mezo4
FROM regi_export;
```

A tisztításhoz hasznos függvények:

| Függvény                   | Mire jó?                                   | Példa                                  |
| -------------------------- | ------------------------------------------ | -------------------------------------- |
| `TRIM(x)`                  | szóközök levágása az elejéről és a végéről | `TRIM('  Tóth Cili ')` → `'Tóth Cili'` |
| `UPPER(x)`, `LOWER(x)`     | egységes kis- vagy nagybetű                | `UPPER('bcd234')` → `'BCD234'`         |
| `NULLIF(x, '')`            | az üres szövegből NULL lesz                | `NULLIF('', '')` → `NULL`              |
| `to_date(x, 'YYYY.MM.DD')` | szövegből dátum, megadott formátummal      | `to_date('2005.03.14', 'YYYY.MM.DD')`  |
| `COALESCE(x, alap)`        | NULL helyett alapérték                     | `COALESCE(varos, 'ismeretlen')`        |

```sql run
SELECT UPPER(TRIM(split_part(sor, ';', 1)))                        AS neptun,
       TRIM(split_part(sor, ';', 2))                               AS nev,
       to_date(NULLIF(TRIM(split_part(sor, ';', 3)), ''), 'YYYY.MM.DD') AS szuletett
FROM regi_export;
```

## Ellenőrzés: elveszett-e valami?

Betöltés után **mindig** ellenőrizni kell:

- **darabszám**: ugyanannyi sor van-e a forrásban és a célban,
- **összegek**: pl. a számlák végösszege egyezik-e,
- **ellenőrzőösszeg**: az összes adatból képzett hash egyezik-e (a legkisebb eltérést is kimutatja),
- **szúrópróba**: néhány véletlen rekord kézi összevetése,
- **elutasított sorok**: amit nem lehetett betölteni, azt ne dobd el csendben – gyűjtsd egy hibatáblába, és nézd át!

```sql run
-- Ellenőrzőösszeg: az összes Neptun-kódból egy hash, rendezve (a sorrend ne számítson).
SELECT COUNT(*) AS sorok,
       md5(string_agg(UPPER(TRIM(split_part(sor, ';', 1))), ',' ORDER BY UPPER(TRIM(split_part(sor, ';', 1)))))
         AS ellenorzo_osszeg
FROM regi_export;
```

Ha a célban ugyanezt kiszámolod, és a két érték egyezik, biztos lehetsz benne, hogy minden kód átjött.

## Átállási stratégiák

| Stratégia                                    | Hogyan?                                                                             | Előny / hátrány                                          |
| -------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Egyszerre** (_big bang_)                   | egy hétvégén leáll a régi rendszer, migrálunk, hétfőn indul az új                   | egyszerű, de nagy a kockázat, és kell egy leállási ablak |
| **Fokozatosan** (_phased_)                   | részenként (pl. karonként, modulonként) költözünk                                   | kisebb kockázat, de egy ideig két rendszer él            |
| **Párhuzamos írás** (_dual write_) / **CDC** | egy ideig mindkét rendszer megkapja a változásokat (17/1. lecke), majd átkapcsolunk | szinte nulla leállás, de bonyolult                       |

Mindegyiknél legyen **visszaállási terv**: mi a teendő, ha az új rendszer élesben mégis hibázik? A régi rendszert és az adatait csak akkor kapcsold le végleg, ha az új már bizonyított.

## Összefoglalás

- Lépések: leltár → leképezés → átalakítás → tisztítás → betöltés → ellenőrzés → átállás.
- SQL-eszközök: `split_part`, `TRIM`, `UPPER`/`LOWER`, `NULLIF`, `to_date`, `COALESCE`.
- Ellenőrzés: darabszám, összegek, ellenőrzőösszeg, szúrópróba, hibatábla.
- Átállás: egyszerre, fokozatosan vagy párhuzamos írással – mindig visszaállási tervvel.

## A lecke feladata

Töltsd át a `regi_export` tábla sorait az `uj_hallgatok` táblába, **megtisztítva**:

- `neptun`: az 1. mező, szóközök nélkül, **nagybetűvel**,
- `nev`: a 2. mező, szóközök nélkül,
- `szuletett`: a 3. mező **dátumként** (`ÉÉÉÉ.HH.NN` formátum); ha üres, legyen `NULL`,
- `szak`: a 4. mező, szóközök nélkül.

A kiinduló kód csak megmutatja a nyers mezőket – írj helyette egy `INSERT INTO … SELECT …` utasítást. A gép az `uj_hallgatok` tábla tartalmát ellenőrzi.

```sql starter required
SELECT split_part(sor, ';', 1) AS neptun,
       split_part(sor, ';', 2) AS nev,
       split_part(sor, ';', 3) AS szuletett,
       split_part(sor, ';', 4) AS szak
FROM regi_export;
```

<details>
<summary>Megoldás</summary>

```sql solution
INSERT INTO uj_hallgatok (neptun, nev, szuletett, szak)
SELECT UPPER(TRIM(split_part(sor, ';', 1))),
       TRIM(split_part(sor, ';', 2)),
       to_date(NULLIF(TRIM(split_part(sor, ';', 3)), ''), 'YYYY.MM.DD'),
       TRIM(split_part(sor, ';', 4))
FROM regi_export;
```

</details>

```sql test
SELECT neptun, nev, szuletett, szak FROM uj_hallgatok ORDER BY neptun;
```
