---
title: Mélyebben – ugyanaz a feladat öt DBMS-ben
summary: Az SQL-nyelvjárások különbségei egymás mellett (lapozás, automatikus azonosító, szövegösszefűzés, NULL-csere, dátumok, logikai típus, UPSERT, kis- és nagybetűk), a szabványos alakok kipróbálása PostgreSQL-ben (FETCH FIRST, IDENTITY, MERGE), a hordozhatóság stratégiái, valamint egy rövid „mit nézz meg, ha DBMS-t váltasz” ellenőrzőlista.
minutes: 35
---

## Amit ebben a leckében megtanulsz

- hogy az „SQL” a gyakorlatban **nyelvjárásokat** jelent, és melyek a leggyakoribb eltérések,
- hogyan írod meg **ugyanazt** a lekérdezést PostgreSQL-ben, MySQL-ben, SQL Serverben, Oracle-ben és SQLite-ban,
- melyek a **szabványos** alakok, amelyek több rendszerben is működnek,
- hogyan tartsd **hordozhatóan** a kódodat,
- mire figyelj, ha egy alkalmazást **másik DBMS-re** költöztetsz.

## Miért nem egyforma az SQL mindenhol?

Az SQL-nek van nemzetközi szabványa (ISO/IEC 9075, legutóbb 2023-as kiadás), de a nagy rendszerek **előbb** valósítottak meg sok funkciót, mint ahogy a szabvány leírta volna – mindegyik a saját szintaxisával. Később a szabvány egy harmadik alakot írt elő, és a rendszerek azt is átvették (vagy nem).

**Analógia – a magyar nyelvjárások:** a „krumpli”, „burgonya”, „pityóka” és „kolompér” ugyanazt jelenti; mindenki érti a köznyelvi alakot, de otthon mindenki a sajátját használja. Az SQL-ben a szabványos alak a köznyelv.

## Az eltérések egy táblázatban

| Feladat                        | PostgreSQL                                       | MySQL / MariaDB             | SQL Server (T-SQL)                                    | Oracle                                       | SQLite                               |
| ------------------------------ | ------------------------------------------------ | --------------------------- | ----------------------------------------------------- | -------------------------------------------- | ------------------------------------ |
| első 10 sor                    | `LIMIT 10` vagy `FETCH FIRST 10 ROWS ONLY`       | `LIMIT 10`                  | `TOP 10` vagy `OFFSET 0 ROWS FETCH NEXT 10 ROWS ONLY` | `FETCH FIRST 10 ROWS ONLY` (régen: `ROWNUM`) | `LIMIT 10`                           |
| automatikus azonosító          | `GENERATED ALWAYS AS IDENTITY` (régen: `SERIAL`) | `AUTO_INCREMENT`            | `IDENTITY(1,1)`                                       | `GENERATED AS IDENTITY` (régen: sequence)    | `INTEGER PRIMARY KEY`                |
| szöveg összefűzése             | `a \|\| b`, `CONCAT(a, b)`                       | `CONCAT(a, b)`              | `a + b`, `CONCAT(a, b)`                               | `a \|\| b`, `CONCAT(a, b)`                   | `a \|\| b`                           |
| NULL helyett érték             | `COALESCE(x, 0)`                                 | `COALESCE`, `IFNULL(x, 0)`  | `COALESCE`, `ISNULL(x, 0)`                            | `COALESCE`, `NVL(x, 0)`                      | `COALESCE`, `IFNULL`                 |
| mai dátum                      | `CURRENT_DATE`                                   | `CURRENT_DATE`, `CURDATE()` | `CAST(GETDATE() AS DATE)`                             | `TRUNC(SYSDATE)`, `CURRENT_DATE`             | `DATE('now')`                        |
| logikai típus                  | `BOOLEAN`                                        | `BOOLEAN` (= `TINYINT(1)`)  | `BIT`                                                 | `BOOLEAN` (23c-től), régen `NUMBER(1)`       | nincs, 0/1 egész                     |
| beszúrás vagy frissítés        | `ON CONFLICT … DO UPDATE`, `MERGE`               | `ON DUPLICATE KEY UPDATE`   | `MERGE`                                               | `MERGE`                                      | `ON CONFLICT … DO UPDATE`            |
| azonosító idézése              | `"név"`                                          | `` `név` ``                 | `[név]` vagy `"név"`                                  | `"név"`                                      | `"név"`                              |
| szöveg-összehasonlítás alapból | kis/nagybetű-**érzékeny**                        | általában **nem érzékeny**  | általában **nem érzékeny**                            | **érzékeny**                                 | ASCII-n érzékeny (`=`), a `LIKE` nem |

