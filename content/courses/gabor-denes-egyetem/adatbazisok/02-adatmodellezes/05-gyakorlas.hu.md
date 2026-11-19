---
title: Gyakorlás – adatmodellezés
summary: Ellenőrző kérdések és összefoglaló feladatlap a modellezési szintekről, a modellezés lépéseiről, az adattípusokról és a megszorításokról.
minutes: 20
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a különbség a logikai és a fizikai modell között?</summary>

A **logikai** modell a táblákat, mezőket és kulcsokat írja le, de még bármelyik relációs DBMS-re jó. A **fizikai** modell egy konkrét rendszerhez készül: pontos adattípusok (`VARCHAR(80)`, `NUMERIC(10,2)`), indexek, tárolási beállítások, `CREATE TABLE` utasítások.

</details>

<details>
<summary>2. Miért érdemes a követelmények gyűjtésekor a kivételekre is rákérdezni?</summary>

Mert a modell szerkezete gyakran épp a kivételeken múlik. Ha kiderül, hogy egy hallgatónak lehet két szakja, a hallgató–szak kapcsolat 1 : N helyett N : M lesz, ami egy új táblát jelent. Ezt a terven percek alatt, egy éles rendszerben napok alatt lehet átvezetni.

</details>

<details>
<summary>3. Miért ne tároljunk pénzt REAL vagy DOUBLE PRECISION típusban?</summary>

Mert a lebegőpontos számok kettes számrendszerben közelítő értékek, így például a `0.1 + 0.2` nem pontosan `0.3`. Sok tranzakció után a kerekítési hibák összeadódnak. A `NUMERIC` pontos tizedes számot tárol.

</details>

<details>
<summary>4. Mi a különbség a PRIMARY KEY és a UNIQUE között?</summary>

Mindkettő tiltja az ismétlődést, de a `PRIMARY KEY` ezen felül **nem lehet NULL**, és táblánként csak **egy** van belőle – ez a sor „hivatalos” azonosítója. `UNIQUE` megszorításból több is lehet (pl. e-mail, adóazonosító), és ezek általában megengedik a NULL-t.

</details>

<details>
<summary>5. Miért jobb, ha a hibás adatot az adatbázis utasítja vissza, és nem csak az alkalmazás ellenőrzi?</summary>

Mert egy adatbázist több program is használhat (webes felület, mobilapp, importáló szkript, egy admin kézzel). Ha a szabály csak az egyik programban van, a többin keresztül hibás adat kerülhet be. Az adatbázis-megszorítás mindenkire vonatkozik.

</details>

## Összefoglaló feladatlap

Egy **kutyamenhely** szeretné nyilvántartani a kutyákat (név, fajta, születési év, chipszám), az örökbefogadókat (név, telefonszám, lakcím) és az örökbefogadásokat (melyik kutyát ki, mikor fogadta örökbe). Egy kutyát legfeljebb egyszer fogadnak örökbe, de egy család több kutyát is hazavihet.

```quiz required
? Hány egyed van a leírásban (az örökbefogadás kapcsolatot nem számítva)?
= 2
! Kutya és örökbefogadó.

? Milyen számosságú az örökbefogadó és a kutya kapcsolata?
- 1 : 1
+ 1 : N
- N : M
! Egy család több kutyát, egy kutyát egy család.

? Milyen típusban tárold a **telefonszámot**?
- INT
- NUMERIC(11, 0)
+ VARCHAR(20)
- REAL
! Nem számolunk vele, és a kezdő 0 vagy a + jel is számít.

? Melyik megszorítás biztosítja, hogy két kutyának ne lehessen ugyanaz a chipszáma (ha nem ez az elsődleges kulcs)?
- NOT NULL
+ UNIQUE
- DEFAULT
- CHECK
! Az egyediséget a UNIQUE biztosítja.

? Hogyan szól az a CHECK feltétel, amely szerint a születési év legalább 2000? (csak a zárójel tartalma, pl. ar > 0)
= szuletesi_ev >= 2000
= szuletesi_ev>=2000
= ev >= 2000
= ev>=2000
! CHECK (szuletesi_ev >= 2000)

? Melyik modellezési szinten döntjük el, hogy a chipszám `VARCHAR(15)` lesz?
- fogalmi
- logikai
+ fizikai
! Konkrét adattípus = fizikai modell.
```
