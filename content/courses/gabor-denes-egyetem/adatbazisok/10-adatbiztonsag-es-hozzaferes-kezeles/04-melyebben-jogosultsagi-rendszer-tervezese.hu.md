---
title: Mélyebben – jogosultsági rendszer tervezése egy valódi alkalmazáshoz
summary: CRUD-mátrix készítése szerepkörönként, a legkisebb jogosultság és a feladatok szétválasztásának elve, a tulajdonos és az alkalmazásfiók különválasztása, a PUBLIC jogok elvétele, ellenőrzött „kapu” SECURITY DEFINER függvénnyel, naplózás triggerrel, és a leggyakoribb jogosultsági hibák – kipróbálható példákkal.
minutes: 40
---

## Amit ebben a leckében megtanulsz

- hogyan tervezz jogosultságokat **módszeresen**, egy CRUD-mátrix segítségével,
- mit jelent a **legkisebb jogosultság** és a **feladatok szétválasztásának** elve a gyakorlatban,
- miért ne legyen az alkalmazás az adatbázis **tulajdonosa**,
- hogyan adj ellenőrzött hozzáférést egy **SECURITY DEFINER** függvényen keresztül,
- hogyan **naplózd**, ki mit módosított,
- melyek a leggyakoribb, valódi incidensekhez vezető **hibák**.

## A mintaadatbázis

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

## 1. Először a papír: a CRUD-mátrix

Mielőtt egyetlen `GRANT`-ot leírnál, készíts egy táblázatot: soronként a **szerepkörök**, oszloponként a **táblák**, a cellákban pedig, hogy ki mit tehet: **C**reate (INSERT), **R**ead (SELECT), **U**pdate, **D**elete.

| Szerepkör             | hallgatok | targyak | jelentkezesek        |
| --------------------- | --------- | ------- | -------------------- |
| hallgató (alkalmazás) | R (saját) | R       | C, R (saját)         |
| oktató                | R         | R       | R, U (csak a jegyet) |
| tanulmányi osztály    | C, R, U   | C, R, U | C, R, U              |
| statisztikus          | –         | R       | R (név nélkül)       |
| DBA / migráció        | minden    | minden  | minden               |

Ebből a táblázatból a `GRANT` utasítások szinte gépiesen következnek – és a táblázatot egy nem informatikus vezető is el tudja olvasni és jóvá tudja hagyni. **Ez a legfontosabb lépés:** a jogosultság üzleti döntés, nem technikai részlet.

Figyeld meg: a **D (törlés)** szinte sehol sem szerepel. Egy tanulmányi rendszerben ritkán törlünk – inkább „visszavont” állapotot jelölünk, hogy a múlt nyomon követhető maradjon.

## 2. Két alapelv

### A legkisebb jogosultság elve

Mindenki **pontosan annyi** jogot kap, amennyi a munkájához kell – se többet. Ha egy fiókot feltörnek, a kár akkora, amekkora a fiók joga.

**Analógia:** a takarító kulcsa a folyosókat és az irodákat nyitja, de a széfet nem. Ha elveszíti a kulcsot, a széf biztonságban marad.

### A feladatok szétválasztása

Kritikus műveletekhez **két különböző** szereplő kelljen. Például: aki a jegyet beírja (oktató), ne tudja törölni a naplót (DBA); aki a pénzt utalja, ne ő hagyja jóvá. Így egyetlen ember (vagy egyetlen feltört fiók) nem tud nyomtalanul visszaélni.

## 3. Tulajdonos ≠ alkalmazás

Egy gyakori, veszélyes minta: a webalkalmazás ugyanazzal a fiókkal csatlakozik, amelyikkel a táblákat létrehozták (vagy rosszabb: a `postgres` szuperfelhasználóval). Ekkor egy SQL-befecskendezéses hiba (15. témakör) esetén a támadó **bármit** megtehet: `DROP TABLE`, minden adat kiolvasása, sőt egyes beállításoknál parancsfuttatás a szerveren.

A helyes felállás:

| Fiók        | Mire való                            | Jogai                                     |
| ----------- | ------------------------------------ | ----------------------------------------- |
| `app_owner` | a séma tulajdonosa, csak migrációkor | CREATE, ALTER, DROP – a saját objektumain |
| `app_user`  | a futó alkalmazás ezzel csatlakozik  | csak a CRUD-mátrix szerinti DML           |
| `readonly`  | riportok, elemzők                    | csak SELECT, esetleg csak nézetekre       |

