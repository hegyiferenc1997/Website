---
title: Kommunikáció nem technikai szereplőkkel
summary: Kik az érintettek, hogyan gyűjts követelményeket, mi a felhasználói történet és az elfogadási feltétel, hogyan magyarázz laikusnak, és hogyan kommunikálj becsléseket és kockázatokat.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- kik az **érintettek** egy szoftverprojektben,
- hogyan gyűjts **követelményeket**,
- mi a **felhasználói történet** és az **elfogadási feltétel**,
- hogyan magyarázz egy technikai kérdést **laikusnak**,
- hogyan kommunikálj **becsléseket** és **kockázatokat**.

## Az érintettek

Az **érintett** (stakeholder) mindenki, akit a projekt érint, vagy aki hatással van rá: megrendelő, felhasználók, vezetők, ügyfélszolgálat, jogi osztály, üzemeltetés, marketing.

Mindegyiket más érdekli:

| Érintett        | Mi érdekli?                                            |
| --------------- | ------------------------------------------------------ |
| vezetőség       | költség, határidő, üzleti eredmény, kockázat           |
| felhasználó     | könnyű használat, gyorsaság, megoldja-e a problémáját  |
| ügyfélszolgálat | kevesebb panasz, érthető hibaüzenetek                  |
| jogi osztály    | adatvédelem, szerződések, szabályoknak való megfelelés |
| üzemeltetés     | stabilitás, megfigyelhetőség, egyszerű telepítés       |

A jó mérnök az érintett **nyelvén** és **szempontjai szerint** kommunikál.

## Követelmények gyűjtése

A megrendelő gyakran **megoldást** mond („kell egy gomb, ami Excelbe exportál”), pedig mögötte egy **probléma** áll („a havi jelentést kézzel másolják át, ez napokig tart”). Kérdezz a „miért” mögé (lásd harvardi módszer, 7. témakör, és „5 miért”, 3. témakör).

Hasznos kérdések:

- Milyen problémát old meg ez? Ki és milyen gyakran fogja használni?
- Mi történik most, a szoftver nélkül?
- Honnan fogjuk tudni, hogy sikerült?
- Mi az, ami **nem** része a feladatnak?

## Felhasználói történet és elfogadási feltétel

Az agilis csapatok a követelményeket gyakran **felhasználói történetként** (user story) írják le:

```text
Mint  [szerep],
szeretnék  [funkció],
hogy  [cél / érték].

Mint  pénzügyi munkatárs,
szeretném a havi rendeléseket egy kattintással táblázatba exportálni,
hogy  ne kelljen kézzel átmásolnom őket a jelentéshez.
```

Hozzá **elfogadási feltételek** (acceptance criteria) tartoznak, hogy egyértelmű legyen, mi számít késznek:

```text
- Az export egy adott hónap összes rendelését tartalmazza.
- Oszlopok: dátum, rendelésszám, összeg, státusz.
- 10 000 rendelésnél is 10 másodpercen belül elkészül.
```

## Magyarázat laikusnak

- Kezdd a **hatással** és a **döntéssel**, ne a technikai részletekkel (piramis-elv, 6. témakör).
- Használj **hasonlatot**: „Az adatbázis-index olyan, mint egy könyv tárgymutatója: nem kell minden oldalt átlapozni.”
- Kerüld a **zsargont**, vagy magyarázd meg.
- Ellenőrizd a megértést: „Mennyire volt ez érthető? Mit kérdeznél még?”

## Becslések és kockázatok

A szoftverbecslés **bizonytalan**, és ezt ki kell mondani.

- Adj **tartományt** egyetlen szám helyett: „3–5 hét, a legvalószínűbb 4.”
- Mondd el, **mitől függ**: „ha a fizetési szolgáltató API-ja a dokumentáció szerint működik”.
- Ha csúszás várható, **időben szólj**, ne az utolsó napon – a rossz hír nem lesz jobb attól, hogy később mondod.
- Kínálj **lehetőségeket**: „A határidő tartható, ha az exportot a következő kiadásra halasztjuk.”

> A „Mennyi idő?” kérdésre a „Nem tudom” nem jó válasz, a „Holnapra kész” sem, ha nem igaz. Jó válasz: „Egy napot kérek, hogy átnézzem, utána adok egy tartományt a kockázatokkal együtt.”

## Összefoglalás

- Az érintetteknek eltérő szempontjaik vannak – az ő nyelvükön kommunikálj.
- A kért megoldás mögött keresd a problémát.
- Felhasználói történet: „Mint …, szeretnék …, hogy …” + elfogadási feltételek.
- Laikusnak: hatás először, hasonlat, zsargon nélkül, megértés ellenőrzése.
- Becslés: tartomány, feltételek, korai jelzés, lehetőségek.

## A lecke feladata

```quiz required
? A megrendelő azt mondja: „Kell egy Excel-export gomb.” Mi a jó első lépés?
- azonnal elkezded fejleszteni
+ rákérdezel, milyen problémát old meg, és ki, milyen gyakran fogja használni
- elmagyarázod, hogy az Excel elavult
- azt mondod, hogy ez lehetetlen
! A kért megoldás mögött keresd a problémát.

? Melyik a felhasználói történet helyes szerkezete?
+ „Mint [szerep], szeretnék [funkció], hogy [cél].”
- „A rendszernek tudnia kell [funkció].”
- „Fejlesztő vagyok, és [funkció]-t írok.”
- „Ha [feltétel], akkor [hiba].”
! Szerep, funkció, cél.

? Melyik a legjobb válasz egy vezetőnek arra, mennyi ideig tart egy új funkció?
- „Nem tudom.”
- „Holnapra kész.” (bár ez nem igaz)
+ „3–5 hét, a legvalószínűbb 4; ez attól függ, hogy a külső API a dokumentáció szerint működik-e.”
- „Amennyi kell.”
! Tartomány + feltételek.

? Melyik hasonlat magyarázza jól egy laikusnak az adatbázis-indexet?
- „B-fa alapú adatszerkezet a lekérdezések gyorsítására.”
+ „Olyan, mint egy könyv tárgymutatója: nem kell minden oldalt átlapozni.”
- „Egy SQL-utasítás.”
- „Nem lehet elmagyarázni.”
! Hétköznapi hasonlat, zsargon nélkül.
```
