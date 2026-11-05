---
title: Csapatkommunikáció a gyakorlatban
summary: Pszichológiai biztonság, agilis csapatmegbeszélések (napi standup, tervezés, bemutató, retrospektív), hatékony megbeszélések és az aszinkron csapatmunka szabályai.
minutes: 20
---

## Amit ebben a leckében megtanulsz

- mi a **pszichológiai biztonság**, és miért ez a jó csapat alapja,
- az **agilis** csapatmegbeszélések célját,
- hogyan tarts **hatékony megbeszélést**,
- az **aszinkron** csapatmunka szabályait.

## Pszichológiai biztonság

Amy Edmondson definíciója szerint a **pszichológiai biztonság** az a közös meggyőződés, hogy a csapatban **biztonságos kockázatot vállalni**: lehet kérdezni, hibát beismerni, ötletet mondani, ellentmondani – anélkül, hogy megszégyenítenének vagy büntetnének érte.

A Google _Project Aristotle_ kutatása (2012–2015) szerint ez volt a **legfontosabb** tényező, amely megkülönböztette a sikeres csapatokat a többitől.

Hogyan építhető?

- A vezető **beismeri a saját hibáit** és bizonytalanságát.
- A kérdést **megköszönik**, nem kinevetik („Jó, hogy rákérdeztél, más is biztos nem értette.”).
- A hibákból **tanulnak**, nem bűnöst keresnek (a hibáztatásmentes utólagos elemzésről a 18. témakörben lesz szó).
- Mindenki szóhoz jut a megbeszéléseken.

## Agilis csapatmegbeszélések (Scrum)

| Esemény                        | Mikor?                   | Cél                                                             |
| ------------------------------ | ------------------------ | --------------------------------------------------------------- |
| **sprinttervezés**             | a sprint elején          | mit valósítunk meg a következő 1–4 hétben, és hogyan            |
| **napi standup** (daily scrum) | minden nap, max. 15 perc | összehangolódás: haladás a cél felé, akadályok                  |
| **sprintbemutató** (review)    | a sprint végén           | a kész munka bemutatása az érintetteknek, visszajelzés          |
| **retrospektív**               | a sprint végén           | hogyan dolgozzunk jobban: mi ment jól, mi nem, mit változtatunk |

A napi standup **nem állapotjelentés a vezetőnek**, hanem a csapat egymás közötti egyeztetése. A részletes problémamegoldás utána, az érintettekkel külön történik.

Egy egyszerű retrospektív formátum:

```text
Mi ment jól?      | Mi nem ment jól?      | Mit próbálunk ki legközelebb?
------------------|-----------------------|------------------------------
gyors kódátnézés  | későn derült ki a     | a feladatokat a tervezésen
                  | megrendelő igénye     | példákkal pontosítjuk
```

## Hatékony megbeszélés

- **Kell egyáltalán?** Ha egy e-mail vagy egy chatüzenet elég, ne hívj össze megbeszélést.
- **Napirend** előre kiküldve, céllal: „A végén döntünk a tárhelyről.”
- **Csak az érintettek** legyenek ott.
- **Időkeret**, és tartsátok be.
- Valaki **jegyzetel**: döntések, teendők felelőssel és határidővel (lásd 6. témakör).
- A végén **összefoglalás**: mit döntöttünk, ki mit csinál.

> Egy 1 órás megbeszélés 8 résztvevővel 8 munkaórába kerül. Megéri?

## Aszinkron csapatmunka

Távmunkában és időzónák között a csapat nagy része **írásban** kommunikál.

- **Írj teljes üzenetet**: ne csak annyit, hogy „Szia, van egy perced?”, hanem rögtön a kérdést, a kontextust és amit már kipróbáltál.
- **Szálakban** (thread) válaszolj, hogy a csatorna áttekinthető maradjon.
- **Nyilvános csatornában** kérdezz, ne privátban – így más is tanul belőle, és többen tudnak segíteni.
- Állapodjatok meg a **válaszidőben** (pl. chatben a munkanap végéig, e-mailben 1 munkanapon belül), és arról, mi számít **sürgősnek** (és milyen csatornán kell jelezni).
- A döntéseket és a tudást **dokumentáljátok** (wiki, README), ne csak a chatben maradjanak.

## Összefoglalás

- A pszichológiai biztonság a sikeres csapat legfontosabb jellemzője.
- Scrum-események: tervezés, napi standup, bemutató, retrospektív.
- Hatékony megbeszélés: cél, napirend, érintettek, időkeret, jegyzet, összefoglalás.
- Aszinkron munka: teljes üzenet, szálak, nyilvános csatornák, megállapodott válaszidő, dokumentáció.

## A lecke feladata

```quiz required
? Mit jelent a **pszichológiai biztonság**?
- hogy senkit nem lehet elbocsátani
+ hogy a csapatban biztonságos kérdezni, hibát beismerni és ellentmondani
- hogy a csapat irodája biztonságos
- hogy soha nincs konfliktus
! Amy Edmondson definíciója.

? Legfeljebb hány perces a napi standup a Scrum szerint?
= 15
! Rövid, napi összehangolódás.

? Melyik Scrum-esemény célja, hogy a csapat megbeszélje, hogyan dolgozhatna jobban?
- sprinttervezés
- napi standup
- sprintbemutató
+ retrospektív
! Mi ment jól, mi nem, mit változtatunk.

? Melyik a jó aszinkron üzenet?
- „Szia, van egy perced?”
+ „Szia! A tesztkörnyezetben 500-as hibát kapok a /login végponton (napló csatolva). Újraindítottam a szervert, nem segített. Tudod, mi lehet?”
- „Nem működik.”
- „Hívj fel.”
! Teljes üzenet: kérdés, kontextus, amit már kipróbáltál.
```
