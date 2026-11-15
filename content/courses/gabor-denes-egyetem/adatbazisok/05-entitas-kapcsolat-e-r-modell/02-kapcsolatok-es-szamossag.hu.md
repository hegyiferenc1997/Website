---
title: Kapcsolatok és számosság
summary: Kapcsolat és kapcsolattípus, fokszám (unáris, bináris, ternáris), számosság (1:1, 1:N, N:M), kötelező és opcionális részvétel, kapcsolat tulajdonságai, gyenge egyed, valamint a Chen- és a varjúláb-jelölés.
minutes: 22
---

## Amit ebben a leckében megtanulsz

- mi a **kapcsolat**, és hány egyedhalmazt köthet össze,
- mit jelent a **számosság** (1:1, 1:N, N:M) és a **részvétel** (kötelező / opcionális),
- mi a **gyenge egyed**,
- hogyan olvasd a **varjúláb**-jelölést, amelyet a legtöbb tervezőeszköz használ.

## Kapcsolat

A **kapcsolat** egyedek közötti összefüggés: _Kiss Anna **felvette** az Adatbázisokat_. A diagramon **rombusz** jelöli, igével vagy igei kifejezéssel elnevezve.

A kapcsolat **fokszáma** azt mondja meg, hány egyedhalmazt köt össze:

- **unáris** (rekurzív): egy egyedhalmazt önmagával – _egy dolgozó **főnöke** egy másik dolgozó_, _egy tárgy **előfeltétele** egy másik tárgy_,
- **bináris**: kettőt – ez a leggyakoribb (_hallgató – felvesz – tárgy_),
- **ternáris**: hármat – _oktató **tanít** tárgyat teremben_.

## Számosság

A számosság megmondja, egy egyed **legfeljebb hány** másikhoz kapcsolódhat. Mindig **mindkét irányból** kérdezz rá!

| Számosság | Kérdés mindkét irányból                                            | Példa                            |
| --------- | ------------------------------------------------------------------ | -------------------------------- |
| **1 : 1** | Egy A-hoz legfeljebb egy B, és egy B-hez legfeljebb egy A.         | személy – személyi igazolvány    |
| **1 : N** | Egy A-hoz sok B, de egy B-hez legfeljebb egy A.                    | tanszék – oktató                 |
| **N : M** | Egy A-hoz sok B, és egy B-hez is sok A.                            | hallgató – tárgy                 |

Egy trükk az ellenőrzéshez: mondd ki hangosan mindkét mondatot! _„Egy tanszéken **több** oktató dolgozik.” „Egy oktató **egy** tanszéken dolgozik.”_ → 1 : N, a „sok” oldal az oktató.

## Részvétel (kötelező vagy opcionális)

A számosság a **felső** határ, a részvétel az **alsó**: kell-e minden egyednek részt vennie a kapcsolatban?

- **Kötelező** (teljes) részvétel: minden oktatónak **kell** tanszékhez tartoznia.
- **Opcionális** (részleges) részvétel: egy hallgató **lehet**, hogy még egy tárgyat sem vett fel (a mintaadatbázisban Varga Emma ilyen).

Chen-jelölésben a kötelező részvételt **dupla vonal** jelzi.

## A kapcsolatnak is lehet tulajdonsága

A jegy **kié**? Nem a hallgatóé (neki sok jegye van), nem is a tárgyé – a jegy a **felvétel** tényéhez tartozik: _Kiss Anna az Adatbázisokból ötöst kapott._ Ezért a `jegy` a **kapcsolat tulajdonsága**. Tipikusan az N : M kapcsolatoknak van ilyen (dátum, mennyiség, jegy, szerep).

## Gyenge egyed

A **gyenge egyed** nem azonosítható önmagában, csak egy másik (az „erős” vagy tulajdonos) egyeddel együtt. Klasszikus példa: egy épület **termei**. A „101-es terem” több épületben is lehet, csak az **épület + teremszám** együtt egyedi.

- Jelölése: **dupla téglalap**, az azonosító kapcsolat **dupla rombusz**.
- Kulcsa: a tulajdonos kulcsa + a saját **részleges kulcsa** (teremszám).
- Ha a tulajdonos megszűnik (lebontják az épületet), a gyenge egyedek is megszűnnek.

## Chen és varjúláb

A Chen-jelölés jó tanuláshoz, de nagy rendszereknél zsúfolt. A gyakorlatban (pl. dbdiagram, MySQL Workbench, draw.io) a **varjúláb** (_crow's foot_) jelölés terjedt el: az egyedhalmaz egy doboz, benne a tulajdonságok, a kapcsolat pedig egy vonal, amelynek **végein** a jelek mutatják a számosságot.

```text
 Jelek a vonal végén:      ──┼─   pontosan egy (kötelező)
                           ──○┼   nulla vagy egy
                           ──┼<   egy vagy sok (kötelező, sok)
                           ──○<   nulla vagy sok

 ┌──────────┐                       ┌──────────┐
 │ TANSZÉK  │ ──┼───────────────○< │ OKTATÓ   │
 │ id (PK)  │                       │ id (PK)  │
 │ nev      │                       │ nev      │
 └──────────┘                       └──────────┘
 „Egy tanszéknek nulla vagy sok oktatója van; egy oktató pontosan egy tanszékhez tartozik.”
```

Olvasási szabály: a jel a vonal **túlsó** végén mondja meg, hány darab **abból** az egyedből tartozik egy **innenső** egyedhez.

## Összefoglalás

- Kapcsolat (rombusz): unáris, bináris, ternáris.
- Számosság (felső határ): 1:1, 1:N, N:M – mindig mindkét irányból kérdezz rá.
- Részvétel (alsó határ): kötelező vagy opcionális.
- Gyenge egyed: csak a tulajdonosával együtt azonosítható.
- Varjúláb: a vonal végén lévő jelek adják a számosságot.

## A lecke feladata

```quiz required
? Egy dolgozónak legfeljebb egy közvetlen főnöke van, aki szintén dolgozó. Milyen fokszámú ez a kapcsolat?
+ unáris (rekurzív)
- bináris
- ternáris
! Az egyedhalmaz önmagával áll kapcsolatban.

? Egy országnak egy fővárosa van, és egy főváros egy ország fővárosa. Milyen a számosság?
+ 1 : 1
- 1 : N
- N : M
! Mindkét irányból legfeljebb egy.

? Egy szerző több könyvet írhat, egy könyvnek több szerzője is lehet. Milyen a számosság?
- 1 : 1
- 1 : N
+ N : M
! Mindkét irányból sok.

? Hová tartozik a „kölcsönzés dátuma” egy olvasó – kölcsönöz – könyv modellben?
- az olvasóhoz
- a könyvhöz
+ a kölcsönöz kapcsolathoz
! A dátum a kölcsönzés tényét írja le.

? Egy hotelben a szobaszám csak a szállodával együtt egyedi (a „12-es szoba” sok szállodában van). Mi a szoba?
= gyenge egyed
! Csak a tulajdonos (szálloda) kulcsával együtt azonosítható.

? A varjúláb-jelölésben mit jelent a `○<` jel a vonal végén?
- pontosan egy
- nulla vagy egy
- egy vagy sok
+ nulla vagy sok
! A kör = lehet nulla, a varjúláb = sok.
```
