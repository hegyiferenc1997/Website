---
title: Gyakorlás – teljesítményoptimalizálás
summary: Ellenőrző kérdések a lekérdezések átírásáról, a materializált nézetről, a particionálásról, a gyorsítótárról és a skálázásról, majd egy kulcsalapú lapozás megírása két oszlop szerinti rendezéssel.
minutes: 28
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
