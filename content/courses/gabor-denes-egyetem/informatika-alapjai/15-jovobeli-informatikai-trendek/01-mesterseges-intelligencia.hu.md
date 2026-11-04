---
title: Mesterséges intelligencia a vállalatoknál
summary: MI, gépi tanulás, mélytanulás; generatív MI és nyelvi modellek; vállalati felhasználás, MI-ügynökök, kockázatok és az EU MI-rendelete.
minutes: 18
---

## Amit ebben a leckében megtanulsz

- mi a különbség a **mesterséges intelligencia**, a **gépi tanulás** és a **mélytanulás** között,
- hogyan működik nagy vonalakban a **generatív MI** és a **nagy nyelvi modell**,
- mire használják a cégek, és mik a **kockázatok** és **szabályok**.

## Fogalmak

```text
 ┌──────────────────────────────────────────────┐
 │ mesterséges intelligencia (MI)               │  intelligensnek tűnő viselkedés
 │  ┌────────────────────────────────────────┐  │
 │  │ gépi tanulás (ML)                      │  │  szabályok helyett adatból tanul
 │  │  ┌──────────────────────────────────┐  │  │
 │  │  │ mélytanulás (neurális hálózatok) │  │  │  sokrétegű hálók, kép, hang, nyelv
 │  │  │  ┌────────────────────────────┐  │  │  │
 │  │  │  │ generatív MI, nyelvi modell│  │  │  │  új szöveget, képet, kódot hoz létre
 │  │  │  └────────────────────────────┘  │  │  │
 │  │  └──────────────────────────────────┘  │  │
 │  └────────────────────────────────────────┘  │
 └──────────────────────────────────────────────┘
```

A **gépi tanulás** lényege: nem mi írjuk meg a szabályt („ha a levélben szerepel a _nyeremény_ szó, akkor spam”), hanem sok **példából** (címkézett levelekből) a gép maga tanulja meg. Fajtái:

- **felügyelt tanulás**: címkézett példákból (spam / nem spam, ár előrejelzése),
- **felügyelet nélküli**: címke nélkül csoportokat keres (vásárlók szegmentálása),
- **megerősítéses**: próbálkozásból és jutalomból tanul (játékok, robotok).

## Generatív MI és nagy nyelvi modellek

A **nagy nyelvi modell** (LLM – pl. Claude, GPT, Gemini, Llama) hatalmas szövegmennyiségen tanulva azt tanulja meg, hogyan folytatódik egy szöveg. Ebből meglepően sok képesség jön: összefoglalás, fordítás, kódírás, kérdések megválaszolása, érvelés. A **generatív** modellek képet, hangot, videót is készítenek.

Az **MI-ügynökök** (agentek) egy lépéssel tovább mennek: eszközöket használnak (keresés, kódfuttatás, levelezés, céges rendszerek), és több lépésben, önállóan végeznek el feladatokat – például egy hibajegy alapján megkeresik a hibát a kódban, kijavítják és teszttel ellenőrzik.

## Vállalati felhasználás

| Terület            | Példa                                                       |
| ------------------ | ----------------------------------------------------------- |
| ügyfélszolgálat    | MI-asszisztens válaszol a gyakori kérdésekre, éjjel-nappal  |
| szoftverfejlesztés | kódjavaslat, hibakeresés, tesztírás, kódáttekintés          |
| dokumentumok       | szerződések, jelentések összefoglalása, adatkinyerés        |
| előrejelzés        | kereslet, készlet, gépmeghibásodás (prediktív karbantartás) |
| csalásfelderítés   | szokatlan banki tranzakciók kiszűrése                       |
| marketing          | személyre szabott ajánlatok, szövegek, képek                |

## Kockázatok és szabályok

- **Hallucináció**: a modell magabiztosan állíthat valótlant – a fontos eredményt **ellenőrizni** kell.
- **Adatvédelem**: bizalmas céges adatot ne másolj be ellenőrizetlen, nyilvános MI-szolgáltatásba; a cégek ezért vállalati szerződésű vagy saját környezetben futó megoldásokat használnak.
- **Torzítás** (bias): a tanítóadat előítéletei a döntésekben is megjelenhetnek (pl. önéletrajz-szűrés).
- **Szerzői jog és felelősség**: ki felel egy MI által hozott rossz döntésért?

Az **EU MI-rendelete** (AI Act, 2024) kockázati szintek szerint szabályoz: a **tiltott** gyakorlatok (pl. társadalmi pontozás) mellett a **nagy kockázatú** rendszerekre (pl. toborzás, hitelbírálat, oktatási értékelés) szigorú követelmények vonatkoznak; a csevegőrobotoknál jelezni kell, hogy a felhasználó MI-vel beszél.

## Összefoglalás

- MI ⊃ gépi tanulás ⊃ mélytanulás ⊃ generatív MI; a gépi tanulás adatból tanul.
- LLM-ek: szöveg, kód, összefoglalás; MI-ügynökök: eszközhasználat, többlépéses önálló munka.
- Kockázatok: hallucináció, adatvédelem, torzítás; szabály: az EU MI-rendelete kockázati szintekkel.

## A lecke feladata

```quiz required
? Mi a gépi tanulás lényege?
- A programozó minden szabályt kézzel ír meg.
+ A gép példákból (adatokból) tanulja meg a szabályokat.
- A számítógép gyorsabb processzort kap.
- Az adatokat titkosítjuk.
! Szabályok helyett adatok.

? Hogy hívják, amikor egy nyelvi modell magabiztosan valótlant állít?
= hallucináció
= hallucination
! Ezért kell ellenőrizni a fontos eredményeket.

? Melyik tanulási fajta keres csoportokat **címkék nélkül** (pl. vásárlói szegmensek)?
- felügyelt
+ felügyelet nélküli
- megerősítéses
! Unsupervised learning.

? Melyik évben fogadták el az EU MI-rendeletét (AI Act)?
= 2024
! Kockázati szintek szerint szabályoz.
```