Az „általában” szó azért szerepel, mert a viselkedést a **rendezési szabály** (collation) határozza meg, és ez adatbázisonként beállítható.

### A legalattomosabb különbség: a kis- és nagybetűk

Ugyanaz a lekérdezés, `WHERE nev = 'kiss anna'`, MySQL-ben alapbeállítással **megtalálja** Kiss Annát, PostgreSQL-ben **nem**. Ha egy alkalmazást MySQL-ről PostgreSQL-re költöztetsz, a bejelentkezés hirtelen „elromolhat”, mert az e-mail-címeket eddig kis- és nagybetűtől függetlenül hasonlította össze. Megoldás PostgreSQL-ben: `LOWER(email) = LOWER(?)` (kifejezés alapú indexszel), vagy a `citext` kiegészítő típus.

## A szabványos alakok kipróbálása

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

### Lapozás szabványosan

```sql run
-- Szabványos (ISO) lapozás: PostgreSQL, Oracle, SQL Server (ORDER BY-jal), DB2 is érti
SELECT nev, felev FROM hallgatok
ORDER BY felev DESC, nev
OFFSET 1 ROWS FETCH FIRST 3 ROWS ONLY;
```

### Automatikus azonosító szabványosan

```sql run
-- IDENTITY oszlop: a DBMS adja az értéket (PostgreSQL 10+, Oracle 12c+, DB2, SQL Server-ben IDENTITY(1,1))
CREATE TABLE uzenetek (
  id      INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  szoveg  VARCHAR(100) NOT NULL
);
INSERT INTO uzenetek (szoveg) VALUES ('Szia!'), ('Hogy vagy?'), ('Jól, köszi.');
SELECT * FROM uzenetek;
```

A `GENERATED ALWAYS` miatt kézzel nem is adhatsz meg `id`-t – így nem fordulhat elő, hogy valaki „belenyúl” a számlálóba és ütközést okoz.

### MERGE – a szabványos UPSERT

A `MERGE` a szabvány szerinti „szinkronizáló” utasítás: egy forrás sorait összeveti a céltáblával, és eldönti, melyiket kell módosítani, beszúrni vagy (ha kell) törölni. SQL Serverben és Oracle-ben régóta megvan, PostgreSQL-ben a 15-ös verziótól.

```sql run
-- Új jegyek érkeztek egy fájlból: ami már létezik, frissül, ami új, beszúródik
MERGE INTO jelentkezesek AS cel
USING (VALUES ('BCD234', 'MAT', 4), ('EFG567', 'PROG', 5)) AS forras(neptun, kod, jegy)
ON cel.neptun = forras.neptun AND cel.kod = forras.kod
WHEN MATCHED THEN
  UPDATE SET jegy = forras.jegy
WHEN NOT MATCHED THEN
  INSERT (neptun, kod, jegy) VALUES (forras.neptun, forras.kod, forras.jegy);

SELECT * FROM jelentkezesek WHERE neptun IN ('BCD234', 'EFG567') ORDER BY neptun, kod;
```

Béla MAT-jegye (eddig NULL) frissült 4-esre, Emma PROG-jelentkezése pedig új sorként került be.

### Ugyanaz a lekérdezés több nyelvjárásban

**Feladat:** a 3 legmagasabb félévű hallgató neve és egy „város – szak” leírás; ha nincs város, „?” álljon helyette.

```sql
-- SQL Server (T-SQL)
SELECT TOP 3 nev, ISNULL(varos, '?') + ' – ' + szak AS leiras
FROM hallgatok ORDER BY felev DESC, nev;

-- MySQL
SELECT nev, CONCAT(IFNULL(varos, '?'), ' – ', szak) AS leiras
FROM hallgatok ORDER BY felev DESC, nev LIMIT 3;

-- Oracle
SELECT nev, NVL(varos, '?') || ' – ' || szak AS leiras
FROM hallgatok ORDER BY felev DESC, nev FETCH FIRST 3 ROWS ONLY;
```

