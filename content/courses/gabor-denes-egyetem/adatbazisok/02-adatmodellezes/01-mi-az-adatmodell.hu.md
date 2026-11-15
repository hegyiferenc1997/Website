---
title: Mi az adatmodell?
summary: Az adatmodell három része (szerkezet, műveletek, megszorítások), valamint a fogalmi, a logikai és a fizikai modell szintjei egy hétköznapi példán.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi az **adatmodell**, és miből áll,
- mi a különbség a **fogalmi**, a **logikai** és a **fizikai** modell között,
- miért éri meg modellezni, mielőtt egyetlen táblát is létrehoznál.

## Mint egy ház tervrajza

Házat sem úgy építünk, hogy elkezdjük rakni a téglát. Először vázlat készül („három szoba, nagy konyha”), aztán pontos tervrajz (falvastagság, méretek), végül kivitelezési terv (milyen tégla, melyik cégtől). Az adatbázis is így készül: az **adatmodell** a valóság egy darabjának leegyszerűsített, pontos leírása, amelyből később az adatbázis épül.

## Az adatmodell három része

1. **Szerkezet**: milyen adatokat tárolunk, és azok hogyan kapcsolódnak (pl. hallgató, tárgy, jelentkezés).
2. **Műveletek**: mit lehet az adatokkal csinálni (lekérdezés, beszúrás, módosítás, törlés).
3. **Megszorítások** (integritási szabályok): mi számít érvényes adatnak (pl. a jegy 1 és 5 közötti egész, minden hallgatónak van neve).

## A modellezés három szintje

| Szint       | Kérdés                       | Kinek szól              | Eszköz, példa                                  |
| ----------- | ---------------------------- | ----------------------- | ---------------------------------------------- |
| **Fogalmi** | _Mit_ akarunk nyilvántartani? | megrendelő, felhasználó | E-K (entitás-kapcsolat) diagram, szöveges leírás |
| **Logikai** | Milyen _szerkezetben_?        | tervező, fejlesztő      | relációs séma: táblák, oszlopok, kulcsok       |
| **Fizikai** | Hogyan egy _konkrét_ DBMS-ben? | fejlesztő, DBA          | `CREATE TABLE` utasítások, típusok, indexek    |

Nézzük ugyanazt a feladatot mindhárom szinten: _„Egy könyvtár nyilvántartja a könyveket és az olvasókat, és hogy ki melyik könyvet kölcsönözte ki.”_

**Fogalmi modell** – csak a fogalmak és kapcsolataik, technikai részletek nélkül:

```text
 [Olvasó] ──── kölcsönöz ──── [Könyv]
   név, e-mail      dátum       cím, szerző, ISBN
```

**Logikai modell** – táblák, mezők, kulcsok (még mindig bármilyen relációs DBMS-re jó):

```text
 olvaso(olvaso_id PK, nev, email)
 konyv(isbn PK, cim, szerzo)
 kolcsonzes(olvaso_id FK, isbn FK, datum)
```

**Fizikai modell** – egy konkrét rendszerre (itt PostgreSQL), típusokkal:

```sql
CREATE TABLE olvaso (
  olvaso_id SERIAL PRIMARY KEY,
  nev       VARCHAR(80) NOT NULL,
  email     VARCHAR(120) UNIQUE
);
```

## Miért éri meg?

- A hibát a **terven** a legolcsóbb javítani: egy vonalat átrajzolni a diagramon percek, egy éles, milliónyi sort tartalmazó táblát átalakítani napok.
- A fogalmi modellről a **megrendelővel** is lehet beszélni („Igen, egy olvasó egyszerre több könyvet is kivihet”), az SQL-ről nem.
- A jó modell **egyszer** tárolja az adatokat, így elkerüli az előző témakörben látott redundanciát és inkonzisztenciát.

## Összefoglalás

- Adatmodell = szerkezet + műveletek + megszorítások.
- Fogalmi (mit?), logikai (milyen szerkezetben?), fizikai (hogyan, melyik DBMS-ben?).
- Előbb modellezz, aztán építs: a terven javítani a legolcsóbb.

## A lecke feladata

```quiz required
? Melyik **nem** része az adatmodellnek?
- szerkezet
- műveletek
- megszorítások
+ a szerver processzorának típusa
! Az adatmodell a szerkezetet, a műveleteket és a megszorításokat írja le.

? Melyik modellezési szinten jelennek meg a `CREATE TABLE` utasítások és a konkrét adattípusok?
- fogalmi
- logikai
+ fizikai
! A fizikai modell egy konkrét DBMS-hez készül.

? Melyik szint modelljét érdemes a megrendelővel megbeszélni?
+ fogalmi
- logikai
- fizikai
! Technikai részletek nélkül, közérthetően.

? „A jegy csak 1 és 5 közötti egész szám lehet.” Az adatmodell melyik részébe tartozik ez a szabály?
- szerkezet
- műveletek
+ megszorítások
! Integritási szabály = megszorítás.
```
