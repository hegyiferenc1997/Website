---
title: Gyakorlás – teljesítményoptimalizálás
summary: Ellenőrző kérdések a lekérdezések átírásáról, a materializált nézetről, a particionálásról, a gyorsítótárról és a skálázásról, majd egy kulcsalapú lapozás megírása két oszlop szerinti rendezéssel.
minutes: 53
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért nem indexbarát a <code>WHERE LOWER(email) = 'anna@pelda.hu'</code> feltétel, és mit tehetsz?</summary>

Mert az index az `email` nyers értékei szerint rendezett, a feltétel viszont egy kiszámolt értékre (`LOWER(email)`) keres. Megoldás: kifejezés alapú index (`CREATE INDEX … ON vasarlok (LOWER(email))`), vagy az e-mail-címeket eleve kisbetűsen tárolni.

</details>

<details>
<summary>2. Mi az N+1 probléma, és hogyan veszed észre?</summary>

Egy listához 1 lekérdezés, majd minden elemhez még egy – összesen N+1 oda-vissza út. Észreveszed a lekérdezésnaplóban (rengeteg majdnem egyforma, csak a paraméterben eltérő lekérdezés) vagy a pg_stat_statements-ben (egy egyszerű lekérdezés nagyon sokszor fut). Megoldás: egyetlen JOIN, vagy az ORM „mohó betöltése”.

</details>

<details>
<summary>3. Mikor jobb a materializált nézet, mint a sima nézet?</summary>

Ha a lekérdezés drága (sok JOIN, sok sor összesítése), gyakran olvassák, és elfogadható, hogy az eredmény kicsit késve frissül (pl. óránként). A sima nézet mindig friss, de minden olvasáskor újra lefut.

</details>

<details>
<summary>4. Miért gyorsabb a régi adat törlése particionált táblában?</summary>

Mert egy egész partíciót egyetlen művelettel el lehet dobni (`DROP TABLE` vagy `DETACH PARTITION`), ahelyett, hogy soronként törölnénk, ami sok WAL-t, halott sorverziót és VACUUM-munkát okozna.

</details>

<details>
<summary>5. Mit ne tegyél gyorsítótárba?</summary>

Olyan adatot, amelynek minden pillanatban pontosnak kell lennie, és egy régi érték kárt okozhat: készlet a fizetés pillanatában, számlaegyenleg, jogosultságok, jelszó-visszaállító tokenek állapota.

</details>

## A gyakorlás feladata: kulcsalapú lapozás két oszloppal

<details>
<summary>A webshop mintaadatbázis létrehozása (SQL)</summary>

<!-- sql-setup: webshop -->

</details>

Az ügyfélszolgálati felület a rendeléseket **dátum szerint csökkenő** sorrendben listázza, azonos dátumon belül **rendelésazonosító szerint csökkenő** sorrendben, oldalanként 5 sorral. Mivel egy napon sok rendelés van, a dátum önmagában nem egyedi – ezért a lapozáshoz **mindkét oszlopot** meg kell jegyezni.

Az előző oldal utolsó sora: dátum **2026-01-01**, azonosító **10000**. Írd meg a **következő oldalt** kulcsalapú lapozással (`OFFSET` nélkül)! Oszlopok: rendeles_id, datum.

Tipp: a PostgreSQL-ben sorokat is össze lehet hasonlítani: `(datum, rendeles_id) < ('2026-01-01', 10000)` – ez pontosan azt jelenti, hogy „a rendezésben ez után jön”.

```sql run
-- A sorösszehasonlítás: előbb az első elem dönt, egyenlőség esetén a második.
SELECT (DATE '2026-01-01', 9000) < (DATE '2026-01-01', 10000) AS ugyanaz_a_nap_kisebb_id,
       (DATE '2025-12-31', 99999) < (DATE '2026-01-01', 10000) AS korabbi_nap;
```

A kiinduló kód az első oldalt adja vissza – alakítsd át a következő oldalra.

```sql starter required
SELECT rendeles_id, datum
FROM rendelesek
ORDER BY datum DESC, rendeles_id DESC
LIMIT 5;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT rendeles_id, datum
FROM rendelesek
WHERE (datum, rendeles_id) < ('2026-01-01', 10000)
ORDER BY datum DESC, rendeles_id DESC
LIMIT 5;
```

Élesben ehhez egy `(datum, rendeles_id)` összetett index is kell, hogy a DBMS egyenesen a megfelelő helyre ugorhasson.

</details>

## További gyakorló feladatok (nem kötelezők)

