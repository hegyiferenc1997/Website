---
title: Gyakorlás – NoSQL
summary: Ellenőrző kérdések a NoSQL családokról, a CAP-tételről és a modellezésről, egy „melyik adatbázist válasszuk?” esettanulmány, valamint egy szorgalmi feladat beágyazott JSON-dokumentumokkal.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mit jelent pontosan a „NoSQL” név, és ellenség-e a relációs adatbázis?</summary>

Ma „Not only SQL”-ként értjük: a relációs modell mellett más adatmodellek is léteznek, és mindegyik más feladatra jó. Nem ellenségek: egy nagy rendszerben gyakran együtt dolgoznak (pl. PostgreSQL a rendelésekhez, Redis a gyorsítótárhoz).

</details>

<details>
<summary>2. Miért nehéz egy relációs adatbázist vízszintesen skálázni?</summary>

Mert a JOIN-okhoz és a több táblát érintő tranzakciókhoz a gépeknek folyamatosan egyeztetniük kellene egymással a hálózaton keresztül, ami lassú és bonyolult. A NoSQL rendszerek ezért általában lemondanak a JOIN-okról vagy a szigorú konzisztenciáról.

</details>

<details>
<summary>3. Egy webshopban a rendelés tételeit beágyaznád a rendelés dokumentumába, vagy külön tárolnád?</summary>

Beágyaznám: a tételeket szinte mindig a rendeléssel együtt olvassuk, és a rendelés lezárása után már nem változnak. A vásárló adatait viszont hivatkozással kezelném, mert sok rendelés tartozik hozzá, és a címe változhat.

</details>

<details>
<summary>4. Mi a különbség a relációs és a lekérdezés-vezérelt (Cassandra-stílusú) adatmodellezés között?</summary>

Relációsan az adatokból indulunk ki, normalizálunk, és utána bármilyen lekérdezést megírhatunk. Lekérdezés-vezérelten először a lekérdezéseket gyűjtjük össze, és mindegyikhez külön, denormalizált táblát tervezünk, amely pontosan azt szolgálja ki.

</details>

<details>
<summary>5. Mit nyerünk és mit veszítünk a végső konzisztenciával?</summary>

Nyerünk: gyorsabb írást, jobb elérhetőséget (hálózati hiba esetén is válaszol a rendszer) és könnyebb skálázást. Veszítünk: rövid ideig különböző gépek különböző (régi) adatot mutathatnak, és erre az alkalmazásnak fel kell készülnie.

</details>

## Esettanulmány: melyik adatbázist válasszuk?

Egy induló cég a következő részekből álló alkalmazást épít. Döntsd el mindegyikről, melyik adatbázistípus illik hozzá a legjobban!

```quiz required
? A bejelentkezett felhasználók munkamenetei: kulcs alapján olvasva, 30 perc után lejárnak, nagyon gyorsnak kell lennie.
+ kulcs-érték (pl. Redis)
- gráf (pl. Neo4j)
- oszlopcsalád (pl. Cassandra)
- relációs (pl. PostgreSQL)
! Memóriában, lejárati idővel.

? Termékkatalógus, ahol minden termékkategóriának más tulajdonságai vannak, és a termékeket ezekre a tulajdonságokra is szűrni kell.
- kulcs-érték (pl. Redis)
+ dokumentum (pl. MongoDB vagy PostgreSQL JSONB)
- oszlopcsalád (pl. Cassandra)
! Rugalmas szerkezet, mezőkre kereshető.

? Az okosórák másodpercenként beküldött pulzusadatai, millió felhasználótól; mindig egy felhasználó adott időszakát kérdezzük le.
- dokumentum (pl. MongoDB)
- kulcs-érték (pl. Redis)
+ oszlopcsalád (pl. Cassandra)
- gráf (pl. Neo4j)
! Óriási írásterhelés, partíció = felhasználó, rendezés = idő.

? A számlázás és a befizetések: pénzről van szó, minden tételnek pontosan stimmelnie kell.
+ relációs (pl. PostgreSQL), ACID tranzakciókkal
- kulcs-érték (pl. Redis), végső konzisztenciával
- oszlopcsalád (pl. Cassandra), ONE konzisztenciaszinttel
! Itt a helyesség a legfontosabb.

? A replikációs tényező 5. Legalább hány gép válaszát kell megvárni olvasáskor, ha íráskor 3 gépét várjuk meg, és biztosan a legfrissebb adatot akarjuk olvasni?
= 3
! W + R > N: 3 + R > 5, tehát R legalább 3.
```

## Szorgalmi feladat: beágyazott tételek

A rendeléseket dokumentumként tároljuk, a tételek **beágyazva**. Számold ki minden rendelés **végösszegét** (darabszám × ár, összegezve), rendelésazonosító szerint sorban. Ez a feladat nem kötelező.

<details>
<summary>A rendelésdokumentumok létrehozása (SQL)</summary>

```sql setup
-- Rendelések JSON-dokumentumként, a tételek beágyazva.
CREATE TABLE rendelesek (
  id  INT PRIMARY KEY,
  dok JSONB NOT NULL
);
INSERT INTO rendelesek VALUES
  (1, '{"vasarlo": "Kiss Anna", "tetelek": [
        {"termek": "Gamer egér", "db": 1, "ar": 14990},
        {"termek": "Egérpad", "db": 2, "ar": 2990}]}'),
  (2, '{"vasarlo": "Nagy Béla", "tetelek": [
        {"termek": "27 colos monitor", "db": 2, "ar": 69990}]}'),
  (3, '{"vasarlo": "Tóth Cili", "tetelek": [
        {"termek": "HDMI kábel", "db": 3, "ar": 1990},
        {"termek": "Webkamera", "db": 1, "ar": 12990},
        {"termek": "Mikrofon", "db": 1, "ar": 19990}]}');
```

</details>

```sql starter
SELECT r.id, t ->> 'termek' AS termek
FROM rendelesek r, jsonb_array_elements(r.dok -> 'tetelek') AS t;
```

<details>
<summary>Megoldás</summary>

```sql solution
SELECT r.id,
       r.dok ->> 'vasarlo' AS vasarlo,
       SUM((t ->> 'db')::INT * (t ->> 'ar')::INT) AS vegosszeg
FROM rendelesek r, jsonb_array_elements(r.dok -> 'tetelek') AS t
GROUP BY r.id, r.dok ->> 'vasarlo'
ORDER BY r.id;
```

</details>
