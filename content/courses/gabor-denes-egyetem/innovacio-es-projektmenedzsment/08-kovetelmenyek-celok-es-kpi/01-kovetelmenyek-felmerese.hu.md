---
title: A projekt követelményeinek felmérése
summary: Funkcionális és nem funkcionális követelmények, feltárási technikák, felhasználói történetek és elfogadási feltételek, MoSCoW-priorizálás és a követelmény-nyomonkövetési mátrix.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- milyen **típusú** követelmények vannak,
- milyen **technikákkal** tárd fel őket az érintettektől,
- hogyan írj jó **felhasználói történetet** és **elfogadási feltételt**,
- hogyan **priorizálj** a MoSCoW-módszerrel.

## Miért fontos?

A sikertelen informatikai projektek egyik leggyakoribb oka a **hiányos vagy félreértett követelmény**. Amit a tervezéskor nem tisztázunk, azt a végén drágán kell átdolgozni (a változtatás költsége nő – 6. témakör).

## Követelménytípusok

| Típus                        | Kérdés                                 | Példa (kurzusregisztrációs rendszer)                   |
| ---------------------------- | -------------------------------------- | ------------------------------------------------------ |
| **üzleti**                   | Miért csináljuk? Mi a szervezet célja? | a regisztrációs időszak adminisztrációja feleződjön    |
| **érintetti (felhasználói)** | Mit akar elérni a felhasználó?         | a hallgató lássa, melyik kurzuson van még hely         |
| **funkcionális**             | Mit **csináljon** a rendszer?          | a rendszer e-mailt küld a sikeres jelentkezésről       |
| **nem funkcionális**         | **Milyen** legyen a rendszer?          | 2000 egyidejű felhasználónál is 2 mp alatt válaszoljon |
| **átmeneti**                 | Mi kell az átálláshoz?                 | a régi adatok átvétele, a felhasználók oktatása        |

A **nem funkcionális** követelmények (minőségi jellemzők) az **ISO/IEC 25010** szabvány szerint pl.: teljesítmény, használhatóság, megbízhatóság, biztonság, karbantarthatóság, hordozhatóság, kompatibilitás.

## Feltárási technikák

- **Interjú** – egy-egy érintettel, mélyebb megértéshez.
- **Workshop** – több érintettel közösen, gyors egyeztetéshez.
- **Kérdőív** – sok emberhez, számszerű adatokhoz.
- **Megfigyelés** (_job shadowing_) – hogyan dolgoznak valójában (nem mindig azt mondják, amit csinálnak).
- **Dokumentumelemzés** – jogszabályok, szabályzatok, a régi rendszer leírása.
- **Prototípus** – „ezt gondoltad?” – a képernyőterv sok félreértést tisztáz.

## Felhasználói történet és elfogadási feltétel

Az agilis projektekben a követelményt **felhasználói történet** (_user story_) formában írjuk:

> **Mint** _hallgató_, **szeretném** _látni a kurzusok szabad helyeinek számát_, **azért, hogy** _még a jelentkezés előtt tudjam, van-e esélyem bejutni._

A jó történet **INVEST** szerinti: **I**ndependent (független), **N**egotiable (megbeszélhető), **V**aluable (értékes), **E**stimable (becsülhető), **S**mall (kicsi), **T**estable (tesztelhető).

A történethez **elfogadási feltételek** tartoznak, gyakran **Given–When–Then** (Adott–Amikor–Akkor) formában:

> **Adott**, hogy a kurzusra 30 fő jelentkezhet, és 28-an jelentkeztek, **amikor** a hallgató megnyitja a kurzuslistát, **akkor** a kurzus mellett a „2 szabad hely” felirat jelenik meg.

## Priorizálás – MoSCoW

Nem fér bele minden az első kiadásba. A **MoSCoW** módszer négy kategóriája:

| Kategória                             | Jelentés                                             |
| ------------------------------------- | ---------------------------------------------------- |
| **M**ust have – kötelező              | nélküle a rendszer használhatatlan vagy jogszerűtlen |
| **S**hould have – fontos              | fontos, de van átmeneti megoldás                     |
| **C**ould have – jó, ha van           | kellemes, ha belefér                                 |
| **W**on't have (this time) – most nem | tudatosan kihagyjuk ebből a kiadásból                |

> Ökölszabály: a ráfordítás legfeljebb kb. **60%-a** menjen a „Must” követelményekre, hogy maradjon tartalék.

## Követelmény-nyomonkövetési mátrix

A **nyomonkövetési mátrix** (_Requirements Traceability Matrix_) minden követelményhez megmutatja a forrását (ki kérte), a tervet, a megvalósító munkacsomagot és a **tesztesetet**. Így ellenőrizhető, hogy minden követelmény elkészült és tesztelve van, és hogy egy változás mely részeket érinti.

## Összefoglalás

- Típusok: üzleti, érintetti, funkcionális, nem funkcionális (ISO 25010), átmeneti.
- Feltárás: interjú, workshop, kérdőív, megfigyelés, dokumentumelemzés, prototípus.
- Felhasználói történet: „Mint …, szeretném …, azért, hogy …”; INVEST; elfogadási feltétel Given–When–Then formában.
- MoSCoW: Must, Should, Could, Won't.
- A nyomonkövetési mátrix a követelményt a tervhez, a megvalósításhoz és a teszthez köti.

## A lecke feladata

```quiz required
? „A rendszer 2000 egyidejű felhasználónál is 2 másodpercen belül válaszoljon.” Milyen követelmény ez?
- funkcionális
+ nem funkcionális
- üzleti
- átmeneti
! Azt írja le, milyen (milyen gyors) legyen a rendszer, nem azt, mit csináljon.

? „A rendszer e-mailt küld a sikeres jelentkezésről.” Milyen követelmény ez?
+ funkcionális
- nem funkcionális
- átmeneti
- üzleti
! Azt írja le, mit csináljon a rendszer.

? A MoSCoW melyik kategóriája jelenti a tudatosan **kihagyott** követelményeket?
- Must
- Should
- Could
+ Won't
! Won't have (this time).

? Az INVEST betűszó „T” betűje szerint milyen legyen a felhasználói történet?
- gyors (Timely)
+ tesztelhető (Testable)
- technikai (Technical)
- teljes (Total)
! Independent, Negotiable, Valuable, Estimable, Small, Testable.

? Melyik feltárási technika a legjobb, ha **sok embertől** szeretnénk **számszerű** adatot?
- interjú
- megfigyelés
+ kérdőív
- prototípus
! A kérdőív olcsón ér el sok embert.
```
