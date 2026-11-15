---
title: Gyakorlás – normalizálás és integritás
summary: Ellenőrző kérdések és egy normalizálási feladat (könyvtári kölcsönzések) a nyers táblától a 3NF-ig, az integritási szabályokkal együtt.
minutes: 30
kind: practice
---

## Ellenőrző kérdések

<details>
<summary>1. Mi a közös oka a módosítási, beszúrási és törlési anomáliának?</summary>

Hogy egy táblában **több különböző dolog** (pl. hallgató, tárgy és jelentkezés) adatai keverednek, ezért ugyanaz az információ többször szerepel, és egyes adatok csak más adatokkal együtt tárolhatók.

</details>

<details>
<summary>2. Miért nem sértheti egy egyoszlopos kulcsú tábla a 2NF-et?</summary>

Mert a 2NF a **részleges** függőséget tiltja, vagyis azt, hogy egy attribútum a kulcsnak csak egy részétől függjön. Egy egyetlen oszlopból álló kulcsnak nincs valódi része.

</details>

<details>
<summary>3. Mi a különbség az ON DELETE CASCADE és az ON DELETE SET NULL között?</summary>

`CASCADE`-nél a szülő sor törlésekor a rá hivatkozó gyerek sorok is törlődnek. `SET NULL`-nál a gyerek sorok megmaradnak, csak az idegen kulcsuk NULL lesz. Az első akkor jó, ha a gyerek a szülő nélkül értelmetlen (rendelés tételei), a második, ha önállóan is megáll (blogposzt a törölt szerző után).

</details>

<details>
<summary>4. Miért veszélyes a számlákra mutató idegen kulcsot CASCADE-del létrehozni?</summary>

Mert egy vevő törlése magával vinné az összes számláját, pedig a számlákat jogszabály miatt évekig meg kell őrizni. Itt `RESTRICT` (vagy a vevő „inaktívvá” tétele törlés helyett) a biztonságos megoldás.

</details>

<details>
<summary>5. Ha a normalizálás ennyire jó, miért denormalizálnak mégis néha?</summary>

Mert a normalizált séma sok összekapcsolást igényel, ami nagyon nagy, olvasásra optimalizált (elemző) rendszerekben lassú lehet. Ilyenkor tudatosan tárolunk ismétlődő vagy előre kiszámolt adatot, vállalva, hogy frissítéskor figyelni kell rá.

</details>

## Összefoglaló feladat: könyvtári kölcsönzések

Egy könyvtár egyetlen táblában tartja a kölcsönzéseket:

| olvaso_id | olvaso_nev | olvaso_tel  | isbn | cim        | szerzo     | kiado     | kiado_varos | kolcsonzes_datum |
| --------- | ---------- | ----------- | ---- | ---------- | ---------- | --------- | ----------- | ---------------- |
| 1         | Kiss Anna  | 06301112222 | 111  | SQL alapok | Nagy Gábor | TechKönyv | Budapest    | 2026-10-01       |
| 1         | Kiss Anna  | 06301112222 | 222  | Python     | Tóth Éva   | KódKiadó  | Szeged      | 2026-10-05       |
| 2         | Szabó Dani | 06209998888 | 111  | SQL alapok | Nagy Gábor | TechKönyv | Budapest    | 2026-10-07       |

A kulcs `(olvaso_id, isbn, kolcsonzes_datum)`. Egy könyvnek egy szerzője és egy kiadója van.

```quiz required
? Teljesül-e az 1NF (minden cella atomi)?
+ igen
- nem
! Nincs lista egyetlen cellában sem.

? Melyik részleges függőség?
- (olvaso_id, isbn, kolcsonzes_datum) → semmi
+ isbn → cim, szerzo, kiado
- kiado → kiado_varos
- olvaso_nev → olvaso_id
! A könyv adatai csak az ISBN-től függenek, ami a kulcs része.

? Melyik tranzitív függőség marad a könyvek táblájában a 2NF után?
- isbn → cim
+ isbn → kiado → kiado_varos
- olvaso_id → olvaso_nev
- isbn → szerzo
! A kiadó városa a kiadótól függ, nem közvetlenül a könyvtől.

? Hány táblát kapsz 3NF-ben? (olvasók, könyvek, kiadók, kölcsönzések)
= 4
! olvasok, konyvek, kiadok, kolcsonzesek.

? Egy olvasót törölni akarunk, de a kölcsönzési előzményeit statisztikához meg kell tartani, olvasó nélkül. Melyik ON DELETE beállítás illik a kölcsönzések olvaso_id idegen kulcsához?
- CASCADE
+ SET NULL
- RESTRICT
! A kölcsönzés megmarad, csak az olvasó lesz ismeretlen.

? Melyik integritási fajtát biztosítja a `CHECK (kolcsonzes_datum <= CURRENT_DATE)`?
- egyedintegritás
- hivatkozási integritás
+ tartományintegritás
! Az érték megengedett tartományát szabja meg.
```
