---
title: Projektkommunikáció
summary: A kommunikáció modellje és zajai, a kommunikációs csatornák száma, push, pull és interaktív kommunikáció, a kommunikációs terv, valamint a hatékony megbeszélés és az eszkaláció szabályai.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- miért a **kommunikáció** a projektmenedzser legfontosabb feladata,
- hogyan működik a **kommunikáció modellje**, és mi zavarhatja,
- hogyan számold ki a **kommunikációs csatornák** számát,
- mit tartalmaz egy **kommunikációs terv**.

## Miért ilyen fontos?

Becslések szerint a projektmenedzser munkaidejének kb. **90%-a kommunikáció**: egyeztetés, jelentés, tárgyalás, megbeszélés, e-mail. A PMI felmérései szerint a sikertelen projektek jelentős részében a **rossz kommunikáció** az egyik fő ok.

## A kommunikáció modellje

```text
 Küldő ──► kódolás ──► [ üzenet / csatorna ] ──► dekódolás ──► Fogadó
   ▲                          ▲ zaj                              │
   └─────────────────── visszacsatolás ◄─────────────────────────┘
```

- A **küldő** gondolatait szavakba, ábrába **kódolja**.
- Az üzenet egy **csatornán** (személyesen, e-mailben, videóhívásban …) halad.
- A **zaj** torzíthatja: szakzsargon, nyelvi és kulturális különbség, rossz hangminőség, túl sok információ, érzelmek.
- A **fogadó** dekódolja – a saját tudása és nézőpontja alapján.
- A **visszacsatolás** („Jól értem, hogy …?”) ellenőrzi, hogy a megértés egyezik-e a szándékkal.

> Az üzenetért a **küldő** felel: addig nem kommunikáltunk sikeresen, amíg a fogadó nem értette meg.

## A kommunikációs csatornák száma

Ahány ember, annyi **kétszemélyes kapcsolat** – és ezek száma **gyorsabban nő**, mint a létszám:

> **csatornák száma = n · (n − 1) / 2**

| Létszám (n) | Csatornák |
| ----------- | --------- |
| 3           | 3         |
| 5           | 10        |
| 10          | 45        |
| 20          | 190       |

Ezért nehezebb egy nagy csapatot összehangolni (és ezért késlelteti a késő projektet az új emberek bevonása – Brooks törvénye, 9. témakör).

## A kommunikáció módjai

| Mód                 | Lényeg                                             | Példa                                      |
| ------------------- | -------------------------------------------------- | ------------------------------------------ |
| **interaktív**      | kétirányú, valós idejű                             | megbeszélés, telefon, videóhívás           |
| **push** (küldött)  | a küldő eljuttatja, de nem biztos, hogy elolvassák | e-mail, státuszjelentés, hírlevél          |
| **pull** (lehívott) | a fogadó maga keresi meg, amikor szüksége van rá   | wiki, projektportál, megosztott dokumentum |

Ökölszabály: **bonyolult, érzékeny vagy sürgős** ügyekhez interaktív; **rendszeres tájékoztatáshoz** push; **sok embernek szóló referenciaanyaghoz** pull.

## A kommunikációs terv

A **kommunikációs terv** rögzíti, ki, mit, mikor, hogyan és kitől kap:

| Kinek             | Mit                    | Mikor / milyen gyakran | Hogyan                       | Ki küldi      |
| ----------------- | ---------------------- | ---------------------- | ---------------------------- | ------------- |
| szponzor          | státuszjelentés (RAG)  | kéthetente             | e-mail + 30 perc megbeszélés | PM            |
| irányítóbizottság | mérföldkő-áttekintés   | fáziskapunként         | személyes ülés               | PM            |
| fejlesztőcsapat   | napi egyeztetés        | naponta, 15 perc       | állómegbeszélés              | Scrum Master  |
| felhasználók      | újdonságok, oktatás    | kiadásonként           | hírlevél, wiki               | Product Owner |
| mindenki          | dokumentáció, döntések | folyamatosan           | projektwiki                  | csapat        |

## Hatékony megbeszélés

- legyen **célja** és **napirendje**, amelyet előre kiküldünk,
- csak azok vegyenek részt, akiknek **szükséges**,
- kezdjük és fejezzük be **időben**; legyen egy **moderátor** és egy **jegyzetelő**,
- a végén: **döntések**, **feladatok** (ki, mit, mikorra) – ezeket írásban kiküldjük (emlékeztető).

## Eszkaláció

**Eszkaláció**: ha egy problémát a projekt szintjén nem lehet megoldani, a következő döntési szintre visszük (PM → szponzor → irányítóbizottság). Jó gyakorlat előre rögzíteni az **eszkalációs utat** és a küszöböket (pl. „ha a csúszás meghaladja a 2 hetet”).

## Összefoglalás

- A PM munkaidejének nagy része kommunikáció.
- Modell: küldő → kódolás → csatorna (zaj) → dekódolás → fogadó → visszacsatolás.
- Csatornák száma: n · (n − 1) / 2.
- Interaktív, push és pull kommunikáció.
- Kommunikációs terv: kinek, mit, mikor, hogyan, ki küldi; hatékony megbeszélés; eszkalációs út.

## A lecke feladata

```quiz required
? Hány kommunikációs csatorna van egy **6 fős** csapatban?
= 15
! 6 · 5 / 2.

? Egy csapat 5 főről 8 főre bővül. Hány **új** csatorna jön létre?
= 18
! 8 · 7 / 2 = 28; 5 · 4 / 2 = 10; 28 − 10.

? Melyik **pull** típusú kommunikáció?
- e-mail a szponzornak
- telefonhívás
+ a projektwiki, ahol a dokumentáció bárki számára elérhető
- heti státuszmegbeszélés
! A fogadó maga keresi meg az információt.

? Egy érzékeny, bonyolult konfliktust kell megbeszélni a megrendelővel. Melyik mód a legjobb?
+ interaktív (személyes megbeszélés vagy videóhívás)
- push (e-mail)
- pull (wiki)
- hírlevél
! Kétirányú, valós idejű csatorna kell.

? A kommunikációs modellben mi ellenőrzi, hogy a fogadó jól értette-e az üzenetet?
- a kódolás
- a zaj
+ a visszacsatolás
- a csatorna
! „Jól értem, hogy …?”
```
