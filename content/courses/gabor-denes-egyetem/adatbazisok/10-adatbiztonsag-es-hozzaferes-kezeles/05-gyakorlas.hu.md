---
title: Gyakorlás – adatbiztonság
summary: Ellenőrző kérdések a hitelesítésről, a jogosultságokról, a nézetekről és a sorszintű biztonságról, majd egy komplett jogosultsági terv megvalósítása SQL-ben: csoport, felhasználó, oszlopszintű jog és egy túl bőkezű jog visszavonása.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a hitelesítés és a jogosultságkezelés között?</summary>

A hitelesítés azt ellenőrzi, **ki vagy** (pl. jelszóval). A jogosultságkezelés azt dönti el, hogy az azonosított felhasználó **mit tehet** (pl. olvashat-e egy táblát).

</details>

<details>
<summary>2. Miért jobb a jogokat szerepkörökhöz rendelni, mint közvetlenül a felhasználókhoz?</summary>

Mert egy szabály változásakor csak egy helyen kell módosítani, új munkatárs érkezésekor vagy távozásakor pedig elég a csoporttagságot megadni vagy elvenni. Kevesebb a hiba, és jobban átlátható, kinek mi a joga.

</details>

<details>
<summary>3. Hogyan engednéd meg, hogy egy alkalmazás lássa a hallgatók nevét, de a születési dátumát ne?</summary>

Egy nézettel, amely csak a szükséges oszlopokat tartalmazza (`CREATE VIEW … AS SELECT neptun, nev …`), és az alkalmazás szerepkörének csak a nézetre adok `SELECT` jogot, a táblára nem. (Oszlopszintű `GRANT SELECT (neptun, nev)` is működik.)

</details>

<details>
<summary>4. Mire jó a sorszintű biztonság (RLS) a nézetekkel szemben?</summary>

Ha sok felhasználó ugyanazt a táblát használja, de mindenki csak a saját sorait láthatja, egyetlen szabály (`CREATE POLICY`) elég, és a DBMS minden lekérdezéshez automatikusan hozzáadja. Nem kell felhasználónként nézetet írni, és az alkalmazás sem felejthet el egy `WHERE` feltételt.

</details>

<details>
<summary>5. Miért veszélyes, ha a webalkalmazás szuperfelhasználóként csatlakozik az adatbázishoz?</summary>

Mert ha az alkalmazásban hiba van (pl. SQL-befecskendezés, 15. témakör), a támadó mindent megtehet: táblákat törölhet, minden adatot letölthet, és a sorszintű szabályokat is kikerüli. A legkisebb jogosultság elve szerint az alkalmazás csak a szükséges táblákon, a szükséges műveletekre kapjon jogot.

</details>

## A gyakorlás feladata

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Valósítsd meg az egyetem jogosultsági tervét! A kiinduló kód első két sora a **jelenlegi állapot**: valaki régen minden jogot odaadott a gyakornoknak. Ezt a két sort hagyd meg, és írd alá a többit:

1. Hozd létre az `oktato` **csoportot** (nem tud bejelentkezni). Olvashassa a `hallgatok`, `targyak` és `jelentkezesek` táblát, és a `jelentkezesek` táblában **csak a `jegy`** oszlopot módosíthassa.
2. Hozd létre a `kovacs_peter` **felhasználót** (be tud jelentkezni), és tedd az `oktato` csoport tagjává.
3. A `gyakornok` a `hallgatok` táblát csak **olvashassa**: vond vissza tőle a beszúrás, módosítás és törlés jogát.

A gép a rendszerkatalógusból (`pg_roles`, `pg_auth_members`) és a jogellenőrző függvényekkel nézi meg az eredményt.

```sql starter required
CREATE ROLE gyakornok;
GRANT ALL ON hallgatok TO gyakornok;

-- 1. az oktato csoport és a jogai

-- 2. kovacs_peter

-- 3. a gyakornok jogainak szűkítése
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE ROLE gyakornok;
GRANT ALL ON hallgatok TO gyakornok;

-- 1. az oktato csoport és a jogai
CREATE ROLE oktato;
GRANT SELECT ON hallgatok, targyak, jelentkezesek TO oktato;
GRANT UPDATE (jegy) ON jelentkezesek TO oktato;

-- 2. kovacs_peter
CREATE ROLE kovacs_peter LOGIN;
GRANT oktato TO kovacs_peter;

-- 3. a gyakornok jogainak szűkítése
REVOKE INSERT, UPDATE, DELETE ON hallgatok FROM gyakornok;
```

</details>

```sql test
WITH r AS (
  SELECT (SELECT oid FROM pg_roles WHERE rolname = 'oktato')       AS oktato,
         (SELECT oid FROM pg_roles WHERE rolname = 'kovacs_peter') AS peter,
         (SELECT oid FROM pg_roles WHERE rolname = 'gyakornok')    AS gyakornok
)
SELECT (SELECT rolcanlogin FROM pg_roles WHERE oid = r.oktato)                AS oktato_belep,
       (SELECT rolcanlogin FROM pg_roles WHERE oid = r.peter)                 AS peter_belep,
       EXISTS (SELECT 1 FROM pg_auth_members
                WHERE roleid = r.oktato AND member = r.peter)                 AS peter_oktato,
       has_table_privilege(r.oktato, 'hallgatok', 'SELECT')
         AND has_table_privilege(r.oktato, 'targyak', 'SELECT')
         AND has_table_privilege(r.oktato, 'jelentkezesek', 'SELECT')         AS oktato_olvas,
       has_column_privilege(r.oktato, 'jelentkezesek', 'jegy', 'UPDATE')      AS oktato_jegy,
       has_table_privilege(r.oktato, 'jelentkezesek', 'UPDATE')               AS oktato_egesz_sor,
       has_column_privilege(r.peter, 'jelentkezesek', 'jegy', 'UPDATE')       AS peter_jegy,
       has_table_privilege(r.gyakornok, 'hallgatok', 'SELECT')                AS gyakornok_olvas,
       has_table_privilege(r.gyakornok, 'hallgatok', 'INSERT')
         OR has_table_privilege(r.gyakornok, 'hallgatok', 'UPDATE')
         OR has_table_privilege(r.gyakornok, 'hallgatok', 'DELETE')           AS gyakornok_ir
FROM r;
```
