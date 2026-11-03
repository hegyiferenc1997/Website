---
title: Összehasonlítás, választás és hibrid megoldások
summary: Az agilis és a hagyományos megközelítés összehasonlítása, a Stacey-mátrix mint választási segédlet, hibrid modellek (Water-Scrum-Fall), és az agilis működés nagyvállalati méretben (SAFe).
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miben **különbözik** pontosan a két megközelítés,
- hogyan **válassz** módszertant egy projekthez,
- mik a **hibrid** megoldások, és hogyan skálázható az agilis működés.

## A két megközelítés egymás mellett

| Szempont           | Hagyományos (vízesés)                     | Agilis (Scrum, Kanban)                   |
| ------------------ | ----------------------------------------- | ---------------------------------------- |
| tervezés           | előre, részletesen                        | folyamatosan, „éppen időben”             |
| rögzített          | **terjedelem**                            | **idő és költség** (sprint, csapat)      |
| változik           | idő és költség                            | **terjedelem**                           |
| szállítás          | egyszer, a végén                          | gyakran, inkrementumokban                |
| megrendelő szerepe | elején (követelmények) és végén (átvétel) | folyamatos, napi együttműködés           |
| dokumentáció       | részletes                                 | „épp elég”                               |
| vezetés            | projektmenedzser irányít                  | önszerveződő csapat, szolgáló vezető     |
| siker mércéje      | a terv teljesítése                        | a leszállított érték                     |
| kockázatkezelés    | előzetes elemzéssel                       | rövid ciklusokkal, korai visszajelzéssel |

> Emlékeztető (6. témakör): a hagyományos megközelítés a **terjedelmet** rögzíti, az agilis megfordítja a vasháromszöget, és az **időt és a költséget** rögzíti.

## Választás: a Stacey-mátrix

**Ralph Stacey** mátrixa két kérdés alapján segít választani:

- **Mennyire ismert és egyértelmű, MIT** kell elkészíteni? (követelmények)
- **Mennyire ismert, HOGYAN** kell elkészíteni? (technológia)

```text
 követelmények
 bizonytalan ▲ ┌───────────────┬───────────────┐
             │ │ bonyolult     │   kaotikus    │
             │ │ (agilis)      │ (gyors kísér- │
             │ │               │   letezés)    │
             │ ├───────────────┼───────────────┤
             │ │   egyszerű    │  bonyolult    │
             │ │ (hagyományos) │  (agilis)     │
 ismert      │ └───────────────┴───────────────┘
             └──────────────────────────────────▶ technológia
               ismert                     bizonytalan
```

- **Egyszerű** (mindkettő ismert) → hagyományos tervezés működik.
- **Bonyolult / összetett** (az egyik vagy mindkettő bizonytalan) → agilis, iteratív megközelítés.
- **Kaotikus** (semmi sem ismert) → gyors kísérletek, prototípusok (Lean Startup, 3. témakör).

További szempontok: a megrendelő **elérhetősége**, a szerződés típusa (fix áras vagy idő- és anyagalapú), a **szabályozás**, a csapat tapasztalata és mérete.

## Hibrid megoldások

A gyakorlatban sok szervezet **ötvözi** a kettőt:

- **Water-Scrum-Fall**: a projekt eleje (üzleti eset, költségkeret, magas szintű terv) és vége (átadás, üzembe helyezés) hagyományos, a fejlesztés Scrum-sprintekben folyik.
- **Agilis fejlesztés, hagyományos mérföldkövek**: a vezetésnek fix mérföldkövekről és költségkeretről jelentünk, de a csapat sprintekben dolgozik.
- **Scrumban**: a Scrum szerepei és eseményei Kanban-táblával és WIP-limitekkel.
- **PRINCE2 Agile**: a PRINCE2 irányítási kerete agilis szállítással.

## Agilis nagyvállalati méretben

Egy Scrum csapat legfeljebb kb. 10 fős. Ha egy termékhez sok csapat kell, **skálázott** keretrendszert használnak:

- **SAFe** (_Scaled Agile Framework_): több csapat (egy „Agile Release Train”) közös, kb. 8–12 hetes **programnövekmény** (PI) tervezéssel,
- **LeSS** (_Large-Scale Scrum_): egy termék-backlog, egy Product Owner, több csapat,
- **Scrum of Scrums**: a csapatok képviselői rendszeresen egyeztetnek.

## Összefoglalás

- Hagyományos: rögzített terjedelem, előzetes terv, átadás a végén; agilis: rögzített idő és költség, változó terjedelem, gyakori szállítás.
- Stacey-mátrix: ismert követelmény + ismert technológia → hagyományos; bizonytalanság → agilis; káosz → kísérletezés.
- Hibrid: Water-Scrum-Fall, Scrumban, PRINCE2 Agile.
- Skálázás: SAFe, LeSS, Scrum of Scrums.

## A lecke feladata

```quiz required
? A Stacey-mátrix szerint melyik megközelítés illik egy projekthez, ahol a követelmények **és** a technológia is jól ismert?
+ hagyományos (tervezés alapú)
- agilis
- gyors kísérletezés
- egyik sem
! Egyszerű terület: a terv megbízhatóan elkészíthető.

? Melyik vasháromszög-elem **változik** jellemzően egy agilis projektben?
- idő
- költség
+ terjedelem
- egyik sem
! Az idő (sprint) és a költség (csapat) rögzített.

? Mit jelent a **Water-Scrum-Fall** hibrid modell?
+ a projekt eleje és vége hagyományos, a fejlesztés Scrum-sprintekben folyik
- a vízesés minden fázisát kétszer végezzük el
- a Scrumot csak a tesztelésnél használjuk
- a csapat felváltva dolgozik vízesésben és Kanbanban, hetente váltva
! Gyakori nagyvállalati gyakorlat.

? Melyik keretrendszer szolgál az agilis működés **nagyvállalati skálázására**?
- MoSCoW
+ SAFe
- SMART
- TELOS
! Scaled Agile Framework.

? Melyik állítás igaz az agilis megközelítésre?
- a megrendelő csak a projekt végén látja az eredményt
+ a megrendelő folyamatosan együttműködik a csapattal, és gyakran kap működő inkrementumot
- nincs benne semmilyen tervezés
- csak egyetlen nagy átadás van
! Folyamatos együttműködés és gyakori szállítás.
```
