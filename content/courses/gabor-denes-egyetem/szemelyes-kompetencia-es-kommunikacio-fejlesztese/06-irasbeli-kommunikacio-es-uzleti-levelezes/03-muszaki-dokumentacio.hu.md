---
title: Műszaki dokumentáció és közérthető írás
summary: A piramis-elv, a közérthető fogalmazás szabályai, a jó README, a jó hibajelentés és egy rövid specifikáció felépítése.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- a **piramis-elvet**,
- a **közérthető fogalmazás** szabályait,
- mi kerüljön egy **README**-be,
- hogyan írj jó **hibajelentést**,
- egy rövid **specifikáció** szerkezetét.

## A piramis-elv

Barbara Minto (McKinsey) módszere: kezdd a **következtetéssel**, utána jöjjenek az alátámasztó érvek, végül a részletek.

```text
          ┌──────────────────────┐
          │   Fő üzenet / döntés │
          └──────────┬───────────┘
        ┌────────────┼────────────┐
     érv 1         érv 2        érv 3
     részletek    részletek    részletek
```

Az iskolai fogalmazás (bevezetés → kifejtés → végén a konklúzió) helyett az üzleti és műszaki írásban a **konklúzió jön először** – mert az olvasó lehet, hogy csak az első bekezdésig jut.

## Közérthető fogalmazás

- **Rövid mondatok**: egy mondat, egy gondolat.
- **Ismert szavak**; a szakszót első használatkor magyarázd meg.
- **Aktív szerkezet**: „A szkript törli az ideiglenes fájlokat”, nem „Az ideiglenes fájlok törlésre kerülnek”.
- **Egységes fogalomhasználat**: ha egyszer „felhasználó”, ne legyen a következő bekezdésben „ügyfél” ugyanarra.
- **Formázás**: címsorok, felsorolások, táblázatok, kódblokkok – az olvasó átfutja a szöveget, mielőtt elolvasná.

## A jó README

A **README** egy projekt névjegye és használati útmutatója. Jó szerkezet:

````text
# Projekt neve

Egy mondat: mit csinál és kinek.

## Telepítés
```bash
git clone https://github.com/pelda/projekt.git
cd projekt
pnpm install
```

## Használat
Egy rövid példa a leggyakoribb esetre.

## Fejlesztés
Tesztek futtatása, kódstílus, hogyan lehet hozzájárulni.

## Licenc
MIT
````

Próba: egy új csapattag a README alapján **segítség nélkül** el tudja indítani a projektet?

## A jó hibajelentés

Egy rossz hibajelentés: „Nem működik a mentés.” Egy jó:

```text
Cím: Mentés gomb 500-as hibát ad, ha a leírás 1000 karakternél hosszabb

Környezet: Chrome 131, Windows 11, éles oldal, v2.4.1

Lépések:
1. Bejelentkezés tesztfelhasználóval
2. Új bejegyzés → leírásba 1200 karakter
3. Mentés gombra kattintás

Várt eredmény: a bejegyzés elmentődik
Tényleges eredmény: „Hiba történt” üzenet, a konzolban 500-as válasz

Gyakoriság: mindig reprodukálható
Melléklet: képernyőkép, konzolnapló
```

A legfontosabb a **reprodukálható lépések** és a **várt vs. tényleges** eredmény.

## Rövid specifikáció

Egy új funkció leírása (sok csapatnál RFC vagy design doc a neve):

1. **Probléma** – mi a gond, kinek.
2. **Cél és nem-cél** – mit old meg, és mit **nem** (ez legalább olyan fontos).
3. **Javasolt megoldás** – áttekintés, ábra.
4. **Alternatívák** – mit vettünk még fontolóra, és miért nem azt.
5. **Kockázatok, nyitott kérdések**.
6. **Mérőszám** – honnan tudjuk, hogy sikerült.

## Összefoglalás

- Piramis-elv: a következtetés elöl.
- Rövid mondatok, aktív szerkezet, egységes fogalmak, jó formázás.
- README: mit csinál, telepítés, használat, fejlesztés, licenc.
- Hibajelentés: környezet, lépések, várt és tényleges eredmény.
- Specifikáció: probléma, cél és nem-cél, megoldás, alternatívák, kockázatok, mérőszám.

## A lecke feladata

```quiz required
? Mit mond a **piramis-elv**?
- a részletekkel kezdj, a végén jöjjön a következtetés
+ a következtetéssel kezdj, utána az érvek, végül a részletek
- minden bekezdés legyen egyforma hosszú
- a dokumentum legyen háromszög alakú
! Az olvasó lehet, hogy csak az elejét olvassa el.

? Melyik mondat követi a közérthető fogalmazás szabályait?
- „Az ideiglenes fájlok törlésre kerülnek a szkript által.”
+ „A szkript törli az ideiglenes fájlokat.”
- „Az ideiglenes fájlok szkript általi eltávolítása megtörténik.”
- „Törlés: ideiglenes, fájlok, szkript.”
! Aktív, rövid, egyértelmű.

? Mi a legfontosabb egy hibajelentésben?
- a hiba okának pontos megnevezése
+ a reprodukálható lépések, valamint a várt és a tényleges eredmény
- minél több felkiáltójel
- a fejlesztő neve, aki elrontotta
! Ezek alapján tudja a fejlesztő előidézni és javítani.

? Miért fontos a specifikációban a **nem-célok** felsorolása?
- mert így hosszabb lesz
+ mert tisztázza, mit nem old meg a funkció, és így elkerülhető a terjedelem kúszása
- mert kötelező formai elem
- mert így senki nem kérdez
! Világos határok, kevesebb félreértés.
```
