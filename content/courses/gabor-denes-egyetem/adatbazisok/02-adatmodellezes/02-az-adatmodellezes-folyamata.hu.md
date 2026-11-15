---
title: Az adatmodellezés folyamata
summary: A követelmények összegyűjtésétől a kész sémáig – egyedek és tulajdonságok kigyűjtése a szövegből, kapcsolatok, ellenőrzés, elnevezési szabályok és adatszótár.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- milyen **lépésekben** készül egy adatmodell,
- hogyan találod meg egy szöveges leírásban az **egyedeket**, a **tulajdonságokat** és a **kapcsolatokat**,
- milyen **elnevezési szabályokat** érdemes követni.

## A lépések

```text
 1. Követelmények    →  2. Egyedek és     →  3. Kapcsolatok  →  4. Logikai séma  →  5. Ellenőrzés
    összegyűjtése         tulajdonságok         és számosság       (táblák, kulcsok)     (normalizálás,
    (interjú, űrlapok)                                                                    példaadatok)
```

A folyamat **nem egyirányú**: az ellenőrzésnél gyakran kiderül, hogy valamit félreértettünk, és vissza kell lépni.

### 1. Követelmények összegyűjtése

Beszélgess a jövendő felhasználókkal, nézd meg a meglévő **űrlapokat, táblázatokat, jelentéseket**. Kérdezz rá a kivételekre is: _„Lehet egy hallgatónak két szakja?”_, _„Mi történik, ha egy tárgyat megszüntetnek?”_ A legtöbb modellezési hiba abból fakad, hogy ezt valaki nem kérdezte meg.

### 2. Egyedek és tulajdonságok – a „főnévvadászat”

Egy egyszerű, de nagyon hatásos trükk: a követelményleírásban a **főnevek** gyakran **egyedek** vagy **tulajdonságok**, az **igék** gyakran **kapcsolatok**.

> Egy **edzőterem** nyilvántartja a **tagokat** (**név**, **e-mail**, **születési dátum**) és az **edzőket** (**név**, **szakterület**). Minden **órát** (**megnevezés**, **időpont**, **terem**) egy edző **tart**, a tagok pedig **jelentkeznek** az órákra.

- Egyedek (önálló „dolgok”, amelyekből sok van): **tag**, **edző**, **óra**.
- Tulajdonságok (egy egyedet írnak le): név, e-mail, születési dátum, szakterület, megnevezés, időpont, terem.
- Kapcsolatok (igék): edző **tart** órát, tag **jelentkezik** órára.

Tipp: ha egy főnévnek **saját tulajdonságai** vannak, vagy **több helyen** hivatkoznánk rá, valószínűleg egyed. A „terem” lehetne egyed is (kapacitás, emelet), ha ezekre is szükség van.

### 3. Kapcsolatok és számosság

Minden kapcsolatnál tisztázd: **hány** kapcsolódhat egymáshoz mindkét irányból?

- Egy edző **több** órát tart, egy órát **egy** edző tart → **1 : N**.
- Egy tag **több** órára jelentkezik, egy órára **több** tag jelentkezik → **N : M**.

Az 5. témakörben (E-K modell) ezt részletesen megtanulod rajzolni.

### 4. Logikai séma

```text
 tag(tag_id PK, nev, email, szuletett)
 edzo(edzo_id PK, nev, szakterulet)
 ora(ora_id PK, megnevezes, idopont, terem, edzo_id FK → edzo)
 jelentkezes(tag_id FK → tag, ora_id FK → ora)   ← az N:M kapcsolat saját táblát kap
```

### 5. Ellenőrzés

- **Példaadatokkal** „játszd végig”: be tudod-e írni egy valós hét óráit? Le tudod-e kérdezni, ki jár Anna óráira?
- Nézd meg, nincs-e **ismétlődő** adat (6. témakör: normalizálás).
- Mutasd meg a megrendelőnek.

## Elnevezési szabályok

Mindegy, melyiket választod, de **egy projekten belül következetesen** használd:

- kisbetűs, aláhúzásos nevek: `szuletesi_datum` (nem `SzuletesiDatum`, nem `szül. dátum`),
- ékezet és szóköz nélkül (sok eszköz nem bírja),
- tábla: többes vagy egyes szám – válassz egyet (`hallgatok` vagy `hallgato`),
- elsődleges kulcs: `id` vagy `tabla_id`; idegen kulcs: a hivatkozott tábla neve + `_id`.

## Adatszótár

Az **adatszótár** egy táblázat, amely minden mezőről leírja, mit jelent, milyen típusú, kötelező-e, és milyen értékei lehetnek. Később aranyat ér, amikor egy új kolléga (vagy te fél év múlva) próbálja megérteni, mi az a `stat_kod`.

| Mező        | Jelentés                 | Típus        | Kötelező | Szabály          |
| ----------- | ------------------------ | ------------ | -------- | ---------------- |
| `email`     | a tag e-mail címe        | szöveg (120) | igen     | egyedi           |
| `szuletett` | születési dátum          | dátum        | nem      | nem lehet jövőbeli |

## Összefoglalás

- Lépések: követelmények → egyedek és tulajdonságok → kapcsolatok → logikai séma → ellenőrzés (és vissza, ha kell).
- Főnevek ≈ egyedek / tulajdonságok, igék ≈ kapcsolatok.
- Következetes elnevezés és adatszótár.

## A lecke feladata

Olvasd el a leírást, és válaszolj!

> Egy **kölcsönző** **autókat** (rendszám, típus, napidíj) ad bérbe **ügyfeleknek** (név, jogosítványszám). Egy ügyfél több autót is bérelhet (különböző időszakokban), és egy autót sok ügyfél bérel az évek során.

```quiz required
? Hány **egyed** van a leírásban (a kölcsönzőt magát nem számítva)?
= 2
! Autó és ügyfél.

? Mi a „napidíj”?
- egyed
+ tulajdonság
- kapcsolat
! Az autót írja le.

? Milyen számosságú az ügyfél és az autó közötti „bérel” kapcsolat?
- 1 : 1
- 1 : N
+ N : M
! Egy ügyfél több autót, egy autót több ügyfél.

? Hány táblát kapunk a logikai sémában, ha az N : M kapcsolat saját táblát kap?
= 3
! ugyfel, auto, berles.

? Melyik oszlopnév követi a lecke elnevezési szabályait?
- Születési Dátum
- SzuletesiDatum
+ szuletesi_datum
- szül.dátum
! Kisbetű, aláhúzás, ékezet és szóköz nélkül.
```
