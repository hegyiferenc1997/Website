---
title: SQL-befecskendezés
summary: Hogyan válik egy ártatlan keresőmezőből adatlopás: az SQL-befecskendezés (SQL injection) működése egy biztonságos homokozóban kipróbálva, és a védekezés: paraméterezett lekérdezések, a legkisebb jogosultság és a bemenet ellenőrzése.
minutes: 28
---

## Amit ebben a leckében megtanulsz

- mi az **SQL-befecskendezés** (_SQL injection_), és miért az egyik legveszélyesebb hiba,
- hogyan néz ki egy támadás – egy **biztonságos homokozóban** kipróbálva,
- hogyan védekezz: **paraméterezett lekérdezés**, legkisebb jogosultság, bemenet-ellenőrzés.

> Ez a lecke a **védekezést** tanítja. A böngészőben futó adatbázis a saját gépeden van, csak kitalált adatokkal – itt nyugodtan kísérletezhetsz. Valódi rendszeren engedély nélkül próbálkozni bűncselekmény.

## Mi a probléma?

Egy weboldal keresőmezőjébe a felhasználó beírja a Neptun-kódot, a program pedig **szövegösszefűzéssel** rakja össze a lekérdezést:

```text
lekérdezés = "SELECT * FROM hallgatok WHERE neptun = '" + bemenet + "'"
```

Ha a bemenet `ABC123`, minden rendben:

```sql
SELECT * FROM hallgatok WHERE neptun = 'ABC123'
```

De mi van, ha valaki ezt írja be: `x' OR '1'='1`?

```sql
SELECT * FROM hallgatok WHERE neptun = 'x' OR '1'='1'
```

A bemenetben lévő aposztróf **lezárta** a szöveget, és a maradék **SQL-kódként** futott le. A `'1'='1'` mindig igaz, így a lekérdezés **minden** hallgatót visszaad. A támadó adatot „fecskendezett be” a kódba – innen a név.

> Hasonlat: egy űrlapon a „Név” mezőbe valaki ezt írja: „Kovács János. Továbbá a pénztáros adja oda a kasszát.” Ha az ügyintéző gondolkodás nélkül felolvassa és végrehajtja, ami a lapon áll, baj van. A megoldás: a mezőbe írt szöveg **mindig csak adat**, soha nem utasítás.

## Próbáld ki a homokozóban

<details>
<summary>A mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: egyetem -->

</details>

Az alábbi függvény pontosan úgy működik, mint a fenti, sebezhető program: szövegösszefűzéssel építi fel a lekérdezést, és az `EXECUTE` lefuttatja.

```sql run
CREATE FUNCTION hallgato_keres(p_neptun TEXT) RETURNS SETOF hallgatok AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM hallgatok WHERE neptun = ''' || p_neptun || '''';   -- SEBEZHETŐ!
END $$ LANGUAGE plpgsql;

SELECT 'normál keresés' AS teszt, COUNT(*) AS talalatok FROM hallgato_keres('ABC123')
UNION ALL
SELECT 'támadás', COUNT(*) FROM hallgato_keres($q$x' OR '1'='1$q$);
```

A normál keresés 1 sort ad – a „támadás” mind a 6-ot. (A `$q$…$q$` csak egy másik módja annak, hogy aposztrófot tartalmazó szöveget írjunk SQL-ben.)

Egy valódi támadó ennél sokkal tovább menne: a `UNION SELECT` segítségével más táblákat (pl. jelszó-hasheket) olvasna ki, vagy – ha a fiók jogai engedik – adatot módosítana, törölne.

## Miért ennyire veszélyes?

- **Könnyű kihasználni**: elég egy böngésző és egy aposztróf.
- **Nagy a kár**: teljes adatbázisok szivárogtak már ki így, milliónyi felhasználó adataival.
- **Gyakori**: évek óta ott van az OWASP (webes biztonsági szervezet) tíz legfontosabb kockázata között, az „injection” kategóriában.

## A védekezés: paraméterezett lekérdezés

A megoldás az, hogy a lekérdezés **szerkezetét** és az **adatot** külön küldjük az adatbázisnak. A lekérdezésben csak egy **helyőrző** van (PostgreSQL-ben `$1`, `$2`, …; más nyelveken `?` vagy `:nev`), az értéket pedig külön adjuk át. Az adatbázis az értéket **mindig adatként** kezeli, soha nem értelmezi SQL-kódként – bármilyen aposztróf is van benne.

