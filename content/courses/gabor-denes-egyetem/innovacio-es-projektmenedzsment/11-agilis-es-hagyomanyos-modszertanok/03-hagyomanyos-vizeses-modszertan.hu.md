---
title: Hagyományos (vízesés) módszertanok
summary: A vízesésmodell fázisai és eredete, a V-modell és a tesztszintek, a hagyományos módszer előnyei és hátrányai, és hol használják ma is sikeresen.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- hogyan működik a **vízesésmodell**,
- mi a **V-modell**, és hogyan kapcsolja össze a fejlesztést a teszteléssel,
- mik a hagyományos megközelítés **előnyei** és **hátrányai**.

## A vízesésmodell

A **vízesésmodell** (_waterfall_) fázisai **szigorúan egymás után** következnek, mint a lépcsőkön lezúduló víz: egy fázis csak akkor kezdődik, ha az előző **lezárult és jóváhagyták**.

```text
 Követelmények ─┐
                └► Tervezés ─┐
                             └► Megvalósítás ─┐
                                              └► Tesztelés ─┐
                                                            └► Telepítés ─┐
                                                                          └► Karbantartás
```

Az elnevezés **Winston W. Royce** 1970-es cikkéhez kötődik – ironikus módon Royce maga is jelezte, hogy a tisztán lineáris modell kockázatos, és visszacsatolásokat javasolt.

Jellemzők:

- **részletes előzetes tervezés**: a terjedelem, az ütemterv és a költség az elején rögzül,
- **fázisonkénti dokumentáció** és jóváhagyás (fáziskapuk),
- a megrendelő a **végén** látja a kész terméket,
- a változtatás **drága** és formális változáskezelést igényel.

## A V-modell

A **V-modell** a vízesés továbbfejlesztése: minden fejlesztési fázishoz hozzárendel egy **tesztelési szintet**. A V bal szára a specifikáció és a tervezés, a jobb szára az ellenőrzés.

```text
 Követelményelemzés ──────────────────────────► Elfogadási teszt
     Rendszerterv ────────────────────────► Rendszerteszt
         Architektúraterv ──────────────► Integrációs teszt
             Modulterv ─────────────► Egységteszt (unit)
                       \           /
                        Kódolás
```

Előnye, hogy a teszteket **már a tervezéskor** megtervezik: pl. az elfogadási teszt esetei a követelményelemzés során készülnek. Ezért kedvelt a **biztonságkritikus** területeken (autóipar, vasút, orvostechnika, repülés), ahol a szabványok (pl. ISO 26262) szigorú dokumentálást írnak elő.

## Előnyök és hátrányok

| Előnyök                                       | Hátrányok                                                 |
| --------------------------------------------- | --------------------------------------------------------- |
| egyszerű, könnyen érthető és irányítható      | merev, a változás drága                                   |
| az elején ismert a teljes költség és határidő | a működő termék csak a végén látható – késői visszajelzés |
| jó dokumentáció, könnyű átadni és auditálni   | a hibák (főleg a követelményekben) későn derülnek ki      |
| jól tervezhető erőforrás-igény                | a megrendelőnek az elején mindent tudnia kellene          |
| szerződéses (fix áras) projektekhez kényelmes | a „90%-ban kész” állapot sokáig tarthat                   |

## Mikor jó választás ma is?

- a követelmények **stabilak és jól ismertek** (pl. egy törvény által előírt adatszolgáltatás),
- a változtatás **fizikailag drága vagy lehetetlen** (építőipar, hardvergyártás),
- **szigorú szabályozás** és auditálás (biztonságkritikus rendszerek),
- **fix áras** szerződés, ahol a terjedelmet előre rögzíteni kell.

## Összefoglalás

- Vízesés: szigorúan egymást követő fázisok, részletes előzetes terv, a végén átadás.
- V-modell: minden fejlesztési szinthez egy tesztszint (egység-, integrációs, rendszer-, elfogadási teszt).
- Előny: kiszámíthatóság, dokumentáció; hátrány: merevség, késői visszajelzés.
- Stabil követelményeknél, szabályozott, fizikailag drágán módosítható projekteknél ma is jó választás.

## A lecke feladata

```quiz required
? Mi a vízesésmodell legfőbb jellemzője?
+ a fázisok szigorúan egymás után következnek, mindegyik az előző lezárása után indul
- rövid, ismétlődő sprintekben dolgozik
- nincs benne tervezés
- a megrendelő minden héten új követelményt adhat
! Lineáris, szekvenciális modell.

? A V-modellben melyik tesztszint tartozik a **követelményelemzéshez**?
- egységteszt
- integrációs teszt
- rendszerteszt
+ elfogadási teszt
! A V két végpontja: követelmények ↔ elfogadás.

? A V-modellben melyik tesztszint tartozik a **modultervhez**?
+ egységteszt (unit)
- elfogadási teszt
- rendszerteszt
- integrációs teszt
! A V aljához legközelebbi szint.

? Melyik a vízesésmodell **hátránya**?
- túl kevés a dokumentáció
+ a működő termék csak a végén látható, így a visszajelzés késői
- nem lehet vele költséget becsülni
- csak 15 perces megbeszéléseket enged
! A hibák és félreértések későn derülnek ki.

? Melyik projekthez illik leginkább a hagyományos (vízesés vagy V-modell) megközelítés?
- egy új közösségi mobilapp, ahol még nem tudjuk, mit szeretnek a felhasználók
+ egy autó fékrendszerének vezérlőszoftvere szigorú biztonsági szabvány szerint
- egy startup MVP-je
- egy hackathon-projekt
! Stabil követelmények, szigorú szabályozás és dokumentálás.
```
