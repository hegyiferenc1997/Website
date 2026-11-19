---
title: Gyakorlás – biztonság és adatvédelem
summary: Ellenőrző kérdések az SQL-befecskendezésről, a titkosításról, a jelszavakról és a GDPR-ról, majd egy biztonsági átvilágítás: öt kódrészlet és helyzet, amelyekben meg kell találnod a hibát és a jó megoldást.
minutes: 25
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Miért véd a paraméterezett lekérdezés az SQL-befecskendezés ellen?</summary>

Mert a lekérdezés szerkezete és az adat külön jut el az adatbázishoz: a lekérdezésben csak helyőrző van, az értéket a DBMS mindig adatként kezeli, soha nem értelmezi SQL-kódként. Így az aposztrófok és kulcsszavak a bemenetben ártalmatlanok.

</details>

<details>
<summary>2. Ha van paraméterezés, miért kell még a legkisebb jogosultság elve is?</summary>

Mert a védelem több rétegű: ha valahol mégis marad egy hiba (pl. egy elfelejtett, összefűzött lekérdezés vagy egy ellopott jelszó), a támadó csak annyit tehet, amennyit az alkalmazás fiókja enged. Egy csak olvasni tudó fiókkal nem lehet táblát törölni.

</details>

<details>
<summary>3. Mi a különbség a titkosítás és a hash között, és melyik való jelszavakhoz?</summary>

A titkosítás a kulccsal visszafordítható, a hash egyirányú. Jelszavakhoz hash kell – egyedi sóval és szándékosan lassú függvénnyel (Argon2id, bcrypt) –, mert a jelszót sosem kell visszaolvasni, csak ellenőrizni.

</details>

<details>
<summary>4. Miért személyes adat egy Neptun-kód, pedig nincs benne a név?</summary>

Mert közvetve azonosít: az egyetem nyilvántartásában egyértelműen egy élő emberhez tartozik. A GDPR szerint az is személyes adat, ami csak más adatokkal összekapcsolva azonosít.

</details>

<details>
<summary>5. Mi a különbség az álnevesített és az anonim adat között?</summary>

Az álnevesített adatnál az azonosító álazonosítóra van cserélve, de a kapcsolat (külön tárolva) visszaállítható – ezért még személyes adat. Az anonim adatból semmilyen ésszerű módon nem azonosítható az ember, így arra a GDPR már nem vonatkozik.

</details>

## A gyakorlás feladata: biztonsági átvilágítás

Egy webshop kódját és működését vizsgálod. Mindegyik helyzetnél válaszd ki a legjobb megoldást!

```quiz required
? A termékkereső kódja: `db.query("SELECT * FROM termekek WHERE nev LIKE '%" + keresoszo + "%'")`. Mi a helyes javítás?
- a keresőszóból törölni az aposztrófokat
+ paraméterezett lekérdezés: `db.query("SELECT * FROM termekek WHERE nev LIKE $1", ["%" + keresoszo + "%"])`
- a keresőszót nagybetűssé alakítani
- a lekérdezést tárolt eljárásba tenni, de továbbra is összefűzéssel
! A % jelek az érték részei, a szerkezetben csak a helyőrző marad.

? A felhasználók táblájában a jelszó oszlop SHA-256 hash-t tárol, só nélkül. Mi a legnagyobb gond?
+ az egyforma jelszavak hash-e egyforma, és a gyors hash miatt a jelszavak tömegesen végigpróbálhatók
- a SHA-256 visszafejthető a kulccsal
- a hash túl sok helyet foglal
- semmi, ez így biztonságos
! Só + lassú jelszó-hash (Argon2id, bcrypt) kell.

? A webalkalmazás a `postgres` szuperfelhasználóval csatlakozik az adatbázishoz. Mit javasolsz?
- semmit, így biztosan minden működik
+ egy külön szerepkört csak a szükséges táblákra és műveletekre
- a szuperfelhasználó jelszavának megváltoztatását évente
! A legkisebb jogosultság elve.

? Az éjszakai mentések titkosítatlanul kerülnek egy nyilvánosan is elérhető objektumtár-vödörbe. Mi a teendő?
- semmi, a mentésekre nem vonatkoznak a szabályok
+ a mentéseket titkosítani, és a vödör hozzáférését szigorúan korlátozni
- a mentéseket ritkábban készíteni
- csak a mentés fájlnevét megváltoztatni
! A mentés ugyanannyi személyes adatot tartalmaz, mint az adatbázis.

? Egy vásárló kéri, hogy töröljék az adatait. Az adatai hét táblában vannak. Mi a helyes hozzáállás?
- csak a vasarlok táblából törölni a sort
+ minden táblában törölni vagy anonimizálni az adatait (a jogszabályi megőrzési kötelezettség alá eső adatok, pl. számlák kivételével), és ezt dokumentálni
- elutasítani, mert túl bonyolult
- a vásárlót inaktívnak jelölni, de minden adatát megtartani
! A törléshez való jog minden olyan adatra vonatkozik, amelyet nem kötelező megőrizni.
```
