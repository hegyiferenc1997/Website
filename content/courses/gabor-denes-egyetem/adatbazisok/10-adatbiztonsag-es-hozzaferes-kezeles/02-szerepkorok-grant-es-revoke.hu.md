---
title: Szerepkörök, GRANT és REVOKE
summary: Szerepkörök létrehozása (CREATE ROLE), jogok kiosztása és visszavonása (GRANT, REVOKE) táblára és oszlopra, szerepkörök egymásba ágyazása, a WITH GRANT OPTION, valamint a jogok ellenőrzése – mindez a böngészőben futó PostgreSQL-en.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- hogyan hozz létre **szerepkört** (`CREATE ROLE`),
- hogyan adj és vonj vissza **jogokat** (`GRANT`, `REVOKE`), akár oszlopszinten,
- hogyan tegyél egy felhasználót egy **csoportba**,
- hogyan **ellenőrizd**, hogy kinek milyen joga van.

## A mintaadatbázis

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Ebben a leckében te vagy az adatbázis **tulajdonosa** (szuperfelhasználó), és a többieknek osztasz jogokat.

## Szerepkör létrehozása

```sql
CREATE ROLE elemzo;                         -- csoport: nem tud bejelentkezni
CREATE ROLE kiss_anna LOGIN PASSWORD '…';   -- felhasználó: be tud jelentkezni
```

A PostgreSQL-ben mindkettő **szerepkör**; a különbség csak a `LOGIN` jelző. (A jelszót a valóságban soha nem írjuk bele egy kódba, amit mások is látnak!)

## Jogok kiosztása: GRANT

Az alakja: `GRANT jog(ok) ON tábla TO szerepkör;`

| Jog          | Mit enged?                     |
| ------------ | ------------------------------ |
| `SELECT`     | olvasás                        |
| `INSERT`     | új sor beszúrása               |
| `UPDATE`     | meglévő sor módosítása         |
| `DELETE`     | sor törlése                    |
| `ALL`        | mindez együtt (és még néhány)  |

```sql run
CREATE ROLE elemzo;
GRANT SELECT ON hallgatok, targyak, jelentkezesek TO elemzo;

SELECT has_table_privilege('elemzo', 'hallgatok', 'SELECT') AS olvashat,
       has_table_privilege('elemzo', 'hallgatok', 'DELETE') AS torolhet;
```

A `has_table_privilege(szerepkör, tábla, jog)` függvény megmondja, megvan-e a jog. Az elemző olvashat, de nem törölhet.

## Próbáld ki „más szemével”: SET ROLE

A `SET ROLE` utasítással átváltozhatsz egy másik szerepkörré, és megnézheted, mit lát:

```sql run
CREATE ROLE elemzo;
GRANT SELECT ON hallgatok TO elemzo;

SET ROLE elemzo;
SELECT current_user AS ki_vagyok, neptun, nev FROM hallgatok ORDER BY neptun LIMIT 3;
RESET ROLE;
```

Kísérletezz: kattints a szerkesztésre, és a `SELECT` helyére írj egy `DELETE FROM hallgatok;` utasítást. A PostgreSQL ezt válaszolja: **permission denied for table hallgatok** – a jogosultságkezelés működik!

## Oszlopszintű jogok

Nem csak egész táblára adhatsz jogot. Például az oktató módosíthatja a **jegyet**, de a hallgató Neptun-kódját vagy a tárgy kódját nem:

```sql run
CREATE ROLE oktato;
GRANT SELECT ON jelentkezesek TO oktato;
GRANT UPDATE (jegy) ON jelentkezesek TO oktato;

SELECT has_column_privilege('oktato', 'jelentkezesek', 'jegy', 'UPDATE')   AS jegyet_irhat,
       has_column_privilege('oktato', 'jelentkezesek', 'neptun', 'UPDATE') AS neptunt_irhat;
```

## Jogok visszavonása: REVOKE

A `REVOKE` a `GRANT` ellentéte: `REVOKE jog ON tábla FROM szerepkör;`

```sql run
CREATE ROLE gyakornok;
GRANT ALL ON hallgatok TO gyakornok;          -- hoppá, túl sok
REVOKE INSERT, UPDATE, DELETE ON hallgatok FROM gyakornok;

SELECT has_table_privilege('gyakornok', 'hallgatok', 'SELECT') AS olvas,
       has_table_privilege('gyakornok', 'hallgatok', 'DELETE') AS torol;
```

