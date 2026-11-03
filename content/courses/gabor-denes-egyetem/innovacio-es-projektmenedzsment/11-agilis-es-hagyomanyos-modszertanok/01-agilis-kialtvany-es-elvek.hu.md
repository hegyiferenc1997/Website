---
title: Az agilis szemlélet – kiáltvány és elvek
summary: Honnan jött az agilis szemlélet, mi az Agilis kiáltvány négy értéke és tizenkét elve, és mit jelent az iteratív, inkrementális fejlesztés?
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen problémára adott választ az **agilis** szemlélet,
- mi az **Agilis kiáltvány** négy értéke,
- melyek a legfontosabb **agilis elvek**,
- mit jelent az **iteratív** és az **inkrementális** fejlesztés.

## Miért született meg?

Az 1990-es években sok szoftverprojekt a hagyományos, előre mindent megtervező módszerrel készült. Gyakori tapasztalat volt, hogy

- mire a rendszer elkészült (évek alatt), a **követelmények már megváltoztak**,
- a megrendelő csak a végén látta az eredményt – és rájött, hogy **nem ezt akarta**,
- a részletes dokumentáció sok időt vitt el, de **gyorsan elavult**.

Válaszként több „könnyűsúlyú” módszer született (Scrum, Extreme Programming, Crystal …), majd **2001 februárjában** 17 szoftverfejlesztő a Utah állambeli Snowbird síközpontban megfogalmazta az **Agilis kiáltványt** (_Manifesto for Agile Software Development_).

## A négy érték

> Értékesnek tartjuk:
>
> - az **egyéneket és a személyes kommunikációt** a módszertanokkal és az eszközökkel szemben,
> - a **működő szoftvert** az átfogó dokumentációval szemben,
> - a **megrendelővel való együttműködést** a szerződéses tárgyalással szemben,
> - a **változásra való reagálást** a terv követésével szemben.
>
> Azaz, annak ellenére, hogy a jobb oldalon szereplő tételek is értékkel bírnak, **a bal oldalon feltüntetetteket többre becsüljük**.

Fontos: a kiáltvány **nem** mondja, hogy nincs szükség dokumentációra vagy tervre – csak azt, hogy a bal oldali tételek fontosabbak.

## A tizenkét elvből néhány

1. Legfontosabb a megrendelő elégedettsége az értékes szoftver **korai és folyamatos** szállításával.
2. Fogadjuk el a **változó követelményeket**, akár a fejlesztés későbbi szakaszában is.
3. Szállíts **működő szoftvert gyakran**, néhány hetente vagy havonta.
4. Az üzleti szakemberek és a fejlesztők **napi szinten együtt dolgoznak**.
5. **Motivált egyénekre** építs; biztosítsd a környezetet és bízz bennük.
6. A leghatékonyabb kommunikáció a **személyes beszélgetés**.
7. A haladás elsődleges mércéje a **működő szoftver**.
8. **Fenntartható ütem**: a csapat tartósan, kiégés nélkül tudjon dolgozni.
9. **Egyszerűség** – a nem elvégzett munka maximalizálása – elengedhetetlen.
10. A legjobb megoldások **önszerveződő csapatoktól** származnak.
11. A csapat **rendszeresen** reflektál a működésére, és **javít** rajta (retrospektív).

## Iteratív és inkrementális fejlesztés

- **Inkrementális**: a terméket **részenként** építjük fel; minden lépés egy újabb használható darabot (inkrementumot) ad hozzá.
- **Iteratív**: rövid, ismétlődő ciklusokban (**iteráció**, a Scrumban **sprint**) dolgozunk, és minden ciklus után a visszajelzés alapján **finomítunk**.

```text
 vízesés:   [ elemzés ][ tervezés ][ fejlesztés ][ teszt ] → érték csak a végén
 agilis:    [sprint 1]→[sprint 2]→[sprint 3]→[sprint 4]   → érték minden sprint után
              ▲ visszajelzés ▲ visszajelzés ▲ visszajelzés
```

Az agilis szemlélet így a **kockázatot korán csökkenti**: ha egy elképzelés rossz, az 2–4 hét után kiderül, nem két év után.

## Összefoglalás

- Az agilis szemlélet a változó követelményekre és a késői visszajelzésre adott válasz.
- Agilis kiáltvány (2001): egyének és kommunikáció, működő szoftver, együttműködés a megrendelővel, reagálás a változásra.
- 12 elv: korai és folyamatos szállítás, változás elfogadása, napi együttműködés, önszerveződés, fenntartható ütem, rendszeres reflexió.
- Iteratív (ismétlődő ciklusok) és inkrementális (részenkénti) fejlesztés.

## A lecke feladata

```quiz required
? Melyik évben fogalmazták meg az Agilis kiáltványt?
= 2001
! 2001 februárjában, Snowbirdben (Utah).

? Hány értéket tartalmaz az Agilis kiáltvány?
= 4
= négy
! És 12 elvet.

? Mit tart az Agilis kiáltvány **többre** a terv követésénél?
- az átfogó dokumentációt
+ a változásra való reagálást
- a szerződéses tárgyalást
- az eszközöket
! „A változásra való reagálást a terv követésével szemben.”

? Mi az agilis elvek szerint a haladás **elsődleges mércéje**?
- a megírt dokumentáció oldalszáma
- a ledolgozott órák száma
+ a működő szoftver
- a megbeszélések száma
! Working software is the primary measure of progress.

? Mit jelent az **inkrementális** fejlesztés?
+ a terméket részenként, egyre bővülő használható darabokban építjük fel
- mindent egyszerre adunk át a projekt végén
- minden fejlesztő más programozási nyelvet használ
- a terméket csak tervezzük, nem építjük meg
! Minden lépés egy újabb használható inkrementumot ad.
```
