---
title: Fejlesztési modellek
summary: Vízesés, iteratív és agilis fejlesztés, az Agilis kiáltvány, Scrum röviden, DevOps és CI/CD.
minutes: 16
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **vízesésmodell**, és mikor jó,
- mi az **iteratív** és az **agilis** fejlesztés,
- mit jelent a **DevOps** és a **CI/CD**.

## Vízesésmodell

A **vízesés** (waterfall) a fázisokat **szigorúan egymás után** végzi: előbb minden követelmény, aztán minden terv, aztán az egész kód, végül az egész tesztelés.

- **Előny**: átlátható, jól dokumentált, jól tervezhető a költség.
- **Hátrány**: a megrendelő csak a végén látja a terméket; ha közben változik az igény, drága visszalépni.
- **Mikor jó?** Ha a követelmények stabilak és jól ismertek (pl. szabályozott, biztonságkritikus rendszerek egyes részei).

## Iteratív és agilis fejlesztés

Az **iteratív** fejlesztés kis lépésekben halad: minden **iteráció** (pár hét) végén van egy működő, kipróbálható változat, és a visszajelzés alapján folytatják.

Az **agilis** szemléletet a 2001-es **Agilis kiáltvány** fogalmazta meg. Négy értéke:

1. az **egyének és együttműködés** fontosabb a folyamatoknál és eszközöknél,
2. a **működő szoftver** fontosabb az átfogó dokumentációnál,
3. a **megrendelővel való együttműködés** fontosabb a szerződéses tárgyalásnál,
4. a **változásra való reagálás** fontosabb a terv követésénél.

(A jobb oldali dolgok is értékesek, csak a bal oldaliakat többre tartják.)

**Scrum** röviden – a legelterjedtebb agilis keretrendszer (részletesen a projektmenedzsment-témakörben):

```text
 termékteendőlista ─► sprinttervezés ─► SPRINT (1–4 hét, napi 15 perces megbeszélés)
                                          │
                     visszatekintés ◄── sprint-áttekintés (bemutató) ◄─┘
                        └─► következő sprint
```

## DevOps és CI/CD

A **DevOps** a fejlesztés (Dev) és az üzemeltetés (Ops) összekapcsolása: közös felelősség, sok **automatizálás**, gyakori, kis kiadások.

- **CI** (Continuous Integration, folyamatos integráció): minden kódváltozásnál automatikusan lefut a build és a tesztek (pl. GitHub Actions).
- **CD** (Continuous Delivery/Deployment, folyamatos szállítás/telepítés): a tesztelt változat automatikusan kiadható vagy ki is kerül élesbe.

```text
 commit ─► build ─► automatikus tesztek ─► tesztkörnyezet ─► éles rendszer
          └──────────────── CI ─────────┘ └────────── CD ──────────┘
```

Így egy nagy cég naponta akár több száz kisebb frissítést is kiadhat, kis kockázattal.

## Összefoglalás

- Vízesés: szigorúan egymás utáni fázisok; stabil igényeknél jó.
- Agilis: rövid iterációk, működő szoftver, folyamatos visszajelzés (Scrum).
- DevOps: fejlesztés + üzemeltetés; CI/CD: automatikus build, teszt és kiadás.

## A lecke feladata

```quiz required
? Melyik modellben látja a megrendelő a terméket csak a fejlesztés **legvégén**?
+ vízesés
- agilis
- Scrum
- iteratív
! A fázisok szigorúan egymás után jönnek.

? Melyik évben jelent meg az Agilis kiáltvány?
= 2001
! 17 szoftverfejlesztő fogalmazta meg Utah-ban.

? Mit jelent a CI rövidítés?
= Continuous Integration
= folyamatos integráció
! Minden változásnál automatikus build és teszt.

? Az Agilis kiáltvány szerint mi fontosabb az átfogó dokumentációnál?
- a szerződés
+ a működő szoftver
- a terv követése
- az eszközök
! Működő szoftver > átfogó dokumentáció.
```