Ezek közül egyik sem fut változtatás nélkül a többin. A lecke feladatában te írod meg a **szabványos** változatot, amely PostgreSQL-ben (és jórészt Oracle-ben is) fut.

## Hordozhatósági stratégiák

1. **Szabványos SQL, ahol lehet:** `COALESCE` (nem `ISNULL`/`NVL`), `CASE` (nem `IF()`/`DECODE`), `FETCH FIRST` vagy legalább egy helyre gyűjtött lapozás, `CURRENT_DATE`.
2. **Absztrakciós réteg:** egy ORM vagy lekérdezésépítő (pl. Drizzle, Hibernate, Entity Framework) a dialektus-különbségek nagy részét elrejti (17. témakör). Ára: a különleges funkciókhoz (JSONB, ablakfüggvények) gyakran mégis nyers SQL kell.
3. **Tudatos „bezárkózás”:** sokszor jobb kihasználni egy rendszer erősségeit (PostgreSQL JSONB-je, Oracle particionálása), mint a legkisebb közös többszörösre szorítkozni. Egy DBMS-váltás ritka és nagy projekt – nem érdemes minden nap azért fizetni, hogy egyszer talán olcsóbb legyen.
4. **Tesztek:** ha több DBMS-t is támogatni kell, a tesztek fussanak mindegyiken.

## Ellenőrzőlista DBMS-váltáskor

- **Adattípusok:** van-e megfelelője minden típusnak (pl. MySQL `TINYINT(1)` → PostgreSQL `BOOLEAN`, Oracle `NUMBER` → `NUMERIC`/`BIGINT`)? Mi lesz a pontossággal és a karakterkészlettel?
- **Rendezési szabály:** kis-/nagybetű, ékezetek, rendezési sorrend (pl. a magyar „cs” betű helye).
- **NULL és üres szöveg:** Oracle-ben az üres szöveg `''` **NULL-nak** számít – máshol nem!
- **Automatikus azonosítók:** a számlálók folytatása a régi legnagyobb értéktől.
- **Tárolt eljárások, triggerek:** PL/SQL, T-SQL, PL/pgSQL – ezeket szinte mindig újra kell írni.
- **Tranzakciók és zárolás:** alapértelmezett elkülönítési szint (pl. MySQL InnoDB: REPEATABLE READ, PostgreSQL: READ COMMITTED).
- **Teljesítmény:** ugyanaz a lekérdezés más tervvel futhat – mérj!

## Összefoglalás

- Az SQL-nek van szabványa, de minden DBMS-nek **saját nyelvjárása** is van.
- Leggyakoribb eltérések: lapozás, automatikus azonosító, összefűzés, NULL-csere, dátumok, logikai típus, UPSERT, azonosítók idézése, kis-/nagybetűk.
- Szabványos alakok: `FETCH FIRST … ROWS ONLY`, `GENERATED … AS IDENTITY`, `COALESCE`, `CASE`, `MERGE`, `||`.
- Hordozhatóság: szabványos SQL, ORM, tesztek – vagy tudatos döntés egy rendszer erősségei mellett.

## A lecke feladata

A fenti **SQL Server**-es lekérdezést írd át **szabványos SQL-re**, amely PostgreSQL-ben fut: a 3 legmagasabb félévű hallgató (egyenlőségnél név szerint) neve (`nev`) és leírása (`leiras`) a „város – szak” formában (közte szóköz, nagykötőjel, szóköz), ahol a hiányzó város helyén `?` áll.

Cseréld le a `TOP`-ot, az `ISNULL`-t és a `+` összefűzést a szabványos megfelelőjükre!

```sql starter required
SELECT TOP 3 nev, ISNULL(varos, '?') + ' – ' + szak AS leiras
FROM hallgatok
ORDER BY felev DESC, nev;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT nev, COALESCE(varos, '?') || ' – ' || szak AS leiras
FROM hallgatok
ORDER BY felev DESC, nev
FETCH FIRST 3 ROWS ONLY;
```

</details>
