---
title: A projekt lezárási folyamatai
summary: Elfogadási teszt és átadás-átvétel, átadás az üzemeltetésnek, szerződészárás, adminisztratív zárás, a csapat elengedése – és mi a teendő, ha egy projektet idő előtt kell leállítani.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- milyen lépésekből áll a projekt **lezárása**,
- hogyan zajlik az **átadás-átvétel** és az **elfogadási teszt**,
- mi a **szerződéses** és az **adminisztratív** zárás,
- mikor és hogyan kell egy projektet **idő előtt lezárni**.

## Miért fontos a lezárás?

Sok projekt „nem ér véget”, csak elhal: a csapat már máson dolgozik, a megrendelő nem írta alá az átvételt, a számlák nyitva maradnak, a tanulságok elvesznek. A tudatos lezárás biztosítja, hogy

- a megrendelő **hivatalosan átvegye** az eredményt,
- a szerződések és a pénzügyek **rendezettek** legyenek,
- a szervezet **tanuljon** a projektből (következő lecke).

## A lezárás lépései

```text
 1. elfogadási teszt → 2. átadás-átvétel → 3. átadás az üzemeltetésnek
   → 4. szerződészárás → 5. adminisztratív zárás → 6. csapat elengedése
   → 7. értékelés, tanulságok → 8. ünneplés
```

### 1–2. Elfogadási teszt és átadás-átvétel

- **Felhasználói elfogadási teszt** (UAT, _User Acceptance Test_): a megrendelő a valós folyamatain ellenőrzi, hogy a rendszer megfelel-e az **elfogadási feltételeknek** (8. témakör).
- A talált hibákat **súlyosság** szerint soroljuk: a kritikusakat az átadás előtt javítani kell, a kisebbek mehetnek egy **hibalistára** későbbi javításra.
- Az átvételt **átadás-átvételi jegyzőkönyv** rögzíti, aláírásokkal (_sign-off_). Ettől kezdve az eredmény **a megrendelőé**.

### 3. Átadás az üzemeltetésnek

Egy informatikai rendszer a projekt után **folyamatos működésbe** kerül (6. témakör: projekt ≠ operáció). Át kell adni:

- az üzemeltetési **dokumentációt** (telepítés, mentés, visszaállítás, felügyelet),
- a **hozzáféréseket** és jelszavakat biztonságos módon,
- a **tudást** (betanítás, „árnyékolás”),
- a **garanciális** és támogatási megállapodást (SLA).

### 4. Szerződészárás

A beszállítói és alvállalkozói szerződések lezárása: a teljesítés igazolása, a végszámlák kifizetése, a nyitott viták rendezése, a garanciák rögzítése.

### 5. Adminisztratív zárás

- a végleges **költségek** és **mutatók** összesítése (CPI, SPI – 9. témakör),
- a projektdokumentáció **archiválása** (hol található, ki férhet hozzá),
- a projektkódok, költséghelyek lezárása, a jogosultságok visszavonása.

### 6. A csapat elengedése

A csapattagok visszatérnek a vonalbeli szervezetbe vagy új projektre mennek. A PM visszajelzést ad a teljesítményükről a közvetlen vezetőjüknek, és **megköszöni** a munkájukat. Az **ünneplés** nem luxus: erősíti a motivációt a következő projektre.

## Idő előtti lezárás

Egy projektet nem csak a cél elérése zárhat le. Idő előtti lezárás (_termination_) okai lehetnek:

- az **üzleti eset** megszűnt (pl. változott a stratégia, egy versenytárs már piacra lépett) – PRINCE2: folyamatos üzleti igazolás,
- a projekt **reménytelenül** túllépte az idő- vagy a költségkeretet,
- a technológia **nem működik** (a Stage-Gate „kill” döntése, 4. témakör),
- jogszabályi változás vagy külső esemény.

> Egy leállított projektet is **rendesen le kell zárni**: dokumentálni a leállítás okát, megmenteni a használható részeredményeket, és levonni a tanulságokat. Az **elsüllyedt költség** (_sunk cost_) – a már elköltött pénz – nem lehet érv a folytatás mellett.

## Összefoglalás

- Lezárás: elfogadási teszt → átadás-átvétel (sign-off) → átadás az üzemeltetésnek → szerződészárás → adminisztratív zárás → csapat elengedése → tanulságok, ünneplés.
- Az átadás-átvételi jegyzőkönyvvel az eredmény a megrendelőé lesz.
- Idő előtti lezárás: megszűnt üzleti eset, reménytelen túllépés, nem működő technológia; az elsüllyedt költség nem érv.

## A lecke feladata

```quiz required
? Mi a felhasználói elfogadási teszt (UAT) célja?
+ a megrendelő ellenőrzi, hogy a rendszer megfelel-e az elfogadási feltételeknek
- a fejlesztők megmérik a kódjuk sebességét
- a projektmenedzser ellenőrzi a költségvetést
- a marketing teszteli a reklámokat
! User Acceptance Test.

? Melyik dokumentum rögzíti, hogy a megrendelő **hivatalosan átvette** az eredményt?
- projekt alapító okirat
+ átadás-átvételi jegyzőkönyv (sign-off)
- kockázatnyilvántartás
- WBS
! Aláírásokkal hitelesített jegyzőkönyv.

? Melyik az **adminisztratív** zárás része?
- a felhasználói elfogadási teszt
+ a projektdokumentáció archiválása és a végleges mutatók összesítése
- a nyitó megbeszélés
- a követelmények felmérése
! Költségek, mutatók, archiválás, jogosultságok.

? Egy projektre eddig 40 millió Ft-ot költöttek, de az üzleti eset megszűnt. Mi a helyes döntés?
- folytatni, mert különben kárba vész a 40 millió
+ leállítani és rendesen lezárni, mert az elköltött pénz (elsüllyedt költség) nem érv a folytatás mellett
- titokban folytatni
- a költségvetést megduplázni
! Csak a jövőbeli költségek és hasznok számítanak a döntésnél.

? Mit **nem** kell átadni az üzemeltetésnek egy informatikai projekt végén?
- üzemeltetési dokumentációt
- hozzáféréseket
- tudást (betanítás)
+ a projektcsapat szabadságolási tervét
! Dokumentáció, hozzáférés, tudás, SLA.
```