```sql run
-- A három fiók (csoport) szétválasztása
CREATE ROLE app_owner;
CREATE ROLE app_user;
CREATE ROLE readonly;

-- Az alkalmazás csak olvasni és jelentkezést rögzíteni tud
GRANT SELECT ON hallgatok, targyak, jelentkezesek TO app_user;
GRANT INSERT ON jelentkezesek TO app_user;
-- A riport-fiók csak olvas
GRANT SELECT ON targyak, jelentkezesek TO readonly;

-- Ellenőrzés: egy kis mátrix a has_table_privilege függvénnyel
SELECT r.szerep, t.tabla,
       has_table_privilege(r.szerep, t.tabla, 'SELECT') AS r,
       has_table_privilege(r.szerep, t.tabla, 'INSERT') AS c,
       has_table_privilege(r.szerep, t.tabla, 'UPDATE') AS u,
       has_table_privilege(r.szerep, t.tabla, 'DELETE') AS d
FROM (VALUES ('app_user'), ('readonly')) AS r(szerep)
CROSS JOIN (VALUES ('hallgatok'), ('targyak'), ('jelentkezesek')) AS t(tabla)
ORDER BY r.szerep, t.tabla;
```

Ez a lekérdezés maga a **CRUD-mátrix** – a táblázatot az adatbázisból is visszaellenőrizheted, és összevetheted a papíron jóváhagyottal.

### A PUBLIC csapdája

A PostgreSQL-ben minden szerepkör tagja egy láthatatlan `PUBLIC` csoportnak. Ami a `PUBLIC`-nak meg van engedve, az **mindenkinek**. Régebbi verziókban például bárki hozhatott létre táblát a `public` sémában. Biztonságos alapállás egy új adatbázisban:

```sql
REVOKE ALL ON SCHEMA public FROM PUBLIC;          -- senki ne hozhasson létre benne semmit
GRANT USAGE ON SCHEMA public TO app_user, readonly; -- csak a kijelöltek láthatják
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;
```

Az új táblákra a jogokat az `ALTER DEFAULT PRIVILEGES` segítségével előre megadhatod, így nem felejted el őket egy migráció után.

## 4. Ellenőrzött kapu: SECURITY DEFINER függvény

Néha egy szabályt **nem lehet** egyszerű jogosultsággal kifejezni: _„A hallgató jelentkezhet tárgyra, de legfeljebb 3-ra.”_ Ha az alkalmazásnak `INSERT` joga van, bármennyit beszúrhat. A megoldás: az alkalmazás **ne kapjon** közvetlen írási jogot, hanem csak egy **függvényt** hívhasson, amely ellenőriz, és a tulajdonos jogaival ír.

**Analógia:** a bankban nem mész be a széfbe; a pénztároshoz fordulsz, aki ellenőrzi a személyazonosságodat és az egyenlegedet, és ő nyúl a széfhez.

```sql run
CREATE ROLE hallgato_app;   -- semmilyen táblajoga nincs!

CREATE FUNCTION jelentkezes(p_neptun CHAR(6), p_kod VARCHAR(6)) RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER            -- a függvény a TULAJDONOSA jogaival fut
SET search_path = public    -- biztonság: ne lehessen hamis táblával „eltéríteni”
AS $$
BEGIN
  IF (SELECT COUNT(*) FROM jelentkezesek WHERE neptun = p_neptun) >= 3 THEN
    RETURN 'elutasítva: legfeljebb 3 tárgy vehető fel';
  END IF;
  INSERT INTO jelentkezesek (neptun, kod) VALUES (p_neptun, p_kod);
  RETURN 'sikeres jelentkezés';
END $$;

REVOKE ALL ON FUNCTION jelentkezes FROM PUBLIC;          -- alapból senki
GRANT EXECUTE ON FUNCTION jelentkezes TO hallgato_app;   -- csak az alkalmazás

SET ROLE hallgato_app;
SELECT jelentkezes('BCD234', 'ADB') AS bela,   -- 2 tárgya van → sikerül
       jelentkezes('ABC123', 'MAT') AS anna;   -- már 3 tárgya van → elutasítva
RESET ROLE;
```

A `hallgato_app` szerepkörnek egyetlen táblára sincs joga, mégis tud jelentkezni – de **csak** a függvény szabályai szerint. Próbáld ki: a `SET ROLE` után írj egy közvetlen `INSERT INTO jelentkezesek …` utasítást – **permission denied**.

Két biztonsági szabály a SECURITY DEFINER függvényekhez:

1. mindig add meg a `SET search_path`-t, különben egy támadó a saját sémájában létrehozott, azonos nevű táblával „eltérítheti” a függvényt;
2. vedd el a `PUBLIC` végrehajtási jogát, és csak a kijelölt szerepkörnek add meg.

## 5. Ki volt az? – naplózás triggerrel

