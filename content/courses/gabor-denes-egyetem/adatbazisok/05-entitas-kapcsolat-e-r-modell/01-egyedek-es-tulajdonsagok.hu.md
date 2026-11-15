---
title: Egyedek és tulajdonságok
summary: Egyed és egyedhalmaz, a tulajdonságok fajtái (egyszerű, összetett, egyértékű, többértékű, származtatott, kulcs) és jelölésük az E-R diagramon.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi az **egyed** (entitás) és az **egyedhalmaz**,
- milyen fajtái vannak a **tulajdonságoknak** (attribútumoknak),
- hogyan **rajzoljuk** le őket az E-R diagramon.

## Az E-R modell

Az **entitás-kapcsolat modell** (_Entity-Relationship_, E-R; magyarul gyakran **E-K modell**) Peter Chen 1976-os ötlete: a világot **dolgok** (egyedek), azok **jellemzői** (tulajdonságok) és a dolgok közötti **kapcsolatok** segítségével írjuk le. Ez a legnépszerűbb **fogalmi** modellezési eszköz: egyszerű rajz, amelyet a megrendelő is megért, és amelyből szinte gépiesen táblák készíthetők.

## Egyed és egyedhalmaz

- **Egyed** (entitás): a valóság egy konkrét, megkülönböztethető „dolga”: _Kiss Anna_, _az Adatbázisok tárgy_, _a 101-es terem_.
- **Egyedhalmaz** (egyedtípus): az azonos jellegű egyedek összessége: _Hallgató_, _Tárgy_, _Terem_.

A diagramon az egyedhalmazt **téglalap** jelöli. A hétköznapokban az egyedhalmazt is egyszerűen „egyednek” hívjuk – a szövegkörnyezetből kiderül, melyikről van szó.

Egyed lehet **kézzelfogható** dolog (autó, könyv, termék) és **elvont** fogalom is (rendelés, kölcsönzés, időpontfoglalás).

## A tulajdonságok fajtái

A tulajdonság (attribútum) egy egyedhalmaz jellemzője. A Chen-féle jelölésben **ellipszis**, vonallal kötve a téglalaphoz.

| Fajta              | Jelentés                                         | Példa                                 | Jelölés              |
| ------------------ | ------------------------------------------------ | ------------------------------------- | -------------------- |
| **Egyszerű**       | nem bontható tovább                              | születési dátum                       | ellipszis            |
| **Összetett**      | részekre bontható                                | lakcím = irányítószám + város + utca  | ellipszis, belőle további ellipszisek |
| **Egyértékű**      | egy egyednél egy értéke van                      | Neptun-kód                            | ellipszis            |
| **Többértékű**     | egy egyednél több értéke is lehet                | telefonszámok, nyelvtudás             | **dupla** ellipszis  |
| **Származtatott**  | más tulajdonságokból kiszámítható                | életkor (a születési dátumból)        | **szaggatott** ellipszis |
| **Kulcs**          | egyértelműen azonosítja az egyedet               | Neptun-kód                            | **aláhúzott** név    |

```text
                (neptun)          ((telefonszám))
                 ‾‾‾‾‾‾              dupla: többértékű
                   │                    │
   (név) ────── [ HALLGATÓ ] ────── (lakcím) ──┬── (irsz)
                   │                           ├── (város)
              (- életkor -)                    └── (utca)
           szaggatott: származtatott         összetett
```

## Miért fontos a fajta?

Mert a táblákká alakításkor mindegyikkel mást kell kezdeni (3. lecke):

- az **összetett** tulajdonságot általában a részeire bontjuk (`irsz`, `varos`, `utca` külön oszlop – így lehet városra keresni),
- a **többértékű** tulajdonság **külön táblába** kerül (egy cellában nem lehet lista),
- a **származtatott** tulajdonságot általában **nem tároljuk**, hanem lekérdezéskor kiszámoljuk (az életkor minden születésnapon változna!),
- a **kulcsból** elsődleges kulcs lesz.

## Egyed vagy tulajdonság?

Gyakori dilemma. Néhány ökölszabály:

- Ha valaminek **saját tulajdonságai** vannak (a tanszéknek neve, épülete, vezetője), legyen **egyed**.
- Ha **több egyed is osztozik** rajta, vagy önmagában is értelmes, legyen egyed.
- Ha csak egyetlen érték, amely egy egyedet ír le (a hallgató születési dátuma), legyen **tulajdonság**.

## Összefoglalás

- Egyed = konkrét dolog; egyedhalmaz = azonos jellegű egyedek (téglalap).
- Tulajdonság (ellipszis): egyszerű / összetett, egyértékű / többértékű (dupla), származtatott (szaggatott), kulcs (aláhúzott).
- A fajta meghatározza, mi lesz belőle a táblákban.

## A lecke feladata

```quiz required
? Mi a „Hallgató” az E-R modellben?
- egyed
+ egyedhalmaz
- kapcsolat
- tulajdonság
! Az azonos jellegű egyedek összessége; Kiss Anna egy egyed.

? Egy személy több nyelven is beszél. Milyen tulajdonság a „beszélt nyelvek”?
- összetett
+ többértékű
- származtatott
- kulcs
! Egy egyednek több értéke lehet: dupla ellipszis.

? Milyen tulajdonság az **életkor**, ha a születési dátum már tárolva van?
- összetett
- többértékű
+ származtatott
- kulcs
! Kiszámítható, ezért szaggatott ellipszis, és általában nem tároljuk.

? Hogyan jelöljük a Chen-féle diagramon a **kulcs** tulajdonságot?
- dupla ellipszissel
- szaggatott ellipszissel
+ aláhúzott névvel
- rombusszal
! A rombusz a kapcsolat jele.

? A „lakcím” irányítószámra, városra és utcára bontható. Milyen tulajdonság?
= összetett
! Részekre bontható tulajdonság.
```
