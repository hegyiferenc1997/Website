---
title: Mi az adatbázis, és miért van rá szükség?
summary: Adat és információ, a fájlalapú tárolás problémái, az adatbázis és az adatbázis-kezelő rendszer (DBMS) fogalma és előnyei.
minutes: 15
---

## Amit ebben a leckében megtanulsz

- mi a különbség **adat** és **információ** között,
- miért okoz gondot, ha az adatokat sima **fájlokban** tároljuk,
- mi az **adatbázis** és az **adatbázis-kezelő rendszer** (DBMS).

## Adat vagy információ?

Az **adat** nyers tény, önmagában nem mond sokat: `42`, `"ABC123"`, `2026-01-15`. Az **információ** az adat **értelmezve**, összefüggésben: _„Az ABC123 Neptun-kódú hallgató 2026. január 15-én 42 pontot ért el.”_ Az adatbázis dolga, hogy az adatokat úgy tárolja, hogy bármikor információt lehessen kinyerni belőlük.

## Az élet adatbázis nélkül

Képzeld el, hogy egy egyetem minden irodája a saját Excel-fájljában tartja nyilván a hallgatókat: a tanulmányi osztály, a kollégium és a könyvtár is. Mi történik?

| Probléma                    | Példa                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Redundancia** (ismétlődés) | Kiss Anna címe három fájlban is szerepel.                                                              |
| **Inkonzisztencia**          | Anna elköltözik, a tanulmányi osztály átírja, a kollégium nem – melyik cím az igazi?                  |
| **Nehéz lekérdezés**         | „Kik a budapesti, 3. féléves hallgatók, akiknek könyvtári tartozásuk van?” – három fájlt kell kézzel összefésülni. |
| **Egyidejű hozzáférés**      | Ketten egyszerre szerkesztik ugyanazt a fájlt: az egyik módosítás elvész.                              |
| **Biztonság**                | A fájlt vagy mindenki látja, vagy senki – nem lehet megmondani, hogy a portás csak a nevet lássa.     |
| **Adatvesztés**              | Áramszünet mentés közben: a fájl félig íródott ki, megsérült.                                          |

Ezekre a gondokra született meg az adatbázis.

## Adatbázis és DBMS

- **Adatbázis** (database): logikailag összefüggő adatok szervezett, tartós gyűjteménye, amely egy adott cél (pl. egy egyetem működése) kiszolgálására készült.
- **Adatbázis-kezelő rendszer** (DBMS, _Database Management System_): az a szoftver, amely az adatbázist létrehozza, tárolja, lekérdezi, módosítja és védi. Ilyen például a **PostgreSQL**, a **MySQL**, az **Oracle**, a **Microsoft SQL Server** vagy a **SQLite**.
- **Adatbázis-rendszer**: az adatbázis + a DBMS + az azt használó alkalmazások együtt.

Egy hasonlattal: az adatbázis a **könyvtár állománya** (a könyvek), a DBMS pedig a **könyvtáros**, aki tudja, mi hol van, kikeresi, amit kérsz, nyilvántartja a kölcsönzéseket, és nem engedi, hogy bárki hazavigye a ritka kéziratokat.

```text
 Alkalmazások (webshop, Neptun, mobilapp)
            │  kérések (pl. SQL)
            ▼
 ┌───────────────────────────────┐
 │            DBMS               │  ← lekérdezés, jogosultság, tranzakció, mentés
 └───────────────────────────────┘
            │
            ▼
 ┌───────────────────────────────┐
 │   Adatbázis (fájlok a lemezen) │
 └───────────────────────────────┘
```

## Miért jó a DBMS?

- **Egyszer tárolja** az adatokat (kevesebb redundancia), így nincs ellentmondás.
- **Lekérdezőnyelvet** ad (SQL), amellyel bonyolult kérdések is pár sorban megfogalmazhatók.
- **Integritási szabályokat** tart be (pl. a jegy csak 1–5 lehet, nem lehet két azonos Neptun-kód).
- **Többfelhasználós**: egyszerre ezrek dolgozhatnak, mégsem írják felül egymás munkáját.
- **Jogosultságkezelés**: ki mit láthat és módosíthat.
- **Mentés és helyreállítás**: áramszünet után is konzisztens állapotba áll vissza.

Ára is van: a DBMS bonyolultabb, erőforrást igényel, és meg kell tanulni kezelni – egy bevásárlólistához nem kell PostgreSQL. De ha az adat fontos, sok és sokan használják, nincs jobb megoldás.

## Összefoglalás

- Adat = nyers tény; információ = értelmezett adat.
- A fájlalapú tárolás gondjai: redundancia, inkonzisztencia, nehéz lekérdezés, egyidejűség, biztonság, adatvesztés.
- Adatbázis = összefüggő adatok szervezett gyűjteménye; DBMS = az ezt kezelő szoftver.

## A lecke feladata

```quiz required
? Melyik **információ** (és nem csak adat)?
- 42
- ABC123
+ Kiss Anna 3. féléves, budapesti hallgató.
- 2026-01-15
! Az információ értelmezett, összefüggésbe helyezett adat.

? Anna címe két irodában eltér, mert csak az egyik írta át. Hogy hívjuk ezt a problémát?
- redundancia
+ inkonzisztencia
- normalizálás
- replikáció
! Ellentmondó adatok = inkonzisztencia (a redundancia az oka).

? Mi a neve annak a szoftvernek, amely az adatbázist kezeli (rövidítéssel)?
= DBMS
= adatbázis-kezelő rendszer
= adatbázis-kezelő
! Database Management System.

? Melyik **nem** DBMS?
- PostgreSQL
- SQLite
+ Microsoft Excel
- Oracle
! Az Excel táblázatkezelő, nem adatbázis-kezelő rendszer.
```