A jogosultság **megelőz**, a napló **felderít**. Egy trigger minden módosításnál automatikusan feljegyzi, ki, mit és mikor változtatott:

```sql run
CREATE TABLE naplo (
  mikor   TIMESTAMP DEFAULT now(),
  ki      TEXT DEFAULT current_user,
  muvelet TEXT,
  regi    TEXT,
  uj      TEXT
);

CREATE FUNCTION jegy_naplozo() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO naplo (muvelet, regi, uj)
  VALUES (TG_OP, row_to_json(OLD)::TEXT, row_to_json(NEW)::TEXT);
  RETURN NEW;
END $$;

CREATE TRIGGER jelentkezes_naplo
AFTER UPDATE ON jelentkezesek
FOR EACH ROW EXECUTE FUNCTION jegy_naplozo();

UPDATE jelentkezesek SET jegy = 5 WHERE neptun = 'BCD234' AND kod = 'PROG';

SELECT ki, muvelet, regi, uj FROM naplo;
```

A naplótáblára a hétköznapi szerepkörök csak `INSERT`-et kapjanak (a triggeren keresztül), módosítást és törlést **senki** – így a nyomokat sem lehet eltüntetni. (Valódi rendszerben a naplót gyakran egy külön szerverre is továbbítják.)

## 6. Valódi incidensekhez vezető hibák

| Hiba                                           | Következmény                                              | Helyesen                                               |
| ---------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------ |
| az alkalmazás szuperfelhasználóval csatlakozik | egy SQL-befecskendezés = teljes átvétel                   | külön `app_user` csak DML joggal                       |
| közös fiók több embernek („admin/admin”)       | nem derül ki, ki tette; nem vonható vissza egy ember joga | személyes fiókok, csoportszerepkörök                   |
| a kilépett munkatárs fiókja aktív marad        | volt munkatárs hozzáfér                                   | ki- és belépési folyamat, rendszeres jogfelülvizsgálat |
| `GRANT ALL` „hogy működjön”                    | a legkisebb jogosultság elve sérül                        | a CRUD-mátrixból levezetett jogok                      |
| jelszó a forráskódban                          | a kód kiszivárgásával a jelszó is                         | környezeti változó, titokkezelő                        |
| az adatbázis-port nyitva az internet felé      | jelszótörő támadások                                      | tűzfal, csak az alkalmazásszerverről elérhető          |

## Összefoglalás

- Tervezz **CRUD-mátrixszal**: szerepkör × tábla → C, R, U, D. A jog üzleti döntés.
- **Legkisebb jogosultság** és **feladatok szétválasztása**.
- Válaszd külön a **tulajdonost** (migráció) és az **alkalmazásfiókot** (csak DML); vedd el a `PUBLIC` fölösleges jogait.
- A jogokkal ki nem fejezhető szabályokra: **SECURITY DEFINER** függvény `SET search_path`-szel és szűkített `EXECUTE` joggal.
- **Naplózz** triggerrel; a naplót senki se módosíthassa.

## A lecke feladata

A CRUD-mátrix „statisztikus” sorát valósítsd meg! Hozd létre a `statisztikus` szerepkört, amely:

- a `targyak` táblát **teljes egészében olvashatja**;
- a `jelentkezesek` táblából **csak a `kod` és a `jegy` oszlopot** olvashatja (a Neptun-kódot nem – így név szerint nem azonosíthatók a jegyek);
- a `hallgatok` táblához **semmilyen** joga nincs, és sehová nem írhat.

Az ellenőrzés a `has_table_privilege` és `has_column_privilege` függvényekkel vizsgálja a jogokat.

```sql starter required
CREATE ROLE statisztikus;
-- Add meg a jogokat!
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE ROLE statisztikus;
GRANT SELECT ON targyak TO statisztikus;
GRANT SELECT (kod, jegy) ON jelentkezesek TO statisztikus;
```

</details>

```sql test
SELECT has_table_privilege('statisztikus', 'targyak', 'SELECT')                 AS targyak_olvas,
       has_table_privilege('statisztikus', 'targyak', 'INSERT')                 AS targyak_ir,
       has_column_privilege('statisztikus', 'jelentkezesek', 'kod', 'SELECT')   AS kod_olvas,
       has_column_privilege('statisztikus', 'jelentkezesek', 'jegy', 'SELECT')  AS jegy_olvas,
       has_column_privilege('statisztikus', 'jelentkezesek', 'neptun', 'SELECT') AS neptun_olvas,
       has_table_privilege('statisztikus', 'hallgatok', 'SELECT')               AS hallgatok_olvas,
       has_column_privilege('statisztikus', 'jelentkezesek', 'jegy', 'UPDATE')  AS jegy_ir;
```