Ezek a feladatok nem kötelezők, de minél többet megoldasz, annál magabiztosabb leszel. Mindegyikhez ott a megoldás – előbb próbáld meg magad, és csak utána nézd meg!

A feladatok a fenti webshop-adatbázison futnak. Mindegyiknél érdemes az `EXPLAIN ANALYZE`-zal is megnézni, mennyi ideig tart és milyen tervet kap.

**1.** **Toplista egy lépésben.** Melyik **5 termék** hozta a legtöbb bevételt (`db * egysegar` összege) a **nem törölt** rendelésekből? (Terméknév, bevétel; bevétel szerint csökkenően.)

```sql starter
SELECT termek_id, db, egysegar
FROM tetelek;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT t.nev, SUM(te.db * te.egysegar) AS bevetel
FROM tetelek te
JOIN rendelesek r ON r.rendeles_id = te.rendeles_id
JOIN termekek t   ON t.termek_id = te.termek_id
WHERE r.statusz <> 'törölt'
GROUP BY t.termek_id, t.nev
ORDER BY bevetel DESC
LIMIT 5;
```

</details>

**2.** **Kulcsalapú lapozás.** Az `OFFSET 10000` minden alkalommal végigolvas 10 000 sort. Gyorsabb, ha az előző oldal **utolsó kulcsától** folytatjuk. Kérd le a 10 000-es azonosító **utáni** 5 rendelést (azonosító, dátum), azonosító szerint!

```sql starter
SELECT rendeles_id, datum
FROM rendelesek
ORDER BY rendeles_id
OFFSET 10000 LIMIT 5;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT rendeles_id, datum
FROM rendelesek
WHERE rendeles_id > 10000          -- a kulcs indexéből azonnal megtalálja a kezdőpontot
ORDER BY rendeles_id
LIMIT 5;
```

</details>

**3.** **EXISTS a COUNT helyett.** „Van-e olyan pécsi vásárló, aki **törölt** rendelést adott le?” Ehhez nem kell mindet megszámolni: az `EXISTS` az **első találatnál** megáll. Adj igaz/hamis választ!

```sql starter
SELECT COUNT(*)
FROM rendelesek r
JOIN vasarlok v ON v.vasarlo_id = r.vasarlo_id
WHERE v.varos = 'Pécs' AND r.statusz = 'törölt';
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT EXISTS (
  SELECT 1
  FROM rendelesek r
  JOIN vasarlok v ON v.vasarlo_id = r.vasarlo_id
  WHERE v.varos = 'Pécs' AND r.statusz = 'törölt'
) AS van_ilyen;
```

</details>

**4.** **Előre összesített adat.** A vezetői kimutatás naponta százszor kéri a havi bevételt. Hozz létre egy `havi_bevetel` **materializált nézetet** (hónap, bevétel) a nem törölt rendelésekből, majd kérdezd le belőle a 3 legjobb hónapot (bevétel szerint csökkenően)!

```sql starter
SELECT date_trunc('month', r.datum) AS honap, SUM(te.db * te.egysegar) AS bevetel
FROM rendelesek r
JOIN tetelek te ON te.rendeles_id = r.rendeles_id
WHERE r.statusz <> 'törölt'
GROUP BY honap;
```

<details>
<summary>Megoldás</summary>

```sql solution
CREATE MATERIALIZED VIEW havi_bevetel AS
SELECT date_trunc('month', r.datum) AS honap, SUM(te.db * te.egysegar) AS bevetel
FROM rendelesek r
JOIN tetelek te ON te.rendeles_id = r.rendeles_id
WHERE r.statusz <> 'törölt'
GROUP BY honap;                    -- az eredmény eltárolódik; frissítés: REFRESH MATERIALIZED VIEW

SELECT * FROM havi_bevetel ORDER BY bevetel DESC LIMIT 3;
```

</details>

**5.** **Indexbarát dátumszűrés.** A `WHERE EXTRACT(MONTH FROM datum) = 3 AND EXTRACT(YEAR FROM datum) = 2025` nem tud indexet használni, mert az oszlopon függvény van. Írd át **tartományra** (`datum >= … AND datum < …`), és számold meg a 2025. márciusi rendeléseket!

```sql starter
SELECT COUNT(*)
FROM rendelesek
WHERE EXTRACT(YEAR FROM datum) = 2025 AND EXTRACT(MONTH FROM datum) = 3;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT COUNT(*)
FROM rendelesek
WHERE datum >= DATE '2025-03-01' AND datum < DATE '2025-04-01';   -- az oszlop „csupasz” → indexelhető
```

</details>