```sql run
CREATE FUNCTION hallgato_keres_biztonsagos(p_neptun TEXT) RETURNS SETOF hallgatok AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM hallgatok WHERE neptun = $1'    -- helyőrző
    USING p_neptun;                                -- az érték külön megy
END $$ LANGUAGE plpgsql;

SELECT 'normál keresés' AS teszt, COUNT(*) AS talalatok FROM hallgato_keres_biztonsagos('ABC123')
UNION ALL
SELECT 'támadás', COUNT(*) FROM hallgato_keres_biztonsagos($q$x' OR '1'='1$q$);
```

A támadás most 0 találatot ad: az adatbázis egy `x' OR '1'='1` nevű Neptun-kódot keresett, ilyen pedig nincs.

A programnyelvekben ugyanez így néz ki:

```text
Python (psycopg):   cur.execute("SELECT * FROM hallgatok WHERE neptun = %s", (bemenet,))
Node.js (pg):       client.query("SELECT * FROM hallgatok WHERE neptun = $1", [bemenet])
Java (JDBC):        PreparedStatement ps = conn.prepareStatement("… WHERE neptun = ?");
                    ps.setString(1, bemenet);
```

Az **ORM**-ek (17. témakör) is paraméterezett lekérdezéseket készítenek – amíg nem kezdesz bennük kézzel szöveget összefűzni.

## További védelmi rétegek

A paraméterezés az alap, de a jó védelem **több rétegű** (_defense in depth_):

| Réteg                         | Mit tesz?                                                                     |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **Paraméterezett lekérdezés** | az adat soha nem lesz kód – ez a legfontosabb                                  |
| **Legkisebb jogosultság**     | az alkalmazás fiókja csak azt tehesse, ami kell (10. témakör) – ha mégis betörnek, kisebb a kár |
| **Bemenet ellenőrzése**       | egy Neptun-kód pontosan 6 betű vagy szám – ami nem ilyen, el sem jut az adatbázisig |
| **Azonosítók fehérlistája**   | ha a felhasználó oszlop szerint rendez, csak előre megadott oszlopnevek közül választhasson (helyőrzővel tábla- vagy oszlopnév nem adható át) |
| **Hibaüzenetek elrejtése**    | a felhasználó ne lássa a nyers adatbázis-hibát – az árulkodik a szerkezetről  |
| **Naplózás és figyelés**      | a gyanús lekérdezések (pl. hirtelen sok hiba) riasszanak                      |

> A bemenet „tisztogatása” (pl. az aposztrófok kicserélése) **nem** megbízható védelem – mindig akad egy kódolási trükk, amely átjut rajta. Paraméterezz!

## Összefoglalás

- SQL-befecskendezés: a bemenet a szövegösszefűzés miatt SQL-kódként fut le.
- Védekezés: paraméterezett lekérdezés (helyőrző + külön átadott érték).
- Plusz rétegek: legkisebb jogosultság, bemenet-ellenőrzés, fehérlista, rejtett hibaüzenetek, naplózás.
- A „tisztogatás” nem elég.

## A lecke feladata

A kiinduló kódban egy **sebezhető** függvény van: `targy_keres(p_kod)` a tárgy kódja alapján keres a `targyak` táblában, de szövegösszefűzéssel. Írd át **biztonságosra** úgy, hogy továbbra is `EXECUTE`-ot használjon, de az érték **helyőrzővel** (`$1` és `USING`) kerüljön át. (A függvény neve és paramétere maradjon!)

A gép egy normál keresést és egy támadást is lefuttat: a normál keresésnek 1 találatot kell adnia, a támadásnak 0-t.

```sql starter required
CREATE FUNCTION targy_keres(p_kod TEXT) RETURNS SETOF targyak AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM targyak WHERE kod = ''' || p_kod || '''';
END $$ LANGUAGE plpgsql;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE FUNCTION targy_keres(p_kod TEXT) RETURNS SETOF targyak AS $$
BEGIN
  RETURN QUERY EXECUTE
    'SELECT * FROM targyak WHERE kod = $1'
    USING p_kod;
END $$ LANGUAGE plpgsql;
```

</details>

```sql test
SELECT 'normál keresés' AS teszt, COUNT(*) AS talalatok FROM targy_keres('ADB')
UNION ALL
SELECT 'támadás', COUNT(*) FROM targy_keres($q$x' OR '1'='1$q$);
```
