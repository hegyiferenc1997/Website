---
title: Szakmai és nyílt forráskódú közösségek
summary: Hogyan tegyél fel jó kérdést, hogyan írj issue-t és pull requestet, hogyan adj és fogadj kódátnézést, és mit jelent a magatartási kódex egy szakmai közösségben.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan tegyél fel **jó kérdést** egy szakmai fórumon,
- hogyan írj jó **issue-t** és **pull requestet**,
- hogyan adj és fogadj **kódátnézést**,
- mi a **magatartási kódex**.

## Jó kérdés feltevése

Egy szakmai fórumon (pl. Stack Overflow, Discord, egy projekt vitafóruma) önkéntesek segítenek – tiszteld az idejüket.

1. **Keress előbb**: lehet, hogy már megválaszolták.
2. **Beszédes cím**: „TypeError: 'NoneType' object is not subscriptable egy JSON-válasz feldolgozásakor” a „Segítség, nem működik!!!” helyett.
3. **Mit akarsz elérni**, és **mi történik** helyette.
4. **Minimális, reprodukálható példa**: a lehető legrövidebb kód, amely előidézi a hibát (nem a teljes projekt).
5. A pontos **hibaüzenet** szövegként (nem képernyőképként).
6. **Mit próbáltál már**.
7. Környezet: nyelv- és könyvtárverzió, operációs rendszer.
8. Ha megoldódott, **írd meg a megoldást** – másoknak is segít.

## Issue és pull request

A nyílt forráskódú projektekben az **issue** (hibajegy, javaslat) és a **pull request** (PR, változtatási javaslat) a kommunikáció fő eszköze.

**Jó issue**: olyan, mint egy jó hibajelentés (lásd 6. témakör) – környezet, lépések, várt és tényleges eredmény. Javaslatnál: milyen problémát oldana meg.

**Jó pull request:**

- **kicsi** és **egy célú** – egy PR, egy változtatás,
- a leírás elmondja, **mit** és **miért** változtat, és hogyan lehet **kipróbálni**,
- hivatkozik a kapcsolódó issue-ra (pl. „Fixes #42”),
- követi a projekt **hozzájárulási útmutatóját** (`CONTRIBUTING.md`) és kódstílusát.

> Mielőtt egy nagy változtatáson dolgoznál, nyiss egy issue-t, és kérdezd meg a karbantartókat, szívesen fogadnák-e. Így nem dolgozol hetekig egy olyan PR-on, amelyet nem tudnak elfogadni.

## Kódátnézés – adni

- A **kódról** beszélj, ne az emberről: „ez a függvény…”, nem „te mindig…”.
- **Kérdezz** állítás helyett, ha nem vagy biztos: „Mi lenne, ha itt egy szótárat használnánk?”
- **Indokolj**: miért jobb a javaslatod (olvashatóság, teljesítmény, biztonság).
- Jelöld a **súlyosságot**: mi kötelező, és mi csak ötlet (pl. „apróság:”, „nem kötelező:”).
- **Dicsérj** is, ha valami jó megoldás.

## Kódátnézés – fogadni

- A megjegyzés a **kódról** szól, nem rólad.
- Ha nem érted, **kérdezz vissza**.
- Ha nem értesz egyet, **indokolj** tárgyszerűen; ha mégis igaza van a másiknak, fogadd el.
- **Köszönd meg** – valaki időt szánt arra, hogy jobb legyen a kódod.

## Magatartási kódex

Sok közösség és projekt rendelkezik **magatartási kódexszel** (Code of Conduct, pl. a széles körben használt _Contributor Covenant_). Ez rögzíti:

- az elvárt viselkedést (tisztelet, befogadás, építő kritika),
- az elfogadhatatlan viselkedést (zaklatás, sértegetés, diszkrimináció),
- hogyan lehet jelezni a megsértését, és mi a következménye.

A kódex célja, hogy mindenki **biztonságban** érezhesse magát, és szívesen hozzájáruljon – különösen a kezdők.

## Közösségi jelenlét

- **Meetupok**, konferenciák, hackathonok – kapcsolatépítés és tanulás (lásd 9. témakör).
- **Előadás** egy meetupon – nagyszerű prezentációs gyakorlat (4. témakör) és márkaépítés (12. témakör).
- **Dokumentáció** javítása – a legkönnyebb első hozzájárulás egy nyílt forráskódú projekthez; sok projekt „good first issue” címkével jelöli a kezdőknek való feladatokat.

## Összefoglalás

- Jó kérdés: keress előbb, beszédes cím, minimális példa, pontos hibaüzenet, mit próbáltál.
- Jó PR: kicsi, egy célú, leírja a mit, miért és hogyan próbáld ki; nagy változtatás előtt issue.
- Kódátnézés: a kódról, kérdezve, indokolva, súlyosságot jelölve; fogadáskor köszönd meg.
- A magatartási kódex biztonságos, befogadó közösséget teremt.

## A lecke feladata

```quiz required
? Melyik a legjobb kérdéscím egy szakmai fórumon?
- „Segítség!!!”
- „Nem működik a kódom”
+ „TypeError: 'NoneType' object is not subscriptable egy JSON-válasz feldolgozásakor”
- „Python”
! Beszédes, konkrét.

? Mi a **minimális, reprodukálható példa**?
- a teljes projekt feltöltése
+ a lehető legrövidebb kód, amely még előidézi a hibát
- egy képernyőkép a hibáról
- a hiba szóbeli leírása
! Így mások gyorsan ki tudják próbálni.

? Melyik a jó kódátnézési megjegyzés?
- „Ez borzalmas.”
- „Te mindig túlbonyolítod.”
+ „Mi lenne, ha itt szótárat használnánk? Így a keresés gyorsabb lenne nagy listáknál.”
- „Írd át.”
! A kódról, kérdezve, indokolva.

? Mire való egy közösség **magatartási kódexe**?
- a kódstílus meghatározására
+ az elvárt és az elfogadhatatlan viselkedés rögzítésére, hogy mindenki biztonságban érezze magát
- a licenc meghatározására
- a verziószámozásra
! Code of Conduct.
```
