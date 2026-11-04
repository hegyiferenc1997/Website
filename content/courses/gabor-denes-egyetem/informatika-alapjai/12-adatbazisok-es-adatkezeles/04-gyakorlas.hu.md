---
title: Gyakorlás – adatbázisok és adatkezelés
summary: Ellenőrző kérdések és összefoglaló feladatlap a relációs modellről, az SQL-ről, a NoSQL-ről és a GDPR-ról.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Tervezz táblákat egy könyvtár számára: könyvek, olvasók, kölcsönzések. Mik a kulcsok?</summary>

`konyvek(isbn PK, cim, szerzo, ev)`, `olvasok(olvasojegy PK, nev, email)`, `kolcsonzesek(id PK, isbn FK, olvasojegy FK, kiadva, visszahozva)`. A kölcsönzés köti össze a könyvet és az olvasót (N : M kapcsolat kapcsolótáblával).

</details>

<details>
<summary>2. Írj SQL-lekérdezést, amely kilistázza a 4.0-nál jobb átlagú hallgatók nevét ábécérendben!</summary>

```sql
SELECT nev FROM hallgatok WHERE atlag > 4.0 ORDER BY nev;
```

</details>

<details>
<summary>3. Egy webshop a rendeléshez a vásárló születési dátumát és anyja nevét is kötelezően bekéri. Melyik GDPR-elvet sérti?</summary>

Az adattakarékosságot (és a célhoz kötöttséget): a rendelés teljesítéséhez ezekre az adatokra nincs szükség.

</details>

```python run
# GROUP BY Pythonban: szakonkénti létszám és átlag
hallgatok = [
    ("Kiss Anna", "mérnökinf", 4.5),
    ("Nagy Béla", "mérnökinf", 3.8),
    ("Tóth Cili", "gazdinfo", 4.1),
    ("Kovács Dénes", "mérnökinf", 3.2),
]
csoport = {}
for nev, szak, atlag in hallgatok:
    csoport.setdefault(szak, []).append(atlag)
for szak, atlagok in csoport.items():
    print(szak, len(atlagok), round(sum(atlagok) / len(atlagok), 2))
```

## Összefoglaló feladatlap

```quiz required
? Mi az elsődleges kulcs két fő tulajdonsága?
+ egyedi és nem lehet üres
- mindig szöveg és rövid
- mindig az első oszlop és szám
- bárki módosíthatja
! Egyértelműen azonosít egy rekordot.

? Melyik SQL-utasítás **módosít** meglévő sorokat?
- INSERT
+ UPDATE
- SELECT
- JOIN
! UPDATE … SET … WHERE …

? Mennyi a mérnökinf szak átlaga a fenti Python-példa szerint (két tizedesre)?
= 3.83
! (4.5 + 3.8 + 3.2) / 3 = 3.83.

? Melyik SQL-záradék csoportosít egy oszlop értékei szerint?
= GROUP BY
! Pl. GROUP BY szak.

? Melyik adatbázis jellemzően **memóriában** tárolt kulcs–érték tár, gyorsítótárnak?
- PostgreSQL
- Neo4j
+ Redis
- MongoDB
! Nagyon gyors, gyakran gyorsítótárként használják.

? Melyik jog **nem** illeti meg az érintettet a GDPR szerint?
- hozzáférés a saját adataihoz
- az adatok helyesbítése
- az adatok törlése
+ más személyek adatainak lekérése
! Csak a saját adataira vonatkoznak a jogai.
```
