---
title: Változáskezelés
summary: Projektváltozások kezelése (változáskérés, változásbizottság, terjedelem-kúszás, aranyozás), konfigurációkezelés és verziókezelés, valamint a szervezeti változás modelljei – Lewin, Kotter és ADKAR.
minutes: 25
---

## Amit ebben a leckében megtanulsz

- hogyan kezeld a projekt **változásait** (változáskérés, CCB),
- mi a **terjedelem-kúszás** és az **aranyozás**,
- mi a **konfigurációkezelés**,
- hogyan vezess végig egy **szervezeti változást** (Lewin, Kotter, ADKAR).

## A „változáskezelés” két jelentése

1. **Projektváltozás-kezelés** (_change control_): a projekt alaptervét (terjedelem, ütem, költség) érintő módosítások szabályozott kezelése.
2. **Szervezeti változásmenedzsment** (_change management_): az **emberek** átvezetése a régi működésből az újba – hogy az új rendszert valóban használják.

## Projektváltozás-kezelés

A 9. témakörben látott **integrált változáskezelés** lépései: rögzítés → hatáselemzés → döntés (CCB) → alapterv frissítése → tájékoztatás → megvalósítás követése.

A **változáskérő lap** tipikus tartalma: kérelmező, leírás, indoklás, prioritás, **hatás** a terjedelemre, ütemre, költségre, minőségre és kockázatra, döntés és dátum.

### Két veszélyes jelenség

- **Terjedelem-kúszás** (_scope creep_): a terjedelem **apránként, jóváhagyás nélkül** bővül („Ugye ezt még bele tudjátok tenni?”). Az idő és a költség nem nő vele, ezért a projekt csúszik vagy a minőség romlik.
- **Aranyozás** (_gold plating_): a **csapat** maga tesz bele olyan extrát, amit senki sem kért („Szép lenne még egy animáció”). Időt visz el, és új hibákat hozhat.

> Mindkettő ellen a **jóváhagyott terjedelem**, a **változáskérő folyamat** és a **„nem”** kimondásának bátorsága véd. Agilis projektben az új igény a **termék-backlogba** kerül, és a Product Owner priorizálja.

## Konfigurációkezelés

A **konfigurációkezelés** biztosítja, hogy mindig tudjuk, a projekt termékeinek (kód, dokumentáció, beállítások) **melyik változata érvényes**, és hogyan jutottunk el hozzá.

- **verziókezelő rendszer** (pl. **Git**): minden módosítás visszakövethető, ki, mikor, mit és miért változtatott,
- **ágak** (_branch_) és **beolvasztási kérések** (_pull request_) kódátnézéssel,
- **kiadási címkék** (_tag_, pl. v1.2.0) és **szemantikus verziószámozás** (FŐ.MELLÉK.JAVÍTÁS),
- az infrastruktúra is kódként (_Infrastructure as Code_).

## Szervezeti változás: Lewin modellje

**Kurt Lewin** háromlépéses modellje (1947):

1. **Kiolvasztás** (_unfreeze_) – a változás szükségességének megértetése, a régi megszokások fellazítása.
2. **Változtatás** (_change_) – az új működés bevezetése, képzés, támogatás.
3. **Újrafagyasztás** (_refreeze_) – az új működés rögzítése (szabályzatok, ösztönzők), hogy ne csússzunk vissza.

## Kotter nyolc lépése

**John Kotter** (1996) a sikertelen változások tanulságaiból nyolc lépést írt le:

1. a **sürgősség** érzésének megteremtése,
2. **irányító koalíció** létrehozása,
3. **jövőkép** és stratégia kialakítása,
4. a jövőkép **kommunikálása**,
5. az akadályok elhárítása, az emberek **felhatalmazása**,
6. **gyors sikerek** elérése,
7. az eredmények megszilárdítása, **további változás**,
8. az új megközelítés **beágyazása** a kultúrába.

## ADKAR

A **Prosci ADKAR**-modellje az **egyén** szintjén írja le a változást, öt egymásra épülő lépésben:

| Betű  | Jelentés                      | Kérdés                                       |
| ----- | ----------------------------- | -------------------------------------------- |
| **A** | _Awareness_ – tudatosság      | Tudom, **miért** kell változni?              |
| **D** | _Desire_ – szándék            | **Akarok** részt venni benne?                |
| **K** | _Knowledge_ – tudás           | Tudom, **hogyan** kell?                      |
| **A** | _Ability_ – képesség          | **Képes** vagyok a gyakorlatban is csinálni? |
| **R** | _Reinforcement_ – megerősítés | Mi **tart meg** az új működésnél?            |

> Ha egy felhasználó nem használja az új rendszert, az ADKAR segít megtalálni, **hol akadt el**: nem tudja, miért (A)? Nem akarja (D)? Nem tanították meg (K)? Nincs ideje gyakorolni (A)? Senki sem ellenőrzi, és visszatér a régihez (R)?

## Összefoglalás

- Projektváltozás-kezelés: változáskérő lap, hatáselemzés, CCB, alapterv frissítése.
- Terjedelem-kúszás: jóváhagyás nélküli bővülés; aranyozás: a csapat által hozzáadott, nem kért extra.
- Konfigurációkezelés: verziókezelés (Git), ágak, kiadási címkék.
- Lewin: kiolvasztás → változtatás → újrafagyasztás; Kotter 8 lépése; ADKAR: Awareness, Desire, Knowledge, Ability, Reinforcement.

## A lecke feladata

```quiz required
? A megrendelő a projekt közben szóban, apránként új funkciókat kér, amelyeket a csapat jóváhagyás nélkül beépít. Hogy hívják ezt?
+ terjedelem-kúszás (scope creep)
- aranyozás (gold plating)
- fast-tracking
- konfigurációkezelés
! A terjedelem jóváhagyás nélkül bővül.

? A fejlesztő a saját ötletéből, kérés nélkül animációkat tesz a felületre. Hogy hívják ezt?
- terjedelem-kúszás
+ aranyozás (gold plating)
- crashing
- eszkaláció
! Nem kért extra a csapattól.

? Melyik a Lewin-modell **harmadik** lépése?
- kiolvasztás
- változtatás
+ újrafagyasztás
! Az új működés rögzítése.

? Mit jelent az ADKAR **K** betűje?
- Kontroll
+ Knowledge – tudás (tudom, hogyan kell)
- Kommunikáció
- Költség
! Awareness, Desire, Knowledge, Ability, Reinforcement.

? Hány lépésből áll Kotter változásmenedzsment-modellje?
= 8
= nyolc
! A sürgősségtől a kultúrába ágyazásig.

? Melyik eszköz a **konfigurációkezelés** része egy szoftverprojektben?
+ verziókezelő rendszer (pl. Git)
- Gantt-diagram
- hatalom–érdek mátrix
- SWOT
! Visszakövethető, hogy melyik változat érvényes.
```