## Csoportok: szerepkör a szerepkörben

A jogokat a **csoport** kapja, a felhasználó pedig a csoport tagja lesz, és **örökli** a jogokat:

```sql run
CREATE ROLE oktato;
GRANT SELECT ON hallgatok, targyak, jelentkezesek TO oktato;
GRANT UPDATE (jegy) ON jelentkezesek TO oktato;

CREATE ROLE kovacs_peter LOGIN;
GRANT oktato TO kovacs_peter;      -- Péter az oktatók csoportjába kerül

SELECT pg_has_role('kovacs_peter', 'oktato', 'MEMBER') AS tag_e,
       has_column_privilege('kovacs_peter', 'jelentkezesek', 'jegy', 'UPDATE') AS jegyet_irhat;
```

Péter közvetlenül egyetlen jogot sem kapott, mégis módosíthatja a jegyet – a csoporttól örökölte. Ha Péter elmegy, egyetlen `REVOKE oktato FROM kovacs_peter;` elég.

## Továbbadható jog: WITH GRANT OPTION

```sql
GRANT SELECT ON targyak TO tanszekvezeto WITH GRANT OPTION;
```

Így a tanszékvezető **tovább is adhatja** az olvasási jogot másoknak. Óvatosan bánj vele: a jog így kicsúszhat a kezedből. Ha visszavonod, a `REVOKE … CASCADE` a továbbadott jogokat is visszavonja.

## Az alapértelmezett jogok

- Az objektum (pl. tábla) **tulajdonosa** mindent megtehet vele, és ő oszthat jogot.
- Minden más szerepkör **semmit** sem tehet egy táblával, amíg jogot nem kap.
- Létezik egy különleges `PUBLIC` csoport, amelynek **mindenki** a tagja. `GRANT … TO PUBLIC` = mindenkinek – ezzel nagyon óvatosan!

## Összefoglalás

- `CREATE ROLE név [LOGIN]` – szerepkör (csoport vagy felhasználó).
- `GRANT jog ON tábla TO szerepkör` / `REVOKE jog ON tábla FROM szerepkör`.
- Oszlopszintű jog: `GRANT UPDATE (oszlop) ON tábla TO …`.
- `GRANT csoport TO felhasználó` – tagság, a jogok öröklődnek.
- Ellenőrzés: `has_table_privilege`, `has_column_privilege`, `pg_has_role`.

## A lecke feladata

Az egyetemen létrejön a **tanulmányi osztály** szerepkör (`tanulmanyi_osztaly`) – ezt a kiinduló kód már létrehozza. Állítsd be a jogait a legkisebb jogosultság elve szerint:

- **olvashatja** a `hallgatok` és a `jelentkezesek` táblát,
- a `jelentkezesek` táblában **csak a `jegy` oszlopot** módosíthatja,
- **törölni nem** tud semmit.

A gép a `has_table_privilege` és a `has_column_privilege` függvénnyel ellenőrzi a jogokat.

```sql starter required
CREATE ROLE tanulmanyi_osztaly;

-- írd ide a GRANT utasításokat
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE ROLE tanulmanyi_osztaly;

GRANT SELECT ON hallgatok, jelentkezesek TO tanulmanyi_osztaly;
GRANT UPDATE (jegy) ON jelentkezesek TO tanulmanyi_osztaly;
```

</details>

```sql test
SELECT has_table_privilege('tanulmanyi_osztaly', 'hallgatok', 'SELECT')                  AS hallgatok_olvas,
       has_table_privilege('tanulmanyi_osztaly', 'jelentkezesek', 'SELECT')              AS jelentkezesek_olvas,
       has_column_privilege('tanulmanyi_osztaly', 'jelentkezesek', 'jegy', 'UPDATE')     AS jegy_modosit,
       has_column_privilege('tanulmanyi_osztaly', 'jelentkezesek', 'neptun', 'UPDATE')   AS neptun_modosit,
       has_table_privilege('tanulmanyi_osztaly', 'jelentkezesek', 'DELETE')              AS jelentkezes_torol,
       has_table_privilege('tanulmanyi_osztaly', 'hallgatok', 'DELETE')                  AS hallgato_torol;
```
